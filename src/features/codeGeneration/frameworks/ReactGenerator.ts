import { ComponentToken, LayoutToken } from '@/types/tokens';
import { CodeGenerationOptions, GeneratedCode } from '../types';

export class ReactGenerator {
  private options: CodeGenerationOptions;

  constructor(options: CodeGenerationOptions) {
    this.options = options;
  }

  public async generateComponent(component: ComponentToken): Promise<GeneratedCode> {
    const { name, styles } = component.value;
    const className = this.generateClassName(name);
    const props = this.generateProps(component);
    const layoutStyles = this.generateLayoutStyles(styles.layout);

    const content = `
${this.generateImports()}

${this.generateTypes(component)}

export const ${name}: React.FC<${name}Props> = ({ ${Object.keys(props).join(', ')}, children }) => {
  return (
    <div 
      className={\`${className} ${layoutStyles}\`}
      {...props}
    >
      {children}
    </div>
  );
};
`.trim();

    return {
      fileName: `${name}.tsx`,
      content,
      type: 'component',
      path: ['components', name]
    };
  }

  private generateImports(): string {
    const imports = ['import React from "react";'];
    
    if (this.options.typescript) {
      imports.push('import { HTMLAttributes } from "react";');
    }

    return imports.join('\n');
  }

  private generateTypes(component: ComponentToken): string {
    if (!this.options.typescript) return '';

    const { name } = component.value;
    return `
interface ${name}Props extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}`.trim();
  }

  private generateClassName(name: string): string {
    return name.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);
  }

  private generateProps(component: ComponentToken): Record<string, string> {
    const props: Record<string, string> = {
      className: 'string',
      style: 'React.CSSProperties'
    };

    // Add component-specific props based on its properties
    if (component.value.styles.typography) {
      props.text = 'string';
    }

    return props;
  }

  private generateLayoutStyles(layout: LayoutToken['value']): string {
    const styles: string[] = [];

    if (layout.layoutMode === 'HORIZONTAL') {
      styles.push('flex flex-row');
    } else if (layout.layoutMode === 'VERTICAL') {
      styles.push('flex flex-col');
    }

    if (layout.padding) {
      const { top, right, bottom, left } = layout.padding;
      if (top === right && right === bottom && bottom === left) {
        styles.push(`p-${top/4}`);
      } else {
        styles.push(`pt-${top/4} pr-${right/4} pb-${bottom/4} pl-${left/4}`);
      }
    }

    if (layout.itemSpacing) {
      styles.push(`gap-${layout.itemSpacing/4}`);
    }

    return styles.join(' ');
  }
}