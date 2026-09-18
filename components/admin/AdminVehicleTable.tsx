'use client'

// components/admin/AdminVehicleTable.tsx
// Tabla interactiva de gestión de flota de vehículos.
// Permite filtrar, cambiar estado con 1 clic, editar y eliminar.
// Mobile: card list. Desktop: full table with overflow-x-auto.

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Users,
  AlertCircle,
  Plus,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { toast } from 'sonner'
import { type Vehicle, type VehicleStatus, CATEGORY_LABELS } from '@/types/vehicle'
import {
  updateVehicleStatusAction,
  deleteVehicleAction,
  reorderVehiclesAction,
} from '@/app/actions/admin-vehicles'
import { cn, formatPrice } from '@/lib/utils'

interface AdminVehicleTableProps {
  initialVehicles: Vehicle[]
}

const STATUS_BADGE_STYLES: Record<VehicleStatus, string> = {
  available:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  rented:      'bg-amber-50 text-amber-700 border-amber-200',
  maintenance: 'bg-red-50 text-red-700 border-red-200',
  sold:        'bg-zinc-100 text-zinc-500 border-zinc-200',
}

const STATUS_NAMES: Record<VehicleStatus, string> = {
  available:   'Disponible',
  rented:      'Alquilado',
  maintenance: 'Mantenimiento',
  sold:        'Retirado / Vendido',
}

export function AdminVehicleTable({ initialVehicles }: AdminVehicleTableProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filtrado local en vivo
  const isFiltered = search.trim() !== '' || statusFilter !== 'all' || categoryFilter !== 'all'

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.year.toString().includes(search)

    const matchesStatus = statusFilter === 'all' || v.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Manejo de reordenamiento de flota
  function handleMove(currentIndex: number, direction: -1 | 1) {
    if (isFiltered) return
    const targetIndex = currentIndex + direction
    if (targetIndex < 0 || targetIndex >= vehicles.length) return

    const newVehicles = [...vehicles]
    const [moved] = newVehicles.splice(currentIndex, 1)
    newVehicles.splice(targetIndex, 0, moved)

    // Actualización optimista local
    setVehicles(newVehicles)

    startTransition(async () => {
      const orderedIds = newVehicles.map((v) => v.id)
      const res = await reorderVehiclesAction(orderedIds)
      if (res.success) {
        toast.success(`"${moved.brand} ${moved.model}" movido a posición #${targetIndex + 1}`)
      } else {
        toast.error(res.error ?? 'Error al guardar el nuevo orden de la flota')
        // Revertir
        setVehicles(initialVehicles)
      }
    })
  }

  // Manejo de cambio de estado
  async function handleStatusChange(id: string, newStatus: VehicleStatus) {
    // Actualización optimista local
    setVehicles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    )

    startTransition(async () => {
      const res = await updateVehicleStatusAction(id, newStatus)
      if (res.success) {
        toast.success(`Estado actualizado a: ${STATUS_NAMES[newStatus]}`)
      } else {
        toast.error(res.error ?? 'Error al actualizar estado')
        // Revertir
        setVehicles(initialVehicles)
      }
    })
  }

  // Manejo de eliminación
  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el vehículo ${name}?`)) {
      return
    }

    setDeletingId(id)
    startTransition(async () => {
      const res = await deleteVehicleAction(id)
      setDeletingId(null)
      if (res.success) {
        setVehicles((prev) => prev.filter((v) => v.id !== id))
        toast.success(`Vehículo "${name}" eliminado correctamente`)
      } else {
        toast.error(res.error ?? 'Error al eliminar vehículo')
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* ── Barra Superior de Búsqueda y Filtros ──────────────────── */}
      <div className="bg-white p-4 rounded-lg border border-zinc-200 flex flex-col gap-3 shadow-2xs">
        {/* Search — full width */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 stroke-[1.75]" />
          <input
            type="text"
            placeholder="Buscar por marca, modelo o año..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 min-h-[44px] bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
          />
        </div>

        {/* Filters + Add button row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro Estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 min-w-[120px] px-2.5 py-2 min-h-[40px] bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-800 font-medium focus:outline-none focus:border-zinc-900 cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="available">Disponibles</option>
            <option value="rented">Alquilados</option>
            <option value="maintenance">Mantenimiento</option>
            <option value="sold">Retirados</option>
          </select>

          {/* Filtro Categoría */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 min-w-[120px] px-2.5 py-2 min-h-[40px] bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-800 font-medium focus:outline-none focus:border-zinc-900 cursor-pointer"
          >
            <option value="all">Todas las categorías</option>
            <option value="sport">Compacto</option>
            <option value="sedan">Sedán</option>
            <option value="suv">SUV</option>
            <option value="pickup_4x4">Camioneta</option>
          </select>

          <Link
            href="/admin/vehicles/new"
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-md bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-700 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar</span>
          </Link>
        </div>

        {/* Aviso informativo si hay filtros activos */}
        {isFiltered && (
          <div className="flex items-center justify-between text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-md">
            <span>Filtros activos. El reordenamiento de flota se realiza con el catálogo completo sin filtrar.</span>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
                setCategoryFilter('all')
              }}
              className="font-semibold underline ml-2 hover:text-amber-950 shrink-0 cursor-pointer"
            >
              Restablecer
            </button>
          </div>
        )}
      </div>

      {/* ── Mobile: Card List (shown < md) ────────────────────────── */}
      <div className="md:hidden space-y-3">
        {filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-lg border border-zinc-200 py-12 text-center text-zinc-400">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-zinc-300" />
            <p className="text-xs">No se encontraron vehículos que coincidan con los filtros.</p>
          </div>
        ) : (
          filteredVehicles.map((vehicle, index) => {
            const vehicleName = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`
            const isBusy = isPending && deletingId === vehicle.id

            return (
              <div
                key={vehicle.id}
                className={cn(
                  'bg-white rounded-lg border border-zinc-200 p-4 space-y-3 shadow-2xs',
                  isBusy && 'opacity-50 pointer-events-none'
                )}
              >
                {/* Top row: order + image + name + status selector */}
                <div className="flex items-center gap-2.5">
                  {/* Controles de orden */}
                  <div className="flex flex-col items-center justify-center bg-zinc-50 border border-zinc-200 rounded p-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0 || isPending || isFiltered}
                      onClick={() => handleMove(index, -1)}
                      className="p-0.5 rounded text-zinc-500 hover:text-zinc-900 disabled:opacity-20 transition-colors"
                      title={isFiltered ? 'Limpia filtros para reordenar' : 'Mover arriba'}
                      aria-label="Mover arriba"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-bold text-zinc-700 tabular-nums">
                      #{vehicle.sort_order ?? index + 1}
                    </span>
                    <button
                      type="button"
                      disabled={index === vehicles.length - 1 || isPending || isFiltered}
                      onClick={() => handleMove(index, 1)}
                      className="p-0.5 rounded text-zinc-500 hover:text-zinc-900 disabled:opacity-20 transition-colors"
                      title={isFiltered ? 'Limpia filtros para reordenar' : 'Mover abajo'}
                      aria-label="Mover abajo"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="relative w-14 h-11 rounded border border-zinc-100 bg-zinc-50 overflow-hidden shrink-0">
                    <Image
                      src={vehicle.thumbnail}
                      alt={vehicleName}
                      fill
                      sizes="56px"
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-zinc-900 leading-tight truncate">
                      {vehicle.brand} {vehicle.model}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      {vehicle.year} · {vehicle.color ?? 'Estándar'}
                    </p>
                  </div>
                  <select
                    value={vehicle.status}
                    disabled={isPending}
                    onChange={(e) =>
                      handleStatusChange(vehicle.id, e.target.value as VehicleStatus)
                    }
                    className={cn(
                      'text-[11px] font-semibold px-2 py-1 rounded-md border focus:outline-none transition-colors cursor-pointer shrink-0',
                      STATUS_BADGE_STYLES[vehicle.status]
                    )}
                  >
                    <option value="available">Disponible</option>
                    <option value="rented">Alquilado</option>
                    <option value="maintenance">Mantenimiento</option>
                    <option value="sold">Retirado</option>
                  </select>
                </div>

                {/* Middle row: category + capacity + rate */}
                <div className="flex items-center gap-3 text-[11px] text-zinc-600 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 text-zinc-700 border border-zinc-200">
                    {CATEGORY_LABELS[vehicle.category]}
                  </span>
                  <span className="flex items-center gap-1" title={`${vehicle.seats} plazas`}>
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                    {vehicle.seats} plazas
                  </span>
                  <span className="font-bold text-zinc-950 tabular-nums ml-auto">
                    {vehicle.daily_rate ? formatPrice(vehicle.daily_rate) : '—'}
                    <span className="text-[10px] font-normal text-zinc-400">/día</span>
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-zinc-100">
                  <Link
                    href={`/catalog/${vehicle.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                    title="Ver en catálogo público"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/admin/vehicles/${vehicle.id}/edit`}
                    className="p-2 rounded text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                    title="Modificar vehículo"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(vehicle.id, vehicleName)}
                    className="p-2 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Eliminar vehículo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── Desktop: Table (shown >= md) ──────────────────────────── */}
      <div className="hidden md:block bg-white rounded-lg border border-zinc-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-3 text-center w-20">Orden</th>
                <th className="py-3 px-4">Vehículo</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Capacidad</th>
                <th className="py-3 px-4">Tarifa / Día</th>
                <th className="py-3 px-4">Disponibilidad</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-zinc-300" />
                    No se encontraron vehículos que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle, index) => {
                  const vehicleName = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`
                  const isBusy = isPending && deletingId === vehicle.id

                  return (
                    <tr
                      key={vehicle.id}
                      className={cn(
                        'hover:bg-zinc-50/60 transition-colors',
                        isBusy && 'opacity-50 pointer-events-none'
                      )}
                    >
                      {/* Control de Orden */}
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-xs font-bold text-zinc-600 tabular-nums w-5 text-center">
                            #{vehicle.sort_order ?? index + 1}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              disabled={index === 0 || isPending || isFiltered}
                              onClick={() => handleMove(index, -1)}
                              className="p-1 rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                              title={isFiltered ? 'Limpia los filtros para reordenar la flota' : 'Mover arriba en el catálogo'}
                              aria-label={`Mover ${vehicle.brand} ${vehicle.model} hacia arriba`}
                            >
                              <ChevronUp className="w-3.5 h-3.5 stroke-[2]" />
                            </button>
                            <button
                              type="button"
                              disabled={index === vehicles.length - 1 || isPending || isFiltered}
                              onClick={() => handleMove(index, 1)}
                              className="p-1 rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                              title={isFiltered ? 'Limpia los filtros para reordenar la flota' : 'Mover abajo en el catálogo'}
                              aria-label={`Mover ${vehicle.brand} ${vehicle.model} hacia abajo`}
                            >
                              <ChevronDown className="w-3.5 h-3.5 stroke-[2]" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Vehículo e Imagen */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-10 rounded border border-zinc-100 bg-[#F8FAFC] overflow-hidden shrink-0">
                            <Image
                              src={vehicle.thumbnail}
                              alt={vehicleName}
                              fill
                              sizes="60px"
                              className="object-contain p-0.5"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 tracking-tight line-clamp-1">
                              {vehicle.brand} {vehicle.model}
                            </p>
                            <p className="text-[11px] text-zinc-500 line-clamp-1">
                              {vehicle.year} • {vehicle.color ?? 'Estándar'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {CATEGORY_LABELS[vehicle.category]}
                        </span>
                      </td>

                      {/* Capacidad */}
                      <td className="py-3 px-4 text-zinc-600">
                        <div className="flex items-center gap-1.5 text-[11px]" title={`${vehicle.seats} plazas`}>
                          <Users className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{vehicle.seats} plazas</span>
                        </div>
                      </td>

                      {/* Tarifa Diaria */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-zinc-950 tabular-nums">
                          {vehicle.daily_rate ? formatPrice(vehicle.daily_rate) : '—'}
                        </span>
                        <span className="text-[10px] text-zinc-400 block">/día</span>
                      </td>

                      {/* Conmutador Rápido de Estado */}
                      <td className="py-3 px-4">
                        <select
                          value={vehicle.status}
                          disabled={isPending}
                          onChange={(e) =>
                            handleStatusChange(vehicle.id, e.target.value as VehicleStatus)
                          }
                          className={cn(
                            'text-xs font-semibold px-2.5 py-1 rounded-md border focus:outline-none transition-colors cursor-pointer',
                            STATUS_BADGE_STYLES[vehicle.status]
                          )}
                        >
                          <option value="available">Disponible</option>
                          <option value="rented">Alquilado</option>
                          <option value="maintenance">Mantenimiento</option>
                          <option value="sold">Retirado</option>
                        </select>
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Ver en Catálogo */}
                          <Link
                            href={`/catalog/${vehicle.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                            title="Ver en catálogo público"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Modificar */}
                          <Link
                            href={`/admin/vehicles/${vehicle.id}/edit`}
                            className="p-1.5 rounded text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                            title="Modificar vehículo"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Eliminar */}
                          <button
                            type="button"
                            onClick={() => handleDelete(vehicle.id, vehicleName)}
                            className="p-1.5 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Eliminar vehículo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer con resumen de conteo y ayuda */}
        <div className="py-3 px-4 border-t border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <span>Mostrando <strong>{filteredVehicles.length}</strong> de <strong>{vehicles.length}</strong> vehículos</span>
          <span className="text-[11px] text-zinc-400">
            💡 Usa las flechas ↑ ↓ en la columna <strong>Orden</strong> para organizar la aparición en el catálogo web
          </span>
        </div>
      </div>

      {/* Mobile footer count */}
      <div className="md:hidden text-xs text-zinc-500 text-center">
        Mostrando <strong>{filteredVehicles.length}</strong> de <strong>{vehicles.length}</strong> vehículos
      </div>
    </div>
  )
}
