import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Users as UsersIcon,
  BookOpen,
  Star,
  DollarSign,
} from 'lucide-react';
import { Instructor } from '../types';
import { InstructorStatusBadge } from './InstructorStatusBadge';
import { formatCurrency } from '@/lib/utils';

interface Props {
  instructor: Instructor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InstructorDetailModal: React.FC<Props> = ({ instructor, isOpen, onClose }) => {
  if (!instructor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle>Instructor Detail</DialogTitle>
          <DialogDescription>Full information about the instructor</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={instructor.avatar} alt={instructor.name} />
              <AvatarFallback>{instructor.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{instructor.name}</h2>
              <p className="text-muted-foreground text-sm">{instructor.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <InstructorStatusBadge status={instructor.status} />
                <Badge variant="secondary">{instructor.specialization}</Badge>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold">{instructor.courses}</div>
                <div className="text-xs text-muted-foreground">Courses</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold">{instructor.students.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Students</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="font-semibold">{instructor.rating.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-semibold">{formatCurrency(instructor.totalEarnings)}</div>
                <div className="text-xs text-muted-foreground">Total Earnings</div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-2">Contact</h3>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" /> {instructor.email}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
