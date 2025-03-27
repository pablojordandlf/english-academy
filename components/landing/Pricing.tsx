"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";

// Definición del plan Premium
const premiumPlan = {
  name: "Premium",
  icon: Zap,
  price: "9.99",
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

const PricingCard = ({ plan, isPopular, discount }: { plan: any; isPopular?: boolean; discount?: boolean }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: plan.index * 0.1
      }
    }
  };

  const originalPrice = plan.price;
  const discountedPrice = discount ? originalPrice * 0.5 : originalPrice;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={`relative group ${
        isPopular ? "lg:scale-105" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
          Más Popular
        </div>
      )}
      
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-primary-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary-500/10">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">
              ${discountedPrice}
              {discount && (
                <span className="text-lg text-primary-300 ml-2 line-through">
                  ${originalPrice}
                </span>
              )}
            </span>
            <span className="text-gray-400">/mes</span>
          </div>
          {discount && (
            <div className="mt-2 inline-block bg-primary-500/20 text-primary-300 text-sm px-2 py-1 rounded-full">
              ¡50% OFF con el código WELCOME50!
            </div>
          )}
        </div>

        <ul className="space-y-4 mb-8">
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-primary-300 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
            isPopular
              ? "bg-primary-500 hover:bg-primary-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
        >
          Comenzar Ahora
        </button>
      </div>
    </motion.div>
  );
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
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
          router.push('/dashboard');
        } else if (userStatus.hasTrial) {
          if (userStatus.trialEndsAt) {
            const now = new Date();
            if (userStatus.trialEndsAt > now) {
              router.push('/dashboard');
            } else {
              router.push(`/checkout?plan=${premiumPlan.planId}&billing=${billingCycle}&code=WELCOME50`);
            }
          }
        } else {
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
            }
          } catch (error) {
            console.error("Error al activar la prueba:", error);
            toast.error("Error al activar la prueba. Inténtalo de nuevo.");
          }
        }
      } else {
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
          router.push(`/checkout?plan=${premiumPlan.planId}&billing=${billingCycle}&code=WELCOME50`);
        }
      } else {
        router.push(`/sign-up?plan=${premiumPlan.planId}&billing=${billingCycle}&code=WELCOME50`);
      }
    } catch (error) {
      console.error("Error al procesar la suscripción:", error);
      toast.error("Error al procesar tu solicitud. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const originalPrice = Number(premiumPlan.price);
  const discountedPrice = originalPrice * 0.5;

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block rounded-full bg-primary-500/10 px-4 py-1.5 mb-4">
            <span className="text-primary-300 text-sm font-medium tracking-wider">PLAN PREMIUM</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Desbloquea tu potencial con MyBabbly
          </h2>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Incluye 7 días de prueba gratuita. Cancela cuando quieras.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
                  {billingCycle === "yearly" ? (Number(discountedPrice) * 0.8).toFixed(2) : discountedPrice.toFixed(2)} €
                </span>
                <span className="text-gray-400 ml-2">/mes</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg text-gray-400 line-through">
                  {billingCycle === "yearly" ? (Number(originalPrice) * 0.8).toFixed(2) : originalPrice.toFixed(2)} €
                </span>
                <span className="bg-primary-500/20 text-primary-300 text-sm px-2 py-1 rounded-full">
                  50% OFF con el código WELCOME50
                </span>
              </div>
              {billingCycle === "yearly" && (
                <p className="text-sm text-green-400 mt-1">Ahorra 20% adicional con el plan anual</p>
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
                variant="outline"
                className="w-full py-6 text-lg font-semibold transition-all duration-300 border-primary-500 text-primary-500 hover:bg-primary-500/10"
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
                
                className="w-full py-6 text-lg font-semibold transition-all duration-300 bg-primary-500 hover:bg-primary-600 text-white"
                
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