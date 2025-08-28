import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  School,
  Award,
  FileText,
  Users,
  UserCheck,
  TrendingUp,
} from 'lucide-react';

const menu = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Courses', href: '/admin/courses', icon: BookOpen },
  { label: 'Quizzes', href: '/admin/quizzes', icon: HelpCircle },
  { label: 'Classes', href: '/admin/classes', icon: School },
  { label: 'Certificates', href: '/admin/certificates', icon: Award },
  { label: 'Assignments', href: '/admin/assignments', icon: FileText },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Instructors', href: '/admin/instructors', icon: UserCheck },
  { label: 'Affiliators', href: '/admin/affiliators', icon: TrendingUp },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed z-40 top-16 left-0 w-60 h-[calc(100vh-4rem)] border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex flex-col gap-1 p-3 overflow-auto h-full">
        {menu.map((m) => {
          const active = pathname.startsWith(m.href);
          return (
            <Link
              key={m.href}
              to={m.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <m.icon className="h-4 w-4" />
              {m.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
