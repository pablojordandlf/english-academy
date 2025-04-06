"use server";

import { db } from "@/firebase/admin";

interface Interview {
  id: string;
  level: string;
  questions: string[];
  topic: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
}

export async function getAllPronunciationByUserId(userId: string): Promise<Interview[]> {
  try {
    console.log("Buscando clases de pronunciación para el usuario:", userId);
    
    const pronunciationSnapshot = await db
      .collection("pronunciation")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    
    console.log(`Se encontraron ${pronunciationSnapshot.size} documentos en la colección pronunciation`);
    
    if (pronunciationSnapshot.empty) {
      console.log("No se encontraron clases de pronunciación para el usuario");
      return [];
    }

    const interviews = pronunciationSnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Documento ${doc.id}:`, data);
      
      // Normalizar los timestamps de Firestore a strings ISO
      let createdAt = data.createdAt;
      if (createdAt && typeof createdAt.toDate === 'function') {
        createdAt = createdAt.toDate().toISOString();
      }
      
      return {
        id: doc.id,
        ...data,
        createdAt
      };
    }) as Interview[];
    
    console.log("Clases de pronunciación procesadas:", interviews);
    return interviews;
  } catch (error) {
    console.error("Error fetching pronunciation classes:", error);
    return [];
  }
} 