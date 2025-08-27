import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getRole, setRole, Role } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

/**
 * Dev-only helper to switch session roles quickly.
 * Appears as a compact dropdown; selecting a role updates localStorage and dispatches vh_role_change.
 */
export default function RoleSwitcher() {
  const [role, setLocalRole] = useState<Role>(getRole());
  const { toast } = useToast();
  const [hasTenant, setHasTenant] = useState<boolean>(() => localStorage.getItem("vh_has_lms_tenant") === "1");


  useEffect(() => {
    const onStorage = () => setLocalRole(getRole());
    const onRoleChange = () => setLocalRole(getRole());
    const onCaps = () => {
      setHasTenant(localStorage.getItem("vh_has_lms_tenant") === "1");
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

  const apply = (next: Role) => {
    setRole(next);
    setLocalRole(next);
    toast({ title: "Role switched", description: `Now acting as ${next.toUpperCase()}` });
  };

  const toggleTenant = () => {
    const next = !hasTenant;
    setHasTenant(next);
    if (next) {
      localStorage.setItem("vh_has_lms_tenant", "1");
      if (!localStorage.getItem("vh_tenant_slug")) localStorage.setItem("vh_tenant_slug", "acme");
    } else {
      localStorage.removeItem("vh_has_lms_tenant");
    }
    window.dispatchEvent(new Event("vh_caps_change"));
    toast({ title: "Capability", description: `Tenant Admin ${next ? "enabled" : "disabled"}` });
  };



  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          Role: {role}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Switch Role (Dev)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => apply("guest")}>guest</DropdownMenuItem>
        <DropdownMenuItem onClick={() => apply("user")}>user</DropdownMenuItem>
        <DropdownMenuItem onClick={() => apply("instructor")}>instructor</DropdownMenuItem>
        <DropdownMenuItem onClick={() => apply("admin")}>admin</DropdownMenuItem>
        <DropdownMenuItem onClick={() => apply("affiliator")}>affiliator</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Capabilities</DropdownMenuLabel>
        <DropdownMenuItem onClick={toggleTenant}>
          {hasTenant ? "✅ Tenant Admin: ON" : "Tenant Admin: OFF"}
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
