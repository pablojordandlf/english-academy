"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
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
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-primary-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary-500/10"
    >
      {/* Efecto de gradiente en hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-700/0 group-hover:from-primary-500/5 group-hover:to-primary-700/5 rounded-2xl transition-all duration-500" />
      
      {/* Icono con efecto de brillo */}
      <div className="relative mb-6">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl blur opacity-0 group-hover:opacity-25 transition duration-500" />
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl flex items-center justify-center">
          <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="relative">
        <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary-100 to-primary-300 bg-clip-text text-transparent group-hover:from-primary-300 group-hover:to-primary-500 transition-all duration-300">
          {feature.title}
        </h3>
        <p className="text-gray-300 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

export default function Features() {
  const features = [
    {
      title: "Conversaciones con IA Avanzada",
      description: "Practica con nuestros profesores de IA que se adaptan a tu nivel de inglés, ofreciendo una experiencia personalizada.",
      icon: "⚡"
    },
    {
      title: "Feedback en Tiempo Real",
      description: "Recibe correcciones instantáneas sobre pronunciación, gramática y vocabulario mientras hablas, permitiéndote mejorar durante la conversación.",
      icon: "🔍"
    },
    {
      title: "Clases Personalizadas",
      description: "Clases de conversación diseñadas específicamente para tus intereses, adaptándose continuamente a tu evolución.",
      icon: "🎯"
    },
    {
      title: "Práctica Flexible",
      description: "Entrena en cualquier momento y lugar, sin tener que reservar la sesión de antemano o cuadrar horarios con tu profesor.",
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

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl animate-pulse delay-500" />
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
            <span className="text-primary-300 text-sm font-medium tracking-wider">CARACTERÍSTICAS PRINCIPALES</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            ¿Por Qué Elegir Nuestra Plataforma?
          </h2>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Nuestra plataforma de clases de conversación con IA ofrece una experiencia de aprendizaje única adaptada a ti.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
        
        {/* Sección de metodología */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-24 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-100 to-primary-300 bg-clip-text text-transparent">
                Metodología basada en la práctica de conversaciones reales
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Nuestro enfoque único combina tecnología avanzada para garantizar tu éxito en el aprendizaje del inglés.
              </p>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                {
                  title: "Enfoque comunicativo",
                  description: "Priorizamos la comunicación real sobre la memorización de reglas gramaticales",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )
                },
                {
                  title: "Temas de actualidad",
                  description: "Haz que las conversaciones sean interesantes, actuales y útiles en tu día a día",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Feedback instantáneo",
                  description: "Correcciones inmediatas que permiten ajustar patrones lingüísticos en tiempo real",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )
                },
                {
                  title: "Aprendizaje basado en tareas",
                  description: "Nuestro profesor de conversación te propondrá ejercicios para mejorar tu inglés",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  )
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex gap-4 items-start group"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/30 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2 text-white group-hover:text-primary-300 transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}