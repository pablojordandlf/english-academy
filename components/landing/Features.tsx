import Image from "next/image";

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  return (
    <div 
      className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 group"
    >
      <div className="mb-6 relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
        <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg flex items-center justify-center">
          <span className="text-4xl">{feature.icon}</span>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-primary-100 group-hover:text-primary-300 transition-colors">{feature.title}</h3>
      <p className="text-gray-300">{feature.description}</p>
    </div>
  );
};

export default function Features() {
  const features = [
    {
      title: "Conversaciones con IA Avanzada",
      description: "Practica con nuestros profesores de IA que se adaptan a tu nivel de inglés y estilo de aprendizaje, ofreciendo una experiencia personalizada.",
      icon: "⚡"
    },
    {
      title: "Retroalimentación en Tiempo Real",
      description: "Recibe correcciones instantáneas sobre pronunciación, gramática y vocabulario mientras hablas, permitiéndote mejorar durante la conversación.",
      icon: "🔍"
    },
    {
      title: "Aprendizaje Personalizado",
      description: "Planes de lecciones diseñados específicamente para tus objetivos, intereses y progreso, adaptándose continuamente a tu evolución.",
      icon: "🎯"
    },
    {
      title: "Práctica Flexible",
      description: "Entrena en cualquier momento y lugar con conversaciones diseñadas para escenarios de la vida real, desde situaciones informales hasta profesionales.",
      icon: "🌐"
    },
    {
      title: "Seguimiento de Progreso",
      description: "Monitorea tu mejora con análisis detallados y métricas de rendimiento que te muestran exactamente cómo estás avanzando.",
      icon: "📈"
    },
    {
      title: "Contenido Específico por Industria",
      description: "Vocabulario y escenarios especializados para inglés de negocios, académico o conversacional, adaptados a tus necesidades específicas.",
      icon: "🏢"
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl z-0"></div>
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block rounded-full bg-primary-500/10 px-4 py-1.5 mb-4">
            <span className="text-primary-300 text-sm font-medium">CARACTERÍSTICAS PRINCIPALES</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            ¿Por Qué Elegir Nuestra Plataforma?
          </h2>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Nuestra plataforma de enseñanza de inglés con IA ofrece una experiencia de aprendizaje única adaptada a tus necesidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
        
        <div className="mt-20 bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold mb-4 text-primary-100">Metodología de enseñanza basada en la práctica real</h3>
              <p className="text-gray-300 mb-6">
                Nuestra plataforma se basa en los principios de aprendizaje activo e inmersión lingüística, combinando la tecnología más avanzada con métodos pedagógicos probados.
              </p>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-3 items-start">
                <div className="h-10 w-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Enfoque comunicativo</h4>
                  <p className="text-sm text-gray-400">Priorizamos la comunicación real sobre la memorización de reglas gramaticales</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="h-10 w-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Práctica espaciada</h4>
                  <p className="text-sm text-gray-400">Algoritmos que ajustan la frecuencia de repaso para optimizar la retención a largo plazo</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="h-10 w-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Ciclos de retroalimentación</h4>
                  <p className="text-sm text-gray-400">Correcciones inmediatas que permiten ajustar patrones lingüísticos en tiempo real</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="h-10 w-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Aprendizaje basado en tareas</h4>
                  <p className="text-sm text-gray-400">Escenarios del mundo real que te preparan para aplicar el idioma en situaciones cotidianas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}