import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Star,
  BookOpen,
  Users,
  TrendingUp
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

// Dummy data for instructors
const instructorsData = [
  {
    id: 1,
    name: 'Dr. Ahmad Wijaya',
    email: 'ahmad.wijaya@example.com',
    avatar: '/avatars/instructor1.jpg',
    specialization: 'Web Development',
    courses: 12,
    students: 1250,
    rating: 4.8,
    status: 'active',
    joinDate: '2023-01-15',
    totalEarnings: 'Rp 45,000,000'
  },
  {
    id: 2,
    name: 'Prof. Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: '/avatars/instructor2.jpg',
    specialization: 'Data Science',
    courses: 8,
    students: 890,
    rating: 4.9,
    status: 'active',
    joinDate: '2023-03-20',
    totalEarnings: 'Rp 32,500,000'
  },
  {
    id: 3,
    name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    avatar: '/avatars/instructor3.jpg',
    specialization: 'Mobile Development',
    courses: 6,
    students: 650,
    rating: 4.7,
    status: 'active',
    joinDate: '2023-05-10',
    totalEarnings: 'Rp 28,000,000'
  },
  {
    id: 4,
    name: 'Lisa Permata',
    email: 'lisa.permata@example.com',
    avatar: '/avatars/instructor4.jpg',
    specialization: 'UI/UX Design',
    courses: 10,
    students: 1100,
    rating: 4.8,
    status: 'inactive',
    joinDate: '2023-02-28',
    totalEarnings: 'Rp 38,500,000'
  },
  {
    id: 5,
    name: 'Rizki Pratama',
    email: 'rizki.pratama@example.com',
    avatar: '/avatars/instructor5.jpg',
    specialization: 'Digital Marketing',
    courses: 15,
    students: 1800,
    rating: 4.9,
    status: 'active',
    joinDate: '2022-11-12',
    totalEarnings: 'Rp 52,000,000'
  }
];

const AdminInstructors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [instructors] = useState(instructorsData);

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInstructors = instructors.length;
  const activeInstructors = instructors.filter(i => i.status === 'active').length;
  const totalCourses = instructors.reduce((sum, i) => sum + i.courses, 0);
  const totalStudents = instructors.reduce((sum, i) => sum + i.students, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Instruktur</h1>
          <p className="text-muted-foreground">
            Kelola instruktur dan monitor performa mereka
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Instruktur
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instruktur</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInstructors}</div>
            <p className="text-xs text-muted-foreground">
              {activeInstructors} aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kursus</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Dari semua instruktur
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Siswa terdaftar
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(instructors.reduce((sum, i) => sum + i.rating, 0) / instructors.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Dari semua instruktur
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Instruktur</CardTitle>
          <CardDescription>
            Kelola dan monitor semua instruktur di platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari instruktur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Instructors Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instruktur</TableHead>
                  <TableHead>Spesialisasi</TableHead>
                  <TableHead>Kursus</TableHead>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Pendapatan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstructors.map((instructor) => (
                  <TableRow key={instructor.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={instructor.avatar} alt={instructor.name} />
                          <AvatarFallback>
                            {instructor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{instructor.name}</div>
                          <div className="text-sm text-muted-foreground">{instructor.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{instructor.specialization}</Badge>
                    </TableCell>
                    <TableCell>{instructor.courses}</TableCell>
                    <TableCell>{instructor.students.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{instructor.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={instructor.status === 'active' ? 'default' : 'secondary'}
                      >
                        {instructor.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{instructor.totalEarnings}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInstructors;
