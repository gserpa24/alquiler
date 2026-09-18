'use client'

// components/admin/VehicleAdminForm.tsx
// Formulario unificado para Agregar y Modificar vehículos del catálogo.

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Car,
  DollarSign,
  Settings,
  Image as ImageIcon,
  Check,
  ArrowLeft,
  Loader2,
  ChevronDown,
} from 'lucide-react'
import { toast } from 'sonner'
import { type Vehicle, type VehicleCategory, type TransmissionType, type FuelType, type VehicleStatus } from '@/types/vehicle'
import { type AdminVehicleInput } from '@/lib/validations'
import { createVehicleAction, updateVehicleAction } from '@/app/actions/admin-vehicles'
import { VehiclePhotoUploader } from '@/components/admin/VehiclePhotoUploader'

interface VehicleAdminFormProps {
  mode: 'create' | 'edit'
  initialVehicle?: Vehicle
}

// Shared input className — ensures 44px min-height touch target on all inputs/selects
const inputCls =
  'w-full px-3 py-2 min-h-[44px] bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors'

const selectCls =
  'w-full px-2.5 py-2 min-h-[44px] bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 cursor-pointer'

export function VehicleAdminForm({ mode, initialVehicle }: VehicleAdminFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showSaleOptions, setShowSaleOptions] = useState<boolean>(
    Boolean(initialVehicle?.sale_price)
  )

  // Estado del formulario
  const [formData, setFormData] = useState<AdminVehicleInput>({
    brand:        initialVehicle?.brand ?? '',
    model:        initialVehicle?.model ?? '',
    year:         initialVehicle?.year ?? new Date().getFullYear(),
    category:     initialVehicle?.category ?? 'sedan',
    transmission: initialVehicle?.transmission ?? 'automatic',
    fuel:         initialVehicle?.fuel ?? 'gasoline',
    seats:        initialVehicle?.seats ?? 5,
    daily_rate:   initialVehicle?.daily_rate ?? 120,
    sale_price:   initialVehicle?.sale_price ?? null,
    mileage:      initialVehicle?.mileage ?? 0,
    color:        initialVehicle?.color ?? 'Blanco',
    thumbnail:    initialVehicle?.thumbnail ?? '',
    images:       initialVehicle?.images ?? [],
    features:     initialVehicle?.features ?? ['Aire acondicionado', 'Bluetooth', 'Cámara de retroceso', 'Apple CarPlay'],
    description:  initialVehicle?.description ?? '',
    status:       initialVehicle?.status ?? 'available',
    is_featured:  initialVehicle?.is_featured ?? false,
    sort_order:   initialVehicle?.sort_order ?? 0,
  })

  // Helper para convertir array de features a string
  const [featuresText, setFeaturesText] = useState(
    formData.features?.join(', ') ?? ''
  )

  function handleChange(
    field: keyof AdminVehicleInput,
    value: unknown
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.thumbnail || formData.thumbnail.trim() === '') {
      toast.error('Debes cargar al menos una foto para el vehículo (la 1ra será la portada)')
      return
    }

    // Parsear features
    const parsedFeatures = featuresText
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean)

    const payload: AdminVehicleInput = {
      ...formData,
      features:   parsedFeatures,
      daily_rate: Number(formData.daily_rate),
      year:       Number(formData.year),
      seats:      Number(formData.seats),
      mileage:    formData.mileage != null ? Number(formData.mileage) : 0,
      sale_price: showSaleOptions && formData.sale_price ? Number(formData.sale_price) : null,
    }

    startTransition(async () => {
      if (mode === 'create') {
        const res = await createVehicleAction(payload)
        if (res.success) {
          toast.success(`Vehículo "${payload.brand} ${payload.model}" agregado con éxito`)
          router.push('/admin/vehicles')
          router.refresh()
        } else {
          toast.error(res.error ?? 'No se pudo crear el vehículo')
        }
      } else if (mode === 'edit' && initialVehicle) {
        const res = await updateVehicleAction(initialVehicle.id, payload)
        if (res.success) {
          toast.success(`Vehículo "${payload.brand} ${payload.model}" actualizado`)
          router.push('/admin/vehicles')
          router.refresh()
        } else {
          toast.error(res.error ?? 'No se pudo actualizar el vehículo')
        }
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* ── Encabezado — Mobile: vertical stack / Desktop: side-by-side ── */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Back + title row */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/vehicles"
            className="p-2 rounded-md border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 transition-colors shrink-0"
            title="Volver al listado"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-zinc-950 truncate">
              {mode === 'create' ? 'Agregar Nuevo Vehículo' : `Modificar ${initialVehicle?.brand} ${initialVehicle?.model}`}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Configura las especificaciones técnicas, tarifa diaria y disponibilidad.
            </p>
          </div>
        </div>

        {/* Action buttons — full-width on mobile */}
        <div className="flex items-center gap-2 sm:shrink-0">
          <Link
            href="/admin/vehicles"
            className="flex-1 sm:flex-none text-center px-3 py-2.5 min-h-[44px] rounded-md border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center justify-center"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-md bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-700 transition-colors shadow-xs disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{mode === 'create' ? 'Crear Vehículo' : 'Guardar Cambios'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Panel Integral: Datos, Alquiler y Mecánica ──────────────── */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-2xs overflow-hidden divide-y divide-zinc-100">
        
        {/* Sub-sección 1: Datos de Identificación */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-1 text-xs font-bold text-zinc-900 uppercase tracking-wider">
            <Car className="w-4 h-4 text-zinc-700" />
            <span>Datos del Vehículo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
                Marca *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Toyota, Nissan"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
                Modelo *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Yaris Sedán, Versa"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
                Año *
              </label>
              <input
                type="number"
                required
                min={2010}
                max={new Date().getFullYear() + 2}
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
                Color *
              </label>
              <input
                type="text"
                required
                placeholder="Blanco, Gris..."
                value={formData.color ?? ''}
                onChange={(e) => handleChange('color', e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value as VehicleCategory)}
                className={selectCls}
              >
                <option value="sport">Compacto</option>
                <option value="sedan">Sedán</option>
                <option value="suv">SUV</option>
                <option value="pickup_4x4">Camioneta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sub-sección 2: Tarifa y Operación de Alquiler */}
        <div className="p-5 sm:p-6 space-y-4 bg-zinc-50/50">
          <div className="flex items-center gap-2 pb-1 text-xs font-bold text-zinc-900 uppercase tracking-wider">
            <DollarSign className="w-4 h-4 text-zinc-700" />
            <span>Alquiler &amp; Disponibilidad</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
                Tarifa Diaria (S/ / día) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                  S/
                </span>
                <input
                  type="number"
                  required
                  min={1}
                  step="1"
                  placeholder="Ej. 120"
                  value={formData.daily_rate ?? ''}
                  onChange={(e) => handleChange('daily_rate', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 min-h-[44px] bg-white border border-zinc-200 rounded-md text-xs font-bold text-zinc-950 focus:outline-none focus:border-zinc-900 tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
                Estado de Disponibilidad *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as VehicleStatus)}
                className={selectCls}
              >
                <option value="available">Disponible</option>
                <option value="rented">Alquilado</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="sold">Retirado / Vendido</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sub-sección 3: Mecánica y Capacidad */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-1 text-xs font-bold text-zinc-900 uppercase tracking-wider">
            <Settings className="w-4 h-4 text-zinc-700" />
            <span>Mecánica &amp; Capacidad</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
                Transmisión
              </label>
              <select
                value={formData.transmission}
                onChange={(e) => handleChange('transmission', e.target.value as TransmissionType)}
                className={selectCls}
              >
                <option value="automatic">Automático</option>
                <option value="manual">Manual</option>
                <option value="cvt">CVT</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
                Combustible
              </label>
              <select
                value={formData.fuel}
                onChange={(e) => handleChange('fuel', e.target.value as FuelType)}
                className={selectCls}
              >
                <option value="gasoline">Gasolina</option>
                <option value="diesel">Diésel</option>
                <option value="hybrid">Híbrido</option>
                <option value="electric">Eléctrico</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
                Plazas (Pasajeros) *
              </label>
              <input
                type="number"
                required
                min={2}
                max={9}
                value={formData.seats}
                onChange={(e) => handleChange('seats', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      </div>

        {/* ── 2. Galería y Carga de Fotos ─────────────────────────── */}
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-zinc-200 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 text-xs font-bold text-zinc-900 uppercase tracking-wider">
            <ImageIcon className="w-4 h-4 text-zinc-700" />
            <span>Fotos del Vehículo (Subida y Carrete)</span>
          </div>

          <VehiclePhotoUploader
            thumbnail={formData.thumbnail}
            images={formData.images ?? []}
            onThumbnailChange={(thumb) => handleChange('thumbnail', thumb)}
            onImagesChange={(imgs) => handleChange('images', imgs)}
          />

          <div className="pt-3 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
                Equipamiento Destacado (Separar por comas)
              </label>
              <input
                type="text"
                placeholder="Aire acondicionado, Apple CarPlay, Sensor de retroceso..."
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
                Descripción Breve
              </label>
              <textarea
                rows={2}
                placeholder="Detalles sobre el vehículo para el cliente..."
                value={formData.description ?? ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white resize-none"
              />
            </div>
          </div>
        </div>

      {/* ── 3. Opciones Futuras: Venta (Opcional) ───────────────────── */}
      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setShowSaleOptions((v) => !v)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50/50 transition-colors focus:outline-none"
        >
          <div>
            <span className="text-xs font-bold text-zinc-900 block">
              Opciones de Venta (Opcional / Futura expansión)
            </span>
            <span className="text-[11px] text-zinc-400">
              Permite registrar precio de venta si a futuro se habilita adquisición de autos.
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-zinc-400 transition-transform duration-150 ${
              showSaleOptions ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showSaleOptions && (
          <div className="p-4 pt-0 border-t border-zinc-100 bg-zinc-50/30">
            <div className="max-w-xs mt-3">
              <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
                Precio de Venta (S/)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                  S/
                </span>
                <input
                  type="number"
                  min={0}
                  step="100"
                  placeholder="Ej. 65000"
                  value={formData.sale_price ?? ''}
                  onChange={(e) => handleChange('sale_price', e.target.value ? Number(e.target.value) : null)}
                  className="w-full pl-9 pr-3 py-2 min-h-[44px] bg-white border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Botones de Guardar Inferiores — full-width on mobile ──── */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-zinc-200">
        <Link
          href="/admin/vehicles"
          className="flex items-center justify-center min-h-[44px] px-4 py-2.5 rounded-md border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors w-full sm:w-auto"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-md bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-700 transition-colors shadow-xs disabled:opacity-50 w-full sm:w-auto"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{mode === 'create' ? 'Crear Vehículo' : 'Guardar Modificaciones'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
