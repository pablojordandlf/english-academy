"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // Mostrar mensaje de éxito
    toast.success("¡Pago procesado correctamente!");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg text-center">
          <div className="mb-8 bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            ¡Pago completado con éxito!
          </h1>
          
          <p className="text-gray-300 mb-8">
            Gracias por suscribirte a Gabby. Tu período de prueba de 7 días ha comenzado.
            Disfruta de todas las funcionalidades premium de nuestra plataforma.
          </p>
          
          <div className="bg-gray-700/50 rounded-lg p-4 mb-8 text-left">
            <h3 className="text-white font-medium mb-2">Detalles importantes:</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Puedes acceder a todas las características premium inmediatamente.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Tu período de prueba gratuita es de 7 días, después se realizará el primer cobro.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Puedes cancelar en cualquier momento antes de que finalice el período de prueba.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Recibirás un correo electrónico con todos los detalles de tu suscripción.</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-primary-500 hover:bg-primary-600 text-white">
              <Link href="/dashboard">
                Ir a mi dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
          </div>
        </div>
      </div>
    </div>
  );
} 