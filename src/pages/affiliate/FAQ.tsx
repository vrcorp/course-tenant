import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, HelpCircle } from "lucide-react";
import faqs from "@/data/affiliate_faqs.json";

export default function AffiliateFAQ() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>
        <Badge variant="outline">Affiliate FAQ</Badge>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 flex items-center justify-center gap-2">
          <HelpCircle className="h-7 w-7 text-primary" /> Pertanyaan Umum Afiliasi
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Temukan jawaban atas pertanyaan yang paling sering diajukan seputar program afiliasi kami.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {faqs.map((item, idx) => (
          <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">{item.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-muted-foreground mb-3">Tidak menemukan jawaban yang Anda cari?</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/contact" className="text-primary hover:underline">Hubungi Kami</Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/affiliate" className="text-primary hover:underline">Kembali ke Halaman Afiliasi</Link>
        </div>
      </div>
    </div>
  );
}
