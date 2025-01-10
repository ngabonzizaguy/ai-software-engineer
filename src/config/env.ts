export function validateEnv() {
  const required = ['FIGMA_API_KEY'];
  
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(
        `Missing required environment variable: ${key}. Please check your .env file or follow the Figma API documentation to generate a token.`
      );
    }
  }
} 