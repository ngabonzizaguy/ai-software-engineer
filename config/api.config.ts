interface APIConfig {
  figma: {
    apiKey: string;
  };
  openai: {
    apiKey: string;
  };
}

export const apiConfig: APIConfig = {
  figma: {
    apiKey: process.env.FIGMA_API_KEY || '',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
};