import { useEffect, useState } from "react";
import company from "@/data/company.json";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  CreditCard,
  FileVideo,
  Home,
  Settings,
  Users,
  Video,
  Bell,
  Shield,
  ChevronDown,
  Menu,
  X,
  ShoppingCart,
  User,
  GraduationCap,
  Receipt,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getRole, Role } from "@/lib/auth";
import users from "@/data/users.json";

const baseMenuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Courses",
    icon: BookOpen,
    items: [
      { title: "Programs", href: "/programs" },
      { title: "Live Classes", href: "/live-classes" },
      { title: "Quizzes", href: "/quizzes" },
      { title: "Assignments", href: "/assignments" },
      { title: "Certificates", href: "/certificates" },
      { title: "Forum", href: "/forum" },
    ],
  },
  {
    title: "Commerce",
    icon: CreditCard,
    items: [
      { title: "Products", href: "/products" },
      { title: "Orders", href: "/orders" },
      { title: "Invoices", href: "/invoices" },
    ],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "User Area",
    icon: User,
    items: [
      { title: "Profile", href: "/profile" },
      { title: "My Courses", href: "/my-courses" },
      { title: "My Orders", href: "/my-orders" },

      { title: "Cart", href: "/cart" },
      { title: "Settings", href: "/settings" },
    ],
  },
  {
    title: "Integrations",
    icon: Bell,
    items: [
      { title: "Notifications", href: "/notifications" },
      { title: "Webhooks", href: "/webhooks" },
    ],
  },
  // Admin umbrella group is intentionally not used anymore for admin view.
  {
    title: "Affiliator",
    icon: Users,
    items: [
      { title: "Dashboard", href: "/affiliatr/dashboard" },
      { title: "Links", href: "/affiliatr/links" },
      { title: "Commissions", href: "/affiliatr/commissions" },
      { title: "Payouts", href: "/affiliatr/payouts" },
      { title: "Assets", href: "/affiliatr/assets" },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["Courses"]);
  const location = useLocation();
  const [sessionRole, setSessionRole] = useState<Role>(getRole());
  const [hasTenantCap, setHasTenantCap] = useState<boolean>(() => localStorage.getItem("vh_has_lms_tenant") === "1");
  const [hasVHCap, setHasVHCap] = useState<boolean>(() => localStorage.getItem("vh_has_video_hosting") === "1");
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentUser = ((): any | null => {
    if (sessionRole === "user") {
      return (users as any[])[0] || null; // demo: first user as logged-in user
    }
    return null;
  })();

  useEffect(() => {
    const onStorage = () => setSessionRole(getRole());
    const onRoleChange = () => setSessionRole(getRole());
    const onCaps = () => {
      setHasTenantCap(localStorage.getItem("vh_has_lms_tenant") === "1");
      setHasVHCap(localStorage.getItem("vh_has_video_hosting") === "1");
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("vh_role_change", onRoleChange as EventListener);
    window.addEventListener("vh_caps_change", onCaps as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("vh_role_change", onRoleChange as EventListener);
      window.removeEventListener("vh_caps_change", onCaps as EventListener);
    };
  }, []);

  // Determine role preference: session role first (if admin/affiliator), else derive from path, else user default
  const isSuperAdmin = sessionRole === "super_admin";
  const derivedRole: "admin" | "affiliator" | "user" =
    sessionRole === "admin" || isSuperAdmin
      ? "admin"
      : sessionRole === "affiliator"
      ? "affiliator"
      : location.pathname.startsWith("/admin")
      ? "admin"
      : location.pathname.startsWith("/affiliatr")
      ? "affiliator"
      : "user";

  useEffect(() => {
    // Ensure correct default expansion for affiliator role
    if (derivedRole === "affiliator") {
      // Affiliator uses flat menu (no groups)
      setExpandedItems([]);
    } else if (derivedRole === "admin") {
      // Admin has groups without LMS; don't force expand
      setExpandedItems([]);
    } else {
      // user
      setExpandedItems([]);
    }
  }, [derivedRole]);

  // Build role-specific menu
  const computedMenu = (() => {
    // start from base
    const items = [...baseMenuItems];
    // Adjust Dashboard target per role
    const dashIndex = items.findIndex(i => i.title === "Dashboard");
    if (dashIndex !== -1) {
      const icon = items[dashIndex].icon;
      items[dashIndex] = {
        title: "Dashboard",
        href: derivedRole === "admin" ? "/admin/dashboard" : derivedRole === "affiliator" ? "/affiliatr/dashboard" : "/dashboard",
        icon,
      } as any;
    }

    if (derivedRole === "admin") {
      // Distinguish Super Admin vs Admin menu composition
      if (isSuperAdmin) {
        // Super Admin: mix of flat items and grouped sections
        const out: any[] = [];
        // Flat Dashboard
        out.push({ title: "Dashboard", href: "/admin/dashboard", icon: Home });
        // Flat Reports (laporan)
        out.push({ title: "Reports", href: "/admin/reports", icon: BarChart3 });
        // Management group
        out.push({
          title: "Management",
          icon: Shield,
          items: [
            { title: "Tenants", href: "/admin/tenants" },
            { title: "Users", href: "/admin/users" },
          ],
        });
        // Affiliator management group
        out.push({
          title: "Affiliator",
          icon: Users,
          items: [
            { title: "Manage Affiliators", href: "/admin/affiliators/affiliators" },
            { title: "Manage Payouts", href: "/admin/affiliators/payouts" },
            { title: "Analytics", href: "/admin/affiliators/analytics" },
          ],
        });
        // Commerce group
        out.push({
          title: "Commerce",
          icon: CreditCard,
          items: [
            { title: "Orders", href: "/admin/orders" },
            { title: "Vouchers", href: "/admin/vouchers" },
          ],
        });
        // Packages group
        out.push({
          title: "Packages",
          icon: BarChart3,
          items: [

            { title: "LMS Packages", href: "/admin/lms-packages" },
          ],
        });
        // Settings group
        out.push({
          title: "Settings",
          icon: Settings,
          items: [
            { title: "Site Settings", href: "/admin/site-settings" },
            { title: "API Settings", href: "/admin/api-settings" },
            { title: "Global Config", href: "/admin/config" },
            { title: "API Keys", href: "/admin/api-keys" },
            { title: "Audit Logs", href: "/admin/audit-logs" },
          ],
        });
        return out;
      }
      // Admin (non-super): simpler grouping without dashboard inside groups
      const out: any[] = [];
      out.push({ title: "Dashboard", href: "/admin/dashboard", icon: Home });
      out.push({
        title: "Management",
        icon: Shield,
        items: [
          { title: "Tenants", href: "/admin/tenants" },
          { title: "Users", href: "/admin/users" },
        ],
      });
      out.push({
        title: "Operations",
        icon: CreditCard,
        items: [
          { title: "Orders", href: "/admin/orders" },
          { title: "Vouchers", href: "/admin/vouchers" },

        ],
      });
      out.push({
        title: "Settings",
        icon: Settings,
        items: [
          { title: "Site Settings", href: "/admin/site-settings" },
          { title: "API Settings", href: "/admin/api-settings" },
          { title: "Global Config", href: "/admin/config" },
        ],
      });
      return out;
    }
    if (derivedRole === "affiliator") {
      // Affiliator: flat menu (no grouping)
      const base = [
        { title: "Dashboard", href: "/affiliatr/dashboard", icon: Home },
        { title: "Links", href: "/affiliatr/links", icon: Users },
        { title: "Commissions", href: "/affiliatr/commissions", icon: Receipt },
        { title: "Payouts", href: "/affiliatr/payouts", icon: CreditCard },
        { title: "Assets", href: "/affiliatr/assets", icon: FileVideo },
        { title: "Reports", href: "/affiliatr/reports", icon: BarChart3 },
        { title: "Analytics", href: "/affiliatr/analytics", icon: BarChart3 },
      ];
      return base;
    }
    // user (default): show only specific items per requirement
    const out: any[] = [];
    // Add Dashboard to the user's menu
    out.push({ title: "Dashboard", href: "/dashboard", icon: Home });

    // My Orders
    out.push({ title: "My Orders", href: "/my-orders", icon: Receipt });

    // Cart
    out.push({ title: "Cart", href: "/cart", icon: ShoppingCart });
    // Settings
    out.push({ title: "Settings", href: "/settings", icon: Settings });
    // Notifications
    out.push({ title: "Notifications", href: "/notifications", icon: Bell });
    return out;
  })();

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    // Exact match to avoid parent item also active (e.g., /tenant-admin vs /tenant-admin/courses)
    const normalize = (s: string) => {
      if (!s) return "/";
      // remove trailing slashes except root
      const trimmed = s.replace(/\/+$/, "");
      return trimmed === "" ? "/" : trimmed;
    };
    return normalize(location.pathname) === normalize(href);
  };

  const isGroupActive = (items?: { href: string }[]) => {
    return items?.some(item => isActive(item.href)) ?? false;
  };

  return (
    <>
    <div className={cn(
      "hidden md:flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <FileVideo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {company.name}
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {computedMenu.map((item) => {
          if (item.items) {
            const isExpanded = expandedItems.includes(item.title);
            const isGroupActiveState = isGroupActive(item.items);
            
            return (
              <div key={item.title}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm font-normal h-9",
                    isGroupActiveState && "bg-accent text-accent-foreground",
                    collapsed && "px-2"
                  )}
                  onClick={() => !collapsed && toggleExpanded(item.title)}
                >
                  <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </>
                  )}
                </Button>
                
                {!collapsed && isExpanded && (
                  <div className="ml-7 mt-1 space-y-1">
                    {item.items.map((subItem) => (
                      <NavLink
                        key={subItem.href}
                        to={subItem.href}
                        className={({ isActive }) =>
                          cn(
                            "block px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                            isActive && "bg-primary text-primary-foreground font-medium"
                          )
                        }
                      >
                        {subItem.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.href}
              to={item.href!}
              className={({ isActive }) =>
                cn(
                  "flex items-center h-9 px-3 text-sm font-normal rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground font-medium",
                  collapsed && "justify-center px-2"
                )
              }
            >
              <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
    </div>

    {/* Mobile: floating kebab and full-screen overlay menu */}
    <button
      type="button"
      aria-label="Open menu"
      onClick={() => setMobileOpen(true)}
      className="md:hidden fixed bottom-4 right-4 z-50 inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      <MoreVertical className="h-6 w-6" />
    </button>

    {mobileOpen && (
      <div className="md:hidden fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
        <div className="relative z-10 h-full w-full bg-card text-card-foreground flex flex-col">
          {/* Overlay header */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-border">
            <div className="flex items-center space-x-2">
              <FileVideo className="h-6 w-6 text-primary" />
              <span className="text-base font-semibold">{company.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          {/* Overlay content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {computedMenu.map((item: any) => (
              <div key={item.title || item.href}>
                {item.items ? (
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground px-1 mb-2 flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </div>
                    <div className="space-y-1">
                      {item.items.map((sub: any) => (
                        <NavLink
                          key={sub.href}
                          to={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className={({ isActive }) => cn(
                            "flex items-center gap-3 p-3 rounded-lg border border-transparent bg-background/60 hover:bg-accent hover:text-accent-foreground",
                            isActive && "border-primary bg-primary/5"
                          )}
                        >
                          <span className="text-sm">{sub.title}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 p-3 rounded-lg border border-transparent bg-background/60 hover:bg-accent hover:text-accent-foreground",
                      isActive && "border-primary bg-primary/5"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.title}</span>
                  </NavLink>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
    </>
  );
}