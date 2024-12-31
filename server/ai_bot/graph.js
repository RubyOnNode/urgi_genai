// src/langchainGraph.js  
const { z } = require("zod");
const { tool } = require("@langchain/core/tools");
const {
  AIMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} = require("@langchain/core/messages");
const { MessagesAnnotation } = require("@langchain/langgraph");
const { ToolNode } = require("@langchain/langgraph/prebuilt");
const { StateGraph } = require("@langchain/langgraph");
const { toolsCondition } = require("@langchain/langgraph/prebuilt");
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");
const NodeCache = require('node-cache');
const { embedding_model, llm } = require("./ai_models");
const { database } = require("./config/db");
require('dotenv').config();

// Cache for vector stores per fileid  
const vectorStoreCache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL  

/**  
 * Retrieves or initializes a vector store for a given fileid.  
 * @param {string} fileid  
 * @returns {MongoDBAtlasVectorSearch}  
 */
async function getVectorStore(fileid) {
  let vectorStore = vectorStoreCache.get(fileid);
  if (!vectorStore) {
    const collectionName = `vectors_${fileid}`;
    const collection = database.collection(collectionName);

    // Ensure the index exists  
    await collection.createIndex({ embedding: "2dsphere" }, { name: "vector_index" });

    vectorStore = new MongoDBAtlasVectorSearch(embedding_model, {
      collection: collection,
      indexName: "vector_index",
      textKey: "text",
      embeddingKey: "embedding",
    });

    vectorStoreCache.set(fileid, vectorStore);
  }
  return vectorStore;
}

// Define the schema to include both query and fileid  
const retrieveSchema = z.object({
  query: z.string(),
  fileid: z.string(),
});

const retrieve = tool(
  async ({ query, fileid }) => {
    const vectorStore = await getVectorStore(fileid);
    const retrievedDocs = await vectorStore.similaritySearch(query, 2);
    const serialized = retrievedDocs
      .map(
        (doc) => `Page Number: ${doc.metadata.loc.pageNumber}\nContent: ${doc.pageContent}`
      )
      .join("\n");
    return [serialized, retrievedDocs];
  },
  {
    name: "retrieve",
    description: "Retrieve information related to a query and fileid.",
    schema: retrieveSchema,
    responseFormat: "content_and_artifact",
  }
);

// Update the graph functions to accept fileid from state  
async function queryOrRespond(state) {
  const { fileid } = state; // Extract fileid from state  
  const llmWithTools = llm.bindTools([retrieve]);
  const messagesWithFileid = state.messages.map(msg => {
    if (msg instanceof HumanMessage) {
      // Attach fileid to the user's message  
      return new HumanMessage(msg.text, { fileid });
    }
    return msg;
  });
  const response = await llmWithTools.invoke(messagesWithFileid);
  return { messages: [response], fileid };
}

const tools = new ToolNode([retrieve]);

async function generate(state) {
  const { fileid } = state; // Preserve fileid  
  // Get generated ToolMessages  
  let recentToolMessages = [];
  for (let i = state["messages"].length - 1; i >= 0; i--) {
    let message = state["messages"][i];
    if (message instanceof ToolMessage) {
      recentToolMessages.push(message);
    } else {
      break;
    }
  }
  let toolMessages = recentToolMessages.reverse();

  // Format into prompt  
  const docsContent = toolMessages.map((doc) => doc.content).join("\n");
  const systemMessageContent =
    "You are an assistant for question-answering tasks. " +
    "Use the following pieces of retrieved context to answer " +
    "the question. If you don't know the answer, say that you " +
    "don't know. Use three sentences maximum and keep the " +
    "answer concise." +
    "\n\n" +
    `${docsContent}`;

  const conversationMessages = state.messages.filter(
    (message) =>
      message instanceof HumanMessage ||
      message instanceof SystemMessage ||
      (message instanceof AIMessage && message.tool_calls.length === 0)
  );
  const prompt = [
    new SystemMessage(systemMessageContent),
    ...conversationMessages,
  ];

  // Run  
  const response = await llm.invoke(prompt);
  return { messages: [response], fileid };
}

const graphBuilder = new StateGraph(MessagesAnnotation)
  .addNode("queryOrRespond", queryOrRespond)
  .addNode("tools", tools)
  .addNode("generate", generate)
  .addEdge("__start__", "queryOrRespond")
  .addConditionalEdges("queryOrRespond", toolsCondition, {
    __end__: "__end__",
    tools: "tools",
  })
  .addEdge("tools", "generate")
  .addEdge("generate", "__end__");

const graph = graphBuilder.compile();

module.exports = {
  graph,
};  