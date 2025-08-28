export type AffiliatorStatus = 'active' | 'pending' | 'suspended';

export interface SocialMedia {
  website?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

// Keeping the name `User` to avoid touching any existing logic that references this type.
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  socialMedia: SocialMedia;
  channel: string;
  audience: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
  affiliatorStatus: AffiliatorStatus;
  commissionRate: number;
  totalEarnings: number;
  totalPayouts: number;
  totalReferrals: number;
  notes?: string;
}
