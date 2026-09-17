'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Navigation, Calendar, Compass, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TripType = 'city' | 'weekend' | 'roadtrip'

export interface PlannerState {
  origin: string
  destination: string
  tripType: TripType
  pickupDate: string
  returnDate: string
}

interface RoadTripPlannerProps {
  onRouteSelect?: (origin: string, destination: string, tripType: TripType) => void
  className?: string
}

const POPULAR_ORIGINS = [
  'Aeropuerto Internacional',
  'Showroom Central / Centro',
  'Terminal Terrestre',
  'Entrega a domicilio / Hotel',
]

const POPULAR_DESTINATIONS: Record<TripType, string[]> = {
  city: [
    'Circuito Urbano y Negocios (40 km/día)',
    'Ruta Comercial Norte - Sur (65 km/día)',
    'Trámites y Ruteo Diario (30 km/día)',
  ],
  weekend: [
    'Ruta Playas / Salinas (140 km)',
    'Escapada a Montañita / Olón (180 km)',
    'Ruta del Cacao / Naranjal (95 km)',
  ],
  roadtrip: [
    'Sierra Andina: Cuenca por El Cajas (195 km)',
    'Travesía Baños y Volcanes (290 km)',
    'Circuito Completo Costa & Montaña (450 km)',
  ],
}

export function RoadTripPlanner({ onRouteSelect, className }: RoadTripPlannerProps) {
  const router = useRouter()
  const [tripType, setTripType] = useState<TripType>('weekend')
  const [origin, setOrigin] = useState(POPULAR_ORIGINS[0])
  const [destination, setDestination] = useState(POPULAR_DESTINATIONS['weekend'][0])
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  function handleTripTypeChange(type: TripType) {
    setTripType(type)
    setDestination(POPULAR_DESTINATIONS[type][0])
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()

    if (onRouteSelect) {
      onRouteSelect(origin, destination, tripType)
    }

    // Scroll to interactive calculator if present, or navigate to catalog with matching tag
    const calcElement = document.getElementById('panel-de-ruteo')
    if (calcElement) {
      calcElement.scrollIntoView({ behavior: 'smooth' })
    } else {
      const categoryParam = tripType === 'city' ? 'sedan' : tripType === 'weekend' ? 'suv' : 'pickup_4x4'
      router.push(`/catalog?category=${categoryParam}`)
    }
  }

  return (
    <div
      className={cn(
        'w-full max-w-5xl mx-auto bg-white rounded-lg border border-zinc-200 shadow-sm p-4 sm:p-6',
        className
      )}
    >
      {/* ── Tabs de Tipo de Viaje ───────────────────────────────── */}
      <div className="flex items-center gap-1.5 border-b border-zinc-100 pb-4 mb-5 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mr-2 shrink-0">
          Tipo de viaje:
        </span>
        {(
          [
            { id: 'city', label: 'Ruteo Urbano Diario', desc: 'Ciudad' },
            { id: 'weekend', label: 'Escapada de Fin de Semana', desc: 'Playa / Campo' },
            { id: 'roadtrip', label: 'Larga Distancia (Road Trip)', desc: 'Ruta / Aventura' },
          ] as const
        ).map(({ id, label }) => {
          const active = tripType === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleTripTypeChange(id)}
              className={cn(
                'px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-tight transition-all duration-150 shrink-0',
                active
                  ? 'bg-[#0A192F] text-white shadow-xs'
                  : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 border border-zinc-200/60'
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* ── Formulario de búsqueda / ruteo ──────────────────────── */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
        {/* Origen */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Origen / Recogida
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 stroke-[1.5] pointer-events-none" />
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full pl-9 pr-7 py-2.5 bg-white border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-colors appearance-none cursor-pointer"
            >
              {POPULAR_ORIGINS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Destino / Ruta */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Destino / Ruta
          </label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 stroke-[1.5] pointer-events-none" />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-9 pr-7 py-2.5 bg-white border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-colors appearance-none cursor-pointer"
            >
              {POPULAR_DESTINATIONS[tripType].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fechas */}
        <div className="md:col-span-4 grid grid-cols-2 gap-2 space-y-0">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Recogida
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 stroke-[1.5] pointer-events-none" />
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full pl-8 pr-2 py-2 bg-white border border-zinc-200 rounded-md text-xs text-zinc-800 focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-colors cursor-pointer"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Devolución
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 stroke-[1.5] pointer-events-none" />
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full pl-8 pr-2 py-2 bg-white border border-zinc-200 rounded-md text-xs text-zinc-800 focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-colors cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Botón Acción Primaria */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#152e52] active:scale-[0.99] transition-all shadow-xs h-[38px]"
          >
            <span>Trazar ruta</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Micro-datos contextuales */}
      <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-500 font-medium">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Entrega sin esperas en aeropuerto y ciudad
          </span>
          <span className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#0A192F] stroke-[1.5]" />
            Kilometraje libre según plan de viaje
          </span>
        </div>
        <span className="text-zinc-400">
          Negociación directa por WhatsApp sin cargos ocultos
        </span>
      </div>
    </div>
  )
}
