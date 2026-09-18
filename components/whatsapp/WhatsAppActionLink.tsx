'use client'

import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface WhatsAppActionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  hasWhatsapp: boolean
  children: React.ReactNode
  activeClassName?: string
  disabledClassName?: string
}

/**
 * Enlace/botón de acción a WhatsApp que verifica si existe un número configurado.
 * Si no está configurado o es inválido:
 * - Aplica estilos visuales de estado deshabilitado (gris).
 * - Previene la navegación y dispara un toast informativo con el mensaje: "Aún no hay un número configurado."
 */
export function WhatsAppActionLink({
  href,
  hasWhatsapp,
  children,
  className,
  activeClassName = 'bg-[#25D366] text-white hover:bg-[#20bd5a] cursor-pointer',
  disabledClassName = 'bg-zinc-200 text-zinc-400 border border-zinc-300 hover:bg-zinc-200 cursor-not-allowed',
  ...props
}: WhatsAppActionLinkProps) {
  const isEnabled = Boolean(hasWhatsapp && href && href !== '#')

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isEnabled) {
      e.preventDefault()
      toast.info('Aún no hay un número configurado.')
    }
  }

  return (
    <a
      {...props}
      href={isEnabled ? href : '#'}
      target={isEnabled ? '_blank' : undefined}
      rel={isEnabled ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      className={cn(className, isEnabled ? activeClassName : disabledClassName)}
    >
      {children}
    </a>
  )
}
