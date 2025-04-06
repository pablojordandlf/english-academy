import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const interviewId = url.searchParams.get("interviewId");
    const userId = url.searchParams.get("userId");

    if (!interviewId || !userId) {
      return NextResponse.json(
        { error: "Se requieren tanto interviewId como userId" },
        { status: 400 }
      );
    }

    // Verificar que la entrevista pertenezca al usuario
    const interviewDoc = await db.collection("pronunciation").doc(interviewId).get();
    
    if (!interviewDoc.exists) {
      return NextResponse.json(
        { error: "La entrevista no existe" },
        { status: 404 }
      );
    }

    const interviewData = interviewDoc.data();
    if (interviewData?.userId !== userId) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar esta entrevista" },
        { status: 403 }
      );
    }

    // Primero eliminamos cualquier feedback asociado a esta entrevista
    const feedbackSnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .get();
    
    const feedbackDeletions = feedbackSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(feedbackDeletions);
    
    // Luego eliminamos la entrevista
    await db.collection("pronunciation").doc(interviewId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar la entrevista:", error);
    return NextResponse.json(
      { error: "Error al eliminar la entrevista" },
      { status: 500 }
    );
  }
} 