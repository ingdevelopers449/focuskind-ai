import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes
app.post("/api/tutor", async (req, res) => {
  try {
    const { 
      message, 
      ageGroup = "8-10", 
      childName = "amiguito", 
      subject = "general", 
      theme = "espacio",
      hasTdah = false,
      difficultSubject = ""
    } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "El mensaje es requerido y debe ser texto" });
      return;
    }

    // Determine tone guidelines depending on age
    let ageGuideline = "";
    if (ageGroup === "5-7") {
      ageGuideline = `El niño tiene entre 5 y 7 años. Explicación extremadamente simple, oraciones cortas, usa onomatopeyas graciosas (¡rum-rum!, ¡pum!), analogías con dulces, juguetes o animales. Mantén respuestas breves (máximo 3 párrafos cortos) y pon muchas caritas felices.`;
    } else if (ageGroup === "8-10") {
      ageGuideline = `El niño tiene entre 8 y 10 años. Usa analogías interesantes como inventores, magos de la naturaleza, tecnología o mundos de fantasía. Explicación interactiva y curiosa, vocabulario un poco más desarrollado pero 100% comprensible, oraciones animadas.`;
    } else { // 11-13
      ageGuideline = `El preadolescente tiene entre 11 y 13 años. Usa tono moderno de científico aventurero o entrenador de videojuegos. Trátalo con madurez y respeto pero de forma divertida e informal. Puedes hacer comparaciones con mecánicas de videojuegos o hacks de la vida real.`;
    }

    // Custom TDAH focus support prompt
    let tdahGuideline = "";
    if (hasTdah) {
      tdahGuideline = `
🚨 MODALIDAD DE ATENCIÓN DE APOYO ESPECIAL (TDAH / TDH):
El estudiante ${childName} tiene rasgos o diagnóstico de TDH / TDAH (Déficit de Atención con Hiperactividad). 
Para apoyarlo de manera efectiva y mantener su foco sin causarle fatiga cognitiva:
- Usa respuestas significativamente más breves, estructuradas y espaciadas.
- Evita párrafos corridos y densos. Emplea viñetas animadas y saltos de línea continuos.
- Incorpora pausas activas breves ("¡Haz un estiramiento de brazos rápido antes de leer el paso 2! 🙆‍♂️") y refuerzo positivo masivo ("¡Tu mente es veloz como la luz!", "¡Qué gran campeon/a eres al intentar esto!").
- Enfatiza palabras claves en negrita para facilitar un "escaneo visual" rápido.`;
    }

    // Difficult subject guideline
    let subjectGuideline = "";
    if (difficultSubject) {
      subjectGuideline = `Ten en cuenta que ${childName} considera la materia "${difficultSubject}" como su asignatura más difícil e intimidante. Bríndale paciencia extra, haz comparaciones sumamente amigables para quitar el miedo al fracaso, y celebra con excesivo entusiasmo su valentía para preguntar sobre esto.`;
    }

    const systemInstruction = `Eres "Foli", un zorrito sabio y súper amigable que ayuda a niños a aprender de forma adaptativa.
Tu misión es explicar conceptos de manera mágica, divertida y fácil de entender.
Guías adicionales:
1. Tu nombre es Foli. Háblale directamente a ${childName}.
2. El tema de interés especial del niño es: "${theme}". Utiliza metáforas o analogías basadas en este tema para explicar todo (por ejemplo, si el tema es "espacio", compara las sumas con planetas o la gravedad con naves espaciales).
3. ${ageGuideline}
4. ${tdahGuideline}
5. ${subjectGuideline}
6. Termina SIEMPRE sugiriendo EXACTAMENTE 3 mini-ejercicios sencillos, trivias o divertidas preguntas rápidas numeradas del 1 al 3 que ${childName} pueda responder para ganar puntos. Formatea estas 3 preguntas por separado para que el cliente pueda detectarlas, cada una empezando con "★ Pregunta [Número]:".
7. Mantén un formato visual súper limpio con saltos de línea y emojis vibrantes. No uses términos técnicos complejos sin explicarlos antes mágicamente como "poderes especiales".
8. Toda la conversación debe ser en idioma Español.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const botReply = response.text || "¡Ups! Foli se ha distraído un momento viendo una mariposa. ¿Podrías preguntarme otra vez?";
    
    // Simple extraction of the 3 questions if present
    const questions: string[] = [];
    const lines = botReply.split("\n");
    lines.forEach(line => {
      if (line.includes("★ Pregunta") || line.trim().match(/^[1-3]\.\s/)) {
        questions.push(line.replace(/★ Pregunta \d+:?\s*/, "").replace(/^\d+\.\s*/, "").trim());
      }
    });

    res.json({
      text: botReply,
      suggestedTasks: questions.slice(0, 3),
    });
  } catch (error: any) {
    console.error("Error in server/api/tutor:", error);
    
    let errorStr = "";
    if (error && typeof error === "object") {
      errorStr = JSON.stringify(error) + " " + (error.message || "");
    } else {
      errorStr = String(error);
    }

    let errorMessage = "Ocurrió un error al contactar al Zorrito Foli.";
    let errorDetail = error.message || String(error);

    const isDepleted = errorStr.toLowerCase().includes("prepayment credits") || 
                       errorStr.toLowerCase().includes("depleted") || 
                       errorStr.toLowerCase().includes("resource_exhausted") || 
                       errorStr.includes("429");

    if (isDepleted) {
      errorMessage = "⚠️ Los créditos de prepago se han agotado.";
      errorDetail = "Tus créditos en Google AI Studio están agotados. Por favor, ingresa a https://aistudio.google.com/ para recargar saldo de prepago o configurar tu facturación.";
    }

    res.status(500).json({
      error: errorMessage,
      detail: errorDetail
    });
  }
});

// Configure Vite middleware or static serving
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FocusKid AI Server is running on port ${PORT}`);
  });
};

startServer();
