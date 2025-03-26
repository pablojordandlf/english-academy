import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/actions/auth.action";
import UserMenu from "@/components/UserMenu";

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image 
              src="/mybubbly_2.png" 
              alt="MyBubbly Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
            MyBubbly
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            Inicio
          </Link>
          <Link href="/#features" className="text-gray-300 hover:text-white transition-colors">
            Características
          </Link>
          <Link href="/#pricing" className="text-gray-300 hover:text-white transition-colors">
            Precios
          </Link>
          <Link href="/#faq" className="text-gray-300 hover:text-white transition-colors">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link 
                href="/dashboard" 
                className="hidden sm:flex items-center gap-1 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors text-sm font-medium text-gray-300 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi cuenta
              </Link>
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Link 
                href="/auth/sign-in" 
                className="hidden sm:block text-gray-300 hover:text-white transition-colors px-3 py-2"
              >
                Iniciar sesión
              </Link>
              <Link 
                href="/auth/sign-up" 
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-colors text-sm font-medium text-white shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar; 