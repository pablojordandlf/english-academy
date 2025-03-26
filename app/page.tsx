import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Pricing from "../components/landing/Pricing";
import Testimonials from "../components/landing/Testimonials";
import Faq from "../components/landing/Faq";
import Cta from "../components/landing/Cta";
import Footer from "../components/landing/Footer";
import Header from "@/components/layout/Header";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";

export default async function LandingPage() {
  // Check if the user is authenticated
  const isUserAuthenticated = await isAuthenticated();
  
  // If authenticated, redirect to the dashboard
  if (isUserAuthenticated) {
    redirect("/dashboard");
  }

  const navLinks = [
    { name: "Inicio", href: "#home" },
    { name: "Características", href: "#features" },
    { name: "Testimonios", href: "#testimonials" },
    { name: "Precios", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header navLinks={navLinks} />
      
      <main className="flex-grow">
        <div id="home">
          <Hero />
        </div>
        <Features />
        <Testimonials />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      
      <Footer />
    </div>
  );
}