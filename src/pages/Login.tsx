import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setRole } from "@/components/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Mail, Lock, User, Shield, TrendingUp, ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // basic validation
    const emailOk = /.+@.+\..+/.test(email);
    if (!emailOk) {
      toast({ title: "Email tidak valid", description: "Masukkan email yang benar.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    if (!password || password.length < 6) {
      toast({ title: "Password tidak valid", description: "Minimal 6 karakter.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    
    // Simulasi proses autentikasi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate auth, then redirect by role
    const from = (location.state as any)?.from?.pathname as string | undefined;
    setRole(role as any);
    let target = "/dashboard";
    if (role === "admin") target = "/admin/baruisi/dashboard";
    if (role === "affiliator") target = "/affiliatr";
    // Respect from if present and compatible; otherwise use role default
    toast({ title: "Berhasil masuk", description: "Selamat datang kembali!" });
    navigate(from || target, { replace: true });
    
    setIsLoading(false);
  };

  const getRoleIcon = () => {
    switch(role) {
      case "admin": return <Shield className="h-5 w-5" />;
      case "affiliator": return <TrendingUp className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getRoleDescription = () => {
    switch(role) {
      case "admin": return "Akses penuh ke dashboard administrasi";
      case "affiliator": return "Kelola program afiliasi dan pantau komisi";
      default: return "Akses ke fitur pengguna biasa";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang Kembali</h1>
          <p className="text-gray-600">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                {getRoleIcon()}
              </div>
            </div>
            <CardTitle className="text-xl text-center">Masuk ke Akun</CardTitle>
            <CardDescription className="text-center">
              {getRoleDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nama@email.com" 
                  value={email} 
                  onChange={(e)=>setEmail(e.target.value)} 
                  required 
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-1">
                  <Lock className="h-4 w-4" /> Password
                </Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Masukkan password" 
                    value={password} 
                    onChange={(e)=>setPassword(e.target.value)} 
                    required 
                    className="h-11 pr-10"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-11 w-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  className="w-full h-11" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Masuk <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Belum punya akun?{" "}
                  <Link 
                    to="/register" 
                    className="text-primary font-medium hover:underline"
                  >
                    Daftar sekarang
                  </Link>
                </p>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-muted-foreground hover:text-primary hover:underline mt-2 inline-block"
                >
                  Lupa password?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Dengan masuk, Anda menyetujui Syarat & Ketentuan dan Kebijakan Privasi kami
          </p>
        </div>
      </div>
    </div>
  );
}