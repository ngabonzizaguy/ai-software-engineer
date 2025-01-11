import { 
  DesignToken, 
  ComponentToken, 
  ColorToken, 
  TypographyToken,
  Paint,
  Typography,
  Effect
} from '@/types/tokens';
import { CodeGenerationOptions, GeneratedCode, StyleTemplate } from '../types';

export class StyleGenerator {
  private options: CodeGenerationOptions;

  constructor(options: CodeGenerationOptions) {
    this.options = options;
  }

  public async generateGlobalStyles(tokens: DesignToken[]): Promise<GeneratedCode> {
    const variables = this.generateCSSVariables(tokens);
    const utilities = this.generateUtilities(tokens);

    const content = this.options.styleFormat === 'tailwind' 
      ? this.generateTailwindConfig(variables, utilities)
      : this.generateCSS(variables, utilities);

    const extension = this.options.styleFormat === 'scss' ? 'scss' : 'css';
    
    return {
      fileName: `global.${extension}`,
      content,
      type: 'style',
      path: ['styles']
    };
  }

  public async generateComponentStyles(component: ComponentToken): Promise<GeneratedCode> {
    const { name, styles } = component.value;
    const className = this.generateClassName(name);

    const styleRules = {
      ...this.generateColorStyles(styles.fills, styles.strokes),
      ...this.generateTypographyStyles(styles.typography),
      ...this.generateEffectStyles(styles.effects)
    };

    const content = this.options.styleFormat === 'tailwind'
      ? this.generateTailwindComponent(className, styleRules)
      : this.generateCSSComponent(className, styleRules);

    const extension = this.options.styleFormat === 'scss' ? 'scss' : 'css';
    
    return {
      fileName: `${name}.${extension}`,
      content,
      type: 'style',
      path: ['styles', 'components']
    };
  }

  private generateClassName(name: string): string {
    return name.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);
  }

  private generateCSSVariables(tokens: DesignToken[]): Record<string, string> {
    const variables: Record<string, string> = {};

    tokens.forEach(token => {
      if (token.type === 'color') {
        const color = token.value;
        variables[`--color-${token.name.toLowerCase()}`] = 
          `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${color.a})`;
      }
      else if (token.type === 'typography') {
        const typography = token.value;
        variables[`--font-size-${token.name.toLowerCase()}`] = `${typography.fontSize}px`;
        variables[`--line-height-${token.name.toLowerCase()}`] = 
          typeof typography.lineHeight === 'number' 
            ? typography.lineHeight.toString()
            : `${typography.lineHeight.value}${typography.lineHeight.unit === 'PIXELS' ? 'px' : '%'}`;
      }
    });

    return variables;
  }

  private generateUtilities(tokens: DesignToken[]): Record<string, string> {
    const utilities: Record<string, string> = {};

    // Generate color utilities
    tokens.filter((token): token is ColorToken => token.type === 'color')
      .forEach(token => {
        const colorName = token.name.toLowerCase();
        utilities[`.text-${colorName}`] = `color: var(--color-${colorName});`;
        utilities[`.bg-${colorName}`] = `background-color: var(--color-${colorName});`;
      });

    // Generate typography utilities
    tokens.filter((token): token is TypographyToken => token.type === 'typography')
      .forEach(token => {
        const name = token.name.toLowerCase();
        utilities[`.text-${name}`] = `
          font-size: var(--font-size-${name});
          line-height: var(--line-height-${name});
          font-weight: ${token.value.fontWeight};
        `.trim();
      });

    return utilities;
  }

  private generateCSS(variables: Record<string, string>, utilities: Record<string, string>): string {
    if (this.options.styleFormat === 'scss') {
      return this.generateSCSS(variables, utilities);
    }

    return `
:root {
  ${Object.entries(variables).map(([key, value]) => `${key}: ${value};`).join('\n  ')}
}

${Object.entries(utilities).map(([selector, rules]) => `${selector} {\n  ${rules}\n}`).join('\n\n')}
`.trim();
  }

  private generateSCSS(variables: Record<string, string>, utilities: Record<string, string>): string {
    // Convert CSS variables to SCSS variables
    const scssVariables = Object.entries(variables)
      .map(([key, value]) => `$${key.replace('--', '')}: ${value};`)
      .join('\n');

    // Generate mixins for common patterns
    const mixins = `
@mixin flex-layout($direction: row) {
  display: flex;
  flex-direction: $direction;
}

@mixin typography($size, $weight, $height) {
  font-size: $size;
  font-weight: $weight;
  line-height: $height;
}`.trim();

    // Convert utilities to SCSS with nesting
    const scssUtilities = Object.entries(utilities).reduce((acc, [selector, rules]) => {
      const className = selector.replace('.', '');
      const parentSelector = className.split('-')[0];
      
      if (!acc[parentSelector]) {
        acc[parentSelector] = {};
      }
      
      acc[parentSelector][className] = rules;
      return acc;
    }, {} as Record<string, Record<string, string>>);

    const utilityClasses = Object.entries(scssUtilities)
      .map(([parent, classes]) => `
.${parent} {
  ${Object.entries(classes).map(([className, rules]) => `
  &-${className.split('-').slice(1).join('-')} {
    ${rules}
  }`).join('\n')}
}`).join('\n\n');

    return `
// Variables
${scssVariables}

// Mixins
${mixins}

// Utility Classes
${utilityClasses}
`.trim();
  }

  private generateTailwindConfig(variables: Record<string, string>, utilities: Record<string, string>): string {
    const config = {
      theme: {
        extend: {
          colors: this.extractTailwindColors(variables),
          fontSize: this.extractTailwindFontSizes(variables),
          lineHeight: this.extractTailwindLineHeights(variables)
        }
      }
    };

    return `module.exports = ${JSON.stringify(config, null, 2)}`;
  }

  private extractTailwindColors(variables: Record<string, string>): Record<string, string> {
    return Object.entries(variables)
      .filter(([key]) => key.startsWith('--color-'))
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key.replace('--color-', '')]: value
      }), {});
  }

  private extractTailwindFontSizes(variables: Record<string, string>): Record<string, string> {
    return Object.entries(variables)
      .filter(([key]) => key.startsWith('--font-size-'))
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key.replace('--font-size-', '')]: value
      }), {});
  }

  private extractTailwindLineHeights(variables: Record<string, string>): Record<string, string> {
    return Object.entries(variables)
      .filter(([key]) => key.startsWith('--line-height-'))
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key.replace('--line-height-', '')]: value
      }), {});
  }

  private generateColorStyles(fills?: Paint[], strokes?: Paint[]): Record<string, string> {
    const styles: Record<string, string> = {};

    if (fills?.length) {
      const fill = fills[0];
      if (fill.type === 'SOLID' && fill.color) {
        styles.backgroundColor = `rgba(${fill.color.r * 255}, ${fill.color.g * 255}, ${fill.color.b * 255}, ${fill.color.a})`;
      }
    }

    if (strokes?.length) {
      const stroke = strokes[0];
      if (stroke.type === 'SOLID' && stroke.color) {
        styles.borderColor = `rgba(${stroke.color.r * 255}, ${stroke.color.g * 255}, ${stroke.color.b * 255}, ${stroke.color.a})`;
      }
    }

    return styles;
  }

  private generateTypographyStyles(typography?: Typography): Record<string, string> {
    if (!typography) return {};

    return {
      fontFamily: typography.fontFamily,
      fontSize: `${typography.fontSize}px`,
      fontWeight: typography.fontWeight.toString(),
      letterSpacing: `${typography.letterSpacing}px`,
      lineHeight: typeof typography.lineHeight === 'number' 
        ? typography.lineHeight.toString()
        : `${typography.lineHeight.value}${typography.lineHeight.unit === 'PIXELS' ? 'px' : '%'}`,
      textDecoration: typography.textDecoration.toLowerCase(),
      textTransform: typography.textCase.toLowerCase()
    };
  }

  private generateEffectStyles(effects?: Effect[]): Record<string, string> {
    const styles: Record<string, string> = {};

    if (!effects?.length) return styles;

    const shadows = effects.filter(effect => 
      effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW'
    );

    if (shadows.length) {
      styles.boxShadow = shadows.map(shadow => {
        const { offset, radius, color } = shadow;
        const x = offset?.x || 0;
        const y = offset?.y || 0;
        const rgba = color ? `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${color.a})` : 'rgba(0,0,0,0.1)';
        return `${x}px ${y}px ${radius}px ${rgba}`;
      }).join(', ');
    }

    return styles;
  }

  private generateTailwindComponent(className: string, styles: Record<string, string>): string {
    // Convert styles to Tailwind classes
    const tailwindClasses = Object.entries(styles).map(([property, value]) => {
      // This is a simplified conversion - you'd need a more comprehensive mapping
      return `${property}-[${value}]`;
    }).join(' ');

    return `
.${className} {
  @apply ${tailwindClasses};
}`.trim();
  }

  private generateCSSComponent(className: string, styles: Record<string, string>): string {
    return `
.${className} {
  ${Object.entries(styles).map(([property, value]) => `${property}: ${value};`).join('\n  ')}
}`.trim();
  }
}