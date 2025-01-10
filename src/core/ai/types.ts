export interface AIServiceConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIRequestOptions {
  context?: string;
  language?: string;
  format?: 'code' | 'text' | 'json';
} 