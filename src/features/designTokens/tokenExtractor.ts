import { 
  DesignToken,
  RGBA,
  Typography,
  Paint,
  Effect,
  LayoutConstraint,
  ComponentProperties
} from '@/types/tokens';

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  fills?: Paint[];
  strokes?: Paint[];
  effects?: Effect[];
  characters?: string;
  style?: {
    fontFamily?: string;
    fontWeight?: number;
    fontSize?: number;
    letterSpacing?: number;
    lineHeight?: number | { value: number; unit: 'PIXELS' | 'PERCENT' };
    textDecoration?: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';
    textCase?: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';
  };
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'GRID';
  primaryAxisSizingMode?: 'FIXED' | 'AUTO';
  counterAxisSizingMode?: 'FIXED' | 'AUTO';
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  counterAxisSpacing?: number;
  constraints?: LayoutConstraint;
  componentPropertyDefinitions?: Record<string, {
    type: string;
    defaultValue: any;
  }>;
}

export class DesignTokenExtractor {
  private tokens: DesignToken[] = [];
  private path: string[] = [];

  public extract(document: FigmaNode): DesignToken[] {
    this.tokens = [];
    this.path = [];
    this.processNode(document);
    return this.tokens;
  }

  private processNode(node: FigmaNode) {
    this.path.push(node.name);

    // Extract colors from fills
    if (node.fills?.length) {
      this.extractColors(node.fills, 'fill');
    }

    // Extract colors from strokes
    if (node.strokes?.length) {
      this.extractColors(node.strokes, 'stroke');
    }

    // Extract typography
    if (node.type === 'TEXT' && node.style) {
      this.extractTypography(node);
    }

    // Extract effects (shadows, blurs)
    if (node.effects?.length) {
      this.extractEffects(node.effects);
    }

    // Extract layout properties
    if (node.layoutMode) {
      this.extractLayout(node);
    }

    // Extract component properties
    if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
      this.extractComponent(node);
    }

    // Process children
    if (node.children) {
      node.children.forEach(child => this.processNode(child));
    }

    this.path.pop();
  }

  private extractColors(paints: Paint[], context: string) {
    paints.forEach((paint, index) => {
      if (paint.type === 'SOLID' && paint.color) {
        this.tokens.push({
          id: `color-${this.path.join('-')}-${context}-${index}`,
          name: `${this.path[this.path.length - 1]} ${context} ${index + 1}`,
          type: 'color',
          path: [...this.path],
          value: paint.color
        });
      }
    });
  }

  private extractTypography(node: FigmaNode) {
    if (!node.style) return;

    const typography: Typography = {
      fontFamily: node.style.fontFamily || '',
      fontWeight: node.style.fontWeight || 400,
      fontSize: node.style.fontSize || 16,
      letterSpacing: node.style.letterSpacing || 0,
      lineHeight: node.style.lineHeight || 1.2,
      textDecoration: node.style.textDecoration || 'NONE',
      textCase: node.style.textCase || 'ORIGINAL'
    };

    this.tokens.push({
      id: `typography-${this.path.join('-')}`,
      name: this.path[this.path.length - 1],
      type: 'typography',
      path: [...this.path],
      value: typography
    });
  }

  private extractEffects(effects: Effect[]) {
    effects.forEach((effect, index) => {
      if (effect.type.includes('SHADOW')) {
        this.tokens.push({
          id: `shadow-${this.path.join('-')}-${index}`,
          name: `${this.path[this.path.length - 1]} Shadow ${index + 1}`,
          type: 'shadow',
          path: [...this.path],
          value: effect
        });
      }
    });
  }

  private extractLayout(node: FigmaNode) {
    const layout = {
      layoutMode: node.layoutMode!,
      layoutConstraint: node.constraints || {
        vertical: 'TOP',
        horizontal: 'LEFT'
      },
      padding: node.paddingTop !== undefined ? {
        top: node.paddingTop,
        right: node.paddingRight || 0,
        bottom: node.paddingBottom || 0,
        left: node.paddingLeft || 0
      } : undefined,
      itemSpacing: node.itemSpacing,
      counterAxisSpacing: node.counterAxisSpacing
    };

    this.tokens.push({
      id: `layout-${this.path.join('-')}`,
      name: this.path[this.path.length - 1],
      type: 'layout',
      path: [...this.path],
      value: layout
    });
  }

  private extractComponent(node: FigmaNode) {
    const componentToken: DesignToken = {
      id: `component-${this.path.join('-')}`,
      name: this.path[this.path.length - 1],
      type: 'component',
      path: [...this.path],
      isComponent: true,
      value: {
        id: node.id,
        name: node.name,
        remote: false,
        key: node.id,
        styles: {
          fills: node.fills,
          strokes: node.strokes,
          effects: node.effects,
          layout: node.layoutMode ? {
            layoutMode: node.layoutMode,
            layoutConstraint: node.constraints || {
              vertical: 'TOP',
              horizontal: 'LEFT'
            }
          } : {
            layoutMode: 'NONE',
            layoutConstraint: {
              vertical: 'TOP',
              horizontal: 'LEFT'
            }
          }
        }
      }
    };

    this.tokens.push(componentToken);
  }
} 