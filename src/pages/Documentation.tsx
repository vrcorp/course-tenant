import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Layers, Server, Shield, Globe, Users } from "lucide-react";

export default function Documentation() {
  return (
    <div className="container mx-auto max-w-6xl px-6 py-12">
      <div className="text-center mb-10">
        <Book className="mx-auto h-10 w-10 text-primary mb-3" />
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Dokumentasi</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Panduan ringkas untuk memulai dan mengelola LMS multi-tenant dan Video Hosting Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-primary" /> Memulai dengan LMS</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <ol className="list-decimal ml-5 space-y-2">
              <li>Pilih paket LMS di halaman Pricing dan selesaikan checkout.</li>
              <li>Akses Tenant Admin melalui sidebar dan atur domain/subdomain Anda.</li>
              <li>Tambahkan kursus, instruktur, dan siswa sesuai kuota paket.</li>
              <li>Publikasikan landing tenant Anda di /t/:tenantSlug.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Server className="h-5 w-5 text-primary" /> Memulai dengan Video Hosting</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <ol className="list-decimal ml-5 space-y-2">
              <li>Pilih paket video hosting dan lakukan pembayaran.</li>
              <li>Unggah video di halaman Upload dan pantau proses transcoding.</li>
              <li>Sematkan atau bagikan video sesuai kebutuhan.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Manajemen Pengguna & Peran</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <ul className="list-disc ml-5 space-y-2">
              <li>User: akses Dashboard, Video, Courses, dan Tenant Admin bila berlangganan LMS.</li>
              <li>Admin/Super Admin: kelola paket, pesanan, pengguna, voucher, dan pengaturan situs.</li>
              <li>Affiliator: kelola link, komisi, payout, dan aset promosi.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Keamanan & Isolasi Tenant</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Setiap tenant diisolasi secara logis. Gunakan domain kustom untuk identitas brand dan akses terpisah.
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Domain & Konektivitas</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>Subdomain disediakan default, domain kustom tersedia pada paket tertentu. Ikuti panduan verifikasi DNS pada halaman Tenant Admin › Settings.</p>
            <p>Integrasi pembayaran, SMTP, dan WhatsApp dapat diatur melalui Admin › API Settings.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
