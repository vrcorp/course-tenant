import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Kebijakan Privasi</h1>
        <p className="text-muted-foreground mt-2">Terakhir diperbarui: 2025-08-22</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informasi yang Kami Kumpulkan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>Kami mengumpulkan data akun, aktivitas penggunaan, dan konten yang Anda unggah untuk menyediakan layanan LMS dan Video Hosting.</p>
          <p>Data tertentu diperlukan untuk kepatuhan, pencegahan penipuan, dan peningkatan produk.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bagaimana Kami Menggunakan Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <ul className="list-disc ml-5 space-y-2">
            <li>Menyediakan, memelihara, dan meningkatkan layanan.</li>
            <li>Analitik agregat untuk memahami penggunaan dan meningkatkan pengalaman.</li>
            <li>Kepatuhan hukum dan keamanan.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Berbagi & Penyimpanan Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>Kami tidak menjual data pribadi. Data dapat diproses oleh penyedia pihak ketiga tepercaya (mis. pembayaran, email) sesuai kebutuhan.</p>
          <p>Konten tenant dipisahkan secara logis untuk menjaga isolasi dan keamanan.</p>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">Untuk pertanyaan privasi, hubungi kami melalui halaman Contact.</p>
    </div>
  );
}
