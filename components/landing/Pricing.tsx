import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "$9.99",
      period: "per month",
      description: "Perfect for beginners looking to improve their English skills.",
      features: [
        "5 AI tutor sessions per month",
        "Basic progress tracking",
        "Email support",
        "Access to beginner lessons"
      ],
      cta: "Start Free Trial",
      href: "/sign-up",
      popular: false
    },
    {
      name: "Premium",
      price: "$19.99",
      period: "per month",
      description: "Ideal for serious learners who want to rapidly improve.",
      features: [
        "Unlimited AI tutor sessions",
        "Advanced progress analytics",
        "Priority support",
        "Access to all lesson content",
        "Personalized learning path"
      ],
      cta: "Get Premium",
      href: "/sign-up",
      popular: true
    },
    {
      name: "Business",
      price: "$49.99",
      period: "per month",
      description: "For professionals and teams needing specialized English skills.",
      features: [
        "Everything in Premium",
        "Industry-specific vocabulary",
        "Custom scenario creation",
        "Team analytics dashboard",
        "Dedicated account manager"
      ],
      cta: "Contact Sales",
      href: "/sign-up",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Choose the plan that best fits your learning needs and goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`rounded-2xl border ${
              plan.popular 
                ? "border-primary-500 bg-gray-800/70" 
                : "border-gray-700 bg-gray-800/40"
            } p-8 flex flex-col relative`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-gray-400 ml-1">{plan.period}</span>
            </div>
            <p className="text-gray-300 mb-6">{plan.description}</p>
            
            <ul className="mb-8 flex-grow">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start mb-3">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              asChild
              className={`w-full py-6 ${
                plan.popular 
                  ? "bg-primary-500 hover:bg-primary-600 text-white" 
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              <Link href={plan.href}>{plan.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
