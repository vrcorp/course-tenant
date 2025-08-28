import { Badge } from '@/components/ui/badge';

export default function CertificateStatusBadge({ published }: { published: boolean }) {
  return (
    <Badge className={published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
      {published ? 'Published' : 'Draft'}
    </Badge>
  );
}
