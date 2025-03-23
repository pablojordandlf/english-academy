import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | English Academy",
  description: "Política de cookies de English Academy. Conoce cómo utilizamos las cookies en nuestra plataforma.",
};

export default function PoliticaCookies() {
  return (
    <div className="bg-gray-900 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Política de Cookies
            </h1>
            <p className="text-gray-300">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. ¿Qué son las cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tableta, 
                teléfono móvil) cuando visita sitios web. Las cookies son ampliamente utilizadas para hacer que los 
                sitios web funcionen de manera más eficiente, proporcionar información a los propietarios del sitio, 
                recordar sus preferencias y, en general, mejorar su experiencia de navegación.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Tipos de cookies que utilizamos</h2>
              <p>
                Utilizamos los siguientes tipos de cookies en nuestra plataforma:
              </p>
              <div className="mt-3 space-y-4">
                <div>
                  <h3 className="font-medium text-white">Cookies estrictamente necesarias:</h3>
                  <p className="mt-1">
                    Estas cookies son esenciales para que pueda navegar por nuestra plataforma y utilizar sus funciones. 
                    Sin estas cookies, no podríamos proporcionar algunos servicios que usted solicita, como la autenticación 
                    segura y el mantenimiento de su sesión.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-white">Cookies de rendimiento:</h3>
                  <p className="mt-1">
                    Estas cookies recopilan información sobre cómo utiliza nuestra plataforma, por ejemplo, qué páginas 
                    visita con más frecuencia y si recibe mensajes de error. Utilizamos esta información para mejorar el 
                    rendimiento de nuestra plataforma y proporcionar una mejor experiencia de usuario.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-white">Cookies de funcionalidad:</h3>
                  <p className="mt-1">
                    Estas cookies permiten que nuestra plataforma recuerde las elecciones que hace (como su nombre de usuario, 
                    idioma o región) para proporcionarle una experiencia más personalizada.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-white">Cookies de análisis:</h3>
                  <p className="mt-1">
                    Utilizamos herramientas de análisis como Google Analytics que establecen cookies para ayudarnos a 
                    recopilar y analizar información sobre el uso de nuestra plataforma, crear informes sobre la actividad 
                    del sitio y proporcionarnos otros servicios relacionados con la actividad del sitio y el uso de Internet.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-white">Cookies de redes sociales:</h3>
                  <p className="mt-1">
                    Nuestra plataforma incluye botones para compartir contenido en redes sociales como Facebook, Twitter 
                    y LinkedIn. Estas redes sociales pueden establecer sus propias cookies cuando interactúa con estos botones.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-white">Cookies de publicidad:</h3>
                  <p className="mt-1">
                    Estas cookies se utilizan para mostrar anuncios relevantes para usted y sus intereses. También se 
                    utilizan para limitar el número de veces que ve un anuncio y medir la efectividad de las campañas publicitarias.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Cookies de terceros</h2>
              <p>
                Algunas cookies son colocadas por servicios de terceros que aparecen en nuestras páginas. 
                Trabajamos con terceros que colocan cookies en nuestra plataforma para proporcionar servicios en nuestro nombre, 
                como análisis, publicidad y funcionalidades de redes sociales. Estos terceros pueden usar cookies, balizas web 
                y tecnologías similares para recopilar información sobre su uso de nuestra plataforma y otros sitios web.
              </p>
              <p className="mt-2">
                No tenemos control sobre las cookies de terceros. Para obtener más información sobre cómo estos terceros 
                utilizan la información recopilada, consulte sus respectivas políticas de privacidad.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Lista de cookies utilizadas</h2>
              <p>
                A continuación se detallan las principales cookies que utilizamos en nuestra plataforma:
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-4 py-2 text-left">Nombre</th>
                      <th className="px-4 py-2 text-left">Proveedor</th>
                      <th className="px-4 py-2 text-left">Propósito</th>
                      <th className="px-4 py-2 text-left">Caducidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    <tr>
                      <td className="px-4 py-3">_session</td>
                      <td className="px-4 py-3">English Academy</td>
                      <td className="px-4 py-3">Mantiene la sesión del usuario</td>
                      <td className="px-4 py-3">Sesión</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">_ga</td>
                      <td className="px-4 py-3">Google Analytics</td>
                      <td className="px-4 py-3">Distingue usuarios únicos</td>
                      <td className="px-4 py-3">2 años</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">_gid</td>
                      <td className="px-4 py-3">Google Analytics</td>
                      <td className="px-4 py-3">Distingue usuarios</td>
                      <td className="px-4 py-3">24 horas</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">_gat</td>
                      <td className="px-4 py-3">Google Analytics</td>
                      <td className="px-4 py-3">Limita el porcentaje de solicitudes</td>
                      <td className="px-4 py-3">1 minuto</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">cookieconsent_status</td>
                      <td className="px-4 py-3">English Academy</td>
                      <td className="px-4 py-3">Recuerda la elección de cookies</td>
                      <td className="px-4 py-3">1 año</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">user_preferences</td>
                      <td className="px-4 py-3">English Academy</td>
                      <td className="px-4 py-3">Almacena preferencias del usuario</td>
                      <td className="px-4 py-3">1 año</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Gestión de cookies</h2>
              <p>
                Puede decidir si acepta o rechaza las cookies. La mayoría de los navegadores web aceptan 
                automáticamente las cookies, pero normalmente puede modificar la configuración de su navegador 
                para rechazar las cookies si lo prefiere.
              </p>
              <p className="mt-2">
                También puede retirar su consentimiento en cualquier momento utilizando nuestro panel de preferencias 
                de cookies, al que puede acceder haciendo clic en el enlace "Configuración de cookies" en el pie de página 
                de nuestra plataforma.
              </p>
              <div className="mt-4 space-y-3">
                <p>
                  Para gestionar las cookies en los principales navegadores, puede seguir estas instrucciones:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Configuración de sitios → Cookies y datos de sitios</li>
                  <li><strong>Mozilla Firefox:</strong> Opciones → Privacidad y Seguridad → Cookies y datos del sitio</li>
                  <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies y datos del sitio web</li>
                  <li><strong>Microsoft Edge:</strong> Configuración → Cookies y permisos del sitio → Cookies</li>
                </ul>
              </div>
              <p className="mt-3">
                Tenga en cuenta que restringir las cookies puede impedirle beneficiarse de todas las funcionalidades 
                de nuestra plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Cambios en nuestra política de cookies</h2>
              <p>
                Podemos actualizar nuestra política de cookies de vez en cuando. Cualquier cambio entrará en vigor 
                inmediatamente tras la publicación de la política de cookies actualizada en nuestra plataforma.
              </p>
              <p className="mt-2">
                Le recomendamos que revise esta política periódicamente para estar informado sobre cómo utilizamos las cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Contacto</h2>
              <p>
                Si tiene alguna pregunta sobre nuestra política de cookies, puede contactarnos en:
              </p>
              <p className="mt-2">
                Email: privacidad@english-academy.com<br />
                Dirección: Calle Principal 123, 28001 Madrid, España<br />
                Teléfono: +34 91 123 4567
              </p>
            </section>
          </div>

          <div className="mt-10 flex justify-center">
            <Link 
              href="/"
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 