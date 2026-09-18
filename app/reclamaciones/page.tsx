// app/reclamaciones/page.tsx
// Página oficial de Libro de Reclamaciones Virtual conforme a Ley N° 29571 e INDECOPI.

import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, ArrowLeft, MapPin, Phone } from 'lucide-react'
import { LibroReclamacionesForm } from '@/components/legal/LibroReclamacionesForm'

export const metadata: Metadata = {
  title: 'Libro de Reclamaciones Virtual | AUTORUTA Perú',
  description:
    'Libro de Reclamaciones Virtual de AUTORUTA en Tarapoto, San Martín, conforme al Código de Protección y Defensa del Consumidor (Ley N° 29571) y disposiciones de INDECOPI.',
}

export default function ReclamacionesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Navegación de retorno */}
      <div className="mb-8 print:hidden">
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
          <BookOpen className="w-5 h-5 stroke-[1.5]" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Conforme a Ley N° 29571 • D.S. N° 011-2011-PCM
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
          Libro de Reclamaciones Virtual
        </h1>
        <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
          Ponemos a tu disposición nuestro Libro de Reclamaciones Virtual para registrar cualquier reclamo o queja respecto al servicio de alquiler de vehículos brindado por <strong>AUTORUTA</strong> en Tarapoto, San Martín, Perú.
        </p>

        {/* Datos del Proveedor según exigencia de INDECOPI */}
        <div className="mt-4 p-4 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <span className="font-semibold text-zinc-900 block">Razón Comercial:</span>
            <span>AUTORUTA</span>
          </div>
          <div>
            <span className="font-semibold text-zinc-900 block">Sede y Dirección:</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#0A192F] shrink-0" />
              Tarapoto, San Martín, Perú
            </span>
          </div>
          <div>
            <span className="font-semibold text-zinc-900 block">Contacto Oficial:</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#0A192F] shrink-0" />
              +51 997 936 599
            </span>
          </div>
        </div>
      </header>

      {/* Formulario interactivo con generación de código oficial */}
      <LibroReclamacionesForm />

      <footer className="mt-12 pt-8 border-t border-zinc-200 flex flex-wrap gap-4 text-xs font-semibold text-[#0A192F] print:hidden">
        <Link href="/legal/terminos" className="hover:underline underline-offset-4">
          Términos y Condiciones
        </Link>
        <span className="text-zinc-300">•</span>
        <Link href="/legal/privacidad" className="hover:underline underline-offset-4">
          Política de Privacidad
        </Link>
        <span className="text-zinc-300">•</span>
        <Link href="/legal/garantias" className="hover:underline underline-offset-4">
          Depósito y Garantías
        </Link>
      </footer>
    </div>
  )
}
