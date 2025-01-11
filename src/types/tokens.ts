export interface Vector2D {
  x: number;
  y: number;
}

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Effect {
  type: 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
  visible: boolean;
  radius: number;
  color?: RGBA;
  offset?: Vector2D;
  spread?: number;
}

export interface Paint {
  type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE' | 'EMOJI';
  visible: boolean;
  opacity?: number;
  color?: RGBA;
  gradientStops?: Array<{
    position: number;
    color: RGBA;
  }>;
  gradientHandlePositions?: Vector2D[];
  imageRef?: string;
  scaleMode?: 'FILL' | 'FIT' | 'CROP' | 'TILE';
}

export interface LayoutConstraint {
  vertical: 'TOP' | 'BOTTOM' | 'CENTER' | 'TOP_BOTTOM' | 'SCALE';
  horizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'LEFT_RIGHT' | 'SCALE';
}

export interface Typography {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number | { value: number; unit: 'PIXELS' | 'PERCENT' };
  textDecoration: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';
  textCase: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';
}

export interface ComponentProperties {
  name: string;
  description?: string;
  key: string;
  remote: boolean;
  documentationLinks: string[];
}

export type TokenType = 
  | 'color'
  | 'typography'
  | 'spacing'
  | 'sizing'
  | 'border'
  | 'shadow'
  | 'opacity'
  | 'layout'
  | 'component';

export interface BaseToken {
  id: string;
  name: string;
  description?: string;
  type: TokenType;
  path: string[];
  isComponent?: boolean;
  componentProperties?: ComponentProperties;
}

export interface ColorToken extends BaseToken {
  type: 'color';
  value: RGBA;
}

export interface TypographyToken extends BaseToken {
  type: 'typography';
  value: Typography;
}

export interface SpacingToken extends BaseToken {
  type: 'spacing';
  value: number;
  unit: 'PIXELS' | 'PERCENT' | 'AUTO';
}

export interface SizingToken extends BaseToken {
  type: 'sizing';
  value: number;
  unit: 'PIXELS' | 'PERCENT' | 'AUTO';
}

export interface BorderToken extends BaseToken {
  type: 'border';
  value: {
    strokeWeight: number;
    strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER';
    dashPattern: number[];
    paint: Paint;
  };
}

export interface ShadowToken extends BaseToken {
  type: 'shadow';
  value: Effect;
}

export interface OpacityToken extends BaseToken {
  type: 'opacity';
  value: number;
}

export interface LayoutToken extends BaseToken {
  type: 'layout';
  value: {
    layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'GRID';
    layoutConstraint: LayoutConstraint;
    padding?: { top: number; right: number; bottom: number; left: number };
    itemSpacing?: number;
    counterAxisSpacing?: number;
  };
}

export interface ComponentToken extends BaseToken {
  type: 'component';
  value: {
    id: string;
    name: string;
    description?: string;
    remote: boolean;
    key: string;
    styles: {
      fills?: Paint[];
      strokes?: Paint[];
      effects?: Effect[];
      layout: LayoutToken['value'];
      typography?: Typography;
    };
    children?: ComponentToken[];
  };
}

export type DesignToken =
  | ColorToken
  | TypographyToken
  | SpacingToken
  | SizingToken
  | BorderToken
  | ShadowToken
  | OpacityToken
  | LayoutToken
  | ComponentToken; 