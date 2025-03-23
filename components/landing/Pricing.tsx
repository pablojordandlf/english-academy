"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Básico",
      monthlyPrice: "€9.99",
      yearlyPrice: "€7.99",
      period: "por mes",
      description: "Perfecto para principiantes que buscan mejorar sus habilidades de inglés.",
      features: [
        "5 clases con el profesor AI al mes",
        "Seguimiento básico del progreso",
        "Soporte por email",
        "Acceso a lecciones para nivel principiante"
      ],
      cta: "Prueba gratuita de 7 días",
      href: "/sign-up",
      popular: false,
      tag: ""
    },
    {
      name: "Premium",
      monthlyPrice: "€19.99",
      yearlyPrice: "€15.99",
      period: "por mes",
      description: "Ideal para estudiantes comprometidos que quieren mejorar rápidamente.",
      features: [
        "Clases ilimitadas con el profesor AI",
        "Análisis avanzado del progreso",
        "Soporte prioritario",
        "Acceso a todo el contenido de lecciones",
        "Plan de aprendizaje personalizado",
        "Ejercicios de práctica ilimitados"
      ],
      cta: "Empieza ahora",
      href: "/sign-up",
      popular: true,
      tag: "MÁS POPULAR"
    },
    {
      name: "Empresas",
      monthlyPrice: "€49.99",
      yearlyPrice: "€39.99",
      period: "por mes",
      description: "Para profesionales y equipos que necesitan habilidades de inglés especializadas.",
      features: [
        "Todo lo incluido en Premium",
        "Vocabulario específico por industria",
        "Creación de escenarios personalizados",
        "Panel de análisis para equipos",
        "Gestor de cuenta dedicado",
        "Incorporación y formación personalizada"
      ],
      cta: "Contactar con ventas",
      href: "/sign-up",
      popular: false,
      tag: "PARA EQUIPOS"
    }
  ];

  const annualSavings = [
    { monthly: 9.99, yearly: 7.99 },
    { monthly: 19.99, yearly: 15.99 },
    { monthly: 49.99, yearly: 39.99 }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl z-0"></div>
      <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block rounded-full bg-primary-500/10 px-4 py-1.5 mb-4">
            <span className="text-primary-300 text-sm font-medium">PLANES Y PRECIOS</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Precios Simples y Transparentes
          </h2>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Elige el plan que mejor se adapte a tus necesidades y objetivos de aprendizaje
          </p>
          
          <div className="flex items-center justify-center mb-10">
            <div className="bg-gray-800 p-1 rounded-full inline-flex">
              <button
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all",
                  billingCycle === 'monthly'
                    ? "bg-primary-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                )}
                onClick={() => setBillingCycle('monthly')}
              >
                Mensual
              </button>
              <button
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all",
                  billingCycle === 'yearly'
                    ? "bg-primary-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                )}
                onClick={() => setBillingCycle('yearly')}
              >
                Anual <span className="text-xs font-normal bg-green-500/20 text-green-500 py-0.5 px-2 rounded-full ml-1">Ahorra 20%</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={cn(
                "rounded-2xl border p-8 flex flex-col relative transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
                plan.popular 
                  ? "border-primary-500 bg-gray-800/70 shadow-md shadow-primary-500/10" 
                  : "border-gray-700 bg-gray-800/40"
              )}
            >
              {plan.tag && (
                <div className={cn(
                  "absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium z-10",
                  plan.popular ? "bg-primary-500 text-white" : "bg-gray-700 text-gray-300"
                )}>
                  {plan.tag}
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4 flex items-baseline">
                <span className="text-4xl font-bold">{billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}</span>
                <span className="text-gray-400 ml-1">{plan.period}</span>
              </div>
              
              {billingCycle === 'yearly' && index < annualSavings.length && (
                <div className="bg-green-500/10 text-green-400 text-xs font-medium px-3 py-1 rounded-full inline-block mb-3">
                  Ahorras {((annualSavings[index].monthly * 12) - (annualSavings[index].yearly * 12)).toFixed(2)}€ al año
                </div>
              )}
              
              <p className="text-gray-300 mb-6">{plan.description}</p>
              
              <ul className="mb-8 flex-grow space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                asChild
                className={cn(
                  "w-full py-6 transition-all",
                  plan.popular 
                    ? "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30" 
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                )}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
              
              {plan.popular && (
                <p className="text-xs text-center text-gray-400 mt-3">
                  Incluye 7 días de prueba gratuita. Cancela cuando quieras.
                </p>
              )}
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}