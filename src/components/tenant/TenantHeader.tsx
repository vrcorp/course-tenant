import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, ShoppingCart, BookOpen } from 'lucide-react';
import { getRole, logout } from '@/lib/auth';

interface TenantHeaderProps {
  tenant: any;
}

export default function TenantHeader({ tenant }: TenantHeaderProps) {
  const navigate = useNavigate();
  const role = getRole();
  const isLoggedIn = role !== 'guest';

  const handleLogout = () => {
    logout();
    navigate(`/t/${tenant.slug}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Tenant Logo & Name */}
          <Link to={`/t/${tenant.slug}`} className="flex items-center gap-3">
            {tenant.branding?.logo ? (
              <img 
                src={tenant.branding.logo} 
                alt={tenant.name} 
                className="h-8 w-auto"
              />
            ) : (
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {tenant.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg">{tenant.name}</h1>
              <p className="text-xs text-muted-foreground">
                {tenant.domain?.type === 'custom' ? tenant.domain.value : `${tenant.slug}.videmyhub.io`}
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to={`/t/${tenant.slug}`} className="text-sm font-medium hover:text-primary">
              Beranda
            </Link>
            <Link to={`/t/${tenant.slug}/courses`} className="text-sm font-medium hover:text-primary">
              Kursus
            </Link>
            <Link to={`/t/${tenant.slug}/about`} className="text-sm font-medium hover:text-primary">
              Tentang
            </Link>
            <Link to={`/t/${tenant.slug}/contact`} className="text-sm font-medium hover:text-primary">
              Kontak
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to={`/t/${tenant.slug}/cart`}>
                  <Button variant="ghost" size="sm">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link to={`/t/${tenant.slug}/profile`}>
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/t/${tenant.slug}/my-courses`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Kursus Saya
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/t/${tenant.slug}/orders`}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Pesanan
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={`/t/${tenant.slug}/settings`}>
                        <Settings className="mr-2 h-4 w-4" />
                        Pengaturan
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to={`/t/${tenant.slug}/login`}>
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link to={`/t/${tenant.slug}/register`}>
                  <Button size="sm">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
