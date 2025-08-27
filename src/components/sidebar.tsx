import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Link2, DollarSign, FileText, BarChart2, Settings, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type MenuItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const adminMenuItems: MenuItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: 'Affiliators', href: '/admin/affiliators', icon: <Users className="h-5 w-5" /> },
  { title: 'Commissions', href: '/admin/commissions', icon: <DollarSign className="h-5 w-5" /> },
  { title: 'Reports', href: '/admin/reports', icon: <FileText className="h-5 w-5" /> },
  { title: 'Analytics', href: '/admin/analytics', icon: <BarChart2 className="h-5 w-5" /> },
  { title: 'Settings', href: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={cn(
        'relative h-screen bg-white border-r transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {!isCollapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="ml-auto"
          >
            <ChevronLeft 
              className={cn(
                'h-5 w-5 transition-transform duration-300',
                isCollapsed ? 'rotate-180' : ''
              )} 
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {adminMenuItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center px-4 py-2 text-sm font-medium rounded-md',
                    'transition-colors duration-200',
                    location.pathname === item.href
                      ? 'bg-gray-100 text-primary font-semibold'
                      : 'text-gray-600 hover:bg-gray-50',
                    isCollapsed ? 'justify-center' : 'space-x-3'
                  )}
                >
                  <span className={cn(isCollapsed ? 'mr-0' : 'mr-3')}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
