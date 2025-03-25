"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Definición del plan Premium
const premiumPlan = {
  name: "Premium",
  icon: Zap,
  price: "19.99",
  description: "Acceso completo a todas las funcionalidades",
  features: [
    "Clases ilimitadas",
    "Acceso a todos los niveles",
    "Feedback detallado",
    "Soporte prioritario",
    "Acceso a recursos exclusivos",
    "Corrección de pronunciación",
    "Ejercicios personalizados"
  ],
  gradient: "from-purple-500 to-purple-600",
  popular: true,
  tag: "RECOMENDADO",
  planId: "PREMIUM",
};

type UserStatus = {
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  hasTrial: boolean;
  trialEndsAt: Date | null;
  canAccessClasses: boolean;
};

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [userStatus, setUserStatus] = useState<UserStatus>({
    isAuthenticated: false,
    hasActiveSubscription: false,
    hasTrial: false,
    trialEndsAt: null,
    canAccessClasses: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        const isUserAuthenticated = !!data.user;
        let canAccessClasses = false;

        if (isUserAuthenticated) {
          const hasActiveSubscription = !!data.user.subscription;
          const hasTrial = !!data.user.trialEndsAt && data.user.trialActive === true;
          const trialEndsAt = data.user.trialEndsAt ? new Date(data.user.trialEndsAt) : null;

          // Verificar si el usuario puede acceder a las clases
          if (hasActiveSubscription) {
            canAccessClasses = true;
          } else if (hasTrial && trialEndsAt) {
            const now = new Date();
            canAccessClasses = trialEndsAt > now;
          }

          setUserStatus({
            isAuthenticated: true,
            hasActiveSubscription,
            hasTrial,
            trialEndsAt,
            canAccessClasses,
          });
        } else {
          setUserStatus({
            isAuthenticated: false,
            hasActiveSubscription: false,
            hasTrial: false,
            trialEndsAt: null,
            canAccessClasses: false,
          });
        }
      } catch (error) {
        console.error("Error al verificar estado del usuario:", error);
        setUserStatus({
          isAuthenticated: false,
          hasActiveSubscription: false,
          hasTrial: false,
          trialEndsAt: null,
          canAccessClasses: false,
        });
      }
    };

    checkUserStatus();
  }, []);

  const handleTrialStart = async () => {
    setIsLoading(true);
    try {
      if (userStatus.isAuthenticated) {
        if (userStatus.hasActiveSubscription) {
          console.log("Usuario con suscripción activa, redirigiendo al dashboard");
          router.push('/dashboard');
        } else if (userStatus.hasTrial) {
          // Si tiene período de prueba
          if (userStatus.trialEndsAt) {
            const now = new Date();
            if (userStatus.trialEndsAt > now) {
              console.log("Usuario con prueba activa, redirigiendo al dashboard");
              router.push('/dashboard');
            } else {
              console.log("Usuario con prueba expirada, redirigiendo al checkout");
              router.push(`/checkout?plan=${premiumPlan.planId}&billing=${billingCycle}`);
            }
          }
        } else {
          // Si está autenticado pero no tiene período de prueba, activarlo
          console.log("Usuario sin prueba, activando prueba gratuita");
          try {
            const response = await fetch('/api/subscription/activate-trial', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                planId: premiumPlan.planId,
                billingCycle,
              }),
            });

            const data = await response.json();

            if (data.success) {
              toast.success("¡Período de prueba activado correctamente!");
              router.push("/dashboard");
            } else {
              toast.error(data.message || "No se pudo activar el período de prueba");
              console.error("Error al activar la prueba:", data);
            }
          } catch (error) {
            console.error("Error al activar la prueba:", error);
            toast.error("Error al activar la prueba. Inténtalo de nuevo.");
          }
        }
      } else {
        // Si no está autenticado, redirigir al registro
        console.log("Usuario no autenticado, redirigiendo al registro");
        router.push('/sign-up');
      }
    } catch (error) {
      console.error("Error al iniciar la prueba:", error);
      toast.error("Error al procesar tu solicitud. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscription = async () => {
    setIsLoading(true);
    try {
      if (userStatus.isAuthenticated) {
        if (userStatus.hasActiveSubscription) {
          router.push('/dashboard');
        } else {
          router.push(`/checkout?plan=${premiumPlan.planId}&billing=${billingCycle}`);
        }
      } else {
        router.push(`/sign-up?plan=${premiumPlan.planId}&billing=${billingCycle}`);
      }
    } catch (error) {
      console.error("Error al procesar la suscripción:", error);
      toast.error("Error al procesar tu solicitud. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl z-0"></div>
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block rounded-full bg-primary-500/10 px-4 py-1.5 mb-4">
            <span className="text-primary-300 text-sm font-medium">PLAN PREMIUM</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Desbloquea tu potencial con MyBubbly
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Incluye 7 días de prueba gratuita. Cancela cuando quieras.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-gray-800/50 p-1 rounded-full shadow-lg backdrop-blur-sm">
            <div className="flex">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-primary-500 text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  billingCycle === "yearly"
                    ? "bg-primary-500 text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Anual
              </button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 flex flex-col border-2 border-primary-500 transform transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                {premiumPlan.tag}
              </span>
            </div>
            
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${premiumPlan.gradient} text-white mr-4`}>
                <premiumPlan.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">{premiumPlan.name}</h3>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-5xl font-bold text-white">
                  ${billingCycle === "yearly" ? (Number(premiumPlan.price) * 0.8).toFixed(2) : premiumPlan.price}
                </span>
                <span className="text-gray-400 ml-2">/mes</span>
              </div>
              {billingCycle === "yearly" && (
                <p className="text-sm text-green-400 mt-1">Ahorra 20% con el plan anual</p>
              )}
            </div>

            <p className="text-gray-300 mb-8">{premiumPlan.description}</p>

            <ul className="space-y-4 mb-8 flex-grow">
              {premiumPlan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-primary-500 mr-3" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-4">
              <Button
                onClick={handleTrialStart}
                disabled={isLoading}
                className="w-full py-6 text-lg font-semibold transition-all duration-300 bg-primary-500 hover:bg-primary-600 text-white"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Procesando...
                  </>
                ) : userStatus.hasActiveSubscription ? (
                  "Acceder a mi cuenta"
                ) : userStatus.hasTrial ? (
                  userStatus.canAccessClasses ? "Continuar con mi prueba" : "Renovar suscripción"
                ) : (
                  "Comenzar prueba gratuita"
                )}
              </Button>

              <Button
                onClick={handleSubscription}
                disabled={isLoading}
                variant="outline"
                className="w-full py-6 text-lg font-semibold transition-all duration-300 border-primary-500 text-primary-500 hover:bg-primary-500/10"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Procesando...
                  </>
                ) : userStatus.hasActiveSubscription ? (
                  "Gestionar suscripción"
                ) : !userStatus.canAccessClasses ? (
                  "Activar suscripción"
                ) : (
                  "Suscribirme ahora"
                )}
              </Button>
            </div>
            
            <p className="text-xs text-center text-gray-400 mt-3">
              {userStatus.hasTrial && !userStatus.canAccessClasses ? (
                "Tu período de prueba ha expirado. Activa tu suscripción para continuar."
              ) : (
                "Incluye 7 días de prueba gratuita. Cancela cuando quieras."
              )}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}