import React from 'react';
import { DesignToken } from '@/types/tokens';

export const TokenPreview: React.FC<{ token: DesignToken }> = ({ token }) => {
  switch (token.type) {
    case 'color':
      return (
        <div 
          className="w-12 h-12 rounded shadow-sm"
          style={{ backgroundColor: token.value.rgb }}
        />
      );
    case 'typography':
      return (
        <div 
          className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded"
          style={{ 
            fontFamily: token.value.fontFamily,
            fontSize: token.value.fontSize,
            fontWeight: token.value.fontWeight
          }}
        >
          Aa
        </div>
      );
    default:
      return (
        <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded">
          {token.type.charAt(0).toUpperCase()}
        </div>
      );
  }
}; 