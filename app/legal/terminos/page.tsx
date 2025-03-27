import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Gabby",
  description: "Términos y condiciones de uso de Gabby, la plataforma de enseñanza de inglés con IA.",
};

export default function TerminosCondiciones() {
  return (
    <div className="bg-gray-900 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Términos y Condiciones
            </h1>
            <p className="text-gray-300">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Introducción</h2>
              <p>
                Bienvenido a Gabby. Estos Términos y Condiciones rigen el uso de nuestra plataforma educativa, 
                incluyendo el sitio web, aplicación y todos los servicios relacionados ofrecidos por Gabby.
              </p>
              <p className="mt-2">
                Al acceder o utilizar nuestra plataforma, usted acepta estos términos en su totalidad. Si no está de acuerdo 
                con alguna parte de estos términos, no debe utilizar nuestra plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Definiciones</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>"Gabby"</strong>, "nosotros" o "nuestro" se refiere a la plataforma Gabby.</li>
                <li><strong>"Plataforma"</strong> se refiere al sitio web, aplicación y servicios ofrecidos por Gabby.</li>
                <li><strong>"Usuario"</strong>, "usted" o "su" se refiere a cualquier persona que acceda o utilice nuestra plataforma.</li>
                <li><strong>"Contenido"</strong> se refiere a todo texto, audio, video, imágenes y datos disponibles a través de nuestra plataforma.</li>
                <li><strong>"Servicio"</strong> se refiere a las clases de inglés, evaluaciones y demás funcionalidades ofrecidas a través de nuestra plataforma.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Registro y Cuentas de Usuario</h2>
              <p>
                Para acceder a determinadas funciones de nuestra plataforma, deberá registrarse y crear una cuenta. 
                Usted es responsable de mantener la confidencialidad de su información de inicio de sesión y de todas 
                las actividades que ocurran bajo su cuenta.
              </p>
              <p className="mt-2">
                Usted acepta proporcionar información precisa, actual y completa durante el proceso de registro y 
                mantener actualizada dicha información. Nos reservamos el derecho de suspender o terminar su cuenta 
                si alguna información proporcionada durante el registro o después resulta ser inexacta, desactualizada o incompleta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Suscripciones y Pagos</h2>
              <p>
                Gabby ofrece diversos planes de suscripción para acceder a nuestros servicios. Los detalles 
                de estos planes, incluyendo precios y características, están disponibles en nuestra plataforma.
              </p>
              <p className="mt-2">
                Al suscribirse a un plan de pago, usted acepta pagar todas las tarifas aplicables según las condiciones 
                detalladas en el momento de la suscripción. Todos los pagos son no reembolsables excepto cuando lo exija la ley 
                o según lo especificado en nuestra política de reembolsos.
              </p>
              <p className="mt-2">
                Nos reservamos el derecho de modificar nuestros precios con previo aviso. Cualquier cambio en los precios 
                entrará en vigor al comienzo del siguiente período de facturación.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Derechos de Propiedad Intelectual</h2>
              <p>
                Todo el contenido disponible en nuestra plataforma, incluyendo pero no limitado a textos, gráficos, 
                logotipos, íconos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad 
                de Gabby o de nuestros proveedores de contenido y está protegido por las leyes de propiedad 
                intelectual aplicables.
              </p>
              <p className="mt-2">
                Se concede a los usuarios una licencia limitada, no exclusiva y no transferible para acceder y utilizar 
                el contenido de nuestra plataforma únicamente para fines educativos personales y no comerciales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Limitación de Responsabilidad</h2>
              <p>
                En la medida máxima permitida por la ley, Gabby no será responsable por daños directos, 
                indirectos, incidentales, consecuentes, especiales o punitivos, incluida la pérdida de ganancias, 
                que resulten del uso o la imposibilidad de usar nuestra plataforma.
              </p>
              <p className="mt-2">
                Gabby no garantiza que la plataforma esté libre de errores o que el acceso a la misma sea 
                continuo e ininterrumpido. Nos esforzamos por proporcionar una experiencia educativa de alta calidad, 
                pero no podemos garantizar resultados específicos de aprendizaje.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Modificaciones de los Términos</h2>
              <p>
                Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones 
                entrarán en vigor inmediatamente después de su publicación en nuestra plataforma. Se recomienda revisar 
                periódicamente estos términos para estar al tanto de cualquier cambio.
              </p>
              <p className="mt-2">
                El uso continuado de nuestra plataforma después de cualquier modificación constituye su aceptación de los 
                nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Legislación Aplicable</h2>
              <p>
                Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de España, 
                sin tener en cuenta sus conflictos de disposiciones legales.
              </p>
              <p className="mt-2">
                Cualquier disputa que surja en relación con estos términos estará sujeta a la jurisdicción exclusiva 
                de los tribunales de Madrid, España.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Contacto</h2>
              <p>
                Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos en:
              </p>
              <p className="mt-2">
                Email: hey.mygabby@gmail.com<br />
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