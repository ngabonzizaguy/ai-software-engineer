import { NextApiRequest, NextApiResponse } from 'next';
import { TokenExporter } from '@/features/designTokens/tokenExporter';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { tokens, format } = req.body;

    if (!tokens) {
      return res.status(400).json({ message: 'Tokens are required' });
    }

    if (!format || !['css', 'scss', 'json', 'ts'].includes(format)) {
      return res.status(400).json({ message: 'Invalid export format' });
    }

    const exporter = new TokenExporter(tokens);
    const exported = exporter.export(format);

    // Set appropriate content type based on format
    const contentType = format === 'json' ? 'application/json' : 'text/plain';
    res.setHeader('Content-Type', contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="design-tokens.${format}"`
    );

    return res.status(200).send(exported);
  } catch (error: any) {
    console.error('Token export error:', error);
    return res.status(500).json({
      message: error.message || 'Failed to export design tokens',
    });
  }
} 