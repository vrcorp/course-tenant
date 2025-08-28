import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Users, BookOpen, TrendingUp, Star } from 'lucide-react';
import { Instructor } from '../types';

interface Props {
  instructors: Instructor[];
}

export const StatsCards: React.FC<Props> = ({ instructors }) => {
  const totalInstructors = instructors.length;
  const activeInstructors = instructors.filter((i) => i.status === 'active').length;
  const totalCourses = instructors.reduce((sum, i) => sum + i.courses, 0);
  const totalStudents = instructors.reduce((sum, i) => sum + i.students, 0);
  const avgRating =
    instructors.length > 0
      ? (instructors.reduce((sum, i) => sum + i.rating, 0) / instructors.length).toFixed(1)
      : '0.0';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Instructors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInstructors}</div>
          <p className="text-xs text-muted-foreground">{activeInstructors} active</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCourses}</div>
          <p className="text-xs text-muted-foreground">Across all instructors</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Enrolled students</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgRating}</div>
          <p className="text-xs text-muted-foreground">Across all instructors</p>
        </CardContent>
      </Card>
    </div>
  );
};
