import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { tokens, options } = req.body;

    if (!tokens || !Array.isArray(tokens)) {
      return res.status(400).json({ message: 'Tokens array is required' });
    }

    // Generate code based on framework and style format
    let generatedCode = '';
    const { framework, styleFormat } = options;

    // Generate the appropriate code based on the framework and style format
    switch (framework) {
      case 'react':
        if (styleFormat === 'css') {
          generatedCode = generateReactCSS(tokens);
        } else if (styleFormat === 'scss') {
          generatedCode = generateReactSCSS(tokens);
        } else if (styleFormat === 'styled') {
          generatedCode = generateReactStyled(tokens);
        }
        break;
      // Add other frameworks here
      default:
        generatedCode = generateReactCSS(tokens); // Default to React + CSS
    }

    return res.status(200).json({ code: generatedCode });
  } catch (error: any) {
    console.error('Code generation error:', error);
    return res.status(500).json({ message: error.message || 'Failed to generate code' });
  }
}

function generateReactCSS(tokens: any[]) {
  let css = ':root {\n';
  let components = '';

  tokens.forEach(({ category, tokens }) => {
    css += `  /* ${category} */\n`;
    tokens.forEach(({ name, value }: any) => {
      const cssVarName = `--${category}-${name.toLowerCase().replace(/\s+/g, '-')}`;
      css += `  ${cssVarName}: ${formatValue(value)};\n`;
    });
    css += '\n';
  });

  css += '}\n\n';

  // Generate example component
  components += `import React from 'react';\n\n`;
  components += `export function ExampleComponent() {\n`;
  components += `  return (\n`;
  components += `    <div className="example-component">\n`;
  components += `      {/* Use the generated CSS variables here */}\n`;
  components += `    </div>\n`;
  components += `  );\n`;
  components += `}\n`;

  return css + components;
}

function generateReactSCSS(tokens: any[]) {
  let scss = '// Design Tokens\n\n';

  tokens.forEach(({ category, tokens }) => {
    scss += `// ${category}\n`;
    scss += `$${category}: (\n`;
    tokens.forEach(({ name, value }: any) => {
      scss += `  '${name}': ${formatValue(value)},\n`;
    });
    scss += ');\n\n';
  });

  // Generate mixins and functions
  scss += `// Usage Example\n`;
  scss += `.example {\n`;
  scss += `  // Use the tokens here\n`;
  scss += `}\n`;

  return scss;
}

function generateReactStyled(tokens: any[]) {
  let styled = `import styled from 'styled-components';\n\n`;
  styled += `// Design Tokens\n`;
  
  tokens.forEach(({ category, tokens }) => {
    styled += `export const ${category} = {\n`;
    tokens.forEach(({ name, value }: any) => {
      styled += `  ${name}: '${formatValue(value)}',\n`;
    });
    styled += `};\n\n`;
  });

  // Generate example styled component
  styled += `// Example Usage\n`;
  styled += `export const StyledComponent = styled.div\`\n`;
  styled += `  // Use the tokens here\n`;
  styled += `\`;\n`;

  return styled;
}

function formatValue(value: any): string {
  if (typeof value === 'object') {
    if ('fontSize' in value) {
      return `${value.fontSize} ${value.fontFamily}`;
    }
    if ('r' in value) {
      return `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`;
    }
    return JSON.stringify(value);
  }
  return value.toString();
} 