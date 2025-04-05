const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('Claves VAPID generadas:');
console.log('NEXT_PUBLIC_VAPID_PUBLIC_KEY=', vapidKeys.publicKey);
console.log('VAPID_PRIVATE_KEY=', vapidKeys.privateKey); 