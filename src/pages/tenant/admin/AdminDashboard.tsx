import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TenantLayout from '@/components/tenant/TenantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Users,
  BookOpen,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Award,
  Eye,
  Calendar,
  Clock,
} from 'lucide-react';
import tenants from '@/data/tenants.json';
import tenantCourses from '@/data/tenant_courses.json';

export default function AdminDashboard() {
  const { tenantSlug } = useParams();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeStudents: 0,
    completionRate: 0,
    newStudentsThisMonth: 0,
    revenueThisMonth: 0,
  });

  const tenant = (tenants as any[]).find((t) => t.slug === tenantSlug);
  const coursesEntry = (tenantCourses as any[]).find((c) => c.tenantId === tenant?.id);
  const courses = coursesEntry?.courses || [];

  useEffect(() => {
    // Simulate fetching dashboard stats
    const simulateStats = () => {
      setStats({
        totalStudents: Math.floor(Math.random() * 500) + 100,
        totalCourses: courses.length,
        totalOrders: Math.floor(Math.random() * 200) + 50,
        totalRevenue: Math.floor(Math.random() * 50000) + 10000,
        activeStudents: Math.floor(Math.random() * 300) + 50,
        completionRate: Math.floor(Math.random() * 40) + 60,
        newStudentsThisMonth: Math.floor(Math.random() * 50) + 10,
        revenueThisMonth: Math.floor(Math.random() * 10000) + 2000,
      });
    };

    simulateStats();
  }, [courses.length]);

  const recentActivities = [
    { type: 'order', message: 'Pesanan baru dari John Doe', time: '5 menit lalu' },
    { type: 'student', message: 'Siswa baru mendaftar: Jane Smith', time: '15 menit lalu' },
    { type: 'course', message: 'Kursus "React Fundamentals" selesai diupdate', time: '1 jam lalu' },
    { type: 'certificate', message: '3 sertifikat baru diterbitkan', time: '2 jam lalu' },
    { type: 'review', message: 'Review baru untuk kursus JavaScript', time: '3 jam lalu' },
  ];

  const topCourses = courses.slice(0, 5).map((course: any) => ({
    ...course,
    students: Math.floor(Math.random() * 100) + 10,
    revenue: Math.floor(Math.random() * 5000) + 500,
  }));

  return (
    <TenantLayout showSidebar sidebarType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-muted-foreground">
              Selamat datang di panel admin {tenant?.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
              Online
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.newStudentsThisMonth} bulan ini
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kursus</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {Math.floor(stats.totalCourses * 0.8)} aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {Math.floor(stats.totalOrders * 0.9)} berhasil
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +${stats.revenueThisMonth.toLocaleString()} bulan ini
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Siswa Aktif</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeStudents}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.activeStudents / stats.totalStudents) * 100)}% dari total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tingkat Penyelesaian</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Rata-rata semua kursus
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waktu Belajar Rata-rata</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5 jam</div>
              <p className="text-xs text-muted-foreground">
                Per siswa per minggu
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Kursus Terpopuler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCourses.map((course: any, index) => (
                  <div key={course.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.students} siswa
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${course.revenue}</p>
                      <p className="text-sm text-muted-foreground">pendapatan</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-20 flex-col gap-2">
                <BookOpen className="h-6 w-6" />
                Tambah Kursus
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="h-6 w-6" />
                Kelola Siswa
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <ShoppingCart className="h-6 w-6" />
                Lihat Pesanan
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                Analitik Detail
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TenantLayout>
  );
}
