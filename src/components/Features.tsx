import React from "react";
import { Sparkles, Gamepad2, Heart, ShieldAlert, BarChart2, Headphones, Activity } from "lucide-react";

export default function Features() {
  const list = [
    {
      title: "Explicaciones Mágicas ✨",
      description: "Nuestra IA toma apuntes escolares complejos y los convierte en hermosas analogías con superhéroes, caramelos, dinosaurios o piratas interestelares de forma inmediata.",
      borderColor: "border-[#3B82F6]",
      shadowColor: "shadow-[8px_8px_0_#DBEAFE]",
      iconColor: "bg-[#DBEAFE] text-[#3B82F6]",
      icon: <Sparkles className="w-8 h-8" />,
    },
    {
      title: "Misiones Gamificadas 🎮",
      description: "Genera automáticamente quizzes interactivos, crucigramas de texto y misiones de repaso para cada tema estudiado. ¡Repasar es como subir de nivel de personaje!",
      borderColor: "border-[#F59E0B]",
      shadowColor: "shadow-[8px_8px_0_#FEF3C7]",
      iconColor: "bg-[#FEF3C7] text-[#F59E0B]",
      icon: <Gamepad2 className="w-8 h-8" />,
    },
    {
      title: "Acompañamiento Foli 🦊",
      description: "Un tutor sabio que recuerda los intereses del niño, celebra sus pequeños aciertos con estrellas virtuales y le da palabras de aliento cuando un ejercicio no sale bien.",
      borderColor: "border-[#10B981]",
      shadowColor: "shadow-[8px_8px_0_#D1FAE5]",
      iconColor: "bg-[#D1FAE5] text-[#10B981]",
      icon: <Heart className="w-8 h-8" />,
    },
    {
      title: "Panel VIP para Padres 📊",
      description: "Vigila su curva de aprendizaje sin asfixiarlo. El panel familiar resume las materias dominadas, el tiempo enfocado y genera reportes semanales directos al e-mail.",
      borderColor: "border-[#3B82F6]",
      shadowColor: "shadow-[8px_8px_0_#DBEAFE]",
      iconColor: "bg-[#DBEAFE] text-[#3B82F6]",
      icon: <BarChart2 className="w-8 h-8" />,
    },
    {
      title: "Música de Enfoque 🎧",
      description: "Acceso a ondas de sonido binaurales, melodías de 8 bits y ruidos blancos relajantes integrados en el panel para mejorar sus ondas alfa de concentración de forma natural.",
      borderColor: "border-[#F59E0B]",
      shadowColor: "shadow-[8px_8px_0_#FEF3C7]",
      iconColor: "bg-[#FEF3C7] text-[#F59E0B]",
      icon: <Headphones className="w-8 h-8" />,
    },
    {
      title: "Filtro Seguro Kids 🛡️",
      description: "Entorno 100% blindado sin comerciales ni links externos dañinos. Toda la IA se pre-modera con un filtro escolar estricto para garantizar contenidos sanos y seguros.",
      borderColor: "border-[#10B981]",
      shadowColor: "shadow-[8px_8px_0_#D1FAE5]",
      iconColor: "bg-[#D1FAE5] text-[#10B981]",
      icon: <Activity className="w-8 h-8" />,
    },
  ];

  return (
    <section id="caracteristicas" className="py-24 bg-white px-4 sm:px-6 lg:px-8 border-b-8 border-[#FDE68A] relative">
      <div className="max-w-5xl mx-auto text-center space-y-4 mb-16">
        <span className="bg-[#FEF3C7] border-2 border-[#FBBF24] text-[#B45309] font-extrabold text-xs px-4 py-2 rounded-full uppercase tracking-wider inline-block">
          🎒 ¿PÓR QUE ELEGIRNOS?
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] leading-tight">
          Superpoderes Para Su <br />
          <span className="text-[#3B82F6] font-black">
            Concentración y Estudio
          </span>
        </h2>
        <p className="text-[#64748B] font-semibold text-sm sm:text-base max-w-2xl mx-auto">
          Diseñado con expertos de educación infantil y apoyado en inteligencia artificial robusta, FocusKid AI revoluciona los hábitos ordinarios volviéndolos magnéticos.
        </p>
      </div>

      {/* Bento-style Grid container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((feat, idx) => (
          <div
            key={idx}
            className={`p-6 sm:p-8 rounded-[32px] bg-white border-4 ${feat.borderColor} ${feat.shadowColor} hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between`}
          >
            <div className="space-y-4 text-left">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${feat.iconColor}`}>
                {feat.icon}
              </div>
              <h3 className="font-black text-xl text-[#1E293B] tracking-tight">
                {feat.title}
              </h3>
              <p className="text-[#64748B] text-sm font-semibold leading-relaxed">
                {feat.description}
              </p>
            </div>

            {/* Micro active details inside card */}
            <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#64748B]">Modulo Activo</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Playful prompt highlighting single child SaaS scope */}
      <div className="max-w-3xl mx-auto mt-16 bg-[#FBBF24] p-1 rounded-3xl shadow-[6px_6px_0_#FFFBEB] border-4 border-[#1E293B]">
        <div className="bg-white rounded-[20px] px-6 py-5 text-center flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="text-left">
            <span className="text-xs font-black text-[#F59E0B] uppercase tracking-widest">Enfoque Personal Único</span>
            <p className="text-[#1E293B] font-black text-sm sm:text-base mt-0.5">
              ¿Sabías que configuramos un servidor de Inteligencia Artificial exclusivo para tu hijo?
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById("demo");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 bg-[#3B82F6] text-white font-black hover:bg-[#2563EB] rounded-full shadow-[0_4px_0_#1D4ED8] active:translate-y-1 active:shadow-none transition-all text-xs tracking-wider shrink-0 uppercase cursor-pointer"
          >
            ¡Ver en Acción! 😉
          </button>
        </div>
      </div>
    </section>
  );
}
