// app/catalog/page.tsx
// Página principal del catálogo — Server Component.
// Lee searchParams, ejecuta la query filtrada en el servidor y renderiza el resultado.

import { type Metadata } from 'next'
import { Suspense } from 'react'
import { VehicleGrid }        from '@/components/vehicle/VehicleGrid'
import { VehicleFilters }     from '@/components/vehicle/VehicleFilters'
import { VehicleGridSkeleton } from '@/components/vehicle/VehicleCardSkeleton'
import { getVehicles }        from '@/lib/supabase/queries'
import { VehicleFilterSchema } from '@/lib/validations'

export const metadata: Metadata = {
  title: 'Flota de Vehículos Cotidianos y Road Trips',
  description:
    'Explora nuestra flota de sedanes confiables, compactos urbanos y SUVs familiares accesibles para ruteo diario y viajes por carretera. Consulta disponibilidad por WhatsApp.',
  alternates: { canonical: '/catalog' },
}

// Revalidar cada 60 segundos (ISR) — la disponibilidad cambia con frecuencia
export const revalidate = 60

interface CatalogPageProps {
  searchParams: Promise<Record<string, string>>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const rawParams = await searchParams

  // Validar y parsear query params con Zod
  const parsed = VehicleFilterSchema.safeParse(rawParams)
  const filters = parsed.success ? parsed.data : { page: 1, limit: 12 }

  const { vehicles, total, page, pages } = await getVehicles(filters)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="mb-6 lg:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
          Alquiler de Vehículos
        </h1>
      </header>

      {/* ── Layout: sidebar + grid ──────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Sidebar de filtros (desktop) + barra top (mobile) */}
        <Suspense fallback={null}>
          <VehicleFilters totalResults={total} />
        </Suspense>

        {/* Contenido principal */}
        <div className="flex-1 min-w-0 w-full">
          {/* Grid de vehículos */}
          <Suspense fallback={<VehicleGridSkeleton count={9} />}>
            <VehicleGrid vehicles={vehicles} />
          </Suspense>

          {/* ── Paginación ───────────────────────────────────── */}
          {pages > 1 && (
            <CatalogPagination
              page={page}
              pages={pages}
              searchParams={rawParams}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Paginación ─────────────────────────────────────────────────────────────

function CatalogPagination({
  page,
  pages,
  searchParams,
}: {
  page:         number
  pages:        number
  searchParams: Record<string, string>
}) {
  function buildPageHref(p: number) {
    const params = new URLSearchParams(searchParams)
    if (p === 1) params.delete('page')
    else params.set('page', String(p))
    const qs = params.toString()
    return `/catalog${qs ? `?${qs}` : ''}`
  }

  return (
    <nav
      className="flex items-center justify-center gap-1.5 mt-14"
      aria-label="Paginación del catálogo"
    >
      {/* Anterior */}
      {page > 1 ? (
        <a
          href={buildPageHref(page - 1)}
          className="px-3 py-1.5 rounded-md text-xs font-medium border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
        >
          ← Anterior
        </a>
      ) : (
        <span className="px-3 py-1.5 rounded-md text-xs text-zinc-300 border border-zinc-100 cursor-not-allowed">
          ← Anterior
        </span>
      )}

      {/* Páginas */}
      <div className="flex items-center gap-1">
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <a
            key={p}
            href={buildPageHref(p)}
            aria-current={p === page ? 'page' : undefined}
            className={
              p === page
                ? 'w-8 h-8 flex items-center justify-center rounded-md text-xs font-semibold bg-[#0A192F] text-white'
                : 'w-8 h-8 flex items-center justify-center rounded-md text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors border border-transparent'
            }
          >
            {p}
          </a>
        ))}
      </div>

      {/* Siguiente */}
      {page < pages ? (
        <a
          href={buildPageHref(page + 1)}
          className="px-3 py-1.5 rounded-md text-xs font-medium border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
        >
          Siguiente →
        </a>
      ) : (
        <span className="px-3 py-1.5 rounded-md text-xs text-zinc-300 border border-zinc-100 cursor-not-allowed">
          Siguiente →
        </span>
      )}
    </nav>
  )
}
