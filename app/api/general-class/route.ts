import { NextRequest, NextResponse } from "next/server";
import { getAllGeneralClasses } from "@/lib/actions/general.action";

export async function GET(request: NextRequest) {
  try {
    console.log("Iniciando petición GET a /api/general-class");
    const interviews = await getAllGeneralClasses();
    console.log("Respuesta de getAllGeneralClasses:", interviews);

    if (!interviews) {
      console.log("No se encontraron clases generales");
      return NextResponse.json({ interviews: [] });
    }

    console.log(`Enviando ${interviews.length} clases generales`);
    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("Error al obtener clases generales:", error);
    return NextResponse.json(
      { error: "Error al obtener clases generales" },
      { status: 500 }
    );
  }
} 