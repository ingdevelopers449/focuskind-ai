import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import InteractiveTutor from "./components/InteractiveTutor";
import StudyQuiz from "./components/StudyQuiz";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import CheckoutModal from "./components/CheckoutModal";
import ParentDashboard from "./components/ParentDashboard";
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import { DemoConfig } from "./types";
import { supabaseService, isSupabaseConfigured, getSuperAdminEmail } from "./lib/supabase";

export default function App() {
  const [demoConfig, setDemoConfig] = useState<DemoConfig>({
    childName: "amiguito",
    ageGroup: "8-10",
    theme: "espacio",
    hasTdah: false,
    schoolName: "",
    contactPhone: "",
    childGrade: "3ro de Primaria",
    difficultSubject: "Matemáticas 📐",
  });

  const [activeSection, setActiveSection] = useState("inicio");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  // User Authentication & Plan States
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("focuskid_is_logged_in") === "true";
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("focuskid_user_email") || "";
  });
  const [activePlan, setActivePlan] = useState<"free" | "premium">(() => {
    return (localStorage.getItem("focuskid_active_plan") as "free" | "premium") || "free";
  });
  const [questionsAskedCount, setQuestionsAskedCount] = useState(() => {
    return Number(localStorage.getItem("focuskid_questions_asked_count")) || 0;
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"student" | "parent" | "admin">(() => {
    const email = localStorage.getItem("focuskid_user_email") || "";
    if (email.toLowerCase() === getSuperAdminEmail()) {
      return "admin";
    }
    return "student";
  });

  // Security isolation for Parental Space
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);
  const [parentGateOpen, setParentGateOpen] = useState(false);
  const [parentGateTarget, setParentGateTarget] = useState<"parent" | "admin" | null>(null);
  const [parentGateInput, setParentGateInput] = useState("");
  const [parentGateError, setParentGateError] = useState("");

  const handleSwitchTab = (tab: "student" | "parent" | "admin") => {
    if (tab === "student") {
      // Locking back when children enter focus mode
      setIsParentUnlocked(false);
      setActiveWorkspaceTab("student");
    } else {
      if (isParentUnlocked) {
        setActiveWorkspaceTab(tab);
      } else {
        setParentGateTarget(tab);
        setParentGateInput("");
        setParentGateError("");
        setParentGateOpen(true);
      }
    }
  };

  // Sync state to localStorage for robust reloading
  React.useEffect(() => {
    localStorage.setItem("focuskid_is_logged_in", isLoggedIn ? "true" : "false");
    localStorage.setItem("focuskid_user_email", userEmail);
    localStorage.setItem("focuskid_active_plan", activePlan);
    localStorage.setItem("focuskid_questions_asked_count", String(questionsAskedCount));
  }, [isLoggedIn, userEmail, activePlan, questionsAskedCount]);

  const handleOpenAuth = (mode: "login" | "register") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === "student-workspace") {
      handleSwitchTab("student");
      return;
    }
    if (sectionId === "parent-workspace") {
      handleSwitchTab("parent");
      return;
    }
    if (sectionId === "admin-workspace") {
      handleSwitchTab("admin");
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleRegisterSuccess = async (data: {
    email: string;
    password?: string;
    contactPhone: string;
    schoolName: string;
    hasTdah: boolean;
    childName: string;
    childAge: any;
    childGrade: string;
    difficultSubject: string;
    childTheme: string;
  }) => {
    setIsLoggedIn(true);
    setUserEmail(data.email);
    const isOwner = data.email.toLowerCase() === getSuperAdminEmail();
    setActiveWorkspaceTab(isOwner ? "admin" : "student");

    const newConfig: DemoConfig = {
      childName: data.childName || "amiguito",
      ageGroup: data.childAge || "8-10",
      theme: data.childTheme || "espacio",
      hasTdah: !!data.hasTdah,
      schoolName: data.schoolName || "",
      contactPhone: data.contactPhone || "",
      childGrade: data.childGrade || "3ro de Primaria",
      difficultSubject: data.difficultSubject || "Matemáticas 📐",
    };
    setDemoConfig(newConfig);

    // Call Supabase Auth Registration
    if (data.password) {
      await supabaseService.signUp(data.email, data.password);
    }

    // Persist new profile to Supabase with password (except if owner/superadmin)
    if (!isOwner) {
      await supabaseService.saveTutor({
        email: data.email,
        password: data.password || "123456",
        contact_phone: data.contactPhone,
        school_name: data.schoolName,
        has_tdah: !!data.hasTdah,
        child_name: data.childName,
        child_age: data.childAge,
        child_grade: data.childGrade,
        difficult_subject: data.difficultSubject,
        child_theme: data.childTheme,
        active_plan: "free",
        questions_asked_count: 0,
        stars_earned: 25
      });
    }
  };

  const handleLoginSuccess = async (email: string, password?: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    const isOwner = email.toLowerCase() === getSuperAdminEmail();
    setActiveWorkspaceTab(isOwner ? "admin" : "student");
    
    // Load historical tutor configurations from Supabase or localStorage
    const tutorData = await supabaseService.getTutor(email);
    if (tutorData) {
      setDemoConfig({
        childName: tutorData.child_name || "Tomás",
        ageGroup: (tutorData.child_age || "8-10") as any,
        theme: tutorData.child_theme || "espacio",
        hasTdah: !!tutorData.has_tdah,
        schoolName: tutorData.school_name || "Colegio Gabriel García Márquez",
        contactPhone: tutorData.contact_phone || "+57 321 456 7890",
        childGrade: tutorData.child_grade || "3ro de Primaria",
        difficultSubject: tutorData.difficult_subject || "Matemáticas 📐",
      });
      setActivePlan(tutorData.active_plan || "free");
      setQuestionsAskedCount(tutorData.questions_asked_count || 0);
    } else {
      // Create new profile dynamically for newly registered logging users
      const defaultConfig = {
        childName: isOwner ? "Estudiante" : "Tomás",
        ageGroup: "8-10" as any,
        theme: "espacio",
        hasTdah: false,
        schoolName: isOwner ? "Sede Administrativa" : "Colegio Gabriel García Márquez",
        contactPhone: "+57 321 456 7890",
        childGrade: "3ro de Primaria",
        difficultSubject: "Matemáticas 📐",
      };
      setDemoConfig(defaultConfig);
      if (!isOwner) {
        await supabaseService.saveTutor({
          email,
          password: password || "123456",
          contact_phone: defaultConfig.contactPhone,
          school_name: defaultConfig.schoolName,
          has_tdah: defaultConfig.hasTdah,
          child_name: defaultConfig.childName,
          child_age: defaultConfig.ageGroup,
          child_grade: defaultConfig.childGrade,
          difficult_subject: defaultConfig.difficultSubject,
          child_theme: defaultConfig.theme,
          active_plan: "free",
          questions_asked_count: 0,
          stars_earned: 25
        });
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setActivePlan("free");
    setQuestionsAskedCount(0);
    setActiveWorkspaceTab("student");
    localStorage.removeItem("focuskid_is_logged_in");
    localStorage.removeItem("focuskid_user_email");
    localStorage.removeItem("focuskid_active_plan");
    localStorage.removeItem("focuskid_questions_asked_count");
    setDemoConfig({
      childName: "amiguito",
      ageGroup: "8-10",
      theme: "espacio",
      hasTdah: false,
      schoolName: "",
      contactPhone: "",
      childGrade: "3ro de Primaria",
      difficultSubject: "Matemáticas 📐",
    });
  };

  const handlePaymentSuccess = async () => {
    setActivePlan("premium");
    setIsCheckoutOpen(false);
    
    if (userEmail && userEmail.toLowerCase() !== getSuperAdminEmail()) {
      await supabaseService.saveTutor({
        email: userEmail,
        contact_phone: demoConfig.contactPhone,
        school_name: demoConfig.schoolName,
        has_tdah: demoConfig.hasTdah,
        child_name: demoConfig.childName,
        child_age: demoConfig.ageGroup,
        child_grade: demoConfig.childGrade,
        difficult_subject: demoConfig.difficultSubject,
        child_theme: demoConfig.theme,
        active_plan: "premium",
        questions_asked_count: questionsAskedCount,
        stars_earned: 25 + (questionsAskedCount * 5)
      });
    }
  };

  // Debounced auto-save effect triggered when config, plan or questions change
  React.useEffect(() => {
    if (!isLoggedIn || !userEmail || userEmail.toLowerCase() === getSuperAdminEmail()) return;

    const timer = setTimeout(() => {
      supabaseService.saveTutor({
        email: userEmail,
        contact_phone: demoConfig.contactPhone,
        school_name: demoConfig.schoolName,
        has_tdah: demoConfig.hasTdah,
        child_name: demoConfig.childName,
        child_age: demoConfig.ageGroup,
        child_grade: demoConfig.childGrade,
        difficult_subject: demoConfig.difficultSubject,
        child_theme: demoConfig.theme,
        active_plan: activePlan,
        questions_asked_count: questionsAskedCount,
        stars_earned: 25 + (questionsAskedCount * 5)
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [demoConfig, activePlan, questionsAskedCount, isLoggedIn, userEmail]);

  if (isLoggedIn && activeWorkspaceTab === "student") {
    return (
      <div className="min-h-screen w-screen overflow-hidden bg-[#FFFBEB] antialiased">
        <InteractiveTutor
          demoConfig={demoConfig}
          isLoggedIn={isLoggedIn}
          activePlan={activePlan}
          onUpgradePrompt={() => setIsCheckoutOpen(true)}
          questionsAskedCount={questionsAskedCount}
          setQuestionsAskedCount={setQuestionsAskedCount}
          userEmail={userEmail}
          isFullscreen={true}
          onOpenParentGate={() => {
            handleSwitchTab("parent");
          }}
        />

        {/* Chunky Kid-Friendly Checkout Modal for subscribing to the premium plan */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Security Shield Parental Gate Modal */}
        {parentGateOpen && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
            <div className="bg-white rounded-[32px] border-8 border-indigo-600 p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
              <div className="w-16 h-16 rounded-full bg-indigo-50 border-4 border-indigo-500 mx-auto flex items-center justify-center text-3xl select-none">
                🔒
              </div>
              
              <div className="space-y-1.5 text-left">
                <h3 className="font-extrabold text-lg text-slate-900 text-center">Zona Parental Segura</h3>
                <p className="text-slate-500 text-[11px] font-semibold leading-relaxed text-center">
                  ¡Zona restringida! Resuelve la multiplicación o escribe el PIN para verificar que eres tutor:
                </p>
              </div>

              <div className="bg-indigo-50 p-3 border-2 border-indigo-200 rounded-2xl select-none">
                <div className="text-sm font-black text-indigo-950">
                  ¿Cuánto es: 7 x 8?
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                  PIN de tutor: <span className="text-indigo-600 font-extrabold">1234</span>
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const trimmed = parentGateInput.trim();
                  if (trimmed === "1234" || trimmed === "56") {
                    setIsParentUnlocked(true);
                    setParentGateOpen(false);
                    if (parentGateTarget) {
                      setActiveWorkspaceTab(parentGateTarget);
                    } else {
                      setActiveWorkspaceTab("parent");
                    }
                    setParentGateInput("");
                    setParentGateError("");
                  } else if (trimmed === "") {
                    setParentGateError("Por favor, ingresa una respuesta.");
                  } else {
                    setParentGateError("¡Código o respuesta incorrecta!");
                  }
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  value={parentGateInput}
                  onChange={(e) => setParentGateInput(e.target.value)}
                  placeholder="Escribe 56 o el PIN 1234..."
                  className="w-full bg-slate-50 border-4 border-slate-200 focus:border-indigo-600 text-center rounded-2xl px-4 py-2.5 text-xs font-bold outline-none text-slate-800"
                  autoFocus
                />

                {parentGateError && (
                  <p className="text-xs text-rose-600 font-extrabold text-center">
                    ⚠️ {parentGateError}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setParentGateOpen(false);
                      setParentGateInput("");
                      setParentGateError("");
                    }}
                    className="flex-1 py-2.5 bg-slate-105 hover:bg-slate-200 text-[#1E293B] border-2 border-slate-300 rounded-xl text-[10px] font-black transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Volver al Chat
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white border-2 border-indigo-800 rounded-xl text-[10px] font-black transition-all cursor-pointer shadow-md uppercase tracking-wider"
                  >
                    Verificar ➡️
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden">
      
      {/* Dynamic responsive navigation panel */}
      <Header
        onOpenAuth={handleOpenAuth}
        activeSection={activeSection}
        onNavigate={handleScrollToSection}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogout={handleLogout}
        activeWorkspaceTab={activeWorkspaceTab}
      />

      <main className="flex-grow">
        
        {!isLoggedIn ? (
          // PRESENTATION / INFORMATIONAL LANDING PAGE MODE
          <div className="animate-fade-in divide-y divide-slate-100">
            {/* Banner with interactive personalization controls */}
            <Hero
              demoConfig={demoConfig}
              setDemoConfig={setDemoConfig}
              onScrollToSection={handleScrollToSection}
            />

            {/* Feature grid detailing kid study features */}
            <Features />

            {/* Interactive subscription schemes & family savings builder */}
            <Pricing 
              onOpenAuth={handleOpenAuth}
              isLoggedIn={isLoggedIn}
              activePlan={activePlan}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
            />

            {/* FAQ Accordion answering parents friction questions */}
            <FAQ />
          </div>
        ) : (
          // CONNECTED MEMBER WORKSPACE (TUTOR IA & PARENTS DASHBOARD SEGMENTS)
          <div className="bg-slate-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* Member Welcome Badge & Rewards Recap */}
              <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-[#3B82F6] text-white rounded-[40px] p-8 sm:p-10 shadow-xl border-4 border-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-2.5 text-left z-10">
                  {userEmail.toLowerCase() === getSuperAdminEmail() ? (
                    <>
                      <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block border-2 border-white shadow-sm">
                        👑 ACCESO OWNER SUPERADMIN MASTER
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                        ¡Bienvenido, Propietario Felipe! 👑
                      </h2>
                      <p className="text-indigo-100 text-sm font-semibold max-w-xl">
                        Has ingresado con el correo maestro <strong className="text-white underline">{userEmail}</strong>. Tienes control corporativo total del negocio, métricas de retención y membresías.
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="bg-white/20 border border-white/30 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
                        CONEXIÓN ACTIVA DE CONFIANZA 🛡️
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                        ¡Qué gusto verte, familia de {demoConfig.childName || "amiguito"}! 👋
                      </h2>
                      <p className="text-indigo-100 text-sm font-semibold max-w-xl">
                        Has ingresado con <strong className="text-white underline">{userEmail}</strong>. Usa las pestañas táctiles de abajo para alternar de forma inmediata entre el espacio del niño y tus controles de tutor.
                      </p>
                    </>
                  )}


                </div>

                {userEmail.toLowerCase() === getSuperAdminEmail() ? (
                  <div className="flex items-center gap-4 shrink-0 z-10">
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-4.5 rounded-[24px] text-center shadow-lg">
                      <span className="block text-2xl font-black text-amber-300">👑 MASTER</span>
                      <span className="text-[10px] uppercase tracking-widest text-indigo-100 font-extrabold">Rol Corporativo</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-4.5 rounded-[24px] text-center shadow-lg">
                      <span className="block text-2xl font-black text-emerald-300 uppercase">PRO LIMITLESS</span>
                      <span className="text-[10px] uppercase tracking-widest text-indigo-100 font-extrabold">Control Global</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 shrink-0 z-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4.5 rounded-[24px] text-center shadow-lg">
                      <span className="block text-3xl font-black text-amber-300">⭐ {25 + (questionsAskedCount * 5)}</span>
                      <span className="text-[10px] uppercase tracking-widest text-[#DBEAFE] font-black">Estrellas Ganadas</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4.5 rounded-[24px] text-center shadow-lg">
                      <span className="block text-3xl font-black text-emerald-300 uppercase">{activePlan === "premium" ? "PRO" : "FREE"}</span>
                      <span className="text-[10px] uppercase tracking-widest text-[#DBEAFE] font-black">Plan de Cuenta</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chunky Family Switches - Hidden for SuperAdmin to isolate business operations completely */}
              {userEmail.toLowerCase() !== getSuperAdminEmail() && (
                <div className="flex flex-wrap md:flex-nowrap border-4 border-slate-300 p-2 rounded-[32px] bg-white max-w-2xl mx-auto shadow-md gap-2 md:gap-0">
                  <button
                    onClick={() => handleSwitchTab("student")}
                    className={`flex-1 min-w-[140px] py-3.5 rounded-[24px] font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeWorkspaceTab === "student"
                        ? "bg-[#3B82F6] text-white shadow-lg scale-[1.01]"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    👦 Niño (Modo Enfoque)
                  </button>
                  <button
                    onClick={() => handleSwitchTab("parent")}
                    className={`flex-1 min-w-[140px] py-3.5 rounded-[24px] font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeWorkspaceTab === "parent"
                        ? "bg-[#1E293B] text-white shadow-lg scale-[1.01]"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    📊 Padre (Tutor)
                  </button>
                </div>
              )}

              {/* Interactive workspace elements */}
              <div className="transition-all duration-300">
                {activeWorkspaceTab === "student" && (
                  <div className="space-y-12">
                    {/* Live Playground conectado a Gemini API */}
                    <InteractiveTutor 
                      demoConfig={demoConfig}
                      isLoggedIn={isLoggedIn}
                      activePlan={activePlan}
                      onUpgradePrompt={() => setIsCheckoutOpen(true)}
                      questionsAskedCount={questionsAskedCount}
                      setQuestionsAskedCount={setQuestionsAskedCount}
                      userEmail={userEmail}
                    />

                    {/* Dynamic Study Habits quiz mapping kids answers */}
                    <StudyQuiz />
                  </div>
                )}
                {activeWorkspaceTab === "parent" && (
                  <ParentDashboard
                    demoConfig={demoConfig}
                    setDemoConfig={setDemoConfig}
                    activePlan={activePlan}
                    onUpgradeClick={() => setIsCheckoutOpen(true)}
                    questionsAskedCount={questionsAskedCount}
                  />
                )}
                {activeWorkspaceTab === "admin" && (
                  <SuperAdminDashboard
                    currentEmail={userEmail}
                    isLoggedIn={isLoggedIn}
                    activePlan={activePlan}
                    questionsAskedCount={questionsAskedCount}
                  />
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Corporate footer, newsletter, legal rules (COPPA) */}
      <Footer onNavigate={handleScrollToSection} />

      {/* Multi-step high-fidelity registration/login portal overlay */}
      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onRegisterSuccess={handleRegisterSuccess}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Chunky Kid-Friendly Checkout Modal for subscribing to the premium plan */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Security Shield Parental Gate Modal */}
      {parentGateOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[32px] border-8 border-indigo-600 p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-indigo-50 border-4 border-indigo-500 mx-auto flex items-center justify-center text-4xl">
              🔒
            </div>
            
            <div className="space-y-2">
              <h3 className="font-extrabold text-2xl text-slate-900">Control de Seguridad Parental</h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                ¡Zona restringida para adultos! Resuelve la trivia matemática o digita el <strong>PIN de Tutor</strong> para verificar tu identidad:
              </p>
            </div>

            <div className="bg-indigo-50 p-4 border-2 border-indigo-200 rounded-2xl">
              <div className="text-sm font-black text-indigo-950 mb-1">
                ¿Cuánto es: 7 x 8?
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                o escribe el PIN de tutor: <strong className="text-indigo-600">1234</strong>
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = parentGateInput.trim();
                if (trimmed === "1234" || trimmed === "56") {
                  setIsParentUnlocked(true);
                  setParentGateOpen(false);
                  if (parentGateTarget) {
                    setActiveWorkspaceTab(parentGateTarget);
                  }
                  setParentGateInput("");
                  setParentGateError("");
                } else if (trimmed === "") {
                  setParentGateError("Por favor, ingresa una respuesta.");
                } else {
                  setParentGateError("¡Código o respuesta incorrecta! Inténtalo de nuevo.");
                }
              }}
              className="space-y-4"
            >
              <input
                type="text"
                value={parentGateInput}
                onChange={(e) => setParentGateInput(e.target.value)}
                placeholder="Escribe la respuesta (56) o el PIN (1234)..."
                className="w-full bg-slate-50 border-4 border-slate-200 focus:border-indigo-600 text-center rounded-2xl px-4 py-3 text-sm font-bold outline-none text-slate-800"
                autoFocus
              />

              {parentGateError && (
                <p className="text-rose-600 font-extrabold text-xs bg-rose-50 border-2 border-rose-300 py-2.5 px-3 rounded-xl">
                  ⚠️ {parentGateError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setParentGateOpen(false);
                    setParentGateTarget(null);
                    setParentGateInput("");
                    setParentGateError("");
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 border-4 border-slate-300 text-slate-700 font-bold rounded-2xl text-xs uppercase"
                >
                  Volver al Chat
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black border-4 border-indigo-800 shadow-[0_4px_0_#4338CA] active:translate-y-0.5 active:shadow-none rounded-2xl text-xs uppercase"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
