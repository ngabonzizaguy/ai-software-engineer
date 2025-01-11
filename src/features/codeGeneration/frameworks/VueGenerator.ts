import { ComponentToken, LayoutToken } from '@/types/tokens';
import { CodeGenerationOptions, GeneratedCode } from '../types';

export class VueGenerator {
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
<template>
  <div 
    :class="['${className}', '${layoutStyles}']"
    v-bind="$attrs"
  >
    <slot></slot>
  </div>
</template>

${this.generateScript(component)}

<style ${this.options.styleFormat === 'scss' ? 'lang="scss"' : ''} scoped>
.${className} {
  /* Component styles will be handled by StyleGenerator */
}
</style>`.trim();

    return {
      fileName: `${name}.vue`,
      content,
      type: 'component',
      path: ['components', name]
    };
  }

  private generateClassName(name: string): string {
    return name.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);
  }

  private generateProps(component: ComponentToken): Record<string, string> {
    const props: Record<string, string> = {};

    if (component.value.styles.typography) {
      props.text = 'String';
    }

    return props;
  }

  private generateScript(component: ComponentToken): string {
    const props = this.generateProps(component);
    const hasProps = Object.keys(props).length > 0;

    if (this.options.typescript) {
      return `
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: '${component.value.name}',
  ${hasProps ? `props: {
    ${Object.entries(props).map(([key, type]) => `${key}: { type: ${type} }`).join(',\n    ')}
  },` : ''}
})
</script>`.trim();
    }

    return `
<script>
export default {
  name: '${component.value.name}',
  ${hasProps ? `props: {
    ${Object.entries(props).map(([key, type]) => `${key}: { type: ${type} }`).join(',\n    ')}
  },` : ''}
}
</script>`.trim();
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