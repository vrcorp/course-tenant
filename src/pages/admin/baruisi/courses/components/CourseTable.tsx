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
import { Course, CourseStatus } from '../types';
import CourseStatusBadge from './CourseStatusBadge';

interface Props {
  courses: Course[];
  onEdit: (c: Course) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: CourseStatus) => void;
}

export const CourseTable: React.FC<Props> = ({ courses, onEdit, onDelete, onStatusChange }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="font-semibold">Title</TableHead>
          <TableHead className="font-semibold">Category</TableHead>
          <TableHead className="font-semibold">Status</TableHead>
          <TableHead className="font-semibold text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((c) => (
          <TableRow key={c.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">{c.title}</TableCell>
            <TableCell>{c.category}</TableCell>
            <TableCell>
              <CourseStatusBadge status={c.status} />
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(c)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onStatusChange(c.id, 'draft')}>Mark Draft</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(c.id, 'published')}>Mark Published</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(c.id, 'archived')}>Mark Archived</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => onDelete(c.id)}>
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
