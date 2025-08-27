import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, BarChart2, BookOpen, Check, Clock, DollarSign, Link as LinkIcon, Mail, Rocket, Shield, Star, Target, TrendingUp, Users, UserPlus, Zap, ArrowRight, Play, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import company from "@/data/company.json";

export default function Affiliate() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic untuk menangani pendaftaran melalui email
    console.log("Email submitted:", email);
    // Redirect atau tampilkan konfirmasi
    navigate("/register", { state: { email } });
  };

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-8">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">Program Afiliasi {company.name}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              Raih Kesuksesan{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Bersama Kami
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Bergabunglah dengan ribuan afiliator sukses dan raih penghasilan hingga{" "}
              <span className="text-green-400 font-bold">30% komisi</span> dari setiap kursus yang terjual
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <Button 
                size="lg" 
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                onClick={() => navigate("/affiliate/register")}
              >
                <Zap className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" /> 
                Mulai Sekarang
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Link 
                to="/affiliatr" 
                className="group flex items-center gap-2 px-6 py-3 border border-slate-600 text-gray-300 font-medium rounded-xl hover:border-blue-500 hover:text-white transition-all duration-300 hover:bg-slate-800/50"
              >
                <Play className="h-4 w-4" />
                Lihat Demo
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-black text-blue-400 mb-2 group-hover:scale-110 transition-transform">2.5K+</div>
                <div className="text-gray-400">Afiliator Aktif</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-black text-green-400 mb-2 group-hover:scale-110 transition-transform">₹50M+</div>
                <div className="text-gray-400">Total Komisi</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-black text-purple-400 mb-2 group-hover:scale-110 transition-transform">30%</div>
                <div className="text-gray-400">Komisi Maksimal</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-black text-yellow-400 mb-2 group-hover:scale-110 transition-transform">4.9★</div>
                <div className="text-gray-400">Rating Afiliator</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-700 mb-6">
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">Keunggulan Program</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Mengapa Memilih{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Program Afiliasi Kami?
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Kami memberikan lebih dari sekadar komisi - partnership yang menguntungkan dengan dukungan penuh untuk kesuksesan Anda
            </p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="group">
              <div className="relative p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Komisi Hingga 30%</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Dapatkan komisi menarik dari setiap kursus yang berhasil Anda jual melalui link afiliasi
                  </p>
                </div>
              </div>
            </div>
          
            <div className="group">
              <div className="relative p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BarChart2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Dashboard Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Pantau performa, konversi, dan pendapatan secara real-time dengan dashboard yang mudah dipahami
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="relative p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Bonus & Reward</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Raih bonus eksklusif dan reward menarik berdasarkan pencapaian target bulanan Anda
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="relative p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Support 24/7</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Tim support khusus afiliator siap membantu Anda mencapai target dengan dukungan penuh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-blue-900/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <Rocket className="h-4 w-4" />
              Proses Bergabung
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Mulai dalam <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">3 Langkah</span> Sederhana
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              Bergabung dengan program afiliator kami sangat mudah. Ikuti langkah-langkah berikut dan mulai meraih penghasilan tambahan
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines */}
            <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 dark:from-blue-800 dark:via-purple-800 dark:to-blue-800 hidden md:block transform -translate-y-1/2" />
            
            {[
              { 
                title: "Daftar Akun", 
                desc: "Isi formulir pendaftaran dengan data diri yang valid dan pilih menjadi afiliator", 
                icon: <UserPlus className="h-8 w-8" />,
                time: "2 menit",
                gradient: "from-blue-500 to-cyan-500"
              },
              { 
                title: "Verifikasi & Setup", 
                desc: "Verifikasi email dan akses dashboard afiliator dengan tools lengkap untuk promosi", 
                icon: <Check className="h-8 w-8" />,
                time: "1 jam",
                gradient: "from-purple-500 to-pink-500"
              },
              { 
                title: "Mulai Promosi", 
                desc: "Gunakan link unik, materi promosi, dan mulai bagikan ke audience untuk meraih komisi", 
                icon: <Target className="h-8 w-8" />,
                time: "Sekarang",
                gradient: "from-emerald-500 to-teal-500"
              },
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="relative p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Step number */}
                  <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {step.icon}
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-blue-600 dark:text-blue-400 mb-3 font-medium">
                      <Clock className="h-3 w-3" /> {step.time}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources & Support */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Dukungan Lengkap
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Semua <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Tools & Support</span> yang Anda Butuhkan
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              Lebih dari sekedar link afiliasi. Kami menyediakan ekosistem lengkap untuk kesuksesan Anda sebagai mitra
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: <Mail className="h-8 w-8" />,
                title: "Materi Promosi Premium",
                desc: "Template email profesional, banner berkualitas tinggi, dan konten siap pakai untuk semua platform",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <BarChart2 className="h-8 w-8" />,
                title: "Analytics & Insights",
                desc: "Dashboard mendalam dengan analitik real-time, tracking konversi, dan insight untuk optimasi",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Komunitas Eksklusif",
                desc: "Akses ke grup khusus afiliator untuk berbagi strategi, tips, dan networking dengan top performers",
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Proteksi Komisi",
                desc: "Kebijakan perlindungan yang menjamin komisi Anda aman dengan sistem tracking yang transparan",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((resource, i) => (
              <div key={i} className="group">
                <div className="relative p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10 flex items-start gap-6">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${resource.gradient} text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {resource.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">{resource.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {resource.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-purple-900/20" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Testimoni Afiliator
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Cerita <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Sukses</span> Partner Kami
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              Bergabunglah dengan ribuan afiliator yang telah merasakan keuntungan dan kemudahan program kami
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rina Susanti",
                role: "Content Creator",
                text: "Program afiliator {company.name} sangat mudah digunakan. Dashboard yang intuitif dan pembayaran komisi yang selalu tepat waktu membuat saya fokus pada promosi.",
                rating: 5,
                avatar: "RS"
              },
              {
                name: "Ahmad Fauzi",
                role: "Digital Marketer",
                text: "Dukungan materi promosi yang lengkap sangat membantu campaign saya. Tim support juga sangat responsif dan profesional dalam membantu.",
                rating: 5,
                avatar: "AF"
              },
              {
                name: "Dewi Anggraini",
                role: "Blogger Edukasi",
                text: "Sebagai blogger, saya sangat menghargai program afiliator yang benar-benar peduli pada kesuksesan partner mereka seperti {company.name}.",
                rating: 5,
                avatar: "DA"
              }
            ].map((testimonial, index) => (
              <div key={index} className="group">
                <div className="relative p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-2">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    {/* Rating */}
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <blockquote className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                      "{testimonial.text}"
                    </blockquote>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-sm">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background with gradient and decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8">
              <Rocket className="h-4 w-4" />
              Bergabung Sekarang
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Siap Menjadi <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Partner Sukses</span> Kami?
            </h2>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Bergabunglah dengan ribuan afiliator sukses dan mulai raih penghasilan tambahan dari program terbaik di Indonesia
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { number: "10,000+", label: "Afiliator Aktif" },
                { number: "30%", label: "Komisi Maksimal" },
                { number: "24/7", label: "Support Tim" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">{stat.number}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Registration Form */}
            <div className="max-w-md mx-auto mb-8">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/95 backdrop-blur-sm text-gray-900 border-0 flex-grow h-12 text-lg placeholder:text-gray-500"
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold h-12 px-8 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Daftar Gratis
                </Button>
              </form>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Gratis & Tanpa Biaya Tersembunyi</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span>Data Aman & Terlindungi</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" />
                <span>Aktivasi Instan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 bg-primary/5">Pertanyaan Umum</Badge>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Pertanyaan yang Sering Diajukan</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              question: "Apakah ada biaya untuk bergabung?",
              answer: "Tidak sama sekali. Program afiliasi kami sepenuhnya gratis untuk diikuti."
            },
            {
              question: "Berapa lama proses persetujuan pendaftaran?",
              answer: "Biasanya memakan waktu 1-2 hari kerja setelah Anda melengkapi data pendaftaran."
            },
            {
              question: "Bagaimana cara saya mendapatkan pembayaran?",
              answer: "Kami melakukan pembayaran komisi melalui transfer bank, e-wallet, atau metode lainnya yang tersedia di daerah Anda."
            },
            {
              question: "Apakah ada batas minimum untuk penarikan?",
              answer: "Ya, terdapat batas minimum penarikan yang berbeda tergantung metode pembayaran yang Anda pilih."
            }
          ].map((faq, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link to="/affiliate/faq" className="text-primary hover:underline font-medium">
            Lihat semua pertanyaan →
          </Link>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Sudah punya akun affiliator?</p>
        <div className="mt-2">
          <Link to="/affiliatr" className="text-primary hover:underline font-medium">Masuk ke Dashboard Afiliasi →</Link>
        </div>
      </div>
    </div>
  );
}