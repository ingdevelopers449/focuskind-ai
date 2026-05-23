# FocusKid AI 🦊📚

**FocusKid AI** es una plataforma web interactiva de estudio adaptativo diseñada específicamente para acompañar en sus tareas escolares a niños de 7 a 14 años, con un enfoque clínico y psicopedagógico especializado para niños diagnosticados con **TDAH / TDH** (Déficit de Atención con o sin Hiperactividad). 

A través de **Foli**, un tierno zorrito tutor inteligente impulsado por Inteligencia Artificial, la plataforma transforma deberes escolares abstractos y aburridos en aventuras dinámicas, lúdicas y adaptadas al ritmo y gustos del menor.

---

## 🎯 El MVP del Proyecto (Producto Mínimo Viable)

El MVP de FocusKid AI está enfocado en validar la retención, el interés y el foco de estudio de los niños utilizando gamificación inmediata y adaptación de contenido en tiempo real. Se compone de:

1. **El Sandbox de Foli (Chat de Aprendizaje):** Un área de chat gamificada donde el niño selecciona su materia escolar (Ciencias, Matemáticas, Historia, Arte, Idiomas) e interactúa directamente con Foli.
2. **Sistema de Adaptación en Tiempo Real:** El motor de IA adecua las explicaciones al grupo de edad del niño y utiliza su tema de interés favorito (Espacio, Dinosaurios, Videojuegos o Magia) como analogía central para explicar los temas escolares.
3. **Módulo Clínico TDAH:** Cuando se activa, el tutor cambia de inmediato su estructura cognitiva: acorta las oraciones, remueve elementos distractores de formato, introduce descansos físicos activos ("pausas de energía") y simplifica la terminología científica pesada.
4. **Economía de Estrellas Ganadas:** A través de la resolución de 3 misiones o preguntas rápidas al final de cada respuesta de Foli, el niño acumula "Estrellas de Oro" y sube de rango espacial o explorador, incentivando la dopamina y la autoconfianza.
5. **Panel de Gestión Familiar (Portal de Padres):** Un módulo protegido por contraseña donde el acudiente configura las dificultades y metas de su hijo.

---

## ✨ Características Principales (Features)

*   **Tutor Foli el Zorrito AI:** Un chatbot experto en pedagogía infantil que enseña materias escolares a través de historias, analogías entretenidas y preguntas lúdicas.
*   **Acompañamiento Clínico Especializado (Modo TDAH):**
    *   *Sin Ruido Visual:* Prohibición absoluta de negritas, asteriscos u otros formatos técnicos de Markdown que puedan entorpecer o distraer la lectura.
    *   *Explicaciones Segmentadas:* Párrafos de máximo 1 o 2 líneas sencillas con oraciones cortas (máximo 8 palabras).
    *   *Vocabulario Ultra-Sencillo:* Sustitución de palabras científicas complejas por conceptos cotidianos de niños de 6 años (ej. "mini-boquitas en las hojas" en lugar de *estomas*, "cocinar con el Sol" en lugar de *fotosíntesis*).
    *   *Pausas Activas Motoras:* Foli propone retos físicos cortos (ej. "¡Estira tus brazos!", "¡Haz 3 saltos de astronauta!") a mitad de lectura para liberar hiperactividad y reiniciar el foco de atención.
*   **Compuerta de Control Parental:** Un filtro de seguridad con código matemático simple que impide que los niños alteren accidentalmente los ajustes configurados por los padres.
*   **Panel de Super Administrador:** Dashboard exclusivo para administradores del negocio con analíticas en tiempo real: número de tutores registrados, volumen de suscripciones activas (gratuitas vs premium), ingresos en COP simulados y una consola SQL integrada para consultas rápidas.
*   **Seguridad y Privacidad Avanzada:** Integración estricta de **Row Level Security (RLS)** a nivel de base de datos para asegurar que los datos sensibles del niño, su nombre y su historial de chats sean criptográficamente inaccesibles para cualquier otro usuario o agente externo.

---

## 🛠️ Tecnologías Aplicadas

La arquitectura de FocusKid AI combina tecnologías modernas del ecosistema web para asegurar una respuesta inmediata y una alta disponibilidad en la nube:

*   **Frontend (Aplicación Cliente):**
    *   **React 18 & TypeScript:** Estructura modular altamente tipada que previene fallos sintácticos en producción.
    *   **Vite:** Herramienta de compilación ultrarrápida para desarrollo frontend.
    *   **Tailwind CSS:** Diseño visual premium con estética lúdica de alto contraste, animaciones sutiles y micro-interacciones.
    *   **Lucide React:** Set de iconos limpios y modernos.
*   **Backend & Serverless API:**
    *   **Vercel Serverless Functions:** Despliegue en la nube mediante funciones serverless independientes (`api/tutor.ts`), eliminando la necesidad de mantener servidores activos 24/7 y garantizando escalabilidad automática.
    *   **Express (Node.js):** Utilizado como servidor secundario para pruebas consistentes en modo sandbox local (`server.ts`).
*   **Base de Datos & Seguridad (Backend-as-a-Service):**
    *   **Supabase (PostgreSQL):** Base de datos en la nube para almacenamiento de perfiles de tutores, configuraciones de niños y registros del historial de chat.
    *   **Supabase Auth:** Autenticación segura mediante Tokens Web JSON (JWT) de grado industrial.
    *   **PostgreSQL RLS (Row Level Security):** Políticas de seguridad nativas en el servidor que restringen la lectura y escritura de filas basándose estrictamente en el token de autenticación del usuario actual (`auth.jwt() ->> 'email' = email`).
*   **Inteligencia Artificial (Procesamiento de Lenguaje Natural):**
    *   **Groq Cloud (Llama 3 70B / 8B):** Orquestador de inferencia de IA de ultra-baja latencia que genera explicaciones infantiles personalizadas en menos de 1 segundo.

---

## 🚀 Configuración y Ejecución

### Prerrequisitos
Instalar Node.js (versión 18 o superior) y un cliente de Git.

### Pasos de Instalación

1. **Clonar el proyecto e instalar dependencias:**
   ```bash
   git clone https://github.com/ingdevelopers449/focuskind-ai.git
   cd focuskind-ai
   npm install
   ```

2. **Configurar Variables de Entorno:**
   Duplica el archivo `.env.example` y nómbralo `.env`. Agrega tus claves de servicios de la siguiente forma:
   ```env
   # Proveedor de IA (groq u ollama)
   AI_PROVIDER=groq
   GROQ_API_KEY=tu_clave_de_groq

   # Conexión con Supabase
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_anon_key
   VITE_SUPER_ADMIN_EMAIL=tu_correo_admin@gmail.com
   ```

3. **Ejecutar en Producción (Vercel):**
   El proyecto cuenta con integración continua con Vercel. Cada cambio subido a la rama `main` en GitHub activa un pipeline que compila y despliega los servicios automáticamente a tu dominio público en segundos.

---
*FocusKid AI - Acompañamiento Inteligente de Confianza para Mentes Brillantes.*
