import { NextRequest, NextResponse } from "next/server";
import { getLatestInterviews } from "@/lib/actions/general.action";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "UserId es requerido" },
        { status: 400 }
      );
    }

    const interviews = await getLatestInterviews({ userId });

    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("Error al obtener las últimas entrevistas:", error);
    return NextResponse.json(
      { error: "Error al obtener entrevistas" },
      { status: 500 }
    );
  }
} 