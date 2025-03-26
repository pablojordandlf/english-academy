"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Settings, Sparkles, Clock, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';

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
  const [isMinimized, setIsMinimized] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        const response = await fetch('/api/subscription/status');
        const data = await response.json();
        setSubscriptionStatus(data);
      } catch (error) {
        console.error('Error al obtener el estado de la suscripción:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, []);

  if (loading) return null;
  if (!subscriptionStatus) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusIcon = () => {
    switch (subscriptionStatus.type) {
      case 'plan':
        return <Sparkles className="w-4 h-4 text-primary-500" />;
      case 'trial':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "fixed right-4 z-50",
      "bg-gray-800/90 backdrop-blur-sm",
      "rounded-xl shadow-lg border border-gray-700/50",
      "transform transition-all duration-300 ease-in-out",
      "hover:shadow-xl hover:shadow-primary-500/5",
      isMinimized ? "top-[72px]" : "top-20",
      className
    )}>
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isMinimized ? "opacity-75" : "opacity-100"
      )}>
        {isMinimized ? (
          // Diseño minimizado
          <div className="px-3 py-2 flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm text-gray-300">
              {subscriptionStatus.type === 'plan' ? subscriptionStatus.planName :
               subscriptionStatus.type === 'trial' ? `${subscriptionStatus.daysLeft} días restantes` :
               'Período de prueba expirado'}
            </span>
            <button
              onClick={() => setIsMinimized(false)}
              className="ml-auto p-1 rounded-full hover:bg-gray-700/50 transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        ) : (
          // Diseño expandido
          <div className="px-4 py-3 text-sm max-w-[90vw] md:max-w-md">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div className="flex flex-col">
                  <span className="text-gray-400">
                    {subscriptionStatus.type === 'plan' ? 'Plan actual' :
                     subscriptionStatus.type === 'trial' ? 'Período de prueba' :
                     'Período de prueba expirado'}
                  </span>
                  <span className="font-medium text-white">
                    {subscriptionStatus.type === 'plan' ? subscriptionStatus.planName :
                     subscriptionStatus.type === 'trial' ? `${subscriptionStatus.daysLeft} días restantes` :
                     'Activa tu suscripción para acceder a todas las funcionalidades'}
                  </span>
                  {subscriptionStatus.currentPeriodEnd && (
                    <span className="text-xs text-gray-400">
                      {subscriptionStatus.type === 'plan' ? `Renovación: ${formatDate(subscriptionStatus.currentPeriodEnd)}` :
                       subscriptionStatus.type === 'trial' ? `Termina: ${formatDate(subscriptionStatus.currentPeriodEnd)}` :
                       null}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {subscriptionStatus.type === 'plan' && (
                  <Button
                    onClick={() => router.push('/settings/subscription')}
                    variant="outline"
                    size="sm"
                    className="border-primary-500 text-primary-500 hover:bg-primary-500/10"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Ver detalles
                  </Button>
                )}
                
                {(subscriptionStatus.type === 'trial' || subscriptionStatus.type === 'expired') && (
                  <Button
                    onClick={() => router.push('/plans')}
                    variant="outline"
                    size="sm"
                    className="border-primary-500 text-primary-500 hover:bg-primary-500/10"
                  >
                    {subscriptionStatus.type === 'trial' ? 'Contratar plan' : 'Ver planes'}
                  </Button>
                )}
                
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors"
                >
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionBanner;