import React, { useState } from "react";
import { Sparkles, Menu, X, Rocket, Smile, LogOut, UserCheck } from "lucide-react";
import { getSuperAdminEmail } from "../lib/supabase";

interface HeaderProps {
  onOpenAuth: (mode: "login" | "register") => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isLoggedIn: boolean;
  userEmail: string;
  onLogout: () => void;
}

export default function Header({ onOpenAuth, activeSection, onNavigate, isLoggedIn, userEmail, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Inicio", id: "inicio" },
    { label: "Características", id: "caracteristicas" },
    { label: "Tutor Foli (Demo)", id: "demo" },
    { label: "Test de Estudio", id: "test" },
    { label: "Precios", id: "precios" },
  ];

  if (isLoggedIn) {
    // Add Parents Dashboard view to header navigation
    if (!navItems.some(i => i.id === "dashboard")) {
      navItems.push({ label: "Progreso Padres 📊", id: "dashboard" });
    }
  }

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b-4 border-[#FBBF24] shadow-sm transition-all animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left Side: Logo, Name AND authentication statuses */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={() => handleNavClick("inicio")} 
            className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B] to-[#FCD34D] rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full"></div>
              </div>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#1E293B]">
              FocusKid <span className="text-[#F59E0B] font-black">AI</span>
            </span>
          </button>

          {/* User auth state buttons (Login/Register or Connected Tutor Profile) */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => onOpenAuth("login")}
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-[0_4px_0_#1D4ED8] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center gap-1"
                >
                  <Smile className="w-3.5 h-3.5" />
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => onOpenAuth("register")}
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-[0_4px_0_#B45309] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center gap-1"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  ¡Registrarse!
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-[#D1FAE5] border-2 border-[#10B981] text-[#065F46] px-4 py-2 rounded-full font-extrabold text-xs flex items-center gap-1.5 shadow-sm">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[140px]" title={userEmail}>
                    {userEmail.toLowerCase() === getSuperAdminEmail() ? "SuperAdmin" : `Tutor: ${userEmail.split("@")[0]}`}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Navigation panel */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-sm font-bold px-3 py-2 rounded-xl transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-[#FEF3C7] text-[#B45309] ring-2 ring-[#FBBF24] scale-105"
                  : "text-[#64748B] hover:text-[#3B82F6] hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <div className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-lg text-[10px] font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
            Padres Felices
          </div>
        </nav>

        {/* Mobile menu controller */}
        <div className="flex items-center gap-2 lg:hidden">
          {!isLoggedIn ? (
            <button
              onClick={() => onOpenAuth("login")}
              className="px-3 py-1 text-xs font-bold text-white bg-[#3B82F6] rounded-full shadow-[0_2px_0_#1D4ED8]"
            >
              Entrar
            </button>
          ) : (
            <button
              onClick={onLogout}
              className="p-1 px-2.5 text-xs text-red-600 bg-red-50 rounded-full font-bold border border-red-200"
            >
              Salir
            </button>
          )}
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-amber-100 text-[#B45309] hover:bg-amber-200 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-purple-100 px-4 py-6 space-y-4 shadow-inner">
          {!isLoggedIn ? (
            <div className="flex flex-col gap-2 p-3 bg-purple-50 rounded-2xl border border-purple-100">
              <span className="text-xs font-bold text-purple-500 text-center uppercase tracking-widest">Portal Familiar</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenAuth("login");
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-4 text-center text-sm font-bold text-indigo-700 bg-white border-2 border-indigo-200 rounded-xl hover:bg-indigo-50 transition-all"
                >
                  Ingresar
                </button>
                <button
                  onClick={() => {
                    onOpenAuth("register");
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-4 text-center text-sm font-black text-white bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl hover:shadow-lg transition-all"
                >
                  ¡Registrarse!
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center text-xs font-bold text-emerald-800">
              {userEmail.toLowerCase() === getSuperAdminEmail() ? "SuperAdmin Conectado" : "Tutor Conectado"}: {userEmail}
            </div>
          )}

          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  activeSection === item.id
                    ? "bg-yellow-105 text-yellow-800 border-l-4 border-yellow-400"
                    : "text-gray-600 hover:bg-[#FFFBEB] hover:text-[#B45309]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
