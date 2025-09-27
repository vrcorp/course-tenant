import { useState, useEffect } from 'react';
import Testimonials from "@/components/landing/Testimonials";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { isServer } from '@tanstack/react-query';

interface AboutData {
  tenant: {
    id: string;
    name: string;
    slug: string;
    about: string;
    domain: {
      type: string;
      value: string;
    };
    branding: {
      logo: string;
      primary: string;
    };
    social: {
      twitter: string;
      facebook: string;
      instagram: string;
    };
    contact: {
      map: string;
      email: string;
      phone: string;
      address: string;
    };
    packageId: string;
    quotas: {
      courses: number;
      students: number;
    };
    isActive: boolean;
    expiredAt: string;
    createdAt: string;
    updatedAt: string;
  };
  testimonials: Array<{
    id: string;
    name: string;
    title: string;
    avatar: string;
    quote: string;
    rating: number;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  }>;
  stats: {
    totalTestimonials: number;
    averageRating: number;
    highestRating: number;
  };
  values?: string[]; // 👉 optional
  features?: Array<{
    id: string;
    title: string;
    description: string;
  }>; // 👉 optional
}

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAboutData() {
      try {
        setLoading(true);
        const baseUrl = isServer
          ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api/"
          : "http://localhost:3000/api/";
        const tenantId = isServer
          ? process.env.NEXT_TENANT_ID || "tenant-1"
          : "tenant-1";
        const response = await fetch(`${baseUrl}about`, {
          method: "GET",
          headers: {
            "x-tenant-id": tenantId,
            "Content-Type": "application/json",
          },
          referrerPolicy: 'strict-origin-when-cross-origin',
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error('Failed to fetch about data');
        }
        const data = await response.json();
        setAboutData({
          ...data.data,
          values: data.data.values ?? [],       // 👉 fallback array kosong
          features: data.data.features ?? [],   // 👉 fallback array kosong
        });
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError('Gagal memuat data. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    }

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-8">
          <div className="text-center">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
          </div>
          <Skeleton className="w-full h-[400px] rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 mx-auto" />
            <div className="flex justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg inline-block">
          {error}
        </div>
      </div>
    );
  }
  
  if (!aboutData) return null;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {aboutData.tenant.name}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground leading-relaxed">
          {aboutData.tenant.about}
        </p>
      </div>
      
      <div className="relative mb-20">
        <img 
          src={aboutData.tenant.branding.logo} 
          alt="About" 
          className="w-full h-[400px] object-cover rounded-xl shadow-lg" 
        />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Nilai Kami</h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
          {(aboutData.values ?? []).map((v: string) => (
            <Badge key={v} variant="secondary" className="px-5 py-2 text-base font-medium rounded-full">
              {v}
            </Badge>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Keunggulan Layanan Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(aboutData.features ?? []).map((f) => (
            <Card key={f.id} className="overflow-hidden border-2 transition-all hover:border-primary hover:shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {aboutData.testimonials && aboutData.testimonials.length > 0 && (
        <Testimonials testimonials={aboutData.testimonials} />
      )}
    </div>
  );
}
