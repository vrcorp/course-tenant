import { Badge } from '@/components/ui/badge';
import { AssignmentStatus } from '../types';

const statusMap: Record<AssignmentStatus, string> = {
  open: 'bg-blue-100 text-blue-700',
  closed: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
};

export default function AssignmentStatusBadge({ status }: { status: AssignmentStatus }) {
  return <Badge className={statusMap[status]}>{status}</Badge>;
}
