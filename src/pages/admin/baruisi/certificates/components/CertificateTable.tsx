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
import { Certificate } from '../types';
import CertificateStatusBadge from './CertificateStatusBadge';

interface Props {
  certificates: Certificate[];
  onEdit: (c: Certificate) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
}

export const CertificateTable: React.FC<Props> = ({ certificates, onEdit, onDelete, onTogglePublish }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="font-semibold">Template</TableHead>
          <TableHead className="font-semibold">Issuer</TableHead>
          <TableHead className="font-semibold">Status</TableHead>
          <TableHead className="font-semibold text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {certificates.map((c) => (
          <TableRow key={c.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">{c.template}</TableCell>
            <TableCell>{c.issuer}</TableCell>
            <TableCell>
              <CertificateStatusBadge published={c.published} />
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
                  <DropdownMenuItem onClick={() => onTogglePublish(c.id)}>
                    <Eye className="mr-2 h-4 w-4" /> {c.published ? 'Unpublish' : 'Publish'}
                  </DropdownMenuItem>
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
