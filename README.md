# English Academy

## Flujo de Suscripción

El sistema de suscripción implementado sigue el siguiente flujo:

1. **Selección de Plan**: El usuario puede seleccionar el plan Premium en la página de precios (`/components/landing/Pricing.tsx` o `/app/plans/page.tsx`).
   - Al seleccionar el plan, se redirige al usuario a la página de registro con parámetros de consulta que indican el plan seleccionado y el ciclo de facturación.

2. **Registro de Usuario**: El usuario completa el formulario de registro (`/components/AuthForm.tsx`).
   - Durante el registro, si hay información del plan, se almacena como una suscripción pendiente.
   - Todos los usuarios reciben un período de prueba de 7 días.

3. **Redirección a Checkout**: Después del registro exitoso, el usuario es redirigido a la página de checkout (`/app/checkout/page.tsx`).
   - La página de checkout muestra los detalles del plan seleccionado.
   - El usuario puede introducir un código de cupón para obtener un descuento adicional.
   - Si el usuario no está autenticado, se guarda la URL actual en `sessionStorage` y se redirige al usuario a la página de inicio de sesión.

4. **Proceso de Pago**: El usuario completa el proceso de pago a través de Stripe.
   - Después del pago exitoso, se redirige al usuario a la página de éxito (`/app/checkout/success/page.tsx`).

5. **Gestión de Suscripción**: El usuario puede gestionar su suscripción en cualquier momento.
   - La página de gestión de suscripción (`/app/settings/subscription/page.tsx`) muestra los detalles de la suscripción actual.
   - Si el usuario no tiene una suscripción activa, se le ofrece la opción de ver los planes disponibles, redirigiendo a la página `/plans`.
   - Los usuarios pueden cambiar o cancelar su suscripción a través del portal de Stripe.

### Funcionalidades Implementadas

- **Plan Premium**: La aplicación ofrece un único plan Premium con todas las funcionalidades.
- **Período de Prueba Gratuita**: Todos los usuarios reciben un período de prueba de 7 días.
- **Ciclos de Facturación**: Los usuarios pueden elegir entre facturación mensual o anual, con un descuento del 20% para el plan anual.
- **Sistema de Cupones**: La aplicación permite aplicar cupones de descuento durante el proceso de checkout.
- **Portal de Gestión**: Los usuarios pueden gestionar su suscripción a través del portal de Stripe.
- **Verificación de Acceso**: El sistema verifica si el usuario tiene una suscripción activa o está en período de prueba antes de permitir el acceso a ciertas funcionalidades.

### Códigos de Cupón Disponibles

Para probar el sistema de cupones en desarrollo, puedes usar los siguientes códigos:

- **WELCOME10**: 10% de descuento, válido para planes mensuales y anuales.
- **SUMMER20**: 20% de descuento, válido solo para planes anuales.
- **FIRST15**: 15% de descuento, válido para planes mensuales y anuales.

### Tarjetas de Prueba de Stripe

Para probar el sistema de pago en desarrollo, puedes usar las siguientes tarjetas de prueba:

- **Pago exitoso**: `4242 4242 4242 4242`
- **Pago fallido**: `4000 0000 0000 0002`
- **Requiere autenticación**: `4000 0025 0000 3155`

Para todas las tarjetas, puedes usar cualquier fecha de vencimiento futura, cualquier código CVC de 3 dígitos y cualquier código postal de 5 dígitos.
