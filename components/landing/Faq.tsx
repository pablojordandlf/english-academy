"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-700 py-4">
      <button 
        className="flex w-full items-center justify-between text-left" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">{question}</h3>
        <span className={cn(
          "ml-6 flex-shrink-0 rounded-full p-1.5 sm:p-2 bg-gray-800 text-white",
          isOpen && "bg-primary-500"
        )}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isOpen && "transform rotate-180"
            )} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </span>
      </button>
      
      <div 
        className={cn(
          "mt-2 text-gray-300 transition-all duration-200 overflow-hidden",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p className="py-2">{answer}</p>
      </div>
    </div>
  );
};

export default function Faq() {
  const faqs = [
    {
      question: "¿Cómo funciona la plataforma de clases de inglés con IA?",
      answer: "Nuestra plataforma utiliza inteligencia artificial generativa para simular conversaciones naturales con un profesor de inglés. A diferencia de los chatbots tradicionales, nuestro sistema puede hablar y escuchar, proporcionando una experiencia de inmersión completa. Simplemente inicias sesión, eliges el tipo de clase que deseas Recibir, y comienzas a conversar con tu profesor AI. Después de cada clase, recibirás una evaluación detallada con puntos fuertes y áreas de mejora."
    },
    {
      question: "¿Es efectivo aprender inglés con un profesor de IA?",
      answer: "¡Absolutamente! El profesor AI se adapta a tu nivel, identifica tus errores específicos y proporciona correcciones personalizadas. Los estudios muestran que la práctica regular es clave para dominar un idioma, y nuestra plataforma te permite practicar en cualquier momento sin miedo a cometer errores. Además, las métricas de nuestros usuarios muestran mejoras significativas en fluidez, pronunciación y confianza en tan solo 2-3 meses de uso regular."
    },
    {
      question: "¿Qué nivel de inglés necesito para empezar?",
      answer: "Nuestra plataforma es adecuada para todos los niveles, desde principiantes hasta avanzados. El profesor de IA evaluará tu nivel inicial y adaptará las conversaciones y el vocabulario según tus habilidades actuales. A medida que mejores, las lecciones se volverán progresivamente más desafiantes para seguir estimulando tu crecimiento."
    },
    {
      question: "¿Cuánto tiempo necesito dedicar para ver resultados?",
      answer: "Los usuarios que practican al menos 3-4 veces por semana durante 20-30 minutos por sesión suelen ver mejoras notables en su fluidez y confianza en aproximadamente un mes. Sin embargo, el progreso varía según el nivel inicial, la consistencia de la práctica y los objetivos personales. Nuestra plataforma está diseñada para ser flexible, permitiéndote practicar en cualquier momento que tengas disponible."
    },
    {
      question: "¿Puedo cancelar mi suscripción en cualquier momento?",
      answer: "Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario. No hay contratos de largo plazo ni penalizaciones por cancelación."
    },
    {
      question: "¿La plataforma funciona en todos los dispositivos?",
      answer: "Sí, nuestra plataforma es compatible con ordenadores, tablets y smartphones. Solo necesitas un dispositivo con micrófono y conexión a internet estable."
    }
  ];

  return (
    <section id="faq" className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Preguntas Frecuentes
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Resolvemos tus dudas sobre nuestra plataforma de aprendizaje de inglés
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <FaqItem 
            key={index} 
            question={faq.question} 
            answer={faq.answer} 
          />
        ))}
      </div>
    </section>
  );
} 