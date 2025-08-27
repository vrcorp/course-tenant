import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Clock, Calendar, Award } from "lucide-react";
import usersData from "@/data/users.json";

export default function MyCourses() {
  const user = usersData[0]; // Using first user as current user
  const [activeTab, setActiveTab] = useState("all");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ongoing: "default",
      completed: "secondary"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status === "ongoing" ? "Sedang Berjalan" : "Selesai"}
      </Badge>
    );
  };

  const filterCourses = (status?: string) => {
    if (!status || status === "all") return user.coursesProgress;
    return user.coursesProgress.filter(course => course.status === status);
  };

  const ongoingCourses = filterCourses("ongoing");
  const completedCourses = filterCourses("completed");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground mt-2">Track your learning progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <PlayCircle className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{user.coursesProgress.length}</p>
                <p className="text-xs text-muted-foreground">Total Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{ongoingCourses.length}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{completedCourses.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{user.totalWatchTime}</p>
                <p className="text-xs text-muted-foreground">Watch Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Courses ({user.coursesProgress.length})</TabsTrigger>
          <TabsTrigger value="ongoing">In Progress ({ongoingCourses.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedCourses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterCourses("all").map((course) => (
              <CourseCard key={course.courseId} course={course} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ongoing" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingCourses.map((course) => (
              <CourseCard key={course.courseId} course={course} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((course) => (
              <CourseCard key={course.courseId} course={course} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseCard({ course }: { course: any }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ongoing: "default",
      completed: "secondary"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status === "ongoing" ? "Sedang Berjalan" : "Selesai"}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{course.title}</CardTitle>
          {getStatusBadge(course.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Enrolled {formatDate(course.enrolledAt)}</span>
          </div>
          {course.status === "completed" && course.completedAt && (
            <div className="flex items-center gap-2 text-green-600">
              <Award className="h-4 w-4" />
              <span>Completed {formatDate(course.completedAt)}</span>
            </div>
          )}
          {course.status === "ongoing" && course.lastAccessed && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Last accessed {formatDate(course.lastAccessed)}</span>
            </div>
          )}
        </div>
        
        <Button className="w-full">
          {course.status === "completed" ? "Review Course" : "Continue Learning"}
        </Button>
      </CardContent>
    </Card>
  );
}