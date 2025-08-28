import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { AffiliatorStatusBadge } from './AffiliatorStatusBadge';
import { User, AffiliatorStatus } from '../types';
import { formatCurrency } from '@/lib/utils';

interface Props {
  affiliators: User[];
  onViewDetail: (u: User) => void;
  onEdit: (u: User) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: AffiliatorStatus) => void;
}

export const AffiliatorTable: React.FC<Props> = ({
  affiliators,
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
          <TableHead className="font-semibold">Contact</TableHead>
          <TableHead className="font-semibold">Channel</TableHead>
          <TableHead className="font-semibold">Audience</TableHead>
          <TableHead className="font-semibold">Status</TableHead>
          <TableHead className="font-semibold text-right">Commission</TableHead>
          <TableHead className="font-semibold text-right">Earnings</TableHead>
          <TableHead className="font-semibold text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {affiliators.map((u) => (
          <TableRow key={u.id} className="hover:bg-gray-50 transition-colors">
            <TableCell className="font-medium">{u.name}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="text-sm">{u.email}</div>
                {u.phone && <div className="text-xs text-muted-foreground">{u.phone}</div>}
              </div>
            </TableCell>
            <TableCell>{u.channel || '-'}</TableCell>
            <TableCell>{u.audience || '-'}</TableCell>
            <TableCell>
              <AffiliatorStatusBadge status={u.affiliatorStatus} />
            </TableCell>
            <TableCell className="text-right">{u.commissionRate}%</TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(u.totalEarnings || 0)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetail(u)}>
                    View Detail
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(u)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Change status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onStatusChange(u.id, 'active')}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(u.id, 'pending')}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(u.id, 'suspended')}>Suspended</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => onDelete(u.id)}>
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
