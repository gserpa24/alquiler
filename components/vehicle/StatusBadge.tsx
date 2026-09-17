import { type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { type VehicleStatus, STATUS_LABELS } from '@/types/vehicle'

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs sm:text-[13px] font-semibold border tracking-tight shadow-xs',
  {
    variants: {
      status: {
        available:   'bg-emerald-50/95 text-emerald-900 border-emerald-300 font-bold',
        rented:      'bg-amber-50/95 text-amber-900 border-amber-300 font-bold',
        maintenance: 'bg-zinc-100/95 text-zinc-800 border-zinc-300 font-semibold',
        sold:        'bg-zinc-50 text-zinc-500 border-zinc-200',
      },
    },
    defaultVariants: { status: 'available' },
  }
)

const DOT_CLASSES: Record<VehicleStatus, string> = {
  available:   'bg-emerald-600',
  rented:      'bg-amber-600',
  maintenance: 'bg-zinc-600',
  sold:        'bg-zinc-400',
}

interface StatusBadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof statusBadgeVariants> {
  status: VehicleStatus
  /** Ocultar el dot indicador */
  noDot?: boolean
}

/**
 * Badge de disponibilidad del vehículo.
 * Estado administrado manualmente por el equipo (no calculado por fechas).
 *
 * - available:   verde  — libre para alquiler o compra
 * - rented:      ámbar  — actualmente con un cliente
 * - maintenance: rojo   — en taller
 * - sold:        gris   — vendido (raramente visible en catálogo público)
 */
export function StatusBadge({ status, noDot = false, className, ...props }: StatusBadgeProps) {
  return (
    <span
      role="status"
      aria-label={`Estado del vehículo: ${STATUS_LABELS[status]}`}
      className={cn(statusBadgeVariants({ status }), className)}
      {...props}
    >
      {!noDot && (
        <span
          className={cn('w-2 h-2 rounded-full shrink-0', DOT_CLASSES[status])}
          aria-hidden="true"
        />
      )}
      {STATUS_LABELS[status]}
    </span>
  )
}

export { statusBadgeVariants }
export type { StatusBadgeProps }
