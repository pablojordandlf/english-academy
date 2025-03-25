"use server";

import { auth, db } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { createId } from "@paralleldrive/cuid2";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email, planInfo } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "El usuario ya existe. Por favor, inicia sesión.",
      };

    // Crear un objeto base de usuario
    const userData: any = {
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    // Si hay información del plan, crear una suscripción pendiente
    if (planInfo) {
      // Establecer la fecha de prueba (7 días desde hoy)
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);
      
      userData.pendingSubscription = {
        plan: planInfo.plan,
        billingCycle: planInfo.billingCycle,
        createdAt: new Date().toISOString()
      };
      
      userData.trialEndsAt = trialEndDate.toISOString();
    } else {
      // Si no hay plan, asignar una clase de prueba
      userData.trialClass = {
        available: true,
        used: false
      };
    }

    // save user to db
    await db.collection("users").doc(uid).set(userData);

    return {
      success: true,
      message: "Cuenta creada correctamente.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Este email ya está en uso",
      };
    }

    return {
      success: false,
      message: "Error al crear la cuenta. Por favor, inténtalo de nuevo.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "El usuario no existe. Crea una cuenta.",
      };

    await setSessionCookie(idToken);
    
    return { success: true };
  } catch (error: any) {
    console.log("Error en signIn:", error);

    return {
      success: false,
      message: "Error al iniciar sesión. Por favor, inténtalo de nuevo.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = cookies();
  cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
