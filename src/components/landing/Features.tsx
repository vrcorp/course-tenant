import features from "@/data/features.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Video, BookOpen, Users, CreditCard, BarChart, Zap, Smartphone } from "lucide-react";

export default function Features() {
  const featureIcons = {
    f1: Shield,
    f2: Video,
    f3: BookOpen,
    f4: Users,
    f5: CreditCard,
    f6: BarChart,
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-6">
            <Zap className="h-4 w-4" />
            Keunggulan Platform
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
            Mengapa Memilih
            <span className="block">Platform Kami?</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Dapatkan pengalaman belajar terbaik dengan fitur-fitur canggih yang dirancang khusus untuk kesuksesan Anda
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = featureIcons[feature.id as keyof typeof featureIcons] || Shield;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-800/50 dark:group-hover:to-purple-800/50 transition-all duration-300 shadow-lg">
                      <IconComponent className="h-7 w-7 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300 group-hover:scale-110 transform" />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
