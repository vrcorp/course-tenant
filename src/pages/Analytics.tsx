import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Video, 
  Users, 
  DollarSign, 
  Eye,
  Clock,
  PlayCircle,
  BookOpen,
  Award
} from "lucide-react";
import { analyticsData } from "@/data/dummy";

const COLORS = ['hsl(220 100% 50%)', 'hsl(142 76% 36%)', 'hsl(38 92% 50%)', 'hsl(0 72% 51%)'];

export default function Analytics() {
  const quizStats = [
    { name: "HTML Fundamentals", average: 85, attempts: 245 },
    { name: "CSS Basics", average: 78, attempts: 189 },
    { name: "JavaScript Intro", average: 72, attempts: 167 },
    { name: "React Components", average: 81, attempts: 134 },
  ];

  const engagementData = [
    { week: 'Week 1', videoViews: 1240, completionRate: 78 },
    { week: 'Week 2', videoViews: 1890, completionRate: 82 },
    { week: 'Week 3', videoViews: 2140, completionRate: 75 },
    { week: 'Week 4', videoViews: 1980, completionRate: 80 },
    { week: 'Week 5', videoViews: 2340, completionRate: 85 },
    { week: 'Week 6', videoViews: 2190, completionRate: 83 },
  ];

  const deviceStats = [
    { name: 'Desktop', value: 65, color: 'hsl(220 100% 50%)' },
    { name: 'Mobile', value: 28, color: 'hsl(142 76% 36%)' },
    { name: 'Tablet', value: 7, color: 'hsl(38 92% 50%)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <p className="text-muted-foreground">Track performance and student engagement across your platform</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Video Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,489</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-success">+18.2%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Watch Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8m 32s</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-success">+12.5%</span>
              <span className="text-muted-foreground">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Completion</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">74%</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingDown className="h-3 w-3 text-destructive" />
              <span className="text-destructive">-3.1%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Average</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">79%</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-success">+5.7%</span>
              <span className="text-muted-foreground">improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Video Retention Rate</CardTitle>
            <CardDescription>Average viewer retention throughout video duration</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.videoRetention}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Retention %', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Retention']} />
                <Area 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="hsl(220 100% 50%)" 
                  fill="hsl(220 100% 50% / 0.2)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Engagement</CardTitle>
            <CardDescription>Weekly video views and completion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="videoViews" fill="hsl(220 100% 50%)" />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="completionRate" 
                  stroke="hsl(142 76% 36%)" 
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
            <CardDescription>How students access your content</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quiz Performance</CardTitle>
            <CardDescription>Average scores and attempt counts for each quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quizStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="average" fill="hsl(220 100% 50%)" name="Average Score %" />
                <Bar yAxisId="right" dataKey="attempts" fill="hsl(142 76% 36%)" name="Total Attempts" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress Details */}
      <Card>
        <CardHeader>
          <CardTitle>Course Progress Overview</CardTitle>
          <CardDescription>Detailed breakdown of student progress across all courses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData.courseProgress} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="course" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="completed" stackId="a" fill="hsl(142 76% 36%)" name="Completed" />
              <Bar dataKey="inProgress" stackId="a" fill="hsl(38 92% 50%)" name="In Progress" />
              <Bar dataKey="notStarted" stackId="a" fill="hsl(240 4.8% 95.9%)" name="Not Started" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Videos</CardTitle>
            <CardDescription>Videos with highest engagement rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">React Hooks Deep Dive</div>
                  <div className="text-sm text-muted-foreground">94% retention rate</div>
                </div>
                <Badge className="bg-success">Top</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">JavaScript ES6+ Features</div>
                  <div className="text-sm text-muted-foreground">87% retention rate</div>
                </div>
                <Badge variant="secondary">High</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">Node.js Authentication</div>
                  <div className="text-sm text-muted-foreground">82% retention rate</div>
                </div>
                <Badge variant="secondary">High</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
            <CardDescription>Content that needs attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">CSS Grid Layout Mastery</div>
                  <div className="text-sm text-muted-foreground">45% completion rate</div>
                </div>
                <Badge variant="destructive">Low</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">Advanced Database Concepts</div>
                  <div className="text-sm text-muted-foreground">58% completion rate</div>
                </div>
                <Badge className="bg-warning">Medium</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">Machine Learning Basics</div>
                  <div className="text-sm text-muted-foreground">62% completion rate</div>
                </div>
                <Badge className="bg-warning">Medium</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}