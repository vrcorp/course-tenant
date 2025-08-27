import { ReactNode, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenantAuth } from '@/contexts/TenantAuthContext';
import { Loader2 } from 'lucide-react';

interface TenantProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('admin' | 'student' | 'affiliator')[];
  redirectTo?: string;
}

export default function TenantProtectedRoute({ 
  children, 
  allowedRoles = ['admin', 'student', 'affiliator'],
  redirectTo 
}: TenantProtectedRouteProps) {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const { isAuthenticated, getRole, isLoading, tenant } = useTenantAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    // Check if tenant exists
    if (!tenant) {
      navigate('/404');
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      navigate(redirectTo || `/t/${tenantSlug}/login`);
      return;
    }

    // Check role permissions
    const userRole = getRole();
    if (userRole === 'guest' || !allowedRoles.includes(userRole)) {
      // Redirect based on user role
      if (userRole === 'admin') {
        navigate(`/t/${tenantSlug}/admin`);
      } else if (userRole === 'student') {
        navigate(`/t/${tenantSlug}/student`);
      } else if (userRole === 'affiliator') {
        navigate(`/t/${tenantSlug}/affiliator`);
      } else {
        navigate(`/t/${tenantSlug}/login`);
      }
      return;
    }
  }, [isAuthenticated, getRole, isLoading, tenant, tenantSlug, navigate, allowedRoles, redirectTo]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or wrong role
  if (!isAuthenticated || !tenant) {
    return null;
  }

  const userRole = getRole();
  if (userRole === 'guest' || !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}
