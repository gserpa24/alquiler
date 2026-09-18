'use client'

import { type HTMLAttributes, forwardRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Users, Fuel, Settings2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { convertPrice, formatCurrencyPrice } from '@/lib/currency'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { type VehicleCard as VehicleCardType, CATEGORY_LABELS, FUEL_LABELS } from '@/types/vehicle'
import { buildVehicleWhatsAppLink } from '@/lib/whatsapp'
import { StatusBadge } from '@/components/vehicle/StatusBadge'

interface VehicleCardProps extends HTMLAttributes<HTMLDivElement> {
  vehicle: VehicleCardType
  variant?: 'default' | 'featured'
  priority?: boolean
  pickupDate?: string
  returnDate?: string
}

export const VehicleCard = forwardRef<HTMLDivElement, VehicleCardProps>(
  ({ vehicle, variant = 'default', priority = false, pickupDate, returnDate, className, ...props }, ref) => {
    // Currency context for price conversion
    const { currency, rates, isLoading: ratesLoading } = useCurrency()
    const { config } = useSiteConfig()

    // Generar enlace directo a WhatsApp para "Reservar" (incluyendo rango de fechas si se especificaron)
    const cleanPhone = (config.whatsappNumber || '').replace(/\D/g, '')
    const hasWhatsapp = Boolean(cleanPhone && cleanPhone.length >= 8)
    let waUrl = '#'
    if (hasWhatsapp) {
      try {
        const baseWaUrl = buildVehicleWhatsAppLink({
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          color: vehicle.color,
          phone: config.whatsappNumber,
        })

        if (pickupDate && returnDate) {
          const vehicleName = `${vehicle.brand} ${vehicle.model} ${vehicle.year}${vehicle.color ? ` (${vehicle.color})` : ''}`
          const customMessage = `¡Hola! Vi el *${vehicleName}* en su catálogo y me gustaría reservarlo del *${pickupDate}* al *${returnDate}*. 🚗\n\n¿Podría confirmarme disponibilidad y precio final? ¡Muchas gracias!`
          const baseUrl = baseWaUrl.split('?text=')[0]
          waUrl = `${baseUrl}?text=${encodeURIComponent(customMessage)}`
        } else {
          waUrl = baseWaUrl
        }
      } catch {
        waUrl = '#'
      }
    }

    const transmissionLabel =
      vehicle.transmission === 'automatic' || vehicle.transmission === 'cvt'
        ? 'Automático'
        : 'Manual'


    return (
      <div
        ref={ref}
        className={cn(
          'group relative flex flex-col justify-between bg-white border border-zinc-200 hover:border-zinc-400 rounded-lg overflow-hidden transition-colors duration-150',
          className
        )}
        {...props}
      >
        <div>
          {/* ── Fotografía de portada estándar uniforme 16:10 ── */}
          <Link
            href={`/catalog/${vehicle.slug}`}
            className="block relative aspect-[16/10] w-full bg-zinc-100 border-b border-zinc-100 overflow-hidden"
            aria-label={`Ver detalles de ${vehicle.brand} ${vehicle.model}`}
          >
            <Image
              src={vehicle.thumbnail}
              alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
            />

            {/* Badge de tipo de vehículo (Categoría) */}
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs sm:text-[13px] font-semibold bg-white/95 backdrop-blur-xs text-zinc-900 border border-zinc-300 shadow-xs tracking-tight">
                {CATEGORY_LABELS[vehicle.category]}
              </span>
            </div>

            {/* Indicador de Disponibilidad */}
            <div className="absolute top-3 right-3 z-10">
              <StatusBadge status={vehicle.status} />
            </div>
          </Link>

          {/* ── Contenido de la Tarjeta con Padding Generoso ── */}
          <div className="p-5 sm:p-6">
            {/* Título y Modelo */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                {vehicle.brand}
              </p>
              <h3 className="text-base font-bold text-[#0A0A0A] leading-snug">
                {vehicle.model}{' '}
                <span className="text-xs font-normal text-zinc-400">{vehicle.year}</span>
              </h3>
            </div>

            {/* Características técnicas concretas con iconos lineales mínimos */}
            <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-zinc-100 text-xs text-zinc-600 font-medium">
              {/* Transmisión */}
              <div className="flex items-center gap-1.5" title="Transmisión">
                <Settings2 className="w-3.5 h-3.5 text-zinc-400 stroke-[1.5] shrink-0" />
                <span className="truncate">{transmissionLabel}</span>
              </div>

              {/* Pasajeros */}
              <div className="flex items-center justify-center gap-1.5" title="Capacidad de pasajeros">
                <Users className="w-3.5 h-3.5 text-zinc-400 stroke-[1.5] shrink-0" />
                <span>{vehicle.seats} plazas</span>
              </div>

              {/* Combustible */}
              <div className="flex items-center justify-end gap-1.5" title="Tipo de combustible">
                <Fuel className="w-3.5 h-3.5 text-zinc-400 stroke-[1.5] shrink-0" />
                <span>{FUEL_LABELS[vehicle.fuel]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer de Tarjeta: Precio y Botón Reservar Alineado a la Derecha ── */}
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 space-y-3">
          <div>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Tarifa diaria
            </span>
            <div className="flex items-baseline">
              {ratesLoading ? (
                <span className="h-7 w-20 rounded bg-zinc-100 animate-pulse inline-block" aria-label="Cargando precio" />
              ) : (
                <span className="text-xl font-bold text-[#0A0A0A] tabular-nums">
                  {vehicle.daily_rate != null
                    ? formatCurrencyPrice(convertPrice(vehicle.daily_rate, currency, rates), currency)
                    : '--'}
                </span>
              )}
              <span className="text-xs text-zinc-400 font-normal ml-1">/día</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 w-full pt-1">
            <Link
              href={`/catalog/${vehicle.slug}`}
              className="px-3.5 py-2 min-h-[40px] flex items-center justify-center rounded-md border border-zinc-200 text-xs font-semibold text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 transition-colors bg-white shrink-0"
            >
              Info
            </Link>
            {hasWhatsapp && waUrl !== '#' ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-md bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#20bd5a] active:scale-[0.99] transition-all shadow-xs ml-auto shrink-0 whitespace-nowrap"
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Reservar</span>
              </a>
            ) : (
              <Link
                href={`/catalog/${vehicle.slug}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#112240] active:scale-[0.99] transition-all shadow-xs ml-auto shrink-0 whitespace-nowrap"
              >
                <span>Consultar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }
)
VehicleCard.displayName = 'VehicleCard'
