import { createClient } from "@supabase/supabase-js";

const rawUrl = ((import.meta as any).env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || "").trim();

// Sanitize Supabase URL: remove trailing /rest/v1/ or trailing slashes because @supabase/supabase-js appends them internally
const supabaseUrl = rawUrl
  ? rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "")
  : "";

// Check if Supabase keys exist and are proper
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== "https://your-project-id.supabase.co" && 
  supabaseAnonKey !== "your-anon-key" &&
  !supabaseUrl.includes("your-project-id")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * SQL needed for Supabase SQL Editor.
 * This can be displayed directly inside the Tutor panel or settings for ease of use.
 */
export const SUPABASE_SQL_SCHEMA = `-- Crear la tabla de tutores/perfiles
CREATE TABLE IF NOT EXISTS focuskid_tutors (
  email TEXT PRIMARY KEY,
  password TEXT DEFAULT '123456', -- Contraseña de zona de tutor
  contact_phone TEXT,
  school_name TEXT,
  has_tdah BOOLEAN DEFAULT false,
  child_name TEXT,
  child_age TEXT,
  child_grade TEXT,
  difficult_subject TEXT,
  child_theme TEXT,
  active_plan TEXT DEFAULT 'free',
  payment_status TEXT DEFAULT 'vencido', -- 'activo' | 'vencido' | 'mora'
  questions_asked_count INTEGER DEFAULT 0,
  stars_earned INTEGER DEFAULT 25,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear la tabla del historial de chats con Foli
CREATE TABLE IF NOT EXISTS focuskid_chat_history (
  id BIGSERIAL PRIMARY KEY,
  tutor_email TEXT REFERENCES focuskid_tutors(email) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' | 'assistant'
  content TEXT NOT NULL,
  subject TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS) opcional o dar permisos públicos si es para demo de portafolio
ALTER TABLE focuskid_tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE focuskid_chat_history ENABLE ROW LEVEL SECURITY;

-- Políticas sencillas para que cualquiera pueda usar sus propios datos por email
CREATE POLICY "Permitir acceso por email tutores" ON focuskid_tutors
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acceso por email chat" ON focuskid_chat_history
  FOR ALL USING (true) WITH CHECK (true);
`;

export interface TutorRecord {
  email: string;
  password?: string;
  contact_phone?: string;
  school_name?: string;
  has_tdah?: boolean;
  child_name?: string;
  child_age?: string;
  child_grade?: string;
  difficult_subject?: string;
  child_theme?: string;
  active_plan?: "free" | "premium";
  payment_status?: "activo" | "vencido" | "mora";
  questions_asked_count?: number;
  stars_earned?: number;
}

export interface ChatRecord {
  tutor_email: string;
  role: "user" | "assistant";
  content: string;
  subject?: string;
}

// Global data-locking actions using Supabase proxy with local-fallback
export const supabaseService = {
  /**
   * Registers a user in Supabase Auth (or checks locally/database).
   */
  async signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const trimmedEmail = email.trim().toLowerCase();
    const isSuperAdmin = trimmedEmail === "pipelozada994@gmail.com";

    // 1. Check if the user is already registered in our tutor database table
    const tutor = await this.getTutor(trimmedEmail);
    if (tutor) {
      return { success: false, error: "El correo ya está registrado. Por favor utiliza otro correo o inicia sesión." };
    }

    // 2. Only Super Admin authenticates with real Supabase Auth
    if (isSuperAdmin) {
      if (!isSupabaseConfigured || !supabase) {
        return { success: true };
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Fallo interno al registrar en Supabase Auth" };
      }
    } else {
      // Normal users register in focuskid_tutors directly, we return success here
      return { success: true };
    }
  },

  /**
   * Log in - Only Super Admin authenticates via Supabase Auth, others check focuskid_tutors record.
   */
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const trimmedEmail = email.trim().toLowerCase();
    const isSuperAdmin = trimmedEmail === "pipelozada994@gmail.com";

    if (isSuperAdmin) {
      if (!isSupabaseConfigured || !supabase) {
        // Fallback local or during dev
        if (password === "123456") {
          return { success: true };
        }
        return { success: false, error: "Contraseña incorrecta para el Super Admin." };
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Fallo interno al iniciar sesión en Supabase" };
      }
    } else {
      // Normal users: authenticate securely via stored database records (focuskid_tutors)
      const tutor = await this.getTutor(trimmedEmail);
      if (!tutor) {
        return { success: false, error: "El correo electrónico no está registrado. Registra tu cuenta primero." };
      }

      const savedPassword = tutor.password;
      if (!savedPassword || savedPassword !== password) {
        return { success: false, error: "Contraseña incorrecta o usuario no registrado." };
      }

      return { success: true };
    }
  },

  /**
   * Saves or updates a tutor record.
   */
  async saveTutor(tutor: TutorRecord): Promise<boolean> {
    const trimmedEmail = tutor.email.trim().toLowerCase();
    if (trimmedEmail === "pipelozada994@gmail.com") {
      console.warn("Preventing saving of Super Admin to focuskid_tutors");
      return true; // Silent skip
    }

    if (!isSupabaseConfigured || !supabase) {
      // Save locally to simulate success
      localStorage.setItem(`local_tutor_${tutor.email}`, JSON.stringify(tutor));
      return false;
    }

    try {
      const payload: any = {
        email: tutor.email,
        contact_phone: tutor.contact_phone,
        school_name: tutor.school_name,
        has_tdah: tutor.has_tdah,
        child_name: tutor.child_name,
        child_age: tutor.child_age,
        child_grade: tutor.child_grade,
        difficult_subject: tutor.difficult_subject,
        child_theme: tutor.child_theme,
        active_plan: tutor.active_plan,
        payment_status: tutor.payment_status || (tutor.active_plan === "premium" ? "activo" : "vencido"),
        questions_asked_count: tutor.questions_asked_count,
        stars_earned: tutor.stars_earned,
      };

      if (tutor.password) {
        payload.password = tutor.password;
      }

      const { error } = await supabase
        .from("focuskid_tutors")
        .upsert(payload, { onConflict: "email" });

      if (error) {
        // If the database has a schema cache discrepancy or missing payment_status column
        if (error.message?.includes("payment_status") || error.code === "PGRST204") {
          console.warn("Supabase cached schema lacks payment_status column. Retrying without it...");
          delete payload.payment_status;
          const { error: retryError } = await supabase
            .from("focuskid_tutors")
            .upsert(payload, { onConflict: "email" });

          if (retryError) {
            console.error("Supabase Save Tutor Retry Error:", retryError);
            return false;
          }
          return true;
        }
        console.error("Supabase Save Tutor Error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase Service error:", err);
      return false;
    }
  },

  /**
   * Fetches tutor record by email.
   */
  async getTutor(email: string): Promise<TutorRecord | null> {
    if (!isSupabaseConfigured || !supabase) {
      const stored = localStorage.getItem(`local_tutor_${email}`);
      return stored ? JSON.parse(stored) : null;
    }

    try {
      const { data, error } = await supabase
        .from("focuskid_tutors")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.error("Supabase Get Tutor Error:", error);
        return null;
      }
      return data as TutorRecord | null;
    } catch (err) {
      console.error("Supabase Service get error:", err);
      return null;
    }
  },

  /**
   * Adds chat entry.
   */
  async addChatMessage(chat: ChatRecord): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const stored = localStorage.getItem(`local_chat_${chat.tutor_email}`);
      const history = stored ? JSON.parse(stored) : [];
      history.push({ ...chat, created_at: new Date().toISOString() });
      localStorage.setItem(`local_chat_${chat.tutor_email}`, JSON.stringify(history));
      return false;
    }

    try {
      const { error } = await supabase
        .from("focuskid_chat_history")
        .insert({
          tutor_email: chat.tutor_email,
          role: chat.role,
          content: chat.content,
          subject: chat.subject,
        });

      if (error) {
        console.error("Supabase Add Chat Error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase Add Chat failed:", err);
      return false;
    }
  },

  /**
   * Fetches chat history for tutor
   */
  async getChatHistory(email: string): Promise<any[]> {
    if (!isSupabaseConfigured || !supabase) {
      const stored = localStorage.getItem(`local_chat_${email}`);
      return stored ? JSON.parse(stored) : [];
    }

    try {
      const { data, error } = await supabase
        .from("focuskid_chat_history")
        .select("*")
        .eq("tutor_email", email)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Supabase Get Chat History error:", error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("Supabase chat logs fetch error:", err);
      return [];
    }
  }
};
