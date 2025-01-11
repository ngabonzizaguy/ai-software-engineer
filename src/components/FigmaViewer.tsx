import React, { useState } from 'react';
import { TokenList } from './TokenList';
import { DesignToken } from '@/types/tokens';

export const FigmaViewer: React.FC = () => {
  const [fileId, setFileId] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [error, setError] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowDetails(false);
    setProgress(0);
    
    try {
      const response = await fetch(`/api/figma/extract?fileId=${fileId}`);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('Failed to initialize stream reader');
      }

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Process complete lines
        buffer = lines.pop() || ''; // Keep the last incomplete line in buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.progress !== undefined) {
                setProgress(data.progress);
              }
              
              if (data.tokens) {
                setTokens(data.tokens);
              }
              
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }
      
      // Process any remaining data
      if (buffer.startsWith('data: ')) {
        try {
          const data = JSON.parse(buffer.slice(6));
          if (data.tokens) setTokens(data.tokens);
          if (data.error) throw new Error(data.error);
        } catch (e) {
          console.error('Failed to parse final SSE data:', e);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fileId" className="block text-sm font-medium text-gray-700">
            Figma File ID
          </label>
          <input
            id="fileId"
            type="text"
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
            placeholder="Paste your Figma file ID here"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Extracting...' : 'Extract Tokens'}
        </button>
      </form>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}

      {(loading || tokens.length > 0) && (
        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {tokens.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {tokens.length} tokens extracted
                </div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {showDetails ? 'Hide Details' : 'View Details'}
                </button>
              </div>
              
              {showDetails && <TokenList tokens={tokens} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 