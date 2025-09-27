import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface Testimonial {
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
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  // Safety check
  if (!testimonials || !Array.isArray(testimonials) || testimonials.length === 0) {
    return null; // Or return a placeholder/message
  }
  
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.05),transparent_50%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 text-sm font-semibold text-amber-700 dark:text-amber-300 mb-6">
            <Quote className="h-4 w-4" />
            Testimoni Siswa
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-amber-800 to-orange-800 dark:from-white dark:via-amber-200 dark:to-orange-200 bg-clip-text text-transparent mb-6 leading-tight">
            Cerita Sukses
            <span className="block">Para Pembelajar</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Bergabunglah dengan ribuan siswa yang telah merasakan transformasi karir melalui pembelajaran berkualitas
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:px-6">
          {testimonials.map((t, index) => (
            <div 
              key={t.id} 
              className="group relative rounded-3xl border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/10 to-orange-600/10 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative p-8">
                {/* Quote icon */}
                <div className="absolute top-6 right-6 p-2 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  <Quote className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                
                {/* Star rating */}
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-5 w-5 text-amber-400 fill-amber-400 group-hover:text-amber-500 group-hover:fill-amber-500 transition-colors duration-300" 
                    />
                  ))}
                </div>
                
                {/* Testimonial text */}
                <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-8 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                  "{t.quote}"
                </blockquote>
                
                {/* Author info */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="relative">
                    <img 
                      src={t.avatar} 
                      alt={t.name} 
                      className="h-14 w-14 rounded-full object-cover ring-3 ring-amber-200/50 dark:ring-amber-800/50 group-hover:ring-amber-300/70 dark:group-hover:ring-amber-700/70 transition-all duration-300 shadow-lg" 
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">
                      {t.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {t.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
