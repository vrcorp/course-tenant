import certificatesJson from '@/data/certificates.json';
import { Certificate } from './types';

export const certificatesData: Certificate[] = Array.isArray(certificatesJson)
  ? (certificatesJson as any[]).map((c) => ({
      id: String(c.id),
      template: c.template ?? 'Default',
      issuer: c.issuer ?? 'Unknown',
      published: !!c.published,
    }))
  : [];
