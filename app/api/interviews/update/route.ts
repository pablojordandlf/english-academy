import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function PUT(request: NextRequest) {
  try {
    const { interviewId, userId, level, topic, duration } = await request.json();

    if (!interviewId || !userId) {
      return NextResponse.json(
        { error: "Se requieren tanto interviewId como userId" },
        { status: 400 }
      );
    }

    // Verificar que la entrevista pertenezca al usuario
    const interviewDoc = await db.collection("interviews").doc(interviewId).get();
    
    if (!interviewDoc.exists) {
      return NextResponse.json(
        { error: "La entrevista no existe" },
        { status: 404 }
      );
    }

    const interviewData = interviewDoc.data();
    if (interviewData?.userId !== userId) {
      return NextResponse.json(
        { error: "No tienes permiso para editar esta entrevista" },
        { status: 403 }
      );
    }

    // Actualizar la entrevista
    await db.collection("interviews").doc(interviewId).update({
      level,
      topic,
      duration,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al actualizar la entrevista:", error);
    return NextResponse.json(
      { error: "Error al actualizar la entrevista" },
      { status: 500 }
    );
  }
} 