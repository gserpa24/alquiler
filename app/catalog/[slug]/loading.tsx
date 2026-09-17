// app/catalog/[slug]/loading.tsx
// Skeleton de carga para la página de detalle de vehículo.

export default function VehicleDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-2.5 w-10 bg-zinc-100 rounded animate-pulse" />
        <div className="h-2.5 w-2 bg-zinc-100 rounded animate-pulse" />
        <div className="h-2.5 w-16 bg-zinc-100 rounded animate-pulse" />
        <div className="h-2.5 w-2 bg-zinc-100 rounded animate-pulse" />
        <div className="h-2.5 w-32 bg-zinc-100 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-14">
        {/* Galería skeleton */}
        <div className="space-y-3">
          <div className="aspect-[16/10] rounded-lg bg-zinc-100 border border-zinc-200 animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-14 rounded-md bg-zinc-100 animate-pulse" />
            ))}
          </div>
          <div className="space-y-2 pt-4">
            <div className="h-3.5 w-full bg-zinc-100 rounded animate-pulse" />
            <div className="h-3.5 w-5/6 bg-zinc-100 rounded animate-pulse" />
            <div className="h-3.5 w-4/6 bg-zinc-100 rounded animate-pulse" />
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="h-5 w-20 bg-zinc-100 rounded animate-pulse" />
              <div className="h-5 w-16 bg-zinc-100 rounded animate-pulse" />
            </div>
            <div className="h-2.5 w-16 bg-zinc-100 rounded animate-pulse" />
            <div className="h-8 w-48 bg-zinc-100 rounded animate-pulse" />
          </div>

          <div className="p-5 rounded-lg bg-white border border-zinc-200 space-y-3">
            <div className="h-7 w-32 bg-zinc-100 rounded animate-pulse" />
            <div className="h-3.5 w-24 bg-zinc-100 rounded animate-pulse" />
          </div>

          <div className="h-11 w-full rounded-md bg-zinc-100 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
