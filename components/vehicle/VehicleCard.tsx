'use client'

import { type HTMLAttributes, forwardRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Users, Fuel, Settings2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { convertPrice, formatCurrencyPrice } from '@/lib/currency'
import { useCurrency } from '@/contexts/CurrencyContext'
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

    // Generar enlace directo a WhatsApp para "Reservar" (incluyendo rango de fechas si se especificaron)
    let waUrl = '#'
    try {
      const baseWaUrl = buildVehicleWhatsAppLink({
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
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
      waUrl = `https://wa.me/?text=Hola%2C%20deseo%20reservar%20el%20${encodeURIComponent(vehicle.brand + ' ' + vehicle.model)}`
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

        {/* ── Footer de Tarjeta: Precio y Botón Reservar ── */}
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 flex flex-wrap items-center justify-between gap-2">
          <div className="shrink-0">
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

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/catalog/${vehicle.slug}`}
              className="px-3 py-2 min-h-[40px] flex items-center rounded-md border border-zinc-200 text-xs font-semibold text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 transition-colors bg-white"
            >
              Info
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 xs:px-4 py-2 min-h-[40px] rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#152e52] active:scale-[0.99] transition-all shadow-xs whitespace-nowrap"
            >
              <span>Reservar</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.5] shrink-0" />
            </a>
          </div>
        </div>
      </div>
    )
  }
)
VehicleCard.displayName = 'VehicleCard'
