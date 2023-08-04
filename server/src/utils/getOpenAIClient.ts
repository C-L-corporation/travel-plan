import { Configuration, OpenAIApi } from 'openai';
import dontenv from 'dotenv';
import { accessGCSecret } from '.';

dontenv.config();

const { NODE_ENV, CHATGPT_API_KEY } = process.env;

const getChatGPTKey = async (): Promise<string> => {
  if (NODE_ENV === 'development') {
    if (!CHATGPT_API_KEY) throw new Error('CHATGPT_API_KEY is not defined');
    return CHATGPT_API_KEY;
  } else {
    const chatGPTKey = await accessGCSecret('CHATGPT_API_KEY');
    return chatGPTKey;
  }
};

export const getOpenAIClient = async (): Promise<OpenAIApi> => {
  const chatGPTKey = await getChatGPTKey();
  const configuration = new Configuration({
    apiKey: chatGPTKey,
  });
  const openai = new OpenAIApi(configuration);
  return openai;
};
