"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface SubscriptionBannerProps {
  className?: string;
}

export default function SubscriptionBanner({ className }: SubscriptionBannerProps) {
  const router = useRouter();
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncingSubscription, setSyncingSubscription] = useState(false);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/subscription/status");
      const data = await response.json();
      setSubscriptionStatus(data);
    } catch (error) {
      console.error("Error al obtener el estado de la suscripción:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    router.push("/plans");
  };
  
  const syncSubscription = async () => {
    try {
      setSyncingSubscription(true);
      toast.info("Sincronizando información de suscripción...");
      
      const response = await fetch("/api/subscription/update");
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message || "Suscripción sincronizada correctamente");
        // Actualizar la información de suscripción
        fetchSubscriptionStatus();
      } else {
        toast.error(data.message || "Error al sincronizar la suscripción");
      }
    } catch (error) {
      console.error("Error al sincronizar la suscripción:", error);
      toast.error("Error al sincronizar la información de suscripción");
    } finally {
      setSyncingSubscription(false);
    }
  };

  // Determinar el mensaje y el icono según el estado de la suscripción
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
          <span>Cargando información de suscripción...</span>
        </div>
      );
    }

    if (!subscriptionStatus) return null;

    switch (subscriptionStatus.type) {
      case "plan":
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>
                <strong>{subscriptionStatus.planName}</strong> - Activo hasta{" "}
                {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={syncSubscription}
              disabled={syncingSubscription}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", syncingSubscription && "animate-spin")} />
              {syncingSubscription ? "Sincronizando..." : "Sincronizar"}
            </Button>
          </div>
        );
      case "trial":
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span>
                <strong>Período de prueba</strong> - Te quedan {subscriptionStatus.daysLeft} días
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={syncSubscription}
              disabled={syncingSubscription}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", syncingSubscription && "animate-spin")} />
              {syncingSubscription ? "Sincronizando..." : "Sincronizar"}
            </Button>
          </div>
        );
      case "expired":
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <span>No tienes un plan activo</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={syncSubscription}
                disabled={syncingSubscription}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", syncingSubscription && "animate-spin")} />
                {syncingSubscription ? "Sincronizando..." : "Sincronizar"}
              </Button>
              <Button variant="default" size="sm" onClick={handleUpgrade}>
                Obtener plan
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!subscriptionStatus && !loading) return null;

  return (
    <div
      className={cn(
        "py-2 px-4 text-sm bg-muted/50 border rounded-lg flex items-center justify-between",
        className
      )}
    >
      {renderContent()}
    </div>
  );
} 