const { AzureChatOpenAI, AzureOpenAIEmbeddings } = require("@langchain/openai");

const AZURE_OPENAI_API_INSTANCE_NAME = "";
const LLM_DEPLOYMENT_NAME = "";
const EMBED_DEPLOYMENT_NAME = ""
const AZURE_OPENAI_API_KEY = "";
const AZURE_OPENAI_API_VERSION = "2023-03-15-preview";


const llm = new AzureChatOpenAI({
  azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
  azureOpenAIApiInstanceName: AZURE_OPENAI_API_INSTANCE_NAME,
  azureOpenAIApiDeploymentName: LLM_DEPLOYMENT_NAME,
  azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
});


const embed_model = new AzureOpenAIEmbeddings({
  azureOpenAIApiDeploymentName: EMBED_DEPLOYMENT_NAME,
  azureOpenAIApiInstanceName: AZURE_OPENAI_API_INSTANCE_NAME,
  azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
  azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
});

module.exports = {
  llm,
  embed_model
}
