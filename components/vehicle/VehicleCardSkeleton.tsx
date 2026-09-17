// components/vehicle/VehicleCardSkeleton.tsx
// Skeleton placeholder mientras cargan las tarjetas de vehículos.

import { cn } from '@/lib/utils'

interface VehicleCardSkeletonProps {
  className?: string
}

export function VehicleCardSkeleton({ className }: VehicleCardSkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-zinc-200 bg-white overflow-hidden',
        className,
      )}
      aria-hidden="true"
      role="presentation"
    >
      {/* Imagen */}
      <div className="aspect-[16/10] bg-zinc-100 animate-pulse" />

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Marca */}
        <div className="h-2.5 w-16 bg-zinc-100 rounded animate-pulse" />
        {/* Modelo */}
        <div className="h-4 w-36 bg-zinc-100 rounded animate-pulse" />
        {/* Color */}
        <div className="h-2.5 w-20 bg-zinc-100 rounded animate-pulse" />

        {/* Specs */}
        <div className="flex gap-4 pt-2 border-t border-zinc-100">
          <div className="h-2.5 w-14 bg-zinc-100 rounded animate-pulse" />
          <div className="h-2.5 w-14 bg-zinc-100 rounded animate-pulse" />
          <div className="h-2.5 w-14 bg-zinc-100 rounded animate-pulse" />
        </div>

        {/* Precio + botón */}
        <div className="flex justify-between items-end pt-1">
          <div className="space-y-1">
            <div className="h-5 w-20 bg-zinc-100 rounded animate-pulse" />
            <div className="h-2.5 w-12 bg-zinc-100 rounded animate-pulse" />
          </div>
          <div className="h-7 w-20 bg-zinc-100 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  )
}

/** Grilla de N skeletons para la pantalla de carga del catálogo */
export function VehicleGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
      {Array.from({ length: count }, (_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  )
}
