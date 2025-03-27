import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal | Gabby",
  description: "Aviso legal de Gabby. Información legal sobre nuestra plataforma de enseñanza de inglés con IA.",
};

export default function AvisoLegal() {
  return (
    <div className="bg-gray-900 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Aviso Legal
            </h1>
            <p className="text-gray-300">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Información General</h2>
              <p>
                De conformidad con lo establecido en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad 
                de la Información y de Comercio Electrónico, se pone a disposición de los usuarios y visitantes 
                la siguiente información general:
              </p>
              {/*<p className="mt-3">
                La titularidad de este sitio web corresponde a:
              </p>
              <p className="mt-2">
                <strong>Nombre/Razón Social:</strong> Gabby S.L.<br />
                <strong>CIF/NIF:</strong> B12345678<br />
                <strong>Domicilio:</strong> Calle Principal 123, 28001 Madrid, España<br />
                <strong>Teléfono:</strong> +34 91 123 4567<br />
                <strong>Email:</strong> info@english-academy.com<br />
                <strong>Inscripción en el Registro Mercantil:</strong> Registro Mercantil de Madrid, Tomo 12345, Folio 67, Hoja M-123456, Inscripción 1ª
              </p>*/}
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Objeto</h2>
              <p>
                El presente aviso legal regula el uso y utilización del sitio web www.english-academy.com, 
                del que es titular Gabby S.L.
              </p>
              <p className="mt-2">
                La navegación por el sitio web de Gabby atribuye la condición de usuario del mismo 
                e implica la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas 
                en este Aviso Legal, que pueden sufrir modificaciones.
              </p>
              <p className="mt-2">
                El usuario se obliga a hacer un uso correcto del sitio web de conformidad con las leyes, la buena fe, 
                el orden público, los usos del tráfico y el presente Aviso Legal. El usuario responderá frente a 
                Gabby o frente a terceros, de cualesquiera daños y perjuicios que pudieran causarse como 
                consecuencia del incumplimiento de dicha obligación.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Condiciones de Acceso y Utilización</h2>
              <p>
                El sitio web y sus servicios son de acceso libre y gratuito. No obstante, Gabby puede 
                condicionar la utilización de algunos de los servicios ofrecidos en su web a la previa formalización 
                del correspondiente contrato de suscripción o prestación de servicios.
              </p>
              <p className="mt-2">
                El usuario garantiza la autenticidad y actualidad de todos aquellos datos que comunique a 
                Gabby y será el único responsable de las manifestaciones falsas o inexactas que realice.
              </p>
              <p className="mt-2">
                El usuario se compromete expresamente a hacer un uso adecuado de los contenidos y servicios de 
                Gabby y a no emplearlos para, entre otros:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Difundir contenidos delictivos, violentos, pornográficos, racistas, xenófobos, ofensivos, de apología del terrorismo o, en general, contrarios a la ley o al orden público.</li>
                <li>Introducir en la red virus informáticos o realizar actuaciones susceptibles de alterar, estropear, interrumpir o generar errores o daños en los documentos electrónicos, datos o sistemas físicos y lógicos de Gabby o de terceras personas.</li>
                <li>Intentar acceder a las cuentas de correo electrónico de otros usuarios o a áreas restringidas de los sistemas informáticos de Gabby o de terceros y, en su caso, extraer información.</li>
                <li>Vulnerar los derechos de propiedad intelectual o industrial, así como violar la confidencialidad de la información de Gabby o de terceros.</li>
                <li>Suplantar la identidad de cualquier otro usuario.</li>
                <li>Reproducir, copiar, distribuir, poner a disposición o de cualquier otra forma comunicar públicamente, transformar o modificar los contenidos, a menos que se cuente con la autorización del titular de los correspondientes derechos o ello resulte legalmente permitido.</li>
                <li>Recabar datos con finalidad publicitaria y de remitir publicidad de cualquier clase y comunicaciones con fines de venta u otras de naturaleza comercial sin que medie su previa solicitud o consentimiento.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Exclusión de Garantías y Responsabilidad</h2>
              <p>
                Gabby no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier 
                naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, 
                falta de disponibilidad del sitio web o la transmisión de virus o programas maliciosos en los 
                contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
              </p>
              <p className="mt-2">
                Gabby no garantiza que el sitio web y el servidor estén libres de virus y no se hace 
                responsable de los daños causados por el acceso al sitio web o por la imposibilidad de acceder.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Política de Enlaces</h2>
              <p>
                El sitio web de Gabby puede incluir enlaces a otros sitios web gestionados por terceros.
              </p>
              <p className="mt-2">
                Gabby no ejerce ningún tipo de control sobre dichos sitios y contenidos, de modo que en 
                ningún caso asumirá responsabilidad alguna por los contenidos de algún enlace perteneciente a un 
                sitio web ajeno, ni garantizará la disponibilidad técnica, calidad, fiabilidad, exactitud, amplitud, 
                veracidad, validez y constitucionalidad de cualquier material o información contenida en ninguno de 
                dichos hipervínculos u otros sitios de Internet.
              </p>
              <p className="mt-2">
                La inclusión de estas conexiones externas no implicará ningún tipo de asociación, fusión o participación 
                con las entidades conectadas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Propiedad Intelectual e Industrial</h2>
              <p>
                Todos los derechos de propiedad intelectual e industrial del sitio web, incluyendo, a título 
                enunciativo y no limitativo, la estructura, diseño gráfico, código fuente, logos, textos, gráficos, 
                ilustraciones, fotografías, sonidos y demás elementos contenidos en el mismo, son propiedad de 
                Gabby o de sus licenciantes.
              </p>
              <p className="mt-2">
                Queda expresamente prohibida la reproducción, distribución, transformación y comunicación pública, 
                incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de esta 
                web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización 
                de Gabby.
              </p>
              <p className="mt-2">
                El usuario se compromete a respetar los derechos de Propiedad Intelectual e Industrial titularidad 
                de Gabby. Podrá visualizar los elementos del sitio web e incluso imprimirlos, copiarlos y 
                almacenarlos en el disco duro de su ordenador o en cualquier otro soporte físico siempre y cuando 
                sea, única y exclusivamente, para su uso personal y privado. El usuario deberá abstenerse de 
                suprimir, alterar, eludir o manipular cualquier dispositivo de protección o sistema de seguridad 
                que estuviera instalado en las páginas de Gabby.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Acciones Legales</h2>
              <p>
                Gabby se reserva la facultad de presentar las acciones civiles o penales que considere 
                oportunas por la utilización indebida de su sitio web y contenidos, o por el incumplimiento de las 
                presentes condiciones.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Legislación Aplicable y Jurisdicción</h2>
              <p>
                La relación entre Gabby y el usuario se regirá por la normativa española vigente. Todas 
                las disputas y reclamaciones derivadas de este aviso legal se resolverán por los juzgados y 
                tribunales de Madrid (España).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Contacto</h2>
              <p>
                Para cualquier consulta relacionada con este Aviso Legal, puede contactarnos en:
              </p>
              <p className="mt-2">
                Email: legal@english-academy.com<br />
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