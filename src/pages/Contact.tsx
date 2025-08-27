import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import contact from "@/data/contact.json";

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Kontak Kami</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Kami siap membantu kebutuhan Anda. Jangan ragu untuk menghubungi kami melalui informasi di bawah ini.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader className="text-center">
            <Mail className="w-10 h-10 mx-auto text-primary mb-2" />
            <CardTitle>Email</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
              {contact.email}
            </a>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <Phone className="w-10 h-10 mx-auto text-primary mb-2" />
            <CardTitle>Telepon</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-primary hover:underline">
              {contact.phone}
            </a>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <MapPin className="w-10 h-10 mx-auto text-primary mb-2" />
            <CardTitle>Alamat</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>{contact.address}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="overflow-hidden">
          <img src={contact.mapImage} alt="Our Office" className="w-full h-[300px] object-cover" />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kirim Pesan</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input placeholder="Nama Lengkap" />
                </div>
                <div className="space-y-2">
                  <Input type="email" placeholder="Email" />
                </div>
              </div>
              <div>
                <Input placeholder="Subjek" />
              </div>
              <div>
                <Textarea placeholder="Pesan" rows={5} />
              </div>
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" /> Kirim Pesan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
