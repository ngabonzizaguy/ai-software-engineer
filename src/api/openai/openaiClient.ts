import OpenAI from 'openai';

export class OpenAIClient {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generateText(prompt: string) {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`OpenAI API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 