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
    console.log("getUserSubscription: Iniciando para userId", userId);
    
    // Obtener el documento del usuario
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      console.log("getUserSubscription: Usuario no encontrado", { userId });
      throw new Error("Usuario no encontrado");
    }
    
    const userData = userDoc.data();
    console.log("getUserSubscription: Datos del usuario recuperados", { 
      userId,
      hasActiveSubscription: userData?.hasActiveSubscription,
      hasSubscriptionInUserData: !!userData?.subscription
    });
    
    // IMPORTANTE: Verificar primero si el usuario tiene el flag de suscripción activa
    // y los datos de suscripción ya almacenados en el documento del usuario
    if (userData?.hasActiveSubscription === true && userData?.subscription) {
      console.log("getUserSubscription: Suscripción encontrada en datos del usuario", userData.subscription);
      
      // Obtener más detalles de la colección de suscripciones si es necesario
      const subscriptionId = userData.subscription.id;
      if (subscriptionId) {
        const subscriptionDoc = await db.collection("subscriptions").doc(subscriptionId).get();
        if (subscriptionDoc.exists) {
          return {
            id: subscriptionId,
            ...subscriptionDoc.data()
          };
        }
      }
      
      // Si no encontramos la suscripción en la colección, devolvemos los datos del usuario
      // Esto permite que la función siga funcionando incluso si la suscripción aún no se ha 
      // sincronizado completamente con la colección de suscripciones
      return {
        id: userData.subscription.id || createId(),
        userId: userId,
        planId: userData.subscription.planId,
        status: userData.subscription.status,
        currentPeriodEnd: userData.subscription.currentPeriodEnd,
        billingCycle: userData.subscription.billingCycle,
      };
    }
    
    // Si no encontramos datos en el documento del usuario, intentamos el método anterior
    console.log("getUserSubscription: Buscando en colección de suscripciones", { userId });
    const stripeCustomerId = userData?.stripeCustomerId;
    
    // Si el usuario no tiene un ID de cliente de Stripe, no tiene suscripción
    if (!stripeCustomerId) {
      console.log("getUserSubscription: Usuario sin ID de cliente Stripe", { userId });
      return null;
    }
    
    // Buscar las suscripciones del usuario en Firestore
    const subscriptionsRef = db.collection("subscriptions");
    const snapshot = await subscriptionsRef.where("userId", "==", userId).where("status", "in", ["active", "trialing"]).limit(1).get();
    
    if (!snapshot.empty) {
      // Devolver la primera suscripción activa o en periodo de prueba
      const subscription = {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data(),
      };
      
      console.log("getUserSubscription: Suscripción encontrada en colección", subscription);
      return subscription;
    }
    
    // Si no encontramos nada en la base de datos, verificar directamente en Stripe
    console.log("getUserSubscription: Verificando directamente en Stripe", { stripeCustomerId });
    
    try {
      // Verificar suscripciones activas
      const activeSubscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'active',
        limit: 1
      });
      
      if (activeSubscriptions.data.length > 0) {
        console.log("getUserSubscription: Suscripción activa encontrada en Stripe, sincronizando datos");
        
        // Hay una discrepancia, el usuario tiene una suscripción activa en Stripe pero no en nuestra base de datos
        // Llamamos a manuallyUpdateSubscriptionStatus para sincronizar los datos
        const syncResult = await manuallyUpdateSubscriptionStatus(userId);
        
        if (syncResult.success && syncResult.hasSubscription) {
          // Volvemos a intentar obtener la suscripción después de la sincronización
          return await getUserSubscription(userId);
        }
      }
      
      // Verificar suscripciones en período de prueba
      const trialSubscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'trialing',
        limit: 1
      });
      
      if (trialSubscriptions.data.length > 0) {
        console.log("getUserSubscription: Suscripción en período de prueba encontrada en Stripe, sincronizando datos");
        
        // Hay una discrepancia, el usuario tiene una suscripción en período de prueba en Stripe pero no en nuestra base de datos
        // Llamamos a manuallyUpdateSubscriptionStatus para sincronizar los datos
        const syncResult = await manuallyUpdateSubscriptionStatus(userId);
        
        if (syncResult.success && syncResult.hasSubscription) {
          // Volvemos a intentar obtener la suscripción después de la sincronización
          return await getUserSubscription(userId);
        }
      }
    } catch (stripeError) {
      console.error("Error al verificar suscripciones en Stripe:", stripeError);
      // Continuamos con el flujo normal incluso si hay un error al consultar Stripe
    }
    
    console.log("getUserSubscription: No se encontraron suscripciones activas", { userId });
    return null;
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
    
    // Verificar directamente si el usuario tiene el flag hasActiveSubscription
    if (userData?.hasActiveSubscription === true) {
      console.log("canUserTakeClasses: Usuario con suscripción activa según flag", { userId });
      return true;
    }
    
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

// Función para actualizar manualmente el estado de suscripción de un usuario
export async function manuallyUpdateSubscriptionStatus(userId: string) {
  try {
    console.log("manuallyUpdateSubscriptionStatus: Iniciando para userId", userId);
    
    // Obtener el documento del usuario
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      console.log("manuallyUpdateSubscriptionStatus: Usuario no encontrado", { userId });
      return { success: false, message: "Usuario no encontrado" };
    }
    
    const userData = userDoc.data();
    const stripeCustomerId = userData?.stripeCustomerId;
    
    // Si el usuario no tiene un ID de cliente de Stripe, no puede tener suscripción
    if (!stripeCustomerId) {
      console.log("manuallyUpdateSubscriptionStatus: Usuario sin ID de cliente Stripe", { userId });
      return { success: false, message: "Usuario sin ID de cliente en Stripe" };
    }
    
    // Obtener suscripciones del cliente directamente desde Stripe
    const stripeSubscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1
    });
    
    console.log("manuallyUpdateSubscriptionStatus: Resultado de Stripe", {
      hasSubscription: stripeSubscriptions.data.length > 0,
      subscriptionCount: stripeSubscriptions.data.length
    });
    
    if (stripeSubscriptions.data.length === 0) {
      // No hay suscripciones activas en Stripe
      // Verificar si hay suscripciones en período de prueba
      const trialSubscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'trialing',
        limit: 1
      });
      
      if (trialSubscriptions.data.length === 0) {
        // No hay suscripciones activas ni en período de prueba
        // Actualizar el documento del usuario para reflejar esto
        await userRef.update({
          hasActiveSubscription: false,
          'subscription.status': 'inactive',
          lastSubscriptionUpdate: new Date().toISOString()
        });
        
        console.log("manuallyUpdateSubscriptionStatus: Usuario sin suscripciones activas en Stripe", { userId });
        return { success: true, message: "Usuario actualizado: sin suscripción activa", hasSubscription: false };
      }
      
      const trialSubscription = trialSubscriptions.data[0];
      // Procesar la suscripción en período de prueba
      const subscriptionData = {
        id: createId(),
        userId,
        planId: userData?.pendingSubscription?.plan || 'PREMIUM',
        billingCycle: userData?.pendingSubscription?.billingCycle || 'monthly',
        status: 'trialing',
        currentPeriodStart: new Date(trialSubscription.current_period_start * 1000).toISOString(),
        currentPeriodEnd: new Date(trialSubscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: trialSubscription.cancel_at_period_end,
        stripeCustomerId: stripeCustomerId,
        stripeSubscriptionId: trialSubscription.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Guardar en la colección de suscripciones
      await db.collection("subscriptions").doc(subscriptionData.id).set(subscriptionData);
      
      // Actualizar el documento del usuario
      await userRef.update({
        hasActiveSubscription: true,
        subscription: {
          id: subscriptionData.id,
          planId: subscriptionData.planId,
          status: subscriptionData.status,
          currentPeriodEnd: subscriptionData.currentPeriodEnd,
          billingCycle: subscriptionData.billingCycle,
        },
        lastSubscriptionUpdate: new Date().toISOString()
      });
      
      console.log("manuallyUpdateSubscriptionStatus: Usuario con suscripción en prueba en Stripe", { 
        userId,
        subscriptionId: subscriptionData.id,
        status: subscriptionData.status
      });
      
      return { 
        success: true, 
        message: "Usuario actualizado: suscripción en período de prueba", 
        hasSubscription: true, 
        status: 'trialing' 
      };
    }
    
    // Hay una suscripción activa
    const activeSubscription = stripeSubscriptions.data[0];
    
    // Crear datos de la suscripción
    const subscriptionData = {
      id: createId(),
      userId,
      planId: userData?.pendingSubscription?.plan || 'PREMIUM',
      billingCycle: userData?.pendingSubscription?.billingCycle || 'monthly',
      status: 'active',
      currentPeriodStart: new Date(activeSubscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(activeSubscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: activeSubscription.cancel_at_period_end,
      stripeCustomerId: stripeCustomerId,
      stripeSubscriptionId: activeSubscription.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Guardar en la colección de suscripciones
    await db.collection("subscriptions").doc(subscriptionData.id).set(subscriptionData);
    
    // Actualizar el documento del usuario
    await userRef.update({
      hasActiveSubscription: true,
      subscription: {
        id: subscriptionData.id,
        planId: subscriptionData.planId,
        status: subscriptionData.status,
        currentPeriodEnd: subscriptionData.currentPeriodEnd,
        billingCycle: subscriptionData.billingCycle,
      },
      lastSubscriptionUpdate: new Date().toISOString()
    });
    
    console.log("manuallyUpdateSubscriptionStatus: Usuario con suscripción activa en Stripe", { 
      userId,
      subscriptionId: subscriptionData.id,
      status: 'active'
    });
    
    return { 
      success: true, 
      message: "Usuario actualizado con suscripción activa", 
      hasSubscription: true, 
      status: 'active' 
    };
    
  } catch (error) {
    console.error("Error al actualizar manualmente el estado de suscripción:", error);
    return { success: false, message: "Error al verificar suscripciones: " + (error as Error).message };
  }
} 