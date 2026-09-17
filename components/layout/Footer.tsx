import Link from 'next/link'
import { Car, Phone, MapPin, Clock, Share2, Users } from 'lucide-react'
import { buildGenericWhatsAppLink } from '@/lib/whatsapp'

const FOOTER_LINKS = [
  { section: 'Explora', links: [
    { label: 'Inicio',            href: '/' },
    { label: 'Autos y Flota',     href: '/catalog' },
    { label: 'Sedanes',           href: '/catalog?category=sedan' },
    { label: 'SUVs',              href: '/catalog?category=suv' },
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
  const year = new Date().getFullYear()
  let waLink = 'https://wa.me/51997936599'
  try {
    waLink = buildGenericWhatsAppLink()
  } catch {
    // fallback
  }

  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 mt-20" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Columna — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit" aria-label="Ir al inicio">
              <div className="w-8 h-8 rounded-md bg-[#0A192F] flex items-center justify-center text-white">
                <Car className="w-4 h-4 stroke-[1.75]" aria-hidden="true" />
              </div>
              <span className="text-base font-bold tracking-tight text-zinc-900">
                AUTO<span className="text-[#0A192F] font-bold">RUTA</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-xs font-normal">
              Servicio de alquiler de autos cotidianos, viajes por carretera (road trips) y ruteo diario con total transparencia.
            </p>

            {/* Redes y canales */}
            <div className="flex items-center gap-2 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-zinc-200 hover:border-[#0A192F] hover:text-[#0A192F] text-zinc-500 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 stroke-[1.5]" aria-hidden="true" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-zinc-200 hover:border-[#0A192F] hover:text-[#0A192F] text-zinc-500 transition-colors"
              >
                <Users className="w-3.5 h-3.5 stroke-[1.5]" aria-hidden="true" />
              </a>
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
                <span>Lunes — Viernes: 8:00 – 19:00<br />Sábados: 9:00 – 17:00</span>
              </li>
              <li className="flex items-start gap-2.5 text-zinc-500">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#0A192F] stroke-[1.5]" aria-hidden="true" />
                <span>Tarapoto, San Martín</span>
              </li>
              <li className="flex items-start gap-2.5 text-zinc-500">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-[#0A192F] stroke-[1.5]" aria-hidden="true" />
                <a href={waLink} className="hover:text-zinc-900 font-medium transition-colors">
                  +51 997 936 599
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider inferior */}
        <div className="h-px bg-zinc-200 my-10" aria-hidden="true" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {year} AUTORUTA. Todos los derechos reservados.</p>
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
