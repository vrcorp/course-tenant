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
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Quiz, QuizStatus } from '../types';
import QuizStatusBadge from './QuizStatusBadge';
import { getCourseTitle } from '../data';

interface Props {
  quizzes: Quiz[];
  onEdit: (q: Quiz) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: QuizStatus) => void;
  onView: (q: Quiz) => void;
}

export const QuizTable: React.FC<Props> = ({ quizzes, onEdit, onDelete, onStatusChange, onView }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="font-semibold">Title</TableHead>
          <TableHead className="font-semibold">Course</TableHead>
          <TableHead className="font-semibold text-center">Qtns</TableHead>
          <TableHead className="font-semibold">Created</TableHead>
          <TableHead className="font-semibold">Status</TableHead>
          <TableHead className="font-semibold text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quizzes.map((q) => (
          <TableRow key={q.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">{q.title}</TableCell>
            <TableCell>{getCourseTitle(q.courseId)}</TableCell>
            <TableCell className="text-center">{q.questions.length}</TableCell>
            <TableCell>{new Date(q.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <QuizStatusBadge status={q.status} />
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(q)}>
                    <Eye className="mr-2 h-4 w-4" /> View Questions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(q)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onStatusChange(q.id, 'draft')}>Mark Draft</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(q.id, 'published')}>Mark Published</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(q.id, 'archived')}>Mark Archived</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => onDelete(q.id)}>
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
