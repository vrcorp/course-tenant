import { Navigate } from "react-router-dom";
import users from "@/data/users.json";
import { ReactNode, useEffect, useState } from "react";

interface Props { element: ReactNode }

// Simple guard to ensure only users with LMS tenant can access Tenant Admin pages.
export default function TenantAdminRoute({ element }: Props) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const rerender = () => setTick(t => t + 1);
    window.addEventListener("storage", rerender);
    window.addEventListener("vh_caps_change", rerender as EventListener);
    return () => {
      window.removeEventListener("storage", rerender);
      window.removeEventListener("vh_caps_change", rerender as EventListener);
    };
  }, []);

  const currentUser: any = (users as any[])[0]; // demo: assume first user is logged-in
  const hasTenantByData = !!currentUser?.hasLmsTenant;
  const hasTenantByToggle = typeof window !== "undefined" && localStorage.getItem("vh_has_lms_tenant") === "1";
  const allowed = hasTenantByData || hasTenantByToggle;

  if (!allowed) {
    // Redirect to LMS pricing if no tenant
    return <Navigate to="/lms/pricing" replace />;
  }
  return <>{element}</>;
}
