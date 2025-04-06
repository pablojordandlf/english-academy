import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center p-8">
        <WifiOff className="w-16 h-16 mx-auto mb-4 text-primary-500" />
        <h1 className="text-2xl font-bold text-white mb-4">Sin conexión</h1>
        <p className="text-gray-400 mb-8">
          Lo sentimos, parece que no tienes conexión a internet en este momento.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Intentar de nuevo
        </Link>
      </div>
    </div>
  );
} 