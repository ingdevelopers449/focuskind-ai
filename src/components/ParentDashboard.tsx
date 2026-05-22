import React, { useState, useEffect } from "react";
import { 
  BarChart2, 
  User, 
  Calendar, 
  Star, 
  Flame, 
  Clock, 
  BookOpen, 
  ShieldAlert, 
  Sparkles, 
  CreditCard, 
  ChevronRight, 
  ToggleLeft, 
  ToggleRight, 
  CheckCircle,
  Lightbulb,
  FileCheck,
  TrendingUp,
  Award
} from "lucide-react";
import { DemoConfig } from "../types";
import { supabaseService, getSuperAdminEmail } from "../lib/supabase";

interface ParentDashboardProps {
  demoConfig: DemoConfig;
  setDemoConfig: React.Dispatch<React.SetStateAction<DemoConfig>>;
  activePlan: "free" | "premium";
  onUpgradeClick: () => void;
  questionsAskedCount: number;
  userEmail?: string;
  isLoggedIn?: boolean;
}

export default function ParentDashboard({ 
  demoConfig, 
  setDemoConfig, 
  activePlan, 
  onUpgradeClick,
  questionsAskedCount,
  userEmail,
  isLoggedIn = false
}: ParentDashboardProps) {
  const [tdahActive, setTdahActive] = useState(demoConfig.hasTdah || false);
  const [activeTab, setActiveTab] = useState<"overview" | "reports" | "billing">("overview");

  const [realStars, setRealStars] = useState(0);
  const [realStreak, setRealStreak] = useState(1);
  const [recentQuestions, setRecentQuestions] = useState<any[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Pagination states for parents chat monitoring
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const fakeQuestions = [
    { id: "fake-1", text: "Pregunta activa hecha al Zorrito Foli", date: new Date(), subject: "math" },
    { id: "fake-2", text: "¿Por qué brilla el sol? ☀️", date: new Date(), subject: "science" },
    { id: "fake-3", text: "¿Quién construyó las pirámides? 🔺", date: new Date(), subject: "history" },
    { id: "fake-4", text: "¿Cómo se mezclan los colores primarios? 🎨", date: new Date(), subject: "art" },
    { id: "fake-5", text: "¿Cómo se dice 'perro feliz' en inglés? 🐶", date: new Date(), subject: "languages" },
    { id: "fake-6", text: "¿Qué es la fotosíntesis? 🌿", date: new Date(), subject: "science" },
    { id: "fake-7", text: "¿Quién fue Leonardo da Vinci? 👨‍🎨", date: new Date(), subject: "art" },
    { id: "fake-8", text: "¿Por qué el cero es importante? 0️⃣", date: new Date(), subject: "math" }
  ];

  // Sync toggle when config changes
  useEffect(() => {
    setTdahActive(demoConfig.hasTdah || false);
  }, [demoConfig.hasTdah]);

  // Load real-time parent metrics from Supabase
  useEffect(() => {
    if (!isLoggedIn || !userEmail) {
      // Fallback defaults for guest/demo view
      setRealStars(25 + (questionsAskedCount * 5));
      setRealStreak(1);
      setTotalQuestions(questionsAskedCount);
      setRecentQuestions([]);
      return;
    }

    const fetchParentData = async () => {
      try {
        const profile = await supabaseService.getTutor(userEmail);
        if (profile) {
          if (typeof profile.stars_earned === "number") {
            setRealStars(profile.stars_earned);
          }
          if (profile.created_at) {
            const createdDate = new Date(profile.created_at);
            const today = new Date();
            createdDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            const diffTime = today.getTime() - createdDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
            setRealStreak(Math.max(1, diffDays));
          }

          // Sync database profile back to parent's demoConfig state
          setDemoConfig({
            childName: profile.child_name || "amiguito",
            ageGroup: (profile.child_age || "8-10") as any,
            theme: profile.child_theme || "espacio",
            hasTdah: !!profile.has_tdah,
            schoolName: profile.school_name || "",
            contactPhone: profile.contact_phone || "",
            childGrade: profile.child_grade || "3ro de Primaria",
            difficultSubject: profile.difficult_subject || "Matemáticas 📐",
          });
        }

        const history = await supabaseService.getChatHistory(userEmail);
        if (history) {
          const userQuestions = history
            .filter((item: any) => item.role === "user")
            .map((item: any) => ({
              id: item.id,
              text: item.content,
              date: item.created_at ? new Date(item.created_at) : new Date(),
              subject: item.subject || "general"
            }))
            .reverse(); // Most recent first
          
          setRecentQuestions(userQuestions);
          setTotalQuestions(userQuestions.length);
        }
      } catch (err) {
        console.error("Failed to load parent dashboard data from Supabase:", err);
      }
    };

    fetchParentData();
  }, [isLoggedIn, userEmail, questionsAskedCount]);

  const toggleTdah = async () => {
    const newVal = !tdahActive;
    setTdahActive(newVal);
    setDemoConfig(prev => ({
      ...prev,
      hasTdah: newVal
    }));

    if (isLoggedIn && userEmail && userEmail.toLowerCase() !== getSuperAdminEmail().toLowerCase()) {
      try {
        const currentProfile = await supabaseService.getTutor(userEmail);
        if (currentProfile) {
          await supabaseService.saveTutor({
            ...currentProfile,
            has_tdah: newVal
          });
        }
      } catch (err) {
        console.error("Error saving TDAH clinic status to Supabase:", err);
      }
    }
  };

  // Dynamic parameters calculated based on child details
  const starsEarned = realStars;
  const totalStudyMinutes = isLoggedIn ? Math.round(15 + (totalQuestions * 3)) : Math.round(15 + (questionsAskedCount * 2.5));
  const focusPercentage = demoConfig.hasTdah ? "82% (Enfoque TDAH)" : "94% (Foco Estable)";
  const levelText = starsEarned > 50 ? "Nivel 3 - Explorador Brillante" : starsEarned > 35 ? "Nivel 2 - Aprendiz Entusiasta" : "Nivel 1 - Iniciado";

  // Dynamic pedagogical recommendations built based on child params
  const schoolGradeStr = demoConfig.childGrade || "3ro de Primaria";
  const hardSubjectStr = demoConfig.difficultSubject || "Matemáticas 📐";
  const name = demoConfig.childName || "tu hijo";

  // Pagination parameters for chat history
  const activeQuestionsList = isLoggedIn ? recentQuestions : fakeQuestions;
  const totalQuestionsCount = isLoggedIn ? totalQuestions : fakeQuestions.length;
  
  const totalPages = Math.ceil(totalQuestionsCount / ITEMS_PER_PAGE);
  const paginatedQuestions = activeQuestionsList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <section id="dashboard" className="py-20 bg-slate-50 border-b-8 border-[#FDE68A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="text-left space-y-2">
            <span className="bg-[#DBEAFE] border-2 border-[#3B82F6] text-[#1D4ED8] font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
              📊 PANEL VIP DE CONTROL PARA PADRES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E293B]">
              Progreso Escolar de <span className="text-[#3B82F6]">{name}</span>
            </h2>
            <p className="text-slate-500 text-sm font-semibold">
              Supervisa el tiempo de enfoque, racha diaria de estudio, temas y ajustes cognitivos en tiempo real.
            </p>
          </div>

          {/* Quick tab switchers */}
          <div className="flex gap-2 bg-slate-200/60 p-1.5 rounded-2xl border-2 border-slate-200 max-w-md shrink-0 self-start md:self-center font-bold text-xs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "overview" ? "bg-white text-[#1E293B] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Métricas Generales
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "reports" ? "bg-white text-[#1E293B] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Recomendaciones IA 🦊
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "billing" ? "bg-white text-[#1E293B] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Suscripción y COP
            </button>
          </div>
        </div>

        {/* TAB 1: METRICAS GENERALES */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Card 1: Active child profile summary */}
              <div className="md:col-span-2 bg-white rounded-3xl p-6 border-4 border-slate-200 shadow-[4px_4px_0_#94A3B8] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 border-b pb-4 mb-4 border-slate-150">
                    <div className="w-12 h-12 rounded-2xl bg-[#DBEAFE] border-2 border-[#3B82F6] flex items-center justify-center text-2xl">
                      👦
                    </div>
                    <div>
                      <h4 className="font-black text-[#1E293B] text-base leading-snug">{name}</h4>
                      <p className="text-slate-400 text-xs font-bold">{schoolGradeStr} • {demoConfig.ageGroup} Años</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs font-semibold text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Escuela / Colegio:</span>
                      <span className="text-[#1E293B] font-extrabold truncate max-w-[180px]" title={demoConfig.schoolName || "No indicada"}>
                        {demoConfig.schoolName || "No indicada"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Asignatura con Mayor Reto:</span>
                      <span className="text-red-500 font-extrabold">{hardSubjectStr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tema Favorito de Estudio:</span>
                      <span className="text-[#3B82F6] uppercase font-black">{demoConfig.theme}</span>
                    </div>
                  </div>
                </div>

                {/* Customizable toggle mode for TDAH (ADHD) */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-left max-w-[70%]">
                    <span className="text-[10px] text-red-600 font-black uppercase tracking-wider block">Apoyo Clínico TDAH / TDH</span>
                    <p className="text-[11px] text-slate-500 font-semibold leading-tight mt-0.5">Adaptar la IA para baja densidad de lectura y pausas.</p>
                  </div>
                  <button
                    onClick={toggleTdah}
                    className="text-[#3B82F6] focus:outline-none cursor-pointer transition-transform duration-250 hover:scale-105"
                  >
                    {tdahActive ? (
                      <ToggleRight className="w-14 h-10 text-red-500 fill-current" />
                    ) : (
                      <ToggleLeft className="w-14 h-10 text-slate-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Card 2: Stars count */}
              <div className="bg-white rounded-3xl p-6 border-4 border-[#F59E0B] shadow-[8px_8px_0_#FEF3C7] flex flex-col justify-between text-left">
                <div className="space-y-3">
                  <span className="bg-[#FEF3C7] border-2 border-[#FBBF24] text-[#B45309] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                    PROGRESO LÚDICO
                  </span>
                  <div className="text-slate-400 text-xs font-bold leading-normal">Estrellas Recolectadas</div>
                  <div className="flex items-baseline gap-1.5 pt-1.5">
                    <Star className="w-7 h-7 text-yellow-500 fill-yellow-500" />
                    <span className="text-4xl font-black text-[#1E293B]">{starsEarned}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">{levelText}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] font-black uppercase text-amber-600 flex justify-between items-center">
                  <span>Meta de Recompensa</span>
                  <span>100 ★</span>
                </div>
              </div>

              {/* Card 3: Study Time */}
              <div className="bg-white rounded-3xl p-6 border-4 border-[#10B981] shadow-[8px_8px_0_#D1FAE5] flex flex-col justify-between text-left">
                <div className="space-y-3">
                  <span className="bg-[#D1FAE5] border-2 border-[#10B981] text-[#065F46] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                    FOCO ACTIVO
                  </span>
                  <div className="text-slate-400 text-xs font-bold leading-normal">Tiempo Estimado de Concentración</div>
                  <div className="flex items-baseline gap-1.5 pt-1.5">
                    <Clock className="w-7 h-7 text-emerald-500" />
                    <span className="text-4xl font-black text-[#1E293B]">{totalStudyMinutes}</span>
                    <span className="text-slate-400 font-black text-xs">Min</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">Uso del temporizador integrado</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] font-black uppercase text-[#10B981] flex justify-between items-center">
                  <span>Módulo de Enfoque</span>
                  <span>{focusPercentage}</span>
                </div>
              </div>

            </div>

            {/* Simulated Historic Activity list */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-slate-200">
              <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-100 flex-wrap gap-4">
                <div className="text-left space-y-0.5">
                  <h3 className="font-black text-lg text-[#1E293B]">Historial Reciente de Preguntas IA 📚</h3>
                  <p className="text-slate-400 text-xs font-bold">Métricas y temas interactuados por el niño con Foli</p>
                </div>

                <div className="bg-[#FFFBEB] px-4 py-2 border-2 border-[#F59E0B] rounded-full text-xs font-black text-[#B45309]">
                  Total Consultas: {isLoggedIn ? totalQuestions : questionsAskedCount}
                </div>
              </div>

              {(isLoggedIn ? totalQuestions : fakeQuestions.length) === 0 ? (
                <div className="text-center py-8 text-slate-400 font-bold space-y-2">
                  <div className="text-4xl">🌵</div>
                  <p className="text-slate-500 text-sm">Aún no se registran preguntas de Foli hoy.</p>
                  <p className="text-xs text-slate-400 font-normal">Haz preguntas en el panel "Tutor Foli" arriba para ver las métricas en tiempo real aquí.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Grid showing the paginated real or fake questions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paginatedQuestions.map((q, idx) => (
                      <div key={q.id || idx} className="bg-slate-50 p-4 border-2 border-slate-200 rounded-2xl flex items-center justify-between text-xs transition-all hover:border-slate-350 hover:bg-slate-100/50">
                        <div className="text-left">
                          <span className="text-[10px] text-[#3B82F6] font-black uppercase block font-sans">
                            CONSULTA ({q.subject === "science" ? "CIENCIAS" : q.subject === "math" ? "MATEMÁTICAS" : q.subject === "history" ? "HISTORIA" : q.subject === "art" ? "MODO CREATIVO" : q.subject === "languages" ? "IDIOMAS" : "GENERAL"})
                          </span>
                          <p className="font-black text-[#1E293B] mt-0.5 truncate max-w-[280px] text-sm" title={q.text}>
                            "{q.text}"
                          </p>
                          <span className="text-[10px] text-slate-400 font-bold font-sans">
                            {new Date(q.date).toLocaleDateString([], { day: 'numeric', month: 'short' })} • {new Date(q.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 font-sans">
                          Comprensión Alta ✅
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Ludic Reward summary bar at the bottom */}
                  <div className="bg-amber-50/50 p-4 border-2 border-amber-200 rounded-2xl flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="text-left">
                      <span className="text-[10px] text-amber-700 font-black uppercase block font-sans">RETAL LÚDICO ACTIVADO</span>
                      <p className="font-bold text-[#1E293B] text-xs">El menor recibe recompensas automáticas por sus rachas de preguntas académicas en Foli.</p>
                    </div>
                    <span className="bg-[#FEF3C7] text-[#B45309] border-2 border-[#FBBF24] px-4 py-1.5 rounded-full text-xs font-black uppercase shrink-0 font-sans">
                      +{isLoggedIn && realStars > 0 ? realStars : 10} Estrellas Totales ⭐
                    </span>
                  </div>

                  {/* Beautiful Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-4 font-bold text-xs select-none font-sans">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2.5 border-2 border-slate-200 rounded-xl transition-all shadow-[2px_2px_0_#E2E8F0] active:translate-y-0.5 active:shadow-none cursor-pointer ${
                          currentPage === 1 ? "opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 shadow-none active:translate-y-0" : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        ◀ Anterior
                      </button>
                      
                      <span className="bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl text-slate-600 font-black text-center min-w-[120px]">
                        Página {currentPage} de {totalPages}
                      </span>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2.5 border-2 border-slate-200 rounded-xl transition-all shadow-[2px_2px_0_#E2E8F0] active:translate-y-0.5 active:shadow-none cursor-pointer ${
                          currentPage === totalPages ? "opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 shadow-none active:translate-y-0" : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        Siguiente ▶
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: RECOMENDACIONES DE LA IA */}
        {activeTab === "reports" && (
          <div className="bg-white rounded-[40px] border-8 border-[#3B82F6] p-6 sm:p-10 shadow-[12px_12px_0_#DBEAFE] text-left space-y-8">
            <div className="flex items-center gap-3.5 border-b pb-5 mb-5 border-slate-150 flex-wrap gap-4 justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#DBEAFE] p-3 rounded-2xl border-2 border-[#3B82F6] text-[#3B82F6] shrink-0">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#1E293B]">Estrategia Pedagógica Generada por Llama AI 🤫</h3>
                  <p className="text-slate-400 text-xs font-bold">Reporte de Inteligencia Artificial enfocado en {schoolGradeStr}</p>
                </div>
              </div>

              <span className="bg-[#D1FAE5] border-2 border-[#10B981] text-[#065F46] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                Recomendado por Psicopedagogos
              </span>
            </div>

            {/* dynamic custom AI checklist recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h4 className="font-black text-base text-[#1E293B] flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-500" /> Plan de Ajuste de Hábitos para {name}
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Nuestra IA analiza las materias que le generan miedo o pereza como **{hardSubjectStr}** para crear una racha motivante de 15 minutos:
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 border-l-4 border-[#3B82F6] rounded-r-2xl space-y-1 text-xs font-semibold">
                    <span className="font-extrabold text-[#3B82F6] text-xs uppercase block">01. Enfoque Basado en su Interés ({demoConfig.theme.toUpperCase()})</span>
                    <p className="text-slate-500 leading-normal">
                      Cada vez que {name} estudie {hardSubjectStr}, haz analogías visuales con de piratas o naves espaciales. Esto libera dopamina reduciendo la resistencia a la tarea.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 border-l-4 border-[#F59E0B] rounded-r-2xl space-y-1 text-xs font-semibold">
                    <span className="font-extrabold text-[#F59E0B] text-xs uppercase block">02. El Truco del Queso Suizo 🧀</span>
                    <p className="text-slate-500 leading-normal">
                      No lo obligues a sentarse a estudiar de corrido. Haz pausas cada 12 preguntas correctas. Permite estirarse, tomar agua o chocar los cinco con Foli.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 border-l-4 border-red-400 rounded-r-2xl space-y-1 text-xs font-semibold">
                    <span className="font-extrabold text-red-600 text-xs uppercase block">03. Modo de Explicación Corta para TDAH</span>
                    <p className="text-slate-500 leading-normal">
                      {tdahActive 
                        ? "Foli ha ajustado su densidad de lectura. Verás oraciones ultra breves con un tono de súper campeón muy marcado para evitar frustración escolar."
                        : `Actualmente el modo especial para TDAH está apagado. Si sospechas falta de enfoque, enciéndelo en la pestaña "Métricas Generales".`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Weekly study calendar outline recommendation */}
              <div className="bg-[#FFFBEB] rounded-3xl p-6 border-4 border-[#F59E0B] flex flex-col justify-between">
                <div className="space-y-4 text-xs font-semibold">
                  <span className="text-[10px] font-black uppercase text-[#F59E0B] tracking-widest block">📝 RUTINA RECOMENDADA DE ESTUDIO</span>
                  <h4 className="font-black text-base text-[#1E293B]">Calendario Adaptativo Semanal:</h4>
                  
                  <div className="space-y-3.5">
                    <div className="flex gap-4 items-center border-b border-[#FDE68A] pb-2">
                      <span className="bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B] font-black text-[10px] px-2.5 py-1 rounded-lg uppercase w-20 text-center shrink-0">Lunes</span>
                      <p className="text-slate-600">Preguntas de exploración en temas de {hardSubjectStr} con Foli (15 min).</p>
                    </div>

                    <div className="flex gap-4 items-center border-b border-[#FDE68A] pb-2">
                      <span className="bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B] font-black text-[10px] px-2.5 py-1 rounded-lg uppercase w-20 text-center shrink-0">Miércoles</span>
                      <p className="text-slate-600">Simulación del Súper Test de hábitos para medir mejoras cognitivas.</p>
                    </div>

                    <div className="flex gap-4 items-center">
                      <span className="bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B] font-black text-[10px] px-2.5 py-1 rounded-lg uppercase w-20 text-center shrink-0">Viernes</span>
                      <p className="text-slate-600">Quizzes interactivos cortos con recompensas de fin de semana.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t-2 border-dashed border-[#FDE68A] bg-white p-4 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[9px] uppercase font-black text-[#10B981] tracking-wide block">PROMEDIO SEMANAL:</span>
                    <span className="text-sm font-black text-[#1E293B]">96% de Motivación</span>
                  </div>
                  <span className="text-3xl">🥳📈</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FACTURACION Y PLAN EN COP */}
        {activeTab === "billing" && (
          <div className="bg-white rounded-[40px] border-8 border-slate-200 p-6 sm:p-10 shadow-[12px_12px_0_#CBD5E1] text-left space-y-6">
            <h3 className="text-2xl font-black text-[#1E293B] border-b pb-4 border-slate-100">Control de Suscripción Familiar</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-2 space-y-6">
                <div className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-200">
                  <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-150 flex-wrap gap-2 text-xs font-bold">
                    <span className="text-slate-400">Plan de Suscripción Activo:</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      activePlan === "premium" ? "bg-emerald-100 text-emerald-800 border border-emerald-400" : "bg-slate-200 text-slate-700"
                    }`}>
                      {activePlan === "premium" ? "Super Estudiante PRO 🌟" : "Pequeño Explorador (Gratuito) 🎒"}
                    </span>
                  </div>

                  <div className="space-y-4 text-xs font-semibold text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Precio mensual:</span>
                      <span className="text-[#1E293B] font-extrabold">
                        {activePlan === "premium" ? "15.000 COP / mes" : "0 COP"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Estado de Facturación:</span>
                      <span className="text-[#10B981] font-black">
                        {activePlan === "premium" ? "Al día ✓ Transacción autorizada" : "Prueba de 10 preguntas activas"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Periodo actual:</span>
                      <span>Renovación automática mensual</span>
                    </div>
                  </div>
                </div>

                {activePlan === "free" ? (
                  <div className="bg-[#FFFBEB] p-5 border-4 border-[#F59E0B] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left space-y-1">
                      <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">¿Por qué pasar a Premium?</span>
                      <p className="text-[#1E293B] font-black text-sm">Adquiere accesos ilimitados por solo 15.000 COP</p>
                      <p className="text-slate-500 text-xs">Pasa de un límite diario de 10 preguntas a diversión e informes interactivos ilimitados.</p>
                    </div>
                    <button
                      onClick={onUpgradeClick}
                      className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-black border-4 border-[#047857] shadow-[0_4px_0_#047857] active:translate-y-0.5 active:shadow-none rounded-full text-xs tracking-wider shrink-0 uppercase cursor-pointer"
                    >
                      Mejorar a PRO ✨
                    </button>
                  </div>
                ) : (
                  <div className="bg-emerald-50 p-5 border-4 border-emerald-400 rounded-3xl flex items-center justify-between gap-4">
                    <div className="text-left space-y-1 font-bold text-xs">
                      <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">¡SÚPER PADRE CONFIRMADO!</span>
                      <p className="text-[#1E293B] font-black text-sm">Suscripción Premium Activa</p>
                      <p className="text-slate-500 text-xs">¡Muchas gracias! Tu pago de 15.000 COP mensuales nos ayuda a optimizar servidores exclusivos.</p>
                    </div>
                    <span className="text-4xl">🦊💖</span>
                  </div>
                )}
              </div>

              {/* simulated COP conversion billing box info */}
              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-200 text-xs font-bold text-slate-700 space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">💳 DETALLES MONETARIOS</span>
                
                <p className="text-slate-550 leading-relaxed font-semibold">
                  FocusKid IA es un software enfocado en familias colombianas. Todos nuestros cobros se procesan de forma equivalente en pesos colombianos (COP).
                </p>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span>Suscripción:</span>
                    <span>15.000 COP</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Impuestos (IVA):</span>
                    <span>$0 COP (Software Ed)</span>
                  </div>
                  <div className="flex justify-between border-t pt-1.5 font-extrabold text-[#1E293B]">
                    <span>Total mes:</span>
                    <span>15.000 COP</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-450 leading-normal font-normal">
                  * Puedes dar de baja la membresía en cualquier instante presionando un botón de e-mail o escribiendo a soporte.
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
