// app/admin/page.tsx
// Dashboard principal de administración — 100% Analítico e Informativo (Módulo: dashboard).
// No incluye CRUD de flota (el CRUD se encuentra centralizado en /admin/vehicles).

import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  Car,
  CheckCircle2,
  Clock,
  Wrench,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  Mail,
  Gauge,
  Sparkles,
} from 'lucide-react'
import { getAllAdminVehicles } from '@/lib/supabase/queries'
import { getContactMessagesWithStatus } from '@/lib/supabase/messages'
import { getAdminSession } from '@/lib/auth/guard'
import { MODULE_COOKIE_NAME, parseModuleFlags } from '@/lib/admin-modules'
import { DisabledModuleCard } from '@/components/admin/DisabledModuleCard'
import { formatPrice } from '@/lib/utils'
import { SUBJECT_LABELS, MESSAGE_STATUS_LABELS } from '@/types/message'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const session = await getAdminSession()
  if (!session.authenticated) {
    redirect('/admin/login')
  }

  const cookieStore = await cookies()
  const flags = parseModuleFlags(cookieStore.get(MODULE_COOKIE_NAME)?.value)

  // Si el módulo Dashboard está desactivado por feature flag:
  if (!flags.dashboard) {
    return <DisabledModuleCard moduleId="dashboard" />
  }

  const [vehicles, { messages }] = await Promise.all([
    getAllAdminVehicles(),
    getContactMessagesWithStatus(),
  ])

  // ── Métricas de Flota ──────────────────────────────────────────
  const totalVehicles = vehicles.length
  const availableVehicles = vehicles.filter((v) => v.status === 'available').length
  const rentedVehicles = vehicles.filter((v) => v.status === 'rented').length
  const maintenanceVehicles = vehicles.filter((v) => v.status === 'maintenance').length

  const availablePct = totalVehicles > 0 ? Math.round((availableVehicles / totalVehicles) * 100) : 0
  const rentedPct = totalVehicles > 0 ? Math.round((rentedVehicles / totalVehicles) * 100) : 0
  const maintenancePct = totalVehicles > 0 ? Math.round((maintenanceVehicles / totalVehicles) * 100) : 0

  // Tarifas
  const vehiclesWithRate = vehicles.filter((v) => v.daily_rate != null && v.daily_rate > 0)
  const averageRate =
    vehiclesWithRate.length > 0
      ? Math.round(vehiclesWithRate.reduce((acc, v) => acc + (v.daily_rate ?? 0), 0) / vehiclesWithRate.length)
      : 0

  // Categorías
  const suvCount = vehicles.filter((v) => v.category === 'suv').length
  const sedanCount = vehicles.filter((v) => v.category === 'sedan').length
  const pickupCount = vehicles.filter((v) => v.category === 'pickup_4x4').length
  const sportCount = vehicles.filter((v) => v.category === 'sport').length

  // Transmisión
  const autoCount = vehicles.filter((v) => v.transmission === 'automatic' || v.transmission === 'cvt').length
  const manualCount = vehicles.filter((v) => v.transmission === 'manual').length

  // ── Métricas de Mensajes y Consultas ──────────────────────────
  const totalMessages = messages.length
  const pendingMessages = messages.filter((m) => m.status === 'pending').length
  const repliedMessages = messages.filter((m) => m.status === 'replied').length
  const resolvedMessages = repliedMessages + messages.filter((m) => m.status === 'archived').length
  const attentionRate = totalMessages > 0 ? Math.round((resolvedMessages / totalMessages) * 100) : 100

  const rentalInquiries = messages.filter((m) => m.subject === 'rental').length
  const purchaseInquiries = messages.filter((m) => m.subject === 'purchase').length
  const otherInquiries = totalMessages - (rentalInquiries + purchaseInquiries)

  const recentMessages = messages.slice(0, 4)

  return (
    <div className="space-y-8">
      {/* ── Encabezado ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Centro de Control Analítico
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mt-0.5">
            Dashboard Operativo
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Métricas de rendimiento, disponibilidad de flota y demanda de clientes en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {flags.messages && (
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-zinc-200 bg-white text-zinc-700 text-xs font-semibold hover:bg-zinc-50 hover:text-zinc-950 transition-colors shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
              <span>Bandeja de Mensajes</span>
              {pendingMessages > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                  {pendingMessages}
                </span>
              )}
            </Link>
          )}

          {flags.vehicles && (
            <Link
              href="/admin/vehicles"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#152e52] transition-colors shadow-xs"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Gestión de Flota</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Métricas Clave (KPIs Principales) ─────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Flota */}
        <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Total Flota
            </span>
            <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center text-[#0A192F]">
              <Car className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 tabular-nums">
            {totalVehicles}
          </p>
          <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">{availablePct}%</span> lista para reserva
          </p>
        </div>

        {/* En Alquiler */}
        <div className="p-4 sm:p-5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-amber-800">
              En Alquiler
            </span>
            <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center text-amber-800">
              <Clock className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-900 tabular-nums">
            {rentedVehicles}
          </p>
          <p className="text-xs text-amber-700/80 mt-1">
            Tasa de ocupación: <strong className="font-semibold text-amber-900">{rentedPct}%</strong>
          </p>
        </div>

        {/* Consultas y Leads */}
        <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Consultas Totales
            </span>
            <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-700">
              <MessageSquare className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 tabular-nums">
            {totalMessages}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            {pendingMessages > 0 ? (
              <span className="text-amber-600 font-semibold">{pendingMessages} pendientes</span>
            ) : (
              <span className="text-emerald-600 font-medium">Todas atendidas</span>
            )}
          </p>
        </div>

        {/* Tarifa Promedio */}
        <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Tarifa Diaria Promedio
            </span>
            <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 tabular-nums">
            {formatPrice(averageRate)}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Promedio diario por auto
          </p>
        </div>
      </div>

      {/* ── Bloque Analítico Principal (2 Columnas) ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Análisis de Flota */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Distribución de Disponibilidad */}
          <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Gauge className="w-4 h-4 text-[#0A192F]" />
                <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">
                  Estado Operativo de Flota
                </h2>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                {totalVehicles} unidades registradas
              </span>
            </div>

            {/* Barra segmentada visual */}
            <div className="w-full h-3 rounded-full bg-zinc-100 overflow-hidden flex mb-4">
              {availablePct > 0 && (
                <div
                  style={{ width: `${availablePct}%` }}
                  className="bg-emerald-500 h-full transition-all duration-300"
                  title={`Disponibles: ${availableVehicles} (${availablePct}%)`}
                />
              )}
              {rentedPct > 0 && (
                <div
                  style={{ width: `${rentedPct}%` }}
                  className="bg-amber-500 h-full transition-all duration-300"
                  title={`En Alquiler: ${rentedVehicles} (${rentedPct}%)`}
                />
              )}
              {maintenancePct > 0 && (
                <div
                  style={{ width: `${maintenancePct}%` }}
                  className="bg-red-500 h-full transition-all duration-300"
                  title={`En Mantenimiento: ${maintenanceVehicles} (${maintenancePct}%)`}
                />
              )}
            </div>

            {/* Leyenda de Estados */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 flex flex-col">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                  Disponibles
                </span>
                <span className="text-lg font-bold text-emerald-950 mt-0.5">
                  {availableVehicles}{' '}
                  <span className="text-xs font-normal text-emerald-700">({availablePct}%)</span>
                </span>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100 flex flex-col">
                <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">
                  En Alquiler
                </span>
                <span className="text-lg font-bold text-amber-950 mt-0.5">
                  {rentedVehicles}{' '}
                  <span className="text-xs font-normal text-amber-700">({rentedPct}%)</span>
                </span>
              </div>

              <div className="p-3 rounded-lg bg-red-50/50 border border-red-100 flex flex-col">
                <span className="text-[10px] font-semibold text-red-800 uppercase tracking-wider">
                  En Taller
                </span>
                <span className="text-lg font-bold text-red-950 mt-0.5">
                  {maintenanceVehicles}{' '}
                  <span className="text-xs font-normal text-red-700">({maintenancePct}%)</span>
                </span>
              </div>
            </div>

            {/* Desglose por Categoría y Transmisión */}
            <div className="pt-6 mt-6 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">
                  Por Tipo de Carrocería
                </h3>
                <div className="space-y-1.5 text-xs text-zinc-600">
                  <div className="flex justify-between py-1 border-b border-zinc-50">
                    <span>SUVs / Familiares</span>
                    <strong className="text-zinc-900 font-semibold">{suvCount}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-50">
                    <span>Sedanes Cotidianos</span>
                    <strong className="text-zinc-900 font-semibold">{sedanCount}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-50">
                    <span>Pickups y Camionetas 4x4</span>
                    <strong className="text-zinc-900 font-semibold">{pickupCount}</strong>
                  </div>
                  {sportCount > 0 && (
                    <div className="flex justify-between py-1 border-b border-zinc-50">
                      <span>Sport / Otros</span>
                      <strong className="text-zinc-900 font-semibold">{sportCount}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">
                  Por Transmisión
                </h3>
                <div className="space-y-1.5 text-xs text-zinc-600">
                  <div className="flex justify-between py-1 border-b border-zinc-50">
                    <span>Automático / CVT</span>
                    <strong className="text-zinc-900 font-semibold">{autoCount}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-50">
                    <span>Mecánico / Manual</span>
                    <strong className="text-zinc-900 font-semibold">{manualCount}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Acceso a la Pestaña Flota para gestión */}
            {flags.vehicles && (
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  Para modificar inventario, precios o fotos:
                </span>
                <Link
                  href="/admin/vehicles"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A192F] hover:underline"
                >
                  <span>Abrir Gestión de Flota</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Demanda y Mensajes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Estado de Consultas y Eficiencia */}
          <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#0A192F]" />
                <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">
                  Atención de Consultas
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700">
                {attentionRate}% resueltas
              </span>
            </div>

            {/* Barra de progreso de atención */}
            <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden mb-4">
              <div
                style={{ width: `${attentionRate}%` }}
                className="bg-[#0A192F] h-full transition-all duration-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-6">
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Respondidos / Cerrados
                </span>
                <p className="text-lg font-bold text-zinc-900 mt-0.5">
                  {resolvedMessages}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">
                  Por Atender
                </span>
                <p className="text-lg font-bold text-amber-900 mt-0.5">
                  {pendingMessages}
                </p>
              </div>
            </div>

            {/* Consultas Recientes Informativas (Sin CRUD) */}
            <div className="border-t border-zinc-100 pt-4">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Actividad Reciente
              </h3>

              {recentMessages.length > 0 ? (
                <div className="space-y-2.5">
                  {recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-900 truncate">
                          {msg.name}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {SUBJECT_LABELS[msg.subject] ?? msg.subject}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          msg.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : msg.status === 'replied'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-zinc-200 text-zinc-700'
                        }`}
                      >
                        {MESSAGE_STATUS_LABELS[msg.status] ?? msg.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 italic py-2">
                  No hay mensajes registrados recientemente.
                </p>
              )}

              {flags.messages && (
                <div className="mt-4 pt-3 border-t border-zinc-100 text-right">
                  <Link
                    href="/admin/messages"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0A192F] hover:underline"
                  >
                    <span>Ver todas las consultas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
