import Hero from "./Hero";
import Features from "./Features";
import Pricing from "./Pricing";
import Footer from "./Footer";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="PrepWise Logo" width={40} height={32} />
            <h1 className="text-2xl font-bold text-primary-100">PrepWise</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-primary-100 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/sign-in" 
              className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up" 
              className="px-4 py-2 bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <Hero />
        <Features />
        <Pricing />
      </main>
      
      <Footer />
    </div>
  );
}
