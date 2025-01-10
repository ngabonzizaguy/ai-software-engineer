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

  try {
    const figma = new FigmaClient(process.env.FIGMA_API_KEY!);
    const fileData = await figma.getFile(fileId);
    
    const extractor = new DesignTokenExtractor();
    const tokens = extractor.extract(fileData.document);

    return res.status(200).json({ tokens });
  } catch (error) {
    console.error('Token extraction error:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to extract tokens' 
    });
  }
} 