"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Settings } from 'lucide-react';

interface SubscriptionBannerProps {
  className?: string;
}

interface SubscriptionStatus {
  type: 'plan' | 'trial' | 'expired';
  planName?: string;
  daysLeft?: number;
  status?: string;
  currentPeriodEnd?: string;
}

const SubscriptionBanner = ({ className }: SubscriptionBannerProps) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        console.log("SubscriptionBanner: Obteniendo estado de suscripción");
        const response = await fetch('/api/subscription/status');
        const data = await response.json();
        console.log("SubscriptionBanner: Datos recibidos", data);
        setSubscriptionStatus(data);
      } catch (error) {
        console.error('Error al obtener el estado de la suscripción:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, []);

  if (loading) {
    console.log("SubscriptionBanner: Cargando datos...");
    return null;
  }
  
  if (!subscriptionStatus) {
    console.log("SubscriptionBanner: No hay datos de suscripción");
    return null;
  }

  console.log("SubscriptionBanner: Estado de suscripción", subscriptionStatus);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50",
      "bg-gray-800/90 backdrop-blur-sm",
      "rounded-lg shadow-lg border border-gray-700",
      "px-4 py-3 text-sm flex items-center gap-4",
      className
    )}>
      {subscriptionStatus.type === 'plan' && (
        <>
          <div className="flex flex-col">
            <span className="text-gray-400">Plan actual:</span>
            <span className="font-medium text-white">{subscriptionStatus.planName}</span>
            {subscriptionStatus.currentPeriodEnd && (
              <span className="text-xs text-gray-400">
                Renovación: {formatDate(subscriptionStatus.currentPeriodEnd)}
              </span>
            )}
          </div>
          <Button
            onClick={() => router.push('/settings/subscription')}
            variant="outline"
            size="sm"
            className="ml-2 border-primary-500 text-primary-500 hover:bg-primary-500/10"
          >
            <Settings className="w-4 h-4 mr-2" />
            Ver detalles
          </Button>
        </>
      )}
      
      {subscriptionStatus.type === 'trial' && (
        <>
          <div className="flex flex-col">
            <span className="text-gray-400">Período de prueba:</span>
            <span className="font-medium text-white">{subscriptionStatus.daysLeft} días restantes</span>
            {subscriptionStatus.currentPeriodEnd && (
              <span className="text-xs text-gray-400">
                Termina: {formatDate(subscriptionStatus.currentPeriodEnd)}
              </span>
            )}
          </div>
          <Button
            onClick={() => router.push('/plans')}
            variant="outline"
            size="sm"
            className="ml-2 border-primary-500 text-primary-500 hover:bg-primary-500/10"
          >
            Contratar plan
          </Button>
        </>
      )}
      
      {subscriptionStatus.type === 'expired' && (
        <>
          <div className="flex flex-col">
            <span className="text-gray-400">Período de prueba expirado</span>
            <span className="text-xs text-gray-400">
              Activa tu suscripción para acceder a todas las funcionalidades
            </span>
          </div>
          <Button
            onClick={() => router.push('/plans')}
            variant="outline"
            size="sm"
            className="ml-2 border-primary-500 text-primary-500 hover:bg-primary-500/10"
          >
            Ver planes
          </Button>
        </>
      )}
    </div>
  );
}

export default SubscriptionBanner;