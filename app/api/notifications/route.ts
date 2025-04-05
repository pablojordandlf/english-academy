import { NextResponse } from 'next/server';
import webpush from 'web-push';

// Configurar las claves VAPID
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  try {
    const { subscription, payload } = await req.json();

    if (!subscription || !payload) {
      return NextResponse.json(
        { error: 'Se requiere subscription y payload' },
        { status: 400 }
      );
    }

    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    return NextResponse.json(
      { error: 'Error al enviar la notificación' },
      { status: 500 }
    );
  }
} 