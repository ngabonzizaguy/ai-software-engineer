import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env file
config({ path: join(process.cwd(), '.env') });

export const apiConfig = {
  figma: {
    apiKey: process.env.FIGMA_API_KEY || '',
    baseUrl: 'https://api.figma.com/v1'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    baseUrl: 'https://api.openai.com/v1'
  }
}; 