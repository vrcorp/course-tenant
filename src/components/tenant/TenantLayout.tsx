import { ReactNode } from 'react';
import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Home,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  Trophy,
  FileText,
  Award,
  BarChart3,
  Gift,
  Key,
  Image,
  DollarSign,
  UserCheck,
  ShoppingCart,
  Bell,
  PlayCircle,
  HelpCircle,
  TrendingUp,
  Target,
  Wallet,
  Link as LinkIcon,
  PieChart,
} from 'lucide-react';
import { useTenantAuth } from '@/contexts/TenantAuthContext';

interface TenantLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarType?: 'student' | 'admin' | 'affiliator';
}

export default function TenantLayout({ children }: TenantLayoutProps) {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, tenant, getRole, logout, isAuthenticated } = useTenantAuth();

  const userRole = getRole();

  const handleLogout = () => {
    logout();
  };

  // Menu items based on role
  const getMenuItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          {
            title: 'Dashboard',
            items: [
              { name: 'Overview', href: `/t/${tenantSlug}/admin`, icon: Home },
              { name: 'Analytics', href: `/t/${tenantSlug}/admin/analytics`, icon: BarChart3 },
            ]
          },
          {
            title: 'Konten',
            items: [
              { name: 'Kursus', href: `/t/${tenantSlug}/admin/courses`, icon: BookOpen },
              { name: 'Video', href: `/t/${tenantSlug}/admin/videos`, icon: PlayCircle },
              { name: 'Quiz', href: `/t/${tenantSlug}/admin/quizzes`, icon: HelpCircle },
              { name: 'Tugas', href: `/t/${tenantSlug}/admin/assignments`, icon: FileText },
              { name: 'Sertifikat', href: `/t/${tenantSlug}/admin/certificates`, icon: Award },
            ]
          },
          {
            title: 'Pengguna',
            items: [
              { name: 'Siswa', href: `/t/${tenantSlug}/admin/students`, icon: Users },
              { name: 'Instruktur', href: `/t/${tenantSlug}/admin/instructors`, icon: UserCheck },
              { name: 'Affiliator', href: `/t/${tenantSlug}/admin/affiliators`, icon: TrendingUp },
            ]
          },
          {
            title: 'Penjualan',
            items: [
              { name: 'Pesanan', href: `/t/${tenantSlug}/admin/orders`, icon: ShoppingCart },
              { name: 'Voucher', href: `/t/${tenantSlug}/admin/vouchers`, icon: Gift },
              { name: 'Laporan', href: `/t/${tenantSlug}/admin/reports`, icon: PieChart },
            ]
          },
          {
            title: 'Pengaturan',
            items: [
              { name: 'Situs', href: `/t/${tenantSlug}/admin/settings`, icon: Settings },
              { name: 'API Keys', href: `/t/${tenantSlug}/admin/api-settings`, icon: Key },
              { name: 'Banner', href: `/t/${tenantSlug}/admin/banners`, icon: Image },
            ]
          }
        ];

      case 'affiliator':
        return [
          {
            title: 'Dashboard',
            items: [
              { name: 'Overview', href: `/t/${tenantSlug}/affiliate`, icon: Home },
              { name: 'Statistik', href: `/t/${tenantSlug}/affiliate/stats`, icon: BarChart3 },
            ]
          },
          {
            title: 'Promosi',
            items: [
              { name: 'Link Affiliate', href: `/t/${tenantSlug}/affiliate/links`, icon: LinkIcon },
              { name: 'Materi Promosi', href: `/t/${tenantSlug}/affiliate/materials`, icon: Image },
              { name: 'Kampanye', href: `/t/${tenantSlug}/affiliate/campaigns`, icon: Target },
            ]
          },
          {
            title: 'Komisi',
            items: [
              { name: 'Komisi Saya', href: `/t/${tenantSlug}/affiliate/commissions`, icon: DollarSign },
              { name: 'Penarikan', href: `/t/${tenantSlug}/affiliate/payouts`, icon: Wallet },
              { name: 'Riwayat', href: `/t/${tenantSlug}/affiliate/history`, icon: FileText },
            ]
          }
        ];

      default: // student
        return [
          {
            title: 'Pembelajaran',
            items: [
              { name: 'Dashboard', href: `/t/${tenantSlug}`, icon: Home },
              { name: 'Kursus Saya', href: `/t/${tenantSlug}/my-courses`, icon: BookOpen },
              { name: 'Sertifikat', href: `/t/${tenantSlug}/certificates`, icon: Award },
              { name: 'Progress', href: `/t/${tenantSlug}/progress`, icon: Trophy },
            ]
          },
          {
            title: 'Aktivitas',
            items: [
              { name: 'Quiz', href: `/t/${tenantSlug}/quizzes`, icon: HelpCircle },
              { name: 'Tugas', href: `/t/${tenantSlug}/assignments`, icon: FileText },
              { name: 'Diskusi', href: `/t/${tenantSlug}/discussions`, icon: Users },
            ]
          },
          {
            title: 'Akun',
            items: [
              { name: 'Profil', href: `/t/${tenantSlug}/profile`, icon: Settings },
              { name: 'Notifikasi', href: `/t/${tenantSlug}/notifications`, icon: Bell },
            ]
          }
        ];
    }
  };

  const menuItems = getMenuItems();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Tenant tidak ditemukan</h1>
          <p className="text-muted-foreground mb-4">Periksa kembali alamat subdomain/custom domain Anda.</p>
          <Link to="/">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userRole === 'guest') {
    return null; // Will redirect by TenantProtectedRoute
  }

  const Sidebar = ({ className = "" }: { className?: string }) => (
    <div className={`pb-12 ${className}`}>
      <div className="space-y-4 py-4">
        {/* Tenant Branding */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-3 mb-4">
            {tenant.branding?.logo && (
              <img src={tenant.branding.logo} alt={tenant.name} className="h-8 w-8 rounded" />
            )}
            <div>
              <h2 className="text-lg font-semibold">{tenant.name}</h2>
              <p className="text-xs text-muted-foreground capitalize">{userRole} Panel</p>
            </div>
          </div>
        </div>

        {/* Menu Groups */}
        {menuItems.map((group, groupIndex) => (
          <div key={groupIndex} className="px-3 py-2">
            <h3 className="mb-2 px-4 text-sm font-semibold tracking-tight text-muted-foreground">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground ${
                    isActive(item.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>

          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            {tenant.branding?.logo && (
              <img src={tenant.branding.logo} alt={tenant.name} className="h-8 w-8 rounded" />
            )}
            <Link to={`/t/${tenantSlug}`} className="font-semibold">
              {tenant.name}
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-4">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder-avatar.jpg"} alt="User" />
                    <AvatarFallback>
                      {userRole === 'admin' ? 'A' : userRole === 'affiliator' ? 'AF' : 'S'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {user?.name || (userRole === 'admin' ? 'Admin' : userRole === 'affiliator' ? 'Affiliator' : 'Student')}
                    </p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {tenant.name}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={`/t/${tenantSlug}/profile`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Pengaturan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 pt-14">
          <div className="flex-1 overflow-auto border-r bg-background">
            <Sidebar />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-72 pt-14">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background md:ml-72">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              {tenant.branding?.logo && (
                <img src={tenant.branding.logo} alt={tenant.name} className="h-6 w-6 rounded" />
              )}
              <p className="text-sm text-muted-foreground">
                © 2024 {tenant.name}. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link to={`/t/${tenantSlug}/help`} className="hover:text-foreground">
                Bantuan
              </Link>
              <Link to={`/t/${tenantSlug}/privacy`} className="hover:text-foreground">
                Privasi
              </Link>
              <Link to={`/t/${tenantSlug}/terms`} className="hover:text-foreground">
                Syarat
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
