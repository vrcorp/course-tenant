import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Instructor, InstructorStatus } from '../types';
import { InstructorStatusBadge } from './InstructorStatusBadge';
import { formatCurrency } from '@/lib/utils';

interface Props {
  instructors: Instructor[];
  onViewDetail: (i: Instructor) => void;
  onEdit: (i: Instructor) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: InstructorStatus) => void;
}

export const InstructorTable: React.FC<Props> = ({
  instructors,
  onViewDetail,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="font-semibold">Name</TableHead>
          <TableHead className="font-semibold">Specialization</TableHead>
          <TableHead className="font-semibold text-center">Courses</TableHead>
          <TableHead className="font-semibold text-center">Students</TableHead>
          <TableHead className="font-semibold text-center">Rating</TableHead>
          <TableHead className="font-semibold">Status</TableHead>
          <TableHead className="font-semibold text-right">Earnings</TableHead>
          <TableHead className="font-semibold text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {instructors.map((i) => (
          <TableRow key={i.id} className="hover:bg-gray-50">
            <TableCell className="font-medium cursor-pointer" onClick={() => onViewDetail(i)}>
              {i.name}
            </TableCell>
            <TableCell>{i.specialization}</TableCell>
            <TableCell className="text-center">{i.courses}</TableCell>
            <TableCell className="text-center">{i.students.toLocaleString()}</TableCell>
            <TableCell className="text-center">{i.rating.toFixed(1)}</TableCell>
            <TableCell>
              <InstructorStatusBadge status={i.status} />
            </TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(i.totalEarnings)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetail(i)}>View Detail</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(i)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onStatusChange(i.id, 'active')}>Mark Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(i.id, 'inactive')}>Mark Inactive</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(i.id, 'suspended')}>Mark Suspended</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => onDelete(i.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
