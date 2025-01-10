export interface APIResponse<T = any> {
  data: T;
  status: number;
  success: boolean;
  error?: string;
}

export interface APIErrorResponse {
  code: string;
  message: string;
  details?: Record<string, any>;
} 