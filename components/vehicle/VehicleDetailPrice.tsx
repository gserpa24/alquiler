'use client'

// components/vehicle/VehicleDetailPrice.tsx
// Bloque de precios y kilometraje para la página de detalle de vehículo.
// Se conecta a CurrencyContext para permitir el cambio dinámico de moneda (PEN / USD / EUR).

import { useCurrency } from '@/contexts/CurrencyContext'
import { convertPrice, formatCurrencyPrice } from '@/lib/currency'
import { formatMileage } from '@/lib/utils'

interface VehicleDetailPriceProps {
  dailyRate: number | null
  salePrice: number | null
  mileage: number
}

export function VehicleDetailPrice({
  dailyRate,
  salePrice,
  mileage,
}: VehicleDetailPriceProps) {
  const { currency, rates, isLoading } = useCurrency()

  return (
    <div className="p-3 sm:p-3.5 rounded-lg bg-white border border-zinc-200 space-y-2 shadow-2xs min-w-0 w-full">
      {/* Tarifa de alquiler */}
      {dailyRate != null && (
        <div className="flex items-baseline justify-between gap-2 min-w-0">
          <span className="text-zinc-500 text-xs font-medium shrink-0">
            Tarifa de alquiler
          </span>
          <div className="text-right min-w-0 shrink-0">
            {isLoading ? (
              <span
                className="h-7 w-20 rounded bg-zinc-100 animate-pulse inline-block"
                aria-label="Cargando precio"
              />
            ) : (
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">
                {formatCurrencyPrice(convertPrice(dailyRate, currency, rates), currency)}
              </span>
            )}
            <span className="text-zinc-400 text-xs ml-1 font-normal">/día</span>
          </div>
        </div>
      )}

      {/* Precio de venta */}
      {salePrice != null && (
        <div className="flex items-baseline justify-between gap-2 pt-1.5 border-t border-zinc-100 min-w-0">
          <span className="text-zinc-500 text-xs font-medium shrink-0">
            Precio de venta
          </span>
          <span className="text-lg sm:text-xl font-bold text-[#0A192F] shrink-0 tabular-nums">
            {isLoading ? (
              <span
                className="h-6 w-20 rounded bg-zinc-100 animate-pulse inline-block"
                aria-label="Cargando precio"
              />
            ) : (
              formatCurrencyPrice(convertPrice(salePrice, currency, rates), currency)
            )}
          </span>
        </div>
      )}

      {/* Kilometraje actual */}
      <div className="flex items-center justify-between text-xs text-zinc-500 pt-1.5 border-t border-zinc-100 gap-2 min-w-0">
        <span className="shrink-0">Kilometraje actual</span>
        <span className="font-semibold text-zinc-800 truncate">
          {formatMileage(mileage)}
        </span>
      </div>
    </div>
  )
}
