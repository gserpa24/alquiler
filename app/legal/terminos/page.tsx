// app/legal/terminos/page.tsx
// Términos y Condiciones de carácter informativo y referencial para el catálogo digital.

import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Catálogo Digital',
  description:
    'Términos y condiciones informativos y referenciales aplicables al uso de nuestro catálogo digital de vehículos.',
}

export default function TerminosPage() {
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
          <FileText className="w-5 h-5 stroke-[1.5]" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Información Legal
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
          Términos y Condiciones
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Carácter informativo y referencial para el catálogo digital
        </p>
      </header>

      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-5 text-sm text-zinc-700 leading-relaxed">
        <p>
          El presente sitio web opera como un catálogo digital de carácter informativo y referencial. Las imágenes, especificaciones técnicas, disponibilidad mostrada y tarifas de los vehículos son referenciales y pueden variar sin previo aviso.
        </p>

        <p>
          La selección de un vehículo en el sitio web o el inicio de una comunicación mediante WhatsApp no constituye una reserva automática ni la celebración de un contrato de alquiler. La disponibilidad efectiva, el precio final y las condiciones particulares aplicables a cada servicio deberán ser confirmados directamente por nuestro equipo de atención antes de formalizar cualquier acuerdo.
        </p>

        <p>
          El usuario se compromete a brindar información veraz y completa al realizar sus consultas. La empresa se reserva el derecho de evaluar cada solicitud según las condiciones comerciales y requisitos vigentes.
        </p>
      </div>

      {/* Enlaces de pie de página legal */}
      <footer className="mt-10 pt-6 border-t border-zinc-200 flex flex-wrap gap-4 text-xs font-semibold text-[#0A192F]">
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
