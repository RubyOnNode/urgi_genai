const { AzureChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");

const model = new AzureChatOpenAI({
  azureOpenAIApiKey: "7c159721e8c149348c5fba2ac077e155",
  azureOpenAIApiInstanceName: "openai-red-eastus2-01-pre-prod",
  azureOpenAIApiDeploymentName: "model-chat-completetion-gpt-4o-mini-pre-prod",
  azureOpenAIApiVersion: "2023-03-15-preview",
});

const aiBot = async (query) => {
  try {
    const messages = [
      new SystemMessage("Be a Helpful assistant and answer the query"),
      new HumanMessage(query),
    ];

    const response = await model.invoke(messages);
    return response.content;
  } catch (error) {
    throw new Error("Error invoking the model:");
  }
};

module.exports = {
  aiBot,
};