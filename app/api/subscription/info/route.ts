import { NextResponse } from "next/server";
import { getUserSubscription } from "@/lib/actions/subscription.action";
import { auth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Obtener la cookie de sesión
    const cookiesList = cookies();
    const sessionCookie = cookiesList.get("session")?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    
    // Verificar la sesión con Firebase
    const decodedClaim = await auth.verifySessionCookie(sessionCookie);
    
    if (!decodedClaim) {
      return NextResponse.json({ error: "Sesión inválida" }, { status: 401 });
    }
    
    const userId = decodedClaim.uid;
    
    // Obtener la información de la suscripción del usuario
    const subscription = await getUserSubscription(userId);
    
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Error al obtener la información de la suscripción:", error);
    return NextResponse.json(
      { error: "Error al obtener la información de la suscripción" },
      { status: 500 }
    );
  }
} 