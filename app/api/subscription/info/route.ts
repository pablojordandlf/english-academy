import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getUserSubscription } from "@/lib/actions/subscription.action";

interface SubscriptionData {
  id: string;
  planId: string;
  currentPeriodEnd: string;
  status: string;
  billingCycle: string;
  stripeCustomerId?: string;
  [key: string]: any;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ 
        subscription: null,
        message: "No autorizado" 
      }, { status: 401 });
    }

    console.log("API subscription/info: Usuario autenticado", {
      userId: user.id,
      hasTrialData: !!user.trialEndsAt,
      trialActive: user.trialActive,
      hasActiveSubscription: (user as any).hasActiveSubscription,
    });
    
    // VERIFICACIÓN RÁPIDA: Si el usuario tiene el flag de suscripción activa y datos de suscripción
    // podemos devolver esa información directamente sin tener que consultar la colección de suscripciones
    if ((user as any).hasActiveSubscription === true && (user as any).subscription) {
      const userSubscription = (user as any).subscription;
      console.log("API subscription/info: Usuario con suscripción activa en documento", {
        status: userSubscription.status,
        planId: userSubscription.planId,
        currentPeriodEnd: userSubscription.currentPeriodEnd,
      });
      
      return NextResponse.json({
        subscription: {
          status: userSubscription.status,
          currentPeriodEnd: userSubscription.currentPeriodEnd,
          planId: userSubscription.planId,
          billingCycle: userSubscription.billingCycle || 'monthly',
          userId: user.id,
          fromUserDoc: true // Indica que estos datos vienen directamente del documento del usuario
        }
      });
    }
    
    // Si no se resolvió con los datos del usuario, obtenemos la suscripción desde la colección
    const subscription = await getUserSubscription(user.id) as SubscriptionData | null;
    
    if (subscription) {
      console.log("API subscription/info: Información de suscripción recuperada de colección", {
        status: subscription.status,
        planId: subscription.planId,
        currentPeriodEnd: subscription.currentPeriodEnd,
      });
      
      return NextResponse.json({
        subscription: {
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          planId: subscription.planId,
          billingCycle: subscription.billingCycle || 'monthly', // Valor predeterminado si no está definido
          stripeCustomerId: subscription.stripeCustomerId,
          userId: user.id
        }
      });
    }
    
    // Si no hay suscripción pero hay período de prueba activo, devolver información de prueba
    if (user.trialEndsAt && user.trialActive === true) {
      const trialEndsAt = new Date(user.trialEndsAt);
      const now = new Date();
      
      if (trialEndsAt > now) {
        // Determinar el plan de prueba
        const planDetails = (user as any).trialPlan || { planId: 'PREMIUM', billingCycle: 'monthly' };
        
        console.log("API subscription/info: Usuario con prueba activa", {
          trialEndsAt: user.trialEndsAt,
          planDetails,
        });
        
        return NextResponse.json({
          subscription: {
            status: 'trialing',
            currentPeriodEnd: user.trialEndsAt,
            planId: planDetails.planId,
            billingCycle: planDetails.billingCycle,
            userId: user.id,
            isFreeTrialOnly: true // Indica que es solo la prueba gratuita, no una prueba de Stripe
          }
        });
      }
    }
    
    console.log("API subscription/info: Usuario sin suscripción", { userId: user.id });
    
    // Si no hay suscripción ni prueba activa
    return NextResponse.json({
      subscription: null
    });
    
  } catch (error) {
    console.error("Error al obtener información de la suscripción:", error);
    return NextResponse.json({ 
      subscription: null,
      message: "Error al obtener la información de la suscripción" 
    }, { status: 500 });
  }
} 