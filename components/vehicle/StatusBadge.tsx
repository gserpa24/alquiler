import { type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { type VehicleStatus, STATUS_LABELS } from '@/types/vehicle'

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border tracking-tight',
  {
    variants: {
      status: {
        available:   'bg-emerald-50 text-emerald-800 border-emerald-200',
        rented:      'bg-amber-50 text-amber-800 border-amber-200',
        maintenance: 'bg-zinc-100 text-zinc-700 border-zinc-200',
        sold:        'bg-zinc-50 text-zinc-400 border-zinc-200',
      },
    },
    defaultVariants: { status: 'available' },
  }
)

const DOT_CLASSES: Record<VehicleStatus, string> = {
  available:   'bg-emerald-500',
  rented:      'bg-amber-500',
  maintenance: 'bg-zinc-500',
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
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', DOT_CLASSES[status])}
          aria-hidden="true"
        />
      )}
      {STATUS_LABELS[status]}
    </span>
  )
}

export { statusBadgeVariants }
export type { StatusBadgeProps }
