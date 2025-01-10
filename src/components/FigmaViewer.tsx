import React, { useState } from 'react';
import { TokenList } from './TokenList';
import { DesignToken } from '@/types/tokens';

export const FigmaViewer: React.FC = () => {
  const [fileId, setFileId] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/figma/extract?fileId=${fileId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to extract tokens');
      }
      
      setTokens(data.tokens);
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

      {tokens.length > 0 && (
        <TokenList tokens={tokens} />
      )}
    </div>
  );
}; 