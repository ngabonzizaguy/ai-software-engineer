import { FigmaClient } from './figma/FigmaClient.js';
import { OpenAIClient } from './openai/openaiClient.js';
import { MockOpenAIClient } from './openai/mockOpenAIClient.js';
import { getAPICredentials } from '../utils/apiHelper.js';

export const initializeAPIClients = () => {
  const figmaCredentials = getAPICredentials('figma');
  
  // Use mock in development
  const openai = process.env.NODE_ENV === 'production' 
    ? new OpenAIClient(process.env.OPENAI_API_KEY!)
    : new MockOpenAIClient();

  return {
    figma: new FigmaClient(figmaCredentials.key),
    openai
  };
}; 