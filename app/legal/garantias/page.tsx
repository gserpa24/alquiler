// app/legal/garantias/page.tsx
// Política de Depósito de Garantía, Coberturas de Seguro y SOAT en el Perú.

import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, CreditCard, RefreshCw, CheckCircle2, ArrowLeft, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Depósito y Garantías | AUTORUTA Perú',
  description:
    'Condiciones y procedimiento de retención, custodia y devolución del depósito de garantía, franquicias de seguro y SOAT conforme a la ley peruana.',
}

export default function GarantiasPage() {
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
          <Shield className="w-5 h-5 stroke-[1.5]" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Seguridad y Transparencia
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
          Política de Depósito de Garantía y Coberturas
        </h1>
        <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
          En <strong>AUTORUTA</strong> aplicamos una política clara y transparente respecto a la custodia y devolución del depósito de garantía, así como el alcance del SOAT y el seguro vehicular contratado para salvaguardar la tranquilidad de nuestros usuarios en Tarapoto y rutas del Perú.
        </p>
        <p className="mt-2 text-xs text-zinc-400">
          Última actualización: Septiembre de 2026 • Tarapoto, San Martín, Perú.
        </p>
      </header>

      <div className="space-y-10 text-sm text-zinc-700 leading-relaxed">
        {/* 1. ¿Qué es el Depósito de Garantía? */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#0A192F]" />
            1. Naturaleza y Finalidad del Depósito de Garantía
          </h2>
          <p>
            El depósito de garantía es un fondo temporal de custodia que el Arrendatario entrega o autoriza como retención bancaria al momento de suscribir el contrato de arrendamiento vehicular. Su propósito exclusivo es responder por:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
            <li>El pago del <strong>deducible o franquicia del seguro vehicular</strong> en caso de siniestro, choque o robo parcial atribuible al conductor.</li>
            <li>Costos de reparación por daños materiales menores no cubiertos por la póliza (daño a neumáticos por cortes, llantazos, rajaduras de parabrisas por impactos directos o manchas severas en tapicería).</li>
            <li>Diferencia de combustible si el vehículo se devuelve con un nivel inferior al consignado en el <em>Acta de Entrega</em>.</li>
            <li>Papeletas de infracción de tránsito impuestas por la PNP o SUTRAN durante las horas de vigencia del alquiler.</li>
            <li>Días adicionales u horas de demora en la devolución no autorizadas previamente.</li>
          </ul>
        </section>

        {/* 2. Montos y Medios Habilitados */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">2</span>
            Montos de Garantía por Categoría Vehicular
          </h2>
          <p>
            El importe del depósito se calcula en función de la categoría del vehículo arrendado y se informa de manera objetiva y previa al cliente al momento de su cotización por WhatsApp:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-zinc-200 rounded-lg overflow-hidden">
              <thead className="bg-zinc-100 text-zinc-900 uppercase font-semibold">
                <tr>
                  <th className="p-3 border-b border-zinc-200">Categoría de Vehículo</th>
                  <th className="p-3 border-b border-zinc-200">Modelos Habituales</th>
                  <th className="p-3 border-b border-zinc-200">Rango de Garantía</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-600">
                <tr>
                  <td className="p-3 font-medium text-zinc-900">Compactos / Sport</td>
                  <td className="p-3">Kia Rio Hatchback, Hyundai Grand i10, Suzuki Swift</td>
                  <td className="p-3 font-semibold text-zinc-900">S/ 1,000 – S/ 1,500</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-zinc-900">Sedanes Cotidianos</td>
                  <td className="p-3">Nissan Versa, Toyota Yaris, Hyundai Accent</td>
                  <td className="p-3 font-semibold text-zinc-900">S/ 1,200 – S/ 1,800</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-zinc-900">SUVs Familiares</td>
                  <td className="p-3">Toyota RAV4, Hyundai Tucson, Kia Sportage</td>
                  <td className="p-3 font-semibold text-zinc-900">S/ 1,800 – S/ 2,500</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-zinc-900">Camionetas Pick-up 4x4</td>
                  <td className="p-3">Toyota Hilux, Ford Ranger, Mitsubishi L200</td>
                  <td className="p-3 font-semibold text-zinc-900">S/ 2,500 – S/ 3,500</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500">
            * Se acepta retención temporal en tarjeta de crédito (Visa, Mastercard, Amex) o transferencia bancaria directa a la cuenta corriente empresarial de La Empresa.
          </p>
        </section>

        {/* 3. Proceso de Devolución */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#0A192F]" />
            3. Procedimiento y Plazo de Devolución de la Garantía
          </h2>
          <p>
            Al devolver el vehículo, el personal técnico realiza la inspección conjunta (<em>Check-out</em>) en un plazo no mayor a 20 minutos:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="font-bold text-emerald-950 text-xs flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Vehículo devuelto conforme (Sin incidencias)
              </p>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Se procede al desbloqueo de la retención bancaria de inmediato o a la devolución por transferencia bancaria en un plazo máximo de <strong>24 a 48 horas hábiles</strong>, una vez validada la ausencia de fotopapeletas en el registro oficial del MTC/SUTRAN.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <p className="font-bold text-amber-950 text-xs flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Deducciones justificadas
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Si existiera faltante de combustible, rotura de neumático o daño comprobado mediante el acta inicial, se deducirá el costo exacto con comprobante de pago comercial y se liquidará el saldo a favor del Arrendatario de forma inmediata.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Cobertura del SOAT y Seguro */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">4</span>
            SOAT y Póliza Vehicular Contra Todo Riesgo
          </h2>
          <p>
            Todos los vehículos de nuestra flota circulan en estricto apego a la normativa peruana:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
            <li><strong>SOAT vigente (Ley N° 27181):</strong> Cobertura sin límite de culpa para gastos médicos, incapacidad temporal, invalidez permanente y fallecimiento de todos los ocupantes del vehículo y peatones involucrados en un accidente de tránsito en cualquier punto del territorio nacional.</li>
            <li><strong>Seguro Vehicular Integral:</strong> Protege la unidad contra colisión, choque, vuelco, incendio y robo total. Sujeto a la franquicia o deducible estipulado en la cotización oficial.</li>
          </ul>
        </section>

        {/* 5. Exclusiones de Cobertura */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">5</span>
            Exclusiones de Cobertura de Seguros
          </h2>
          <p className="text-zinc-600">
            El seguro no cubrirá daños y el Arrendatario asumirá el 100% del costo en los siguientes casos determinados por la ley de seguros:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
            <li>Conducción en estado de ebriedad (dosaje etílico positivo) o bajo influencia de drogas.</li>
            <li>Conducción por personas no autorizadas en el contrato o con licencia de conducir vencida/suspendida.</li>
            <li>Fuga del lugar del accidente o incumplimiento de la denuncia policial dentro del plazo legal de 4 horas.</li>
            <li>Negligencia grave o ingreso deliberado a zonas inundadas, ríos o terrenos no aptos para el tipo de vehículo.</li>
          </ul>
        </section>
      </div>

      <footer className="mt-12 pt-8 border-t border-zinc-200 flex flex-wrap gap-4 text-xs font-semibold text-[#0A192F]">
        <Link href="/legal/terminos" className="hover:underline underline-offset-4">
          Términos y Condiciones
        </Link>
        <span className="text-zinc-300">•</span>
        <Link href="/legal/privacidad" className="hover:underline underline-offset-4">
          Política de Privacidad
        </Link>
        <span className="text-zinc-300">•</span>
        <Link href="/reclamaciones" className="hover:underline underline-offset-4">
          Libro de Reclamaciones
        </Link>
      </footer>
    </div>
  )
}
