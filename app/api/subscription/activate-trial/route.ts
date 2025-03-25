import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function POST(request: Request) {
  try {
    // Verificar que el usuario esté autenticado
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "No autorizado" 
      }, { status: 401 });
    }
    
    const userId = user.id;
    
    // Obtener datos de la solicitud
    const { planId, billingCycle } = await request.json();
    
    // Verificar que el usuario existe en la base de datos
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        message: "Usuario no encontrado" 
      }, { status: 404 });
    }
    
    const userData = userDoc.data();
    
    // Verificar si el usuario ya ha utilizado el período de prueba anteriormente
    if (userData?.trialUsed) {
      return NextResponse.json({ 
        success: false, 
        message: "Ya has utilizado el período de prueba anteriormente" 
      }, { status: 400 });
    }
    
    // También verificar si hay un período de prueba anterior (aunque no se haya marcado explícitamente como usado)
    if (userData?.trialEndsAt) {
      const trialEndsAt = new Date(userData.trialEndsAt);
      const now = new Date();
      
      // Si la prueba anterior ha expirado, marcarla como usada
      if (trialEndsAt <= now && userData.trialActive !== true) {
        await userRef.update({
          trialUsed: true
        });
        
        return NextResponse.json({ 
          success: false, 
          message: "Ya has utilizado el período de prueba anteriormente" 
        }, { status: 400 });
      }
      
      // Si la prueba sigue activa, informar que ya tiene una prueba en curso
      if (trialEndsAt > now && userData.trialActive === true) {
        return NextResponse.json({ 
          success: false,
          message: "Ya tienes un período de prueba activo",
          trialEndsAt: userData.trialEndsAt
        }, { status: 400 });
      }
    }
    
    // Calcular la fecha de fin del período de prueba (7 días a partir de hoy)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);
    
    // Actualizar el usuario con la información del período de prueba
    await userRef.update({
      trialEndsAt: trialEndsAt.toISOString(),
      trialStartedAt: new Date().toISOString(),
      trialPlan: {
        planId,
        billingCycle
      },
      trialActive: true
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Período de prueba activado correctamente",
      trialEndsAt: trialEndsAt.toISOString()
    });
    
  } catch (error) {
    console.error("Error al activar período de prueba:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Error interno del servidor" 
    }, { status: 500 });
  }
} 