'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Car, ArrowRight, Clock } from 'lucide-react'
import { MOCK_VEHICLES } from '@/lib/mock-data'
import { buildVehicleWhatsAppLink } from '@/lib/whatsapp'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { toast } from 'sonner'

export function HeroBookingBar() {
  const router = useRouter()
  const { config } = useSiteConfig()
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState('')

  const availableVehicles = MOCK_VEHICLES.filter((v) => v.status !== 'sold')

  const handleSearchOrQuote = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedVehicle) {
      const v = availableVehicles.find((item) => item.slug === selectedVehicle)
      if (v) {
        // Generar mensaje enriquecido con fechas hacia WhatsApp
        const dateNote = pickupDate && returnDate 
          ? ` del ${pickupDate} al ${returnDate}` 
          : ''
        
        const cleanPhone = (config.whatsappNumber || '').replace(/\D/g, '')
        if (!cleanPhone || cleanPhone.length < 8) {
          toast.warning('Aún no hay un número configurado.')
          return
        }

        try {
          const waUrl = buildVehicleWhatsAppLink({
            brand: v.brand,
            model: v.model,
            year: v.year,
            color: v.color,
            phone: config.whatsappNumber,
          })
          
          if (dateNote) {
            const customMsg = `¡Hola! Vi el *${v.brand} ${v.model} ${v.year}* en su catálogo y me gustaría cotizarlo${dateNote}. 🚗\n\n¿Podría indicarme disponibilidad y condiciones? ¡Muchas gracias!`
            const base = waUrl.split('?text=')[0]
            window.open(`${base}?text=${encodeURIComponent(customMsg)}`, '_blank')
            return
          }
          window.open(waUrl, '_blank')
          return
        } catch {
          router.push(`/catalog/${v.slug}`)
          return
        }
      }
    }

    // Si no seleccionó auto específico, redirige a catálogo
    const params = new URLSearchParams()
    if (pickupDate) params.set('from', pickupDate)
    if (returnDate) params.set('to', returnDate)
    router.push(`/catalog${params.toString() ? `?${params.toString()}` : ''}`)
  }

  // Fecha mínima hoy
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 relative z-20">
      <div className="bg-white p-5 sm:p-6 rounded-lg border border-zinc-200 shadow-xs">
        <div className="text-left mb-4 flex items-center justify-between flex-wrap gap-2 border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0A192F]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Cotización y Disponibilidad Directa
            </h3>
          </div>
          <span className="text-xs text-zinc-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#0A192F] stroke-[1.5]" /> Entrega inmediata
          </span>
        </div>

        <form onSubmit={handleSearchOrQuote} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Fecha de Entrega */}
          <div className="space-y-1.5 text-left">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0A192F] stroke-[1.5]" />
              Fecha de Entrega
            </label>
            <input
              type="date"
              min={today}
              value={pickupDate}
              onChange={(e) => {
                setPickupDate(e.target.value)
                if (returnDate && e.target.value > returnDate) setReturnDate('')
              }}
              className="w-full px-3 py-2.5 rounded-md bg-zinc-50 border border-zinc-200 focus:border-[#0A192F] text-zinc-900 text-xs outline-none transition-colors"
            />
          </div>

          {/* Fecha de Devolución */}
          <div className="space-y-1.5 text-left">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0A192F] stroke-[1.5]" />
              Fecha de Devolución
            </label>
            <input
              type="date"
              min={pickupDate || today}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md bg-zinc-50 border border-zinc-200 focus:border-[#0A192F] text-zinc-900 text-xs outline-none transition-colors"
            />
          </div>

          {/* Selector de Vehículo */}
          <div className="space-y-1.5 text-left">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-[#0A192F] stroke-[1.5]" />
              Vehículo
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md bg-zinc-50 border border-zinc-200 focus:border-[#0A192F] text-zinc-900 text-xs outline-none transition-colors cursor-pointer"
            >
              <option value="">Todos los modelos</option>
              {availableVehicles.map((v) => (
                <option key={v.slug} value={v.slug}>
                  {v.brand} {v.model} ({v.year}) — ${v.daily_rate}/día
                </option>
              ))}
            </select>
          </div>

          {/* Botón CTA Cotizar */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#112240] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Cotizar Ahora</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
