import { Link } from "react-router-dom";
import { BookOpen, ShieldCheck, Zap, Users, Award, Clock, ArrowRight, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import company from "@/data/company.json";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Enhanced geometric background */}
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05]">
        <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.3"/>
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#gridGradient)" />
        </svg>
      </div>

      {/* Enhanced ambient lighting effects */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Status badge */}
        <div className="flex justify-center mb-8">
          <div className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-blue-200/30 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-slate-800/80 dark:to-blue-900/80 backdrop-blur-md text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-20" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
              Platform Pembelajaran Online Terdepan
            </span>
          </div>
        </div>

        {/* Main heading */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tight mb-8 animate-fade-in">
            <span className="block text-gray-900 dark:text-white drop-shadow-sm">Platform</span>
            <span className="block">
              <span className="text-gray-900 dark:text-white drop-shadow-sm">Pembelajaran </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent animate-gradient-x">
                  Terdepan
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-700/20 blur-2xl -z-10 opacity-80 animate-pulse" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-indigo-500/30 blur-lg -z-10 opacity-60" />
              </span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
            {company.tagline}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
          <Link to="/courses" className="group relative h-16 px-10 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 rounded-2xl text-white flex items-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <BookOpen className="mr-4 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10">Jelajahi Kursus</span>
            <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>

          <Link to="/register" className="group relative h-16 px-10 text-lg font-bold border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 hover:border-blue-400 dark:hover:border-blue-600 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-500 rounded-2xl text-gray-900 dark:text-white flex items-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Play className="mr-4 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700">Mulai Belajar Gratis</span>
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-gray-200/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Pembayaran Aman</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enkripsi end-to-end & gateway terpercaya</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-gray-200/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Streaming 4K</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kualitas video adaptif tanpa buffering</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-gray-200/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Akses Lifetime</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Belajar kapan saja, dimana saja, selamanya</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm hover:from-white/15 hover:to-white/10 transition-all duration-500">
            <CardContent className="p-8 text-center">
              <div className="mb-4 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">150+</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Kursus Premium</div>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm hover:from-white/15 hover:to-white/10 transition-all duration-500">
            <CardContent className="p-8 text-center">
              <div className="mb-4 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">25K+</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Pelajar Aktif</div>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm hover:from-white/15 hover:to-white/10 transition-all duration-500">
            <CardContent className="p-8 text-center">
              <div className="mb-4 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">99.8%</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Uptime Server</div>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm hover:from-white/15 hover:to-white/10 transition-all duration-500">
            <CardContent className="p-8 text-center">
              <div className="mb-4 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Support Tim</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}