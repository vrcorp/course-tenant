export interface CertificateElement {
  id: string;
  type: 'text' | 'image' | 'signature';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
}

export interface Certificate {
  id: string;
  name: string;
  description: string;
  backgroundImage?: string;
  width: number;
  height: number;
  elements: CertificateElement[];
  issuer: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
