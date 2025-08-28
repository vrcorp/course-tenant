import { Badge } from '@/components/ui/badge';
import { CourseStatus } from '../types';

const statusMap: Record<CourseStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-orange-100 text-orange-700',
};

export default function CourseStatusBadge({ status }: { status: CourseStatus }) {
  return <Badge className={statusMap[status]}>{status}</Badge>;
}
