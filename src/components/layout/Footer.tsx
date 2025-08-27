import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookOpen, Users, Award, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import company from "@/data/company.json";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="font-black text-2xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    {company.name}
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed max-w-md text-lg">
                  Platform pembelajaran terpadu untuk mengembangkan skill dan meraih kesuksesan karir melalui kursus berkualitas tinggi.
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-blue-400">10K+</div>
                  <div className="text-sm text-gray-400">Siswa Aktif</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-purple-400">500+</div>
                  <div className="text-sm text-gray-400">Kursus</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-green-400">95%</div>
                  <div className="text-sm text-gray-400">Kepuasan</div>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Ikuti Kami</h4>
                <div className="flex space-x-3">
                  <a href="#" aria-label="Facebook" className="p-3 rounded-xl bg-slate-800/50 hover:bg-blue-600 text-gray-400 hover:text-white transition-all duration-300 group">
                    <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="#" aria-label="Twitter" className="p-3 rounded-xl bg-slate-800/50 hover:bg-sky-500 text-gray-400 hover:text-white transition-all duration-300 group">
                    <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="#" aria-label="Instagram" className="p-3 rounded-xl bg-slate-800/50 hover:bg-pink-600 text-gray-400 hover:text-white transition-all duration-300 group">
                    <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="#" aria-label="LinkedIn" className="p-3 rounded-xl bg-slate-800/50 hover:bg-blue-700 text-gray-400 hover:text-white transition-all duration-300 group">
                    <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
          </div>
          
            {/* Learning */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                Pembelajaran
              </h3>
              <ul className="space-y-3">
                <li><Link to="/courses" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Semua Kursus
                </Link></li>
                <li><Link to="/certificates" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Sertifikat
                </Link></li>
                <li><Link to="/live-classes" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Live Class
                </Link></li>
                <li><Link to="/quizzes" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                  Quiz & Latihan
                </Link></li>
              </ul>
              
              <div className="pt-4 border-t border-slate-700">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-400" />
                  Afiliasi
                </h4>
                <ul className="space-y-2">
                  <li><Link to="/affiliate" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                    Program Afiliasi
                  </Link></li>
                  <li><Link to="/affiliate/register" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                    Daftar Afiliasi
                  </Link></li>
                </ul>
              </div>
            </div>
          
            {/* Support & Contact */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-400" />
                Bantuan & Kontak
              </h3>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    <Mail className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div className="font-medium">support@videmy.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    <Phone className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Telepon</div>
                    <div className="font-medium">+62 21 1234 5678</div>
                  </div>
                </div>
              </div>
              
              {/* Quick Links */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Tautan Cepat</h4>
                <ul className="space-y-2">
                  <li><Link to="/faq" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-green-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                    FAQ
                  </Link></li>
                  <li><Link to="/support" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-green-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                    Pusat Bantuan
                  </Link></li>
                  <li><Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-green-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                    Tentang Kami
                  </Link></li>
                  <li><Link to="/contact" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-green-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                    Hubungi Kami
                  </Link></li>
                </ul>
              </div>
            </div>
        </div>
      </div>
      
        
        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-gray-400 text-center lg:text-left">
              <div className="font-medium">© {new Date().getFullYear()} {company.name}. Semua Hak Cipta Dilindungi.</div>
              <div className="text-sm mt-1">Membangun masa depan melalui pembelajaran berkualitas</div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline">
                Kebijakan Privasi
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline">
                Syarat & Ketentuan
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline">
                Kebijakan Cookie
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
