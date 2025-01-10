import { FigmaFile } from '../../api/figma/types';

interface DesignToken {
  type: 'color' | 'typography' | 'spacing' | 'effect' | 'grid' | 'shadow';
  name: string;
  value: any;
  path: string[];
  metadata: {
    isComponent: boolean;
    isReused: boolean;
    frequency: number;
  };
}

export class DesignTokenExtractor {
  private tokens: DesignToken[] = [];
  private usageMap = new Map<string, number>();

  constructor() {}

  private processColor(node: any, path: string[] = []): void {
    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID') {
        const token: DesignToken = {
          type: 'color',
          name: node.name,
          value: {
            rgb: `rgba(${fill.color.r * 255}, ${fill.color.g * 255}, ${fill.color.b * 255}, ${fill.color.a})`,
            hex: this.rgbToHex(fill.color),
            alpha: fill.color.a
          },
          path: [...path, node.name],
          metadata: {
            isComponent: node.type === 'COMPONENT',
            isReused: (this.usageMap.get(node.name) ?? 0) > 1,
            frequency: this.usageMap.get(node.name) ?? 1
          }
        };
        this.tokens.push(token);
      }
    }
  }

  private rgbToHex(color: { r: number; g: number; b: number }): string {
    const toHex = (n: number) => {
      const hex = Math.round(n * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  }

  private extractTypography(node: any, path: string[]): void {
    if (node.type === 'TEXT') {
      this.tokens.push({
        type: 'typography',
        name: node.name,
        value: {
          fontFamily: node.style?.fontFamily,
          fontSize: node.style?.fontSize,
          fontWeight: node.style?.fontWeight,
          lineHeight: node.style?.lineHeight,
          letterSpacing: node.style?.letterSpacing,
          textCase: node.style?.textCase
        },
        path,
        metadata: {
          isComponent: node.type === 'COMPONENT',
          isReused: (this.usageMap.get(node.name) ?? 0) > 1,
          frequency: this.usageMap.get(node.name) ?? 1
        }
      });
    }
  }

  private extractSpacing(node: any, path: string[]): void {
    if (node.type === 'FRAME' || node.type === 'GROUP') {
      this.tokens.push({
        type: 'spacing',
        name: node.name,
        value: {
          padding: {
            top: node.paddingTop,
            right: node.paddingRight,
            bottom: node.paddingBottom,
            left: node.paddingLeft
          },
          itemSpacing: node.itemSpacing,
          layoutMode: node.layoutMode
        },
        path,
        metadata: {
          isComponent: node.type === 'COMPONENT',
          isReused: (this.usageMap.get(node.name) ?? 0) > 1,
          frequency: this.usageMap.get(node.name) ?? 1
        }
      });
    }
  }

  public extract(node: any, path: string[] = []): DesignToken[] {
    // Track usage
    this.usageMap.set(node.name, (this.usageMap.get(node.name) || 0) + 1);

    // Process current node
    this.processColor(node, path);

    // Recursively process children
    if (node.children) {
      node.children.forEach((child: any) => {
        this.extract(child, [...path, node.name]);
      });
    }

    return this.tokens;
  }
} 