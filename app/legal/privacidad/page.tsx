// app/legal/privacidad/page.tsx
// Política de Privacidad y Tratamiento de Datos Personales conforme a la Ley N° 29733 del Perú.

import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Lock, UserCheck, ArrowLeft, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Privacidad | AUTORUTA Perú',
  description:
    'Política de Protección de Datos Personales de AUTORUTA conforme a la Ley N° 29733 y D.S. N° 003-2013-JUS de la República del Perú.',
}

export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Navegación de retorno */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver al Inicio
        </Link>
      </div>

      <header className="mb-10 pb-6 border-b border-zinc-200">
        <div className="flex items-center gap-2 text-[#0A192F] mb-2">
          <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Ley N° 29733 • República del Perú
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
          Política de Privacidad y Protección de Datos Personales
        </h1>
        <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
          En <strong>AUTORUTA</strong> (Tarapoto, San Martín, Perú) garantizamos la confidencialidad, integridad y seguridad en el tratamiento de los datos personales de nuestros usuarios y clientes, en estricto cumplimiento de la <strong>Ley N° 29733</strong> (Ley de Protección de Datos Personales del Perú) y su Reglamento aprobado por el <strong>Decreto Supremo N° 003-2013-JUS</strong>.
        </p>
        <p className="mt-2 text-xs text-zinc-400">
          Última actualización: Septiembre de 2026 • Tarapoto, San Martín, Perú.
        </p>
      </header>

      <div className="space-y-10 text-sm text-zinc-700 leading-relaxed">
        {/* 1. Responsable del Tratamiento */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">1</span>
            Responsable y Titular del Banco de Datos
          </h2>
          <p>
            El responsable del tratamiento de los datos personales es <strong>AUTORUTA</strong>, con domicilio comercial en la ciudad de Tarapoto, Provincia y Departamento de San Martín, Perú. Los datos recopilados a través de nuestro sitio web o canales de atención física y digital se incorporan a nuestros bancos de datos debidamente protegidos con medidas técnicas y organizativas de seguridad.
          </p>
        </section>

        {/* 2. Datos Personales Recopilados */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">2</span>
            Categorías de Datos Recopilados
          </h2>
          <p>
            Para la cotización, verificación de requisitos de conducción y formalización del arrendamiento vehicular, La Empresa podrá solicitar y tratar los siguientes datos de los usuarios:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
            <li><strong>Datos de Identificación:</strong> Nombres completos, número de Documento Nacional de Identidad (DNI), Carné de Extranjería o Pasaporte.</li>
            <li><strong>Datos de Contacto:</strong> Número de teléfono celular, cuenta de WhatsApp, correo electrónico y dirección domiciliaria.</li>
            <li><strong>Datos de Habilitación para Conducir:</strong> Número de Licencia de Conducir emitida por el MTC o Licencia Internacional, categoría, vigencia y récord de conductor para fines de verificación de seguridad vial.</li>
            <li><strong>Datos de Pago:</strong> Comprobantes de transferencia bancaria o vouchers de retención de garantía para el alquiler.</li>
          </ul>
        </section>

        {/* 3. Finalidad del Tratamiento */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">3</span>
            Finalidad del Tratamiento de Datos
          </h2>
          <p>
            Los datos personales proporcionados serán tratados de manera proporcional y lícita para los siguientes fines indispensables:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
            <li>Elaborar cotizaciones, verificar la disponibilidad de la flota y coordinar la entrega en Tarapoto o destinos autorizados.</li>
            <li>Verificar la vigencia de la licencia de conducir en el Sistema Nacional de Conductores del MTC.</li>
            <li>Redactar y suscribir el Contrato de Arrendamiento Vehicular y las Actas de Inspección técnica correspondientes.</li>
            <li>Gestionar el cobro de la renta, la custodia y oportuna devolución del depósito de garantía.</li>
            <li>Tramitar el pago de peajes y deslinde de papeletas de tránsito o infracciones ante la Policía Nacional del Perú, SUTRAN o autoridades municipales competentes.</li>
            <li>Atender requerimientos formulados a través del Libro de Reclamaciones conforme al Código del Consumidor (Ley N° 29571).</li>
          </ul>
        </section>

        {/* 4. Consentimiento Libre, Previo e Informado */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">4</span>
            Consentimiento del Titular de los Datos
          </h2>
          <p>
            Al comunicarse a través de nuestros botones de WhatsApp, formularios web o al suscribir el contrato de alquiler, el usuario otorga su consentimiento previo, libre, expreso, inequívoco e informado para que AUTORUTA realice el tratamiento de sus datos conforme a los términos de esta política (Art. 12° y 13° de la Ley N° 29733).
          </p>
        </section>

        {/* 5. Transferencia y Confidencialidad */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">5</span>
            Confidencialidad y Transferencia a Terceros
          </h2>
          <p>
            AUTORUTA no vende, comercializa ni arrienda sus datos personales a terceras partes. La información únicamente podrá ser comunicada a:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
            <li>La compañía de seguros en caso de siniestro, accidente de tránsito o trámite de coberturas del SOAT.</li>
            <li>Autoridades policiales, fiscales, judiciales, INDECOPI, MTC o SUTRAN en cumplimiento de un mandato legal expreso.</li>
          </ul>
        </section>

        {/* 6. Ejercicio de Derechos ARCO */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">6</span>
            Ejercicio de Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)
          </h2>
          <p>
            De conformidad con la Ley N° 29733, usted como titular de sus datos personales tiene derecho a acceder a ellos, rectificarlos en caso de inexactitud, solicitar su cancelación o revocación del consentimiento, y oponerse a su tratamiento para finalidades no indispensables.
          </p>
          <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200">
            <p className="font-semibold text-zinc-900 mb-1">¿Cómo ejercer sus derechos ARCO?</p>
            <p className="text-xs text-zinc-600 mb-2">
              Puede presentar su solicitud adjuntando copia de su DNI o documento oficial de identidad dirigida a nuestro canal de atención:
            </p>
            <p className="text-xs text-zinc-800 font-medium">
              📧 Correo de atención: <strong>contacto@premiumauto.ec</strong> / <strong>ventas@autoruta.pe</strong><br />
              📍 Sede: Tarapoto, San Martín, Perú.<br />
              Plazo de respuesta legal: Máximo diez (10) días hábiles para acceso y diez (10) días para rectificación, cancelación u oposición.
            </p>
          </div>
        </section>

        {/* 7. Medidas de Seguridad */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">7</span>
            Medidas Técnicas de Seguridad
          </h2>
          <p>
            Implementamos protocolos de seguridad estándar de la industria que incluyen cifrado SSL/TLS en tránsito para todo nuestro sitio web, control estricto de accesos y almacenamiento seguro para prevenir la alteración, pérdida, fuga o acceso no autorizado a su información.
          </p>
        </section>
      </div>

      <footer className="mt-12 pt-8 border-t border-zinc-200 flex flex-wrap gap-4 text-xs font-semibold text-[#0A192F]">
        <Link href="/legal/terminos" className="hover:underline underline-offset-4">
          Términos y Condiciones
        </Link>
        <span className="text-zinc-300">•</span>
        <Link href="/legal/garantias" className="hover:underline underline-offset-4">
          Depósito y Garantías
        </Link>
        <span className="text-zinc-300">•</span>
        <Link href="/reclamaciones" className="hover:underline underline-offset-4">
          Libro de Reclamaciones
        </Link>
      </footer>
    </div>
  )
}
