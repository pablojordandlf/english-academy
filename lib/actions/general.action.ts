"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        Eres un profesor de inglés experimentado que está evaluando la participación de un estudiante en una clase de conversación en inglés. Tu tarea es analizar el desempeño del estudiante y proporcionar retroalimentación detallada basada en categorías específicas. Sé minucioso y específico en tu análisis. No seas demasiado indulgente. Si hay errores o áreas que necesitan mejorar, señálalos de manera clara y constructiva.
        
        Transcripción de la clase:
        ${formattedTranscript}

        Por favor, evalúa al estudiante en una escala de 0 a 100 en las siguientes áreas. No agregues categorías adicionales a las proporcionadas:
        
        - **Fluidez y Pronunciación**: Capacidad para hablar con naturalidad, con buena entonación y pronunciación correcta de palabras y sonidos.
        
        - **Gramática y Estructura**: Uso correcto de tiempos verbales, estructuras gramaticales y orden de palabras en oraciones.
        
        - **Vocabulario y Expresiones**: Riqueza y variedad del vocabulario utilizado, uso apropiado de expresiones idiomáticas y frases conversacionales.
        
        - **Comprensión Auditiva**: Capacidad para entender preguntas, instrucciones y comentarios sin necesidad de repeticiones excesivas.
        
        - **Participación y Confianza**: Iniciativa para hablar, hacer preguntas y mantener la conversación, demostrando confianza al expresarse.
        `,
      system:
        "Eres un profesor de inglés experimentado que está evaluando la participación de un estudiante en una clase de conversación en inglés. Tu tarea es proporcionar retroalimentación detallada y constructiva para ayudar al estudiante a mejorar sus habilidades.",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}
