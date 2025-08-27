import { Navigate, useLocation } from "react-router-dom";
import { getRole, Role } from "@/lib/auth";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  allow: Role[]; // roles allowed to access
  element: JSX.Element;
}

export default function ProtectedRoute({ allow, element }: ProtectedRouteProps) {
  const location = useLocation();
  // make guard reactive to role changes in the same tab and across tabs
  const [, setTick] = useState(0);
  useEffect(() => {
    const rerender = () => setTick((t) => t + 1);
    window.addEventListener("storage", rerender);
    window.addEventListener("vh_role_change", rerender as EventListener);
    return () => {
      window.removeEventListener("storage", rerender);
      window.removeEventListener("vh_role_change", rerender as EventListener);
    };
  }, []);
  const role = getRole();

  if (!allow.includes(role)) {
    // redirect to login with return target
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return element;
}
