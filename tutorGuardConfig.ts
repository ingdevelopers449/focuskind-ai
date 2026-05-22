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
  }
];
