interface TokenSet {
  colors: Record<string, string>;
  typography: Record<string, {
    fontFamily: string;
    fontSize: string;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: string;
  }>;
  spacing: Record<string, string>;
  shadows: Record<string, string>;
}

type ExportFormat = 'css' | 'scss' | 'json' | 'ts';

export class TokenExporter {
  private tokens: TokenSet;

  constructor(tokens: TokenSet) {
    this.tokens = tokens;
  }

  public export(format: ExportFormat): string {
    switch (format) {
      case 'css':
        return this.toCSS();
      case 'scss':
        return this.toSCSS();
      case 'json':
        return this.toJSON();
      case 'ts':
        return this.toTypeScript();
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private toCSS(): string {
    let css = ':root {\n';

    // Colors
    Object.entries(this.tokens.colors).forEach(([name, value]) => {
      css += `  --color-${this.kebabCase(name)}: ${value};\n`;
    });

    // Typography
    Object.entries(this.tokens.typography).forEach(([name, value]) => {
      const prefix = `--typography-${this.kebabCase(name)}`;
      css += `  ${prefix}-font-family: ${value.fontFamily};\n`;
      css += `  ${prefix}-font-size: ${value.fontSize};\n`;
      css += `  ${prefix}-font-weight: ${value.fontWeight};\n`;
      css += `  ${prefix}-line-height: ${value.lineHeight};\n`;
      css += `  ${prefix}-letter-spacing: ${value.letterSpacing};\n`;
    });

    // Spacing
    Object.entries(this.tokens.spacing).forEach(([name, value]) => {
      css += `  --spacing-${this.kebabCase(name)}: ${value};\n`;
    });

    // Shadows
    Object.entries(this.tokens.shadows).forEach(([name, value]) => {
      css += `  --shadow-${this.kebabCase(name)}: ${value};\n`;
    });

    css += '}\n';
    return css;
  }

  private toSCSS(): string {
    let scss = '// Design Tokens\n\n';

    // Colors
    scss += '// Colors\n';
    Object.entries(this.tokens.colors).forEach(([name, value]) => {
      scss += `$color-${this.kebabCase(name)}: ${value};\n`;
    });

    // Typography
    scss += '\n// Typography\n';
    Object.entries(this.tokens.typography).forEach(([name, value]) => {
      const prefix = `$typography-${this.kebabCase(name)}`;
      scss += `${prefix}: (\n`;
      scss += `  font-family: ${value.fontFamily},\n`;
      scss += `  font-size: ${value.fontSize},\n`;
      scss += `  font-weight: ${value.fontWeight},\n`;
      scss += `  line-height: ${value.lineHeight},\n`;
      scss += `  letter-spacing: ${value.letterSpacing}\n`;
      scss += ');\n';
    });

    // Spacing
    scss += '\n// Spacing\n';
    Object.entries(this.tokens.spacing).forEach(([name, value]) => {
      scss += `$spacing-${this.kebabCase(name)}: ${value};\n`;
    });

    // Shadows
    scss += '\n// Shadows\n';
    Object.entries(this.tokens.shadows).forEach(([name, value]) => {
      scss += `$shadow-${this.kebabCase(name)}: ${value};\n`;
    });

    return scss;
  }

  private toJSON(): string {
    return JSON.stringify(this.tokens, null, 2);
  }

  private toTypeScript(): string {
    let ts = 'export const tokens = {\n';

    // Colors
    ts += '  colors: {\n';
    Object.entries(this.tokens.colors).forEach(([name, value]) => {
      ts += `    ${this.camelCase(name)}: '${value}',\n`;
    });
    ts += '  },\n\n';

    // Typography
    ts += '  typography: {\n';
    Object.entries(this.tokens.typography).forEach(([name, value]) => {
      ts += `    ${this.camelCase(name)}: {\n`;
      ts += `      fontFamily: '${value.fontFamily}',\n`;
      ts += `      fontSize: '${value.fontSize}',\n`;
      ts += `      fontWeight: ${value.fontWeight},\n`;
      ts += `      lineHeight: ${value.lineHeight},\n`;
      ts += `      letterSpacing: '${value.letterSpacing}',\n`;
      ts += '    },\n';
    });
    ts += '  },\n\n';

    // Spacing
    ts += '  spacing: {\n';
    Object.entries(this.tokens.spacing).forEach(([name, value]) => {
      ts += `    ${this.camelCase(name)}: '${value}',\n`;
    });
    ts += '  },\n\n';

    // Shadows
    ts += '  shadows: {\n';
    Object.entries(this.tokens.shadows).forEach(([name, value]) => {
      ts += `    ${this.camelCase(name)}: '${value}',\n`;
    });
    ts += '  },\n';

    ts += '} as const;\n\n';
    ts += 'export type DesignTokens = typeof tokens;\n';

    return ts;
  }

  private kebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  private camelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  }
} 