'use client'
// components/vehicle/VehicleFilters.tsx
// Panel de filtros del catálogo. Sincroniza con URL sin page reload.
// Diseño: sidebar en desktop, drawer en mobile.

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { convertPrice, formatCurrencyPrice } from '@/lib/currency'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useVehicleFilters } from '@/hooks/useVehicleFilters'

// ── Opciones de filtros ────────────────────────────────────────────────────

const CATEGORIES = [
  { value: 'sport',      label: 'Compacto' },
  { value: 'sedan',      label: 'Sedán' },
  { value: 'suv',        label: 'SUV' },
  { value: 'pickup_4x4', label: 'Camioneta' },
] as const

const FUELS = [
  { value: 'gasoline', label: 'Gasolina' },
  { value: 'diesel',   label: 'Diésel' },
  { value: 'hybrid',   label: 'Híbrido' },
  { value: 'electric', label: 'Eléctrico' },
] as const

const TRANSMISSIONS = [
  { value: 'automatic', label: 'Automático' },
  { value: 'manual',    label: 'Manual' },
  { value: 'cvt',       label: 'CVT' },
] as const

const STATUSES = [
  { value: 'available',   label: 'Disponible' },
  { value: 'rented',      label: 'Alquilado' },
  { value: 'maintenance', label: 'Mantenimiento' },
] as const

/**
 * Los valores límite de filtro se gestionan en PEN (Soles, moneda base de la BD).
 * Las etiquetas mostradas se generan dinámicamente con formatCurrencyPrice y convertPrice.
 */
const PRICE_RANGES_PEN = [
  { min: undefined as number | undefined, max: 120 as number | undefined },
  { min: 120,                             max: 180 as number | undefined },
  { min: 180,                             max: 250 as number | undefined },
  { min: 250 as number | undefined,       max: undefined as number | undefined },
] as const

// ── Sub-componentes ────────────────────────────────────────────────────────

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border-b border-zinc-100 pb-4 mb-4 last:border-none last:mb-0 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-xs font-semibold text-zinc-900 mb-3 focus-visible:outline-none group"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-zinc-400 transition-transform duration-200',
            !open && '-rotate-90',
          )}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-2.5 py-1 rounded text-xs font-medium transition-colors duration-150 border',
        active
          ? 'bg-[#0A192F] border-[#0A192F] text-white'
          : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900',
      )}
    >
      {label}
    </button>
  )
}

// ── Componente principal ───────────────────────────────────────────────────

interface VehicleFiltersProps {
  /** Cantidad total de resultados (para mostrar en el header) */
  totalResults?: number
  className?: string
}

export function VehicleFilters({ totalResults, className }: VehicleFiltersProps) {
  const { filters, activeCount, setFilter, clearFilters } = useVehicleFilters()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Build display labels from live rates — filter values remain in PEN (Soles)
  const { currency, rates } = useCurrency()
  const priceRanges = PRICE_RANGES_PEN.map(({ min, max }) => {
    const fmt = (pen: number) =>
      formatCurrencyPrice(convertPrice(pen, currency, rates), currency)
    let label: string
    if (min === undefined && max !== undefined) {
      label = `Hasta ${fmt(max)}/día`
    } else if (min !== undefined && max === undefined) {
      label = `Más de ${fmt(min)}/día`
    } else if (min !== undefined && max !== undefined) {
      label = `${fmt(min)} – ${fmt(max)}/día`
    } else {
      label = 'Cualquier precio'
    }
    return { label, min, max }
  })

  const filterPanel = (
    <div className="space-y-0">
      {/* Categoría */}
      <FilterSection title="Categoría">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ value, label }) => (
            <FilterPill
              key={value}
              label={label}
              active={filters.category === value}
              onClick={() =>
                setFilter('category', filters.category === value ? undefined : value)
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Disponibilidad */}
      <FilterSection title="Disponibilidad">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(({ value, label }) => (
            <FilterPill
              key={value}
              label={label}
              active={filters.status === value}
              onClick={() =>
                setFilter('status', filters.status === value ? undefined : value)
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Combustible */}
      <FilterSection title="Combustible">
        <div className="flex flex-wrap gap-2">
          {FUELS.map(({ value, label }) => (
            <FilterPill
              key={value}
              label={label}
              active={filters.fuel === value}
              onClick={() =>
                setFilter('fuel', filters.fuel === value ? undefined : value)
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Transmisión */}
      <FilterSection title="Transmisión">
        <div className="flex flex-wrap gap-2">
          {TRANSMISSIONS.map(({ value, label }) => (
            <FilterPill
              key={value}
              label={label}
              active={filters.transmission === value}
              onClick={() =>
                setFilter('transmission', filters.transmission === value ? undefined : value)
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Rango de precio */}
      <FilterSection title="Precio por día">
        <div className="flex flex-wrap gap-2">
          {priceRanges.map(({ label, min, max }) => {
            const active = filters.priceMin === min && filters.priceMax === max
            return (
              <FilterPill
                key={label}
                label={label}
                active={active}
                onClick={() => {
                  if (active) {
                    setFilter('priceMin', undefined)
                    setFilter('priceMax', undefined)
                  } else {
                    setFilter('priceMin', min)
                    setFilter('priceMax', max)
                  }
                }}
              />
            )
          })}
        </div>
      </FilterSection>
    </div>
  )

  return (
    <div className={cn('w-full lg:w-64 lg:shrink-0 space-y-4 lg:space-y-0', className)}>
      {/* ── Barra superior (solo mobile) ─────────── */}
      <div className="lg:hidden flex items-center justify-between gap-3">
        {/* Botón filtros mobile */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-white border border-zinc-200 text-xs font-semibold text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
          aria-expanded={mobileOpen}
          aria-controls="mobile-filter-panel"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#0A192F]" aria-hidden="true" />
          Filtros
          {activeCount > 0 && (
            <span className="flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#0A192F] text-white">
              {activeCount}
            </span>
          )}
        </button>

        {/* Clear filters */}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            Limpiar
          </button>
        )}
      </div>

      {/* ── Sidebar desktop (sticky) ───────────────────────────── */}
      <aside
        className="hidden lg:block w-full"
        aria-label="Filtros del catálogo"
      >
        <div className="sticky top-24 bg-white rounded-lg border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-5 border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0A192F] stroke-[1.5]" aria-hidden="true" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Filtros</h2>
              {activeCount > 0 && (
                <span className="flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#0A192F] text-white">
                  {activeCount}
                </span>
              )}
            </div>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>
          {filterPanel}
        </div>
      </aside>

      {/* ── Drawer mobile ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              aria-hidden="true"
            />
            {/* Panel */}
            <motion.div
              id="mobile-filter-panel"
              role="dialog"
              aria-label="Filtros del catálogo"
              aria-modal="true"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-full bg-white border-l border-zinc-200 z-50 overflow-y-auto lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#0A192F]" aria-hidden="true" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Filtros</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                  aria-label="Cerrar filtros"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="p-5 flex-1">
                {filterPanel}
              </div>
              <div className="p-5 border-t border-zinc-100 bg-zinc-50">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#152e52] transition-colors"
                >
                  Ver {totalResults !== undefined ? `${totalResults} resultados` : 'resultados'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
