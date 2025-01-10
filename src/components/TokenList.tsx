import React, { useState, useMemo } from 'react';
import { TokenDisplay } from './TokenDisplay';
import { DesignToken } from '@/types/tokens';

interface TokenListProps {
  tokens: DesignToken[];
}

export const TokenList: React.FC<TokenListProps> = ({ tokens }) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const groupedTokens = useMemo(() => {
    return tokens.reduce((acc, token) => {
      const group = token.type;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(token);
      return acc;
    }, {} as Record<string, DesignToken[]>);
  }, [tokens]);

  const filteredTokens = useMemo(() => {
    let filtered = tokens;
    
    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(token => token.type === filter);
    }
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(token => 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.path.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  }, [tokens, filter, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Types</option>
          {Object.keys(groupedTokens).map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tokens..."
          className="p-2 border rounded flex-1"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTokens.map((token, index) => (
          <TokenDisplay key={`${token.name}-${index}`} token={token} />
        ))}
      </div>
    </div>
  );
}; 