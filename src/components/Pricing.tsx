import React, { useState } from "react";
import { Check, Star, ShieldAlert, Sparkles, Trophy } from "lucide-react";

interface PricingProps {
  onOpenAuth: (mode: "register") => void;
  isLoggedIn: boolean;
  activePlan: "free" | "premium";
  onOpenCheckout: () => void;
}

export default function Pricing({ onOpenAuth, isLoggedIn, activePlan, onOpenCheckout }: PricingProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      id: "free" as const,
      name: "Pequeño Explorador",
      subtitle: "Ideal para conocer a Foli",
      price: 0,
      description: "Prueba las explicaciones y dinámicas básicas gratis para ver si a tu hijo le encanta.",
      features: [
        "10 preguntas diarias con Foli",
        "Temas básicos escolares (Ciencia y Mate)",
        "Configuración básica de nombre",
        "Puntaje básico de estrellas virtuales",
        "Soporte comunitario estándar",
      ],
      cta: "Empezar Gratis 🚀",
      pro: false,
      color: "border-4 border-slate-300 bg-white shadow-[8px_8px_0_#F1F5F9]",
      btnStyle: "bg-white hover:bg-slate-105 text-[#1E293B] font-black border-4 border-slate-300 shadow-[0_4px_0_#94A3B8] active:translate-y-1 active:shadow-none rounded-full cursor-pointer",
    },
    {
      id: "premium" as const,
      name: "Super Estudiante PRO 🌟",
      subtitle: "Acompañamiento ILIMITADO",
      price: billingPeriod === "monthly" ? 15000 : 12000,
      description: "El micro-SaaS de estudio diario definitivo con adaptación ilimitada para mejorar sus hábitos.",
      features: [
        "Consultas directas a la IA del Zorrito Foli ILIMITADAS",
        "Personalización de intereses mágicos (Dino, Espacio, etc)",
        "Panel completo de control familiar para Padres",
        "Música binaural de concentración y temporizador",
        "Reportes semanales de progreso directos al e-mail",
        "Preguntas de trivia interactivas ilimitadas con estrellas",
        "Soporte Premium 24/7 de pedagogos expertos",
      ],
      cta: "¡Adquirir Plan Premium PRO! ✨",
      pro: true,
      color: "border-4 border-[#3B82F6] bg-white md:scale-105 shadow-[12px_12px_0_#DBEAFE] relative",
      btnStyle: "bg-[#10B981] text-white font-black hover:bg-[#059669] border-4 border-[#047857] shadow-[0_4px_0_#047857] active:translate-y-1 active:shadow-none rounded-full cursor-pointer animate-pulse",
    },
  ];

  const handleAction = (planId: "free" | "premium") => {
    if (planId === "free") {
      if (isLoggedIn) {
        alert("¡Ya estás registrado y utilizando el Plan Gratuito (10 preguntas diarias con Foli)!");
      } else {
        onOpenAuth("register");
      }
    } else {
      if (activePlan === "premium") {
        alert("¡Felicidades! Tu cuenta ya cuenta con la suscripción Super Estudiante PRO activa de forma ilimitada. 🌟");
      } else if (isLoggedIn) {
        onOpenCheckout();
      } else {
        alert("Para adquirir el Plan Premium PRO, primero crearemos tu cuenta de tutor FocusKid. ¡Es rápido y asombroso!");
        onOpenAuth("register");
      }
    }
  };

  return (
    <section id="precios" className="py-24 bg-white px-4 sm:px-6 lg:px-8 border-b-8 border-[#FDE68A] relative">
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
        <span className="bg-[#FEF3C7] border-2 border-[#FBBF24] text-[#B45309] font-extrabold text-xs px-4 py-2 rounded-full uppercase tracking-wider inline-block">
          💳 PLANES SIMPLES Y SINCEROS
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] tracking-tight">
          Inversión Inteligente para su Futuro
        </h2>
        <p className="text-[#64748B] font-semibold text-sm sm:text-base max-w-2xl mx-auto">
          Sin contratos de permanencia ni cobros sorpresa. Dale hoy a tu hijo un tutor interactivo por menos de lo que cuesta una taza de café.
        </p>

        {/* Billing Period Toggle Switch styled for Kids */}
        <div className="pt-6 flex items-center justify-center gap-4">
          <span className={`text-sm font-black uppercase tracking-wider ${billingPeriod === "monthly" ? "text-[#3B82F6]" : "text-slate-400"}`}>
            Mensual
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
            className="w-16 h-9 bg-[#FEF3C7] rounded-full p-1 transition-colors relative focus:outline-none border-4 border-[#F59E0B] cursor-pointer"
          >
            <div
              className={`w-5 h-5 bg-[#3B82F6] rounded-full shadow-md transform transition-transform duration-200 ${
                billingPeriod === "yearly" ? "translate-x-6 bg-[#10B981]" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm font-black uppercase tracking-wider flex items-center gap-1.5 ${billingPeriod === "yearly" ? "text-orange-600" : "text-slate-400"}`}>
            Anual
            <span className="bg-[#FEF3C7] text-orange-600 text-[10px] font-black px-2.5 py-0.5 rounded-full border-2 border-[#F59E0B]">
              ¡Ahorra 20%! 🎁
            </span>
          </span>
        </div>
      </div>

      {/* Plans Presentation with flat 3D layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-6 items-stretch pt-6">
        {plans.map((plan, idx) => {
          const isSelected = isLoggedIn && ((plan.id === "free" && activePlan === "free") || (plan.id === "premium" && activePlan === "premium"));
          return (
            <div
              key={idx}
              className={`rounded-[32px] p-8 flex flex-col justify-between transition-all duration-300 ${plan.color} ${
                isSelected ? "ring-8 ring-emerald-400" : ""
              }`}
            >
              {plan.pro && (
                <div className="absolute -top-6 right-6 bg-[#F59E0B] border-4 border-[#1E293B] text-white text-xs font-black py-1 px-4 rounded-full shadow-[3px_3px_0_#FFFBEB] uppercase tracking-widest flex items-center gap-1.5 z-10">
                  <Trophy className="w-3.5 h-3.5" /> RECOMENDADO
                </div>
              )}

              <div className="space-y-6 text-left">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-[#3B82F6] tracking-wide">{plan.subtitle}</span>
                    {isSelected && (
                      <span className="bg-emerald-100 text-emerald-800 border-2 border-emerald-400 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                        Plan Activo
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-[#1E293B] mt-1">{plan.name}</h3>
                  <p className="text-[#64748B] text-xs font-semibold mt-1">{plan.description}</p>
                </div>

                {/* Price Tag */}
                <div className="py-2.5 border-y-2 border-slate-100 flex items-baseline gap-1">
                  <span className="text-xs font-extrabold text-[#64748B]">COP</span>
                  <span className="text-4xl font-black text-[#1E293B] tracking-tight">
                    {plan.price === 0 ? "Gratis" : `$${plan.price.toLocaleString("es-CO")}`}
                  </span>
                  {plan.price !== 0 && (
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      / {billingPeriod === "monthly" ? "Mes" : "Mes factual anual"}
                    </span>
                  )}
                </div>

                {/* Bullet Features list */}
                <ul className="space-y-3.5">
                  <li className="text-[10px] uppercase font-black tracking-widest text-[#64748B]">¿Qué incluye?</li>
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-[#1E293B] text-xs font-semibold">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.pro ? "text-[#10B981] font-bold" : "text-slate-400"}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100">
                <button
                  onClick={() => handleAction(plan.id)}
                  className={`w-full py-4 font-black text-sm tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 ${plan.btnStyle}`}
                >
                  {plan.pro && activePlan !== "premium" && <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: "10s" }} />}
                  <span>{isSelected ? "Plan en Uso ✓" : plan.cta}</span>
                </button>
                
                <p className="text-[10px] text-center text-slate-400 font-bold mt-2.5">
                  🔒 Garantía de reembolso del 100% durante los primeros 14 días.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
