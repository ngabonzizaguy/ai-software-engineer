import React from 'react';
import { DesignToken } from '@/types/tokens';

export const TokenMetadata: React.FC<{ token: DesignToken }> = ({ token }) => {
  return (
    <div className="mt-2 space-y-1">
      {token.metadata.isComponent && (
        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mr-2">
          Component
        </span>
      )}
      {token.metadata.isReused && (
        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
          Used {token.metadata.frequency} times
        </span>
      )}
    </div>
  );
}; 