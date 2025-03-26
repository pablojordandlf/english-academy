import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Pricing from "../components/landing/Pricing";
import Testimonials from "../components/landing/Testimonials";
import Faq from "../components/landing/Faq";
import Cta from "../components/landing/Cta";
import Footer from "../components/landing/Footer";
import Image from "next/image";
import Link from "next/link";
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
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="MyBubbly Logo" width={40} height={32} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">MyBubbly</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-primary-300 transition-colors text-sm"
              >
                {link.name}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/sign-in" 
              className="text-gray-300 hover:text-primary-300 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/sign-up" 
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-all shadow-md hover:shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 text-sm"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>
      
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