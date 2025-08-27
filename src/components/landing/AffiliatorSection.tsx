import { Link } from "react-router-dom";
import { Users, TrendingUp, DollarSign, Award, ArrowRight, Star, Target, Zap } from "lucide-react";

export default function AffiliatorSection() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Komisi Menarik",
      description: "Dapatkan komisi hingga 30% dari setiap penjualan kursus yang berhasil Anda referensikan",
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      icon: TrendingUp,
      title: "Tracking Real-time",
      description: "Monitor performa afiliasi Anda dengan dashboard analytics yang komprehensif",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Award,
      title: "Bonus & Reward",
      description: "Raih bonus eksklusif dan reward menarik berdasarkan pencapaian target bulanan",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Target,
      title: "Marketing Tools",
      description: "Akses berbagai materi marketing dan tools promosi untuk memaksimalkan konversi",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    }
  ];

  const stats = [
    { value: "2,500+", label: "Afiliator Aktif", icon: Users },
    { value: "₹50M+", label: "Total Komisi Dibayar", icon: DollarSign },
    { value: "25%", label: "Rata-rata Komisi", icon: TrendingUp },
    { value: "4.9/5", label: "Rating Kepuasan", icon: Star }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-6">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Program Afiliasi</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Bergabung Sebagai{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Afiliator
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Jadilah bagian dari komunitas afiliator sukses dan raih penghasilan tambahan dengan mempromosikan kursus berkualitas tinggi
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-3 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="group">
              <div className="relative p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${benefit.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className={`h-7 w-7 ${benefit.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-slate-600/50 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Siap Memulai?</h3>
            </div>
            
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              Daftar sekarang dan mulai raih penghasilan dari program afiliasi terbaik di Indonesia
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/affiliate/register"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Daftar Afiliator
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/affiliate"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-600 text-gray-300 font-semibold hover:border-blue-500 hover:text-white transition-all duration-300 hover:bg-slate-800/50"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
