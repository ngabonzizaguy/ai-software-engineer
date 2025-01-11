import { NextApiRequest, NextApiResponse } from 'next';
import { CodeGenerator } from '@/features/codeGeneration/CodeGenerator';
import type { DesignToken } from '@/types/tokens';
import type { CodeGenerationOptions } from '@/features/codeGeneration/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { tokens, options } = req.body;

    if (!tokens || !Array.isArray(tokens)) {
      return res.status(400).json({ message: 'Tokens array is required' });
    }

    if (!options) {
      return res.status(400).json({ message: 'Code generation options are required' });
    }

    const generator = new CodeGenerator(options as CodeGenerationOptions);
    const generatedCode = await generator.generateFromTokens(tokens as DesignToken[]);

    return res.status(200).json(generatedCode);
  } catch (error) {
    console.error('Error generating code:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to generate code' 
    });
  }
} 