import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AffiliatorStatus } from '../types';

interface Props {
  status: AffiliatorStatus;
}

const statusMap: Record<AffiliatorStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-100 text-green-800 border-green-200' },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  suspended: { label: 'Suspended', className: 'bg-red-100 text-red-800 border-red-200' },
};

export const AffiliatorStatusBadge: React.FC<Props> = ({ status }) => {
  const { label, className } = statusMap[status] || statusMap.pending;
  return <Badge variant="outline" className={className}>{label}</Badge>;
};
