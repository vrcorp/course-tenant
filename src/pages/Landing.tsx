import { useState, useEffect } from "react";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CoursesSection from "@/components/landing/CoursesSection";
import DualProducts from "@/components/landing/DualProducts";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import AffiliatorSection from "@/components/landing/AffiliatorSection";
import Faqs from "@/components/landing/Faqs";
import { isServer } from "@tanstack/react-query";

// Define types for the homepage data
interface HomepageData {
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
      theme: string;
    };
    social: {
      facebook: string;
      instagram: string;
    };
    contact: {
      email: string;
      phone: string;
    };
    isActive: boolean;
    expiredAt: string;
  };
  slides: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    badge: string;
    stats: {
      [key: string]: string;
    };
    ctaText: string;
    ctaLink: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
  }>;
  courses: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    category: {
      id: string;
      name: string;
      icon: string;
      color: string;
    };
    level: string;
    duration: string;
    lessons: number;
    price: number;
    originalPrice: number;
    discount: number;
    language: string;
    rating: number;
    students: number;
    lastUpdated: string;
    certificate: boolean;
    featured: boolean;
    bestseller: boolean;
    instructor: {
      name: string;
      title: string;
    };
    features: string[];
    skills: string[];
  }>;
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
  }>;
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
    totalSlides: number;
    totalCourses: number;
    totalFaqs: number;
    totalTestimonials: number;
    featuredCourses: number;
    bestsellerCourses: number;
    averageTestimonialRating: number;
  };
}

async function getHomepageData(): Promise<HomepageData> {
  const baseUrl = isServer
  ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api/"
  : "http://localhost:3000/api/";
  const tenantId = isServer
  ? process.env.NEXT_TENANT_ID || "tenant-1"
  : "tenant-1";
  const res = await fetch(`${baseUrl}homepage`, {
    method: "GET",
    headers: {
      "x-tenant-id": tenantId,
      "Content-Type": "application/json",
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch homepage data");
  }

  const data = await res.json();
  return data.data;
}

export default function Landing() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getHomepageData();
        
        // Transform slides to add missing stats property
        const transformedData = {
          ...data,
          slides: data.slides.map((slide, index) => ({
            ...slide,
            stats: {
              "Students": `${(index + 1) * 1250}+`,
              "Rating": "4.9",
              "Courses": `${(index + 1) * 50}+`
            }
          }))
        };
        
        setHomepageData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!homepageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">No Data</h1>
          <p className="text-gray-500">Homepage data is not available</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative">
      {/* Hero */}
      <div className="full-bleed">
        <Hero slides={homepageData.slides} tenant={homepageData.tenant} />
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-800" />

      {/* Features */}
      <section id="fitur" className="full-bleed">
        <Features />
      </section>

      {/* Courses */}
      <section id="kursus" className="full-bleed">
        <CoursesSection courses={homepageData.courses} />
      </section>

      {/* Dual Products */}
      <section id="produk" className="relative full-bleed">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white dark:from-transparent dark:to-transparent" />
        <div className="md:container mx-auto md:px-6 md:py-16">
          <DualProducts />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="bg-white dark:bg-transparent full-bleed">
        <Testimonials testimonials={homepageData.testimonials} />
      </section>

      {/* Affiliator */}
      <section id="afiliasi" className="full-bleed">
        <AffiliatorSection />
      </section>

      {/* FAQs */}
      <section id="faqs" className="bg-white dark:bg-transparent full-bleed">
        <div className="md:container mx-auto md:px-6 md:py-16">
          <Faqs faqs={homepageData.faqs} />
        </div>
      </section>
    </main>
  );
}
