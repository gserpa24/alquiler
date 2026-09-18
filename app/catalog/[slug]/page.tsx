// app/catalog/[slug]/page.tsx
// Página de detalle de vehículo — Server Component con SSG + revalidate on demand.
// Incluye: galería, specs, descripción, CTA WhatsApp y vehículos similares.

import { type Metadata } from 'next'
import { notFound }        from 'next/navigation'
import Link                from 'next/link'
import { ChevronRight }    from 'lucide-react'
import { VehicleGallery }  from '@/components/vehicle/VehicleGallery'
import { VehicleSpecs }    from '@/components/vehicle/VehicleSpecs'
import { WhatsAppCTA }     from '@/components/whatsapp/WhatsAppCTA'
import { StatusBadge }     from '@/components/vehicle/StatusBadge'
import { VehicleCard }     from '@/components/vehicle/VehicleCard'
import {
  getVehicleBySlug,
  getSimilarVehicles,
} from '@/lib/supabase/queries'
import { formatPrice, formatMileage } from '@/lib/utils'
import { CATEGORY_LABELS }            from '@/types/vehicle'

// Páginas SSG con revalidación por demanda
export const revalidate = 3600 // 1 hora

// ── Metadata dinámica ──────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug }  = await params
  const vehicle   = await getVehicleBySlug(slug)
  if (!vehicle) return { title: 'Vehículo no encontrado' }

  const name = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`
  const statusText = vehicle.status === 'available'
    ? 'Disponible ahora.'
    : 'Consulta disponibilidad por WhatsApp.'

  return {
    title: name,
    description: `${name}${vehicle.color ? ` (${vehicle.color})` : ''} — ${CATEGORY_LABELS[vehicle.category]}. ${statusText} ${vehicle.daily_rate ? `Desde ${formatPrice(vehicle.daily_rate)}/día.` : ''} Contáctanos por WhatsApp.`,
    openGraph: {
      title:  name,
      images: vehicle.images[0] ? [{ url: vehicle.images[0], width: 1200, height: 630 }] : [],
      type:   'website',
    },
    alternates: { canonical: `/catalog/${slug}` },
  }
}

// ── Página ─────────────────────────────────────────────────────────────────

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [vehicle, similar] = await Promise.all([
    getVehicleBySlug(slug),
    getVehicleBySlug(slug).then((v) =>
      v ? getSimilarVehicles(v.category, slug, 3) : [],
    ),
  ])

  if (!vehicle) notFound()

  const vehicleName = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-8">

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-xs text-zinc-400 mb-4 sm:mb-5">
        <Link href="/" className="hover:text-zinc-900 transition-colors">Inicio</Link>
        <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        <Link href="/catalog" className="hover:text-zinc-900 transition-colors">Catálogo</Link>
        <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="text-zinc-900 font-medium" aria-current="page">{vehicleName}</span>
      </nav>

      {/* ── Contenido principal ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px] gap-6 lg:gap-8 xl:gap-10 items-start">

        {/* Columna izquierda: galería + descripción */}
        <div className="space-y-6">

          {/* Header mobile */}
          <div className="lg:hidden">
            <VehicleHeader vehicle={vehicle} />
          </div>

          {/* Galería con carrete completo de fotos subidas */}
          {(() => {
            const allPhotos = Array.from(
              new Set([vehicle.thumbnail, ...(vehicle.images || [])].filter(Boolean))
            )
            return (
              <VehicleGallery
                images={allPhotos.length > 0 ? allPhotos : [vehicle.thumbnail]}
                alt={vehicleName}
              />
            )
          })()}

          {/* Descripción */}
          {vehicle.description && (
            <section aria-labelledby="desc-heading" className="pt-1">
              <h2
                id="desc-heading"
                className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2"
              >
                Descripción
              </h2>
              <p className="text-zinc-600 leading-relaxed text-sm">
                {vehicle.description}
              </p>
            </section>
          )}

          {/* Specs — desktop (aparece bajo galería) */}
          <div className="hidden lg:block pt-3 border-t border-zinc-100">
            <VehicleSpecs vehicle={vehicle} />
          </div>
        </div>

        {/* Columna derecha: info + CTA (sticky compacto adaptativo) */}
        <aside className="lg:sticky lg:top-20 space-y-3.5 sm:space-y-4">

          {/* Header desktop */}
          <div className="hidden lg:block">
            <VehicleHeader vehicle={vehicle} />
          </div>

          {/* Precios */}
          <div className="p-3.5 sm:p-4 rounded-lg bg-white border border-zinc-200 space-y-2.5 shadow-2xs">
            {vehicle.daily_rate && (
              <div className="flex items-baseline justify-between">
                <span className="text-zinc-500 text-xs font-medium">Tarifa de alquiler</span>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                    {formatPrice(vehicle.daily_rate)}
                  </span>
                  <span className="text-zinc-400 text-xs ml-1 font-normal">/día</span>
                </div>
              </div>
            )}
            {vehicle.sale_price && (
              <div className="flex items-baseline justify-between pt-2 border-t border-zinc-100">
                <span className="text-zinc-500 text-xs font-medium">Precio de venta</span>
                <span className="text-lg sm:text-xl font-bold text-[#0A192F]">
                  {formatPrice(vehicle.sale_price)}
                </span>
              </div>
            )}

            {/* Kilometraje */}
            <div className="flex items-center justify-between text-xs text-zinc-500 pt-1.5 border-t border-zinc-100">
              <span>Kilometraje actual</span>
              <span className="font-semibold text-zinc-800">{formatMileage(vehicle.mileage)}</span>
            </div>
          </div>

          {/* CTA principal */}
          <WhatsAppCTA
            brand={vehicle.brand}
            model={vehicle.model}
            year={vehicle.year}
            color={vehicle.color}
          />

          {/* Nota informativa */}
          <p className="text-[10px] sm:text-[11px] text-zinc-400 text-center leading-relaxed px-1">
            La disponibilidad y condiciones finales se confirman directamente
            por WhatsApp con nuestro equipo.
          </p>

          {/* Specs — mobile (aparece bajo el CTA) */}
          <div className="lg:hidden pt-4 border-t border-zinc-100">
            <VehicleSpecs vehicle={vehicle} />
          </div>
        </aside>
      </div>

      {/* ── Vehículos similares ────────────────────────────────── */}
      {similar.length > 0 && (
        <section className="mt-20 pt-12 border-t border-zinc-100" aria-labelledby="similar-heading">
          <div className="flex items-center justify-between mb-8">
            <h2
              id="similar-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950"
            >
              También te puede interesar
            </h2>
            <Link
              href={`/catalog?category=${vehicle.category}`}
              className="text-xs font-semibold text-[#0A192F] hover:underline transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {similar.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ── Sub-componente: Header del vehículo ────────────────────────────────────

function VehicleHeader({
  vehicle,
}: {
  vehicle: Awaited<ReturnType<typeof getVehicleBySlug>>
}) {
  if (!vehicle) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={vehicle.status} />
        <span className="inline-flex items-center text-xs sm:text-[13px] text-zinc-800 bg-zinc-100 px-3 py-1 rounded-md border border-zinc-300 font-semibold tracking-tight shadow-2xs">
          {CATEGORY_LABELS[vehicle.category]}
        </span>
      </div>
      <p className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
        {vehicle.brand}
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 leading-tight">
        {vehicle.model}{' '}
        <span className="text-zinc-400 font-normal text-2xl">{vehicle.year}</span>
      </h1>
      {vehicle.color && (
        <p className="text-xs text-zinc-500 font-medium">{vehicle.color}</p>
      )}
    </div>
  )
}
