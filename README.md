# FocusKid AI 📚

Portal interactivo de estudio adaptativo para niños con soporte para TDAH, impulsado por Inteligencia Artificial y sincronización en la nube mediante Supabase.

## Características 🌟
- **Tutor Interactivo Adaptativo (Zorrito Foli)**: Responde dudas, asigna retos y adecua las analogías de aprendizaje según los gustos del menor (espacio, dinosaurios, videojuegos, magia).
- **Enfoque Pedagógico TDAH**: Respuestas estructuradas, temporizadores de concentración y refuerzo positivo con estrellas ganadas.
- **Panel de Control Familiar (Padres)**: Monitoreo de progreso y personalización del ritmo escolar.
- **SuperAdmin Panel**: Control total del negocio, métricas de retención y administración de cuentas.

## Configuración y Ejecución Local 🛠️

**Prerrequisitos:** Node.js (v18+) y npm.

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar el entorno (.env):**
   Duplica el archivo `.env.example` como `.env` y configura tus claves:
   - `GROQ_API_KEY`: Clave de la API de Groq Cloud (Llama 3). Consíguela gratis en [console.groq.com](https://console.groq.com/).
   - `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`: Credenciales de tu base de datos de Supabase.

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Construir para producción:**
   ```bash
   npm run build
   ```

---
*FocusKid AI - Acompañamiento Inteligente de Confianza.*
