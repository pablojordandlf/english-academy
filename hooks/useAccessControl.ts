import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UserAccess {
  canAccessClasses: boolean;
  hasActiveSubscription: boolean;
  hasTrial: boolean;
  trialEndsAt: Date | null;
  subscriptionStatus: 'active' | 'trialing' | 'expired' | 'none';
  needsRefresh: boolean;
  planDetails?: {
    planId: string;
    planName: string;
    currentPeriodEnd?: string;
    status: string;
  } | null;
}

export function useAccessControl() {
  const [userAccess, setUserAccess] = useState<UserAccess>({
    canAccessClasses: false,
    hasActiveSubscription: false,
    hasTrial: false,
    trialEndsAt: null,
    subscriptionStatus: 'none',
    needsRefresh: false,
    planDetails: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        console.log("useAccessControl: Iniciando verificación de acceso");
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (!data.user) {
          console.log("useAccessControl: Usuario no autenticado");
          setUserAccess({
            canAccessClasses: false,
            hasActiveSubscription: false,
            hasTrial: false,
            trialEndsAt: null,
            subscriptionStatus: 'none',
            needsRefresh: false,
            planDetails: null
          });
          return;
        }

        console.log("useAccessControl: Datos del usuario obtenidos", {
          userData: data.user,
          hasSubscription: !!data.user.subscription,
          trialEndsAt: data.user.trialEndsAt,
          trialActive: data.user.trialActive,
          needsRefresh: data.user.needsRefresh
        });

        // Verificar si tiene una suscripción
        const hasSubscription = !!data.user.subscription;
        
        // Una suscripción está activa si:
        // 1. Existe AND
        // 2. Su status es 'active' O 'trialing'
        const hasActiveSubscription = hasSubscription && 
          (data.user.subscription.status === 'active' || 
           data.user.subscription.status === 'trialing');
        
        // Verificar si tiene un período de prueba activo
        const hasTrial = !!data.user.trialEndsAt && data.user.trialActive === true;
        const trialEndsAt = data.user.trialEndsAt ? new Date(data.user.trialEndsAt) : null;
        const now = new Date();

        let canAccessClasses = false;
        let subscriptionStatus: UserAccess['subscriptionStatus'] = 'none';
        let planDetails = null;

        console.log("useAccessControl: Evaluando estado de acceso", {
          hasSubscription,
          hasActiveSubscription,
          hasTrial,
          trialEndsAt,
          now,
          trialIsValid: trialEndsAt ? trialEndsAt > now : false,
          subscriptionDetails: data.user.subscription,
          subscriptionStatus: hasSubscription ? data.user.subscription.status : 'none'
        });

        // Si tiene una suscripción activa, tendrá acceso independientemente del estado de la prueba
        if (hasActiveSubscription) {
          canAccessClasses = true;
          subscriptionStatus = data.user.subscription.status === 'trialing' ? 'trialing' : 'active';
          console.log("useAccessControl: Usuario con suscripción activa, acceso permitido", {
            status: subscriptionStatus
          });
          
          // Guardar detalles del plan
          planDetails = {
            planId: data.user.subscription.planId,
            planName: data.user.subscription.planId === 'PREMIUM' ? 'Plan Premium' : 'Plan Básico',
            currentPeriodEnd: data.user.subscription.currentPeriodEnd,
            status: data.user.subscription.status
          };
        } 
        // Si no tiene suscripción activa pero sí un período de prueba válido
        else if (hasTrial && trialEndsAt) {
          if (trialEndsAt > now) {
            canAccessClasses = true;
            subscriptionStatus = 'trialing';
            console.log("useAccessControl: Usuario con prueba activa y vigente, acceso permitido", {
              diasRestantes: Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
            });
          } else {
            subscriptionStatus = 'expired';
            console.log("useAccessControl: Usuario con prueba expirada, acceso denegado", {
              trialEndsAt,
              now,
            });
          }
        } else {
          console.log("useAccessControl: Usuario sin suscripción ni prueba, acceso denegado");
        }

        const newUserAccess = {
          canAccessClasses,
          hasActiveSubscription,
          hasTrial,
          trialEndsAt,
          subscriptionStatus,
          needsRefresh: data.user.needsRefresh || false,
          planDetails
        };

        console.log("useAccessControl: Estado de acceso final", newUserAccess);
        setUserAccess(newUserAccess);
        
        // Si el usuario necesita un refresh de la página debido a cambios en su estado
        if (data.user.needsRefresh) {
          console.log("useAccessControl: Se requiere actualizar la página");
          window.location.reload();
        }
      } catch (error) {
        console.error('useAccessControl: Error al verificar acceso:', error);
        setUserAccess({
          canAccessClasses: false,
          hasActiveSubscription: false,
          hasTrial: false,
          trialEndsAt: null,
          subscriptionStatus: 'none',
          needsRefresh: false,
          planDetails: null
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, []);

  const handleAccessAttempt = () => {
    console.log("useAccessControl: Intento de acceso a clases", userAccess);
    if (!userAccess.canAccessClasses) {
      switch (userAccess.subscriptionStatus) {
        case 'none':
          toast.error('Necesitas activar tu período de prueba para acceder a las clases');
          console.log("useAccessControl: Acceso denegado - sin prueba ni suscripción");
          break;
        case 'expired':
          toast.error('Tu período de prueba ha expirado. Activa tu suscripción para continuar');
          console.log("useAccessControl: Acceso denegado - prueba expirada");
          break;
        default:
          toast.error('No tienes acceso a las clases en este momento');
          console.log("useAccessControl: Acceso denegado - razón desconocida");
      }
      router.push('/plans');
      return false;
    }
    console.log("useAccessControl: Acceso permitido");
    return true;
  };

  return {
    userAccess,
    isLoading,
    handleAccessAttempt,
  };
} 