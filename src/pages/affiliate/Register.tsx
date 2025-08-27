import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, Phone, Link as LinkIcon, Users, Globe, ArrowLeft, ArrowRight, TrendingUp } from "lucide-react";

export default function AffiliateRegister() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [channel, setChannel] = useState<string | undefined>(undefined);
  const [audience, setAudience] = useState<string | undefined>(undefined);
  const [agree, setAgree] = useState(false);

  const validate = () => {
    const emailOk = /.+@.+\..+/.test(email);
    const phoneOk = /^\+?[0-9]{8,15}$/.test(phone.replace(/\s|-/g, ""));
    if (!name.trim()) {
      toast({ title: "Nama wajib diisi", variant: "destructive" });
      return false;
    }
    if (!emailOk) {
      toast({ title: "Email tidak valid", description: "Masukkan email yang benar.", variant: "destructive" });
      return false;
    }
    if (!phoneOk) {
      toast({ title: "Nomor HP tidak valid", description: "Gunakan format 8-15 digit, boleh diawali +.", variant: "destructive" });
      return false;
    }
    if (!channel) {
      toast({ title: "Pilih kanal promosi", variant: "destructive" });
      return false;
    }
    if (!audience) {
      toast({ title: "Pilih kisaran audiens", variant: "destructive" });
      return false;
    }
    if (!agree) {
      toast({ title: "Konfirmasi diperlukan", description: "Setujui S&K program afiliasi untuk melanjutkan.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await new Promise((r) => setTimeout(r, 1200));
    toast({ title: "Pendaftaran terkirim", description: "Tim kami akan meninjau dalam 1-2 hari kerja." });
    navigate("/affiliatr", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-10">
      <div className="w-full max-w-2xl">
        

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Daftar Afiliasi</CardTitle>
            <CardDescription className="text-center">Lengkapi formulir berikut untuk bergabung sebagai partner afiliasi.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1"><User className="h-4 w-4"/> Nama Lengkap</Label>
                  <Input id="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nama sesuai KTP" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1"><Mail className="h-4 w-4"/> Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="nama@email.com" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1"><Phone className="h-4 w-4"/> Nomor HP</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Contoh: +6281234567890" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-1"><Globe className="h-4 w-4"/> Website (opsional)</Label>
                  <Input id="website" type="url" value={website} onChange={(e)=>setWebsite(e.target.value)} placeholder="https://domainanda.com" className="h-11" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Users className="h-4 w-4"/> Kisaran Audiens</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Pilih kisaran" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<1k">&lt; 1.000</SelectItem>
                    <SelectItem value="1k-10k">1.000 - 10.000</SelectItem>
                    <SelectItem value="10k-100k">10.000 - 100.000</SelectItem>
                    <SelectItem value=">100k">&gt; 100.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1"><LinkIcon className="h-4 w-4"/> Kanal Promosi Utama</Label>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Pilih kanal" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="website">Website/Blog</SelectItem>
                    <SelectItem value="email">Email Marketing</SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram (opsional)</Label>
                <Input id="instagram" value={instagram} onChange={(e)=>setInstagram(e.target.value)} placeholder="https://instagram.com/username" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube (opsional)</Label>
                <Input id="youtube" value={youtube} onChange={(e)=>setYoutube(e.target.value)} placeholder="https://youtube.com/@channel" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktok">TikTok (opsional)</Label>
                <Input id="tiktok" value={tiktok} onChange={(e)=>setTiktok(e.target.value)} placeholder="https://tiktok.com/@username" className="h-11" />
              </div>

              <div className="md:col-span-2 flex items-start space-x-2 pt-2">
                <Checkbox id="agree" checked={agree} onCheckedChange={(c)=>setAgree(c===true)} />
                <Label htmlFor="agree" className="text-sm font-normal leading-5 cursor-pointer">
                  Saya menyetujui <Link to="/terms" className="text-primary hover:underline">Syarat & Ketentuan</Link> program afiliasi ini
                </Label>
              </div>
              <div className="mb-6 flex items-center justify-between">
                <Link to="/affiliate" className="text-primary hover:underline">Tentang Program</Link>
              </div>
              <div className="md:col-span-2 pt-2">
                <Button type="submit" className="w-full h-11">
                  Kirim Pendaftaran <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Sudah terdaftar sebagai afiliasi? {" "}
          <Link to="/login" className="text-primary hover:underline">Masuk</Link>
        </div>
      </div>
    </div>
  );
}
