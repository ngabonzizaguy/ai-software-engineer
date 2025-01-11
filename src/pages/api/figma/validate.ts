import { NextApiRequest, NextApiResponse } from 'next';
import { FigmaClient } from '@/api/figma/FigmaClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const apiKey = req.headers['x-figma-token'];

    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(401).json({ message: 'API key is required' });
    }

    // Try to make a simple request to validate the API key
    const figma = new FigmaClient(apiKey);
    // Use a test file ID to validate the API key
    await figma.getFile('test'); // This will fail with invalid API key but that's what we want

    return res.status(200).json({ valid: true });
  } catch (error: unknown) {
    // If we get a 404, the API key is valid but the file doesn't exist
    // If we get a 403, the API key is invalid
    const errorMessage = error instanceof Error ? error.message : 'Invalid API key';
    const isAuthError = errorMessage.includes('403') || errorMessage.toLowerCase().includes('unauthorized');
    
    if (isAuthError) {
      return res.status(401).json({ message: 'Invalid API key' });
    }
    
    // If we get here, the API key is valid but the file doesn't exist
    return res.status(200).json({ valid: true });
  }
} 