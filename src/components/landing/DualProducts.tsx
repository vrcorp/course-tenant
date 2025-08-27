import { Link } from "react-router-dom";
import { BookOpen, Award, Users, ArrowRight } from "lucide-react";

export default function DualProducts() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10" />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-sm font-semibold text-blue-700 dark:text-blue-300 mb-6">
            <Award className="h-4 w-4" />
            Fitur Unggulan
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
            Fitur Pembelajaran
            <span className="block">Terlengkap</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Dapatkan pengalaman belajar yang komprehensif dan interaktif dengan teknologi terdepan
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-2 max-w-6xl mx-auto">
          <div className="group relative rounded-3xl border border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-slate-800 dark:via-blue-900/20 dark:to-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col transform hover:scale-105">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-8 flex-1">
              <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600/15 to-blue-700/15 text-blue-700 dark:text-blue-300 px-4 py-2.5 text-sm font-bold mb-6 shadow-lg">
                <BookOpen className="h-5 w-5" /> 
                <span>Kursus Online</span>
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                Pembelajaran Interaktif
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
                Akses ribuan kursus berkualitas tinggi dengan materi yang selalu update dan instruktur berpengalaman.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"></div>
                  <span className="font-medium">Video HD & Materi Lengkap</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"></div>
                  <span className="font-medium">Quiz & Latihan Interaktif</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"></div>
                  <span className="font-medium">Akses Seumur Hidup</span>
                </li>
              </ul>
            </div>
            <div className="relative p-8 pt-0">
              <Link to="/courses" className="group/btn relative inline-flex items-center justify-center w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Jelajahi Kursus</span>
                <ArrowRight className="h-5 w-5 ml-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          <div className="group relative rounded-3xl border border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-slate-800 dark:via-purple-900/20 dark:to-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col transform hover:scale-105">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-8 flex-1">
              <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-600/15 to-purple-700/15 text-purple-700 dark:text-purple-300 px-4 py-2.5 text-sm font-bold mb-6 shadow-lg">
                <Award className="h-5 w-5" /> 
                <span>Sertifikat & Achievement</span>
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
                Sertifikat Profesional
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
                Dapatkan sertifikat resmi setelah menyelesaikan kursus dan tingkatkan kredibilitas profesional Anda.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 shadow-sm"></div>
                  <span className="font-medium">Sertifikat Digital Resmi</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 shadow-sm"></div>
                  <span className="font-medium">Badge & Achievement</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 shadow-sm"></div>
                  <span className="font-medium">Portfolio Pembelajaran</span>
                </li>
              </ul>
            </div>
            <div className="relative p-8 pt-0">
              <Link to="/certificates" className="group/btn relative inline-flex items-center justify-center w-full rounded-2xl border-2 border-purple-600 hover:border-purple-700 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 hover:text-purple-700 px-6 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Lihat Sertifikat</span>
                <ArrowRight className="h-5 w-5 ml-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
