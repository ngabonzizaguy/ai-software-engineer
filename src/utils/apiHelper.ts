import { apiConfig } from '../config/apiConfig.js';

export function validateApiConfig() {
  if (!apiConfig.figma.apiKey) {
    throw new Error('Figma API key is required. Please set FIGMA_API_KEY in your .env file.');
  }
  
  if (!apiConfig.openai.apiKey) {
    throw new Error('OpenAI API key is required. Please set OPENAI_API_KEY in your .env file.');
  }
}

export function getFigmaConfig() {
  return apiConfig.figma;
}

export function getOpenAIConfig() {
  return apiConfig.openai;
}

export const getAPICredentials = (service: 'figma' | 'openai') => {
  return {
    key: process.env[`${service.toUpperCase()}_API_KEY`] || '',
    url: process.env[`${service.toUpperCase()}_API_URL`] || ''
  };
}; 