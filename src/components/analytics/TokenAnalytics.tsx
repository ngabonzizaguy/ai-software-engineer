import React, { useMemo } from 'react';
import { DesignToken } from '@/types/tokens';

interface TokenAnalyticsProps {
  tokens: DesignToken[];
}

interface TokenGroup {
  type: string;
  count: number;
  tokens: DesignToken[];
}

export const TokenAnalytics: React.FC<TokenAnalyticsProps> = ({ tokens }) => {
  const tokenGroups = useMemo(() => {
    const groups = tokens.reduce((acc, token) => {
      const type = token.type;
      if (!acc[type]) {
        acc[type] = {
          type,
          count: 0,
          tokens: []
        };
      }
      acc[type].count++;
      acc[type].tokens.push(token);
      return acc;
    }, {} as Record<string, TokenGroup>);

    return Object.values(groups).sort((a, b) => b.count - a.count);
  }, [tokens]);

  const totalTokens = tokens.length;

  return (
    <div className="space-y-6">
      {/* Distribution Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Token Distribution</h2>
        
        <div className="space-y-4">
          {tokenGroups.map(group => (
            <div key={group.type} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium capitalize">{group.type}</span>
                <span className="text-sm text-gray-500">
                  {group.count} ({Math.round((group.count / totalTokens) * 100)}%)
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(group.count / totalTokens) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Color Analysis */}
      {/* TODO: Add ColorAnalytics component once implemented */}
    </div>
  );
};