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
import { format } from 'date-fns';

import { Assignment, AssignmentStatus } from '../types';
import AssignmentStatusBadge from './AssignmentStatusBadge';

interface Props {
  assignments: Assignment[];
  onEdit: (a: Assignment) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: AssignmentStatus) => void;
}

export const AssignmentTable: React.FC<Props> = ({ assignments, onEdit, onDelete, onStatusChange }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="font-semibold">Title</TableHead>
          <TableHead className="font-semibold">Due Date</TableHead>
          <TableHead className="font-semibold">Status</TableHead>
          <TableHead className="font-semibold text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((a) => (
          <TableRow key={a.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">{a.title}</TableCell>
            <TableCell>{format(new Date(a.dueDate), 'yyyy-MM-dd')}</TableCell>
            <TableCell>
              <AssignmentStatusBadge status={a.status} />
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(a)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onStatusChange(a.id, 'open')}>Mark Open</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(a.id, 'closed')}>Mark Closed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(a.id, 'overdue')}>Mark Overdue</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => onDelete(a.id)}>
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
