import React, { useState } from "react";
import { ChevronDown, ChevronUp, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const list = [
    {
      q: "🧩 ¿Cómo garantiza FocusKid AI que el contenido educativo es seguro y apropiado para mi hijo?",
      a: "Toda la comunicación de nuestra IA pasa por filtros de moderación doblemente estrictos en el servidor. Nunca se tocan temas sensibles, políticos o inadecuados para menores de edad. De hecho, el sistema re-direcciona cualquier pregunta extraña que no corresponda con estudios académicos pidiéndole al niño con un guiño amigable que regrese a la materia de tarea actual.",
    },
    {
      q: "⏱️ ¿Cómo ayuda FocusKid AI a regular el tiempo expuesto a pantallas?",
      a: "En el panel de control para padres puedes configurar límites estrictos de minutos por día (por ejemplo, 30 minutos). Una vez alcanzados, nuestro zorrito Foli le dirá de forma muy dulce que es momento de salir a tomar aire fresco y jugar en el parque con amigos para ganar un multiplicador de estrellas al día siguiente.",
    },
    {
      q: "🏫 ¿Las explicaciones de Foli están alineadas con los planes oficiales de estudio?",
      a: "¡Sí! La IA maneja los conceptos troncales de materias como matemáticas, ciencias naturales, historia, geografía e idiomas. El valor incremental reside en CÓMO explora la información: adaptando el aburrido vocabulario tradicional en metáforas lúdicas (como pirámides medievales o naves de bloques) acordes con la verdadera edad del niño.",
    },
    {
      q: "🎒 ¿Necesito estar pegado al niño mientras estudia con FocusKid AI?",
      a: "¡Para nada! Ese es el súper beneficio del micro-SaaS. FocusKid AI está desarrollado para que el niño aprenda de manera autónoma sin la frustración habitual de atascarse en la tarea. Foli lo guía, le desglosa problemas complejos paso a paso y tú simplemente recibes el boletín semanal con los logros que dominó.",
    },
    {
      q: "🌱 ¿Tienen alguna garantía de satisfacción o reembolso?",
      a: "¡Absolutamente! Si en los primeros 14 días sientes que FocusKid AI no ha mejorado el entusiasmo y la concentración de tu hijo en sus deberes, nos envías un e-mail sencillo y te devolvemos el 100% de tu dinero de inmediato.",
    },
  ];

  return (
    <section className="py-24 bg-[#FFFBEB] px-4 sm:px-6 lg:px-8 border-b-8 border-[#FDE68A]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header FAQs */}
        <div className="text-center space-y-4 mb-16">
          <span className="bg-[#FEF3C7] border-2 border-[#FBBF24] text-[#B45309] font-extrabold text-xs px-4 py-2 rounded-full uppercase tracking-wider inline-block">
            🙋‍♀️ SECRETOS DESVELADOS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] tracking-tight">
            Respuestas para Mamá y Papá
          </h2>
          <p className="text-[#64748B] font-semibold text-sm sm:text-base">
            Tiene la garantía de estar diseñado por pedagogos y expertos infantiles, manteniendo la paz mental en casa.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {list.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-[24px] border-4 transition-all duration-300 ${
                  isOpen
                    ? "bg-white border-[#3B82F6] shadow-[6px_6px_0_#DBEAFE]"
                    : "bg-white border-[#1E293B] shadow-[4px_4px_0_#FEF3C7] hover:border-[#3B82F6] hover:shadow-[4px_4px_0_#DBEAFE]"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-black text-sm sm:text-base text-[#1E293B] cursor-pointer"
                >
                  <span>{item.q}</span>
                  <div className={`p-1 bg-[#FEF3C7] rounded-xl border-2 border-[#F59E0B] transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-4 h-4 text-[#B45309]" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm font-semibold text-[#64748B] leading-relaxed border-t-2 border-slate-100 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Small safe badge */}
        <p className="text-center text-[#1E293B] font-extrabold text-[10px] uppercase tracking-widest mt-12 flex items-center justify-center gap-1.5 bg-white py-3 px-6 rounded-full max-w-sm mx-auto border-4 border-[#1E293B] shadow-[4px_4px_0_#FEF3C7]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" /> Cumple con estrictas directivas de privacidad de la COPPA.
        </p>

      </div>
    </section>
  );
}
