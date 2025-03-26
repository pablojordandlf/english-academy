import { NextRequest, NextResponse } from "next/server";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const interviewId = url.searchParams.get("interviewId");
    const userId = url.searchParams.get("userId");

    if (!interviewId || !userId) {
      return NextResponse.json(
        { error: "interviewId y userId son requeridos" },
        { status: 400 }
      );
    }

    const feedback = await getFeedbackByInterviewId({
      interviewId,
      userId,
    });

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Error al obtener feedback:", error);
    return NextResponse.json(
      { error: "Error al obtener feedback" },
      { status: 500 }
    );
  }
} 