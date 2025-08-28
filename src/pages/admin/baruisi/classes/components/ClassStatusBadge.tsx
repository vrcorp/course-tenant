import { Badge } from '@/components/ui/badge';
import { ClassStatus } from '../types';

const statusMap: Record<ClassStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  ongoing: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

export default function ClassStatusBadge({ status }: { status: ClassStatus }) {
  return <Badge className={statusMap[status]}>{status}</Badge>;
}
