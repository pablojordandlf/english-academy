import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Readable } from "stream";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/firebase-admin";
import { createId } from "@paralleldrive/cuid2";

// Helper para convertir el cuerpo de la solicitud en legible
async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  try {
    // Obtener el cuerpo de la solicitud y el encabezado de firma de Stripe
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return new NextResponse("Falta la firma o el secreto del webhook", { status: 400 });
    }

    // Verificar la firma del webhook
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Manejar los eventos de Stripe según el tipo
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId || "";
        const billingCycle = session.metadata?.billingCycle || "monthly";

        if (!userId || !planId) {
          console.error("Falta información en los metadatos de la sesión", session);
          return new NextResponse("Datos incompletos", { status: 400 });
        }

        // Actualizar el usuario con la información de la suscripción
        await handleCheckoutCompleted(session, userId, planId, billingCycle);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        await handleInvoicePaymentFailed(invoice);
        break;
      }
      default:
        console.log(`Evento de Stripe no manejado: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error al procesar el webhook de Stripe:", error);
    return new NextResponse("Error al procesar el webhook", { status: 400 });
  }
}

// Manejar la finalización del checkout
async function handleCheckoutCompleted(session: any, userId: string, planId: string, billingCycle: string) {
  try {
    console.log("Webhook - handleCheckoutCompleted: Procesando sesión completada", {
      userId,
      planId,
      billingCycle,
      sessionId: session.id
    });
    
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error(`Usuario no encontrado con ID: ${userId}`);
    }

    // Si se crea una suscripción, registramos la información relevante
    if (session.subscription) {
      console.log("Webhook - handleCheckoutCompleted: Obteniendo detalles de suscripción", { subscriptionId: session.subscription });
      
      const subscription = await stripe.subscriptions.retrieve(session.subscription);

      const subscriptionData = {
        id: createId(),
        userId,
        planId,
        billingCycle,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        stripeCustomerId: String(subscription.customer),
        stripeSubscriptionId: subscription.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Webhook - handleCheckoutCompleted: Guardando suscripción en Firestore", subscriptionData);
      
      // Guardar la suscripción en Firestore
      await db.collection("subscriptions").doc(subscriptionData.id).set(subscriptionData);

      // Actualizar el usuario con la información de la suscripción
      const userUpdate = {
        subscription: {
          id: subscriptionData.id,
          planId: planId,  // Añadir planId
          status: subscriptionData.status,
          currentPeriodEnd: subscriptionData.currentPeriodEnd,
          billingCycle: billingCycle,  // Añadir ciclo de facturación
        },
        hasActiveSubscription: true,  // Añadir flag para indicar suscripción activa
        lastSubscriptionUpdate: new Date().toISOString(),  // Añadir timestamp de actualización
      };
      
      console.log("Webhook - handleCheckoutCompleted: Actualizando documento de usuario", userUpdate);
      
      await userRef.update(userUpdate);
      
      console.log("Webhook - handleCheckoutCompleted: Procesamiento completado exitosamente");
    } else {
      console.log("Webhook - handleCheckoutCompleted: La sesión no contiene una suscripción");
    }
  } catch (error) {
    console.error("Error al manejar el checkout completado:", error);
    throw error;
  }
}

// Manejar actualización de suscripción
async function handleSubscriptionUpdated(subscription: any) {
  try {
    console.log("Webhook - handleSubscriptionUpdated: Procesando actualización de suscripción", {
      subscriptionId: subscription.id,
      status: subscription.status
    });
    
    // Buscar la suscripción en Firestore
    const subscriptionsRef = db.collection("subscriptions");
    const snapshot = await subscriptionsRef.where("stripeSubscriptionId", "==", subscription.id).limit(1).get();

    if (snapshot.empty) {
      console.log(`No se encontró la suscripción con ID: ${subscription.id}`);
      return;
    }

    const subscriptionDoc = snapshot.docs[0];
    const subscriptionId = subscriptionDoc.id;
    const subscriptionData = subscriptionDoc.data();
    
    console.log("Webhook - handleSubscriptionUpdated: Suscripción encontrada", {
      subscriptionId,
      existingData: subscriptionData
    });

    // Actualizar los datos de la suscripción
    const updatedData = {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: new Date().toISOString(),
    };

    await subscriptionsRef.doc(subscriptionId).update(updatedData);
    
    console.log("Webhook - handleSubscriptionUpdated: Suscripción actualizada en Firestore");

    // Actualizar también la información resumida en el documento del usuario
    const userId = subscriptionData.userId;
    const userRef = db.collection("users").doc(userId);
    
    const userUpdate = {
      'subscription.status': updatedData.status,
      'subscription.currentPeriodEnd': updatedData.currentPeriodEnd,
      'subscription.planId': subscriptionData.planId,  // Mantener el plan ID
      'subscription.billingCycle': subscriptionData.billingCycle,  // Mantener el ciclo de facturación
      'hasActiveSubscription': updatedData.status === 'active' || updatedData.status === 'trialing',
      'lastSubscriptionUpdate': new Date().toISOString(),
    };
    
    console.log("Webhook - handleSubscriptionUpdated: Actualizando documento de usuario", userUpdate);
    
    await userRef.update(userUpdate);
    
    console.log("Webhook - handleSubscriptionUpdated: Procesamiento completado exitosamente");
  } catch (error) {
    console.error("Error al manejar la actualización de la suscripción:", error);
    throw error;
  }
}

// Manejar eliminación de suscripción
async function handleSubscriptionDeleted(subscription: any) {
  try {
    console.log("Webhook - handleSubscriptionDeleted: Procesando eliminación de suscripción", {
      subscriptionId: subscription.id
    });
    
    // Buscar la suscripción en Firestore
    const subscriptionsRef = db.collection("subscriptions");
    const snapshot = await subscriptionsRef.where("stripeSubscriptionId", "==", subscription.id).limit(1).get();

    if (snapshot.empty) {
      console.log(`No se encontró la suscripción con ID: ${subscription.id}`);
      return;
    }

    const subscriptionDoc = snapshot.docs[0];
    const subscriptionId = subscriptionDoc.id;
    const subscriptionData = subscriptionDoc.data();
    const userId = subscriptionData.userId;

    console.log("Webhook - handleSubscriptionDeleted: Suscripción encontrada", {
      subscriptionId,
      userId
    });

    // Actualizar el estado de la suscripción
    await subscriptionsRef.doc(subscriptionId).update({
      status: 'canceled',
      cancelAtPeriodEnd: true,
      updatedAt: new Date().toISOString(),
    });
    
    console.log("Webhook - handleSubscriptionDeleted: Suscripción marcada como cancelada");

    // Actualizar el usuario
    const userRef = db.collection("users").doc(userId);
    const userUpdate = {
      'subscription.status': 'canceled',
      'hasActiveSubscription': false,
      'lastSubscriptionUpdate': new Date().toISOString(),
    };
    
    console.log("Webhook - handleSubscriptionDeleted: Actualizando documento de usuario", userUpdate);
    
    await userRef.update(userUpdate);
    
    console.log("Webhook - handleSubscriptionDeleted: Procesamiento completado exitosamente");
  } catch (error) {
    console.error("Error al manejar la eliminación de la suscripción:", error);
    throw error;
  }
}

// Manejar pago de factura exitoso
async function handleInvoicePaymentSucceeded(invoice: any) {
  // Este evento se dispara cuando un pago recurrente es exitoso
  if (invoice.subscription) {
    try {
      console.log("Webhook - handleInvoicePaymentSucceeded: Procesando pago exitoso", {
        invoiceId: invoice.id,
        subscriptionId: invoice.subscription
      });
      
      // Actualizar la suscripción si es necesario
      const subscriptionsRef = db.collection("subscriptions");
      const snapshot = await subscriptionsRef.where("stripeSubscriptionId", "==", invoice.subscription).limit(1).get();

      if (!snapshot.empty) {
        const subscriptionDoc = snapshot.docs[0];
        const subscriptionId = subscriptionDoc.id;
        const subscriptionData = subscriptionDoc.data();
        const userId = subscriptionData.userId;
        
        console.log("Webhook - handleInvoicePaymentSucceeded: Suscripción encontrada", {
          subscriptionId,
          userId
        });
        
        // Obtener datos actualizados de Stripe
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        
        // Actualizar la suscripción con datos frescos
        const updatedData = {
          status: 'active',
          currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          updatedAt: new Date().toISOString(),
        };

        await subscriptionsRef.doc(subscriptionId).update(updatedData);
        
        console.log("Webhook - handleInvoicePaymentSucceeded: Suscripción actualizada", updatedData);

        // Actualizar el usuario
        const userRef = db.collection("users").doc(userId);
        const userUpdate = {
          'subscription.status': 'active',
          'subscription.currentPeriodEnd': updatedData.currentPeriodEnd,
          'hasActiveSubscription': true,
          'lastSubscriptionUpdate': new Date().toISOString(),
        };
        
        console.log("Webhook - handleInvoicePaymentSucceeded: Actualizando documento de usuario", userUpdate);
        
        await userRef.update(userUpdate);
        
        console.log("Webhook - handleInvoicePaymentSucceeded: Procesamiento completado exitosamente");
      } else {
        console.log(`No se encontró la suscripción con ID: ${invoice.subscription}`);
      }
    } catch (error) {
      console.error("Error al manejar el pago exitoso de la factura:", error);
      throw error;
    }
  } else {
    console.log("La factura no está asociada a una suscripción");
  }
}

// Manejar fallo en el pago de la factura
async function handleInvoicePaymentFailed(invoice: any) {
  if (invoice.subscription) {
    try {
      console.log("Webhook - handleInvoicePaymentFailed: Procesando pago fallido", {
        invoiceId: invoice.id,
        subscriptionId: invoice.subscription
      });
      
      // Actualizar la suscripción si es necesario
      const subscriptionsRef = db.collection("subscriptions");
      const snapshot = await subscriptionsRef.where("stripeSubscriptionId", "==", invoice.subscription).limit(1).get();

      if (!snapshot.empty) {
        const subscriptionDoc = snapshot.docs[0];
        const subscriptionId = subscriptionDoc.id;
        const subscriptionData = subscriptionDoc.data();
        const userId = subscriptionData.userId;
        
        console.log("Webhook - handleInvoicePaymentFailed: Suscripción encontrada", {
          subscriptionId,
          userId
        });
        
        // Obtener datos actualizados de Stripe
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        
        // Cambiar el estado a 'past_due' o el que reporte Stripe
        const updatedData = {
          status: subscription.status || 'past_due',
          updatedAt: new Date().toISOString(),
        };

        await subscriptionsRef.doc(subscriptionId).update(updatedData);
        
        console.log("Webhook - handleInvoicePaymentFailed: Suscripción actualizada", updatedData);

        // Actualizar el usuario
        const userRef = db.collection("users").doc(userId);
        const userUpdate = {
          'subscription.status': updatedData.status,
          'hasActiveSubscription': updatedData.status === 'active' || updatedData.status === 'trialing',
          'lastSubscriptionUpdate': new Date().toISOString(),
        };
        
        console.log("Webhook - handleInvoicePaymentFailed: Actualizando documento de usuario", userUpdate);
        
        await userRef.update(userUpdate);
        
        console.log("Webhook - handleInvoicePaymentFailed: Procesamiento completado exitosamente");
      } else {
        console.log(`No se encontró la suscripción con ID: ${invoice.subscription}`);
      }
    } catch (error) {
      console.error("Error al manejar el fallo del pago de la factura:", error);
      throw error;
    }
  } else {
    console.log("La factura no está asociada a una suscripción");
  }
} 