"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createCheckoutSession } from "@/lib/actions/subscription.action";
import { Button } from "@/components/ui/button";
import { Loader2, Check, ShieldCheck, Tag } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isCouponValid, setIsCouponValid] = useState<boolean | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [activatingTrial, setActivatingTrial] = useState(false);

  // Obtener la información del plan de los parámetros de búsqueda
  const plan = searchParams.get('plan');
  const billing = searchParams.get('billing') as 'monthly' | 'yearly';

  useEffect(() => {
    // Verificar que existan los parámetros necesarios
    if (!plan || !billing) {
      toast.error("Información del plan incompleta");
      router.push("/plans");
      return;
    }

    // Obtener el ID de usuario de la cookie de sesión
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (data.user?.id) {
          setUserId(data.user.id);
        } else {
          // Si no hay usuario autenticado, almacenar la URL actual en sessionStorage
          // para redirigir después de iniciar sesión
          sessionStorage.setItem('redirectAfterLogin', `/checkout?plan=${plan}&billing=${billing}`);
          
          // Redirigir al inicio de sesión
          toast.error("Debes iniciar sesión para continuar");
          router.push(`/sign-in`);
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        toast.error("Error al verificar tu sesión");
      }
    };

    fetchUserId();
  }, [plan, billing, router]);

  const handleCheckout = async () => {
    if (!userId || !plan || !billing) {
      toast.error("Información incompleta para el checkout");
      return;
    }

    setLoading(true);

    try {
      // Crear la sesión de checkout
      const result = await createCheckoutSession({
        userId,
        planId: 'PREMIUM',
        billingCycle: billing,
        couponCode: appliedCoupon || undefined,
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
      });

      // Redirigir a la página de checkout de Stripe
      if (result?.url) {
        window.location.href = result.url;
      } else {
        throw new Error("Error al crear la sesión de checkout");
      }
    } catch (error) {
      console.error("Error en el checkout:", error);
      toast.error("Error al procesar el pago. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Introduce un código de cupón");
      return;
    }

    setIsApplyingCoupon(true);

    try {
      // Verificar el cupón
      const response = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          billingCycle: billing
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setAppliedCoupon(couponCode);
        setIsCouponValid(true);
        setDiscount(data.discount);
        toast.success(`Cupón aplicado: ${data.discount}% de descuento`);
      } else {
        setIsCouponValid(false);
        toast.error(data.message || "Cupón no válido");
      }
    } catch (error) {
      console.error("Error al verificar el cupón:", error);
      toast.error("Error al verificar el cupón");
      setIsCouponValid(false);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Obtener el precio según el plan y el ciclo de facturación
  const getPrice = () => {
    let basePrice = 0;
    
    if (billing === 'yearly') {
      basePrice = 15.99; // Precio anual con 20% de descuento ya aplicado
    } else {
      basePrice = 19.99; // Precio mensual
    }
    
    // Si hay un cupón aplicado y válido, aplicar el descuento
    if (appliedCoupon && isCouponValid && discount > 0) {
      return (basePrice * (1 - discount / 100)).toFixed(2);
    }
    
    return basePrice.toFixed(2);
  };

  // Activar período de prueba gratuito sin pago
  const handleActivateTrial = async () => {
    if (!userId || !plan || !billing) {
      toast.error("Información incompleta para activar la prueba");
      return;
    }

    setActivatingTrial(true);

    try {
      // Activar el período de prueba gratuito
      const response = await fetch('/api/subscription/activate-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planId: 'PREMIUM',
          billingCycle: billing,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Período de prueba activado correctamente");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Error al activar el período de prueba");
      }
    } catch (error) {
      console.error("Error al activar el período de prueba:", error);
      toast.error("Error al activar el período de prueba. Inténtalo de nuevo.");
    } finally {
      setActivatingTrial(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Finaliza tu compra
            </h1>
            <p className="text-gray-300">
              Estás a un paso de mejorar tu inglés con MyBubbly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
            <div className="md:col-span-4 bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-6">Resumen de tu pedido</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start pb-6 border-b border-gray-700">
                  <div className="bg-primary-500/10 p-3 rounded-lg">
                    <Image src="/logo.svg" alt="Plan" width={40} height={40} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">Plan {plan}</h3>
                    <p className="text-gray-300 text-sm mb-2">
                      {billing === 'monthly' ? 'Facturación mensual' : 'Facturación anual'}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-primary-300">
                      <Check className="w-4 h-4" />
                      <span>7 días de prueba gratis</span>
                    </div>
                  </div>
                  <div className="text-white font-semibold">
                    €{getPrice()}<span className="text-gray-400 text-sm">/mes</span>
                  </div>
                </div>

                {/* Sección de cupón de descuento */}
                <div className="border-b border-gray-700 pb-6">
                  <h3 className="text-white text-sm font-medium mb-3">¿Tienes un cupón de descuento?</h3>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Input
                        type="text"
                        placeholder="Introduce tu código"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={!!appliedCoupon || isApplyingCoupon}
                        className={`bg-gray-700/50 border ${
                          isCouponValid === true 
                            ? 'border-green-500 focus:border-green-500' 
                            : isCouponValid === false
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-600 focus:border-primary-500'
                        } text-white`}
                      />
                      {appliedCoupon && (
                        <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                      )}
                    </div>
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={!!appliedCoupon || isApplyingCoupon || !couponCode.trim()}
                      className="whitespace-nowrap bg-gray-700 hover:bg-gray-600 text-white"
                    >
                      {isApplyingCoupon ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : appliedCoupon ? (
                        "Aplicado"
                      ) : (
                        "Aplicar"
                      )}
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-green-400 text-xs mt-2">
                      Cupón "{appliedCoupon}" aplicado. Descuento del {discount}%.
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>€{billing === 'yearly' ? '19.99' : '19.99'}</span>
                  </div>
                  {billing === 'yearly' && (
                    <div className="flex justify-between text-green-500">
                      <span>Descuento plan anual (20%)</span>
                      <span>-€4.00</span>
                    </div>
                  )}
                  {appliedCoupon && isCouponValid && (
                    <div className="flex justify-between text-green-500">
                      <span>Cupón de descuento ({discount}%)</span>
                      <span>-€{((billing === 'yearly' ? 15.99 : 19.99) * discount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-white pt-3 border-t border-gray-700">
                    <span>Total</span>
                    <span>€{getPrice()}</span>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-gray-300">
                    Tu suscripción comenzará después del período de prueba de 7 días. 
                    Puedes cancelar en cualquier momento antes de que finalice la prueba 
                    y no se te cobrará nada.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-6">Método de pago</h2>
              
              <Button
                onClick={handleCheckout}
                disabled={loading || !userId}
                className="w-full py-6 bg-primary-500 hover:bg-primary-600 text-white transition-colors shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Proceder al pago"
                )}
              </Button>
              
              <div className="my-4 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-gray-800/70 px-2 text-gray-400">O</span>
                </div>
              </div>
              
              <Button
                onClick={handleActivateTrial}
                disabled={loading || activatingTrial || !userId}
                variant="outline"
                className="w-full py-6 bg-transparent border-primary-500 text-primary-400 hover:bg-primary-500/10 transition-colors"
              >
                {activatingTrial ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activando prueba...
                  </>
                ) : (
                  "Comenzar período de prueba sin pago"
                )}
              </Button>
              
              <p className="text-xs text-center text-gray-400 mt-3">
                Podrás usar todas las funciones durante 7 días. Configura tu pago antes de que termine la prueba.
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <ShieldCheck className="h-5 w-5 text-primary-500" />
                  <span>Pago seguro a través de Stripe</span>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <span className="text-gray-400 text-sm">Métodos de pago aceptados:</span>
                  <div className="flex gap-2">
                    <Image src="/payment/visa.svg" alt="Visa" width={32} height={20} />
                    <Image src="/payment/mastercard.svg" alt="Mastercard" width={32} height={20} />
                    <Image src="/payment/amex.svg" alt="American Express" width={32} height={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 