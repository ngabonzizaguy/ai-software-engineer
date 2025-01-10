import React from 'react';
import { TokenPreview } from '@/components/TokenPreview';
import { TokenMetadata } from '@/components/TokenMetadata';
import { DesignToken } from '@/types/tokens';

export const TokenDisplay: React.FC<{ token: DesignToken }> = ({ token }) => {
  return (
    <div className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <TokenPreview token={token} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg">{token.name}</h3>
            <span className="px-2 py-1 text-xs rounded bg-gray-100">
              {token.type}
            </span>
          </div>
          
          <div className="text-sm text-gray-500 mt-1">
            {token.path.join(' → ')}
          </div>

          <TokenMetadata token={token} />
          
          <div className="mt-4 space-y-2">
            {Object.entries(token.value).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-sm font-medium">{key}:</span>
                <code className="text-sm bg-gray-50 px-2 py-1 rounded">
                  {JSON.stringify(value)}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 