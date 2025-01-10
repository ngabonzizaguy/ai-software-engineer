import { APIClient } from '../../core/utils/api/APIClient';
import { FigmaFile } from './types';

export class FigmaClient {
  private baseUrl = 'https://api.figma.com/v1';
  
  constructor(private apiKey: string) {
    if (!apiKey) {
      throw new Error('Figma API key is required');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'X-Figma-Token': this.apiKey,
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Figma API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // File methods
  async getFile(fileId: string): Promise<FigmaFile> {
    return this.request<FigmaFile>(`/files/${fileId}`);
  }

  async getFileNodes(fileId: string, nodeIds: string[]) {
    return this.request(`/files/${fileId}/nodes?ids=${nodeIds.join(',')}`);
  }

  // Image methods
  async getImage(fileId: string, nodeIds: string[], params: {
    scale?: number;
    format?: 'jpg' | 'png' | 'svg' | 'pdf';
    svg_include_id?: boolean;
    svg_outline_text?: boolean;
    contents_only?: boolean;
  } = {}) {
    const queryParams = new URLSearchParams({
      ids: nodeIds.join(','),
      ...(params.scale && { scale: params.scale.toString() }),
      ...(params.format && { format: params.format }),
      ...(params.svg_include_id && { svg_include_node_id: 'true' }),
      ...(params.svg_outline_text && { svg_outline_text: 'true' }),
      ...(params.contents_only && { contents_only: 'true' })
    });
    
    return this.request(`/images/${fileId}?${queryParams}`);
  }

  // Comments methods
  async getComments(fileId: string, as_markdown: boolean = false) {
    return this.request(`/files/${fileId}/comments${as_markdown ? '?as_md=true' : ''}`);
  }

  async postComment(fileId: string, message: string, client_meta?: {
    x: number;
    y: number;
    node_id?: string;
    node_offset?: {
      x: number;
      y: number;
    }
  }) {
    return this.request(`/files/${fileId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ message, client_meta })
    });
  }

  async getFileComponents(fileId: string) {
    return this.request(`/files/${fileId}/components`);
  }
} 