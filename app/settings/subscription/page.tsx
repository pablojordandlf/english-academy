"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createPortalLink } from "@/lib/actions/subscription.action";
import { toast } from "sonner";
import { Loader2, CreditCard, Calendar, Check, Info } from "lucide-react";

interface SubscriptionInfo {
  status: string;
  currentPeriodEnd: string;
  planId: string;
  billingCycle: string;
  stripeCustomerId?: string;
  userId: string;
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscription/info');
        const data = await response.json();
        
        if (data.subscription) {
          setSubscription(data.subscription);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
        toast.error('No se pudo cargar la información de tu suscripción');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleManageSubscription = async () => {
    if (!subscription?.stripeCustomerId) {
      toast.error('No se encontró información del cliente de Stripe');
      return;
    }
    
    setRedirecting(true);
    
    try {
      const result = await createPortalLink({
        userId: subscription.userId,
        stripeCustomerId: subscription.stripeCustomerId,
        returnUrl: window.location.href
      });
      
      if (result?.url) {
        window.location.href = result.url;
      } else {
        throw new Error('No se pudo crear la sesión del portal');
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast.error('No se pudo acceder al portal de gestión');
      setRedirecting(false);
    }
  };

  // Formatear la fecha de fin del período actual
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Determinar el estado de la suscripción para mostrar
  const getStatusDisplay = () => {
    if (!subscription) return { text: 'Sin suscripción', color: 'text-gray-400' };
    
    switch (subscription.status) {
      case 'active':
        return { text: 'Activa', color: 'text-green-500' };
      case 'trialing':
        return { text: 'En período de prueba', color: 'text-blue-500' };
      case 'past_due':
        return { text: 'Pago pendiente', color: 'text-yellow-500' };
      case 'canceled':
        return { text: 'Cancelada', color: 'text-red-500' };
      default:
        return { text: subscription.status, color: 'text-gray-400' };
    }
  };

  // Obtener información del plan
  const getPlanInfo = () => {
    if (!subscription) return { name: 'N/A', price: 'N/A' };
    
    const planNames: Record<string, string> = {
      
      'PREMIUM': 'Premium',
      
    };
    
    const prices: Record<string, Record<string, string>> = {
      'PREMIUM': { 'monthly': '€19.99', 'yearly': '€15.99' }
    };
    
    return {
      name: planNames[subscription.planId] || subscription.planId,
      price: prices[subscription.planId]?.[subscription.billingCycle] || 'N/A'
    };
  };

  const statusDisplay = getStatusDisplay();
  const planInfo = getPlanInfo();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Mi suscripción
          </h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : !subscription ? (
            <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg">
              <div className="text-center py-8">
                <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">
                  No tienes una suscripción activa
                </h2>
                <p className="text-gray-300 mb-6">
                  Elige un plan para acceder a todas las funcionalidades premium.
                </p>
                <Button
                  onClick={() => window.location.href = '/plans'}
                  className="bg-primary-500 hover:bg-primary-600 text-white"
                >
                  Ver planes disponibles
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg">
              <div className="border-b border-gray-700 pb-6 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Detalles de la suscripción</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.color} bg-opacity-10 border border-current`}>
                    {statusDisplay.text}
                  </span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Plan actual</p>
                    <p className="text-white font-medium text-lg">{planInfo.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Precio</p>
                    <p className="text-white font-medium text-lg">
                      {planInfo.price}
                      <span className="text-gray-400 text-sm ml-1">
                        /{subscription.billingCycle === 'monthly' ? 'mes' : 'mes, facturado anualmente'}
                      </span>
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Método de pago</p>
                    <div className="flex items-center">
                      <CreditCard className="text-primary-400 w-5 h-5 mr-2" />
                      <p className="text-white">••••••••••••••••</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Próxima facturación</p>
                    <div className="flex items-center">
                      <Calendar className="text-primary-400 w-5 h-5 mr-2" />
                      <p className="text-white">{formatDate(subscription.currentPeriodEnd)}</p>
                    </div>
                  </div>
                </div>
                
                {subscription.status === 'trialing' && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 my-6">
                    <div className="flex">
                      <Info className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-blue-300 font-medium">Período de prueba activo</p>
                        <p className="text-blue-200/80 text-sm mt-1">
                          Tu período de prueba termina el {formatDate(subscription.currentPeriodEnd)}.
                          Después de esta fecha, se realizará el primer cobro según tu plan seleccionado.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="pt-6 border-t border-gray-700">
                  <h3 className="text-white font-medium mb-3">Incluido en tu plan:</h3>
                  <ul className="space-y-2">
                    {subscription.planId === 'BASIC' ? (
                      <>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary-500 mt-0.5" />
                          <span className="text-gray-300">5 clases por mes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary-500 mt-0.5" />
                          <span className="text-gray-300">Acceso a todos los niveles</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary-500 mt-0.5" />
                          <span className="text-gray-300">Feedback básico</span>
                        </li>
                      </>
                    ) : subscription.planId === 'PREMIUM' ? (
                      <>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary-500 mt-0.5" />
                          <span className="text-gray-300">Clases ilimitadas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary-500 mt-0.5" />
                          <span className="text-gray-300">Acceso a todos los niveles</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary-500 mt-0.5" />
                          <span className="text-gray-300">Feedback detallado</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary-500 mt-0.5" />
                          <span className="text-gray-300">Soporte prioritario</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary-500 mt-0.5" />
                          <span className="text-gray-300">Todo lo de Premium</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary-500 mt-0.5" />
                          <span className="text-gray-300">Gestión de equipos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary-500 mt-0.5" />
                          <span className="text-gray-300">Reportes y análisis</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 