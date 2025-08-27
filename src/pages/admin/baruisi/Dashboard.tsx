import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { loadArray, STORE_KEYS } from "@/lib/dataStore";
import usersSeed from "@/data/users.json";
import ordersSeed from "@/data/admin_orders.json";
import vouchersSeed from "@/data/vouchers.json";
import tenantsSeed from "@/data/tenants.json";
import lmsPackagesSeed from "@/data/lms_packages.json";
import vhPackagesSeed from "@/data/video_hosting_packages.json";
import auditSeed from "@/data/admin_audit_logs.json";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from "recharts";
import { 
  Users, 
  ShoppingCart, 
  Tag, 
  Building, 
  Package, 
  FileText, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Activity,
  BarChart3,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    pendingOrders: 0,
    vouchers: 0,
    tenants: 0,
    lmsPackages: 0,
    vhPackages: 0,
    auditLogs: 0,
  });

  useEffect(() => {
    const users = loadArray(STORE_KEYS.users, usersSeed as any[]);
    const orders = loadArray(STORE_KEYS.orders, ordersSeed as any[]);
    const vouchers = loadArray(STORE_KEYS.vouchers, vouchersSeed as any[]);
    const tenants = loadArray(STORE_KEYS.tenants, tenantsSeed as any[]);
    const lmsPackages = loadArray(STORE_KEYS.lmsPackages, lmsPackagesSeed as any[]);
    const vhPackages = loadArray(STORE_KEYS.vhPackages, vhPackagesSeed as any[]);
    const auditLogs = loadArray(STORE_KEYS.auditLogs, auditSeed as any[]);
    
    setStats({
      users: users.length,
      orders: orders.length,
      pendingOrders: orders.filter((o: any) => o.status === "pending").length,
      vouchers: vouchers.length,
      tenants: tenants.length,
      lmsPackages: lmsPackages.length,
      vhPackages: vhPackages.length,
      auditLogs: auditLogs.length,
    });
  }, []);

  const tiles = [
    { 
      title: "Total Users", 
      value: stats.users, 
      icon: Users, 
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/5",
      change: "+12%",
      changeType: "positive"
    },
    { 
      title: "Total Orders", 
      value: stats.orders, 
      icon: ShoppingCart, 
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-500/10 to-emerald-600/5",
      change: "+8%",
      changeType: "positive"
    },
    { 
      title: "Pending Orders", 
      value: stats.pendingOrders, 
      icon: Clock, 
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-500/10 to-amber-600/5",
      change: "-3%",
      changeType: "negative"
    },
    { 
      title: "Active Vouchers", 
      value: stats.vouchers, 
      icon: Tag, 
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/5",
      change: "+15%",
      changeType: "positive"
    },
    { 
      title: "Tenants", 
      value: stats.tenants, 
      icon: Building, 
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-500/10 to-indigo-600/5",
      change: "+5%",
      changeType: "positive"
    },
    { 
      title: "LMS Packages", 
      value: stats.lmsPackages, 
      icon: Package, 
      gradient: "from-rose-500 to-rose-600",
      bgGradient: "from-rose-500/10 to-rose-600/5",
      change: "+2%",
      changeType: "positive"
    },
    { 
      title: "VH Packages", 
      value: stats.vhPackages, 
      icon: Package, 
      gradient: "from-cyan-500 to-cyan-600",
      bgGradient: "from-cyan-500/10 to-cyan-600/5",
      change: "+7%",
      changeType: "positive"
    },
    { 
      title: "Audit Logs", 
      value: stats.auditLogs, 
      icon: FileText, 
      gradient: "from-gray-500 to-gray-600",
      bgGradient: "from-gray-500/10 to-gray-600/5",
      change: "+25%",
      changeType: "positive"
    },
  ];

  const pieData = [
    { name: "Users", value: stats.users, color: "#3b82f6" },
    { name: "Orders", value: stats.orders, color: "#10b981" },
    { name: "Vouchers", value: stats.vouchers, color: "#8b5cf6" },
    { name: "Tenants", value: stats.tenants, color: "#6366f1" },
  ];

  const barData = [
    { name: "Users", value: stats.users, fill: "#3b82f6" },
    { name: "Orders", value: stats.orders, fill: "#10b981" },
    { name: "Pending", value: stats.pendingOrders, fill: "#f59e0b" },
    { name: "Vouchers", value: stats.vouchers, fill: "#8b5cf6" },
    { name: "Tenants", value: stats.tenants, fill: "#6366f1" },
  ];

  const lineData = [
    { name: "Jan", users: Math.floor(stats.users * 0.5), orders: Math.floor(stats.orders * 0.3) },
    { name: "Feb", users: Math.floor(stats.users * 0.6), orders: Math.floor(stats.orders * 0.4) },
    { name: "Mar", users: Math.floor(stats.users * 0.7), orders: Math.floor(stats.orders * 0.5) },
    { name: "Apr", users: Math.floor(stats.users * 0.8), orders: Math.floor(stats.orders * 0.6) },
    { name: "May", users: Math.floor(stats.users * 0.9), orders: Math.floor(stats.orders * 0.8) },
    { name: "Jun", users: stats.users, orders: stats.orders },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive system overview and analytics
              </p>
            </div>
          </div>
          <Separator className="my-4" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {tiles.map((tile) => (
            <Card 
              key={tile.title} 
              className={`border-0 shadow-lg bg-gradient-to-br ${tile.bgGradient} hover:shadow-xl transition-all duration-300 group overflow-hidden relative`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {tile.title}
                    </p>
                    <p className="text-3xl font-bold mb-2">
                      {tile.value.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1">
                      {tile.changeType === 'positive' ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        tile.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {tile.change}
                      </span>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-br ${tile.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <tile.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Distribution Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle>Distribution Overview</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  Current Data
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <CardTitle>Metrics Comparison</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  Live Data
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      radius={[6, 6, 0, 0]} 
                      className="drop-shadow-sm"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Trends Chart */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Growth Trends</CardTitle>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  6 Month View
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Simulated Data
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                    name="Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                    {stats.orders > 0 ? ((stats.orders / stats.users) * 100).toFixed(1) : '0'}%
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                    Orders to Users ratio
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-full">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    Pending Rate
                  </p>
                  <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                    {stats.orders > 0 ? ((stats.pendingOrders / stats.orders) * 100).toFixed(1) : '0'}%
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Orders awaiting processing
                  </p>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    System Health
                  </p>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    Optimal
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    All systems operational
                  </p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card className="border-0 shadow-lg border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-800 dark:text-blue-200">System Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Data Source</p>
                  <p className="text-xs text-muted-foreground">
                    Data reflects current in-browser localStorage seeded from JSON files
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Charts & Analytics</p>
                  <p className="text-xs text-muted-foreground">
                    Growth trends display simulated data patterns based on current metrics
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Real-time Updates</p>
                  <p className="text-xs text-muted-foreground">
                    Dashboard automatically reflects changes made to the system data
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}