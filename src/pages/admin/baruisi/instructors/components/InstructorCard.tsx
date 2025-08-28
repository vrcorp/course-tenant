import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Star, BookOpen, Users as UsersIcon } from 'lucide-react';
import { Instructor, InstructorStatus } from '../types';
import { InstructorStatusBadge } from './InstructorStatusBadge';
import { formatCurrency } from '@/lib/utils';

interface Props {
  instructor: Instructor;
  onViewDetail: (i: Instructor) => void;
  onEdit: (i: Instructor) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: InstructorStatus) => void;
}

export const InstructorCard: React.FC<Props> = ({
  instructor: i,
  onViewDetail,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <Card>
      <CardHeader className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg cursor-pointer" onClick={() => onViewDetail(i)}>
            {i.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <InstructorStatusBadge status={i.status} />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetail(i)}>View Detail</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(i)}>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusChange(i.id, 'active')}>Mark Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(i.id, 'inactive')}>Mark Inactive</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(i.id, 'suspended')}>Mark Suspended</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(i.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{i.specialization}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> {i.courses} Courses
          </div>
          <div className="flex items-center gap-1">
            <UsersIcon className="h-4 w-4" /> {i.students.toLocaleString()} Students
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> {i.rating.toFixed(1)} Rating
        </div>
        <div className="text-sm font-medium">{formatCurrency(i.totalEarnings)}</div>
      </CardContent>
    </Card>
  );
};
