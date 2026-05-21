import React, { useState, useEffect } from "react";
import { X, CreditCard, Smartphone, Building, ShieldCheck, CheckCircle2, Loader2, Sparkles, Award } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

type PaymentMethod = "targeta" | "nequi" | "daviplata" | "pse";
type CheckoutStep = "details" | "pay" | "processing" | "success";

const COLOMBIA_BANKS = [
  "Bancolombia",
  "Banco de Bogotá",
  "Davivienda",
  "Nequi",
  "Daviplata",
  "Banco de Occidente",
  "BBVA Colombia",
  "Scotiabank Colpatria",
  "Itaú",
  "Banco Popular"
];

export default function CheckoutModal({ isOpen, onClose, onPaymentSuccess }: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>("details");
  const [method, setMethod] = useState<PaymentMethod>("nequi");
  
  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  
  const [phoneNequi, setPhoneNequi] = useState("");
  const [phoneDaviplata, setPhoneDaviplata] = useState("");
  const [pseBank, setPseBank] = useState("Bancolombia");
  const [pseEmail, setPseEmail] = useState("");
  const [pseName, setPseName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep("details");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartPayment = () => {
    setStep("pay");
  };

  const handleSubmitValue = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");
    
    // Simulate high-fidelity payment processing duration
    setTimeout(() => {
      setStep("success");
      onPaymentSuccess();
    }, 3200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[40px] border-8 border-[#F59E0B] shadow-[12px_12px_0_#FEF3C7] relative w-full max-w-lg overflow-hidden shrink-0">
        
        {/* Header Ribbon graphic */}
        <div className="h-4 bg-gradient-to-r from-[#F59E0B] via-[#3B82F6] to-[#10B981]" />

        {/* Close Button */}
        {step !== "processing" && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full border-4 border-slate-200 hover:border-slate-400 text-slate-500 hover:text-slate-800 bg-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5 font-black" />
          </button>
        )}

        <div className="p-6 sm:p-8">
          
          {/* STEP 1: RESUMEN DE COMPRA */}
          {step === "details" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="bg-[#FEF3C7] border-2 border-[#FBBF24] text-[#B45309] font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
                  🔒 COMPRA 100% SEGURA
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1E293B]">Adquiere FocusKid Premium</h3>
                <p className="text-slate-500 text-sm font-semibold max-w-sm mx-auto">
                  Dale a tu hijo preguntas e informes de progreso ilimitados para potenciar su aprendizaje diario.
                </p>
              </div>

              {/* Elegant pricing card breakdown */}
              <div className="bg-[#FFFBEB] rounded-[32px] border-4 border-[#F59E0B] p-6 shadow-inner space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-[#F59E0B] tracking-wider block">PLAN ACTIVADO 🌟</span>
                    <h4 className="font-black text-lg text-[#1E293B]">Súper Estudiante PRO</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-[#1E293B] block">15.000 COP</span>
                    <span className="text-[10px] font-bold text-slate-500 block">Cobro mensual único</span>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-[#FCD34D] pt-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <span className="text-emerald-500 font-extrabold">✓</span>
                    <span>Preguntas ilimitadas con Foli el Zorrito</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <span className="text-emerald-500 font-extrabold">✓</span>
                    <span>Reportes avanzados con IA para padres</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <span className="text-emerald-500 font-extrabold">✓</span>
                    <span>Pausas lúdicas activas y modo adaptado TDH</span>
                  </div>
                </div>
              </div>

              {/* Guarantees with small elements */}
              <div className="flex justify-around items-center py-1 bg-slate-50 rounded-2xl border-2 border-slate-100 text-[10px] text-slate-500 font-bold">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Cifrado SSL 256 bits</span>
                </div>
                <div>•</div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-[#F59E0B]" />
                  <span>Cancela cuando quieras</span>
                </div>
              </div>

              <button
                onClick={handleStartPayment}
                className="w-full py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black border-4 border-[#1D4ED8] shadow-[0_4px_0_#1D4ED8] active:translate-y-1 active:shadow-none rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceder al Pago Seguros 💳</span>
              </button>
            </div>
          )}

          {/* STEP 2: METODO DE PAGO Y FORMULARIO */}
          {step === "pay" && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-[#1E293B]">Elige tu Método de Pago</h3>
                <p className="text-slate-500 text-xs font-semibold">Consorcio de pagos autorizado de Colombia</p>
              </div>

              {/* Toggle platforms selector */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod("nequi")}
                  className={`p-2.5 rounded-2xl border-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    method === "nequi"
                      ? "border-[#E11D48] bg-rose-50 text-[#E11D48] shadow-[4px_4px_0_#FFE4E6]"
                      : "border-slate-200 hover:border-slate-300 text-slate-500"
                  }`}
                >
                  <Smartphone className="w-5 h-5 shrink-0" />
                  <span className="text-[10px] font-black uppercase">Nequi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("daviplata")}
                  className={`p-2.5 rounded-2xl border-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    method === "daviplata"
                      ? "border-[#EF4444] bg-red-50 text-[#EF4444] shadow-[4px_4px_0_#FEE2E2]"
                      : "border-slate-200 hover:border-slate-300 text-slate-500"
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="text-[10px] font-black uppercase">Daviplata</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("pse")}
                  className={`p-2.5 rounded-2xl border-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    method === "pse"
                      ? "border-[#0284C7] bg-sky-50 text-[#0284C7] shadow-[4px_4px_0_#E0F2FE]"
                      : "border-slate-200 hover:border-slate-300 text-slate-500"
                  }`}
                >
                  <Building className="w-5 h-5 text-sky-600 shrink-0" />
                  <span className="text-[10px] font-black uppercase">PSE</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("targeta")}
                  className={`p-2.5 rounded-2xl border-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    method === "targeta"
                      ? "border-[#4F46E5] bg-indigo-50 text-[#4F46E5] shadow-[4px_4px_0_#E0E7FF]"
                      : "border-slate-200 hover:border-slate-300 text-slate-500 text-slate-500"
                  }`}
                >
                  <CreditCard className="w-5 h-5 shrink-0" />
                  <span className="text-[10px] font-black uppercase">Tarjeta</span>
                </button>
              </div>

              {/* Form integration */}
              <form onSubmit={handleSubmitValue} className="space-y-4 pt-2">
                {method === "nequi" && (
                  <div className="space-y-3.5 bg-rose-50/50 p-4 rounded-3xl border-2 border-[#E11D48]/30">
                    <span className="text-[10px] font-black text-[#E11D48] tracking-widest block uppercase">📱 PAGO SEGURO NEQUI COLOMBIA</span>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Celular Cuenta Nequi:</label>
                      <input
                        type="tel"
                        required
                        value={phoneNequi}
                        onChange={(e) => setPhoneNequi(e.target.value)}
                        placeholder="Ej: 300 1234567"
                        className="w-full p-3 bg-white border-4 border-slate-200 focus:border-[#E11D48] outline-none rounded-2xl text-sm font-semibold text-[#1E293B]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold leading-normal">
                      * Al presionar "Pagar", te enviaremos una notificación push a tu aplicación Nequi para que autorices el cobro por 15.000 COP en tu celular.
                    </p>
                  </div>
                )}

                {method === "daviplata" && (
                  <div className="space-y-3.5 bg-red-50/50 p-4 rounded-3xl border-2 border-red-200">
                    <span className="text-[10px] font-black text-[#EF4444] tracking-widest block uppercase">📱 PAGO EFECTIVO DAVIPLATA</span>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Número de Celular DaviPlata:</label>
                      <input
                        type="tel"
                        required
                        value={phoneDaviplata}
                        onChange={(e) => setPhoneDaviplata(e.target.value)}
                        placeholder="Ej: 315 9876543"
                        className="w-full p-3 bg-white border-4 border-slate-200 focus:border-red-400 outline-none rounded-2xl text-sm font-semibold text-[#1E293B]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold leading-normal">
                      * Recibirás un mensaje de texto de DaviPlata con el código PIN para confirmar la transferencia segura por su saldo.
                    </p>
                  </div>
                )}

                {method === "pse" && (
                  <div className="space-y-3.5 bg-sky-50/50 p-4 rounded-3xl border-2 border-sky-200">
                    <span className="text-[10px] font-black text-[#0284C7] tracking-widest block uppercase">🏦 INTERFAZ INTEGRADA PSE</span>
                    
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Nombre Completo Titular:</label>
                      <input
                        type="text"
                        required
                        value={pseName}
                        onChange={(e) => setPseName(e.target.value)}
                        placeholder="Gabriel García"
                        className="w-full p-2.5 bg-white border-2 border-slate-200 focus:border-sky-400 outline-none rounded-xl text-xs font-semibold text-[#1E293B]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Banco Emisor:</label>
                        <select
                          value={pseBank}
                          onChange={(e) => setPseBank(e.target.value)}
                          className="w-full bg-white border-2 border-slate-200 focus:border-sky-400 outline-none p-2.5 rounded-xl text-[11px] font-bold text-slate-800"
                        >
                          {COLOMBIA_BANKS.map((bank, index) => (
                            <option key={index} value={bank}>{bank}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">E-mail registrado (PSE):</label>
                        <input
                          type="email"
                          required
                          value={pseEmail}
                          onChange={(e) => setPseEmail(e.target.value)}
                          placeholder="tucorreo@pse.co"
                          className="w-full p-2.5 bg-white border-2 border-slate-200 focus:border-sky-400 outline-none rounded-xl text-xs font-semibold text-[#1E293B]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {method === "targeta" && (
                  <div className="space-y-3 bg-indigo-50/50 p-4 rounded-3xl border-2 border-indigo-200">
                    <span className="text-[10px] font-black text-[#4F46E5] tracking-widest block uppercase">💳 TARGETAS DE CRÉDITO / DÉBITO</span>
                    
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Nombre en la tarjeta:</label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="EJ: CARLOS GOMEZ"
                        className="w-full p-2.5 bg-white border-2 border-slate-200 focus:border-indigo-400 outline-none rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Número de tarjeta:</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4111 2222 3333 4444"
                        className="w-full p-2.5 bg-white border-2 border-slate-200 focus:border-indigo-400 outline-none rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Expiración (MM/AA):</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full p-2.5 bg-white border-2 border-slate-200 focus:border-indigo-400 outline-none rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">CVV / Código:</label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          className="w-full p-2.5 bg-white border-2 border-slate-200 focus:border-indigo-400 outline-none rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 font-extrabold rounded-2xl text-[11px] text-slate-600 transition-all cursor-pointer text-center"
                  >
                    Regresar
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3.5 bg-[#10B981] hover:bg-[#059669] text-white font-black border-4 border-[#047857] shadow-[0_4px_0_#047857] active:translate-y-0.5 active:shadow-none rounded-2xl text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Pagar 15.000 COP ⚡</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: PROCESSING */}
          {step === "processing" && (
            <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center animate-pulse">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-[#F59E0B] animate-spin" />
                <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="bg-[#FFE4E6] text-[#E11D48] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                  Cargando Transacción
                </span>
                <h4 className="font-black text-xl text-[#1E293B]">Foli está contando las monedas con cuidado... 🦊👛</h4>
                <p className="text-slate-500 text-xs font-medium max-w-xs mx-auto">
                  Estamos contactando de forma segura al proveedor bancario oficial en Colombia. Por favor, no recargues la pantalla.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS RECEIPT */}
          {step === "success" && (
            <div className="space-y-6 text-center animate-fade-in py-2">
              <div className="w-16 h-16 rounded-full bg-[#D1FAE5] border-4 border-[#10B981] flex items-center justify-center mx-auto text-[#10B981] animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1.5">
                <span className="bg-[#D1FAE5] text-[#065F46] border border-[#10B981] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                  🎉 ¡TRANSACCIÓN EXITOSA!
                </span>
                <h3 className="text-2xl font-black text-[#1E293B]">¡Gracias por tu Confianza!</h3>
                <p className="text-slate-500 text-xs font-semibold">
                  Tu suscripción a **FocusKid PRO** ha sido activada de forma inmediata.
                </p>
              </div>

              {/* High-fidelity receipt summary */}
              <div className="bg-[#F8FAFC] border-4 border-dashed border-slate-300 rounded-3xl p-5 text-left text-xs font-bold text-slate-700 space-y-2">
                <div className="text-center font-black text-[#64748B] text-[10px] uppercase tracking-widest border-b border-dashed border-slate-300 pb-2 mb-2">
                  RECIBO DE TRANSACCIÓN OFICIAL
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Concepto:</span>
                  <span className="text-[#1E293B]">FocusKid Premium Mensual 🌟</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Total Pagado:</span>
                  <span className="text-emerald-600 font-extrabold">15.000 COP</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Medio Autorizado:</span>
                  <span className="text-slate-800 uppercase">{method}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Código de Autorización:</span>
                  <span className="font-mono text-slate-800">AUTH-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Próxima Facturación:</span>
                  <span className="text-[#3B82F6]">En 30 Días</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">
                Hemos enviado una factura en pdf a tu e-mail de registro tutor. Los cargos se verán reflejados como "FocusKid IA SAS".
              </p>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-4 bg-[#1E293B] hover:bg-slate-800 text-white font-black rounded-full border-4 border-[#1E293B] text-sm transition-all cursor-pointer shadow-md"
              >
                ¡Comenzar a Disfrutar Premium! 🌠
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
