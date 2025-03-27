"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const phrases = [
    "conversaciones",
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
        if (typedText.length < currentPhrase.length) {
          setTypedText(currentPhrase.substring(0, typedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
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
    <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
      {/* Animated background with parallax effect */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 overflow-hidden"
      >
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-[800px] h-[800px] bg-gradient-to-tr from-primary-500/10 to-primary-900/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-primary-500/5 to-primary-900/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] animate-grid-fade"></div>
      </motion.div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-500/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left content with enhanced animations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8 max-w-2xl text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block rounded-full bg-gray-800/80 backdrop-blur-sm px-6 py-2 mb-4 border border-gray-700/50 hover:border-primary-500/50 transition-colors"
            >
              <span className="text-gray-300">Lleva tu inglés al siguiente nivel</span>
              <span className="text-primary-300 ml-1 font-medium">con MyBabbly</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Domina el inglés para
              <span className="relative block mt-2">
                <span className="block min-h-[1.5em] sm:min-h-[1.8em] lg:min-h-[2em] overflow-hidden">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-primary-400 to-primary-500 animate-gradient">
                    {typedText}
                    <span className="animate-blink">|</span>
                  </span>
                </span>
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl sm:text-2xl text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Mejora tu inglés en clases de conversación con nuestro profesor de IA Bubbly. Se adapta a tu nivel y te da feedback instantáneo.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 text-lg shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 duration-300"
              >
                <Link href="/sign-up">Empezar ahora</Link>
              </Button>
              
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-gray-700 hover:border-primary-500 text-gray-200 hover:text-primary-300 px-8 py-6 text-lg transition-all hover:scale-105 duration-300"
              >
                <Link href="#features" className="flex items-center gap-2">
                  <span>Ver cómo funciona</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
              </Button>
            </motion.div>
            
            {/*<motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center justify-center lg:justify-start gap-4 mt-8"
            >
              <div className="flex -space-x-2">
                <Image src="/avatars/avatar-1.jpg" width={48} height={48} className="rounded-full border-2 border-gray-800 hover:border-primary-500 transition-colors" alt="User" />
                <Image src="/avatars/avatar-2.jpg" width={48} height={48} className="rounded-full border-2 border-gray-800 hover:border-primary-500 transition-colors" alt="User" />
                <Image src="/avatars/avatar-3.jpg" width={48} height={48} className="rounded-full border-2 border-gray-800 hover:border-primary-500 transition-colors" alt="User" />
              </div>
              <div className="text-base text-gray-400">
                <span className="font-semibold text-primary-300">+15,000</span> estudiantes ya están mejorando su inglés
              </div>
            </motion.div>*/}
          </motion.div>
          
          {/* Right content - AI Teacher with enhanced effects */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="relative w-full lg:w-2/5 aspect-square max-w-[600px] mx-auto lg:mx-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-900/20 rounded-2xl -z-10 animate-pulse"></div>
            <div className="absolute inset-y-0 inset-x-4 bg-gray-900/50 backdrop-blur-sm rounded-xl -z-5 transform rotate-3 hover:rotate-0 transition-transform duration-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/avatar.png"
                alt="AI English Conversation"
                fill
                className="object-contain rounded-xl shadow-2xl hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
            
            {/* Enhanced floating cards */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -top-4 -left-4 bg-gray-800/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg border border-gray-700/50 hover:border-primary-500/50 transition-all hover:scale-105 duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-full bg-green-500/20">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm font-medium">98% de satisfacción</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute -bottom-4 -right-4 bg-gray-800/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg border border-gray-700/50 hover:border-primary-500/50 transition-all hover:scale-105 duration-300"
            >
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-sm font-medium">Progreso medible</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}