import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check, Star, Crown, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Pricing() {
  const pricingPlans = [
    {
      name: "Starter",
      price: 29,
      badge: "Populer",
      badgeVariant: "default" as const,
      icon: Star,
      features: [
        "Akses 50+ kursus premium",
        "Sertifikat digital resmi",
        "Quiz & latihan interaktif",
        "Progress tracking",
        "Akses mobile & desktop"
      ],
      link: "/register",
      buttonText: "Mulai Belajar",
      buttonStyle: "primary" as const
    },
    {
      name: "Professional",
      price: 59,
      badge: "Terbaik",
      badgeVariant: "secondary" as const,
      icon: Crown,
      features: [
        "Akses semua kursus premium",
        "Live class eksklusif",
        "Mentoring 1-on-1",
        "Portfolio review",
        "Job placement assistance",
        "Lifetime access"
      ],
      link: "/register",
      buttonText: "Upgrade Sekarang",
      buttonStyle: "outline" as const
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-transparent to-purple-50/20 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 text-sm font-semibold text-green-700 dark:text-green-300 mb-6">
            <Zap className="h-4 w-4" />
            Paket Pembelajaran
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-green-800 to-blue-800 dark:from-white dark:via-green-200 dark:to-blue-200 bg-clip-text text-transparent mb-6 leading-tight">
            Investasi Terbaik untuk
            <span className="block">Masa Depan Anda</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Pilih paket yang sesuai dengan tujuan pembelajaran Anda. Mulai perjalanan menuju kesuksesan profesional.
          </p>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div 
                key={index}
                className="group relative rounded-3xl border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden"
              >
                {/* Card glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 shadow-lg">
                        <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white">{plan.name}</h3>
                    </div>
                    <Badge variant={plan.badgeVariant} className="px-3 py-1 font-semibold">
                      {plan.badge}
                    </Badge>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-black text-gray-900 dark:text-white">${plan.price}</span>
                      <span className="text-lg text-gray-500 dark:text-gray-400 font-medium">/bulan</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">Akses penuh selama berlangganan</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    to={plan.link} 
                    className={`group/btn relative inline-flex items-center justify-center w-full rounded-2xl px-6 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                      plan.buttonStyle === 'primary' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                        : 'border-2 border-blue-600 hover:border-blue-700 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">{plan.buttonText}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
