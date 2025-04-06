"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface HeaderProps {
  isDashboard?: boolean;
  navLinks?: { name: string; href: string }[];
  userData?: any;
}

export default function Header({ isDashboard = false, navLinks = [], userData }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/sign-out', {
        method: 'POST',
      });
      
      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error('Error al cerrar sesión: respuesta no ok');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/gabby_2.png" alt="Gabby Logo" width={40} height={32} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
              Gabby
            </h1>
          </div>

          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isDashboard ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-300 text-sm">
                  {userData?.name}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Cerrar sesión</span>
                </Button>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-primary-300 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-300 hover:text-primary-300 transition-colors text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                {isDashboard ? (
                  <>
                    <span className="text-gray-300 text-sm py-2">
                      {userData?.name}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleSignOut}
                      className="text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Cerrar sesión</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      className="text-gray-300 hover:text-primary-300 transition-colors text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/sign-up"
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-all text-sm text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 