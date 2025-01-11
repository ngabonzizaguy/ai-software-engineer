import { DesignToken, ComponentToken } from '@/types/tokens';

export type Framework = 'react' | 'vue' | 'angular';
export type StyleFormat = 'css' | 'scss' | 'tailwind';

export interface CodeGenerationOptions {
  framework: Framework;
  styleFormat: StyleFormat;
  typescript: boolean;
  prettier: boolean;
}

export interface GeneratedCode {
  fileName: string;
  content: string;
  type: 'component' | 'style' | 'type' | 'index';
  path: string[];
}

export interface ComponentTemplate {
  imports: string[];
  props: Record<string, string>;
  jsx: string;
  styles: Record<string, string>;
}

export interface StyleTemplate {
  variables: Record<string, string>;
  classes: Record<string, Record<string, string>>;
  utilities: Record<string, string>;
} 