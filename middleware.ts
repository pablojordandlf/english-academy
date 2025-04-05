import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que no requieren autenticación
const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/password-reset',
  '/legal',
  '/plans',
  '/api/auth/sign-out',
];

// Rutas de API que no requieren autenticación
const publicApiRoutes = [
  '/api/auth/sign-out',
  '/api/coupons/verify',
  '/api/subscribe',
];

// Rutas que usan @ai-sdk/google y deben ser excluidas del middleware
const aiRoutes = [
  '/api/feedback',
  '/api/chat',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si es una ruta que usa @ai-sdk/google
  if (aiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verificar si es una ruta pública
  if (
    publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`)) ||
    publicApiRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
  ) {
    return NextResponse.next();
  }

  // Verificar si es una ruta interna de Next.js o recursos estáticos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth/callback') ||
    pathname.includes('.') // Para archivos estáticos como imágenes, CSS, etc.
  ) {
    return NextResponse.next();
  }

  // Obtener la cookie de sesión
  const sessionCookie = request.cookies.get('session')?.value;

  // Si no hay cookie de sesión, redirigir a login
  if (!sessionCookie) {
    // Si es una ruta de API, devolver 401
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'No autorizado' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Para rutas regulares, redirigir a login
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // En Edge Runtime, solo verificamos la existencia de la cookie
  // La validación real se hará en las rutas de API
  return NextResponse.next();
}

// Configurar las rutas que serán procesadas por el middleware
export const config = {
  matcher: [
    // Rutas que requieren autenticación
    '/dashboard/:path*',
    '/api/:path*',
    '/settings/:path*',
    
    // Excluir archivos estáticos y rutas públicas
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|images).*)',
  ],
}; 