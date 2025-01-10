import { AIResponse } from '../../types';

export const isAIResponse = (value: unknown): value is AIResponse => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof (value as AIResponse).success === 'boolean'
  );
};

export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
}; 