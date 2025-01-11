import { NextApiRequest, NextApiResponse } from 'next';
import { FigmaClient } from '@/api/figma/FigmaClient';

interface DesignToken {
  id: string;
  name: string;
  type: string;
  path: string[];
  value: any;
  isComponent?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { fileId } = req.body;
    const apiKey = req.headers['x-figma-token'];

    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(401).json({ message: 'Figma API key is required. Please add it in settings.' });
    }

    if (!fileId) {
      return res.status(400).json({ message: 'File ID is required' });
    }

    const figma = new FigmaClient(apiKey);
    const file = await figma.getFile(fileId);

    // Extract design tokens from the file
    const tokens = await extractDesignTokens(file);

    return res.status(200).json(tokens);
  } catch (error: unknown) {
    console.error('Error extracting tokens:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to extract tokens' 
    });
  }
}

async function extractDesignTokens(file: any): Promise<DesignToken[]> {
  const tokens: DesignToken[] = [];

  // Process the document recursively
  function processNode(node: any, path: string[] = []) {
    // Extract color styles
    if (node.styles) {
      Object.entries(node.styles).forEach(([key, style]: [string, any]) => {
        if (style && style.id && style.name) {
          tokens.push({
            id: style.id,
            name: style.name,
            type: style.type ? style.type.toLowerCase() : key.toLowerCase(),
            path,
            value: style.description || ''
          });
        }
      });
    }

    // Extract component tokens
    if (node.type === 'COMPONENT') {
      tokens.push({
        id: node.id,
        name: node.name || '',
        type: 'component',
        path,
        isComponent: true,
        value: {
          id: node.id,
          name: node.name || '',
          key: node.key || '',
          remote: false,
          styles: {
            layout: {
              layoutMode: node.layoutMode || 'NONE',
              layoutConstraint: node.constraints || {}
            }
          }
        }
      });
    }

    // Process children recursively
    if (node.children) {
      node.children.forEach((child: any) => {
        processNode(child, [...path, node.name || '']);
      });
    }
  }

  processNode(file.document);
  return tokens;
} 