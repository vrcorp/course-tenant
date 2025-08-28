import React from 'react';
import { Badge } from '@/components/ui/badge';
import { InstructorStatus } from '../types';

interface Props { status: InstructorStatus }

export const InstructorStatusBadge: React.FC<Props> = ({ status }) => {
  switch (status) {
    case 'active':
      return <Badge variant="default" className="bg-green-500">Active</Badge>;
    case 'inactive':
      return <Badge variant="secondary">Inactive</Badge>;
    case 'suspended':
      return <Badge variant="destructive">Suspended</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};
