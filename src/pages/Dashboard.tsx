import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Video, 
  Users, 
  DollarSign, 
  HardDrive,
  Wifi,
  PlayCircle
} from "lucide-react";
import { dashboardStats, analyticsData, videos } from "@/data/dummy";
import tenants from "@/data/tenants.json";
import users from "@/data/users.json";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getRole } from "@/lib/auth";

const COLORS = ['hsl(220 100% 50%)', 'hsl(142 76% 36%)', 'hsl(38 92% 50%)', 'hsl(0 72% 51%)'];

export default function Dashboard() {
  const role = getRole();
  const currentUser: any | null = role === "user" ? (users as any[])[0] : null; // demo: first user
  const lmsTenants: string[] = (currentUser?.lmsTenants as string[]) || (currentUser?.tenantSlug ? [currentUser.tenantSlug] : []);
  const ownedTenants = (tenants as any[]).filter(t => lmsTenants.includes(t.slug));
  const storagePercentage = (dashboardStats.storage.used / dashboardStats.storage.total) * 100;
  const bandwidthPercentage = (dashboardStats.bandwidth.used / dashboardStats.bandwidth.total) * 100;

  const recentVideos = videos.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* User widgets: Video Hosting & My LMS */}
      {role === "user" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Hosting Status */}
          <Card>
            <CardHeader>
              <CardTitle>Video Hosting</CardTitle>
              <CardDescription>Your storage/streaming subscription</CardDescription>
            </CardHeader>
            <CardContent>
              {currentUser?.hasVideoHosting ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Active</div>
                    <div className="text-sm text-muted-foreground">Plan: {currentUser.subscription}</div>
                  </div>
                  <Link to="/videos/overview"><Button>Open Videos</Button></Link>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">No active plan</div>
                    <div className="text-sm text-muted-foreground">Get a package to start uploading</div>
                  </div>

                </div>
              )}
            </CardContent>
          </Card>

          {/* My LMS Overview */}
          <Card>
            <CardHeader>
              <CardTitle>My LMS</CardTitle>
              <CardDescription>Your LMS instances</CardDescription>
            </CardHeader>
            <CardContent>
              {ownedTenants.length === 0 ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">No LMS yet</div>
                    <div className="text-sm text-muted-foreground">Create your own branded LMS</div>
                  </div>

                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    {ownedTenants.slice(0, 3).map((t: any) => (
                      <div key={t.slug} className="flex items-center justify-between">
                        <div className="truncate">
                          <div className="font-medium truncate">{t.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{t.domain?.value}</div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/lms/${t.slug}`}><Button size="sm" variant="secondary">Landing</Button></Link>
                          <Link to={`/my-lms/${t.slug}/manage`}><Button size="sm">Manage</Button></Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  {ownedTenants.length > 3 && (
                    <Link to="/my-lms"><Button variant="ghost" className="px-0">View all ({ownedTenants.length})</Button></Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardStats.revenue.thisMonth.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-success">+{dashboardStats.revenue.growth}%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.students.total.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-success">+{dashboardStats.students.newThisMonth}</span>
              <span className="text-muted-foreground">new this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.videos.total.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-muted-foreground">{dashboardStats.videos.processing} processing</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.students.active.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {Math.round((dashboardStats.students.active / dashboardStats.students.total) * 100)}% of total
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage & Bandwidth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5" />
              <span>Storage Usage</span>
            </CardTitle>
            <CardDescription>
              {dashboardStats.storage.used} {dashboardStats.storage.unit} of {dashboardStats.storage.total} {dashboardStats.storage.unit} used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={storagePercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{storagePercentage.toFixed(1)}% used</span>
              <span>{(dashboardStats.storage.total - dashboardStats.storage.used).toFixed(1)} {dashboardStats.storage.unit} remaining</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="h-5 w-5" />
              <span>Bandwidth Usage</span>
            </CardTitle>
            <CardDescription>
              {dashboardStats.bandwidth.used} {dashboardStats.bandwidth.unit} of {dashboardStats.bandwidth.total} {dashboardStats.bandwidth.unit} used this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={bandwidthPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{bandwidthPercentage.toFixed(1)}% used</span>
              <span>{dashboardStats.bandwidth.total - dashboardStats.bandwidth.used} {dashboardStats.bandwidth.unit} remaining</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue trend over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="hsl(220 100% 50%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Progress Overview</CardTitle>
            <CardDescription>Student progress across different courses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.courseProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" stackId="a" fill="hsl(142 76% 36%)" />
                <Bar dataKey="inProgress" stackId="a" fill="hsl(38 92% 50%)" />
                <Bar dataKey="notStarted" stackId="a" fill="hsl(240 4.8% 95.9%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Videos */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
          <CardDescription>Latest uploaded and processed videos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentVideos.map((video) => (
              <div key={video.id} className="space-y-3">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Badge
                    variant={
                      video.status === 'completed' ? 'default' :
                      video.status === 'transcoding' ? 'secondary' :
                      'destructive'
                    }
                    className="absolute top-2 right-2"
                  >
                    {video.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-sm">{video.title}</h4>
                  <p className="text-xs text-muted-foreground">{video.duration} • {video.views.toLocaleString()} views</p>
                  {video.status === 'transcoding' && (
                    <Progress value={video.transcodingProgress} className="h-1 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}