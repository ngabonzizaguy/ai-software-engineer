import { DesignToken, ComponentToken } from '@/types/tokens';
import { CodeGenerationOptions, GeneratedCode, Framework, StyleFormat } from './types';
import { ReactGenerator } from './frameworks/ReactGenerator';
import { VueGenerator } from './frameworks/VueGenerator';
import { AngularGenerator } from './frameworks/AngularGenerator';
import { StyleGenerator } from './styles/StyleGenerator';

export class CodeGenerator {
  private options: CodeGenerationOptions;
  private frameworkGenerator: ReactGenerator | VueGenerator | AngularGenerator;
  private styleGenerator: StyleGenerator;

  constructor(options: CodeGenerationOptions) {
    this.options = options;
    this.frameworkGenerator = this.createFrameworkGenerator(options);
    this.styleGenerator = new StyleGenerator(options);
  }

  private createFrameworkGenerator(options: CodeGenerationOptions) {
    switch (options.framework) {
      case 'vue':
        return new VueGenerator(options);
      case 'angular':
        return new AngularGenerator(options);
      case 'react':
      default:
        return new ReactGenerator(options);
    }
  }

  public async generateFromTokens(tokens: DesignToken[]): Promise<GeneratedCode[]> {
    const generatedCode: GeneratedCode[] = [];

    // Generate global styles
    const styleTokens = tokens.filter(token => 
      ['color', 'typography', 'spacing', 'shadow'].includes(token.type)
    );
    const globalStyles = await this.styleGenerator.generateGlobalStyles(styleTokens);
    generatedCode.push(globalStyles);

    // Generate components
    const componentTokens = tokens.filter((token): token is ComponentToken => 
      token.type === 'component'
    );
    
    for (const componentToken of componentTokens) {
      const componentCode = await this.frameworkGenerator.generateComponent(componentToken);
      const componentStyles = await this.styleGenerator.generateComponentStyles(componentToken);
      
      generatedCode.push(componentCode);
      generatedCode.push(componentStyles);
    }

    // Generate framework-specific module/index file
    if (this.options.framework === 'angular') {
      const moduleFile = await (this.frameworkGenerator as AngularGenerator).generateModule(componentTokens);
      generatedCode.push(moduleFile);
    } else {
      const indexFile = this.generateIndexFile(componentTokens);
      generatedCode.push(indexFile);
    }

    return generatedCode;
  }

  private generateIndexFile(components: ComponentToken[]): GeneratedCode {
    const extension = this.options.typescript ? 'ts' : 'js';
    const imports = components.map(comp => 
      `export { ${comp.value.name} } from './components/${comp.value.name}';`
    ).join('\n');

    return {
      fileName: `index.${extension}`,
      content: imports,
      type: 'index',
      path: []
    };
  }

  public setOptions(options: Partial<CodeGenerationOptions>) {
    this.options = { ...this.options, ...options };
    this.frameworkGenerator = this.createFrameworkGenerator(this.options);
    this.styleGenerator = new StyleGenerator(this.options);
  }
} 