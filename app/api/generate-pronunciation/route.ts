import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

interface CategoryScore {
  name: string;
  score: number;
  comment: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userid, duration } = await request.json();

    if (!userid) {
      return NextResponse.json(
        { error: "UserId es requerido" },
        { status: 400 }
      );
    }

    // Obtener los últimos 10 feedbacks del usuario
    const feedbackSnapshot = await db
      .collection("feedback")
      .where("userId", "==", userid)
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const feedbacks = feedbackSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        totalScore: data.totalScore,
        categoryScores: data.categoryScores,
        strengths: data.strengths,
        areasForImprovement: data.areasForImprovement,
        finalAssessment: data.finalAssessment
      };
    });

    // Formatear los feedbacks para el prompt
    const formattedFeedbacks = feedbacks.map((feedback, index) => `
      Feedback ${index + 1}:
      - Puntuación total: ${feedback.totalScore}/100
      - Puntuaciones por categoría: ${Object.entries(feedback.categoryScores).map(([cat, score]) => `${cat}: ${score}`).join(', ')}
      - Fortalezas: ${feedback.strengths.join(', ')}
      - Áreas de mejora: ${feedback.areasForImprovement.join(', ')}
      - Evaluación final: ${feedback.finalAssessment}
    `).join('\n');

    // Generar el contenido de la clase usando el modelo de IA
    const prompt = `Basado en los siguientes feedbacks de clases anteriores del estudiante, genera 20 frases en inglés para practicar la pronunciación. Las frases deben enfocarse en las áreas que necesitan mejora mientras refuerzan las fortalezas del estudiante. Cada frase debe ser relevante y útil para el aprendizaje.

    Feedbacks anteriores:
    ${formattedFeedbacks}

    Genera 20 frases en inglés, una por línea, que sean:
    1. Relevantes para las áreas de mejora identificadas
    2. Adecuadas para el nivel del estudiante
    3. Útiles para practicar la pronunciación
    4. Variadas en longitud y complejidad
    5. Enfocadas en sonidos específicos que necesitan práctica`;

    const { text: generatedQuestions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
      maxTokens: 1000,
    });

    const questions = generatedQuestions
      .split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 20);

    // Crear el objeto de la clase
    const interview = {
      userId: userid,
      level: "Intermedio",
      type: "Pronunciación",
      topic: ["Pronunciación", "Fluidez"],
      duration: duration || "30",
      questions,
      createdAt: new Date(),
      finalized: true
    };

    // Guardar en la colección "pronunciation"
    const docRef = await db.collection("pronunciation").add(interview);
    console.log("Clase de pronunciación creada con ID:", docRef.id);

    // Obtener el documento recién creado para devolverlo con el ID
    const doc = await docRef.get();
    const data = doc.data();
    
    // Normalizar el timestamp para la respuesta
    let createdAt = data?.createdAt;
    if (createdAt && typeof createdAt.toDate === 'function') {
      createdAt = createdAt.toDate().toISOString();
    }
    
    const responseData = {
      id: docRef.id,
      ...data,
      createdAt
    };

    return NextResponse.json({ 
      success: true, 
      interview: responseData
    });
  } catch (error) {
    console.error("Error al generar clase de pronunciación:", error);
    return NextResponse.json(
      { error: "Error al generar clase de pronunciación" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "API funcionando correctamente" });
}