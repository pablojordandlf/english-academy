"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema, pronunciationFeedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    console.log(formattedTranscript);

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        Eres un profesor de inglés experimentado que está evaluando la participación de un estudiante en una clase de conversación en inglés. Tu tarea es analizar el desempeño del estudiante y proporcionar feedback detallado basado en categorías específicas. Sé minucioso y específico en tu análisis. Se realista. Si hay errores o áreas que necesitan mejorar, señálalos de manera clara y constructiva. Es muy importante que ayudes al estudiante a mejorar su inglés con comentarios específicos y ejemplos de errores que haya cometido durante la clase basandote en el transcript.

        Claves de la calificación: 
        - La calificación del estudiante debe ser entre 0 y 100, donde 0 es un nivel muy bajo y 100 es un nivel bilingüe.
        - Suspende al estudiante si crees que no el nivel de inglés es bajo.
        - Si el estudiante no participa en la conversación, suspenda al estudiante.


        Transcripción de la clase:
        ${formattedTranscript}

        Por favor, evalúa al estudiante en una escala de 0 a 100 en las siguientes áreas. No agregues categorías adicionales a las proporcionadas:
        
        - **Fluidez y Pronunciación**: Capacidad para hablar con naturalidad, con buena entonación y pronunciación correcta de palabras y sonidos. Añade ejemplos de errores y pronunciaciones correctas que haya cometido el estudiante en la clase basandote en el transcript.
        
        - **Gramática y Estructura**: Uso correcto de tiempos verbales, estructuras gramaticales y orden de palabras en oraciones. Añade ejemplos de errores y gramáticas correctas que haya cometido el estudiante en la clase basandote en el transcript.
        
        - **Vocabulario y Expresiones**: Riqueza y variedad del vocabulario utilizado, uso apropiado de expresiones idiomáticas y frases conversacionales. Añade ejemplos de errores y vocabulario correcto que haya cometido el estudiante en la clase basandote en el transcript.
        
        - **Comprensión Auditiva**: Capacidad para entender preguntas, instrucciones y comentarios sin necesidad de repeticiones excesivas. Añade ejemplos de errores y comprensión correcta que haya cometido el estudiante en la clase basandote en el transcript.
        
        - **Participación y Confianza**: Iniciativa para hablar, hacer preguntas y mantener la conversación, demostrando confianza al expresarse. Añade ejemplos de errores y participación y confianza correcta que haya cometido el estudiante en la clase basandote en   el transcript.
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


export async function createPronunciationFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    console.log(formattedTranscript);

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: pronunciationFeedbackSchema,
      prompt: `
        Eres un profesor de inglés experimentado que está evaluando la participación de un estudiante en una clase de pronunciación en inglés. Tu tarea es analizar el desempeño del estudiante y proporcionar feedback detallado basado en categorías específicas relacionadas con la pronunciación. Sé minucioso y específico en tu análisis. Sé realista. Si hay errores o áreas que necesitan mejorar, señálalos de manera clara y constructiva. Es muy importante que ayudes al estudiante a mejorar su pronunciación con comentarios específicos y ejemplos de errores que haya cometido durante la clase basándote en el transcript.

        Claves de la calificación:
        - La calificación del estudiante debe ser entre 0 y 100, donde 0 es un nivel muy bajo y 100 es un nivel bilingüe.
        - Suspende al estudiante si crees que su nivel de pronunciación es bajo.
        - Si el estudiante no participa en los ejercicios de pronunciación, suspende al estudiante.

        Transcripción de la clase:
        ${formattedTranscript}

        Por favor, evalúa al estudiante en una escala de 0 a 100 en las siguientes áreas. No agregues categorías adicionales a las proporcionadas:

        - **Pronunciación y Articulación**: Capacidad para pronunciar palabras correctamente, incluyendo sonidos individuales (vocales y consonantes), acentos, y entonación general. Añade ejemplos específicos de errores de pronunciación y cómo deberían ser corregidos basándote en el transcript.

        - **Claridad**: Claridad del habla del estudiante. Evalúa si las palabras son comprensibles para un oyente promedio y si hay problemas con la velocidad o pausas inapropiadas. Proporciona ejemplos específicos basándote en el transcript.

        - **Consistencia**: Capacidad para mantener una pronunciación adecuada a lo largo de toda la clase. Identifica patrones consistentes de errores o mejoras basándote en el transcript.

        - **Participación y Esfuerzo**: Iniciativa para repetir palabras o frases según las indicaciones del profesor, demostrando disposición para mejorar su pronunciación. Proporciona ejemplos específicos basándote en el transcript.
        `,
      system:
        "Eres un profesor de inglés experimentado que está evaluando la participación de un estudiante en una clase de pronunciación en inglés. Tu tarea es proporcionar retroalimentación detallada y constructiva para ayudar al estudiante a mejorar su pronunciación.",
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

export async function getGeneralClasses(id: string): Promise<Interview | null> {
  const interview = await db.collection("general_classes").doc(id).get();
  console.log("general classes: ", interview.data());
  return interview.data() as Interview | null;
}

export async function getPronunciationClasses(id: string): Promise<Interview | null> {
  const interview = await db.collection("pronunciation").doc(id).get();
  console.log("Pronunciation classes: ", interview.data());
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

export async function getAllInterviewsByUserId(userId: string): Promise<Interview[] | null> {
  try {
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "asc")
      .get();

    return interviews.docs.map((doc) => {
      const data = doc.data();
      
      // Normalizar los timestamps de Firestore a strings ISO
      let createdAt = data.createdAt;
      if (createdAt && typeof createdAt.toDate === 'function') {
        createdAt = createdAt.toDate().toISOString();
      }
      
      return {
        id: doc.id,
        ...data,
        createdAt
      };
    }) as Interview[];
  } catch (error) {
    console.error("Error fetching all interviews:", error);
    return null;
  }
}

export const getAllFeedbackByUserId = async (userId: string): Promise<Feedback[]> => {
  try {
    const feedbackSnapshot = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .orderBy("createdAt", "asc")
      .get();
    
    if (feedbackSnapshot.empty) {
      return [];
    }

    return feedbackSnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Normalizar los timestamps de Firestore a strings ISO
      let createdAt = data.createdAt;
      if (createdAt && typeof createdAt.toDate === 'function') {
        createdAt = createdAt.toDate().toISOString();
      }
      
      return {
        id: doc.id,
        ...data,
        createdAt
      };
    }) as Feedback[];
  } catch (error) {
    console.error("Error fetching all feedback:", error);
    return [];
  }
};

export async function getAllGeneralClasses(): Promise<Interview[] | null> {
  try {
    console.log("Iniciando búsqueda de clases generales...");
    
    const interviews = await db
      .collection("general_classes")
      .orderBy("createdAt", "desc")
      .get();

    console.log(`Se encontraron ${interviews.size} documentos en la colección general_classes`);

    const mappedInterviews = interviews.docs.map((doc) => {
      const data = doc.data();
      console.log(`Documento ${doc.id}:`, data);
      
      // Normalizar los timestamps de Firestore a strings ISO
      let createdAt = data.createdAt;
      if (createdAt && typeof createdAt.toDate === 'function') {
        createdAt = createdAt.toDate().toISOString();
      }
      
      return {
        id: doc.id,
        ...data,
        createdAt
      };
    }) as Interview[];

    console.log("Clases generales procesadas:", mappedInterviews);
    return mappedInterviews;
  } catch (error) {
    console.error("Error al obtener clases generales:", error);
    return null;
  }
}