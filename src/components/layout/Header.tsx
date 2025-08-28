import { Bell, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { clearRole, getRole, Role } from "@/lib/auth";
import RoleSwitcher from "@/components/dev/RoleSwitcher";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import company from "@/data/company.json";

export function Header() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(getRole());
  const { getTotalItems: getCartItems } = useCart();
  const { getTotalItems: getWishlistItems } = useWishlist();

  useEffect(() => {
    const onStorage = () => setRole(getRole());
    const onRoleChange = () => setRole(getRole());
    window.addEventListener("storage", onStorage);
    window.addEventListener("vh_role_change", onRoleChange as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("vh_role_change", onRoleChange as EventListener);
    };
  }, []);

  const handleLogout = () => {
    clearRole();
    setRole("guest");
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center space-x-4 flex-1">
        {/* Brand identity (links to home) */}
        <Link to="/" className="font-extrabold tracking-tight text-lg md:text-xl hover:text-primary">
          {company.name}
        </Link>
      </div>

      {/* Cart and Wishlist */}
      <div className="flex items-center gap-3 mr-4">
        <Link to="/wishlist" className="relative">
          <Button variant="ghost" size="sm" className="relative">
            <Heart className="h-5 w-5" />
            {getWishlistItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getWishlistItems()}
              </span>
            )}
          </Button>
        </Link>
        <Link to="/cart" className="relative">
          <Button variant="ghost" size="sm" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {getCartItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartItems()}
              </span>
            )}
          </Button>
        </Link>
      </div>

      {/* Top Nav: dual product (LMS & Video Hosting) */}
      <nav className="hidden md:flex items-center gap-5 mr-4 text-sm">


        <Link to="/about" className={`hover:text-primary ${window.location.pathname === '/about' ? 'text-primary' : ''}`}>About</Link>
        <Link to="/contact" className={`hover:text-primary ${window.location.pathname === '/contact' ? 'text-primary' : ''}`}>Contact</Link>
      </nav>

      <div className="flex items-center space-x-4">
        {/* Dev Role Switcher */}
        <div className="hidden md:block">
          <RoleSwitcher />
        </div>
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start p-4">
              <div className="font-medium text-sm">Payment Received</div>
              <div className="text-xs text-muted-foreground">$299 for Web Development Bootcamp</div>
              <div className="text-xs text-muted-foreground">2 minutes ago</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start p-4">
              <div className="font-medium text-sm">Video Processing Complete</div>
              <div className="text-xs text-muted-foreground">React Hooks Deep Dive is ready</div>
              <div className="text-xs text-muted-foreground">1 hour ago</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start p-4">
              <div className="font-medium text-sm">New Student Enrolled</div>
              <div className="text-xs text-muted-foreground">Sarah Johnson joined Digital Marketing</div>
              <div className="text-xs text-muted-foreground">3 hours ago</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Auth actions */}
        {role === "guest" ? (
          <div className="hidden sm:flex items-center gap-2">
            <Link to="/login" className={`text-sm hover:text-primary ${window.location.pathname === '/login' ? 'text-primary' : ''}`}>Login</Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>
                    {company.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{role.toUpperCase()}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {`session@${company.name.toLowerCase().replace(/\s+/g, "")}`}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}