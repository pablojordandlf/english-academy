import { NextRequest, NextResponse } from "next/server";
import { getAllPronunciationByUserId } from "@/lib/actions/pronunciation.action";

export async function GET(request: NextRequest) {
  try { 
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const interviewId = url.searchParams.get("interviewId");

    if (!userId) {
      console.log("Error: userId no proporcionado");
      return NextResponse.json(
        { error: "UserId es requerido" },
        { status: 400 }
      );
    }

    console.log(`Obteniendo clases de pronunciación para el usuario: ${userId}`);

    // Si se proporciona un interviewId, devolver solo esa clase
    if (interviewId) {
      console.log(`Buscando clase específica con ID: ${interviewId}`);
      const interviews = await getAllPronunciationByUserId(userId);
      const interview = interviews.find(i => i.id === interviewId);
      
      if (!interview) {
        console.log(`Clase con ID ${interviewId} no encontrada`);
        return NextResponse.json(
          { error: "Clase de pronunciación no encontrada" },
          { status: 404 }
        );
      }
      
      console.log(`Clase encontrada:`, interview);
      return NextResponse.json({ interview });
    }

    // Si no se proporciona interviewId, devolver todas las clases del usuario
    const interviews = await getAllPronunciationByUserId(userId);
    console.log("Respuesta de getAllPronunciationByUserId:", interviews);

    if (!interviews || interviews.length === 0) {
      console.log("No se encontraron clases de pronunciación");
      return NextResponse.json({ interviews: [] });
    }

    console.log(`Enviando ${interviews.length} clases de pronunciación`);
    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("Error al obtener clases de pronunciación:", error);
    return NextResponse.json(
      { error: "Error al obtener clases de pronunciación" },
      { status: 500 }
    );
  }
} 