'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, Clock, Share2, Users } from 'lucide-react'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { buildGenericWhatsAppLink } from '@/lib/whatsapp'

const FOOTER_LINKS = [
  { section: 'Explora', links: [
    { label: 'Inicio',               href: '/' },
    { label: 'Autos y Flota',        href: '/catalog' },
    { label: 'Nosotros',             href: '/nosotros' },
    { label: 'Contacto',             href: '/contact' },
    { label: 'Preguntas Frecuentes', href: '/faq' },
  ]},
  { section: 'Información Legal', links: [
    { label: 'Términos y Condiciones', href: '/legal/terminos' },
    { label: 'Políticas de Privacidad', href: '/legal/privacidad' },
    { label: 'Depósito y Garantías',   href: '/legal/garantias' },
    { label: 'Libro de Reclamaciones',  href: '/reclamaciones' },
  ]},
]

export function Footer() {
  const { config } = useSiteConfig()
  const year = new Date().getFullYear()

  let waLink = `https://wa.me/${config.whatsappNumber || '51997936599'}`
  try {
    waLink = buildGenericWhatsAppLink(undefined, config.whatsappNumber)
  } catch {
    // fallback
  }

  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 mt-8 sm:mt-10 lg:mt-12" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Columna — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit" aria-label="Ir al inicio">
              <div className="relative w-10 h-7 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo-car.png"
                  alt={config.brandName || 'AutoRuta'}
                  width={40}
                  height={26}
                  className="object-contain w-auto h-6"
                  unoptimized
                />
              </div>
              <span className="text-base font-bold tracking-tight text-zinc-900">
                {config.brandName.length > 4 ? (
                  <>
                    {config.brandName.slice(0, 4)}
                    <span className="text-[#0A192F] font-bold">{config.brandName.slice(4)}</span>
                  </>
                ) : (
                  config.brandName
                )}
              </span>
            </Link>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-xs font-normal">
              {config.slogan}
            </p>

            {/* Redes y canales */}
            <div className="flex items-center gap-2 mt-6">
              {config.instagramUrl && (
                <a
                  href={config.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-zinc-200 hover:border-[#0A192F] hover:text-[#0A192F] text-zinc-500 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 stroke-[1.5]" aria-hidden="true" />
                </a>
              )}
              {config.facebookUrl && (
                <a
                  href={config.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-zinc-200 hover:border-[#0A192F] hover:text-[#0A192F] text-zinc-500 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 stroke-[1.5]" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          {/* Columnas — Links */}
          {FOOTER_LINKS.map(({ section, links }) => (
            <nav key={section} aria-label={section}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-4">
                {section}
              </h3>
              <ul className="space-y-2 text-xs" role="list">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-zinc-500 hover:text-zinc-900 transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Columna — Contacto */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-4">
              Atención
            </h3>
            <ul className="space-y-3 text-xs" role="list">
              <li className="flex items-start gap-2.5 text-zinc-500">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-[#0A192F] stroke-[1.5]" aria-hidden="true" />
                <span>
                  {config.scheduleWeekdays}
                  <br />
                  {config.scheduleWeekends}
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-zinc-500">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#0A192F] stroke-[1.5]" aria-hidden="true" />
                <span>{config.location}</span>
              </li>
              <li className="flex items-start gap-2.5 text-zinc-500">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-[#0A192F] stroke-[1.5]" aria-hidden="true" />
                <a href={waLink} className="hover:text-zinc-900 font-medium transition-colors">
                  {config.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider inferior */}
        <div className="h-px bg-zinc-200 my-10" aria-hidden="true" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {year} {config.brandName || 'AUTORUTA'}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-zinc-900 transition-colors underline-offset-4 hover:underline">
              Panel Administrativo
            </Link>
            <span>•</span>
            <p>Alquiler de Autos Cotidianos</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
