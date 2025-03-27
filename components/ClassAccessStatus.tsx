"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, ArrowUpCircle, Calendar, Lock } from "lucide-react";
import { toast } from "sonner";

interface ClassAccessStatusProps {
  showCta?: boolean;
}

export default function ClassAccessStatus({ showCta = true }: ClassAccessStatusProps) {
  const [canTakeClasses, setCanTakeClasses] = useState<boolean | null>(null);
  const [accessInfo, setAccessInfo] = useState<{
    status: 'active' | 'expired' | 'none';
    trialEndsAt?: string;
    subscriptionEndsAt?: string;
    daysLeft?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Primero verificamos el acceso a clases
        const response = await fetch('/api/subscription/can-take-classes');
        const data = await response.json();
        setCanTakeClasses(data.canTakeClasses);
        
        // Luego obtenemos información detallada
        const userResponse = await fetch('/api/auth/me');
        const userData = await userResponse.json();
        
        if (userData.user) {
          const user = userData.user;
          const now = new Date();
          
          if (user.subscription?.status === 'active') {
            // Usuario con suscripción activa
            setAccessInfo({
              status: 'active',
              subscriptionEndsAt: user.subscription.currentPeriodEnd,
            });
          } else if (user.trialEndsAt && user.trialActive) {
            // Usuario con prueba activa
            const trialEndsAt = new Date(user.trialEndsAt);
            const daysLeft = Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysLeft > 0) {
              setAccessInfo({
                status: 'active',
                trialEndsAt: user.trialEndsAt,
                daysLeft
              });
            } else {
              setAccessInfo({ status: 'expired' });
            }
          } else if (user.trialEndsAt && !user.trialActive) {
            // Usuario con prueba expirada
            setAccessInfo({ status: 'expired' });
          } else {
            // Usuario sin prueba ni suscripción
            setAccessInfo({ status: 'none' });
          }
        }
      } catch (error) {
        console.error("Error al verificar acceso a clases:", error);
        setCanTakeClasses(false);
        setAccessInfo({ status: 'none' });
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, []);

  const handleUpgradeClick = () => {
    router.push('/plans');
  };
  
  const handleTrialClick = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscription/activate-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: 'PREMIUM',
          billingCycle: 'monthly',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("¡Período de prueba activado correctamente!");
        window.location.reload();
      } else {
        toast.error(data.message || "No se pudo activar el período de prueba");
      }
    } catch (error) {
      console.error("Error al activar la prueba:", error);
      toast.error("Error al activar la prueba. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
        <div className="space-y-4">
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
          </div>
          
          {accessInfo?.status === 'active' && (
            <div className="bg-gray-700/50 rounded-lg p-4 mt-2">
              {accessInfo.daysLeft !== undefined ? (
                // Muestra información de la prueba
                <div className="flex items-start">
                  <Clock className="text-primary-400 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-primary-300 font-medium">Período de prueba activo</p>
                    <p className="text-gray-300 text-sm mt-1">
                      Te quedan <span className="font-semibold text-primary-300">{accessInfo.daysLeft} días</span> de prueba gratuita.
                      Finaliza el {formatDate(accessInfo.trialEndsAt || '')}.
                    </p>
                    {showCta && (
                      <Button
                        onClick={handleUpgradeClick}
                        variant="outline" 
                        size="sm"
                        className="mt-3 border-primary-500 text-primary-500 hover:bg-primary-500/10"
                      >
                        <ArrowUpCircle className="mr-2 h-4 w-4" />
                        Contratar plan
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                // Muestra información de la suscripción
                <div className="flex items-start">
                  <Check className="text-green-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-medium">Suscripción activa</p>
                    {accessInfo.subscriptionEndsAt && (
                      <p className="text-gray-300 text-sm mt-1">
                        Próxima renovación: {formatDate(accessInfo.subscriptionEndsAt)}
                      </p>
                    )}
                    {showCta && (
                      <Button
                        onClick={() => router.push('/settings/subscription')}
                        variant="outline" 
                        size="sm"
                        className="mt-3 border-primary-500 text-primary-500 hover:bg-primary-500/10"
                      >
                        Gestionar suscripción
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <Button 
            onClick={() => router.push('/dashboard/new-class')}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            Recibir una clase
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
          
          <div className="bg-gray-700/50 rounded-lg p-4 mt-2">
            {accessInfo?.status === 'expired' ? (
              <div className="flex items-start">
                <Calendar className="text-red-400 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-400 font-medium">Período de prueba expirado</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Tu período de prueba gratuita ha finalizado. Para continuar accediendo a las clases,
                    es necesario que actives un plan de suscripción.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <Lock className="text-yellow-400 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-yellow-400 font-medium">Acceso no activado</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Para acceder a las clases, activa tu período de prueba gratuita o contrata un plan.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {showCta && (
            <div className="flex gap-3 flex-wrap">
              {accessInfo?.status === 'none' && (
                <Button 
                  onClick={handleTrialClick}
                  className="bg-primary-500 hover:bg-primary-600 text-white"
                  disabled={loading}
                >
                  {loading && <div className="animate-spin mr-2">⟳</div>}
                  Activar prueba gratuita
                </Button>
              )}
              <Button 
                onClick={handleUpgradeClick}
                className={accessInfo?.status === 'none' ? "bg-white/10 hover:bg-white/20 text-white" : "bg-primary-500 hover:bg-primary-600 text-white"}
              >
                <ArrowUpCircle className="mr-2 h-4 w-4" />
                {accessInfo?.status === 'none' ? "Ver planes" : "Activar suscripción"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 