import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Cta() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-100 to-primary-500 bg-clip-text text-transparent">
              Comienza tu viaje hacia la fluidez en inglés hoy mismo
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              7 días de prueba gratuita. Sin compromiso. Cancela cuando quieras.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50">
              <div className="rounded-full bg-primary-500/20 p-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Práctica ilimitada</h3>
              <p className="text-sm text-center text-gray-400">Conversaciones ilimitadas con tu profesor AI</p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50">
              <div className="rounded-full bg-primary-500/20 p-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Retroalimentación detallada</h3>
              <p className="text-sm text-center text-gray-400">Análisis personalizado tras cada sesión</p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50">
              <div className="rounded-full bg-primary-500/20 p-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Progreso garantizado</h3>
              <p className="text-sm text-center text-gray-400">Mejora notable en 30 días o te devolvemos el dinero</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 text-lg shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl hover:shadow-primary-500/30">
              <Link href="/sign-up">Prueba 7 días gratis</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-6 text-lg">
              <Link href="#pricing">Ver planes</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 