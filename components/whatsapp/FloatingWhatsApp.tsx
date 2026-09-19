'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import { WhatsAppIcon } from './WhatsAppIcon'

/**
 * Botón flotante de WhatsApp visible únicamente en el sitio público.
 * Se oculta automáticamente en todas las rutas del panel administrativo (/admin/*).
 * Conectado dinámicamente al número configurado en el panel administrativo.
 * Si no hay número configurado, permanece visible en estado deshabilitado (gris) y muestra un aviso al hacer clic.
 */
export function FloatingWhatsApp() {
  const pathname = usePathname()
  const { isConfigured, getGenericLink, handleDisabledClick } = useWhatsApp()
  const [hovered, setHovered] = useState(false)

  // Ocultar en todas las rutas del panel administrativo
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const { url } = getGenericLink()

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
              {isConfigured ? 'Atención inmediata por WhatsApp' : 'Aún no hay un número configurado'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón principal */}
      <div className="relative flex items-center justify-center">
        {isConfigured && (
          <>
            {/* Onda de pulso sutil y elegante */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-35 animate-ping duration-1000 pointer-events-none" />
            {/* Segundo anillo concéntrico de resplandor */}
            <span className="absolute -inset-1 rounded-full bg-[#25D366]/20 animate-pulse pointer-events-none" />
          </>
        )}

        <motion.a
          href={isConfigured ? url : '#'}
          target={isConfigured ? '_blank' : undefined}
          rel={isConfigured ? 'noopener noreferrer' : undefined}
          onClick={handleDisabledClick}
          aria-label={isConfigured ? 'Abrir WhatsApp' : 'Aún no hay un número configurado'}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={cn(
            'relative z-10 flex items-center justify-center w-[70px] h-[70px] rounded-full text-white shadow-2xl transition-all duration-200 border-[2.5px]',
            isConfigured
              ? 'bg-[#25D366] hover:bg-[#20bd5a] border-white cursor-pointer'
              : 'bg-zinc-400 hover:bg-zinc-500 border-zinc-200 cursor-pointer'
          )}
        >
          <WhatsAppIcon className="w-10 h-10 text-white drop-shadow-xs" />
        </motion.a>
      </div>
    </div>
  )
}
