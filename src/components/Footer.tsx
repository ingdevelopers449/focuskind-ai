import React from "react";
import { Sparkles, Mail, Heart, Github, Globe } from "lucide-react";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✉️ ¡Te has suscrito con éxito al Boletín de Pedagogía y Crianza de FocusKid AI! 🎉 Recibirás tips semanales para mejorar la concentración.");
  };

  return (
    <footer className="bg-[#1E293B] text-slate-300 py-16 px-4 sm:px-6 lg:px-8 border-t-8 border-[#FDE68A] relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        {/* Company Pitch and Logo */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center border-2 border-white">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              FocusKid <span className="text-[#FBBF24]">AI</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-400 leading-relaxed max-w-sm">
            FocusKid AI es un micro-SaaS educativo impulsado por Inteligencia Artificial Generativa, enfocado en redefinir el estudio infantil de manera interactiva, personalizada y muy divertida.
          </p>

          <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-[#10B981] fill-current animate-pulse" /> para familias extraordinarias.
          </p>
        </div>

        {/* Links Column 1: Navigation Mirrors */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#FFFBEB] mb-1">Mapa del Sitio</h4>
          <ul className="space-y-2 text-xs sm:text-sm font-bold">
            <li>
              <button onClick={() => onNavigate("inicio")} className="hover:text-[#FBBF24] transition-colors cursor-pointer">
                Inicio 🏠
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("caracteristicas")} className="hover:text-[#FBBF24] transition-colors cursor-pointer">
                Características 🎒
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("demo")} className="hover:text-[#FBBF24] transition-colors cursor-pointer">
                Tutor AI Foli 🦊
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("test")} className="hover:text-[#FBBF24] transition-colors cursor-pointer">
                Súper Test 📐
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("precios")} className="hover:text-[#FBBF24] transition-colors cursor-pointer">
                Planes y Precios 💳
              </button>
            </li>
          </ul>
        </div>

        {/* Links Column 2: Safety & Compliance */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#FFFBEB] mb-1">Seguridad Kids</h4>
          <ul className="space-y-2 text-xs text-slate-400 font-bold">
            <li>
              <span className="text-[11px] block text-[#10B981] font-black mb-1">✔️ Certificación COPPA</span>
            </li>
            <li className="hover:text-[#FBBF24] transition-colors cursor-pointer">Política de Privacidad</li>
            <li className="hover:text-[#FBBF24] transition-colors cursor-pointer">Condiciones Escolares</li>
            <li className="hover:text-[#FBBF24] transition-colors cursor-pointer">Portal de Control Parental</li>
            <li className="hover:text-[#FBBF24] transition-colors cursor-pointer">Guía de Concentración</li>
          </ul>
        </div>

        {/* Links Column 3: Newsletter box with parents support focus */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#FFFBEB]">Boletín Pedagógico</h4>
          <p className="text-xs font-semibold text-slate-400 leading-relaxed">
            Recibe artículos para el desarrollo de hábitos infantiles y actualizaciones mensuales del software.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5 max-w-sm">
            <input
              type="email"
              required
              placeholder="e-mail de mamá o papá"
              className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:border-[#3B82F6] outline-none w-full"
            />
            <button
              type="submit"
              className="p-2.5 bg-[#3B82F6] hover:bg-[#2563EB] rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center text-white cursor-pointer"
            >
              <Mail className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Underbar Copyright info */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 font-bold flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} FocusKid AI. Todos los derechos reservados.</span>
        <div className="flex gap-4">
          <span className="hover:text-slate-400 transition-colors">Soporte Parental</span>
          <span>•</span>
          <span className="hover:text-slate-400 transition-colors">Micro-SaaS Educativo</span>
        </div>
      </div>
    </footer>
  );
}
