import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users as UsersIcon,
  UserCheck,
  GraduationCap,
  TrendingUp
} from 'lucide-react';
import { User } from '../types';

interface StatsCardsProps {
  users: User[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ users }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalEnrollments = users.reduce((sum, u) => sum + (u.coursesProgress?.length || 0), 0);
  const completedCourses = users.reduce((sum, u) => {
    const completed = u.coursesProgress?.filter(course => course.progress === 100).length || 0;
    return sum + completed;
  }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Semua pengguna terdaftar
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Users Aktif</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}% dari total users
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEnrollments}</div>
          <p className="text-xs text-muted-foreground">
            Kursus yang diambil
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {completedCourses}
          </div>
          <p className="text-xs text-muted-foreground">
            Kursus yang diselesaikan
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
