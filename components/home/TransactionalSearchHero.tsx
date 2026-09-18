'use client'

import { useState } from 'react'
import { Calendar, Layers, ArrowRight } from 'lucide-react'

interface TransactionalSearchHeroProps {
  onSearch?: (filters: { pickupDate: string; returnDate: string; category: string }) => void
  initialCategory?: string
  initialPickup?: string
  initialReturn?: string
}

export function TransactionalSearchHero({
  onSearch,
  initialCategory = 'all',
  initialPickup = '',
  initialReturn = '',
}: TransactionalSearchHeroProps) {
  const [pickupDate, setPickupDate] = useState(initialPickup)
  const [returnDate, setReturnDate] = useState(initialReturn)
  const [category, setCategory] = useState(initialCategory)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (onSearch) {
      onSearch({ pickupDate, returnDate, category })
    }

    // Desplazar suavemente a los resultados
    const resultsEl = document.getElementById('resultados-vehiculos')
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 backdrop-blur-md border border-white/60 rounded-xl p-3.5 sm:p-5 shadow-xl grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3.5 items-end"
      >
        {/* 1. Fecha de Entrega */}
        <div className="sm:col-span-4 space-y-1">
          <label className="block text-[10px] sm:text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Fecha de Entrega
          </label>
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 stroke-[1.5] pointer-events-none z-10" />
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full h-10 min-h-[40px] pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-md text-xs font-medium text-[#0A0A0A] focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-colors cursor-pointer appearance-none"
            />
          </div>
        </div>

        {/* 2. Fecha de Devolución */}
        <div className="sm:col-span-4 space-y-1">
          <label className="block text-[10px] sm:text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Fecha de Devolución
          </label>
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 stroke-[1.5] pointer-events-none z-10" />
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full h-10 min-h-[40px] pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-md text-xs font-medium text-[#0A0A0A] focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-colors cursor-pointer appearance-none"
            />
          </div>
        </div>

        {/* 3. Tipo de Vehículo */}
        <div className="sm:col-span-4 space-y-1">
          <label className="block text-[10px] sm:text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Tipo de Vehículo
          </label>
          <div className="relative flex items-center">
            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 stroke-[1.5] pointer-events-none z-10" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 min-h-[40px] pl-9 pr-8 py-1.5 bg-white border border-zinc-200 rounded-md text-xs font-medium text-[#0A0A0A] focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] transition-colors appearance-none cursor-pointer"
            >
              <option value="all">Todos los vehículos</option>
              <option value="sedan">Sedán</option>
              <option value="sport">Compacto</option>
              <option value="suv">SUV Familiar</option>
              <option value="pickup_4x4">Camioneta 4x4</option>
            </select>
          </div>
        </div>

        {/* Botón Principal Buscar */}
        <div className="sm:col-span-12 pt-0.5">
          <button
            type="submit"
            className="w-full h-10 min-h-[40px] inline-flex items-center justify-center gap-2 px-5 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#152e52] active:scale-[0.99] transition-all shadow-xs"
          >
            <span>Buscar Disponibilidad</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
        </div>
      </form>
    </div>
  )
}
