'use client'
// components/whatsapp/WhatsAppCTA.tsx
// Botón CTA de WhatsApp para la página de detalle del vehículo.
// Genera el link con datos del vehículo y abre wa.me en nueva pestaña.

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import { WhatsAppIcon } from './WhatsAppIcon'

interface WhatsAppCTAProps {
  brand:      string
  model:      string
  year:       number
  color?:     string | null
  /** Variante de estilo del botón */
  variant?:   'primary' | 'outline'
  /** Clases adicionales */
  className?: string
  /** Texto personalizado del botón */
  label?:     string
}

/**
 * Botón de CTA que abre WhatsApp con un mensaje preconfigurado
 * sobre el vehículo especificado.
 * Si no hay número configurado, se muestra deshabilitado en gris y notifica al hacer clic.
 */
export function WhatsAppCTA({
  brand,
  model,
  year,
  color,
  variant = 'primary',
  className,
  label = 'Consultar por WhatsApp',
}: WhatsAppCTAProps) {
  const { getVehicleLink, handleDisabledClick } = useWhatsApp()
  const { url, isConfigured } = getVehicleLink({ brand, model, year, color })

  return (
    <motion.a
      href={isConfigured ? url : '#'}
      target={isConfigured ? '_blank' : undefined}
      rel={isConfigured ? 'noopener noreferrer' : undefined}
      onClick={handleDisabledClick}
      whileHover={isConfigured ? { scale: 1.02 } : undefined}
      whileTap={isConfigured ? { scale: 0.98 } : undefined}
      aria-label={`Consultar sobre el ${brand} ${model} ${year}`}
      className={cn(
        // Base
        'relative inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-md text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-colors duration-150 text-center',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]',
        'w-full max-w-full min-w-0 py-2.5 sm:py-3 px-3 sm:px-4 min-h-[44px]',
        // Variantes cuando está configurado
        isConfigured && [
          variant === 'primary' && 'bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-xs cursor-pointer',
          variant === 'outline' && 'border border-[#25D366]/40 text-[#128C7E] bg-white hover:border-[#25D366] hover:bg-[#25D366]/5 cursor-pointer',
        ],
        // Variante deshabilitada cuando no hay número
        !isConfigured && 'bg-zinc-200 text-zinc-400 border border-zinc-300 hover:bg-zinc-200 cursor-not-allowed',
        className,
      )}
    >
      <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5" />

      <span className="truncate">{label}</span>

      {isConfigured && (
        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-70" aria-hidden="true" />
      )}
    </motion.a>
  )
}
