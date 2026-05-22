export interface GuardRule {
  keywords: string[];
  response: string;
  suggestedTasks: string[];
}

/**
 * REGLAS DE BLOQUEO Y REDIRECCIÓN PARA FOCUSKID IA
 * Puedes añadir nuevas palabras clave o respuestas aquí sin alterar la lógica del servidor principal.
 */
export const TUTOR_GUARD_RULES: GuardRule[] = [
  {
    keywords: [
      "minecraft", "roblox", "fortnite", "gta", "free fire", "brawl stars",
      "zelda", "playstation", "xbox", "nintendo", "videojuego", "videojuegos",
      "consola", "consolas", "gamer", "gamers", "jugar"
    ],
    response: "¡Los videojuegos son súper divertidos y creativos! 🎮 Pero justo ahora estamos activados en el **Modo Enfoque** para terminar tus deberes escolares. ¿Qué te parece si resolvemos ese reto de estudio primero y sumamos puntos de experiencia aquí? Dime, ¿en qué ejercicio o materia vas hoy?",
    suggestedTasks: ["¡Sí, vamos a estudiar! 🧠", "Ayúdame con mi tarea 📝", "Hazme una trivia rápida ⚡"]
  },
  {
    keywords: [
      "twitch", "tiktok", "instagram", "youtube", "streamer", "streamers",
      "influencer", "influencers", "facebook", "meme", "memes", "chisme",
      "chismes", "famoso", "famosos", "redes sociales"
    ],
    response: "¡Esa es una excelente pregunta para tu tiempo libre! 🌟 En este momento, mi superpoder es ayudarte a estudiar y mantener tu mente súper enfocada. Cuéntame, ¿estás repasando algo de Ciencias, Matemáticas o Lenguaje hoy?",
    suggestedTasks: ["¡Vamos con Matemáticas! 📐", "Prefiero Ciencias Naturales 🔬", "Quiero ver mis tareas 📝"]
  },
  {
    keywords: [
      "olvida que eres", "se mi amigo", "sé mi amigo", "chiste sobre juguetes",
      "olvida tu rol", "cambia tu rol", "deja de ser"
    ],
    response: "Sigo siendo tu tutor FocusKid IA y mi misión sagrada es ayudarte a cumplir tus metas de hoy de la forma más divertida y mágica. 🌟 ¡Mantengamos el enfoque! ¿Quieres que hagamos un juego rápido de preguntas sobre el tema escolar que estás estudiando hoy?",
    suggestedTasks: ["¡Sí, hagamos el juego! ⚡", "Explícame un concepto 🔬", "Dame consejos de estudio 🧠"]
  },
  {
    "keywords": [
      "ignora", "ignorar", "olvida", "forget", "ignore", "override", "borra", "reset", "instrucciones previas", "prior instructions", "previous instructions"
    ],
    "response": "¡Tu mente va a mil por hora! 🚀 Pero recuerda que estamos en el **Modo Enfoque** y no puedo borrar mi misión de ayudarte a estudiar. ¿Qué te parece si dejamos los trucos de magia para el recreo y nos concentramos en lo que tienes pendiente hoy?",
    "suggestedTasks": ["¡Hacer tarea de Matemáticas! 📐", "Revisar Ciencias Naturales 🔬", "Ver mis materias 📝"]
  },
  {
    "keywords": [
      "desarrollador", "developer", "modo desarrollador", "developer mode", "admin", "administrador", "root", "system prompt", "plantilla", "template", "variables", "configuracion"
    ],
    "response": "¡Vaya, investigas como un verdadero ingeniero de sistemas! 💻 Sin embargo, mi sistema operativo está bloqueado en modo tutor de estudio. ¡Vamos a usar esa gran inteligencia para resolver tus deberes de hoy!",
    "suggestedTasks": ["Resolver problemas de Lógica 🧠", "Repasar Geografía 🌍", "Ver mis tareas 📝"]
  },
  {
    "keywords": [
      "repite", "repeat", "reproduce", "copia", "copy", "escribe exactamente", "say the following", "di lo siguiente"
    ],
    "response": "¡Me encanta jugar al eco! 🗣️ Pero en este momento prefiero que hagamos eco de lo que estás aprendiendo en el colegio. ¿Qué materia te toca repasar hoy?",
    "suggestedTasks": ["¡Vamos con Lenguaje! 📖", "Prefiero Historia ⏳", "Revisar mis pendientes 📝"]
  },
  {
    "keywords": [
      "pretende", "pretend", "actua como", "act as", "simula", "roleplay", "abuela", "cuentame un cuento", "juego de rol", "personaje"
    ],
    "response": "¡Qué gran imaginación tienes! 🎭 Cambiar de personaje es súper divertido, pero hoy mi papel favorito es ser tu tutor de FocusKid IA. ¡Hagamos equipo para terminar la escuela primero!",
    "suggestedTasks": ["Estudiar Ciencias 🔬", "Practicar Matemáticas 📐", "Ver mi lista de estudio 📝"]
  },
  {
    "keywords": [
      "codigo", "code", "python", "javascript", "html", "script", "print", "exec", "ejecuta", "programar"
    ],
    "response": "¡Programar es un superpoder increíble! ⚡ Si estás estudiando tecnología o informática escolar, podemos hablar de ello. Si no, regresemos a nuestra misión principal en el **Modo Enfoque**.",
    "suggestedTasks": ["Estudiar Tecnología 💻", "Hacer Matemáticas 📐", "Quiero ver mis tareas 📝"]
  },
  {
    "keywords": [
      "secreto", "secret", "contraseña", "password", "historial", "history", "datos", "data", "token"
    ],
    "response": "¡Un buen detective nunca revela sus secretos! 🕵️‍♂️ Mi único gran secreto es cómo hacer que el estudio sea más fácil para ti. ¿Te ayudo con alguna pregunta de la escuela?",
    "suggestedTasks": ["¡Preguntas de Historia! ⏳", "Desafío de Matemáticas 🔢", "Ver mis tareas 📝"]
  }


];
