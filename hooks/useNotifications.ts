import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Error al solicitar permisos de notificación:', error);
      return 'denied' as NotificationPermission;
    }
  };

  const subscribeToNotifications = async () => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications no están soportadas');
      }

      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();

      if (existingSubscription) {
        setSubscription(existingSubscription);
        return existingSubscription;
      }

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      setSubscription(newSubscription);
      return newSubscription;
    } catch (error) {
      console.error('Error al suscribirse a las notificaciones:', error);
      throw error;
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error al cancelar la suscripción:', error);
      throw error;
    }
  };

  return {
    permission,
    subscription,
    requestPermission,
    subscribeToNotifications,
    unsubscribeFromNotifications
  };
}; 