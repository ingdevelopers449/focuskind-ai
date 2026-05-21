import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, BookOpen, Star, RefreshCw, Trophy, Flame, HelpCircle } from "lucide-react";
import { DemoConfig, Message, Subject } from "../types";
import { supabaseService } from "../lib/supabase";

interface InteractiveTutorProps {
  demoConfig: DemoConfig;
  isLoggedIn?: boolean;
  activePlan?: "free" | "premium";
  onUpgradePrompt?: () => void;
  questionsAskedCount: number;
  setQuestionsAskedCount: React.Dispatch<React.SetStateAction<number>>;
  userEmail?: string;
  isFullscreen?: boolean;
  onOpenParentGate?: () => void;
}

const DEFAULT_SUGGESTIONS = {
  science: [
    "¿Por qué es azul el cielo? 🌌",
    "¿Cómo respiran las plantas? 🌿",
    "¿Por qué flotan los astronautas? 🛰️",
  ],
  math: [
    "Explícame las fracciones con pizza 🍕",
    "¿Qué es la multiplicación? ✖️",
    "¿Por qué el número cero es importante? 0️⃣",
  ],
  history: [
    "¿Quién construyó las pirámides? 🔺",
    "¿Cómo vivían los caballeros medievales? 🏰",
    "¿Quién inventó el avión? ✈️",
  ],
  art: [
    "¿Cómo se mezclan los colores primarios? 🎨",
    "¿Quién era Leonardo da Vinci? 👨‍🎨",
    "¿Cómo hace la plastilina? 🧩",
  ],
  languages: [
    "¿Cómo se dice 'perro feliz' en inglés? 🐶",
    "Aprender a saludar en 3 idiomas 🗣️",
    "¿Qué es un sinónimo? 📝",
  ],
};

const SUBJECT_METADATA = [
  { id: "science" as Subject, label: "Ciencias 🔬", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "math" as Subject, label: "Matemáticas 📐", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "history" as Subject, label: "Historia 🏰", color: "bg-pink-100 text-pink-800 border-pink-300" },
  { id: "art" as Subject, label: "Modo Creativo 🎨", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "languages" as Subject, label: "Idiomas 🗣️", color: "bg-purple-100 text-purple-800 border-purple-300" },
];

export default function InteractiveTutor({ 
  demoConfig,
  isLoggedIn = false,
  activePlan = "free",
  onUpgradePrompt,
  questionsAskedCount = 0,
  setQuestionsAskedCount,
  userEmail,
  isFullscreen = false,
  onOpenParentGate
}: InteractiveTutorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject>("science");
  const [stars, setStars] = useState(25);
  const [streak, setStreak] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getSubjectLabelEs = (sub: Subject) => {
    switch (sub) {
      case "science": return "ciencias";
      case "math": return "matemáticas";
      case "history": return "historia";
      case "art": return "arte";
      case "languages": return "idiomas";
      default: return "temas de estudio";
    }
  };

  const limitReached = activePlan === "free" && questionsAskedCount >= 10;

  // Initialize companion greetings whenever core configuration changes
  useEffect(() => {
    let introText = "";
    const name = demoConfig.childName || "Amiguito";
    const themeText = demoConfig.theme === "espacio" ? "galaxias y cometas" :
                      demoConfig.theme === "dinosaurios" ? "tiranosaurios rex e islas salvajes" :
                      demoConfig.theme === "videojuegos" ? "bloques cúbicos y aventuras gamer" : "hechizos mágicos de Hogwarts";

    introText = `¡Hola, ${name}! ★ ¡Soy Foli, tu zorrito tutor de estudio inteligente! 🦊✨ Veo que tienes ${demoConfig.ageGroup} años y hoy estamos en el modo de "${themeText}". ¡Qué combinación tan fabulosa! 

¿Tienes alguna pregunta para tus tareas hoy? ¿Quieres que resolvamos un problema difícil juntos? Elige uno de los temas de arriba o escríbeme lo que quieras responder. ¡Te enseñaré con divertidos superpoderes!`;

    setMessages([
      {
        id: "welcome",
        sender: "foli",
        text: introText,
        timestamp: new Date(),
        suggestedTasks: [
          "¿Por qué brilla el sol? ☀️",
          "Dime un truco de estudio 🧠",
          "Explícame cómo se extinguieron los dinosaurios 🦕",
        ],
      },
    ]);
  }, [demoConfig]);

  // Scroll to bottom of message logs
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Load initial stars and chat history from Supabase when user logs in
  useEffect(() => {
    if (!isLoggedIn || !userEmail) return;

    const loadData = async () => {
      try {
        const profile = await supabaseService.getTutor(userEmail);
        if (profile && typeof profile.stars_earned === "number") {
          setStars(profile.stars_earned);
        }

        const history = await supabaseService.getChatHistory(userEmail);
        if (history && history.length > 0) {
          const mapped: Message[] = history.map((item, idx) => ({
            id: `supabase-${item.id || idx}`,
            sender: item.role === "assistant" ? "foli" : "user",
            text: item.content,
            timestamp: new Date(item.created_at || Date.now()),
            suggestedTasks: item.role === "assistant" ? [
              "¡Súper claro, gracias Foli! 👍",
              "Dime otra analogía graciosa 🤹",
              "¿Cómo puedo memorizar esto mejor? 🧩"
            ] : undefined
          }));
          setMessages(mapped);
        }
      } catch (err) {
        console.error("Failed to load Supabase initial data:", err);
      }
    };

    loadData();
  }, [isLoggedIn, userEmail]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Add user message to history
    const userMsgId = "user-" + Date.now();
    const newUserMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsLoading(true);

    if (isLoggedIn && userEmail) {
      supabaseService.addChatMessage({
        tutor_email: userEmail,
        role: "user",
        content: textToSend,
        subject: selectedSubject
      });
    }

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          ageGroup: demoConfig.ageGroup,
          childName: demoConfig.childName,
          theme: demoConfig.theme,
          subject: selectedSubject,
          hasTdah: demoConfig.hasTdah,
          difficultSubject: demoConfig.difficultSubject
        }),
      });

      if (!response.ok) {
        let errorDataObj: any = null;
        try {
          errorDataObj = await response.json();
        } catch (_) {}
        throw new Error(errorDataObj?.error ? `${errorDataObj.error}\n\nDetalle: ${errorDataObj.detail || ""}` : "Falla de API");
      }

      const data = await response.json();
      
      const foliMsgId = "foli-" + Date.now();
      const newFoliMsg: Message = {
        id: foliMsgId,
        sender: "foli",
        text: data.text,
        timestamp: new Date(),
        suggestedTasks: data.suggestedTasks && data.suggestedTasks.length > 0 ? data.suggestedTasks : [
          "¡Súper claro, gracias Foli! 👍",
          "Dime otra analogía graciosa 🤹",
          "¿Cómo puedo memorizar esto mejor? 🧩"
        ],
      };

      setMessages((prev) => [...prev, newFoliMsg]);

      if (isLoggedIn && userEmail) {
        supabaseService.addChatMessage({
          tutor_email: userEmail,
          role: "assistant",
          content: data.text,
          subject: selectedSubject
        });
      }

      // Give child some reward stars for asking a query!
      setStars((prev) => prev + 5);
      // Increment question asked count
      setQuestionsAskedCount((prev) => prev + 1);
    } catch (error: any) {
      console.error(error);
      const errId = "error-" + Date.now();
      
      const errorMessageText = error.message && error.message !== "Falla de API"
        ? `🦊 ¡Uuups! Foli se ha topado con un inconveniente técnico:\n\n${error.message}`
        : `¡Uuups! 🦊💥 Mi antenita de sabiduría se ha cruzado con una ráfaga de viento galáctica. Tu API Key de Gemini se está configurando de forma segura. Asegúrate de tener tu clave configurada en el panel de Secrets.\n\nMientras tanto, ¡sigamos practicando! ¿Tienes otra duda o quieres volver a intentar?`;

      setMessages((prev) => [
        ...prev,
        {
          id: errId,
          sender: "foli",
          text: errorMessageText,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAwardStars = (task: string) => {
    // Treat clicking on tutor challenges as getting score
    alert(`🌟 ¡Increíble! Respondiste: "${task}". ¡Has ganado +10 Puntos de Estrella! ⭐\nFoli dice: "¡Excelente razonamiento adaptivo!"`);
    setStars((prev) => prev + 10);
    // Add small congrats bubble
    setMessages((prev) => [
      ...prev,
      {
        id: "congrats-" + Date.now(),
        sender: "foli",
        text: `¡Uuuaau! El amiguito "${demoConfig.childName}" acertó la trivia rápida con maestría. 🏆 ¡Has desbloqueado +10 Estrellas por asimilar este concepto en tu memoria! ¡Sigue así! 🦊🌟`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "foli",
        text: `¡Pizarra mágica limpia! 🦊🧼 ¿Qué reto estudiantil solucionaremos ahora, ${demoConfig.childName}? Elige tu materia favorita abajo.`,
        timestamp: new Date(),
        suggestedTasks: DEFAULT_SUGGESTIONS[selectedSubject],
      },
    ]);
  };

  if (isFullscreen) {
    return (
      <div className="flex flex-col h-screen w-screen bg-[#FFFBEB] animate-fade-in text-left overflow-hidden">
        {/* Children top navigational bar */}
        <div className="bg-[#1E293B] border-b-4 border-[#3B82F6] px-4 py-4 sm:px-6 flex items-center justify-between shadow-lg shrink-0 select-none">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">🦊</span>
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 leading-none">
                FocusKid AI <span className="text-[10px] sm:text-xs bg-[#3B82F6] px-2.5 py-1 rounded-full text-white font-extrabold uppercase tracking-widest shadow-sm">MODO ENFOQUE 🎯</span>
              </h1>
              <p className="text-xs sm:text-sm text-yellow-300 font-bold leading-none mt-1.5">Aventura de Aprendizaje con Foli</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 font-sans">
            <div className="hidden md:flex items-center gap-2.5">
              <span className="text-slate-300 text-sm font-black uppercase tracking-wider">Estudiante:</span>
              <span className="bg-[#FEF3C7] text-[#B45309] font-black text-sm px-4 py-1.5 rounded-full border-2 border-[#F59E0B] shadow-sm">
                👦 {demoConfig.childName || "Amiguito"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 border-2 border-slate-700 px-4 py-1.5 rounded-full shadow-inner">
              <Star className="w-4.5 h-4.5 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="font-black text-sm text-yellow-300 tracking-wide">{stars} ⭐</span>
            </div>

            <button
              onClick={onOpenParentGate}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white border-2 border-white px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-150 flex items-center gap-1.5 justify-center cursor-pointer whitespace-nowrap"
            >
              <span>🔒 SALIR / PADRES</span>
            </button>
          </div>
        </div>

        {/* The body grids */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 font-sans">
          {/* Left profile/mascot controls */}
          <div className="hidden md:flex md:col-span-3 bg-[#111827] p-5 text-white flex-col justify-between border-r-4 border-[#3B82F6] overflow-y-auto shrink-0 select-none">
            <div className="space-y-4">
              <div className="relative mx-auto w-24 h-24 rounded-2xl bg-[#FEF3C7] border-4 border-[#F59E0B] shadow-lg flex items-center justify-center overflow-hidden">
                <div className="absolute top-3 left-4 w-6 h-8 bg-orange-600 rounded-t-full transform -rotate-12 border border-white"></div>
                <div className="absolute top-3 right-4 w-6 h-8 bg-orange-600 rounded-t-full transform rotate-12 border border-white"></div>
                <div className="w-16 h-16 rounded-full flex flex-col justify-center items-center relative z-10">
                  <span className="text-4xl">🦊</span>
                </div>
                <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-[#3B82F6] text-white font-black text-[8px] border border-white">
                  AI
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-black text-xl sm:text-2xl text-white leading-tight">Foli el Zorrito</h3>
                <p className="text-xs text-yellow-300 font-bold uppercase tracking-wider">Tu Tutor Inteligente de IA</p>
              </div>

              <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center font-extrabold">
                  <span className="text-slate-300">Puntaje:</span>
                  <span className="text-yellow-400 font-black text-sm bg-yellow-950/40 px-2 py-0.5 rounded-lg border border-yellow-900/50">{stars} estrellas</span>
                </div>
                <div className="flex justify-between items-center font-extrabold">
                  <span className="text-slate-300">Estudio:</span>
                  <span className="text-orange-400 font-black text-sm bg-orange-950/40 px-2 py-0.5 rounded-lg border border-orange-900/50">{streak} días 🔥</span>
                </div>
                <div className="flex justify-between items-center font-extrabold text-left">
                  <span className="text-slate-300">Tema preferido:</span>
                  <span className="text-sky-400 font-black capitalize block truncate max-w-[125px]">{demoConfig.theme}</span>
                </div>
                {demoConfig.hasTdah && (
                  <div className="border-t border-slate-800 pt-2.5 text-center">
                    <span className="bg-rose-600 border border-rose-400 text-rose-100 text-[10px] font-black px-3 py-1 rounded-lg inline-block uppercase tracking-wider shadow-sm">
                      ⚡ MODO TDAH ACTIVADO
                    </span>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-200 leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-750">
                ⭐ <strong className="text-yellow-300">Tip:</strong> ¡Responde las misiones rápidas con estrellas de Foli para desbloquear insignias y nuevos rangos espaciales!
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex flex-col gap-2">
              <button
                onClick={handleClearHistory}
                className="text-xs sm:text-sm font-black text-slate-300 hover:text-white hover:underline transition-all flex items-center gap-1.5 justify-center cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Limpiar Historial de Chat
              </button>
            </div>
          </div>

          {/* Right chat side: Full-Height */}
          <div className="md:col-span-9 p-4 sm:p-5 flex flex-col justify-between h-full bg-slate-50 overflow-hidden">
            
            {/* Subject horizontal select tabs */}
            <div className="flex gap-2.5 overflow-x-auto pb-3 border-b border-slate-200 shrink-0 scrollbar-none">
              {SUBJECT_METADATA.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`px-5 py-3 rounded-2xl text-sm sm:text-base font-black border-2 transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer ${
                    selectedSubject === subject.id
                      ? "bg-[#3B82F6] text-white border-[#1D4ED8] shadow-[0_4px_0_#1E3A8A]"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 shadow-sm hover:shadow"
                  }`}
                >
                  {subject.label}
                </button>
              ))}
            </div>

            {/* Render Scroll Timeline logs */}
            <div className="flex-1 overflow-y-auto my-3 space-y-4 pr-1 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[24px] p-4 text-sm font-semibold border-4 relative text-left ${
                      msg.sender === "user"
                        ? "bg-indigo-50 text-[#1E293B] border-[#3B82F6]"
                        : "bg-white text-[#1E293B] border-[#F59E0B] shadow-sm"
                    }`}
                  >
                    <span className="block text-[10px] uppercase tracking-wider font-extrabold text-[#3B82F6] mb-1">
                      {msg.sender === "user" ? `${demoConfig.childName}` : "Zorrito Foli 🦊"}
                    </span>
                    <p className="whitespace-pre-line leading-relaxed text-[#1E293B]">{msg.text}</p>
                  </div>

                  {msg.sender === "foli" && msg.suggestedTasks && msg.suggestedTasks.length > 0 && (
                    <div className="mt-2 pl-2 flex flex-col gap-1 w-full max-w-[80%] text-left">
                      <span className="text-[9px] text-[#64748B] font-extrabold uppercase tracking-wide flex items-center gap-1 flex-wrap">
                        <HelpCircle className="w-3 h-3 text-amber-500" />
                        Misión rápida de Foli: ¡Responde aquí!
                      </span>
                      {msg.suggestedTasks.map((task, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAwardStars(task)}
                          className="py-1.5 px-3 bg-white hover:bg-yellow-50 border-2 border-[#F59E0B] rounded-xl text-xs font-bold text-[#B45309] transition-all text-left shadow-sm hover:-translate-y-0.5 cursor-pointer"
                        >
                          ⭐ {task}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start animate-pulse text-left">
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-[#10B981] rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span className="text-xs font-bold text-[#64748B]">Foli está buscando respuestas sabias...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick action bar */}
            <div className="shrink-0 pt-2 border-t border-slate-200">
              {limitReached ? (
                <div className="p-4 rounded-2xl bg-[#FEF3C7] border-4 border-[#FBBF24] text-center space-y-2">
                  <h4 className="font-black text-xs text-[#1E293B] uppercase tracking-wider">¡Límite del Plan Diario Alcanzado! 🚀</h4>
                  <p className="text-[11px] text-slate-500 font-bold leading-normal">
                    Has usado tus 10 preguntas. Pídele al tutor responsable adquirir la suscripción Premium PRO (15.000 COP) para volver a tener Foli ilimitado.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-widest mr-2 select-none">💡 Toca para preguntar:</span>
                    {DEFAULT_SUGGESTIONS[selectedSubject].map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(s)}
                        className="px-3.5 py-2 bg-[#FEF3C7]/90 hover:bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-xl text-xs sm:text-sm font-black text-[#1E293B] hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage(inputValue);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={`Pregúntale a Foli sobre ${getSubjectLabelEs(selectedSubject)}...`}
                      className="flex-1 bg-white border-2 border-slate-300 focus:border-[#3B82F6] rounded-xl px-4 py-2 text-xs font-semibold outline-none text-[#1E293B]"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      className="p-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl active:translate-y-0.5 cursor-pointer flex items-center justify-center border-b-2 border-emerald-700"
                      disabled={isLoading || !inputValue.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="demo" className="py-20 bg-[#FFFBEB] px-4 sm:px-6 lg:px-8 border-b-8 border-[#FDE68A]">
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-10">
        <span className="px-4 py-1.5 bg-[#F59E0B] text-white border-2 border-[#1E293B] shadow-[4px_4px_0_#FEF3C7] rounded-full text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5 animate-bounce">
          <Star className="w-3.5 h-3.5 fill-current" /> DEMO INTERACTIVA
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] tracking-tight">
          ¡Pregúntale lo que quieras a <span className="text-[#3B82F6] font-black">Foli el Zorrito AI</span>!
        </h2>
        <p className="text-[#64748B] font-bold max-w-2xl mx-auto text-sm sm:text-base">
          Prueba el núcleo del software en tiempo real. Esta demo adaptará explicaciones para la edad de{" "}
          <strong className="text-[#3B82F6] font-extrabold">{demoConfig.childName} ({demoConfig.ageGroup} años)</strong> bajo su tema preferido de{" "}
          <strong className="text-[#F59E0B] font-black">"{demoConfig.theme.toUpperCase()}"</strong>.
        </p>
      </div>

      <div className="max-w-4xl mx-auto rounded-[40px] border-8 border-[#3B82F6] bg-white shadow-[12px_12px_0_#DBEAFE] overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Tutor Side Column (Mascot details & stats) */}
        <div className="md:col-span-4 bg-[#1E293B] p-6 text-white text-center flex flex-col justify-between border-b-8 md:border-b-0 md:border-r-8 border-[#3B82F6]">
          
          <div className="space-y-4">
            {/* Custom SVG Avatar representation of "Foli" - high-contrast colors */}
            <div className="relative mx-auto w-32 h-32 rounded-3xl bg-[#FEF3C7] border-4 border-[#F59E0B] shadow-xl flex items-center justify-center overflow-hidden">
              
              {/* Ears */}
              <div className="absolute top-4 left-6 w-8 h-10 bg-orange-600 rounded-t-full transform -rotate-12 border border-white"></div>
              <div className="absolute top-4 right-6 w-8 h-10 bg-orange-600 rounded-t-full transform rotate-12 border border-white"></div>
              
              {/* Fox Face Inner Graphic */}
              <div className="w-24 h-24 rounded-full flex flex-col justify-center items-center relative z-10">
                <span className="text-5xl">🦊</span>
              </div>
              
              {/* Glowing smart badge */}
              <div className="absolute bottom-1 right-2 w-7 h-7 rounded-lg bg-[#3B82F6] flex items-center justify-center text-white font-black text-xs border-2 border-white">
                AI
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-2xl sm:text-3xl text-white tracking-tight">Foli el Zorrito</h3>
              <p className="text-sm text-yellow-300 font-bold uppercase tracking-wider">Tutor Inteligente de IA</p>
            </div>

            {/* Simulated Child Metrics - highly gamified for kids with Vibrant colors */}
            <div className="bg-slate-900 border-2 border-slate-700/60 p-5 rounded-3xl space-y-4 shadow-inner">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="font-extrabold flex items-center gap-1.5 text-slate-200">
                  <Star className="w-4.5 h-4.5 text-[#F59E0B] fill-[#F59E0B]" />
                  Estrellas de Oro:
                </span>
                <span className="bg-[#FEF3C7] text-[#B45309] font-black px-3 py-1 rounded-full border border-[#F59E0B] shadow-sm text-xs sm:text-sm">
                  {stars} ⭐
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="font-extrabold flex items-center gap-1.5 text-slate-200">
                  <Flame className="w-4.5 h-4.5 text-orange-400 fill-orange-400" />
                  Racha de Estudio:
                </span>
                <span className="bg-[#FEF3C7] text-[#B45309] font-black px-3 py-1 rounded-full border border-[#F59E0B] shadow-sm text-xs sm:text-sm">
                  {streak} Días 🔥
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-3.5 text-left">
                <div>
                  <p className="text-[11px] text-slate-400 tracking-wider font-extrabold uppercase">Rango Actual</p>
                  <span className="text-sm font-black text-white tracking-wide block mt-0.5">
                    {demoConfig.theme === "espacio" ? "🛸 Pequeño Astronauta" :
                     demoConfig.theme === "dinosaurios" ? "🦕 Explorador Jurásico" :
                     demoConfig.theme === "videojuegos" ? "⛏️ Constructor Experto" : "🔮 Hechicero de Grado 1"}
                  </span>
                </div>

                <div>
                  <p className="text-[11px] text-slate-400 tracking-wider font-extrabold uppercase">Plan Actual</p>
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full inline-block mt-1 ${
                    activePlan === "premium" ? "bg-emerald-100 text-emerald-800 border border-emerald-400 animate-pulse" : "bg-slate-800 text-slate-350 border border-slate-700"
                  }`}>
                    {activePlan === "premium" ? "SUPER ESTUDIANTE PRO ✨" : `GRATUITO (${questionsAskedCount}/10 Preguntas)`}
                  </span>
                </div>

                {demoConfig.hasTdah && (
                  <div className="pt-1">
                    <span className="bg-rose-600 border border-rose-400 text-rose-100 text-[10px] font-black px-3 py-1 rounded-lg inline-block uppercase tracking-wider shadow-sm">
                      ⚡ MODO TDAH OPTIMIZADO
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <div className="text-xs text-slate-200 bg-slate-900 border border-slate-850 p-3.5 rounded-2xl text-left leading-relaxed">
              💡 <strong>Tema de Estudio:</strong> Adaptado dinámicamente utilizando vocabulario motivador de {demoConfig.theme.toUpperCase()}.
            </div>
            
            <button
              onClick={handleClearHistory}
              className="text-xs sm:text-sm font-black text-slate-350 hover:text-white hover:underline transition-all flex items-center gap-1.5 justify-center mx-auto cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Limpiar Pizarra
            </button>
          </div>
        </div>

        {/* Chat / Timeline Sandbox */}
        <div className="md:col-span-8 p-4 sm:p-6 flex flex-col justify-between h-[520px] bg-slate-50">
          
          {/* Subject Switchers */}
          <div className="flex gap-2.5 overflow-x-auto pb-3.5 border-b border-slate-200 scrollbar-none">
            {SUBJECT_METADATA.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`px-4.5 py-2 rounded-2xl text-xs sm:text-sm font-black border-2 transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer ${
                  selectedSubject === subject.id
                    ? "bg-[#3B82F6] text-white border-[#1D4ED8] shadow-[0_3px_0_#1E3A8A]"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 shadow-sm hover:shadow"
                }`}
              >
                {subject.label}
              </button>
            ))}
          </div>

          {/* Dialog Stream */}
          <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-[24px] p-4 text-sm font-semibold border-4 relative ${
                    msg.sender === "user"
                      ? "bg-indigo-50 text-[#1E293B] border-[#3B82F6]"
                      : "bg-white text-[#1E293B] border-[#F59E0B] shadow-sm"
                  }`}
                >
                  {/* Speaker tag label */}
                  <span className="block text-[10px] uppercase tracking-wider font-extrabold text-[#3B82F6] mb-1.5">
                    {msg.sender === "user" ? `${demoConfig.childName}` : "Zorrito Foli 🦊"}
                  </span>

                  <p className="whitespace-pre-line leading-relaxed text-[#1E293B]">{msg.text}</p>
                </div>

                {/* Extra gamification interactive options */}
                {msg.sender === "foli" && msg.suggestedTasks && msg.suggestedTasks.length > 0 && (
                  <div className="mt-2.5 pl-2 flex flex-col gap-1.5 max-w-[80%]">
                    <span className="text-[10px] text-[#64748B] font-extrabold uppercase tracking-wide flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-amber-500" />
                      Misión rápida de Foli: ¡Elige una respuesta!
                    </span>
                    {msg.suggestedTasks.map((task, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAwardStars(task)}
                        className="py-1.5 px-3 bg-white hover:bg-yellow-50 border-2 border-[#F59E0B] rounded-xl text-xs font-bold text-[#B45309] transition-all text-left shadow-sm hover:-translate-y-0.5"
                      >
                        ⭐ {task}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start animate-pulse">
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2.5 h-2.5 bg-[#3B82F6] rounded-full animate-bounce animate-delay-100"></div>
                    <div className="w-2.5 h-2.5 bg-[#F59E0B] rounded-full animate-bounce animate-delay-200"></div>
                    <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full animate-bounce animate-delay-300"></div>
                  </div>
                  <span className="text-xs font-bold text-[#64748B]">Foli está escribiendo magia...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions or limit upgrade blocker */}
          {limitReached ? (
            <div className="p-5 rounded-3xl bg-[#FEF3C7] border-4 border-[#FBBF24] text-center space-y-3.5 shadow-sm">
              <span className="text-3xl">🔑🦊🎈</span>
              <h4 className="font-black text-sm text-[#1E293B] uppercase tracking-wider">¡Has alcanzado el límite del Plan Gratuito!</h4>
              <p className="text-xs text-slate-500 font-bold max-w-md mx-auto leading-normal">
                Has hecho tus <strong>10 preguntas del día</strong> para {demoConfig.childName}. Adquiere la suscripción Premium PRO por solo <strong>15.000 COP al mes</strong> para preguntas ilimitadas con Foli el Zorrito, reportes de progreso semanal para padres, y modo adaptado para TDH/TDAH.
              </p>
              <button
                type="button"
                onClick={onUpgradePrompt}
                className="w-full sm:w-auto px-8 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-black border-4 border-[#047857] shadow-[0_4px_0_#047857] active:translate-y-1 active:shadow-none rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer inline-flex items-center gap-1.5 justify-center"
              >
                <Sparkles className="w-4 h-4 text-yellow-200" />
                <span>¡Activar Plan Premium PRO (15.000 COP)! ✨</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap items-center">
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest mr-1">💡 Preguntas rápidas:</span>
                {DEFAULT_SUGGESTIONS[selectedSubject].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(s)}
                    className="px-3.5 py-1.5 bg-[#FEF3C7]/90 hover:bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-xl text-xs font-black text-[#1E293B] hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Input Bar with Vibrant Palette styles */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`¡Hola Foli! Pregunta sobre ${getSubjectLabelEs(selectedSubject)} de tus asignaturas...`}
                  className="flex-1 bg-white border-4 border-slate-200 focus:border-[#3B82F6] rounded-2xl px-4 py-3 text-sm font-semibold outline-none transition-all placeholder:text-slate-400 text-[#1E293B]"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="p-3.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl shadow-[0_4px_0_#059669] active:translate-y-1 active:shadow-none disabled:bg-slate-300 transition-all flex items-center justify-center cursor-pointer"
                  disabled={isLoading || !inputValue.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
