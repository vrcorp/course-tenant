import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  PlayCircle, 
  Trophy, 
  TrendingUp,
  Users,
  Video
} from 'lucide-react';

interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextLesson: string;
  timeSpent: string;
  category: string;
}

interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'live' | 'completed';
}

const Beranda = () => {
  // Mock data - in real app, this would come from API
  const enrolledCourses: EnrolledCourse[] = [
    {
      id: '1',
      title: 'React Development Masterclass',
      instructor: 'John Smith',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      nextLesson: 'Advanced Hooks',
      timeSpent: '12h 30m',
      category: 'Web Development'
    },
    {
      id: '2',
      title: 'UI/UX Design Fundamentals',
      instructor: 'Sarah Johnson',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop',
      progress: 30,
      totalLessons: 18,
      completedLessons: 5,
      nextLesson: 'Color Theory',
      timeSpent: '8h 15m',
      category: 'Design'
    },
    {
      id: '3',
      title: 'Python for Data Science',
      instructor: 'Mike Chen',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=200&fit=crop',
      progress: 85,
      totalLessons: 20,
      completedLessons: 17,
      nextLesson: 'Machine Learning Basics',
      timeSpent: '25h 45m',
      category: 'Data Science'
    }
  ];

  const liveClasses: LiveClass[] = [
    {
      id: '1',
      title: 'React State Management Q&A',
      instructor: 'John Smith',
      date: '2024-01-15',
      time: '14:00',
      duration: '1h 30m',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Design System Workshop',
      instructor: 'Sarah Johnson',
      date: '2024-01-16',
      time: '10:00',
      duration: '2h',
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Data Visualization with Python',
      instructor: 'Mike Chen',
      date: '2024-01-14',
      time: '16:00',
      duration: '1h',
      status: 'completed'
    }
  ];

  const stats = {
    totalCourses: enrolledCourses.length,
    completedCourses: 2,
    totalHours: 46.5,
    certificates: 2
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Portal Siswa - Beranda
          </h1>
          <p className="text-gray-600 text-lg">
            Selamat datang kembali! Mari lanjutkan perjalanan belajar Anda.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Kursus</p>
                  <p className="text-3xl font-bold">{stats.totalCourses}</p>
                </div>
                <BookOpen className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Kursus Selesai</p>
                  <p className="text-3xl font-bold">{stats.completedCourses}</p>
                </div>
                <Trophy className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Jam Belajar</p>
                  <p className="text-3xl font-bold">{stats.totalHours}h</p>
                </div>
                <Clock className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Sertifikat</p>
                  <p className="text-3xl font-bold">{stats.certificates}</p>
                </div>
                <TrendingUp className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Kursus Terdaftar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-24 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{course.title}</h3>
                            <p className="text-gray-600">oleh {course.instructor}</p>
                            <Badge variant="secondary" className="mt-1">
                              {course.category}
                            </Badge>
                          </div>
                          <Button size="sm" className="shrink-0">
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Lanjutkan
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Progress: {course.completedLessons}/{course.totalLessons} pelajaran</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Selanjutnya: {course.nextLesson}</span>
                            <span>Waktu belajar: {course.timeSpent}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Live Classes Schedule */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Jadwal Live Class
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {liveClasses.map((liveClass) => (
                  <div key={liveClass.id} className="border rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={liveClass.status === 'live' ? 'destructive' : 
                                  liveClass.status === 'upcoming' ? 'default' : 'secondary'}
                        >
                          {liveClass.status === 'live' ? 'LIVE' : 
                           liveClass.status === 'upcoming' ? 'Mendatang' : 'Selesai'}
                        </Badge>
                        {liveClass.status === 'upcoming' && (
                          <Video className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      
                      <h4 className="font-semibold">{liveClass.title}</h4>
                      <p className="text-sm text-gray-600">oleh {liveClass.instructor}</p>
                      
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(liveClass.date).toLocaleDateString('id-ID')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{liveClass.time} ({liveClass.duration})</span>
                        </div>
                      </div>
                      
                      {liveClass.status === 'upcoming' && (
                        <Button size="sm" className="w-full mt-2">
                          <Users className="h-4 w-4 mr-2" />
                          Bergabung
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beranda;
