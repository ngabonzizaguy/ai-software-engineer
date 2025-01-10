import { APIErrorResponse, APIResponse } from './types';

interface APIConfig {
  figma: {
    apiKey?: string;
  };
  openai: {
    apiKey?: string;
  };
}

export const createAPIResponse = <T>(data: T): APIResponse<T> => ({
  data,
  status: 200,
  success: true,
});

export const createErrorResponse = (error: Error): APIErrorResponse => ({
  code: 'ERROR',
  message: error.message,
  details: error instanceof Error ? { stack: error.stack } : undefined,
});

export function validateCredentials(config: APIConfig) {
  const missingCredentials: string[] = [];

  if (!config.figma.apiKey) {
    missingCredentials.push('Figma API key');
  }
  if (!config.openai.apiKey) {
    missingCredentials.push('OpenAI API key');
  }

  if (missingCredentials.length > 0) {
    throw new Error(
      `Missing required credentials: ${missingCredentials.join(', ')}. ` +
      'Please add them to your environment configuration.'
    );
  }
} 