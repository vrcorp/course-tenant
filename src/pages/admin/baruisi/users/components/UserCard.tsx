import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '../types';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onViewDetail: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete, onViewDetail }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Aktif</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Tidak Aktif</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default" className="bg-purple-500">Admin</Badge>;
      case 'instructor':
        return <Badge variant="default" className="bg-blue-500">Instructor</Badge>;
      case 'affiliator':
        return <Badge variant="default" className="bg-orange-500">Affiliator</Badge>;
      case 'user':
        return <Badge variant="outline">Siswa</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{user.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge(user.status)}
                {getRoleBadge(user.role)}
                {user.verified && <Badge variant="outline" className="text-green-600">✓ Verified</Badge>}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetail(user)}>
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(user.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Mail className="h-3 w-3 mr-2" />
            {user.email}
          </div>
          <div className="flex items-center">
            <Phone className="h-3 w-3 mr-2" />
            {user.phone}
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Kursus Terdaftar</div>
            <div className="font-medium">{user.coursesProgress?.length || 0} terdaftar</div>
          </div>
          <div>
            <div className="text-muted-foreground">Subscription</div>
            <div className="font-medium">{user.subscription}</div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {user.location}
            <Calendar className="h-3 w-3 ml-4 mr-1" />
            Bergabung {new Date(user.joinDate).toLocaleDateString('id-ID')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
