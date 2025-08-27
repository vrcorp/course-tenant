import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tenants from '@/data/tenants.json';
import users from '@/data/users.json';

interface TenantUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'affiliator';
  tenantId: string;
  avatar?: string;
}

interface TenantAuthContextType {
  user: TenantUser | null;
  tenant: any;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'admin' | 'student' | 'affiliator') => Promise<boolean>;
  logout: () => void;
  getRole: () => 'admin' | 'student' | 'affiliator' | 'guest';
  isLoading: boolean;
}

const TenantAuthContext = createContext<TenantAuthContextType | undefined>(undefined);

interface TenantAuthProviderProps {
  children: ReactNode;
}

export function TenantAuthProvider({ children }: TenantAuthProviderProps) {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<TenantUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Find tenant data
  const tenant = tenants.find(t => t.slug === tenantSlug);

  // Tenant-specific session key
  const getSessionKey = () => `tenant_${tenantSlug}_auth`;
  const getRoleKey = () => `tenant_${tenantSlug}_role`;

  // Load user from tenant-specific session
  useEffect(() => {
    if (!tenant) {
      setIsLoading(false);
      return;
    }

    const savedAuth = localStorage.getItem(getSessionKey());
    const savedRole = localStorage.getItem(getRoleKey());

    if (savedAuth && savedRole) {
      try {
        const authData = JSON.parse(savedAuth);
        // Verify user belongs to this tenant
        if (authData.tenantId === tenant.id) {
          setUser({
            ...authData,
            role: savedRole as 'admin' | 'student' | 'affiliator'
          });
        } else {
          // Clear invalid session
          localStorage.removeItem(getSessionKey());
          localStorage.removeItem(getRoleKey());
        }
      } catch (error) {
        console.error('Error loading tenant auth:', error);
        localStorage.removeItem(getSessionKey());
        localStorage.removeItem(getRoleKey());
      }
    }

    setIsLoading(false);
  }, [tenant, tenantSlug]);

  const login = async (email: string, password: string, role: 'admin' | 'student' | 'affiliator'): Promise<boolean> => {
    if (!tenant) return false;

    // Simulate authentication - in real app, this would be an API call
    const foundUser = users.find(u => u.email === email);
    
    if (!foundUser) return false;

    // Create tenant-specific user session
    const tenantUser: TenantUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: role,
      tenantId: tenant.id,
      avatar: foundUser.avatar
    };

    // Save to tenant-specific session
    localStorage.setItem(getSessionKey(), JSON.stringify(tenantUser));
    localStorage.setItem(getRoleKey(), role);
    
    setUser(tenantUser);
    return true;
  };

  const logout = () => {
    // Clear tenant-specific session only
    localStorage.removeItem(getSessionKey());
    localStorage.removeItem(getRoleKey());
    setUser(null);
    
    // Redirect to tenant login
    navigate(`/t/${tenantSlug}/login`);
  };

  const getRole = (): 'admin' | 'student' | 'affiliator' | 'guest' => {
    if (!user) return 'guest';
    return user.role;
  };

  const isAuthenticated = !!user && !!tenant;

  const value: TenantAuthContextType = {
    user,
    tenant,
    isAuthenticated,
    login,
    logout,
    getRole,
    isLoading
  };

  return (
    <TenantAuthContext.Provider value={value}>
      {children}
    </TenantAuthContext.Provider>
  );
}

export function useTenantAuth() {
  const context = useContext(TenantAuthContext);
  if (context === undefined) {
    throw new Error('useTenantAuth must be used within a TenantAuthProvider');
  }
  return context;
}
