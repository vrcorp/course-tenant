import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Mail, Award, Phone, User, Users, DollarSign } from 'lucide-react';
import { AffiliatorStatusBadge } from './AffiliatorStatusBadge';
import { User as AffiliatorUser, AffiliatorStatus } from '../types';
import { formatCurrency } from '@/lib/utils';

interface Props {
  affiliator: AffiliatorUser;
  onViewDetail: (u: AffiliatorUser) => void;
  onEdit: (u: AffiliatorUser) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: AffiliatorStatus) => void;
}

export const AffiliatorCard: React.FC<Props> = ({
  affiliator: u,
  onViewDetail,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{u.name}</h3>
            <div className="flex items-center mt-1">
              <AffiliatorStatusBadge status={u.affiliatorStatus} />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetail(u)}>View Detail</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(u)}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onStatusChange(u.id, 'active')}>Mark Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(u.id, 'pending')}>Mark Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(u.id, 'suspended')}>Mark Suspended</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => onDelete(u.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-1" /> Email
              </div>
              <div className="text-sm font-medium">{u.email}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Award className="h-4 w-4 mr-1" /> Commission
              </div>
              <div className="text-sm font-medium">{u.commissionRate}%</div>
            </div>
          </div>

          {u.phone && (
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-1" /> Phone
              </div>
              <div className="text-sm font-medium">{u.phone}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-1" /> Channel
              </div>
              <div className="text-sm font-medium">{u.channel || '-'}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" /> Audience
              </div>
              <div className="text-sm font-medium">{u.audience || '-'}</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-1" /> Earnings
            </div>
            <div className="text-sm font-medium">{formatCurrency(u.totalEarnings || 0)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
