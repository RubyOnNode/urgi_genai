const { AzureChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");

const model = new AzureChatOpenAI({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
});

const aiBot = async (query) => {
  try {
    const messages = [
      new SystemMessage("Answer the user Query"),
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