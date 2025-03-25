"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, ArrowUpCircle } from "lucide-react";

interface ClassAccessStatusProps {
  showCta?: boolean;
}

export default function ClassAccessStatus({ showCta = true }: ClassAccessStatusProps) {
  const [canTakeClasses, setCanTakeClasses] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch('/api/subscription/can-take-classes');
        const data = await response.json();
        setCanTakeClasses(data.canTakeClasses);
      } catch (error) {
        console.error("Error al verificar acceso a clases:", error);
        setCanTakeClasses(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, []);

  const handleUpgradeClick = () => {
    router.push('/plans');
  };

  if (loading) {
    return (
      <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg">
        <div className="flex justify-center items-center h-16">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Acceso a clases
      </h2>

      {canTakeClasses ? (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Check className="text-green-500 w-5 h-5 mr-2" />
            <span className="text-gray-300">
              Tienes acceso a clases ilimitadas
            </span>
            <Badge className="ml-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50">
              Activo
            </Badge>
          </div>
          <Button 
            onClick={() => router.push('/dashboard/new-class')}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            Tomar una clase
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center">
            <X className="text-red-500 w-5 h-5 mr-2" />
            <span className="text-gray-300">
              No tienes acceso a clases
            </span>
            <Badge className="ml-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50">
              Inactivo
            </Badge>
          </div>
          
          <p className="text-gray-400 text-sm">
            Para acceder a las clases, necesitas tener una suscripción activa o un período de prueba válido.
          </p>
          
          {showCta && (
            <Button 
              onClick={handleUpgradeClick}
              className="bg-primary-500 hover:bg-primary-600 text-white mt-2"
            >
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Activar suscripción
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 