// app/catalog/loading.tsx
// Skeleton de carga para la página del catálogo.
// Next.js muestra este archivo automáticamente durante el streaming.

import { VehicleGridSkeleton } from '@/components/vehicle/VehicleCardSkeleton'

export default function CatalogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Header skeleton */}
      <div className="mb-10 space-y-2">
        <div className="h-2.5 w-24 bg-zinc-100 rounded animate-pulse" />
        <div className="h-8 w-64 bg-zinc-100 rounded animate-pulse" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-zinc-100 rounded animate-pulse" />
                <div className="flex gap-1.5 flex-wrap">
                  {Array.from({ length: 3 }, (_, j) => (
                    <div key={j} className="h-6 w-14 bg-zinc-100 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Grid skeleton */}
        <div className="flex-1">
          <VehicleGridSkeleton count={9} />
        </div>
      </div>
    </div>
  )
}
