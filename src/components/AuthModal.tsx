import React, { useState } from "react";
import { X, Sparkles, Star, Trophy, Mail, Lock, User, Smile, ShieldCheck, Heart, Phone, School, GraduationCap, Brain, Eye, EyeOff } from "lucide-react";
import { AgeGroup } from "../types";
import { supabaseService, getSuperAdminEmail } from "../lib/supabase";

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "login" | "register";
  onRegisterSuccess?: (data: {
    email: string;
    password?: string;
    contactPhone: string;
    schoolName: string;
    hasTdah: boolean;
    childName: string;
    childAge: AgeGroup;
    childGrade: string;
    difficultSubject: string;
    childTheme: string;
  }) => void;
  onLoginSuccess?: (email: string, password?: string) => void;
}

export default function AuthModal({ isOpen, onClose, initialMode, onRegisterSuccess, onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);
  const [step, setStep] = useState(1);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setStep(1);
      setForgotError("");
      setForgotSuccess(false);
    }
  }, [initialMode, isOpen]);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess(false);

    if (!forgotEmail.trim()) {
      setForgotError("¡Por favor ingresa tu correo electrónico!");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await supabaseService.sendPasswordResetEmail(forgotEmail);
      if (result.success) {
        setForgotSuccess(true);
      } else {
        setForgotError(result.error || "No pudimos enviar el correo de recuperación.");
      }
    } catch (err: any) {
      setForgotError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Custom user requested fields
  const [contactPhone, setContactPhone] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [hasTdah, setHasTdah] = useState(false);
  const [childGrade, setChildGrade] = useState("3ro de Primaria");
  const [difficultSubject, setDifficultSubject] = useState("Matemáticas 📐");

  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState<AgeGroup>("8-10");
  const [childTheme, setChildTheme] = useState("espacio");
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleRegisterNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    if (step === 1) {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();
      const trimmedConfirm = confirmPassword.trim();
      const trimmedPhone = contactPhone.trim();

      if (!trimmedEmail) {
        setRegisterError("¡Por favor ingresa el correo del tutor!");
        return;
      }
      if (!trimmedPhone) {
        setRegisterError("¡Por favor ingresa un número celular de contacto!");
        return;
      }
      if (!trimmedPassword || trimmedPassword.length < 6) {
        setRegisterError("¡La contraseña secreta debe tener por lo menos 6 caracteres!");
        return;
      }
      if (trimmedPassword !== trimmedConfirm) {
        setRegisterError("¡Las contraseñas no coinciden! Por favor verifícalas.");
        return;
      }

      setIsSubmitting(true);
      try {
        const existing = await supabaseService.getTutor(trimmedEmail);
        if (existing) {
          setRegisterError("¡El correo electrónico ya se encuentra registrado. Por favor utiliza un correo diferente u opta por iniciar sesión!");
          setIsSubmitting(false);
          return;
        }
        setStep(2);
      } catch (err) {
        console.error("Error al validar registro:", err);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (!childName.trim()) {
        setRegisterError("¡Por favor dinos el nombre de tu súper estudiante!");
        return;
      }
      if (!schoolName.trim()) {
        setRegisterError("¡Por favor dinos en qué escuela o colegio estudia!");
        return;
      }
      setIsDone(true);
      if (onRegisterSuccess) {
        onRegisterSuccess({
          email: email.trim().toLowerCase(),
          password: password.trim(),
          contactPhone,
          schoolName,
          hasTdah,
          childName,
          childAge,
          childGrade,
          difficultSubject,
          childTheme
        });
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setLoginError("¡Por favor ingresa tu correo y contraseña secreta!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Authenticate via Supabase Auth (or simulated check if Supabase is offline)
      const authResult = await supabaseService.signIn(trimmedEmail, trimmedPassword);
      
      if (!authResult.success) {
        setLoginError(authResult.error || "Contraseña secreta incorrecta o usuario no registrado.");
        return;
      }

      const isSuperAdmin = trimmedEmail === getSuperAdminEmail();

      if (isSuperAdmin) {
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess(trimmedEmail, trimmedPassword);
        }
      } else {
        setIsDone(true);
        if (onLoginSuccess) {
          onLoginSuccess(trimmedEmail, trimmedPassword);
        }
      }
    } catch (err) {
      console.error("Login verify error:", err);
      setLoginError("Fallo interno al verificar las credenciales.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setContactPhone("");
    setSchoolName("");
    setHasTdah(false);
    setChildName("");
    setChildAge("8-10");
    setChildGrade("3ro de Primaria");
    setDifficultSubject("Matemáticas 📐");
    setChildTheme("espacio");
    setStep(1);
    setIsDone(false);
    setLoginError("");
    setRegisterError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[40px] border-8 border-[#3B82F6] shadow-[12px_12px_0_#DBEAFE] relative w-full max-w-lg overflow-hidden shrink-0">
        
        {/* Header Ribbon graphic */}
        <div className="h-4 bg-gradient-to-r from-[#3B82F6] via-[#FBBF24] to-[#10B981]" />

        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-6 right-6 p-2 bg-white hover:bg-[#FEF3C7] text-[#1E293B] rounded-full border-4 border-[#1E293B] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          
          {!isDone ? (
            <div>
              {/* Login OR Register toggles */}
              {mode !== "forgot" && (
                <div className="flex gap-2 p-1.5 bg-[#FEF3C7] rounded-3xl w-fit mx-auto mb-6 border-4 border-[#F59E0B]">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setStep(1);
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      mode === "login"
                        ? "bg-[#3B82F6] text-white shadow-sm border-2 border-white"
                        : "text-[#B45309] hover:text-[#1E293B]"
                    }`}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setStep(1);
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      mode === "register"
                        ? "bg-[#10B981] text-white shadow-sm border-2 border-white"
                        : "text-[#B45309] hover:text-[#1E293B]"
                    }`}
                  >
                    Registrar Niño
                  </button>
                </div>
              )}

              {mode === "login" ? (
                /* LOGIN SCREEN */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-[#1E293B]">Bienvenido de Vuelta</h3>
                    <p className="text-[#64748B] text-xs font-semibold">Ingresa al Panel Familiar de Monitoreo</p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                        E-mail del Padre / Tutor:
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="papa@focuskid.com"
                          className="w-full pl-11 pr-4 py-3 bg-white border-4 border-slate-200 focus:border-[#3B82F6] outline-none rounded-2xl text-sm font-semibold text-[#1E293B] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                        Contraseña Secreta:
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-11 pr-12 py-3 bg-white border-4 border-slate-200 focus:border-[#3B82F6] outline-none rounded-2xl text-sm font-semibold text-[#1E293B] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                          title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {loginError && (
                    <div className="bg-rose-50 border-4 border-rose-300 text-rose-700 font-extrabold text-xs p-3 rounded-2xl text-center">
                      ⚠️ {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-4 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-slate-300 disabled:border-slate-400 text-white font-black border-4 border-[#1D4ED8] shadow-[0_4px_0_#1D4ED8] active:translate-y-0.5 active:shadow-none rounded-2xl tracking-wider uppercase text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isSubmitting ? "Verificando..." : "Ingresar a mi Cuenta 🛡️"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setForgotEmail(email); // autofill with whatever they typed
                      setForgotError("");
                      setForgotSuccess(false);
                    }}
                    className="w-full text-center text-xs text-[#3B82F6] hover:text-[#1D4ED8] font-black hover:underline focus:outline-none transition-colors cursor-pointer mt-3.5 block"
                  >
                    ¿Olvidaste tu contraseña? ¡Recupérala por correo aquí! 📧
                  </button>
                </form>
              ) : mode === "forgot" ? (
                /* PASSWORD RECOVERY FORM */
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-[#1E293B]">
                      Recuperar Contraseña 🔑
                    </h3>
                    <p className="text-[#64748B] text-xs font-semibold">
                      Ingresa tu correo para recibir un enlace seguro de restablecimiento
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                        E-mail de tu Cuenta:
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="papa@focuskid.com"
                          className="w-full pl-11 pr-4 py-3 bg-white border-4 border-slate-200 focus:border-[#3B82F6] outline-none rounded-2xl text-sm font-semibold text-[#1E293B] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {forgotError && (
                    <div className="bg-rose-50 border-4 border-rose-300 text-rose-700 font-extrabold text-xs p-3 rounded-2xl text-center">
                      ⚠️ {forgotError}
                    </div>
                  )}

                  {forgotSuccess && (
                    <div className="bg-emerald-50 border-4 border-emerald-300 text-emerald-700 font-extrabold text-xs p-3.5 rounded-2xl text-center space-y-1">
                      <p>✨ ¡Enlace enviado con éxito! ✨</p>
                      <p className="text-[10px] font-semibold text-emerald-600">Revisa tu correo para cambiar tu contraseña.</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-4 bg-[#10B981] hover:bg-[#059669] disabled:bg-slate-300 disabled:border-slate-400 text-white font-black border-4 border-[#047857] shadow-[0_4px_0_#047857] active:translate-y-0.5 active:shadow-none rounded-2xl tracking-wider uppercase text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isSubmitting ? "Enviando Enlace..." : "Enviar Enlace Seguro 📧"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setForgotError("");
                      setForgotSuccess(false);
                    }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs uppercase border-4 border-slate-300 shadow-[0_4px_0_#CBD5E1] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    Volver al Inicio de Sesión
                  </button>
                </form>
              ) : (
                /* MULTI-STEP CREATION WIZARD */
                <form onSubmit={handleRegisterNext} className="space-y-4">
                   <div className="text-center space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-[#1E293B]">
                      {step === 1 ? "Únete a la Aventura" : "Perfil del Súper Estudiante"}
                    </h3>
                    <p className="text-[#64748B] text-xs font-semibold">
                      {step === 1 ? "Paso 1: Registra al tutor responsable" : "Paso 2: Personaliza el rincón de juegos"}
                    </p>
                  </div>

                  {step === 1 ? (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                          E-mail del Padre / Tutor:
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="mama@focuskid.com"
                            className="w-full pl-11 pr-4 py-3 bg-white border-4 border-slate-200 focus:border-[#3B82F6] outline-none rounded-2xl text-sm font-semibold text-[#1E293B] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                          Número Celular de Contacto:
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type="tel"
                            required
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="Ej: +57 321 4567890"
                            className="w-full pl-11 pr-4 py-3 bg-white border-4 border-slate-200 focus:border-[#3B82F6] outline-none rounded-2xl text-sm font-semibold text-[#1E293B] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                          Contraseña de Acceso:
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            className="w-full pl-11 pr-12 py-3 bg-white border-4 border-slate-200 focus:border-[#3B82F6] outline-none rounded-2xl text-sm font-semibold text-[#1E293B] transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                          Confirmar Contraseña:
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repite tu contraseña"
                            className="w-full pl-11 pr-12 py-3 bg-white border-4 border-slate-200 focus:border-[#3B82F6] outline-none rounded-2xl text-sm font-semibold text-[#1E293B] transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                            title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                          ¿Cuál es el nombre de tu hijo/a?
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type="text"
                            required
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                            placeholder="Ej: Mateo"
                            className="w-full pl-11 pr-4 py-3 bg-white border-4 border-slate-200 focus:border-[#3B82F6] outline-none rounded-2xl text-sm font-semibold text-[#1E293B] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                          ¿En qué escuela o colegio se encuentra estudiando?
                        </label>
                        <div className="relative">
                          <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type="text"
                            required
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            placeholder="Ej: Gimnasio Campestre de Bogotá"
                            className="w-full pl-11 pr-4 py-3 bg-white border-4 border-slate-200 focus:border-[#3B82F6] outline-none rounded-2xl text-sm font-semibold text-[#1E293B] transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                            Rango de edad:
                          </label>
                          <select
                            value={childAge}
                            onChange={(e) => setChildAge(e.target.value as AgeGroup)}
                            className="w-full bg-[#FEF3C7] border-4 border-[#F59E0B] outline-none p-3 rounded-2xl text-xs font-black text-[#B45309]"
                          >
                            <option value="5-7">5 a 7 Años 🎒</option>
                            <option value="8-10">8 a 10 Años 📚</option>
                            <option value="11-13">11 a 13 Años 🧭</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                            Grado Escolar:
                          </label>
                          <select
                            value={childGrade}
                            onChange={(e) => setChildGrade(e.target.value)}
                            className="w-full bg-[#FEF3C7] border-4 border-[#F59E0B] outline-none p-3 rounded-2xl text-xs font-black text-[#B45309]"
                          >
                            <option value="1ro de Primaria">1ro de Primaria 🎒</option>
                            <option value="2do de Primaria">2do de Primaria 🎒</option>
                            <option value="3ro de Primaria">3ro de Primaria 📚</option>
                            <option value="4to de Primaria">4to de Primaria 📚</option>
                            <option value="5to de Primaria">5to de Primaria 🖋️</option>
                            <option value="6to de Primaria">6to de Primaria 🖋️</option>
                            <option value="Bachillerato (7mo - 9no)">Bachillerato (7°-9°) 🧭</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                            Asignatura más difícil:
                          </label>
                          <select
                            value={difficultSubject}
                            onChange={(e) => setDifficultSubject(e.target.value)}
                            className="w-full bg-[#FEF3C7] border-4 border-[#F59E0B] outline-none p-3 rounded-2xl text-xs font-black text-[#B45309]"
                          >
                            <option value="Matemáticas 📐">Matemáticas 📐</option>
                            <option value="Ciencias Naturales 🔬">Ciencias Naturales 🔬</option>
                            <option value="Historia y Geografía 🏰">Historia y Geografía 🏰</option>
                            <option value="Español y Lectura 🗣️">Español y Lectura 🗣️</option>
                            <option value="Inglés 🇬🇧">Inglés 🇬🇧</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                            Tema que le cautiva:
                          </label>
                          <select
                            value={childTheme}
                            onChange={(e) => setChildTheme(e.target.value)}
                            className="w-full bg-[#FEF3C7] border-4 border-[#F59E0B] outline-none p-3 rounded-2xl text-xs font-black text-[#B45309]"
                          >
                            <option value="espacio">Espacio Exterior 🚀</option>
                            <option value="dinosaurios">Rex Jurásico 🦖</option>
                            <option value="videojuegos">Mundo Bloques 🎮</option>
                            <option value="magia">Escuela de Hechicería 🪄</option>
                          </select>
                        </div>
                      </div>

                      {/* TDAH Warning / Setup Checkbox */}
                      <div className="bg-red-50 p-3.5 border-4 border-red-200 rounded-3xl flex items-start gap-2.5 mt-2">
                        <input
                          type="checkbox"
                          id="hasTdahCheck"
                          checked={hasTdah}
                          onChange={(e) => setHasTdah(e.target.checked)}
                          className="w-5 h-5 accent-red-600 mt-1 shrink-0 rounded border-2 border-red-300 cursor-pointer"
                        />
                        <label htmlFor="hasTdahCheck" className="text-[11px] text-red-800 font-bold leading-relaxed cursor-pointer select-none">
                          ¿El estudiante cuenta con diagnóstico o sospecha de TDH / TDAH? ⚡
                          <span className="block text-[10px] text-red-600 font-semibold mt-0.5 leading-snug">
                            Si se marca, el Zorrito Foli optimiza las explicaciones con micro-lecciones dinámicas, pausas lúdicas activas y reforzamiento hiperfocalizado.
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {registerError && (
                    <div className="bg-rose-50 border-4 border-rose-300 text-rose-700 font-extrabold text-xs p-3 rounded-2xl text-center">
                      ⚠️ {registerError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 mt-2 bg-[#10B981] hover:bg-[#059669] disabled:bg-slate-300 disabled:border-slate-400 text-white font-black border-4 border-[#047857] shadow-[0_4px_0_#047857] active:translate-y-0.5 active:shadow-none rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{isSubmitting ? "Procesando..." : (step === 1 ? "Siguiente Paso ➡️" : "¡Personalizar y Completar! ✨")}</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* SIMULATION SUCCESS PORTAL PANEL */
            <div className="text-center space-y-6 animate-fade-in py-4 max-h-[85vh] overflow-y-auto">
              <div className="w-20 h-20 bg-[#D1FAE5] text-[#10B981] rounded-full border-4 border-[#10B981] flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="bg-[#FEF3C7] border-2 border-[#F59E0B] text-[#B45309] text-[10px] font-black uppercase px-3 py-1.5 rounded-full tracking-wider inline-block animate-pulse">
                  ⭐ REGISTRO COMPLETADO EXITOSAMENTE ⭐
                </span>
                
                <h3 className="text-2xl font-black text-[#1E293B] tracking-tight">
                  {mode === "login" ? "¡Hola de Vuelta, Tutor!" : `¡Suscripción y Cuenta Creada!`}
                </h3>
                
                <p className="text-[#64748B] text-xs max-w-sm mx-auto font-semibold">
                  {mode === "login" 
                    ? "Bienvenido de nuevo al panel de control central para padres de FocusKid AI."
                    : `FocusKid AI ha creado el servidor lúdico exclusivo para ${childName || "tu hijo"} listo para optimizar su estudio.`
                  }
                </p>
              </div>

              {/* Display a simulated Kid Focus dashboard reports with Vibrant borders */}
              <div className="bg-[#FFFBEB] rounded-3xl p-5 border-4 border-[#3B82F6] text-left max-w-sm mx-auto space-y-3.5 shadow-inner">
                <span className="block text-center font-black text-xs text-[#3B82F6] uppercase tracking-wider">
                  🎯 EXPEDIENTE REGISTRADO:
                </span>
                
                <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-1.5 font-bold text-[#1E293B]">
                  <span className="text-slate-500">Estudiante:</span>
                  <span>{childName || "Amiguito"}</span>
                </div>

                <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-1.5 font-bold text-[#1E293B]">
                  <span className="text-slate-500">Escuela / Colegio:</span>
                  <span className="text-right max-w-[180px] truncate" title={schoolName}>{schoolName || "No indicada"}</span>
                </div>

                <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-1.5 font-bold text-[#1E293B]">
                  <span className="text-slate-500">Grado y Apoyo:</span>
                  <span>{childGrade} | {difficultSubject}</span>
                </div>

                <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-1.5 font-bold text-[#1E293B]">
                  <span className="text-slate-500">Enfoque Especial TDH:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    hasTdah ? "bg-red-100 text-red-800 border-2 border-red-200" : "bg-slate-100 text-slate-800"
                  }`}>
                    {hasTdah ? "SÍ (Optimizado) ⚡" : "Estándar 🛡️"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-1.5 font-bold text-[#1E293B]">
                  <span className="text-slate-500">Contacto Tutor:</span>
                  <span>{contactPhone || "No indicado"}</span>
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-[#1E293B]">
                  <span className="text-slate-500">Misión Especial:</span>
                  <span className="text-[#3B82F6] font-[#3B82F6] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    Foli el Zorrito 🦊 Activado
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-4 bg-[#1E293B] hover:bg-slate-800 text-white font-black rounded-full border-4 border-[#1E293B] text-sm transition-all cursor-pointer shadow-md"
                >
                  ¡Entendido, ir al Dashboard! 😉
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
