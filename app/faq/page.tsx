import type { Metadata } from 'next'
import Link from 'next/link'
import { HelpCircle, ArrowLeft } from 'lucide-react'
import { FAQSection } from '@/components/faq/FAQSection'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | Alquiler de Autos en Perú',
  description:
    'Encuentra respuestas sobre requisitos, garantías, formas de pago, combustible y proceso de consulta para el alquiler de autos en Tarapoto y Perú.',
  alternates: { canonical: '/faq' },
}

export default function FAQPage() {
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

      <FAQSection
        showCategoryFilters={true}
        title="Preguntas Frecuentes sobre el Alquiler"
        subtitle="Conoce todos los detalles sobre requisitos legales en Perú, depósitos en garantía, política de combustible y atención directa vía WhatsApp."
      />

      {/* Enlaces de pie de página legal / ayuda */}
      <footer className="mt-14 pt-8 border-t border-zinc-200 flex flex-wrap justify-center gap-6 text-xs font-semibold text-[#0A192F]">
        <Link href="/legal/terminos" className="hover:underline underline-offset-4">
          Términos y Condiciones
        </Link>
        <span className="text-zinc-300">•</span>
        <Link href="/legal/garantias" className="hover:underline underline-offset-4">
          Depósito y Garantías
        </Link>
        <span className="text-zinc-300">•</span>
        <Link href="/legal/privacidad" className="hover:underline underline-offset-4">
          Políticas de Privacidad
        </Link>
        <span className="text-zinc-300">•</span>
        <Link href="/reclamaciones" className="hover:underline underline-offset-4">
          Libro de Reclamaciones
        </Link>
      </footer>
    </div>
  )
}
