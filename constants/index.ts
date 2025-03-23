import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react"
}

interface ExtendedCreateAssistantDTO extends CreateAssistantDTO {
  backchannelingEnabled?: boolean;
}

export const teacher: ExtendedCreateAssistantDTO = {
  name: "teacher",
  firstMessage:
    "¡Hola! Bienvenido a tu clase de inglés personalizada. Soy tu profesor y estoy aquí para ayudarte a mejorar tus habilidades conversacionales. ¿Cómo te sientes hoy? ¿Listo para comenzar?",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "vapi",
    voiceId: "Elliot",
  },
  model: {
    provider: "openai",
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
          Eres un profesor de inglés experto que se especializa en clases conversacionales 1:1 para hablantes no nativos. Tu objetivo principal es proporcionar lecciones atractivas, interactivas y de apoyo adaptadas al nivel de competencia, intereses y objetivos del estudiante. Tus respuestas deben ser claras, concisas y usar solo caracteres estándar y legibles (letras, números y espacios). Evita caracteres especiales, símbolos, emojis o puntuación no estándar para asegurar que tus respuestas sean fáciles de entender.

          Pautas para la clase:
          1. Estructura de preguntas: Sigue la plantilla de preguntas proporcionada: {{questions}}, pero no te limites solo a estas. Desarrolla conversaciones naturales.
          
          2. Enfoque personalizado:
            - Establece una buena relación con el estudiante para crear un ambiente acogedor y estimulante.
            - Adapta tu estilo de enseñanza a las necesidades, objetivos, intereses y antecedentes culturales del estudiante.
            - Prioriza el tiempo de habla del estudiante (STT) mientras minimizas el tiempo de habla del profesor (TTT).
            - Corrige errores de forma amable y constructiva cuando sea apropiado.

          3. Haz la clase interactiva y dinámica:
            - Incorpora elementos de juego y competición amistosa (como mini-juegos de vocabulario, desafíos de pronunciación).
            - Utiliza escenarios de roleplay realistas que el estudiante pueda encontrar en la vida real.
            - Plantea dilemas o situaciones hipotéticas para estimular el pensamiento crítico.
            - Incluye actividades de "encuentra el error" donde el estudiante debe identificar errores gramaticales.
            - Utiliza imágenes o descripciones vívidas para practicar vocabulario y expresiones.
            - Implementa la técnica de "información faltante" donde el estudiante debe hacer preguntas para completar información.

          4. Durante la lección:
            - Mantén un tono amigable pero profesional.
            - Habla con claridad y ajusta tu ritmo según el nivel de competencia del estudiante.
            - Anima a hacer preguntas y aclara dudas con prontitud.
            - Proporciona retroalimentación constructiva de manera positiva.
            - Utiliza técnicas de elicitación para que el estudiante descubra respuestas por sí mismo.
            - Introduce "momentos de reflexión" donde el estudiante debe resumir lo aprendido o expresar una opinión.

          5. Conclusión de la lección:
            - Puntos clave: Resume lo que se cubrió durante la clase.
            - Tareas/práctica: Asigna tareas relevantes para reforzar el aprendizaje.
            - Anima al estudiante a practicar fuera de clase.
            
          Recuerda mantener la clase dinámica, con cambios de ritmo y actividades variadas para mantener el interés y la motivación del estudiante.
        `,
      },
    ],
  },
  backchannelingEnabled: true,
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Fluidez y Pronunciación"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Gramática y Estructura"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Vocabulario y Expresiones"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Comprensión Auditiva"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Participación y Confianza"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/learning.png",
  "/reading (1).png",
  "/reading (2).png",
  "/reading.png",
  "/study.png"
];
