"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const phrases = [
    "clases de conversiación",
    "reuniones de trabajo",
    "viajes al extranjero",
    "entrevistas de trabajo",
    "exámenes oficiales"
  ];

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100;
    const currentPhrase = phrases[currentPhraseIndex];
    
    const type = () => {
      if (!isDeleting) {
        // Typing
        if (typedText.length < currentPhrase.length) {
          setTypedText(currentPhrase.substring(0, typedText.length + 1));
        } else {
          // Wait before deleting
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        // Deleting
        if (typedText.length > 0) {
          setTypedText(currentPhrase.substring(0, typedText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
        }
      }
    };

    const timer = setTimeout(type, typeSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentPhraseIndex, phrases]);

  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="inline-block rounded-full bg-gray-800/80 backdrop-blur-sm px-4 py-1.5 mb-4">
              <span className="text-gray-300">Aprende inglés de forma natural</span>
              <span className="text-primary-300 ml-1">con IA</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Domina el inglés para
              <span className="relative">
                <span className="block h-20 mt-2 overflow-hidden">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-500">
                    {typedText}
                    <span className="animate-blink">|</span>
                  </span>
                </span>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300">
              Practica inglés con nuestro profesor de IA que se adapta a tu nivel y te proporciona retroalimentación detallada para mejorar rápidamente.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button asChild size="lg" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 text-lg shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl hover:shadow-primary-500/30">
                <Link href="/sign-up">Empezar ahora</Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-gray-700 hover:border-primary-500 text-gray-200 hover:text-primary-300 px-8 py-6 text-lg transition-all">
                <Link href="#features" className="flex items-center gap-2">
                  <span>Ver cómo funciona</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                <Image src="/avatars/avatar-1.jpg" width={40} height={40} className="rounded-full border-2 border-gray-800" alt="User" />
                <Image src="/avatars/avatar-2.jpg" width={40} height={40} className="rounded-full border-2 border-gray-800" alt="User" />
                <Image src="/avatars/avatar-3.jpg" width={40} height={40} className="rounded-full border-2 border-gray-800" alt="User" />
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-semibold text-primary-300">+15,000</span> estudiantes ya están mejorando su inglés
              </div>
            </div>
          </div>
          
          <div className="relative w-full lg:w-2/5 h-[450px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-900/20 rounded-2xl -z-10" />
            <div className="absolute inset-y-0 inset-x-4 bg-gray-900/50 backdrop-blur-sm rounded-xl -z-5 transform rotate-3"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/avatar.png"
                alt="AI English Conversation"
                width={500}
                height={400}
                className="object-contain rounded-xl shadow-2xl"
                priority
              />
            </div>
            
            {/* Stats floating cards */}
            <div className="absolute -top-4 -left-4 bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-full bg-green-500/20">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm font-medium">98% de satisfacción</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-gray-700">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-sm font-medium">Progreso medible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}