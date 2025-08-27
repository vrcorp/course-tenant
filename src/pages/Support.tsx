import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, LifeBuoy, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Support() {
  return (
    <div className="container mx-auto max-w-5xl px-6 py-12">
      <div className="text-center mb-10">
        <LifeBuoy className="mx-auto h-10 w-10 text-primary mb-3" />
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Pusat Bantuan</h1>
        <p className="text-muted-foreground mt-2">Kami siap membantu Anda memulai dan memecahkan masalah dengan cepat.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Dokumentasi</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Panduan langkah demi langkah untuk LMS dan Video Hosting.
            <div className="mt-4">
              <Link to="/documentation" className="text-primary hover:underline">Buka Dokumentasi →</Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> Pertanyaan Umum</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Lihat jawaban dari pertanyaan paling sering diajukan.
            <div className="mt-4">
              <Link to="/faq" className="text-primary hover:underline">Lihat FAQ →</Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> Hubungi Kami</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Butuh bantuan lebih lanjut? Tim kami siap membantu.
            <div className="mt-4">
              <Link to="/contact" className="text-primary hover:underline">Halaman Kontak →</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
