import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    
    // Verificar si la prueba está activa o no
    let trialStatus = null;
    if (user.trialEndsAt) {
      const trialEndsAt = new Date(user.trialEndsAt);
      const now = new Date();
      
      if (trialEndsAt > now && user.trialActive) {
        trialStatus = 'active';
      } else {
        trialStatus = 'expired';
      }
    }
    
    // No enviar información sensible al cliente
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        trialEndsAt: user.trialEndsAt,
        trialActive: user.trialActive,
        trialStatus: trialStatus,
        trialPlan: user.trialPlan
      }
    });
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return NextResponse.json(
      { error: "Error al obtener la información del usuario" },
      { status: 500 }
    );
  }
} 