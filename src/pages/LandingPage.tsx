import { useLocation } from 'wouter';
import { Button } from '../components/ui/Button';
import { ArrowRight, } from 'lucide-react';
import './landingPage.css';

export default function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      {/* Hero Section */}
      <section className="px-6 py-20 text-center max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Impulsa tu éxito en TI
          <span className="hypatia-text-gradient"> HypatIA-Prototype-V0.2</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Te apoyamos en el desarrollo de power skills que te permitan moverte hacia un nivel Middle, generando una estrategia ajustada a tus expectativas profesionales.
        </p>
      </section>

      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Importante para Participar recuerda leer los siguientes Documentos</h2>
            <p className="text-xl text-gray-600">
              Tu Información Segura y Clara: Aviso de Privacidad y Términos de Uso
            </p>
          </div>
        </div>
      </section>

      {/* DocumentsSection */}
      <section className="px-6 py-20 bg-gray-50 ">
        <div className='text-section'>
          <div id="wrapper-glow">
            <div className="scroll-area" id="scrollbar">
              <div className="inner-area" >
                <h1>Aviso de privacidad (MVP Beta)</h1>
                Identidad y Domicilio del Responsable: HypatIA es una iniciativa dedicada a impulsar y apoyar el desarrollo de las mujeres en carreras STEM. Es un proyecto open source, contactanos en:
                Datos Personales Recabados: Para el proceso de diagnóstico, reentrenamiento y seguimiento en el marco de nuestro MVP, HypatIA recabará los siguientes datos personales de las participantes:
                Datos de Identificación y Contacto: Nombre y apellido, correo electrónico, número de celular.
                Datos de Identificación Personal: Género y edad (sugerimos rangos INEGI).
                Datos de Vida Laboral y Académica: Currículum Vitae (CV) actualizado (experiencia, actividades y tareas), enlace a perfil de LinkedIn, formación inicial (medio superior, superior, posgrado), área de formación superior o tecnología/lenguaje desarrollado (ej. JAVA, Ciberseguridad, PYTHON), años de experiencia en el área tech, cuándo comenzó a trabajar en tech, posición actual, tipo de trabajo (presencial, remoto, híbrido), rango salarial, razones para buscar movimiento laboral, expectativa salarial, cursos/diplomados/talleres completados en los últimos seis meses, número de proyectos construidos con cursos.
                Datos Sensibles (Opcional, con consentimiento explícito): Si eres cuidadora de alguien y, en su caso, el tiempo dedicado semanalmente. Este dato se utiliza para entender eventos que afectan directamente a mujeres y se maneja con el máximo cuidado.
                Retroalimentación y Expectativas: Última retroalimentación sobre habilidades no técnicas, posición a la que se desea mover, tres vacantes a las que le gustaría aplicar, descripción de tareas diarias actuales.
                Datos generados por el uso de la plataforma: Información recopilada para medir el éxito de la plataforma, como número de usuarios, tasa de finalización de cursos y satisfacción, y datos para mejorar la experiencia del usuario.
                Transferencia de Datos Personales: Sus datos personales no serán compartidos con terceros sin su consentimiento previo, salvo las excepciones previstas en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
                Fines del Tratamiento de los Datos Personales: Sus datos personales serán utilizados para los siguientes fines primarios y necesarios para la prestación de nuestros servicios:
                Objetivos de aprendizaje y afinación de nuestro modelo de trabajo.
                Identificación y registro en el sistema.
                Realización de un diagnóstico personalizado para identificar fortalezas y oportunidades en power skills esenciales para la industria tech.
                Desarrollo del re-entrenamiento de habilidades y sesiones de coaching profesional estratégico 1:1, incluyendo la directriz de qué reforzar, modificar, practicar, eliminar y trabajar.
                Seguimiento de su progreso dentro de la plataforma.
                Medición de indicadores de éxito de la plataforma (ej. número de usuarias, tasa de finalización, satisfacción y mejora de la experiencia de usuaria.
                Análisis léxico y semántico de retroalimentaciones para evaluar habilidades y sugerir metodologías de mejora.
                Medidas de Seguridad: HypatIA se compromete a proteger sus datos personales mediante medidas de seguridad administrativas, técnicas y físicas, para evitar su daño, pérdida, alteración, destrucción, uso, acceso o tratamiento no autorizado.
                Derechos ARCO y Revocación del Consentimiento: Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada conforme a los principios, deberes y obligaciones previstas en la normativa (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición).
                Para el ejercicio de cualquiera de los derechos ARCO, la revocación de su consentimiento o para cualquier duda o aclaración, puede enviar un correo electrónico a hola.hypatiasof@gmail.com
                Cambios al Aviso de Privacidad: El presente Aviso de Privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales, de nuestras propias necesidades por los productos o servicios que ofrecemos, de nuestras prácticas de privacidad, de cambios en nuestro modelo de negocio, o por otras causas. Nos comprometemos a mantenerla informada sobre los cambios que pueda sufrir el presente aviso de privacidad, a través de hola.hypatiasof@gmail.com
                Fecha de última actualización: Julio 19, 2025
                <div className="force-overflow"></div>
              </div>
            </div>
          </div>
        </div>
        <div className='text-section'>
          <div id="wrapper-glow">
            <div className="scroll-area" id="scrollbar">
              <div className="inner-area" >
                <h1>TÉRMINOS Y CONDICIONES DE USO DEL SERVICIO HYPATIA (MVP BETA)Header</h1>
                Fecha de Entrada en Vigor: Julio 19, 2025
                Bienvenida a HypatIA, una plataforma diseñada para impulsar el desarrollo de mujeres en carreras STEM. Al registrarte y utilizar nuestra plataforma en esta fase de Producto Mínimo Viable (MVP) beta, aceptas los presentes Términos y Condiciones de Uso. Te pedimos que los leas detenidamente.
                1. Aceptación de los Términos Al acceder o utilizar los servicios de HypatIA, confirmas que has leído, entendido y aceptado vincularte con estos Términos y Condiciones de Uso. Si no estás de acuerdo con estos términos, no debes usar la plataforma. Estos Términos constituyen un acuerdo legal vinculante entre tú y HypatIA.
                2. Naturaleza del Servicio (MVP Beta) HypatIA es un Producto Mínimo Viable (MVP) en fase de prueba (beta testing). Esto significa que el servicio puede ser incompleto, contener errores, bugs, no ser completamente funcional o presentar interrupciones. El objetivo de esta fase es recopilar retroalimentación para mejorar el producto.
                3. Descripción del Servicio HypatIA ofrece un proceso de acompañamiento estratégico y personalizado enfocado en "power skills" (habilidades blandas) esenciales para la industria tech, mediante un modelo de tres etapas: diagnóstico, reentrenamiento y seguimiento. Nuestro servicio incluye sesiones de coaching profesional estratégico 1:1.
                4. Registro y Cuentas de Usuario
                Para utilizar ciertas funcionalidades, deberás registrarte y crear una cuenta, proporcionando información precisa y actualizada. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.
                Te comprometes a notificar a HypatIA inmediatamente sobre cualquier uso no autorizado de tu cuenta o cualquier otra violación de seguridad.
                5. Propiedad Intelectual
                Todo el contenido presente en la plataforma HypatIA, incluyendo textos, gráficos, logotipos, imágenes, videos, software (incluido el código de tu MVP, que está bajo licencia LGPL) , así como la selección y disposición de los mismos, es propiedad exclusiva de HypatIA o de sus licenciantes, y está protegido por las leyes de propiedad intelectual de México, incluyendo la Ley Federal de Protección a la Propiedad Industrial (LFPPI) y la Ley Federal del Derecho de Autor (LFDA).
                No podrás usar, guardar, copiar, reproducir, distribuir, transmitir, mostrar, vender, intercambiar, licenciar o explotar de cualquier otra manera el contenido de la plataforma para ningún otro propósito sin el consentimiento previo por escrito de HypatIA.
                6. Licencia del Software (MVP) Tu participación en esta fase MVP implica el uso de nuestro prototipo, que está licenciado bajo la Licencia Pública General Reducida de GNU (LGPL). Esto significa que, si bien nuestro código de MVP es abierto y fomenta la colaboración, nos reservamos el derecho de ofrecer una versión completa y comercial con derechos reservados en el futuro, vinculando el código LGPL con software propietario. Al usar el MVP, reconoces y aceptas esta estrategia de licenciamiento dual.
                7. Conducta del Usuario Te comprometes a utilizar la plataforma de manera responsable y legal. No podrás:
                Realizar actividades ilegales o que infrinjan los derechos de terceros.
                Publicar contenido que sea difamatorio, obsceno, ofensivo, amenazante o que promueva la discriminación.
                Intentar acceder sin autorización a la plataforma, sistemas o redes conectadas a la plataforma.
                Interferir o interrumpir la integridad o el rendimiento de la plataforma.
                El contenido compartido durante las sesiones de coaching 1:1 es privado y confidencial entre la participante y la Coach, y debe mantenerse dentro de un marco de confianza absoluta.
                8. Exclusión de Garantías DADO QUE HYPATIA ES UN MVP EN FASE BETA, LA PLATAFORMA Y SUS SERVICIOS SE PROPORCIONAN "TAL CUAL" Y "SEGÚN DISPONIBILIDAD", SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS. HypatIA no garantiza que la plataforma será ininterrumpida, libre de errores, segura o que cualquier defecto será corregido. No nos hacemos responsables de posibles fallas, errores o interrupciones en el servicio durante esta fase de prueba.
                9. Limitación de Responsabilidad En la medida máxima permitida por la ley aplicable, HypatIA no será responsable por ningún daño directo, indirecto, incidental, especial, consecuencial o punitivo, incluyendo, sin limitación, la pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de (i) tu acceso o uso o incapacidad de acceso o uso de la plataforma; (ii) cualquier conducta o contenido de terceros en la plataforma; (iii) cualquier contenido obtenido de la plataforma; y (iv) el acceso, uso o alteración no autorizado de tus transmisiones o contenido, ya sea basado en garantía, contrato, agravio (incluida la negligencia) o cualquier otra teoría legal, incluso si hemos sido informados de la posibilidad de tales daños.
                10. Modificaciones de los Términos y Condiciones Nos reservamos el derecho de modificar estos Términos y Condiciones de Uso en cualquier momento. Te notificaremos sobre cambios significativos mediante la publicación de los términos actualizados en la plataforma o por correo electrónico. El uso continuado de la plataforma después de la publicación de los cambios constituirá tu aceptación de los nuevos términos.
                11. Terminación Podemos suspender o terminar tu acceso a la plataforma de inmediato, sin previo aviso ni responsabilidad, por cualquier motivo, incluyendo, sin limitación, si incumples estos Términos y Condiciones.
                12. Ley Aplicable y Jurisdicción Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de México. Para la resolución de cualquier disputa que surja de estos Términos, tú y HypatIA se someten a la jurisdicción exclusiva de los tribunales competentes en la Ciudad de México, renunciando a cualquier otra jurisdicción que les pudiera corresponder por razón de sus domicilios presentes o futuros.
                13. Contacto Si tienes alguna pregunta sobre estos Términos y Condiciones, por favor contáctanos en hola.hypatiasof@gmail.com

                <div className="force-overflow"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Buttons Sections */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
          <div className="container-btn">
            <button className='button-giant-sesion' onClick={() => setLocation('/login')}>
              <span>  Iniciar Sesión</span>
            </button>
            <button className='button-giant-register' onClick={() => setLocation('/register')}>
              <span>  Registrarse</span>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 hypatia-gradient text-white text-center">
        <div className="max-w-4xl blue-block">
          <h2 className="text-4xl font-bold ">
            ¿Lista para Trabajar tu potencial?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Queremos darles las gracias por su increíble participación como testers de nuestra app! Su tiempo y comentarios son súper valiosos para nosotros y nos ayudan muchísimo a mejorar.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6 h-auto bg-white text-purple-600 hover:bg-gray-100"
            onClick={() => setLocation('/register')}
          >
            Comenzar mi Evaluación Ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-white text-center">
        <div className="max-w-6xl mx-auto">
          <div className="text-2xl font-bold hypatia-text-gradient mb-4">hypatIA</div>
          <p className="text-gray-400">
            Tu poder, nuestro impulso
          </p>
          <div className="mt-4 text-sm text-gray-500">
            © 2025 hypatIA. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}