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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-16">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="max-w-3xl mb-8 sm:mb-12">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 mb-1.5">
          Atención
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 mb-3">
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
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md bg-[#25D366] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#20bd5a] transition-colors shadow-xs"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Consultar por WhatsApp</span>
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
                Tarapoto, San Martín
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-zinc-500">
              <Clock className="w-4 h-4 text-[#0A192F] shrink-0 mt-0.5 stroke-[1.5]" />
              <div>
                <strong className="block text-zinc-900 font-semibold mb-0.5">Horarios de Atención</strong>
                Lunes a Viernes: 08:00 – 19:00<br />
                Sábados: 09:00 – 17:00
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
              <p className="text-[11px] text-zinc-400 mt-0.5">Tarapoto, San Martín</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
