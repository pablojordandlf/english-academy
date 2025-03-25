"use server";

import { auth } from "@/lib/firebase-admin";
import { stripe, getPlanPriceId } from "@/lib/stripe";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/firebase-admin";
import { createId } from "@paralleldrive/cuid2";

// Crear una sesión de checkout para un nuevo suscriptor
export async function createCheckoutSession({
  userId,
  planId,
  billingCycle,
  successUrl,
  cancelUrl,
  couponCode,
}: CreateCheckoutSessionParams) {
  try {
    // Verificar si el usuario existe
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new Error("Usuario no encontrado");
    }
    
    const user = userDoc.data();
    
    // Si el usuario ya tiene un ID de cliente de Stripe, usamos ese
    let stripeCustomerId = user?.stripeCustomerId;
    
    // Si no tiene un ID de cliente de Stripe, creamos uno nuevo
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user?.email,
        name: user?.name,
        metadata: {
          userId,
        },
      });
      
      stripeCustomerId = customer.id;
      
      // Actualizar el usuario con el ID de cliente de Stripe
      await userRef.update({
        stripeCustomerId,
      });
    }
    
    // Obtener el ID del precio correspondiente al plan y ciclo de facturación
    const priceId = getPlanPriceId(planId as 'PREMIUM', billingCycle);
    
    if (!priceId) {
      throw new Error(`ID de precio no encontrado para el plan ${planId} y ciclo ${billingCycle}`);
    }
    
    // Opciones base para la sesión de checkout
    const sessionOptions: any = {
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        trial_period_days: 7, // 7 días de prueba gratuita
        metadata: {
          userId,
          planId,
          billingCycle,
        },
      },
      metadata: {
        userId,
        planId,
        billingCycle,
      },
    };
    
    // Si hay un código de cupón, lo agregamos a la sesión
    if (couponCode) {
      // Verificar si el cupón existe en Stripe
      try {
        const coupon = await stripe.coupons.retrieve(couponCode);
        
        if (coupon.valid) {
          sessionOptions.discounts = [{ coupon: couponCode }];
          sessionOptions.metadata.couponCode = couponCode;
        }
      } catch (error) {
        console.error("Error al aplicar el cupón:", error);
        // Si el cupón no es válido, continuamos sin aplicarlo
      }
    }
    
    // Crear la sesión de checkout
    const session = await stripe.checkout.sessions.create(sessionOptions);
    
    return { url: session.url };
  } catch (error) {
    console.error("Error al crear la sesión de checkout:", error);
    throw error;
  }
}

// Obtener la información de suscripción del usuario
export async function getUserSubscription(userId: string) {
  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new Error("Usuario no encontrado");
    }
    
    const user = userDoc.data();
    const stripeCustomerId = user?.stripeCustomerId;
    
    // Si el usuario no tiene un ID de cliente de Stripe, no tiene suscripción
    if (!stripeCustomerId) {
      return null;
    }
    
    // Buscar las suscripciones del usuario en Firestore
    const subscriptionsRef = db.collection("subscriptions");
    const snapshot = await subscriptionsRef.where("userId", "==", userId).where("status", "in", ["active", "trialing"]).limit(1).get();
    
    if (snapshot.empty) {
      return null;
    }
    
    // Devolver la primera suscripción activa o en periodo de prueba
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    };
  } catch (error) {
    console.error("Error al obtener la suscripción del usuario:", error);
    throw error;
  }
}

// Crear un enlace para gestionar la suscripción
export async function createPortalLink({
  userId,
  stripeCustomerId,
  returnUrl,
}: ManageSubscriptionParams) {
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });
    
    return { url: portalSession.url };
  } catch (error) {
    console.error("Error al crear el enlace del portal:", error);
    throw error;
  }
}

// Verificar si el usuario puede tomar clases
export async function canUserTakeClasses(userId: string) {
  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return false;
    }
    
    const userData = userDoc.data();
    
    // Comprobar si el usuario tiene una suscripción activa
    const subscription = await getUserSubscription(userId);
    if (subscription && ('status' in subscription) && 
        (subscription.status === 'active' || subscription.status === 'trialing')) {
      return true;
    }
    
    // Comprobar si el usuario está en periodo de prueba gratuita
    if (userData?.trialEndsAt) {
      const trialEndsAt = new Date(userData.trialEndsAt);
      const now = new Date();
      
      // Si el período de prueba está activo y no ha expirado
      if (userData.trialActive === true && trialEndsAt > now) {
        return true;
      } else if (userData.trialActive === true && trialEndsAt <= now) {
        // Si el período de prueba ha expirado, marcarlo como usado y desactivarlo
        await userRef.update({
          trialActive: false,
          trialUsed: true
        });
        return false;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error al verificar si el usuario puede tomar clases:", error);
    return false;
  }
} 