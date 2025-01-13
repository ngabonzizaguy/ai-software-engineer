import React, { useMemo } from 'react';
import { DesignToken } from '@/types/tokens';

interface ColorToken {
  id: string;
  name: string;
  type: 'color';
  path: string[];
  value: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}

interface ColorAnalyticsProps {
  tokens: DesignToken[];
}

interface ColorGroup {
  name: string;
  colors: ColorToken[];
  usage: number;
}

export const ColorAnalytics: React.FC<ColorAnalyticsProps> = ({ tokens }) => {
  const colorTokens = useMemo(() => {
    return tokens.filter((token): token is ColorToken => 
      token.type === 'color' && 
      'value' in token &&
      typeof token.value === 'object' &&
      'r' in token.value &&
      'g' in token.value &&
      'b' in token.value &&
      'a' in token.value
    );
  }, [tokens]);

  const colorGroups = useMemo(() => {
    const groups: Record<string, ColorGroup> = {};
    
    colorTokens.forEach(token => {
      const pathBase = token.path[0] || 'Global';
      if (!groups[pathBase]) {
        groups[pathBase] = {
          name: pathBase,
          colors: [],
          usage: 0
        };
      }
      groups[pathBase].colors.push(token);
      groups[pathBase].usage++;
    });

    return Object.values(groups).sort((a, b) => b.usage - a.usage);
  }, [colorTokens]);

  const rgbaToHex = (color: ColorToken['value']) => {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Color Palette Analysis</h2>
        
        <div className="space-y-8">
          {colorGroups.map(group => (
            <div key={group.name} className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">{group.name}</h3>
                <span className="text-sm text-gray-500">{group.colors.length} colors</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {group.colors.map(color => (
                  <div 
                    key={color.id}
                    className="space-y-2"
                  >
                    <div 
                      className="w-full h-12 rounded-md shadow-inner"
                      style={{ 
                        backgroundColor: rgbaToHex(color.value),
                        opacity: color.value.a
                      }}
                    />
                    <div className="text-xs">
                      <div className="font-medium truncate" title={color.name}>
                        {color.name}
                      </div>
                      <div className="text-gray-500">
                        {rgbaToHex(color.value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {colorTokens.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No color tokens found in this file
          </div>
        )}
      </div>
    </div>
  );
};