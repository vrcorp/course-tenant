import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '../types';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onViewDetail: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, onViewDetail }) => {
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Kontak</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Kursus</TableHead>
          <TableHead>Total Belanja (Rp)</TableHead>
          <TableHead>Bergabung</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.location}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <div>{user.email}</div>
                <div className="text-muted-foreground">{user.phone}</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                {getStatusBadge(user.status)}
                {user.verified && <Badge variant="outline" className="text-green-600">✓</Badge>}
              </div>
            </TableCell>
            <TableCell>
              {getRoleBadge(user.role)}
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <div>{user.coursesProgress?.length || 0} terdaftar</div>
                <div className="text-muted-foreground">{user.coursesProgress?.filter(course => course.progress === 100).length || 0} selesai</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                Rp{user.coursesProgress?.reduce((sum, course) => sum + (course.price || 0), 0).toLocaleString('id-ID')}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {new Date(user.joinDate).toLocaleDateString('id-ID')}
              </div>
            </TableCell>
            <TableCell className="text-right">
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
