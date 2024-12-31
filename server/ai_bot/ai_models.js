const { AzureChatOpenAI, AzureOpenAIEmbeddings } = require("@langchain/openai");

const AZURE_OPENAI_API_INSTANCE_NAME = "openai-red-eastus2-01-pre-prod";
const LLM_DEPLOYMENT_NAME = "model-chat-completetion-gpt-4o-mini-pre-prod";
const EMBED_DEPLOYMENT_NAME = "model-embeddings-text-embedding-3-large-pre-prod"
const AZURE_OPENAI_API_KEY = "7c159721e8c149348c5fba2ac077e155";
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