import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Syarat & Ketentuan</h1>
        <p className="text-muted-foreground mt-2">Terakhir diperbarui: 2025-08-22</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ruang Lingkup Layanan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>Layanan mencakup penyewaan instans LMS multi-tenant dan paket video hosting dengan batasan sesuai paket.</p>
          <p>Setiap tenant bertanggung jawab atas konten yang diunggah dan kepatuhan terhadap peraturan yang berlaku.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Penggunaan yang Dilarang</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
          <ul className="list-disc ml-5 space-y-2">
            <li>Pelanggaran hak cipta atau konten ilegal.</li>
            <li>Penyalahgunaan sumber daya (spam, serangan, atau aktivitas merusak).</li>
            <li>Berbagi kredensial atau akses tanpa izin.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Penagihan & Pembatalan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>Tagihan bersifat bulanan dan dapat dibatalkan kapan saja. Penghentian layanan akan menonaktifkan akses instans tenant Anda.</p>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">Pertanyaan lebih lanjut? Kunjungi halaman Support atau hubungi kami melalui Contact.</p>
    </div>
  );
}
