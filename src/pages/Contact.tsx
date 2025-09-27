"use client";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { isServer } from "@tanstack/react-query";

interface ContactData {
  tenant: {
    id: string;
    name: string;
    contact: {
      map: string;
      email: string;
      phone: string;
      address: string;
    };
  };
}

export default function Contact() {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContactData() {
      try {
        setLoading(true);
        const baseUrl = isServer
          ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api/"
          : "http://localhost:3000/api/";
        const tenantId = isServer
          ? process.env.NEXT_TENANT_ID || "tenant-1"
          : "tenant-1";

        const response = await fetch(`${baseUrl}contact`, {
          method: "GET",
          headers: {
            "x-tenant-id": tenantId,
            "Content-Type": "application/json",
          },
          referrerPolicy: "strict-origin-when-cross-origin",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch contact data");
        }

        const data = await response.json();

        // ambil hanya 1 tenant (misal tenant pertama)
        const tenant = Array.isArray(data.data)
          ? data.data.find((t: any) => t.id === tenantId)
          : data.data;

        setContactData({ tenant });
      } catch (err) {
        console.error("Error fetching contact data:", err);
        setError("Gagal memuat data kontak. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    }

    fetchContactData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);
    try {
      const baseUrl = "http://localhost:3000/api/";
      const tenantId = "tenant-1";
      const response = await fetch(`${baseUrl}contact`, {
        method: "POST",
        headers: {
          "x-tenant-id": tenantId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, subject, message }),
      });

      const data = await response.json();
      if (!response.ok) {
        setSubmitMessage(data.error || "Gagal mengirim pesan");
      } else {
        setSubmitMessage(data.message);
        setFullName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }
    } catch (err) {
      console.error("Contact form submit error:", err);
      setSubmitMessage("Terjadi kesalahan. Coba lagi nanti.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-3/4 mx-auto mb-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="w-10 h-10 mx-auto mb-4 rounded-full" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="w-full h-[300px] rounded-xl" />
          <Card className="p-6 space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!contactData) return null;

  const { contact } = contactData.tenant;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Kontak Kami
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Kami siap membantu kebutuhan Anda. Jangan ragu untuk menghubungi kami
          melalui informasi di bawah ini.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader className="text-center">
            <Mail className="w-10 h-10 mx-auto text-primary mb-2" />
            <CardTitle>Email</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <a
              href={`mailto:${contact.email}`}
              className="text-primary hover:underline"
            >
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
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="text-primary hover:underline"
            >
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
          <iframe
            src={contact.map}
            className="w-full h-[300px] border-0"
            loading="lazy"
          ></iframe>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kirim Pesan</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Nama Lengkap"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Input
                placeholder="Subjek"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
              <Textarea
                placeholder="Pesan"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={submitting}>
                <Send className="mr-2 h-4 w-4" />{" "}
                {submitting ? "Mengirim..." : "Kirim Pesan"}
              </Button>
              {submitMessage && (
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  {submitMessage}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
