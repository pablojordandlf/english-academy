import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    console.log("API auth/me: Iniciando obtención de datos del usuario");
    const user = await getCurrentUser();
    
    if (!user) {
      console.log("API auth/me: Usuario no autenticado");
      return NextResponse.json({ user: null }, { status: 401 });
    }
    
    console.log("API auth/me: Usuario autenticado", {
      userId: user.id,
      hasTrialData: !!user.trialEndsAt,
      trialEndsAt: user.trialEndsAt,
      trialActive: user.trialActive,
    });
    
    // Verificar si la prueba está activa o no
    let trialStatus = null;
    let needsUpdate = false;

    if (user.trialEndsAt) {
      const trialEndsAt = new Date(user.trialEndsAt);
      const now = new Date();
      
      console.log("API auth/me: Verificando estado del período de prueba", {
        trialEndsAt,
        now,
        isActive: trialEndsAt > now && user.trialActive,
        flagTrialActive: user.trialActive,
      });
      
      // Si la prueba ha expirado pero trialActive sigue en true, actualizarlo a false
      if (trialEndsAt <= now && user.trialActive === true) {
        console.log("API auth/me: Prueba expirada, actualizando trialActive a false");
        const userRef = db.collection("users").doc(user.id);
        await userRef.update({
          trialActive: false,
          trialUsed: true
        });
        
        // Actualizar el estado local también
        user.trialActive = false;
        needsUpdate = true;
      }
      
      if (trialEndsAt > now && user.trialActive) {
        trialStatus = 'active';
        console.log("API auth/me: Período de prueba activo");
      } else {
        trialStatus = 'expired';
        console.log("API auth/me: Período de prueba expirado");
      }
    } else {
      console.log("API auth/me: Usuario sin datos de período de prueba");
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      subscription: user.subscription,
      trialEndsAt: user.trialEndsAt,
      trialActive: user.trialActive,
      trialStatus: trialStatus,
      trialPlan: user.trialPlan,
      needsRefresh: needsUpdate
    };
    
    console.log("API auth/me: Respuesta con datos de usuario", userData);
    
    // No enviar información sensible al cliente
    return NextResponse.json({
      user: userData
    });
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return NextResponse.json(
      { error: "Error al obtener la información del usuario" },
      { status: 500 }
    );
  }
} 