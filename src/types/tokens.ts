export interface DesignToken {
  type: 'color' | 'typography' | 'spacing' | 'effect' | 'grid' | 'shadow';
  name: string;
  value: any;
  path: string[];
  metadata: {
    isComponent: boolean;
    isReused: boolean;
    frequency: number;
  };
} 