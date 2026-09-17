// app/admin/page.tsx
// Dashboard principal de administración — KPIs y estado general de la flota.

import Link from 'next/link'
import {
  Car,
  CheckCircle2,
  Clock,
  Wrench,
  PlusCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { getAllAdminVehicles } from '@/lib/supabase/queries'
import { AdminVehicleTable } from '@/components/admin/AdminVehicleTable'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const vehicles = await getAllAdminVehicles()

  const total = vehicles.length
  const available = vehicles.filter((v) => v.status === 'available').length
  const rented = vehicles.filter((v) => v.status === 'rented').length
  const maintenance = vehicles.filter((v) => v.status === 'maintenance').length

  const kpis = [
    {
      label: 'Total Flota',
      count: total,
      icon: Car,
      color: 'text-zinc-900',
      bg: 'bg-zinc-100',
      border: 'border-zinc-200',
    },
    {
      label: 'Disponibles',
      count: available,
      icon: CheckCircle2,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    {
      label: 'En Alquiler',
      count: rented,
      icon: Clock,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      label: 'En Mantenimiento',
      count: maintenance,
      icon: Wrench,
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
  ]

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Visión Operativa
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mt-0.5">
            Dashboard de Flota
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/vehicles/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#152e52] transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Agregar Vehículo</span>
          </Link>
        </div>
      </div>

      {/* ── Tarjetas de Métricas (KPIs) ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className={`p-4 sm:p-5 rounded-lg border bg-white shadow-2xs flex items-center justify-between gap-2 min-w-0 ${kpi.border}`}
            >
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-500 truncate">
                  {kpi.label}
                </p>
                <p className={`text-2xl sm:text-3xl font-bold tracking-tight mt-1.5 tabular-nums ${kpi.color}`}>
                  {kpi.count}
                </p>
              </div>
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-md flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Acceso Rápido y Tabla Reciente ────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-950">
            Inventario Activo
          </h2>
          <Link
            href="/admin/vehicles"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A192F] hover:underline"
          >
            <span>Ver tabla completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AdminVehicleTable initialVehicles={vehicles} />
      </div>
    </div>
  )
}
