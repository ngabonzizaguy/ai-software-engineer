export interface TokenSet {
  colors: Record<string, string>;
  typography: Record<string, TypographyToken>;
  spacing: Record<string, string>;
  shadows: Record<string, string>;
}

export interface TypographyToken {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: string;
}

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Paint {
  type: string;
  color?: RGBA;
  opacity?: number;
  blendMode?: string;
}

export interface Effect {
  type: string;
  color: RGBA;
  offset: {
    x: number;
    y: number;
  };
  radius: number;
  spread?: number;
}

export interface LayoutConstraint {
  vertical: 'TOP' | 'BOTTOM' | 'CENTER' | 'SCALE';
  horizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'SCALE';
}

export interface ComponentProperties {
  [key: string]: {
    type: string;
    defaultValue: any;
  };
}

export interface DesignToken {
  id: string;
  name: string;
  type: 'color' | 'typography' | 'spacing' | 'shadow' | 'component';
  path: string[];
  value: any;
  isComponent?: boolean;
}

export interface TokenMetadata {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  category?: string;
  deprecated?: boolean;
  deprecationReason?: string;
  status?: 'draft' | 'review' | 'approved' | 'deprecated';
  createdAt: number;
  updatedAt: number;
  author?: string;
} 