import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react'
import { ContactForm } from '@/components/contact/ContactForm'
import { WhatsAppActionLink } from '@/components/whatsapp/WhatsAppActionLink'
import { WhatsAppIcon } from '@/components/whatsapp/WhatsAppIcon'
import { getSafeGenericWhatsAppLink } from '@/lib/whatsapp'
import { getSiteConfigFile } from '@/lib/site-config-server'

export const metadata: Metadata = {
  title: 'Contacto y Ubicación',
  description:
    'Contáctanos para información sobre alquiler y compra de vehículos. Visita nuestro showroom o escríbenos directamente por WhatsApp.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  const config = await getSiteConfigFile()
  const { url: waLink, isConfigured: hasWhatsapp } = getSafeGenericWhatsAppLink(
    undefined,
    config.whatsappNumber
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-2 sm:pb-4">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="max-w-3xl mb-6 sm:mb-8">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 mb-1.5">
          Atención
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 mb-3">
          Contacto y Ubicación
        </h1>
        <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
          ¿Tienes consultas sobre disponibilidad, modelos o cotizaciones de vehículos?
          {hasWhatsapp ? ' Escríbenos directamente por WhatsApp o comunícate con nuestro equipo.' : ' Comunícate directamente con nuestro equipo.'}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* ── Columna Formulario ────────────────────────────── */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-lg border border-zinc-200 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-zinc-900 mb-6">
              Envíanos un mensaje directo
            </h2>
            <ContactForm />
          </div>
        </div>

        {/* ── Columna Canales y Horarios ─────────────────────── */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          {/* Card WhatsApp directo — siempre visible */}
          <div className="p-6 sm:p-7 rounded-lg bg-white border border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded bg-zinc-50 border border-zinc-200 flex items-center justify-center text-[#0A192F] shrink-0">
                  <MessageSquare className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Atención Inmediata por WhatsApp
                  </h3>
                  <p className="text-[11px] text-zinc-400">Respuesta rápida</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
                Nuestro equipo comercial responde consultas de disponibilidad y cotizaciones directamente por WhatsApp.
              </p>
            </div>
            <WhatsAppActionLink
              href={waLink}
              hasWhatsapp={hasWhatsapp}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md font-semibold text-xs uppercase tracking-wider transition-colors shadow-xs"
              activeClassName="bg-[#25D366] text-white hover:bg-[#20bd5a] cursor-pointer"
              disabledClassName="bg-zinc-200 text-zinc-400 border border-zinc-300 hover:bg-zinc-200 cursor-not-allowed"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Consultar por WhatsApp</span>
            </WhatsAppActionLink>
          </div>

          {/* Información de contacto */}
          <div className="p-6 sm:p-7 rounded-lg bg-white border border-zinc-200 space-y-4 flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-zinc-900 mb-2">
              Información de Contacto
            </h3>

            <div className="flex items-start gap-3 text-xs text-zinc-500">
              <MapPin className="w-4 h-4 text-[#0A192F] shrink-0 mt-0.5 stroke-[1.5]" />
              <div>
                <strong className="block text-zinc-900 font-semibold mb-0.5">Dirección</strong>
                {config.location}
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-zinc-500">
              <Clock className="w-4 h-4 text-[#0A192F] shrink-0 mt-0.5 stroke-[1.5]" />
              <div>
                <strong className="block text-zinc-900 font-semibold mb-0.5">Horarios de Atención</strong>
                {config.scheduleWeekdays}<br />
                {config.scheduleWeekends}
              </div>
            </div>

            {config.phone ? (
              <div className="flex items-start gap-3 text-xs text-zinc-500">
                <Phone className="w-4 h-4 text-[#0A192F] shrink-0 mt-0.5 stroke-[1.5]" />
                <div>
                  <strong className="block text-zinc-900 font-semibold mb-0.5">Teléfono</strong>
                  {config.phone}
                </div>
              </div>
            ) : null}

            <div className="flex items-start gap-3 text-xs text-zinc-500">
              <Mail className="w-4 h-4 text-[#0A192F] shrink-0 mt-0.5 stroke-[1.5]" />
              <div>
                <strong className="block text-zinc-900 font-semibold mb-0.5">Correo Electrónico</strong>
                contacto@premiumauto.ec
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
