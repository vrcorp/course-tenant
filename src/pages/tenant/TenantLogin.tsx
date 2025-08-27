import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTenantAuth } from '@/contexts/TenantAuthContext';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function TenantLogin() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const navigate = useNavigate();
  const { login, isAuthenticated, tenant, getRole } = useTenantAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'student' | 'affiliator'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && tenant) {
      const userRole = getRole();
      if (userRole === 'admin') {
        navigate(`/t/${tenantSlug}/admin`);
      } else if (userRole === 'affiliator') {
        navigate(`/t/${tenantSlug}/affiliate`);
      } else {
        navigate(`/t/${tenantSlug}`);
      }
    }
  }, [isAuthenticated, tenant, getRole, navigate, tenantSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !role) {
      toast.error('Semua field harus diisi');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password, role);
      
      if (success) {
        toast.success('Login berhasil!');
        
        // Redirect based on role
        if (role === 'admin') {
          navigate(`/t/${tenantSlug}/admin`);
        } else if (role === 'affiliator') {
          navigate(`/t/${tenantSlug}/affiliate`);
        } else {
          navigate(`/t/${tenantSlug}`);
        }
      } else {
        toast.error('Email atau password salah');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Tenant tidak ditemukan</h1>
          <p className="text-muted-foreground mb-4">Periksa kembali alamat subdomain Anda.</p>
          <Link to="/">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6">
        {/* Tenant Branding */}
        <div className="text-center mb-8">
          {tenant.branding?.logo && (
            <img 
              src={tenant.branding.logo} 
              alt={tenant.name} 
              className="h-16 w-16 mx-auto mb-4 rounded-lg"
            />
          )}
          <h1 className="text-3xl font-bold mb-2">{tenant.name}</h1>
          <p className="text-muted-foreground">Masuk ke platform pembelajaran</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Masuk ke Akun</CardTitle>
            <CardDescription>
              Gunakan kredensial demo untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value: 'admin' | 'student' | 'affiliator') => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="affiliator">Affiliator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Demo Credentials:</h4>
              <div className="text-sm space-y-1">
                <p><strong>Email:</strong> admin@example.com</p>
                <p><strong>Password:</strong> password</p>
                <p><strong>Role:</strong> Admin/Student/Affiliator</p>
              </div>
            </div>

            <div className="mt-4 text-sm text-center text-muted-foreground">
              Belum punya akun? <Link to={`/t/${tenantSlug}/register`} className="underline hover:text-foreground">Daftar</Link>
            </div>
          </CardContent>
        </Card>

        {/* Back to Main Site */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Kembali ke situs utama
          </Link>
        </div>
      </div>
    </div>
  );
}
