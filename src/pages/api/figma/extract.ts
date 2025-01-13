import { NextApiRequest, NextApiResponse } from 'next';
import { DesignTokenExtractor } from '@/features/designTokens/tokenExtractor';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { fileId } = req.body;
    const apiKey = req.headers['x-figma-token'];

    if (!fileId) {
      return res.status(400).json({ message: 'File ID is required' });
    }

    if (!apiKey) {
      return res.status(401).json({ message: 'Figma API key is required' });
    }

    // Fetch file data from Figma API
    const response = await fetch(
      `https://api.figma.com/v1/files/${fileId}`,
      {
        headers: {
          'X-Figma-Token': apiKey as string,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({
        message: error.message || 'Failed to fetch Figma file',
      });
    }

    const data = await response.json();
    
    // Extract tokens from the document
    const extractor = new DesignTokenExtractor();
    const tokens = extractor.extract(data.document);

    // Process and organize tokens by type
    const organizedTokens = {
      colors: {},
      typography: {},
      spacing: {},
      shadows: {},
    };

    tokens.forEach((token) => {
      switch (token.type) {
        case 'color':
          const rgba = token.value;
          const rgbaString = `rgba(${Math.round(rgba.r * 255)}, ${Math.round(
            rgba.g * 255
          )}, ${Math.round(rgba.b * 255)}, ${rgba.a})`;
          organizedTokens.colors[token.name] = rgbaString;
          break;
        case 'typography':
          organizedTokens.typography[token.name] = {
            fontFamily: token.value.fontFamily,
            fontSize: `${token.value.fontSize}px`,
            fontWeight: token.value.fontWeight,
            lineHeight: typeof token.value.lineHeight === 'number'
              ? token.value.lineHeight
              : token.value.lineHeight.value,
            letterSpacing: `${token.value.letterSpacing}px`,
          };
          break;
        case 'shadow':
          const effect = token.value;
          const shadowString = `${effect.type === 'INNER_SHADOW' ? 'inset ' : ''}${
            effect.offset.x
          }px ${effect.offset.y}px ${effect.radius}px ${
            effect.spread || 0
          }px rgba(${Math.round(effect.color.r * 255)}, ${Math.round(
            effect.color.g * 255
          )}, ${Math.round(effect.color.b * 255)}, ${effect.color.a})`;
          organizedTokens.shadows[token.name] = shadowString;
          break;
      }
    });

    return res.status(200).json(organizedTokens);
  } catch (error: any) {
    console.error('Token extraction error:', error);
    return res.status(500).json({
      message: error.message || 'Failed to extract design tokens',
    });
  }
} 