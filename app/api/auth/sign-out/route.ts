import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Obtener el store de cookies
    const cookieStore = cookies();
    
    // Crear una respuesta que elimine la cookie de sesión
    const response = NextResponse.json({ 
      message: 'Sesión cerrada correctamente' 
    });
    
    // Eliminar la cookie de sesión con el nombre correcto 'session'
    response.cookies.set({
      name: 'session',
      value: '',
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    return response;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}
