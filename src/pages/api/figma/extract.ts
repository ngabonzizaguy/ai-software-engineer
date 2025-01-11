import { NextApiRequest, NextApiResponse } from 'next';
import { FigmaClient } from '@/api/figma/FigmaClient';
import { DesignTokenExtractor } from '@/features/designTokens/tokenExtractor';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fileId } = req.query;

  if (!fileId || typeof fileId !== 'string') {
    return res.status(400).json({ message: 'File ID is required' });
  }

  // Enable streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // Send initial progress
    sendEvent({ progress: 0 });

    // Get Figma file data
    const figma = new FigmaClient(process.env.FIGMA_API_KEY!);
    sendEvent({ progress: 20 });
    
    const fileData = await figma.getFile(fileId);
    sendEvent({ progress: 40 });
    
    // Initialize extractor
    const extractor = new DesignTokenExtractor();
    sendEvent({ progress: 60 });
    
    // Extract tokens
    const tokens = extractor.extract(fileData.document);
    sendEvent({ progress: 80 });

    // Send final data
    sendEvent({ tokens, progress: 100 });
    res.end();
  } catch (error) {
    console.error('Token extraction error:', error);
    sendEvent({ 
      error: error instanceof Error ? error.message : 'Failed to extract tokens',
      progress: 100
    });
    res.end();
  }
} 