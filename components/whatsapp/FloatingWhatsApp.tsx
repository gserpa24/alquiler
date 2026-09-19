'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { buildGenericWhatsAppLink } from '@/lib/whatsapp'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

/**
 * Botón flotante de WhatsApp visible únicamente en el sitio público.
 * Se oculta automáticamente en todas las rutas del panel administrativo (/admin/*).
 * Conectado dinámicamente al número configurado en el panel administrativo.
 * Si no hay número configurado, permanece visible en estado deshabilitado (gris) y muestra un aviso al hacer clic.
 */
export function FloatingWhatsApp() {
  const pathname = usePathname()
  const { config } = useSiteConfig()
  const [hovered, setHovered] = useState(false)

  // Ocultar en todas las rutas del panel administrativo
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const cleanPhone = (config.whatsappNumber || '').replace(/\D/g, '')
  const hasWhatsapp = Boolean(cleanPhone && cleanPhone.length >= 8)

  let waLink = '#'
  if (hasWhatsapp) {
    try {
      waLink = buildGenericWhatsAppLink(undefined, config.whatsappNumber)
    } catch {
      waLink = '#'
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!hasWhatsapp || waLink === '#') {
      e.preventDefault()
      toast.warning('Aún no hay un número configurado.')
    }
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      aria-label="Contactar por WhatsApp"
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="bg-white border border-zinc-200 rounded-md px-3.5 py-1.5 shadow-md"
            role="tooltip"
          >
            <p className="text-xs font-medium text-zinc-800 whitespace-nowrap">
              {hasWhatsapp ? 'Atención inmediata por WhatsApp' : 'Aún no hay un número configurado'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón principal */}
      <div className="relative flex items-center justify-center">
        {hasWhatsapp && (
          <>
            {/* Onda de pulso sutil y elegante */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-35 animate-ping duration-1000 pointer-events-none" />
            {/* Segundo anillo concéntrico de resplandor */}
            <span className="absolute -inset-1 rounded-full bg-[#25D366]/20 animate-pulse pointer-events-none" />
          </>
        )}

        <motion.a
          href={hasWhatsapp && waLink !== '#' ? waLink : '#'}
          target={hasWhatsapp && waLink !== '#' ? '_blank' : undefined}
          rel={hasWhatsapp && waLink !== '#' ? 'noopener noreferrer' : undefined}
          onClick={handleClick}
          aria-label={hasWhatsapp ? 'Abrir WhatsApp' : 'Aún no hay un número configurado'}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={cn(
            'relative z-10 flex items-center justify-center w-[70px] h-[70px] rounded-full text-white shadow-2xl transition-all duration-200 border-[2.5px]',
            hasWhatsapp
              ? 'bg-[#25D366] hover:bg-[#20bd5a] border-white cursor-pointer'
              : 'bg-zinc-400 hover:bg-zinc-500 border-zinc-200 cursor-pointer'
          )}
        >
          <svg
            className="w-10 h-10 text-white drop-shadow-xs"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </motion.a>
      </div>
    </div>
  )
}
