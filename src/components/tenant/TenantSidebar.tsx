import { Link, useLocation, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  FileText,
  Gift,
  CreditCard,
  Megaphone,
  UserCheck,
  Globe,
  Key,
  Palette,
  HelpCircle,
  MessageSquare,
  Award,
  Calendar,
  Video,
  Image,
  Tag,
  TrendingUp,
} from 'lucide-react';

interface TenantSidebarProps {
  tenant: any;
  type: 'student' | 'admin';
}

export default function TenantSidebar({ tenant, type }: TenantSidebarProps) {
  const location = useLocation();
  const { tenantSlug } = useParams();

  const studentMenuItems = [
    {
      title: 'Dashboard',
      href: `/t/${tenantSlug}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: 'Kursus Saya',
      href: `/t/${tenantSlug}/my-courses`,
      icon: BookOpen,
    },
    {
      title: 'Pesanan',
      href: `/t/${tenantSlug}/orders`,
      icon: ShoppingCart,
    },
    {
      title: 'Sertifikat',
      href: `/t/${tenantSlug}/certificates`,
      icon: Award,
    },
    {
      title: 'Profil',
      href: `/t/${tenantSlug}/profile`,
      icon: Users,
    },
    {
      title: 'Pengaturan',
      href: `/t/${tenantSlug}/settings`,
      icon: Settings,
    },
  ];

  const adminMenuItems = [
    {
      title: 'Dashboard',
      href: `/t/${tenantSlug}/admin`,
      icon: LayoutDashboard,
    },
    {
      title: 'Manajemen Kursus',
      children: [
        {
          title: 'Semua Kursus',
          href: `/t/${tenantSlug}/admin/courses`,
          icon: BookOpen,
        },
        {
          title: 'Kategori',
          href: `/t/${tenantSlug}/admin/categories`,
          icon: Tag,
        },
        {
          title: 'Kuis',
          href: `/t/${tenantSlug}/admin/quizzes`,
          icon: HelpCircle,
        },
        {
          title: 'Tugas',
          href: `/t/${tenantSlug}/admin/assignments`,
          icon: FileText,
        },
        {
          title: 'Sertifikat',
          href: `/t/${tenantSlug}/admin/certificates`,
          icon: Award,
        },
      ],
    },
    {
      title: 'Manajemen Pengguna',
      children: [
        {
          title: 'Siswa',
          href: `/t/${tenantSlug}/admin/students`,
          icon: Users,
        },
        {
          title: 'Instruktur',
          href: `/t/${tenantSlug}/admin/instructors`,
          icon: UserCheck,
        },
        {
          title: 'Afiliator',
          href: `/t/${tenantSlug}/admin/affiliators`,
          icon: TrendingUp,
        },
      ],
    },
    {
      title: 'Penjualan & Marketing',
      children: [
        {
          title: 'Pesanan',
          href: `/t/${tenantSlug}/admin/orders`,
          icon: ShoppingCart,
        },
        {
          title: 'Voucher',
          href: `/t/${tenantSlug}/admin/vouchers`,
          icon: Gift,
        },
        {
          title: 'Banner',
          href: `/t/${tenantSlug}/admin/banners`,
          icon: Image,
        },
        {
          title: 'Email Marketing',
          href: `/t/${tenantSlug}/admin/email-marketing`,
          icon: MessageSquare,
        },
      ],
    },
    {
      title: 'Laporan & Analitik',
      children: [
        {
          title: 'Dashboard Analitik',
          href: `/t/${tenantSlug}/admin/analytics`,
          icon: BarChart3,
        },
        {
          title: 'Laporan Penjualan',
          href: `/t/${tenantSlug}/admin/sales-reports`,
          icon: TrendingUp,
        },
        {
          title: 'Laporan Siswa',
          href: `/t/${tenantSlug}/admin/student-reports`,
          icon: Users,
        },
      ],
    },
    {
      title: 'Pengaturan',
      children: [
        {
          title: 'Pengaturan Situs',
          href: `/t/${tenantSlug}/admin/site-settings`,
          icon: Globe,
        },
        {
          title: 'Pengaturan Pembayaran',
          href: `/t/${tenantSlug}/admin/payment-settings`,
          icon: CreditCard,
        },
        {
          title: 'API Keys',
          href: `/t/${tenantSlug}/admin/api-settings`,
          icon: Key,
        },
        {
          title: 'Branding',
          href: `/t/${tenantSlug}/admin/branding`,
          icon: Palette,
        },
      ],
    },
  ];

  const menuItems = type === 'admin' ? adminMenuItems : studentMenuItems;

  const renderMenuItem = (item: any, level = 0) => {
    const isActive = location.pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <div key={item.title} className="mb-2">
          <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
            {item.title}
          </div>
          <div className="space-y-1">
            {item.children.map((child: any) => renderMenuItem(child, level + 1))}
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        to={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          level > 0 && 'ml-4'
        )}
      >
        <item.icon className="h-4 w-4" />
        {item.title}
      </Link>
    );
  };

  return (
    <div className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto py-4">
          <div className="px-3 mb-4">
            <h2 className="text-lg font-semibold">
              {type === 'admin' ? 'Admin Panel' : 'Dashboard Siswa'}
            </h2>
            <p className="text-sm text-muted-foreground">{tenant.name}</p>
          </div>
          
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => renderMenuItem(item))}
          </nav>
        </div>
        
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            {tenant.branding?.logo ? (
              <img 
                src={tenant.branding.logo} 
                alt={tenant.name} 
                className="h-8 w-8 rounded"
              />
            ) : (
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                {tenant.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{tenant.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {type === 'admin' ? 'Administrator' : 'Siswa'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
