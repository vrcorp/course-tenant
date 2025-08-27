import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CoursesSection from "@/components/landing/CoursesSection";
import DualProducts from "@/components/landing/DualProducts";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import AffiliatorSection from "@/components/landing/AffiliatorSection";
import Faqs from "@/components/landing/Faqs";

export default function Landing() {
  return (
    <main className="relative">
      {/* Full-bleed hero */}
      <div className="full-bleed">
        <Hero />
      </div>

      {/* Decorative divider under hero */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-800" />

      {/* Section: Features (light background) */}
      <section id="fitur" className="bg-white dark:bg-transparent">
        <div className="container mx-auto px-6 py-16">
          <Features />
        </div>
      </section>

      {/* Section: Courses */}
      <section id="kursus" className="full-bleed">
        <CoursesSection />
      </section>

      {/* Section: Dual Products (subtle band) */}
      <section id="produk" className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white dark:from-transparent dark:to-transparent" />
        <div className="container mx-auto px-6 py-16">
          <DualProducts />
        </div>
      </section>

      {/* Section: Testimonials (white) */}
      <section id="testimoni" className="bg-white dark:bg-transparent">
        <div className="container mx-auto px-6 py-16">
          <Testimonials />
        </div>
      </section>

      {/* Section: Pricing (band) */}
      <section id="harga" className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-slate-50 dark:from-transparent dark:to-transparent" />
        <div className="container mx-auto px-6 py-16">
          <Pricing />
        </div>
      </section>

      {/* Section: Affiliator */}
      <section id="afiliasi" className="full-bleed">
        <AffiliatorSection />
      </section>

      {/* Section: FAQs */}
      <section id="faqs" className="bg-white dark:bg-transparent">
        <div className="container mx-auto px-6 py-16">
          <Faqs />
        </div>
      </section>
    </main>
  );
}
