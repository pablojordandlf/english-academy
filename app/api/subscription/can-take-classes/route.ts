import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { canUserTakeClasses } from "@/lib/actions/subscription.action";

export async function GET() {
  try {
    // Verificar que el usuario esté autenticado
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ 
        canTakeClasses: false,
        message: "No autorizado" 
      }, { status: 401 });
    }
    
    // Verificar si el usuario puede recibir clases
    const canTakeClasses = await canUserTakeClasses(user.id);
    
    return NextResponse.json({ 
      canTakeClasses,
      message: canTakeClasses 
        ? "Usuario puede recibir clases" 
        : "Usuario no puede recibir clases"
    });
    
  } catch (error) {
    console.error("Error al verificar si el usuario puede recibir clases:", error);
    return NextResponse.json({ 
      canTakeClasses: false,
      message: "Error al verificar si el usuario puede recibir clases" 
    }, { status: 500 });
  }
} 