// app/legal/terminos/page.tsx
// Términos y Condiciones Generales de Arrendamiento Vehicular bajo la legislación peruana.

import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Shield, AlertCircle, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | AUTORUTA Perú',
  description:
    'Términos y condiciones generales para el alquiler de vehículos en Tarapoto y territorio peruano, conforme al Código Civil y Ley de Protección al Consumidor.',
}

export default function TerminosPage() {
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
          <FileText className="w-5 h-5 stroke-[1.5]" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Marco Legal Peruano
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
          Términos y Condiciones Generales de Alquiler
        </h1>
        <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
          Los presentes Términos y Condiciones regulan el servicio de arrendamiento de vehículos automotores prestado por <strong>AUTORUTA</strong> (en adelante, &ldquo;La Empresa&rdquo;) con sede en Tarapoto, Departamento de San Martín, Perú, en estricto cumplimiento del Código Civil del Perú (D. Leg. N° 295), el Código de Protección y Defensa del Consumidor (Ley N° 29571) y el Reglamento Nacional de Tránsito (D.S. N° 016-2009-MTC).
        </p>
        <p className="mt-2 text-xs text-zinc-400">
          Última actualización: Septiembre de 2026 • Tarapoto, San Martín, República del Perú.
        </p>
      </header>

      <div className="space-y-10 text-sm text-zinc-700 leading-relaxed">
        {/* 1. Definición y Objeto */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">1</span>
            Objeto del Contrato de Arrendamiento
          </h2>
          <p>
            En virtud del artículo 1666° del Código Civil peruano, La Empresa se obliga a ceder temporalmente al Arrendatario el uso de un vehículo automotor de su flota comercial, debidamente inspeccionado y en óptimas condiciones de funcionamiento, a cambio del pago de una merced conductiva (tarifa pactada) calculada por días de alquiler.
          </p>
          <p>
            El presente contrato no confiere en ningún caso la propiedad del vehículo ni otorga derecho alguno de gravamen, subarriendo o disposición sobre el mismo.
          </p>
        </section>

        {/* 2. Requisitos para el Arrendatario */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">2</span>
            Requisitos Exigibles al Conductor
          </h2>
          <p>
            Para celebrar el contrato y tomar posesión del vehículo, el conductor titular y los conductores adicionales autorizados deben cumplir obligatoriamente con los siguientes requisitos:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
            <li><strong>Edad mínima:</strong> Tener 21 años de edad cumplidos al momento de la entrega.</li>
            <li><strong>Documento de identidad:</strong> DNI vigente para ciudadanos peruanos; Pasaporte o Carné de Extranjería con sello de ingreso legal para ciudadanos extranjeros.</li>
            <li><strong>Licencia de Conducir vigente:</strong> Licencia de conducir física o electrónica oficial emitida por el Ministerio de Transportes y Comunicaciones (MTC) del Perú (Categoría A-I como mínimo), o Licencia Internacional de Conducir con antigüedad no menor a un (1) año.</li>
            <li><strong>Medio de Pago y Depósito de Garantía:</strong> Presentar una tarjeta de crédito bancaria habilitada o realizar el depósito de garantía requerido previo a la suscripción del acta de entrega.</li>
          </ul>
        </section>

        {/* 3. Entrega, Inspección y Acta de Recepción */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">3</span>
            Inspección y Acta de Entrega / Devolución
          </h2>
          <p>
            Al momento de la entrega física del vehículo en Tarapoto (o punto coordinado en San Martín), ambas partes suscribirán un <em>Acta de Inspección y Entrega (Check-in)</em> en la que se consignará el kilometraje inicial, nivel de combustible, accesorios (llanta de repuesto, gata, llave de ruedas, triángulo, botiquín reglamentario) y estado de la carrocería con registro fotográfico fehaciente.
          </p>
          <p>
            El Arrendatario se compromete a devolver el bien en el mismo estado de conservación en que lo recibió, salvo el desgaste natural por el uso ordinario y diligente (Art. 1681° inc. 1 del Código Civil).
          </p>
        </section>

        {/* 4. Uso Permitido y Restricciones de Tránsito */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">4</span>
            Condiciones de Uso y Prohibiciones Expresas
          </h2>
          <p>
            El vehículo arrendado está destinado exclusivamente al transporte personal, familiar o de negocios lícito en vías y carreteras públicas transitables del territorio de la República del Perú. Queda terminantemente prohibido:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
            <li>Subarrendar, ceder o permitir la conducción por personas no registradas en el contrato de arrendamiento.</li>
            <li>Conducir bajo los efectos del alcohol, drogas o estupefacientes (conducta tipificada como delito en el Art. 274° del Código Penal y sancionada con la retención inmediata del vehículo y pérdida total de coberturas de seguro).</li>
            <li>Destinar el vehículo al servicio de taxi, transporte público de pasajeros remunerado, flete de carga pesada, remolque o competencias deportivas.</li>
            <li>Transitar por trochas carrozables inaccesibles, ríos, playas o lechos fluviales que comprometan los componentes mecánicos o eléctricos del vehículo.</li>
            <li>Traspasar las fronteras internacionales del Perú sin autorización notarial expresa y formal de La Empresa.</li>
          </ul>
        </section>

        {/* 5. Infracciones de Tránsito, Multas y Peajes */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">5</span>
            Infracciones de Tránsito y Pago de Peajes
          </h2>
          <p>
            Conforme al Texto Único Ordenado del Reglamento Nacional de Tránsito, el Arrendatario es el único y exclusivo responsable civil, administrativo y penal por todas las infracciones, multas, papeletas impuestas por la Policía Nacional del Perú (PNP), SUTRAN o las municipalidades provinciales durante el periodo en que el vehículo se encontró bajo su posesión y custodia.
          </p>
          <p>
            En caso de que se notifiquen papeletas de tránsito o fotopapeletas correspondientes a las fechas y horas del alquiler, La Empresa procederá a trasladar el cargo al Arrendatario o a debitarlo del depósito de garantía, anexando la constancia oficial de la infracción.
          </p>
        </section>

        {/* 6. Cobertura de Seguros, Siniestros y SOAT */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">6</span>
            Seguros y Procedimiento en Caso de Siniestro
          </h2>
          <p>
            Toda la flota de La Empresa cuenta con <strong>SOAT (Seguro Obligatorio de Accidentes de Tránsito)</strong> vigente conforme a la Ley N° 27181, con cobertura para lesiones corporales y gastos médicos de ocupantes y terceros.
          </p>
          <p>
            Adicionalmente, los vehículos cuentan con póliza vehicular contra daños materiales y robo total sujeta al pago del <strong>deducible o franquicia</strong> estipulado en la cotización. En caso de siniestro o choque, el Arrendatario está obligado por ley a:
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-zinc-600">
            <li>Comunicar de inmediato el hecho a La Empresa y a la aseguradora.</li>
            <li>Denunciar el hecho ante la Comisaría de la Policía Nacional del Perú más cercana dentro de las 4 horas siguientes.</li>
            <li>Someterse al dosaje etílico policial reglamentario de manera obligatoria.</li>
          </ol>
        </section>

        {/* 7. Devolución y Tolerancia */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">7</span>
            Plazos de Devolución y Tolerancia Horaria
          </h2>
          <p>
            El Arrendatario debe restituir el vehículo en la fecha, hora y lugar convenidos. Se otorga una tolerancia de sesenta (60) minutos posteriores a la hora acordada. Vencida dicha tolerancia sin comunicación previa ni acuerdo formal de extensión, se devengará el costo de un día adicional de alquiler más los gastos operativos que correspondan.
          </p>
        </section>

        {/* 8. Legislación Aplicable y Jurisdicción */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">8</span>
            Ley Aplicable y Solución de Controversias
          </h2>
          <p>
            El presente contrato se rige e interpreta íntegramente de conformidad con las leyes vigentes de la República del Perú. Para cualquier controversia, duda o desavenencia derivada de la validez, cumplimiento o interpretación del servicio, las partes se someten a la competencia territorial de los Jueces y Tribunales del Distrito Judicial de San Martín (Tarapoto), renunciando expresamente a cualquier otro fuero que pudiera corresponderles por razón de su domicilio presente o futuro.
          </p>
        </section>
      </div>

      {/* Enlaces de soporte legal */}
      <footer className="mt-12 pt-8 border-t border-zinc-200 flex flex-wrap gap-4 text-xs font-semibold text-[#0A192F]">
        <Link href="/legal/privacidad" className="hover:underline underline-offset-4">
          Política de Privacidad
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
