import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react'
import { ContactForm } from '@/components/contact/ContactForm'
import { buildGenericWhatsAppLink } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Contacto y Ubicación',
  description:
    'Contáctanos para información sobre alquiler y compra de vehículos. Visita nuestro showroom o escríbenos directamente por WhatsApp.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  const waLink = buildGenericWhatsAppLink()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="max-w-3xl mb-12">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 mb-1.5">
          Atención
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-3">
          Contacto y Ubicación
        </h1>
        <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
          ¿Tienes consultas sobre disponibilidad, modelos o cotizaciones de vehículos?
          Escríbenos directamente por WhatsApp o comunícate con nuestro equipo.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* ── Columna Formulario ────────────────────────────── */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-lg border border-zinc-200">
          <h2 className="text-base font-bold tracking-tight text-zinc-900 mb-6">
            Envíanos un mensaje directo
          </h2>
          <ContactForm />
        </div>

        {/* ── Columna Canales y Horarios ─────────────────────── */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card WhatsApp directo */}
          <div className="p-6 rounded-lg bg-white border border-zinc-200">
            <div className="w-9 h-9 rounded bg-zinc-50 border border-zinc-200 flex items-center justify-center mb-4 text-[#0A192F]">
              <MessageSquare className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 mb-1.5">
              Atención Inmediata por WhatsApp
            </h3>
            <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
              Nuestro equipo comercial responde consultas de disponibilidad y cotizaciones directamente por WhatsApp.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-md bg-[#0A192F] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#152e52] transition-colors"
            >
              Consultar por WhatsApp
            </a>
          </div>

          {/* Información de contacto */}
          <div className="p-6 rounded-lg bg-white border border-zinc-200 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 mb-3">
              Información de Contacto
            </h3>

            <div className="flex items-start gap-3 text-xs text-zinc-500">
              <MapPin className="w-4 h-4 text-[#0A192F] shrink-0 mt-0.5 stroke-[1.5]" />
              <div>
                <strong className="block text-zinc-900 font-semibold mb-0.5">Dirección</strong>
                Tarapoto, San Martín, Perú
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-zinc-500">
              <Clock className="w-4 h-4 text-[#0A192F] shrink-0 mt-0.5 stroke-[1.5]" />
              <div>
                <strong className="block text-zinc-900 font-semibold mb-0.5">Horarios de Atención</strong>
                Horario de lunes a sábado
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-zinc-500">
              <Phone className="w-4 h-4 text-[#0A192F] shrink-0 mt-0.5 stroke-[1.5]" />
              <div>
                <strong className="block text-zinc-900 font-semibold mb-0.5">Teléfono / WhatsApp</strong>
                +51 997 936 599
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-zinc-500">
              <Mail className="w-4 h-4 text-[#0A192F] shrink-0 mt-0.5 stroke-[1.5]" />
              <div>
                <strong className="block text-zinc-900 font-semibold mb-0.5">Correo Electrónico</strong>
                contacto@premiumauto.ec
              </div>
            </div>
          </div>

          {/* Mapa representativo */}
          <div className="rounded-lg border border-zinc-200 overflow-hidden h-40 bg-zinc-50 relative flex items-center justify-center">
            <div className="text-center p-4">
              <MapPin className="w-5 h-5 text-[#0A192F] mx-auto mb-1.5 stroke-[1.5]" />
              <p className="text-xs font-semibold text-zinc-900">Atención Central</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Tarapoto, San Martín, Perú</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
