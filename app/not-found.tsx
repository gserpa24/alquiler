// app/not-found.tsx
// Página 404 global de Next.js.

import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-zinc-50 border border-zinc-200 mb-6">
        <Search className="w-6 h-6 text-zinc-400 stroke-[1.5]" aria-hidden="true" />
      </div>

      <p className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 mb-2">
        Error 404
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mb-3">
        Página no encontrada
      </h1>
      <p className="text-zinc-500 text-sm max-w-md mb-8 leading-relaxed">
        El vehículo o página solicitada no está disponible o ha sido retirada del catálogo.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#152e52] transition-colors"
        >
          Ver catálogo
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-zinc-200 text-zinc-700 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
