import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | MyBubbly",
  description: "Política de privacidad de MyBubbly. Conoce cómo recopilamos, utilizamos y protegemos tus datos personales.",
};

export default function PoliticaPrivacidad() {
  return (
    <div className="bg-gray-900 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Política de Privacidad
            </h1>
            <p className="text-gray-300">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Introducción</h2>
              <p>
                En MyBubbly ("nosotros", "nuestro" o "la empresa"), respetamos su privacidad y nos comprometemos a proteger 
                sus datos personales. Esta política de privacidad le informará sobre cómo cuidamos sus datos personales cuando 
                visita nuestra plataforma y le informará sobre sus derechos de privacidad y cómo la ley le protege.
              </p>
              <p className="mt-2">
                Es importante que lea esta política de privacidad junto con cualquier otra política que podamos proporcionar 
                en ocasiones específicas cuando estemos recopilando o procesando datos personales sobre usted, para que esté 
                plenamente consciente de cómo y por qué estamos utilizando sus datos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Responsable del Tratamiento</h2>
              <p>
                MyBubbly es el responsable del tratamiento de los datos personales que nos proporcione a través 
                de nuestra plataforma.
              </p>
              <p className="mt-2">
                <strong>Datos de contacto:</strong><br />
                MyBubbly S.L.<br />
                Calle Principal 123, 28001 Madrid, España<br />
                Email: privacidad@english-academy.com<br />
                Teléfono: +34 91 123 4567
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Datos que Recopilamos</h2>
              <p>
                Recopilamos y procesamos diferentes tipos de datos personales dependiendo de su interacción con nuestra plataforma:
              </p>
              <div className="mt-3 space-y-4">
                <div>
                  <h3 className="font-medium text-white">Datos de registro y perfil:</h3>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Nombre y apellidos</li>
                    <li>Dirección de correo electrónico</li>
                    <li>Número de teléfono (opcional)</li>
                    <li>Información de la cuenta, como nombre de usuario y contraseña</li>
                    <li>Preferencias de idioma y nivel de habilidad</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-white">Datos de uso:</h3>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Información sobre cómo utiliza nuestra plataforma</li>
                    <li>Rendimiento en las clases y evaluaciones</li>
                    <li>Grabaciones de audio durante las sesiones de conversación</li>
                    <li>Historial de clases y progreso</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-white">Datos técnicos:</h3>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Dirección IP</li>
                    <li>Datos de inicio de sesión</li>
                    <li>Tipo y versión del navegador</li>
                    <li>Configuración de zona horaria y ubicación</li>
                    <li>Tipos y versiones de plugins del navegador</li>
                    <li>Sistema operativo y plataforma</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-white">Datos de pago:</h3>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Detalles de tarjetas de pago (procesados por nuestros proveedores de pago)</li>
                    <li>Historial de facturación y transacciones</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Cómo Utilizamos sus Datos</h2>
              <p>
                Utilizamos sus datos personales para los siguientes fines:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Proporcionar y administrar su cuenta de usuario</li>
                <li>Entregar los servicios educativos solicitados, incluyendo clases de inglés y evaluaciones</li>
                <li>Personalizar la experiencia de aprendizaje según su nivel y necesidades</li>
                <li>Procesar pagos y gestionar su suscripción</li>
                <li>Enviar comunicaciones relacionadas con el servicio</li>
                <li>Mejorar nuestra plataforma y desarrollar nuevas funcionalidades</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
                <li>Detectar y prevenir fraudes y abusos</li>
                <li>Con su consentimiento, enviar información promocional sobre nuestros servicios</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Base Legal para el Tratamiento</h2>
              <p>
                Procesamos sus datos personales basándonos en una o más de las siguientes bases legales:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Ejecución de un contrato:</strong> cuando el procesamiento es necesario para cumplir con un contrato que tenemos con usted.</li>
                <li><strong>Consentimiento:</strong> cuando ha dado su consentimiento explícito para el procesamiento con un fin específico.</li>
                <li><strong>Interés legítimo:</strong> cuando el procesamiento es necesario para nuestros intereses legítimos o los de un tercero.</li>
                <li><strong>Obligación legal:</strong> cuando el procesamiento es necesario para cumplir con una obligación legal.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Compartición de Datos</h2>
              <p>
                Podemos compartir sus datos personales con las siguientes categorías de destinatarios:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Proveedores de servicios:</strong> empresas que nos proporcionan servicios como alojamiento web, procesamiento de pagos, análisis de datos, etc.</li>
                <li><strong>Socios educativos:</strong> para proporcionar contenido educativo especializado.</li>
                <li><strong>Autoridades públicas:</strong> cuando lo exija la ley o sea necesario para proteger nuestros derechos.</li>
              </ul>
              <p className="mt-3">
                No vendemos sus datos personales a terceros. Cualquier tercero con el que compartimos sus datos está obligado a protegerlos y utilizarlos solo para los fines específicos que les indicamos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Transferencias Internacionales</h2>
              <p>
                Algunos de nuestros proveedores de servicios externos están basados fuera del Espacio Económico Europeo (EEE), por lo que el procesamiento de sus datos personales implicará una transferencia internacional.
              </p>
              <p className="mt-2">
                Cuando transferimos sus datos personales fuera del EEE, nos aseguramos de que se les proporcione un nivel similar de protección mediante la implementación de al menos una de las siguientes salvaguardas:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Transferir datos a países que la Comisión Europea ha considerado que proporcionan un nivel adecuado de protección de datos personales.</li>
                <li>Utilizar cláusulas contractuales específicas aprobadas por la Comisión Europea.</li>
                <li>Utilizar proveedores con certificación de Privacy Shield (para transferencias a EE.UU.).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Seguridad de los Datos</h2>
              <p>
                Hemos implementado medidas de seguridad apropiadas para evitar que sus datos personales sean perdidos, utilizados o accedidos de forma no autorizada, alterados o divulgados. Además, limitamos el acceso a sus datos personales a aquellos empleados, agentes, contratistas y terceros que tienen una necesidad comercial de conocerlos.
              </p>
              <p className="mt-2">
                Tenemos procedimientos para tratar cualquier sospecha de violación de datos personales y le notificaremos a usted y a cualquier regulador aplicable sobre una violación cuando estemos legalmente obligados a hacerlo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Conservación de Datos</h2>
              <p>
                Solo conservaremos sus datos personales durante el tiempo necesario para cumplir con los fines para los que los recopilamos, incluido el cumplimiento de requisitos legales, contables o de informes.
              </p>
              <p className="mt-2">
                Para determinar el período de conservación apropiado para los datos personales, consideramos la cantidad, naturaleza y sensibilidad de los datos personales, el riesgo potencial de daño por uso o divulgación no autorizados, los fines para los que procesamos sus datos personales y si podemos lograr esos fines a través de otros medios.
              </p>
              <p className="mt-2">
                En algunas circunstancias, podemos anonimizar sus datos personales (para que ya no puedan asociarse con usted) con fines de investigación o estadísticas, en cuyo caso podemos usar esta información indefinidamente sin previo aviso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Sus Derechos</h2>
              <p>
                Bajo ciertas circunstancias, en relación con sus datos personales, usted tiene los siguientes derechos:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Acceso:</strong> solicitar una copia de sus datos personales.</li>
                <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos.</li>
                <li><strong>Supresión:</strong> solicitar la eliminación de sus datos en determinadas circunstancias.</li>
                <li><strong>Oposición:</strong> oponerse al procesamiento de sus datos.</li>
                <li><strong>Limitación del tratamiento:</strong> solicitar la restricción del procesamiento de sus datos.</li>
                <li><strong>Portabilidad:</strong> solicitar la transferencia de sus datos a usted o a un tercero.</li>
                <li><strong>Retirar el consentimiento:</strong> retirar el consentimiento en cualquier momento cuando dependemos del consentimiento para procesar sus datos.</li>
              </ul>
              <p className="mt-3">
                Si desea ejercer alguno de estos derechos, contáctenos en privacidad@english-academy.com.
              </p>
              <p className="mt-2">
                No tendrá que pagar ninguna tarifa para acceder a sus datos personales o ejercer cualquiera de los otros derechos. Sin embargo, podemos cobrar una tarifa razonable si su solicitud es claramente infundada, repetitiva o excesiva.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">11. Cambios a esta Política</h2>
              <p>
                Revisamos periódicamente nuestra política de privacidad y cualquier cambio se publicará en esta página. Los cambios significativos se le notificarán mediante un aviso destacado en nuestra plataforma o, en algunos casos, por correo electrónico.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">12. Contacto</h2>
              <p>
                Si tiene preguntas sobre esta política de privacidad o nuestras prácticas de privacidad, póngase en contacto con nuestro Delegado de Protección de Datos:
              </p>
              <p className="mt-2">
                Email: dpo@english-academy.com<br />
                Dirección: Calle Principal 123, 28001 Madrid, España<br />
                Teléfono: +34 91 123 4567
              </p>
              <p className="mt-3">
                Tiene derecho a presentar una reclamación en cualquier momento ante la Agencia Española de Protección de Datos (www.aepd.es), la autoridad de control en materia de protección de datos en España.
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