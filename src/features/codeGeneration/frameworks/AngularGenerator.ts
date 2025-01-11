import { ComponentToken, LayoutToken } from '@/types/tokens';
import { CodeGenerationOptions, GeneratedCode } from '../types';

export class AngularGenerator {
  private options: CodeGenerationOptions;

  constructor(options: CodeGenerationOptions) {
    this.options = options;
  }

  public async generateComponent(component: ComponentToken): Promise<GeneratedCode> {
    const { name, styles } = component.value;
    const className = this.generateClassName(name);
    const selector = this.generateSelector(name);
    const props = this.generateProps(component);
    const layoutStyles = this.generateLayoutStyles(styles.layout);

    const content = `import { Component${props.length ? ', Input' : ''} } from '@angular/core';

@Component({
  selector: '${selector}',
  template: \`
    <div 
      [class]="'${className}'"
      [ngClass]="'${layoutStyles}'"
    >
      <ng-content></ng-content>
    </div>
  \`,
  ${this.options.styleFormat === 'scss' ? "styleUrls: ['./" + name.toLowerCase() + ".component.scss']" : 'styles: []'}
})
export class ${name}Component {
  ${props.map(prop => `@Input() ${prop.name}: ${prop.type};`).join('\n  ')}
}`;

    return {
      fileName: `${name.toLowerCase()}.component.ts`,
      content,
      type: 'component',
      path: ['components', name]
    };
  }

  private generateClassName(name: string): string {
    return name.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);
  }

  private generateSelector(name: string): string {
    return 'app-' + name.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);
  }

  private generateProps(component: ComponentToken): Array<{ name: string; type: string }> {
    const props: Array<{ name: string; type: string }> = [];

    if (component.value.styles.typography) {
      props.push({ name: 'text', type: 'string' });
    }

    // Add props for layout customization
    if (component.value.styles.layout?.itemSpacing) {
      props.push({ name: 'spacing', type: 'number' });
    }

    return props;
  }

  private generateLayoutStyles(layout: LayoutToken['value']): string {
    const styles: string[] = [];

    if (layout.layoutMode === 'HORIZONTAL') {
      styles.push('d-flex flex-row');
    } else if (layout.layoutMode === 'VERTICAL') {
      styles.push('d-flex flex-column');
    }

    if (layout.padding) {
      const { top, right, bottom, left } = layout.padding;
      if (top === right && right === bottom && bottom === left) {
        styles.push(`p-${top/4}`);
      } else {
        styles.push(`pt-${top/4} pe-${right/4} pb-${bottom/4} ps-${left/4}`);
      }
    }

    if (layout.itemSpacing) {
      styles.push(`gap-${layout.itemSpacing/4}`);
    }

    return styles.join(' ');
  }

  public async generateModule(components: ComponentToken[]): Promise<GeneratedCode> {
    const moduleName = 'Components';
    const imports = components.map(comp => comp.value.name + 'Component').join(', ');
    
    const content = `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
${components.map(comp => 
  `import { ${comp.value.name}Component } from './components/${comp.value.name.toLowerCase()}.component';`
).join('\n')}

@NgModule({
  declarations: [${imports}],
  imports: [CommonModule],
  exports: [${imports}]
})
export class ${moduleName}Module { }`;

    return {
      fileName: `components.module.ts`,
      content,
      type: 'module',
      path: []
    };
  }
} 