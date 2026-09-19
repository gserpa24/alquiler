'use client'

// components/admin/AdminVehicleTable.tsx
// Tabla interactiva de gestión de flota de vehículos con Drag & Drop nativo.
// Permite ordenar manteniendo presionado y arrastrando sin números de orden visibles.
// Mobile: card list reordenable. Desktop: tabla grid reordenable con Framer Motion.

import { useState, useRef, useTransition } from 'react'
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
  GripVertical,
} from 'lucide-react'
import { Reorder, useDragControls } from 'framer-motion'
import { toast } from 'sonner'
import {
  type Vehicle,
  type VehicleStatus,
  CATEGORY_LABELS,
  STATUS_LABELS,
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
} from '@/types/vehicle'
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

// ── Fila de Escritorio (Desktop Row con Drag Handle) ───────────────────────────
interface RowProps {
  vehicle: Vehicle
  isFiltered: boolean
  isPending: boolean
  isDeleting: boolean
  onStatusChange: (id: string, status: VehicleStatus) => void
  onDelete: (id: string, name: string) => void
  onDragEnd: () => void
}

function AdminVehicleDesktopRow({
  vehicle,
  isFiltered,
  isPending,
  isDeleting,
  onStatusChange,
  onDelete,
  onDragEnd,
}: RowProps) {
  const dragControls = useDragControls()
  const vehicleName = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`

  return (
    <Reorder.Item
      value={vehicle}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={onDragEnd}
      as="div"
      whileDrag={{
        scale: 1.01,
        boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.15)',
        zIndex: 50,
        backgroundColor: '#ffffff',
      }}
      className={cn(
        'grid grid-cols-[40px_1fr_120px_100px_110px_140px_100px] items-center px-4 py-3 border-b border-zinc-100 bg-white hover:bg-zinc-50/70 transition-colors text-xs select-none',
        isDeleting && 'opacity-50 pointer-events-none'
      )}
    >
      {/* 1. Control de Arrastre */}
      <div
        onPointerDown={(e) => {
          if (!isFiltered) dragControls.start(e)
        }}
        className={cn(
          'flex items-center justify-center p-2 rounded text-zinc-300 hover:text-zinc-700 transition-colors touch-none',
          !isFiltered
            ? 'cursor-grab active:cursor-grabbing hover:bg-zinc-100'
            : 'cursor-not-allowed opacity-30'
        )}
        title={
          isFiltered
            ? 'Restablece los filtros para reordenar la flota'
            : 'Mantén presionado y arrastra para cambiar el orden'
        }
      >
        <GripVertical className="w-4 h-4 stroke-[2]" />
      </div>

      {/* 2. Vehículo (también inicia arrastre con clic sostenido) */}
      <div
        onPointerDown={(e) => {
          if (!isFiltered) dragControls.start(e)
        }}
        className={cn(
          'flex items-center gap-3 pr-2 touch-none',
          !isFiltered && 'cursor-grab active:cursor-grabbing'
        )}
      >
        <div className="relative w-14 h-10 rounded border border-zinc-100 bg-[#F8FAFC] overflow-hidden shrink-0 pointer-events-none">
          <Image
            src={vehicle.thumbnail}
            alt={vehicleName}
            fill
            sizes="60px"
            className="object-contain p-0.5"
          />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-zinc-900 tracking-tight line-clamp-1">
            {vehicle.brand} {vehicle.model}
          </p>
          <p className="text-[11px] text-zinc-500 line-clamp-1">
            {vehicle.year} • {vehicle.color ?? 'Estándar'}
          </p>
        </div>
      </div>

      {/* 3. Categoría */}
      <div>
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-zinc-100 text-zinc-700 border border-zinc-200">
          {CATEGORY_LABELS[vehicle.category]}
        </span>
      </div>

      {/* 4. Capacidad */}
      <div
        className="flex items-center gap-1.5 text-[11px] text-zinc-600"
        title={`${vehicle.seats} plazas`}
      >
        <Users className="w-3.5 h-3.5 text-zinc-400" />
        <span>{vehicle.seats} plazas</span>
      </div>

      {/* 5. Tarifa Diaria */}
      <div>
        <span className="font-bold text-zinc-950 tabular-nums">
          {vehicle.daily_rate ? formatPrice(vehicle.daily_rate) : '—'}
        </span>
        <span className="text-[10px] text-zinc-400 block">/día</span>
      </div>

      {/* 6. Conmutador Rápido de Estado */}
      <div>
        <select
          value={vehicle.status}
          disabled={isPending}
          onChange={(e) => onStatusChange(vehicle.id, e.target.value as VehicleStatus)}
          className={cn(
            'text-xs font-semibold px-2.5 py-1 rounded-md border focus:outline-none transition-colors cursor-pointer',
            STATUS_BADGE_STYLES[vehicle.status]
          )}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 7. Acciones */}
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/catalog/${vehicle.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          title="Ver en catálogo público"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <Link
          href={`/admin/vehicles/${vehicle.id}/edit`}
          className="p-1.5 rounded text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          title="Modificar vehículo"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={() => onDelete(vehicle.id, vehicleName)}
          className="p-1.5 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title="Eliminar vehículo"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </Reorder.Item>
  )
}

// ── Tarjeta Móvil (Mobile Card con Drag Handle) ────────────────────────────────
function AdminVehicleMobileCard({
  vehicle,
  isFiltered,
  isPending,
  isDeleting,
  onStatusChange,
  onDelete,
  onDragEnd,
}: RowProps) {
  const dragControls = useDragControls()
  const vehicleName = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`

  return (
    <Reorder.Item
      value={vehicle}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={onDragEnd}
      as="div"
      whileDrag={{
        scale: 1.02,
        boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.15)',
        zIndex: 50,
      }}
      className={cn(
        'bg-white rounded-lg border border-zinc-200 p-4 space-y-3 shadow-2xs select-none',
        isDeleting && 'opacity-50 pointer-events-none'
      )}
    >
      {/* Fila superior: Drag handle + foto + nombre + estado */}
      <div className="flex items-center gap-2">
        {/* Grip handle */}
        <div
          onPointerDown={(e) => {
            if (!isFiltered) dragControls.start(e)
          }}
          className={cn(
            'flex items-center justify-center p-2 -ml-1 text-zinc-300 hover:text-zinc-700 transition-colors touch-none shrink-0',
            !isFiltered
              ? 'cursor-grab active:cursor-grabbing hover:bg-zinc-100 rounded'
              : 'opacity-30'
          )}
          title={
            isFiltered
              ? 'Restablece los filtros para reordenar'
              : 'Mantén presionado y arrastra para reordenar'
          }
        >
          <GripVertical className="w-5 h-5 stroke-[2]" />
        </div>

        {/* Thumbnail + info (también permite arrastrar en móvil) */}
        <div
          onPointerDown={(e) => {
            if (!isFiltered) dragControls.start(e)
          }}
          className={cn(
            'flex items-center gap-2.5 flex-1 min-w-0 touch-none',
            !isFiltered && 'cursor-grab active:cursor-grabbing'
          )}
        >
          <div className="relative w-14 h-11 rounded border border-zinc-100 bg-zinc-50 overflow-hidden shrink-0 pointer-events-none">
            <Image
              src={vehicle.thumbnail}
              alt={vehicleName}
              fill
              sizes="56px"
              className="object-contain p-0.5"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-xs text-zinc-900 leading-tight truncate">
              {vehicle.brand} {vehicle.model}
            </p>
            <p className="text-[11px] text-zinc-500">
              {vehicle.year} · {vehicle.color ?? 'Estándar'}
            </p>
          </div>
        </div>

        {/* Dropdown Estado */}
        <select
          value={vehicle.status}
          disabled={isPending}
          onChange={(e) => onStatusChange(vehicle.id, e.target.value as VehicleStatus)}
          className={cn(
            'text-[11px] font-semibold px-2 py-1 rounded-md border focus:outline-none transition-colors cursor-pointer shrink-0',
            STATUS_BADGE_STYLES[vehicle.status]
          )}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Fila intermedia: categoría + capacidad + tarifa */}
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

      {/* Botones de acción */}
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
          onClick={() => onDelete(vehicle.id, vehicleName)}
          className="p-2 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title="Eliminar vehículo"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </Reorder.Item>
  )
}

// ── Componente Principal de Gestión de Flota ──────────────────────────────────
export function AdminVehicleTable({ initialVehicles }: AdminVehicleTableProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Referencias para sincronización sin re-renders excesivos durante el arrastre
  const vehiclesRef = useRef<Vehicle[]>(vehicles)
  const lastSavedOrderRef = useRef<string[]>(initialVehicles.map((v) => v.id))
  vehiclesRef.current = vehicles

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

  // Lista a renderizar: la flota completa si se está ordenando, o el subconjunto si hay filtro
  const displayVehicles = isFiltered ? filteredVehicles : vehicles

  // Reordenamiento local optimista
  function handleReorder(newOrder: Vehicle[]) {
    if (isFiltered) return
    setVehicles(newOrder)
    vehiclesRef.current = newOrder
  }

  // Persistir en backend al soltar el vehículo
  function handleDragEnd() {
    if (isFiltered) return
    const currentOrderIds = vehiclesRef.current.map((v) => v.id)
    const prevOrderIds = lastSavedOrderRef.current

    // Verificar si hubo un cambio real de orden
    const hasChanged =
      currentOrderIds.length !== prevOrderIds.length ||
      currentOrderIds.some((id, idx) => id !== prevOrderIds[idx])

    if (!hasChanged) return

    lastSavedOrderRef.current = currentOrderIds

    startTransition(async () => {
      const res = await reorderVehiclesAction(currentOrderIds)
      if (res.success) {
        toast.success('Orden de la flota guardado')
      } else {
        toast.error(res.error ?? 'Error al guardar el nuevo orden de la flota')
        // Revertir si hubo error
        setVehicles(initialVehicles)
        lastSavedOrderRef.current = initialVehicles.map((v) => v.id)
      }
    })
  }

  // Manejo de cambio de estado
  async function handleStatusChange(id: string, newStatus: VehicleStatus) {
    setVehicles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    )

    startTransition(async () => {
      const res = await updateVehicleStatusAction(id, newStatus)
      if (res.success) {
        toast.success(`Estado actualizado a: ${STATUS_LABELS[newStatus]}`)
      } else {
        toast.error(res.error ?? 'Error al actualizar estado')
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
        {/* Search */}
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

        {/* Filters + Add button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro Estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 min-w-[120px] px-2.5 py-2 min-h-[40px] bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-800 font-medium focus:outline-none focus:border-zinc-900 cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Filtro Categoría */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 min-w-[120px] px-2.5 py-2 min-h-[40px] bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-800 font-medium focus:outline-none focus:border-zinc-900 cursor-pointer"
          >
            <option value="all">Todas las categorías</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
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
            <span>
              Filtros activos. Para reordenar la flota, restablece los filtros para ver el catálogo completo.
            </span>
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

      {/* ── Mobile: Card List con Drag & Drop (pantallas < md) ────────── */}
      <div className="md:hidden">
        {displayVehicles.length === 0 ? (
          <div className="bg-white rounded-lg border border-zinc-200 py-12 text-center text-zinc-400">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-zinc-300" />
            <p className="text-xs">No se encontraron vehículos que coincidan con los filtros.</p>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={displayVehicles}
            onReorder={handleReorder}
            as="div"
            className="space-y-3"
          >
            {displayVehicles.map((vehicle) => (
              <AdminVehicleMobileCard
                key={vehicle.id}
                vehicle={vehicle}
                isFiltered={isFiltered}
                isPending={isPending}
                isDeleting={deletingId === vehicle.id}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onDragEnd={handleDragEnd}
              />
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* ── Desktop: Grid Reordenable (pantallas >= md) ──────────────── */}
      <div className="hidden md:block bg-white rounded-lg border border-zinc-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            {/* Header del Grid */}
            <div className="grid grid-cols-[40px_1fr_120px_100px_110px_140px_100px] items-center px-4 py-3 border-b border-zinc-200 bg-zinc-50/70 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              <div></div>
              <div>Vehículo</div>
              <div>Categoría</div>
              <div>Capacidad</div>
              <div>Tarifa / Día</div>
              <div>Disponibilidad</div>
              <div className="text-right">Acciones</div>
            </div>

            {/* Filas Reordenables */}
            {displayVehicles.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-zinc-300" />
                No se encontraron vehículos que coincidan con los filtros.
              </div>
            ) : (
              <Reorder.Group
                axis="y"
                values={displayVehicles}
                onReorder={handleReorder}
                as="div"
                className="divide-y divide-zinc-100"
              >
                {displayVehicles.map((vehicle) => (
                  <AdminVehicleDesktopRow
                    key={vehicle.id}
                    vehicle={vehicle}
                    isFiltered={isFiltered}
                    isPending={isPending}
                    isDeleting={deletingId === vehicle.id}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </Reorder.Group>
            )}
          </div>
        </div>

        {/* Footer con resumen de conteo y ayuda */}
        <div className="py-3 px-4 border-t border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <span>
            Mostrando <strong>{displayVehicles.length}</strong> de <strong>{vehicles.length}</strong> vehículos
          </span>
          <span className="text-[11px] text-zinc-400">
            💡 Mantén presionado y arrastra cualquier vehículo para definir su orden de aparición en el catálogo web
          </span>
        </div>
      </div>

      {/* Mobile footer count */}
      <div className="md:hidden space-y-1 text-center">
        <p className="text-xs text-zinc-500">
          Mostrando <strong>{displayVehicles.length}</strong> de <strong>{vehicles.length}</strong> vehículos
        </p>
        <p className="text-[11px] text-zinc-400">
          💡 Mantén presionado y arrastra para reordenar la flota
        </p>
      </div>
    </div>
  )
}
