import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { manuallyUpdateSubscriptionStatus } from "@/lib/actions/subscription.action";

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: "No autorizado" 
      }, { status: 401 });
    }

    console.log("API subscription/update: Iniciando actualización manual", {
      userId: user.id,
    });
    
    // Llamar a la función para actualizar el estado de suscripción
    const result = await manuallyUpdateSubscriptionStatus(user.id);
    
    console.log("API subscription/update: Resultado de actualización manual", result);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Error al actualizar estado de suscripción:", error);
    return NextResponse.json({ 
      success: false,
      message: "Error al actualizar el estado de suscripción" 
    }, { status: 500 });
  }
} 