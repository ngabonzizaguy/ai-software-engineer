import { FigmaComponent, FigmaComment, FigmaFile } from '../api/figma/types';

export const processFigmaComponents = (components: FigmaComponent[]) => {
  return components.map(component => ({
    id: component.key,
    name: component.name,
    docs: component.documentationLinks
  }));
};

export const processFigmaComments = (comments: FigmaComment[]) => {
  return comments.map(comment => ({
    id: comment.id,
    message: comment.message,
    author: comment.user.handle,
    date: new Date(comment.created_at),
    resolved: !!comment.resolved_at
  }));
};

// New utilities
export const extractFileMetadata = (file: FigmaFile) => {
  return {
    name: file.name,
    lastModified: new Date(file.lastModified),
    version: file.version,
    thumbnail: file.thumbnailUrl
  };
};

export const extractColors = (file: FigmaFile) => {
  // Recursive function to find color styles
  const findColors = (node: any): string[] => {
    const colors: string[] = [];
    
    if (node.styles) {
      Object.entries(node.styles).forEach(([_, style]: [string, any]) => {
        if (style.type === 'FILL' && style.color) {
          colors.push(style.color);
        }
      });
    }
    
    if (node.children) {
      node.children.forEach((child: any) => {
        colors.push(...findColors(child));
      });
    }
    
    return [...new Set(colors)]; // Remove duplicates
  };

  return findColors(file.document);
};

export const extractTextStyles = (file: FigmaFile) => {
  const findTextStyles = (node: any): any[] => {
    const styles: any[] = [];
    
    if (node.type === 'TEXT') {
      styles.push({
        font: node.style?.fontFamily,
        size: node.style?.fontSize,
        weight: node.style?.fontWeight
      });
    }
    
    if (node.children) {
      node.children.forEach((child: any) => {
        styles.push(...findTextStyles(child));
      });
    }
    
    return styles;
  };

  return findTextStyles(file.document);
}; 