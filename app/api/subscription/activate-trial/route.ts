import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function POST(request: Request) {
  try {
    console.log("API subscription/activate-trial: Iniciando activación de prueba");
    
    // Verificar que el usuario esté autenticado
    const user = await getCurrentUser();
    
    if (!user) {
      console.log("API subscription/activate-trial: Usuario no autenticado");
      return NextResponse.json({ 
        success: false, 
        message: "No autorizado" 
      }, { status: 401 });
    }
    
    const userId = user.id;
    console.log("API subscription/activate-trial: Usuario autenticado", { 
      userId,
      userData: {
        name: user.name,
        email: user.email,
        trialEndsAt: user.trialEndsAt,
        trialActive: user.trialActive,
        trialStartedAt: user.trialStartedAt,
        trialPlan: user.trialPlan,
        pendingSubscription: user.pendingSubscription
      }
    });
    
    // Obtener datos de la solicitud
    const { planId, billingCycle } = await request.json();
    console.log("API subscription/activate-trial: Datos de solicitud", { planId, billingCycle });
    
    // Verificar que el usuario existe en la base de datos
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      console.log("API subscription/activate-trial: Usuario no encontrado");
      return NextResponse.json({ 
        success: false, 
        message: "Usuario no encontrado" 
      }, { status: 404 });
    }
    
    const userData = userDoc.data();
    console.log("API subscription/activate-trial: Datos del usuario en Firestore", {
      trialUsed: userData?.trialUsed,
      trialEndsAt: userData?.trialEndsAt,
      trialActive: userData?.trialActive,
      pendingSubscription: userData?.pendingSubscription,
      allData: userData
    });
    
    // Verificar si el usuario ya ha utilizado el período de prueba anteriormente
    if (userData?.trialUsed) {
      console.log("API subscription/activate-trial: El usuario ya ha utilizado el período de prueba anteriormente");
      return NextResponse.json({ 
        success: false, 
        message: "Ya has utilizado el período de prueba anteriormente" 
      }, { status: 400 });
    }
    
    // También verificar si hay un período de prueba anterior (aunque no se haya marcado explícitamente como usado)
    if (userData?.trialEndsAt) {
      const trialEndsAt = new Date(userData.trialEndsAt);
      const now = new Date();
      
      console.log("API subscription/activate-trial: Verificando período de prueba existente", {
        trialEndsAt,
        now,
        isExpired: trialEndsAt <= now,
        isActive: userData.trialActive === true
      });
      
      // Si la prueba anterior ha expirado, marcarla como usada
      if (trialEndsAt <= now && userData.trialActive !== true) {
        console.log("API subscription/activate-trial: Marcando período de prueba expirado como usado");
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
        console.log("API subscription/activate-trial: El usuario ya tiene un período de prueba activo");
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
    
    // Preparar los datos de actualización
    const updateData = {
      trialEndsAt: trialEndsAt.toISOString(),
      trialStartedAt: new Date().toISOString(),
      trialPlan: {
        planId,
        billingCycle
      },
      trialActive: true
    };
    
    console.log("API subscription/activate-trial: Activando período de prueba", updateData);
    
    // Actualizar el usuario con la información del período de prueba
    await userRef.update(updateData);
    
    console.log("API subscription/activate-trial: Período de prueba activado correctamente");
    
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