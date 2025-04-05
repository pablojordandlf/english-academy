'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const NotificationPrompt = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast.success('¡Notificaciones activadas! Te recordaremos tus clases diarias.');
        // Aquí podrías guardar la preferencia del usuario en tu base de datos
      } else {
        toast.error('No podremos enviarte recordatorios de tus clases.');
      }
    } catch (error) {
      console.error('Error al solicitar permisos de notificación:', error);
      toast.error('Hubo un error al activar las notificaciones.');
    }
  };

  if (!('Notification' in window)) {
    return null;
  }

  if (permission === 'granted') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm">
      <h3 className="text-lg font-semibold mb-2">¡Mejora tu inglés todos los días!</h3>
      <p className="text-sm text-gray-600 mb-4">
        ¿Quieres recibir recordatorios diarios para practicar inglés? Activa las notificaciones para no perderte tus clases.
      </p>
      <Button
        onClick={requestPermission}
        className="w-full"
        variant="default"
      >
        Activar notificaciones
      </Button>
    </div>
  );
}; 