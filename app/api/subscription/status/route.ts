import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getUserSubscription } from "@/lib/actions/subscription.action";

interface SubscriptionData {
  id: string;
  planId: string;
  currentPeriodEnd: string;
  status: string;
  [key: string]: any;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      console.log("API subscription/status: Usuario no autenticado");
      return NextResponse.json({ 
        type: 'expired',
        message: "No autorizado" 
      }, { status: 401 });
    }

    console.log("API subscription/status: Usuario autenticado", {
      userId: user.id,
      trialEndsAt: user.trialEndsAt,
      trialActive: user.trialActive,
      hasTrialData: !!user.trialEndsAt,
      hasActiveSubscription: (user as any).hasActiveSubscription,
    });

    // VERIFICACIÓN RÁPIDA: Comprobar primero si el usuario tiene el flag de suscripción activa
    if ((user as any).hasActiveSubscription === true && (user as any).subscription) {
      const userSubscription = (user as any).subscription;
      if (userSubscription.status === 'active' || userSubscription.status === 'trialing') {
        const isTrialing = userSubscription.status === 'trialing';
        const planName = userSubscription.planId === 'PREMIUM' 
          ? (isTrialing ? 'Plan Premium (Prueba)' : 'Plan Premium') 
          : (isTrialing ? 'Plan Básico (Prueba)' : 'Plan Básico');
          
        console.log("API subscription/status: Usuario con suscripción activa en documento", {
          planId: userSubscription.planId,
          currentPeriodEnd: userSubscription.currentPeriodEnd,
          status: userSubscription.status,
        });
        
        return NextResponse.json({
          type: 'plan',
          planName: planName,
          currentPeriodEnd: userSubscription.currentPeriodEnd,
          fromUserDoc: true
        });
      }
    }

    // Obtener la suscripción del usuario
    const subscription = await getUserSubscription(user.id) as SubscriptionData | null;
    console.log("API subscription/status: Resultado getUserSubscription", {
      hasSubscription: !!subscription,
      subscriptionData: subscription,
    });
    
    // Si tiene una suscripción activa, tendrá acceso independientemente del estado de la prueba
    if (subscription && subscription.status === 'active') {
      console.log("API subscription/status: Usuario con suscripción activa", {
        planId: subscription.planId,
        currentPeriodEnd: subscription.currentPeriodEnd,
      });
      return NextResponse.json({
        type: 'plan',
        planName: subscription.planId === 'PREMIUM' ? 'Plan Premium' : 'Plan Básico',
        currentPeriodEnd: subscription.currentPeriodEnd
      });
    }

    // Si está en período de prueba de Stripe
    if (subscription && subscription.status === 'trialing') {
      console.log("API subscription/status: Usuario con suscripción en período de prueba", {
        planId: subscription.planId,
        currentPeriodEnd: subscription.currentPeriodEnd,
      });
      return NextResponse.json({
        type: 'plan',
        planName: subscription.planId === 'PREMIUM' ? 'Plan Premium (Prueba)' : 'Plan Básico (Prueba)',
        currentPeriodEnd: subscription.currentPeriodEnd
      });
    }

    // Si no tiene suscripción activa, verificar el período de prueba gratuito
    if (user.trialEndsAt && user.trialActive === true) {
      const trialEndsAt = new Date(user.trialEndsAt);
      const now = new Date();
      const daysLeft = Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      console.log("API subscription/status: Verificando período de prueba", {
        trialEndsAt,
        now,
        daysLeft,
        isTrialActive: trialEndsAt > now,
      });

      if (daysLeft > 0) {
        console.log("API subscription/status: Usuario con prueba activa", {
          daysLeft,
          trialEndsAt: user.trialEndsAt,
        });
        return NextResponse.json({
          type: 'trial',
          daysLeft,
          currentPeriodEnd: user.trialEndsAt
        });
      }
    }

    console.log("API subscription/status: Usuario sin suscripción ni prueba activa", {
      trialEndsAt: user.trialEndsAt,
      trialActive: user.trialActive,
    });
    
    // Si no tiene suscripción ni período de prueba activo
    return NextResponse.json({
      type: 'expired'
    });
    
  } catch (error) {
    console.error("Error al obtener el estado de la suscripción:", error);
    return NextResponse.json({ 
      type: 'expired',
      message: "Error al obtener el estado de la suscripción" 
    }, { status: 500 });
  }
} 