import affiliatorsJsonData from '@/data/affiliators.json';
import { User } from './types';

// Map raw JSON (could be empty) into User[] with sensible defaults
export const affiliatorsData: User[] = (affiliatorsJsonData as any[]).map((a: any) => ({
  ...a,
  phone: a.phone || '',
  socialMedia: a.socialMedia || {},
  channel: a.channel || '',
  audience: a.audience || '',
  role: a.role || 'affiliator',
  createdAt: a.createdAt || new Date().toISOString(),
  affiliatorStatus: (a.affiliatorStatus as any) || 'pending',
  commissionRate: a.commissionRate ?? 20,
  totalEarnings: a.totalEarnings ?? 0,
  totalPayouts: a.totalPayouts ?? 0,
  totalReferrals: a.totalReferrals ?? 0,
}));
