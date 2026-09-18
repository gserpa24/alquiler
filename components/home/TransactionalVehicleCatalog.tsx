'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { type VehicleCard as VehicleCardType } from '@/types/vehicle'
import { VehicleCard } from '@/components/vehicle/VehicleCard'
import { TransactionalSearchHero } from '@/components/home/TransactionalSearchHero'
import { FAQSection } from '@/components/faq/FAQSection'
import { cn } from '@/lib/utils'

interface TransactionalVehicleCatalogProps {
  vehicles: VehicleCardType[]
}

const CATEGORY_TABS = [
  { id: 'all', label: 'Todos' },
  { id: 'sport', label: 'Compactos' },
  { id: 'sedan', label: 'Sedanes' },
  { id: 'suv', label: 'SUVs' },
  { id: 'pickup_4x4', label: 'Camionetas' },
]

export function TransactionalVehicleCatalog({ vehicles }: TransactionalVehicleCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [pickupDate, setPickupDate] = useState<string>('')
  const [returnDate, setReturnDate] = useState<string>('')
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false)

  function handleSearch({
    category,
    pickupDate: pDate,
    returnDate: rDate,
  }: {
    category: string
    pickupDate: string
    returnDate: string
  }) {
    setSelectedCategory(category)
    setPickupDate(pDate)
    setReturnDate(rDate)
    // Al buscar disponibilidad, filtrar automáticamente para mostrar solo los vehículos disponibles
    setOnlyAvailable(true)
  }

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (selectedCategory !== 'all' && v.category !== selectedCategory) {
        return false
      }
      if (onlyAvailable && v.status !== 'available') {
        return false
      }
      return true
    })
  }, [vehicles, selectedCategory, onlyAvailable])

  return (
    <div className="w-full">
      {/* ── Hero Principal con Imagen de Carretera en la Selva Peruana (Sin autos, paisaje amazónico) ── */}
      <section className="relative flex items-center justify-center py-8 sm:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-zinc-200">
        {/* Fotografía de carretera en la selva peruana serpenteando entre montañas verdes y frondosa vegetación tropical */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-selva-peru.jpg"
            alt="Carretera asfaltada sin autos serpenteando en medio de la selva peruana y montañas verdes"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_55%]"
          />
          {/* Overlay suave cristalino sin desenfoques para máxima nitidez del paisaje */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        </div>

        {/* Bloque central del formulario de búsqueda */}
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <TransactionalSearchHero
            onSearch={handleSearch}
            initialCategory={selectedCategory}
            initialPickup={pickupDate}
            initialReturn={returnDate}
          />
        </div>
      </section>

      {/* ── Catálogo de Resultados (Transaccional) ─────────────── */}
      <section
        id="resultados-vehiculos"
        className="py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] min-h-[600px]"
      >
        <div className="max-w-7xl mx-auto">
          {/* Barra de Filtros Rápida y Contador de Resultados */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5 mb-8">
            {/* Tabs de Tipo */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {CATEGORY_TABS.map(({ id, label }) => {
                const active = selectedCategory === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedCategory(id)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-semibold tracking-tight transition-colors duration-150 shrink-0',
                      active
                        ? 'bg-[#0A192F] text-white shadow-xs'
                        : 'bg-white text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-300'
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {/* Switch de disponibilidad y conteo */}
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-600 font-medium select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded border-zinc-300 text-[#0A192F] focus:ring-[#0A192F] w-3.5 h-3.5"
                />
                Solo disponibles ahora
              </label>

              <span className="text-zinc-400">|</span>

              <p className="text-zinc-500 font-medium">
                <span className="font-bold text-[#0A0A0A]">{filteredVehicles.length}</span>{' '}
                {filteredVehicles.length === 1 ? 'auto encontrado' : 'autos encontrados'}
              </p>
            </div>
          </div>

          {/* Grid de Vehículos */}
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  pickupDate={pickupDate}
                  returnDate={returnDate}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-lg border border-zinc-200 p-8 max-w-md mx-auto">
              <p className="text-sm font-semibold text-zinc-900 mb-1">
                No hay vehículos en esta categoría
              </p>
              <p className="text-xs text-zinc-500 mb-5">
                Prueba seleccionando &quot;Todos&quot; o desmarcando el filtro de disponibilidad.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all')
                  setOnlyAvailable(false)
                }}
                className="px-4 py-2 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#152e52] transition-colors"
              >
                Ver todos los vehículos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Sección de Preguntas Frecuentes Integrada ───────────── */}
      <section id="faq-heading" className="pt-10 sm:pt-14 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 bg-white border-t border-zinc-200">
        <div className="max-w-4xl mx-auto">
          <FAQSection
            showCategoryFilters={true}
            title="Preguntas Frecuentes sobre el Servicio"
            subtitle="Respuestas claras a las dudas más comunes sobre requisitos, garantías, formas de pago y ruteo en Tarapoto y Perú."
          />
        </div>
      </section>
    </div>
  )
}
