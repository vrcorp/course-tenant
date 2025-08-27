import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Award, BookOpen } from "lucide-react";
import usersData from "@/data/users.json";

export default function Profile() {
  const user = usersData[0]; // Using first user as current user

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account and view your progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                <Badge variant="outline" className="mb-4">
                  {user.subscription} Member
                </Badge>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {formatDate(user.joinDate)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Last login {formatDate(user.lastLogin)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{user.totalCoursesCompleted} courses completed</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>{user.certificates} certificates earned</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{user.coursesProgress.length}</div>
                  <div className="text-sm text-muted-foreground">Active Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{user.totalCoursesCompleted}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{user.totalWatchTime}</div>
                  <div className="text-sm text-muted-foreground">Watch Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{user.certificates}</div>
                  <div className="text-sm text-muted-foreground">Certificates</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Courses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.coursesProgress.map((course) => (
                <div key={course.courseId} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Enrolled {formatDate(course.enrolledAt)}
                      </p>
                      {course.status === "completed" && course.completedAt && (
                        <p className="text-sm text-green-600">
                          Completed {formatDate(course.completedAt)}
                        </p>
                      )}
                      {course.status === "ongoing" && course.lastAccessed && (
                        <p className="text-sm text-muted-foreground">
                          Last accessed {formatDate(course.lastAccessed)}
                        </p>
                      )}
                    </div>
                    {getStatusBadge(course.status)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}