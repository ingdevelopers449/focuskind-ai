import React, { useState } from "react";
import { Sparkles, Trophy, Settings, Brain, ArrowDown, HelpCircle, GraduationCap, Database, Lock, ShieldCheck, Gamepad } from "lucide-react";
import { AgeGroup, DemoConfig } from "../types";

interface HeroProps {
  demoConfig: DemoConfig;
  setDemoConfig: (config: DemoConfig) => void;
  onScrollToSection: (sectionId: string) => void;
}

export default function Hero({ demoConfig, setDemoConfig, onScrollToSection }: HeroProps) {
  const [localName, setLocalName] = useState(demoConfig.childName === "amiguito" ? "" : demoConfig.childName);
  const [localAge, setLocalAge] = useState<AgeGroup>(demoConfig.ageGroup);
  const [localTheme, setLocalTheme] = useState(demoConfig.theme);

  const themes = [
    { id: "espacio", label: "Aventura Espacial 🚀" },
    { id: "dinosaurios", label: "Reino Dinosaurio 🦖" },
    { id: "videojuegos", label: "Mundo Bloques / Gaming 🎮" },
    { id: "magia", label: "Colegio de Hechicería 🪄" },
  ];

  const handleApplyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoConfig({
      childName: localName.trim() || "Súper Estudiante",
      ageGroup: localAge,
      theme: localTheme,
    });
    onScrollToSection("demo");
  };

  return (
    <section id="inicio" className="relative overflow-hidden bg-[#FBFBFE] text-[#1E293B] py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b-8 border-indigo-200">
      
      {/* Playful Floating Vector Doodles for decorative atmosphere */}
      <div className="absolute top-10 left-10 text-[#F59E0B] opacity-40 animate-bounce" style={{ animationDuration: "6s" }}>
        <Sparkles className="w-10 h-10" />
      </div>
      <div className="absolute bottom-12 left-1/4 text-[#3B82F6] opacity-30 animate-pulse">
        <GraduationCap className="w-12 h-12" />
      </div>
      <div className="absolute top-24 right-12 text-[#10B981] opacity-30 animate-spin" style={{ animationDuration: "14s" }}>
        <Trophy className="w-10 h-10" />
      </div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* TOP PANEL: Main Headline & Core Purpose */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-[#3B82F6] text-white font-extrabold text-[#11px] px-4.5 py-2 rounded-full shadow-md uppercase tracking-wider animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              Plataforma de Acompañamiento Académico & Enfoque TDAH
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] leading-tight">
              Acompañamiento <br className="hidden sm:inline" />
              <span className="text-[#3B82F6] font-black">
                Académico Inteligente
              </span>{" "}
              para Niños 📚
            </h1>

            <p className="text-xl text-[#475569] font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              <strong>FocusKid AI</strong> es un portal interactivo para estudiantes y tutores. Transforma materias complejas en aventuras temáticas diseñadas para mantener la concentración, con soporte especializado para TDAH.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button
                onClick={() => onScrollToSection("demo")}
                className="px-8 py-3.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black rounded-2xl text-base shadow-[0_5px_0_#1D4ED8] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Configurar Tutor e Ir al Demo
                <ArrowDown className="w-4.5 h-4.5" />
              </button>
              
              <button
                onClick={() => onScrollToSection("quiz")}
                className="px-6 py-3.5 bg-white border-4 border-slate-250 text-slate-700 hover:text-slate-900 font-extrabold rounded-2xl text-sm hover:bg-slate-50 transition-colors"
              >
                Evaluación de Hábitos ✍️
              </button>
            </div>
          </div>

          {/* Configuration Form Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[32px] border-8 border-indigo-100 shadow-[10px_10px_0_#EEF2F6] p-6 sm:p-8 relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#3B82F6] border-4 border-white text-white font-black text-[11px] px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
                NÚCLEO DE PERSONALIZACIÓN
              </div>

              <form onSubmit={handleApplyConfig} className="space-y-4 pt-3">
                <p className="text-center text-[#1E293B] text-sm font-extrabold leading-snug">
                  Configura el perfil de estudio en tiempo real para el tutor interactivo:
                </p>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-left">
                    Nombre del Estudiante:
                  </label>
                  <input
                    type="text"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="Ej. Mateo, Sofía, Lucas..."
                    className="w-full bg-slate-50 border-4 border-slate-200 focus:border-[#3B82F6] font-bold px-4 py-2.5 rounded-xl outline-none text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-left">
                    Rango de Edad / Nivel:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["5-7", "8-10", "11-13"] as AgeGroup[]).map((age) => (
                      <button
                        type="button"
                        key={age}
                        onClick={() => setLocalAge(age)}
                        className={`py-2 rounded-xl font-black text-xs border-3 transition-all ${
                          localAge === age
                            ? "bg-[#EFF6FF] text-[#1D4ED8] border-[#3B82F6] scale-102"
                            : "bg-slate-50 text-slate-500 border-slate-200 hover:border-blue-300"
                        }`}
                      >
                        {age === "5-7" ? "5-7" : age === "8-10" ? "8-10" : "11-13"} Años
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest text-left mb-1">
                    Tema de Acompañamiento:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    {themes.map((theme) => (
                      <button
                        type="button"
                        key={theme.id}
                        onClick={() => setLocalTheme(theme.id)}
                        className={`p-2 rounded-xl font-bold text-[11px] border-2 transition-all flex items-center justify-start ${
                          localTheme === theme.id
                            ? "bg-slate-100 text-indigo-700 border-[#3B82F6]"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                        }`}
                      >
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-black text-sm rounded-xl shadow-[0_4px_0_#059669] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  ¡Configurar y Actualizar Tutor! ✨
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* MIDDLE PANEL: Rich Informational Features Grid */}
        <div className="border-t border-slate-100 pt-16">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
              ¿Por qué elegir FocusKid AI?
            </h2>
            <p className="text-slate-500 text-sm font-semibold leading-relaxed">
              Diseño pedagógico y tecnológico robusto adaptado para el ritmo único de aprendizaje de cada niño, con almacenamiento en la nube privado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: ADHD Specialized */}
            <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-[6px_6px_0_#FEF3C7] p-6.5 text-left space-y-3.5">
              <div className="w-13 h-13 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 font-bold border-2 border-amber-300 shadow-sm">
                <Brain className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Metodología para TDAH</h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                El sistema utiliza técnicas de recompensa positiva, gamificación amigable (estrellas coleccionables) y explicaciones divididas en pequeños bloques para evitar la fatiga mental y maximizar la autoconfianza del menor.
              </p>
            </div>

            {/* Card 2: Cloud Sync with Secure Cloud */}
            <div className="bg-white rounded-3xl border-4 border-emerald-300 shadow-[6px_6px_0_#D1FAE5] p-6.5 text-left space-y-3.5">
              <div className="w-13 h-13 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 font-bold border-2 border-emerald-300 shadow-sm">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Sincronización Segura</h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                No pierdas el progreso. El sistema almacena automáticamente los perfiles familiares, la configuración del estudiante y las conversaciones anteriores con nuestro tutor inteligente para reanudar el aprendizaje en cualquier tableta o celular.
              </p>
            </div>

            {/* Card 3: Fully Customizable Themes */}
            <div className="bg-white rounded-3xl border-4 border-blue-300 shadow-[6px_6px_0_#DBEAFE] p-6.5 text-left space-y-3.5">
              <div className="w-13 h-13 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 font-bold border-2 border-blue-300 shadow-sm">
                <Gamepad className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Temáticas de Inmersión</h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                Adaptamos las explicaciones científicas, históricas y matemáticas. Ya sea que le entusiasme el espacio interestelar, los dinosaurios gigantes, la magia o las construcciones de bloques, la IA moldeará sus analogías para inspirarlo.
              </p>
            </div>

          </div>
        </div>

        {/* BOTTOM PANEL: Technical information and Security standards */}
        <div className="bg-indigo-50 border-4 border-indigo-200 rounded-[36px] p-6 sm:p-10 text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-inner">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-800 border border-indigo-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Estándares de Seguridad para la Familia
            </div>
            <h3 className="text-2xl font-black text-[#1E1B4B]">Control Absoluto del Tutor</h3>
            <p className="text-indigo-950 font-medium text-xs leading-relaxed max-w-2xl">
              Nuestra plataforma funciona con la API de Gemini mediante servidores full-stack seguros, garantizando que ninguna clave secreta se exponga al navegador. Los datos de contacto del colegio del menor y el teléfono del acudiente permanecen cifrados de forma segura, y puedes restablecer la información almacenada en cualquier momento cerrando tu sesión.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-center">
            <div className="p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-md flex items-center gap-3">
              <Lock className="w-10 h-10 text-indigo-500 shrink-0" />
              <div>
                <span className="block font-black text-slate-800 text-xs uppercase tracking-wider">Privacidad</span>
                <span className="text-slate-500 text-[10px] font-semibold">Sincronización Segura en Servidor</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
