// app/legal/garantias/page.tsx
// Información sobre depósito y garantías de alquiler.

import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Depósito y Garantías | Catálogo Digital',
  description:
    'Información sobre la modalidad, consulta previa y restitución del depósito de garantía para el alquiler de vehículos.',
}

export default function GarantiasPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
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

      <header className="mb-8 pb-6 border-b border-zinc-200">
        <div className="flex items-center gap-2 text-[#0A192F] mb-2">
          <Shield className="w-5 h-5 stroke-[1.5]" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Información Legal
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
          Depósito y Garantías
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Coordinación previa, custodia y restitución según condiciones acordadas
        </p>
      </header>

      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-5 text-sm text-zinc-700 leading-relaxed">
        <p>
          De acuerdo con la categoría del vehículo, la duración del servicio y las condiciones específicas del alquiler, la empresa podrá solicitar un depósito de garantía previo a la entrega de la unidad.
        </p>

        <p>
          El monto exacto, la modalidad de custodia y las condiciones aplicables a dicho depósito se informan y coordinan de manera previa y transparente con el cliente antes de la formalización del servicio. La liquidación, deducciones que correspondan o restitución de la garantía estarán sujetas al cumplimiento de los términos acordados entre las partes para cada alquiler, incluyendo la devolución del vehículo en las condiciones pactadas y la verificación de obligaciones pendientes derivadas del uso de la unidad.
        </p>
      </div>

      {/* Enlaces de pie de página legal */}
      <footer className="mt-10 pt-6 border-t border-zinc-200 flex flex-wrap gap-4 text-xs font-semibold text-[#0A192F]">
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
