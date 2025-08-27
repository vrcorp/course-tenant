import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import Footer from "./Footer";
import { getRole, Role } from "@/lib/auth";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [role, setRole] = useState<Role>(getRole());

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

  return (
    <div className="flex flex-col min-h-screen bg-background space-y-6">
      <div className="flex flex-1">
        {role !== "guest" && <Sidebar />}
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="container mx-auto md:px-6 px-3">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}