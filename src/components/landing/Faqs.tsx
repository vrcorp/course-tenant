import { brandify } from "@/lib/brand";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function Faqs({ faqs }: { faqs: any }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));
  console.log("faqs", faqs);
  
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 via-transparent to-purple-50/30 dark:from-indigo-900/10 dark:via-transparent dark:to-purple-900/10" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-6">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
            Pertanyaan
            <span className="block pb-3">yang Sering Diajukan</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Temukan jawaban untuk pertanyaan umum seputar platform pembelajaran dan fitur-fitur yang tersedia
          </p>
        </div>
      
        <div className="space-y-6">
          {faqs.map((q, index) => {
            const isOpen = openId === q.id;
            return (
              <div 
                key={q.id} 
                className="group relative rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/5 via-transparent to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <button
                  onClick={() => toggle(q.id)}
                  className="relative w-full text-left px-8 py-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300 group/btn"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${q.id}`}
                >
                  <span className="font-bold text-lg text-gray-900 dark:text-white group-hover/btn:text-indigo-700 dark:group-hover/btn:text-indigo-300 transition-colors duration-300 pr-4">
                    {brandify(q.question)}
                  </span>
                  <div className={`flex-shrink-0 p-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 transition-all duration-300 ${isOpen ? 'rotate-180' : ''} group-hover/btn:from-indigo-200 group-hover/btn:to-purple-200 dark:group-hover/btn:from-indigo-800/70 dark:group-hover/btn:to-purple-800/70`}>
                    <ChevronDown className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div 
                    id={`faq-${q.id}`} 
                    className="px-8 pb-6 pt-2 text-gray-700 dark:text-gray-300 leading-relaxed text-lg border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-indigo-900/10 dark:to-purple-900/10"
                  >
                    {brandify(q.answer)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
