"use client";

import { useEffect } from "react";
import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CheckoutCancelPage() {
  useEffect(() => {
    // Mostrar mensaje de cancelación
    toast.error("Proceso de pago cancelado");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg text-center">
          <div className="mb-8 bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Pago cancelado
          </h1>
          
          <p className="text-gray-300 mb-8">
            Has cancelado el proceso de pago. No te preocupes, no se ha realizado ningún cargo.
            Puedes intentarlo de nuevo cuando estés listo.
          </p>
          
          <div className="bg-gray-700/50 rounded-lg p-4 mb-8">
            <h3 className="text-white font-medium mb-2">¿Tienes dudas sobre el plan?</h3>
            <p className="text-gray-300 text-sm">
              Si tienes alguna pregunta sobre nuestros planes o el proceso de pago, 
              no dudes en contactarnos. Estaremos encantados de ayudarte.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-primary-500 hover:bg-primary-600 text-white">
              <Link href="/#pricing">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a planes
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
              <Link href="/contact">
                Contactar soporte
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 