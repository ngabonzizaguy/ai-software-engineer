/// <reference types="jest" />
import { CodeGenerator } from '../CodeGenerator';
import { DesignToken, ComponentToken } from '@/types/tokens';
import { CodeGenerationOptions } from '../types';
import type { Describe, Lifecycle, It, Expect } from '@jest/types';

// Add Jest type declarations
declare const describe: Describe;
declare const beforeEach: Lifecycle;
declare const it: It;
declare const expect: Expect;

describe('CodeGenerator', () => {
  let generator: CodeGenerator;
  const defaultOptions: CodeGenerationOptions = {
    framework: 'react',
    styleFormat: 'css',
    typescript: true,
    prettier: true
  };

  beforeEach(() => {
    generator = new CodeGenerator(defaultOptions);
  });

  describe('generateFromTokens', () => {
    it('should generate code for all tokens', async () => {
      const mockTokens: DesignToken[] = [
        {
          id: 'color-1',
          name: 'Primary',
          type: 'color',
          path: ['colors'],
          value: { r: 0.1, g: 0.2, b: 0.3, a: 1 }
        },
        {
          id: 'button-1',
          name: 'Button',
          type: 'component',
          path: ['components'],
          isComponent: true,
          value: {
            id: '1',
            name: 'Button',
            key: 'btn-1',
            remote: false,
            styles: {
              layout: {
                layoutMode: 'HORIZONTAL',
                layoutConstraint: {
                  vertical: 'TOP',
                  horizontal: 'LEFT'
                }
              }
            }
          }
        }
      ];

      const result = await generator.generateFromTokens(mockTokens);
      
      expect(result).toHaveLength(4); // Global styles + Component + Component styles + Index
      expect(result.find(r => r.type === 'style' && r.fileName === 'global.css')).toBeTruthy();
      expect(result.find(r => r.type === 'component' && r.fileName === 'Button.tsx')).toBeTruthy();
      expect(result.find(r => r.type === 'style' && r.fileName === 'Button.css')).toBeTruthy();
      expect(result.find(r => r.type === 'index')).toBeTruthy();
    });

    it('should handle different frameworks', async () => {
      generator.setOptions({ framework: 'vue' });
      const mockComponent: ComponentToken = {
        id: 'button-1',
        name: 'Button',
        type: 'component',
        path: ['components'],
        isComponent: true,
        value: {
          id: '1',
          name: 'Button',
          key: 'btn-1',
          remote: false,
          styles: {
            layout: {
              layoutMode: 'HORIZONTAL',
              layoutConstraint: {
                vertical: 'TOP',
                horizontal: 'LEFT'
              }
            }
          }
        }
      };

      const result = await generator.generateFromTokens([mockComponent]);
      const component = result.find(r => r.type === 'component');
      
      expect(component?.fileName).toMatch(/\.vue$/);
    });

    it('should generate Angular components and module', async () => {
      generator.setOptions({ framework: 'angular' });
      const mockComponent: ComponentToken = {
        id: 'button-1',
        name: 'Button',
        type: 'component',
        path: ['components'],
        isComponent: true,
        value: {
          id: '1',
          name: 'Button',
          key: 'btn-1',
          remote: false,
          styles: {
            layout: {
              layoutMode: 'HORIZONTAL',
              layoutConstraint: {
                vertical: 'TOP',
                horizontal: 'LEFT'
              }
            }
          }
        }
      };

      const result = await generator.generateFromTokens([mockComponent]);
      const component = result.find(r => r.type === 'component');
      const module = result.find(r => r.type === 'module');
      
      expect(component?.fileName).toMatch(/\.component\.ts$/);
      expect(component?.content).toContain('@Component');
      expect(component?.content).toContain('selector: \'app-button\'');
      expect(module?.fileName).toBe('components.module.ts');
      expect(module?.content).toContain('@NgModule');
      expect(module?.content).toContain('ButtonComponent');
    });

    it('should handle different style formats', async () => {
      generator.setOptions({ styleFormat: 'scss' });
      const mockColor: DesignToken = {
        id: 'color-1',
        name: 'Primary',
        type: 'color',
        path: ['colors'],
        value: { r: 0.1, g: 0.2, b: 0.3, a: 1 }
      };

      const result = await generator.generateFromTokens([mockColor]);
      const styles = result.find(r => r.type === 'style');
      
      expect(styles?.fileName).toMatch(/\.scss$/);
      expect(styles?.content).toContain('$');
    });
  });
}); 