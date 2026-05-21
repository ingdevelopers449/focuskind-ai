import React, { useState } from "react";
import { QuizQuestion } from "../types";
import { Sparkles, Star, ShieldAlert, Award, Brain, Target, Smile, BookOpen } from "lucide-react";

const SYSTEM_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Cuando te sientas a hacer tu tarea, ¿qué es lo primero que haces? 🤔",
    options: [
      { text: "Me imagino que soy un astronauta descubriendo un nuevo planeta 🚀", icon: "🚀", scoreType: "explorador" },
      { text: "Organizo mis lápices por colores y hago una lista de tareas ✏️", icon: "✏️", scoreType: "cientifico" },
      { text: "Empiezo dibujando en los márgenes y creando historias graciosas 🎨", icon: "🎨", scoreType: "creador" },
      { text: "Digo: '¡Voy a terminar esto más rápido que un rayo!' ⚡", icon: "⚡", scoreType: "lider" },
    ],
  },
  {
    id: 2,
    question: "Si encuentras una palabra o ejercicio muy difícil... ¿qué pasa por tu cabecita? 🧩",
    options: [
      { text: "Quiero investigar su secreto como si fuera un detective prehistórico 🦖", icon: "🦖", scoreType: "explorador" },
      { text: "Pido permiso para descomponerlo en mini-partes lógicas 🎒", icon: "🎒", scoreType: "cientifico" },
      { text: "Escribo una canción de rap divertida sobre lo que sea que no entiendo 🎤", icon: "🎤", scoreType: "creador" },
      { text: "Busco competir con mi récord de ayer para vencer al monstruo del reto 👾", icon: "👾", scoreType: "lider" },
    ],
  },
  {
    id: 3,
    question: "¡Tu mochila de estudio secreta ideal tiene que incluir! 🎒💼",
    options: [
      { text: "Un mapa estelar y binoculares de explorador de junglas 🧭", icon: "🧭", scoreType: "explorador" },
      { text: "Reloj inteligente para medir mis minutos de concentración ⏱️", icon: "⏱️", scoreType: "cientifico" },
      { text: "Pegatinas coloridas, plastilina y libretas de garabatos 📓", icon: "📓", scoreType: "creador" },
      { text: "Un trofeo dorado imaginario por ser el campeón del día 🏆", icon: "🏆", scoreType: "lider" },
    ],
  },
  {
    id: 4,
    question: "Al terminar tus deberes, ¿qué te hace sentir más feliz? 🥰",
    options: [
      { text: "Saber que ahora conozco un dato genial que casi nadie sabe 👽", icon: "👽", scoreType: "explorador" },
      { text: "Tener mi panel de misiones completado al 100% sin pendientes 📊", icon: "📊", scoreType: "cientifico" },
      { text: "Mostrarle mi libreta llena de colores creativos a mamá o papá 👩‍👦", icon: "👩‍👦", scoreType: "creador" },
      { text: "Enseñarles mi respuesta perfecta a mis compañeros como un tutor escolar 🦊", icon: "🦊", scoreType: "lider" },
    ],
  },
];

const PROFILE_RESULTS = {
  explorador: {
    title: "Explorador Espacial Galáctico 🚀🛸",
    description: "¡Tu hijo tiene alma de descubridor! No estudia por memorizar, sino por pura curiosidad insaciable. Le encantan los dinosaurios, las galaxias salvajes y las preguntas difíciles.",
    childTip: "Prueba el modo 'Aventura Espacial' en FocusKid AI. Foli guiará las lecciones vinculando conceptos científicos con naves, nebulosas y la gravedad.",
    parentHack: "Premia su curiosidad haciéndole preguntas abiertas sobre lo que estudió, en vez de exámenes de memorización estricta.",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
  },
  cientifico: {
    title: "Zorrito Científico Metódico 📐🧪",
    description: "¡Un amante del orden y el control! Le gusta planificar, saber exactamente qué sigue y tachar tareas completadas. Su concentración destaca cuando el ambiente está organizado.",
    childTip: "Dale control sobre el Temporizador de Intervalos Amigables en su panel FocusKid. Le motivará ver estadísticas de minutos.",
    parentHack: "Establece un horario consistente y visual en su rincón de juegos. La constancia le da súper poderes de tranquilidad.",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  creador: {
    title: "Artista Visual Rebelde 🎨🪄",
    description: "¡Una mente llena de arcoíris y creatividad! El aprendizaje repetitivo estándar le aburre con facilidad. Necesita dibujar, colorear y escuchar historias animadas para retener conocimiento.",
    childTip: "Utiliza la función 'Explicaciones Creativas' de Foli. El sistema usará analogías fantásticas con magia, colores y hechizos.",
    parentHack: "Permite que use marcadores de colores vistosos o que te explique las fracciones usando juguetes reales en vez de papel rígido.",
    badgeColor: "bg-pink-100 text-pink-800 border-pink-300",
  },
  lider: {
    title: "Súper Campeón Retador 🏆⚡",
    description: "¡Le impulsa la competencia sana y los logros! Le divierte superar retos, batir marcas de velocidad y coleccionar medallas o estrellas virtuales.",
    childTip: "Enfócate en la sección de 'Trivias y Quizzes' de FocusKid AI. Foli recompensará sus logros diarios con bonos de estrellas.",
    parentHack: "Convierte su sesión de estudio en misiones de videojuegos con jefes de nivel. Cada ejercicio es un monstruo que Foli ayuda a derrotar.",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
  },
};

export default function StudyQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ explorador: 0, cientifico: 0, creador: 0, lider: 0 });
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalProfile, setFinalProfile] = useState<"explorador" | "cientifico" | "creador" | "lider">("explorador");

  const handleSelectOption = (scoreType: "explorador" | "cientifico" | "creador" | "lider") => {
    const updatedScores = { ...scores, [scoreType]: scores[scoreType] + 1 };
    setScores(updatedScores);

    if (currentStep < SYSTEM_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Find highest score
      let highestKey: "explorador" | "cientifico" | "creador" | "lider" = "explorador";
      let maxScore = -1;

      const scoreKeys: Array<"explorador" | "cientifico" | "creador" | "lider"> = [
        "explorador",
        "cientifico",
        "creador",
        "lider",
      ];

      scoreKeys.forEach((k) => {
        if (updatedScores[k] > maxScore) {
          maxScore = updatedScores[k];
          highestKey = k;
        }
      });

      setFinalProfile(highestKey);
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setScores({ explorador: 0, cientifico: 0, creador: 0, lider: 0 });
    setQuizFinished(false);
  };

  return (
    <section id="test" className="py-20 bg-[#FFFBEB] px-4 sm:px-6 lg:px-8 border-b-8 border-[#FDE68A]">
      <div className="max-w-4xl mx-auto rounded-[40px] border-8 border-[#F59E0B] bg-white p-6 sm:p-10 shadow-[12px_12px_0_#FEF3C7] relative overflow-hidden">
        
        {/* Colorful backgrounds inside card */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FEF3C7]/40 rounded-full blur-2xl -z-10" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#DBEAFE]/40 rounded-full blur-3xl -z-10" />

        {!quizFinished ? (
          <div className="space-y-6">
            
            {/* Quiz Header */}
            <div className="text-center space-y-2">
              <span className="bg-[#DBEAFE] border-2 border-[#3B82F6] text-[#1D4ED8] font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
                🧙‍♂️ DESCUBRE SU PERFIL DE ESTUDIO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1E293B] leading-tight">
                El "Súper Test de Enfoque" para Niños y Padres
              </h2>
              <p className="text-[#64748B] text-sm font-semibold">
                Haz estas 4 divertidas preguntas rápidas a tu hijo y descubre consejos inmediatos sobre cómo asimila mejor sus materias académicas.
              </p>
              
              {/* Progress Bar */}
              <div className="pt-4 flex items-center justify-between text-xs text-slate-500 font-bold max-w-xs mx-auto">
                <span>Misión {currentStep + 1} de {SYSTEM_QUESTIONS.length}</span>
                <span className="bg-[#FEF3C7] px-2.5 py-0.5 rounded-full text-[#B45309] font-black border border-[#F59E0B]">
                  {Math.round(((currentStep + 1) / SYSTEM_QUESTIONS.length) * 100)}% Completado
                </span>
              </div>
              
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden max-w-sm mx-auto mt-2 border-2 border-slate-200">
                <div 
                  className="bg-[#10B981] h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / SYSTEM_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-50 border-4 border-dashed border-[#FBBF24] rounded-3xl p-6 text-center shadow-inner my-6">
              <span className="text-lg sm:text-xl font-black text-[#1E293B] leading-relaxed">
                {SYSTEM_QUESTIONS[currentStep].question}
              </span>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SYSTEM_QUESTIONS[currentStep].options.map((opt, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectOption(opt.scoreType)}
                  className="p-4 bg-white hover:bg-amber-50 border-4 border-slate-100 hover:border-[#FBBF24] rounded-3xl text-left shadow-sm hover:shadow-[4px_4px_0_#FFFBEB] transition-all flex items-center gap-4 text-slate-800 group hover:-translate-y-1 cursor-pointer"
                >
                  <span className="text-3xl bg-slate-50 p-2.5 rounded-2xl group-hover:bg-[#FEF3C7] transition-colors border-2 border-slate-100">
                    {opt.icon}
                  </span>
                  <span className="font-black text-sm sm:text-base leading-snug text-[#1E293B]">
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>

          </div>
        ) : (
          /* Result Layout representation */
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#D1FAE5] text-[#10B981] flex items-center justify-center mx-auto shadow-md border-4 border-[#10B981] animate-bounce">
              <Award className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-[#64748B] tracking-widest block">¡Resultado de Perfil Listo!</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight">
                El Súper Estilo de tu hijo es:
              </h3>
              <div className="inline-block px-6 py-2.5 rounded-full border-4 font-black text-lg sm:text-xl shadow-[4px_4px_0_#FEF3C7] mt-1 italic uppercase tracking-wide bg-[#FEF3C7] text-[#B45309] border-[#F59E0B]">
                ⭐ {PROFILE_RESULTS[finalProfile].title} ⭐
              </div>
            </div>

            {/* Result Description block */}
            <div className="bg-slate-50 p-6 rounded-3xl border-4 border-dashed border-[#F59E0B] text-left max-w-2xl mx-auto space-y-4">
              <div>
                <h4 className="font-black text-[#1E293B] text-sm uppercase tracking-wide flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-[#3B82F6]" /> ¿Cómo piensa su cerebro?
                </h4>
                <p className="text-[#64748B] text-sm mt-1 font-semibold leading-relaxed">
                  {PROFILE_RESULTS[finalProfile].description}
                </p>
              </div>

              <div>
                <h4 className="font-black text-[#1E293B] text-sm uppercase tracking-wide flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#F59E0B]" /> Plan personalizado en FocusKid:
                </h4>
                <p className="text-[#64748B] text-sm mt-1 font-semibold leading-relaxed">
                  {PROFILE_RESULTS[finalProfile].childTip}
                </p>
              </div>

              <div className="pt-3 border-t-2 border-slate-200">
                <h4 className="font-black text-[#1E293B] text-xs uppercase tracking-wide flex items-center gap-1.5 text-[#10B981]">
                  <Smile className="w-4 h-4" /> Tip de Sabiduría para los Padres:
                </h4>
                <p className="text-[#64748B] text-xs mt-1 font-bold italic leading-relaxed">
                  {PROFILE_RESULTS[finalProfile].parentHack}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border-4 border-slate-300 font-extrabold rounded-full transition-all text-sm cursor-pointer"
              >
                Volver a Realizar el Test 🔄
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("demo");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black rounded-full shadow-[0_4px_0_#1D4ED8] active:translate-y-1 active:shadow-none transition-all text-sm flex items-center gap-1.5 justify-center cursor-pointer"
              >
                <BookOpen className="w-4 h-4" /> Probar Demo con este Perfil
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
