"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, CheckCircle, XCircle, Settings } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Siempre activas
    performance: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Verificar si ya existe una preferencia guardada
    const consentValue = localStorage.getItem("cookie-consent");
    if (!consentValue) {
      // Si no existe, mostrar el popup después de un pequeño delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      performance: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const rejectAll = () => {
    const allRejected = {
      necessary: true, // Siempre activas
      performance: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(allRejected);
    saveConsent(allRejected);
  };

  const saveConsent = (preferences: Record<string, boolean>) => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      preferences,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
  };

  const handleToggle = (type: string) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev],
    }));
  };

  const savePreferences = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm bg-black/50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        {!showPreferences ? (
          <div>
            <div className="p-5 flex justify-between items-start">
              <h2 className="text-xl font-bold text-white">Aviso de Cookies</h2>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="px-5 pb-4 text-gray-300">
              <p>
                Utilizamos cookies propias y de terceros para mejorar tu experiencia, mostrar 
                contenido personalizado y analizar el tráfico en nuestra web. 
              </p>
              <p className="mt-2">
                Puedes aceptar todas las cookies, rechazarlas o personalizar tus preferencias.
                Para más información, visita nuestra{" "}
                <Link href="/legal/cookies" className="text-primary-500 hover:underline">
                  Política de Cookies
                </Link>.
              </p>
            </div>
            
            <div className="bg-gray-900 p-4 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={() => setShowPreferences(true)}
                className="order-3 sm:order-1 px-4 py-2 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <Settings size={18} />
                <span>Personalizar</span>
              </button>
              <button
                onClick={rejectAll}
                className="order-2 px-4 py-2 border border-red-700 bg-red-800/30 text-white rounded-lg hover:bg-red-700/30 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle size={18} />
                <span>Rechazar todas</span>
              </button>
              <button
                onClick={acceptAll}
                className="order-1 sm:order-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                <span>Aceptar todas</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="p-5 flex justify-between items-start">
              <h2 className="text-xl font-bold text-white">Preferencias de Cookies</h2>
              <button 
                onClick={() => setShowPreferences(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="px-5 pb-4">
              <div className="space-y-4">
                {/* Cookies necesarias */}
                <div className="p-3 bg-gray-900 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-white">Cookies necesarias</h3>
                    <div className="relative">
                      <div className="w-10 h-6 bg-primary-600 rounded-full shadow-inner"></div>
                      <div className="absolute inset-y-0 right-0 w-4 h-4 m-1 bg-white rounded-full shadow flex items-center justify-center">
                        <CheckCircle size={10} className="text-primary-600" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Estas cookies son esenciales para que puedas usar la web. No pueden ser desactivadas.
                  </p>
                </div>
                
                {/* Cookies de rendimiento */}
                <div className="p-3 bg-gray-900 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-white">Cookies de rendimiento</h3>
                    <div className="relative">
                      <button
                        onClick={() => handleToggle("performance")}
                        className={`w-10 h-6 ${
                          preferences.performance ? "bg-primary-600" : "bg-gray-700"
                        } rounded-full shadow-inner focus:outline-none`}
                      >
                        <div
                          className={`absolute inset-y-0 ${
                            preferences.performance ? "right-0" : "left-0"
                          } w-4 h-4 m-1 bg-white rounded-full shadow transition-all`}
                        ></div>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Estas cookies nos permiten mejorar el rendimiento y funcionalidad de la web.
                  </p>
                </div>
                
                {/* Cookies analíticas */}
                <div className="p-3 bg-gray-900 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-white">Cookies analíticas</h3>
                    <div className="relative">
                      <button
                        onClick={() => handleToggle("analytics")}
                        className={`w-10 h-6 ${
                          preferences.analytics ? "bg-primary-600" : "bg-gray-700"
                        } rounded-full shadow-inner focus:outline-none`}
                      >
                        <div
                          className={`absolute inset-y-0 ${
                            preferences.analytics ? "right-0" : "left-0"
                          } w-4 h-4 m-1 bg-white rounded-full shadow transition-all`}
                        ></div>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Nos ayudan a entender cómo interactúas con la web para mejorar tu experiencia.
                  </p>
                </div>
                
                {/* Cookies de marketing */}
                <div className="p-3 bg-gray-900 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-white">Cookies de marketing</h3>
                    <div className="relative">
                      <button
                        onClick={() => handleToggle("marketing")}
                        className={`w-10 h-6 ${
                          preferences.marketing ? "bg-primary-600" : "bg-gray-700"
                        } rounded-full shadow-inner focus:outline-none`}
                      >
                        <div
                          className={`absolute inset-y-0 ${
                            preferences.marketing ? "right-0" : "left-0"
                          } w-4 h-4 m-1 bg-white rounded-full shadow transition-all`}
                        ></div>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Se utilizan para mostrarte anuncios relevantes según tus intereses.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 flex justify-end gap-2">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={savePreferences}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 