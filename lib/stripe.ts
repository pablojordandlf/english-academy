import { Stripe } from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY debe estar definido en el archivo .env.local');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia', // Versión más reciente de la API de Stripe
  appInfo: {
    name: 'Gabby',
    version: '0.1.0',
  },
});

// Precios de los planes
export const PLANS = {
  PREMIUM: {
    monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
    yearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID,
    name: 'Premium',
    features: [
      "Profesor AI personalizado",
      "Clases ilimitadas con el profesor AI",
      "Análisis avanzado del progreso",
      "Acceso a todo el contenido de lecciones",
      "Plan de aprendizaje personalizado",
    ]
  }
};

export const getPlanPriceId = (planType: 'PREMIUM', billingCycle: 'monthly' | 'yearly') => {
  return billingCycle === 'monthly' 
    ? PLANS[planType].monthly 
    : PLANS[planType].yearly;
}; 