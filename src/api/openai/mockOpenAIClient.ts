export class MockOpenAIClient {
  private mockResponses = {
    greeting: "Hello! I'm a mock AI assistant. How can I help you today?",
    design: "Based on the design principles, I suggest focusing on simplicity and user experience.",
    code: "Here's a mock code suggestion:\n```js\nconst example = () => {\n  console.log('Hello!');\n};\n```",
    error: "I apologize, but I couldn't process that request."
  };

  async generateText(prompt: string) {
    console.log('Mock OpenAI received prompt:', prompt);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple prompt matching
    if (prompt.toLowerCase().includes('hello')) {
      return this.mockResponses.greeting;
    }
    if (prompt.toLowerCase().includes('design')) {
      return this.mockResponses.design;
    }
    if (prompt.toLowerCase().includes('code')) {
      return this.mockResponses.code;
    }

    return this.mockResponses.error;
  }
} 