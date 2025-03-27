"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccessControl } from "@/hooks/useAccessControl";
import Agent from "@/components/Agent";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";

const Page = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { userAccess, handleAccessAttempt, isLoading } = useAccessControl();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (!data.user) {
          router.push('/sign-in');
          return;
        }
        
        setUser(data.user);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        toast.error("Error al cargar tus datos");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Verificar acceso cuando la página carga
  useEffect(() => {
    if (!isLoading && !userAccess.canAccessClasses) {
      toast.error('No tienes acceso a las clases en este momento');
      router.push('/plans');
    }
  }, [isLoading, userAccess.canAccessClasses, router]);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si el usuario no tiene acceso, mostrar mensaje y botón para volver
  if (!userAccess.canAccessClasses) {
    return (
      <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-red-500/30 shadow-lg text-center my-8">
        <div className="rounded-full bg-red-500/10 p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Lock className="h-8 w-8 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4 text-red-300">
          Acceso restringido
        </h1>
        
        <p className="text-gray-300 max-w-md mx-auto mb-8">
          {userAccess.subscriptionStatus === 'expired' 
            ? "Tu período de prueba ha expirado. Contrata un plan para seguir accediendo a las clases."
            : "Necesitas activar tu período de prueba o contratar un plan para acceder a las clases."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="border-gray-600 hover:border-primary-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al dashboard
          </Button>
          
          <Button
            onClick={() => router.push('/plans')}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            Ver planes disponibles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Crear nueva clase
        </h2>
        <Button
          onClick={() => router.push('/dashboard')}
          variant="outline"
          size="sm"
          className="border-gray-700 hover:border-primary-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
      
      <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
        <p className="text-center text-gray-400 max-w-xl mx-auto mb-8">
          Habla con Gabby para definir tu nivel de inglés y los temas de conversación que quieres practicar en la clase.
        </p>
        <Agent
          userName={user?.name}
          userId={user?.id}
          type="generate"
        />
      </div>
    </>
  );
};

export default Page;
