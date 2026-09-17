// app/legal/privacidad/page.tsx
// Política de Privacidad prudente y objetiva para atención al cliente.

import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Catálogo Digital',
  description:
    'Política de privacidad y tratamiento prudente de datos de contacto de nuestros usuarios y clientes.',
}

export default function PrivacidadPage() {
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
          <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Información Legal
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
          Política de Privacidad
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Tratamiento confidencial y prudente de la información de contacto
        </p>
      </header>

      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-5 text-sm text-zinc-700 leading-relaxed">
        <p>
          La empresa recopila únicamente los datos personales que los usuarios proporcionan de forma voluntaria al remitir formularios de contacto, comunicarse vía WhatsApp o utilizar los canales de atención habilitados.
        </p>

        <p>
          Dicha información es utilizada exclusivamente para absolver consultas, brindar cotizaciones, coordinar solicitudes de alquiler y gestionar la eventual prestación de los servicios solicitados por el cliente. La empresa procura adoptar medidas prudentes y razonables para resguardar la confidencialidad de los datos proporcionados, comprometiéndose a no emplearlos para finalidades distintas de las informadas, salvo requerimiento expreso de autoridad competente o mandato legal en el territorio peruano.
        </p>

        <p>
          Para cualquier consulta sobre el tratamiento de sus datos de contacto, el usuario podrá comunicarse a través de nuestros canales oficiales habilitados en la web.
        </p>
      </div>

      {/* Enlaces de pie de página legal */}
      <footer className="mt-10 pt-6 border-t border-zinc-200 flex flex-wrap gap-4 text-xs font-semibold text-[#0A192F]">
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
