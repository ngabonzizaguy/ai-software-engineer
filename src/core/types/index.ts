export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface APIConfig {
  baseUrl: string;
  timeout: number;
}

export interface UserContext {
  id: string;
  preferences: Record<string, any>;
}

// Example usage:
// import { AIResponse, APIConfig } from '@/core/types'; 