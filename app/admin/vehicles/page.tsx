// app/admin/vehicles/page.tsx
// Página de gestión de flota de vehículos para administradores.

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllAdminVehicles } from '@/lib/supabase/queries'
import { AdminVehicleTable } from '@/components/admin/AdminVehicleTable'

export const dynamic = 'force-dynamic'

export default async function AdminVehiclesPage() {
  const vehicles = await getAllAdminVehicles()

  return (
    <div className="space-y-6">
      {/* ── Encabezado ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Flota de Vehículos
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Administra el catálogo completo, modifica precios diarios y conmuta disponibilidad.
          </p>
        </div>

        <Link
          href="/admin/vehicles/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#152e52] transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Agregar Vehículo</span>
        </Link>
      </div>

      {/* ── Tabla de Gestión ──────────────────────────────────────── */}
      <AdminVehicleTable initialVehicles={vehicles} />
    </div>
  )
}
