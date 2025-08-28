import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User } from '../types';

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, isOpen, onClose }) => {
  if (!user) return null;

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail User</DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang user
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center space-x-2 mt-2">
                {getStatusBadge(user.status)}
                {getRoleBadge(user.role)}
                {user.verified && <Badge variant="outline" className="text-green-600">✓ Verified</Badge>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Informasi Kontak</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Informasi Akun</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Bergabung: {new Date(user.joinDate).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Login Terakhir: {new Date(user.lastLogin).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Statistik Pembelajaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{user.coursesProgress?.length || 0}</div>
                    <div className="text-sm text-blue-600">Kursus Terdaftar</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">{user.coursesProgress?.filter(course => course.progress === 100).length || 0}</div>
                    <div className="text-sm text-green-600">Kursus Selesai</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{user.subscription}</div>
                    <div className="text-sm text-orange-600">Subscription</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Progress Pembelajaran</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Tingkat Penyelesaian</span>
                <span className="text-sm text-muted-foreground">
                  {user.coursesProgress?.filter(course => course.progress === 100).length || 0}/{user.coursesProgress?.length || 0} kursus
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${(user.coursesProgress?.length || 0) > 0 ? ((user.coursesProgress?.filter(course => course.progress === 100).length || 0) / (user.coursesProgress?.length || 0)) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <div className="text-right text-sm text-muted-foreground mt-1">
                {(user.coursesProgress?.length || 0) > 0 ? Math.round(((user.coursesProgress?.filter(course => course.progress === 100).length || 0) / (user.coursesProgress?.length || 0)) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
