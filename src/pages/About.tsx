import company from "@/data/company.json";
import features from "@/data/features.json";
import Testimonials from "@/components/landing/Testimonials";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{company.name}</h1>
        <p className="mt-4 text-xl text-muted-foreground leading-relaxed">{company.mission}</p>
      </div>
      
      <div className="relative mb-20">
        <img 
          src={company.heroImage} 
          alt="About" 
          className="w-full h-[400px] object-cover rounded-xl shadow-lg" 
        />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Nilai Kami</h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
          {company.values.map((v: string) => (
            <Badge key={v} variant="secondary" className="px-5 py-2 text-base font-medium rounded-full">{v}</Badge>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Keunggulan Layanan Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.id} className="overflow-hidden border-2 transition-all hover:border-primary hover:shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Testimonials />
    </div>
  );
}
