import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { setRole } from "@/lib/auth";
import { Eye, EyeOff, Mail, Lock, User, Shield, TrendingUp, ArrowRight, Check, FileText, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validations
    const emailOk = /.+@.+\..+/.test(email);
    const phoneOk = /^\+?[0-9]{8,15}$/.test(phone.replace(/\s|-/g, ""));
    const passOk = password.length >= 8;
    if (!emailOk) {
      toast({ title: "Email tidak valid", description: "Mohon masukkan email yang benar.", variant: "destructive" });
      return;
    }
    if (!phoneOk) {
      toast({ title: "Nomor HP tidak valid", description: "Gunakan format angka 8-15 digit, boleh diawali +.", variant: "destructive" });
      return;
    }
    if (!passOk) {
      toast({ title: "Password terlalu pendek", description: "Minimal 8 karakter.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Konfirmasi password tidak sama", description: "Periksa kembali password Anda.", variant: "destructive" });
      return;
    }
    if (!agree) {
      toast({ title: "Konfirmasi diperlukan", description: "Anda harus menyetujui Syarat & Ketentuan untuk melanjutkan.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    // Simulate register process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate register then redirect per role
    setRole(role as any);
    let target = "/dashboard";
    if (role === "admin") target = "/admin/baruisi/dashboard";
    if (role === "affiliator") target = "/affiliatr";
    toast({ title: "Pendaftaran berhasil", description: "Akun Anda berhasil dibuat. Mengarahkan ke dashboard..." });
    navigate(target, { replace: true });
    
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
      case "admin": return "Akses penuh ke sistem administrasi";
      case "affiliator": return "Bergabung dengan program afiliasi kami";
      default: return "Akses ke fitur pengguna standar";
    }
  };

  const getRoleBenefits = () => {
    switch(role) {
      case "admin": 
        return ["Akses ke semua fitur sistem", "Kelola pengguna dan konten", "Laporan dan analitik lengkap"];
      case "affiliator": 
        return ["Komisi dari setiap referral", "Dashboard analitik performa", "Materi promosi eksklusif"];
      default: 
        return ["Akses ke konten premium", "Personalized experience", "Dukungan prioritas"];
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bergabung Bersama Kami</h1>
          <p className="text-gray-600">Buat akun untuk mengakses semua fitur yang tersedia</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        
          {/* Registration Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl text-center">Buat Akun Baru</CardTitle>
              <CardDescription className="text-center">
                Isi informasi berikut untuk membuat akun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1">
                    <User className="h-4 w-4" /> Nama Lengkap
                  </Label>
                  <Input 
                    id="name" 
                    placeholder="Masukkan nama lengkap" 
                    value={name} 
                    onChange={(e)=>setName(e.target.value)} 
                    required 
                    className="h-11"
                  />
                </div>
                
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
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    <Phone className="h-4 w-4" /> Nomor HP
                  </Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="Contoh: +6281234567890" 
                    value={phone} 
                    onChange={(e)=>setPhone(e.target.value)} 
                    required 
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">Gunakan nomor aktif untuk verifikasi dan pemulihan akun.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-1">
                    <Lock className="h-4 w-4" /> Password
                  </Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Buat password yang kuat" 
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
                  <p className="text-xs text-muted-foreground">
                    Gunakan minimal 8 karakter dengan kombinasi huruf, angka, dan simbol
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Konfirmasi password Anda" 
                      value={confirmPassword} 
                      onChange={(e)=>setConfirmPassword(e.target.value)} 
                      required 
                      className="h-11 pr-10"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-0 top-0 h-11 w-10"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox 
                    id="agree" 
                    checked={agree} 
                    onCheckedChange={(checked) => setAgree(checked === true)}
                  />
                  <Label htmlFor="agree" className="text-sm font-normal leading-5 cursor-pointer">
                    Saya setuju dengan{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Syarat & Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Kebijakan Privasi
                    </Link>
                  </Label>
                </div>
                
                <div className="pt-2">
                  <Button 
                    className="w-full h-11" 
                    type="submit" 
                    disabled={!agree || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Membuat Akun...
                      </>
                    ) : (
                      <>
                        Daftar Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground">
                    Sudah punya akun?{" "}
                    <Link 
                      to="/login" 
                      className="text-primary font-medium hover:underline"
                    >
                      Masuk di sini
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Dengan mendaftar, Anda menyetujui semua kebijakan yang berlaku
          </p>
        </div>
      </div>
    </div>
  );
}