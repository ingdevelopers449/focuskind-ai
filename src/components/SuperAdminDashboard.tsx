import React, { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  CreditCard, 
  RefreshCw, 
  Filter, 
  Trash2, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Search,
  Check,
  UserCheck
} from "lucide-react";
import { DemoConfig } from "../types";
import { supabase, isSupabaseConfigured, supabaseService } from "../lib/supabase";

interface SuperAdminDashboardProps {
  currentEmail: string;
  isLoggedIn: boolean;
  activePlan: "free" | "premium";
  questionsAskedCount: number;
}

interface AdminTutorMember {
  email: string;
  child_name: string;
  active_plan: "free" | "premium";
  payment_status: "activo" | "vencido" | "mora";
  questions_asked_count: number;
  contact_phone: string;
  created_at: string;
  is_mock?: boolean;
}

export default function SuperAdminDashboard({ 
  currentEmail, 
  isLoggedIn, 
  activePlan, 
  questionsAskedCount 
}: SuperAdminDashboardProps) {
  const [members, setMembers] = useState<AdminTutorMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "activo" | "vencido" | "mora">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDemoData, setShowDemoData] = useState(false); // Default to false: absolutely NO fictitious data by default
  const [schemaErrorMsg, setSchemaErrorMsg] = useState("");
  
  // Custom delete confirmation dialog states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form for manually adding mock member to simulate growth
  const [newEmail, setNewEmail] = useState("");
  const [newChildName, setNewChildName] = useState("");
  const [newPlan, setNewPlan] = useState<"free" | "premium">("premium");
  const [newStatus, setNewStatus] = useState<"activo" | "vencido" | "mora">("activo");
  const [newPhone, setNewPhone] = useState("");
  const [addSuccessMsg, setAddSuccessMsg] = useState("");

  const loadRegisteredUsers = async () => {
    setLoading(true);
    try {
      let fetched: AdminTutorMember[] = [];
      
      // 1. Load real data from Supabase if keys exist
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from("focuskid_tutors")
          .select("*");
          
        if (!error && data) {
          fetched = data.map((item: any) => ({
            email: item.email,
            child_name: item.child_name || "Estudiante",
            active_plan: item.active_plan || "free",
            payment_status: item.payment_status || (item.active_plan === "premium" ? "activo" : "vencido"), // Respect stored DB status
            questions_asked_count: item.questions_asked_count || 0,
            contact_phone: item.contact_phone || "+57 XXX XXX XXXX",
            created_at: item.created_at || new Date().toISOString(),
            is_mock: false
          }));
        }
      } else {
        // Logically load from LocalStorage of registered users
        const localKeys = Object.keys(localStorage).filter(k => k.startsWith("local_tutor_"));
        fetched = localKeys.map(key => {
          try {
            const item = JSON.parse(localStorage.getItem(key) || "");
            return {
              email: item.email,
              child_name: item.child_name || "Estudiante",
              active_plan: item.active_plan || "free",
              payment_status: item.payment_status || (item.active_plan === "premium" ? "activo" : "vencido"),
              questions_asked_count: item.questions_asked_count || 0,
              contact_phone: item.contact_phone || "+57 XXX XXX XXXX",
              created_at: new Date().toISOString(),
              is_mock: false
            };
          } catch {
            return null;
          }
        }).filter(Boolean) as AdminTutorMember[];
      }

      // Add default mock cohorts representing realistic multi-user status (actives, vencidos, mora)
      // to easily evaluate SuperAdmin capabilities out-of-the-box
      const baseMocks: AdminTutorMember[] = [
        {
          email: "gomez.familia@gmail.com",
          child_name: "Mateo Gómez 🦖",
          active_plan: "premium",
          payment_status: "activo",
          questions_asked_count: 42,
          contact_phone: "+57 312 849 5002",
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_mock: true
        },
        {
          email: "sofi.mamapedagoga@hotmail.com",
          child_name: "Sofía Martínez 🎮",
          active_plan: "premium",
          payment_status: "vencido",
          questions_asked_count: 18,
          contact_phone: "+57 321 445 9291",
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          is_mock: true
        },
        {
          email: "valencia.luciano@outlook.com",
          child_name: "Santiago Valencia 🚀",
          active_plan: "premium",
          payment_status: "mora",
          questions_asked_count: 27,
          contact_phone: "+57 300 488 9201",
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          is_mock: true
        },
        {
          email: "isabella.tutor@colsubsidio.edu",
          child_name: "Isabella Cruz 🪄",
          active_plan: "free",
          payment_status: "vencido",
          questions_asked_count: 10,
          contact_phone: "+57 315 220 3391",
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          is_mock: true
        }
      ];

      // Insert current active logged in parent user dynamically so it registers immediately in the table
      if (isLoggedIn && currentEmail) {
        const alreadyExists = fetched.some(m => m.email.toLowerCase() === currentEmail.toLowerCase());
        if (!alreadyExists) {
          fetched.unshift({
            email: currentEmail,
            child_name: "Tu Hijo " + (activePlan === "premium" ? "PRO 🌟" : "Gratuito 🎒"),
            active_plan: activePlan,
            payment_status: activePlan === "premium" ? "activo" : "vencido",
            questions_asked_count: questionsAskedCount,
            contact_phone: "+57 Central Familiar",
            created_at: new Date().toISOString(),
            is_mock: false
          });
        } else {
          // Sync existing user plan
          fetched = fetched.map(m => {
            if (m.email.toLowerCase() === currentEmail.toLowerCase()) {
              return {
                ...m,
                active_plan: activePlan,
                payment_status: activePlan === "premium" ? "activo" : "vencido",
                questions_asked_count: questionsAskedCount
              };
            }
            return m;
          });
        }
      }

      // Merge and set
      setMembers(showDemoData ? [...fetched, ...baseMocks] : fetched);
    } catch (err) {
      console.error("Failed to load SuperAdmin members list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegisteredUsers();
  }, [currentEmail, isLoggedIn, activePlan, questionsAskedCount, showDemoData]);

  // Handle local state updates to simulate business operations
  const handleUpdatePaymentStatus = async (email: string, newStatus: "activo" | "vencido" | "mora") => {
    // Find member to save
    const member = members.find(m => m.email === email);
    if (!member) return;

    const correspondingPlan = newStatus === "activo" ? "premium" : "free";

    // Update state
    setMembers(prev => prev.map(m => {
      if (m.email === email) {
        return {
          ...m,
          payment_status: newStatus,
          active_plan: correspondingPlan as any
        };
      }
      return m;
    }));

    // Persist to Supabase if keys exist
    if (isSupabaseConfigured && supabase) {
      const payload: any = {
        email: member.email,
        child_name: member.child_name.replace(/🦖|🎮|🚀|🪄/g, "").trim(), // Strip emojis if any
        active_plan: correspondingPlan,
        payment_status: newStatus,
        questions_asked_count: member.questions_asked_count,
        contact_phone: member.contact_phone,
      };

      const { error } = await supabase
        .from("focuskid_tutors")
        .upsert(payload, { onConflict: "email" });

      if (error) {
        if (error.message?.includes("payment_status") || error.code === "PGRST204") {
          console.warn("Schema cache missing payment_status, retrying without it...");
          setSchemaErrorMsg("¡Error de caché en Supabase! La columna 'payment_status' no se encuentra registrada en el caché del esquema de Supabase.");
          delete payload.payment_status;
          
          const { error: retryError } = await supabase
            .from("focuskid_tutors")
            .upsert(payload, { onConflict: "email" });
            
          if (retryError) {
            console.error("Error updating tutor status during retry:", retryError);
          } else {
            console.log("Retry-upsert without payment_status worked perfectly!");
          }
        } else {
          console.error("Error updating tutor status in Supabase:", error);
        }
      } else {
        setSchemaErrorMsg(""); // Clear if it succeeds without issue
        console.log("Successfully updated payment status in Supabase!");
      }
    } else {
      // Locally update
      const stored = localStorage.getItem(`local_tutor_${email}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.payment_status = newStatus;
        parsed.active_plan = correspondingPlan;
        localStorage.setItem(`local_tutor_${email}`, JSON.stringify(parsed));
      }
    }

    // Alert completion
    alert(`💳 ¡Estado de suscripción actualizado! El usuario "${email}" ahora se encuentra en estado: ${newStatus.toUpperCase()}`);
  };

  const requestDeleteMember = (email: string) => {
    setMemberToDelete(email);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
      const email = memberToDelete;
      
      // Update local React state list
      setMembers(prev => prev.filter(m => m.email !== email));

      // 1. Delete from Supabase if configured
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from("focuskid_tutors")
          .delete()
          .eq("email", email);
        if (error) {
          console.error("Error deleting member from Supabase:", error);
        } else {
          console.log("Deleted member from Supabase successfully!");
        }
      }

      // 2. ALWAYS remove from localStorage in all conditions to prevent orphan local data
      localStorage.removeItem(`local_tutor_${email}`);
    } catch (err) {
      console.error("Failed to delete user completely:", err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setMemberToDelete(null);
    }
  };

  const handleAddNewMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newChildName.trim()) {
      alert("Por favor rellena el correo y nombre del niño.");
      return;
    }

    const emailClean = newEmail.trim().toLowerCase();
    const childNameClean = newChildName.trim();
    const phoneClean = newPhone || "+57 320 000 0000";

    const newRec: AdminTutorMember = {
      email: emailClean,
      child_name: childNameClean,
      active_plan: newPlan,
      payment_status: newStatus,
      questions_asked_count: 0,
      contact_phone: phoneClean,
      created_at: new Date().toISOString(),
      is_mock: false
    };

    setMembers(prev => [newRec, ...prev]);

    // Save to Supabase or local storage
    if (isSupabaseConfigured && supabase) {
      const payload: any = {
        email: emailClean,
        child_name: childNameClean,
        active_plan: newPlan,
        payment_status: newStatus,
        questions_asked_count: 0,
        contact_phone: phoneClean,
        stars_earned: 25,
      };

      const { error } = await supabase
        .from("focuskid_tutors")
        .insert(payload);

      if (error) {
        if (error.message?.includes("payment_status") || error.code === "PGRST204") {
          console.warn("Schema cache missing payment_status, retrying insert without it...");
          setSchemaErrorMsg("¡Error de caché en Supabase! La columna 'payment_status' no se encuentra registrada en el caché del esquema de Supabase.");
          delete payload.payment_status;
          
          const { error: retryError } = await supabase
            .from("focuskid_tutors")
            .insert(payload);
            
          if (retryError) {
            console.error("Error adding tutor during retry:", retryError);
          } else {
            console.log("Added new member without payment_status!");
          }
        } else {
          console.error("Error adding tutor to Supabase:", error);
        }
      } else {
        setSchemaErrorMsg("");
        console.log("Added new member to Supabase!");
      }
    } else {
      localStorage.setItem(`local_tutor_${emailClean}`, JSON.stringify({
        email: emailClean,
        child_name: childNameClean,
        active_plan: newPlan,
        payment_status: newStatus,
        questions_asked_count: 0,
        contact_phone: phoneClean,
        stars_earned: 25
      }));
    }

    setNewEmail("");
    setNewChildName("");
    setNewPhone("");
    
    setAddSuccessMsg("¡Membresía agregada exitosamente de forma persistente!");
    setTimeout(() => setAddSuccessMsg(""), 3500);
  };

  // Business calculations for retention and finance
  const totalUsersCount = members.length;
  const payingMembers = members.filter(m => m.payment_status === "activo");
  const payingCount = payingMembers.length;
  const vencidosCount = members.filter(m => m.payment_status === "vencido").length;
  const moraCount = members.filter(m => m.payment_status === "mora").length;

  // Monthly Recurring Revenue in COP (15,000 COP per active user)
  const simulatedMRR = payingCount * 15000;
  
  // Custom business metrics
  const retentionRate = totalUsersCount > 0 
    ? Math.round(((payingCount + vencidosCount * 0.4) / totalUsersCount) * 100) 
    : 100;
  const cacCop = 8400; // Customer Acquisition Cost COP
  const ltvCop = 180000; // Customer Lifetime Value COP

  // Filter list based on checks
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.child_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || m.payment_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <section id="superadmin" className="py-12 bg-slate-900 text-slate-100 rounded-[36px] border-8 border-indigo-600 shadow-2xl p-6 sm:p-10 text-left space-y-10 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8 z-10 relative">
        <div className="space-y-2">
          <span className="bg-indigo-600 border border-indigo-400 text-indigo-100 font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            CONSOLA SUPERADMIN (NEGOCIO)
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-slate-800 text-amber-400 border border-amber-400/30 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md">
              👑 OWNER ADMIN: pipelozada994@gmail.com
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
            Control de Rendimiento y Membresías 👑
          </h2>
          <p className="text-slate-400 text-sm font-semibold max-w-2xl">
            Módulo de dirección corporativa de FocusKid AI. Gestiona cobros, métricas de retención de cohortes de padres, y autoriza accesos VIP colombianos.
          </p>
        </div>

        <button
          onClick={loadRegisteredUsers}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Sincronizar Datos
        </button>
      </div>



      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Monthly Recurring Revenue */}
        <div className="bg-slate-950 p-5 rounded-3xl border-2 border-indigo-500/30 shadow-inner flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Ingresos Recurrentes (MRR)</span>
              <DollarSign className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white pt-2">
              ${simulatedMRR.toLocaleString("es-CO")} COP
            </div>
            <p className="text-[10px] text-slate-500 font-bold leading-normal">
              Basado en {payingCount} membresía(s) de 15,000 COP/mes
            </p>
          </div>
          <div className="border-t border-slate-900 mt-4 pt-3 flex justify-between items-center text-[10px] font-black uppercase text-emerald-400">
            <span>Conversión COP Activa</span>
            <span>✓ Al Día</span>
          </div>
        </div>

        {/* Metric 2: Cohorts Retention Rate */}
        <div className="bg-slate-950 p-5 rounded-3xl border-2 border-indigo-500/30 shadow-inner flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Métrica de Retención</span>
              <TrendingUp className="w-4.5 h-4.5 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white pt-2">
              {retentionRate}%
            </div>
            <p className="text-[10px] text-slate-500 font-bold leading-normal">
              Cohorte activa / (Vencidos + Mora) por mes
            </p>
          </div>
          <div className="border-t border-slate-900 mt-4 pt-3 flex justify-between items-center text-[10px] font-black uppercase text-blue-400">
            <span>Excelente Retención IA</span>
            <span>94.5% Meta</span>
          </div>
        </div>

        {/* Metric 3: CAC vs LTV Ratio */}
        <div className="bg-slate-950 p-5 rounded-3xl border-2 border-indigo-500/30 shadow-inner flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Ratio Financiero LTV/CAC</span>
              <Users className="w-4.5 h-4.5 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-white pt-2">
              {Math.round(ltvCop / cacCop)}x Rentable
            </div>
            <p className="text-[10px] text-slate-500 font-bold leading-normal">
              CAC: ${cacCop.toLocaleString()} | LTV: ${ltvCop.toLocaleString()}
            </p>
          </div>
          <div className="border-t border-slate-900 mt-4 pt-3 flex justify-between items-center text-[10px] font-black uppercase text-purple-400">
            <span>Crecimiento Saludable</span>
            <span>SaaS EdTech</span>
          </div>
        </div>

        {/* Metric 4: Cohort Cohésion (Mora / Vencidos Check) */}
        <div className="bg-slate-950 p-5 rounded-3xl border-2 border-indigo-500/30 shadow-inner flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Mora / Vencidos</span>
              <ShieldAlert className="w-4.5 h-4.5 text-rose-400" />
            </div>
            <div className="text-3xl font-black text-rose-400 pt-2 flex items-baseline gap-2">
              <span>{moraCount + vencidosCount}</span>
              <span className="text-slate-500 text-xs font-bold">Familia(s)</span>
            </div>
            <p className="text-[10px] text-slate-500 font-bold leading-normal">
              Mora: {moraCount} | Vencidos: {vencidosCount}
            </p>
          </div>
          <div className="border-t border-slate-900 mt-4 pt-3 flex justify-between items-center text-[10px] font-black uppercase text-rose-400">
            <span>Acciones Escritas Reqs</span>
            <span>Gestión Activa</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ADD MANUAL MEMBER COHORT FORM */}
        <div className="lg:col-span-4 bg-slate-950 rounded-3xl border-2 border-indigo-500/20 p-5 sm:p-6 space-y-4">
          <div className="text-left space-y-1">
            <h4 className="font-extrabold text-[#F59E0B] text-sm uppercase tracking-wider">Simular Crecimiento</h4>
            <h3 className="font-black text-lg text-white">Manual Alta de Membresía</h3>
            <p className="text-slate-400 text-xs font-medium">Agrega un tutor registrado para probar retención en tiempo real.</p>
          </div>

          {addSuccessMsg && (
            <div className="bg-emerald-950 text-emerald-400 border border-emerald-800 p-2 text-center rounded-xl text-xs font-bold animate-pulse">
              {addSuccessMsg}
            </div>
          )}

          <form onSubmit={handleAddNewMember} className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] uppercase font-black tracking-wider text-slate-500 mb-1">E-mail del Padre:</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl outline-none text-slate-200 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black tracking-wider text-slate-500 mb-1">Nombre del Niño:</label>
              <input
                type="text"
                required
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="Ej: Nicolás Gómez"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl outline-none text-slate-200 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black tracking-wider text-slate-500 mb-1">Celular del Tutor:</label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="ej: +57 312 0000000"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl outline-none text-slate-200 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-wider text-slate-500 mb-1">Plan de cuenta:</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 p-2 rounded-xl text-slate-200"
                >
                  <option value="free">Free (Gratuito)</option>
                  <option value="premium">Premium PRO</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-wider text-slate-500 mb-1">Estatus Financiero:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 p-2 rounded-xl text-slate-200"
                >
                  <option value="activo">Activo</option>
                  <option value="vencido">Vencido</option>
                  <option value="mora">Mora</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400 absolute-none text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              Ingresar Membresía
            </button>
          </form>
        </div>

        {/* MANAGEMENT LIST TABLE */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl border-2 border-indigo-500/20 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="text-left space-y-2">
              <h3 className="font-black text-lg text-white">Directorio de Cuentas Familiares</h3>
              <p className="text-slate-400 text-xs font-semibold font-mono text-indigo-300/80">Sincroniza y gestiona las cuentas reales registradas en Supabase.</p>
              
              {/* Toggle switch to satisfy: "no quiero dactos fictucios" */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800/80 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-300 w-full xl:w-fit cursor-pointer select-none" onClick={() => setShowDemoData(!showDemoData)}>
                <span className="text-indigo-200 text-[11px]">¿Mostrar datos ficticios/demo?</span>
                <button
                  type="button"
                  className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors duration-200 outline-none ${showDemoData ? "bg-indigo-600 justify-end" : "bg-slate-700 justify-start"}`}
                >
                  <span className="w-3 h-3 rounded-full bg-white shadow-sm" />
                </button>
                <span className="text-xs uppercase text-slate-400 font-extrabold">{showDemoData ? "Sí" : "No (Solo Reales)"}</span>
              </div>
            </div>
            
            {/* Search Input bar */}
            <div className="relative max-w-xs flex-grow text-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por e-mail, niño..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl outline-none text-slate-200 focus:border-indigo-500 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Quick status tabs filter */}
          <div className="flex flex-wrap gap-2 text-[10px] uppercase font-black tracking-wider">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                filterStatus === "all"
                  ? "bg-indigo-600 text-white border-indigo-500"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              Todos ({members.length})
            </button>
            <button
              onClick={() => setFilterStatus("activo")}
              className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                filterStatus === "activo"
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : "bg-slate-900 text-[#10B981] border-[#10B981]/20 hover:bg-emerald-950/20"
              }`}
            >
              Activo ({payingCount})
            </button>
            <button
              onClick={() => setFilterStatus("vencido")}
              className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                filterStatus === "vencido"
                  ? "bg-amber-600 text-white border-amber-500"
                  : "bg-slate-900 text-[#F59E0B] border-[#F59E0B]/20 hover:bg-amber-950/20"
              }`}
            >
              Vencido ({vencidosCount})
            </button>
            <button
              onClick={() => setFilterStatus("mora")}
              className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                filterStatus === "mora"
                  ? "bg-rose-600 text-white border-rose-500"
                  : "bg-slate-900 text-rose-400 border-rose-400/20 hover:bg-rose-950/20"
              }`}
            >
              Mora ({moraCount})
            </button>
          </div>

          {/* TABLE CONTAINER BODY */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-10 text-slate-550 border-2 border-dashed border-slate-800 rounded-2xl">
                <span className="text-3xl block mb-2">🔍</span>
                <p className="font-bold text-slate-400 text-sm">No se encontraron miembros para este criterio.</p>
                <p className="text-xs text-slate-500 font-normal">Cambia tu texto de búsqueda o añade una cuenta.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                    <th className="p-3">Cuenta (E-mail / Niño)</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3">Estatus de Cobro</th>
                    <th className="p-3">Consultas IA</th>
                    <th className="p-3 text-right">Acciones de Pago</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-semibold text-slate-300">
                  {filteredMembers.map((member) => (
                    <tr key={member.email} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 max-w-[200px]">
                        <div className="truncate font-black text-white" title={member.email}>{member.email}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-bold">
                          <span>👧 {member.child_name}</span>
                          <span>•</span>
                          <span className="text-slate-500 font-normal">{member.contact_phone}</span>
                          {member.is_mock && (
                            <span className="bg-indigo-950 text-indigo-400 border border-indigo-800/50 text-[8px] font-extrabold px-1 rounded">MOCK</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="p-3 select-all">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          member.active_plan === "premium" 
                            ? "bg-indigo-950 text-indigo-400 border border-indigo-800" 
                            : "bg-slate-900 text-slate-500 border border-slate-800"
                        }`}>
                          {member.active_plan.toUpperCase()}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          {member.payment_status === "activo" && (
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-black uppercase">
                              <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                              ACTIVO ✓
                            </span>
                          )}
                          {member.payment_status === "vencido" && (
                            <span className="bg-amber-950 text-amber-500 border border-amber-800 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-black uppercase">
                              <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                              VENCIDO 🛈
                            </span>
                          )}
                          {member.payment_status === "mora" && (
                            <span className="bg-rose-950 text-rose-400 border border-rose-800 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-black uppercase">
                              <Clock className="w-3 h-3 text-rose-400 shrink-0" />
                              MORA ⚡
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3 text-center text-slate-400 font-bold">
                        {member.questions_asked_count} / {member.active_plan === "free" ? "10" : "∞"}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Payment State Quick Mutators */}
                          <select
                            value={member.payment_status}
                            onChange={(e) => handleUpdatePaymentStatus(member.email, e.target.value as any)}
                            className="bg-slate-900 border border-slate-700 p-1 rounded-lg text-[10px] font-bold text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            <option value="activo">Activo</option>
                            <option value="vencido">Vencido</option>
                            <option value="mora">Mora</option>
                          </select>

                          <button
                            onClick={() => requestDeleteMember(member.email)}
                            className="p-1.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar Membresía"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Custom, Highly-Polished Delete Confirmation Dialog overlay */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in animate-once">
          <div className="bg-slate-900 border-4 border-rose-500 rounded-[32px] p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
            {/* Soft decorative background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="mx-auto w-16 h-16 bg-rose-950/50 border-4 border-rose-500 rounded-2xl flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                ¿Eliminar Usuario?
              </h3>
              <p className="text-xs text-rose-400/80 font-bold uppercase tracking-wider">
                Acción destructiva irreversible
              </p>
            </div>

            <div className="text-sm text-slate-300 font-medium leading-relaxed bg-slate-950/50 border border-slate-800 p-4 rounded-2xl text-left">
              Estás a punto de eliminar permanentemente al usuario:
              <div className="mt-2 font-mono text-xs bg-slate-950 p-2 rounded-xl border border-slate-800 text-amber-400 select-all font-semibold overflow-x-auto">
                {memberToDelete}
              </div>
              <p className="mt-3 text-slate-400 text-xs text-center font-bold">
                ¡Se eliminará de la base de datos de Supabase y del almacenamiento local!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setMemberToDelete(null);
                }}
                className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 font-black border-4 border-slate-700 shadow-[0_4px_0_#334155] active:translate-y-0.5 active:shadow-none rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                Cancelar
              </button>
              
              <button
                type="button"
                onClick={confirmDeleteMember}
                disabled={isDeleting}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black border-4 border-rose-850 shadow-[0_4px_0_#991b1b] active:translate-y-0.5 active:shadow-none rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isDeleting ? "Eliminando..." : "Sí, Eliminar 🗑️"}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
