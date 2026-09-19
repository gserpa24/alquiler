'use client'
// components/whatsapp/WhatsAppCTA.tsx
// Botón CTA de WhatsApp para la página de detalle del vehículo.
// Genera el link con datos del vehículo y abre wa.me en nueva pestaña.

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { buildVehicleWhatsAppLink } from '@/lib/whatsapp'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

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
  const { config } = useSiteConfig()
  const cleanPhone = (config.whatsappNumber || '').replace(/\D/g, '')
  const hasWhatsapp = Boolean(cleanPhone && cleanPhone.length >= 8)

  let href = '#'
  if (hasWhatsapp) {
    try {
      href = buildVehicleWhatsAppLink({
        brand,
        model,
        year,
        color,
        phone: config.whatsappNumber,
      })
    } catch {
      href = '#'
    }
  }

  const isWa = hasWhatsapp && href !== '#'

  const handleClick = (e: React.MouseEvent) => {
    if (!isWa) {
      e.preventDefault()
      toast.warning('Aún no hay un número configurado.')
    }
  }

  return (
    <motion.a
      href={isWa ? href : '#'}
      target={isWa ? '_blank' : undefined}
      rel={isWa ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      whileHover={isWa ? { scale: 1.02 } : undefined}
      whileTap={isWa ? { scale: 0.98 } : undefined}
      aria-label={`Consultar sobre el ${brand} ${model} ${year}`}
      className={cn(
        // Base
        'relative inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-md text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-colors duration-150 text-center',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]',
        'w-full max-w-full min-w-0 py-2.5 sm:py-3 px-3 sm:px-4 min-h-[44px]',
        // Variantes cuando está configurado
        isWa && [
          variant === 'primary' && 'bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-xs cursor-pointer',
          variant === 'outline' && 'border border-[#25D366]/40 text-[#128C7E] bg-white hover:border-[#25D366] hover:bg-[#25D366]/5 cursor-pointer',
        ],
        // Variante deshabilitada cuando no hay número
        !isWa && 'bg-zinc-200 text-zinc-400 border border-zinc-300 hover:bg-zinc-200 cursor-not-allowed',
        className,
      )}
    >
      {/* WhatsApp SVG icon */}
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>

      <span className="truncate">{label}</span>

      {isWa && (
        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-70" aria-hidden="true" />
      )}
    </motion.a>
  )
}
