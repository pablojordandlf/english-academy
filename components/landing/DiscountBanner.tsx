"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function DiscountBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Verificar si ya se mostró el banner
    const hasShown = localStorage.getItem("discountBannerShown");
    if (!hasShown) {
      setIsVisible(true);
      localStorage.setItem("discountBannerShown", "true");
    } else {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary-500 to-primary-700 text-white"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">🎉</span>
            <p className="text-sm md:text-base">
              ¡Usa el código <span className="font-bold">WELCOME50</span> para obtener un 50% de descuento en tu primera suscripción!
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 