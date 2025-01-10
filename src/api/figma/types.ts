export interface FigmaFile {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  document: any;
}

export interface FigmaComponent {
  key: string;
  name: string;
  description: string;
  documentationLinks: string[];
}

export interface FigmaComment {
  id: string;
  uuid: string;
  file_key: string;
  parent_id: string;
  user: {
    id: string;
    handle: string;
    img_url: string;
  };
  created_at: string;
  resolved_at: string | null;
  message: string;
  client_meta: any;
  order_id: string;
}

export interface FigmaResponse<T> {
  error: boolean;
  status: number;
  meta: T;
  i18n: any;
} 