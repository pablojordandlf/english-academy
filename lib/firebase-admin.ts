import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Verificar que las variables de entorno necesarias estén definidas
if (!process.env.FIREBASE_PROJECT_ID || 
    !process.env.FIREBASE_CLIENT_EMAIL || 
    !process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('Las variables de entorno de Firebase Admin no están definidas correctamente');
}

// Inicializar Firebase Admin si no ha sido inicializado aún
const apps = getApps();

const firebaseAdminApp = !apps.length 
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      }),
    })
  : apps[0];

export const auth = getAuth(firebaseAdminApp);
export const db = getFirestore(firebaseAdminApp);

// Función para verificar la cookie de sesión
export async function verifySessionCookie(cookie: string) {
  try {
    return await auth.verifySessionCookie(cookie, true);
  } catch (error) {
    console.error('Error al verificar la cookie de sesión:', error);
    return null;
  }
} 