// app/admin/page.tsx
// Dashboard principal de administración — 100% Analítico e Informativo (Módulo: dashboard).
// Secciones perfectamente alineadas y simétricas por dominio operativo (Flota | Consultas).

import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  Car,
  Clock,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Gauge,
  Inbox,
  Settings,
} from 'lucide-react'
import { getAllAdminVehicles } from '@/lib/supabase/queries'
import { getContactMessagesWithStatus } from '@/lib/supabase/messages'
import { getAdminSession } from '@/lib/auth/guard'
import { MODULE_COOKIE_NAME, parseModuleFlags } from '@/lib/admin-modules'
import { DisabledModuleCard } from '@/components/admin/DisabledModuleCard'
import { formatPrice } from '@/lib/utils'
import { MESSAGE_STATUS_LABELS } from '@/types/message'

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

  const recentMessages = messages.slice(0, 3)

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
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-zinc-200 bg-white text-zinc-700 text-xs font-semibold hover:bg-zinc-50 hover:text-zinc-950 transition-colors shadow-2xs"
            title="Editar nombre, lema, horarios, ubicación y redes del pie de página"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-400" />
            <span>Configuración</span>
          </Link>

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

      {/* ── 4 Tarjetas Métricas Superiores (Agrupadas 2x2 en móvil/tablet, 4 en fila en desktop) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: Total Flota */}
        <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Total Flota
            </span>
            <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center text-[#0A192F] shrink-0">
              <Car className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 tabular-nums">
              {totalVehicles}
            </p>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold">{availablePct}%</span> lista para reserva
            </p>
          </div>
        </div>

        {/* KPI 2: Tarifa Promedio */}
        <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Tarifa Promedio
            </span>
            <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
              <TrendingUp className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 tabular-nums">
              {formatPrice(averageRate)}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Ocupación actual: <strong className="font-semibold text-zinc-800">{rentedPct}%</strong>
            </p>
          </div>
        </div>

        {/* KPI 3: Consultas Totales */}
        <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Consultas Totales
            </span>
            <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
              <Inbox className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 tabular-nums">
              {totalMessages}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Efectividad: <strong className="font-semibold text-emerald-700">{attentionRate}% resueltas</strong>
            </p>
          </div>
        </div>

        {/* KPI 4: Por Atender */}
        <div className="p-4 sm:p-5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-amber-800">
              Por Atender
            </span>
            <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Clock className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-900 tabular-nums">
              {pendingMessages}
            </p>
            <p className="text-xs text-amber-700 mt-1">
              {pendingMessages > 0 ? (
                <span className="font-semibold text-amber-800">Requieren respuesta</span>
              ) : (
                <span className="text-emerald-700 font-medium">Bandeja al día</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Bloque Analítico Principal (Apilados en pantallas pequeñas: Flota primero, Consultas abajo; 2 columnas en desktop alineadas al 100%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
        {/* Panel 1: Estado Operativo de Flota */}
        <div className="p-6 sm:p-7 rounded-xl bg-white border border-zinc-200 shadow-2xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[#0A192F]">
                  <Gauge className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">
                    Estado Operativo de Flota
                  </h2>
                  <p className="text-[11px] text-zinc-400">Disponibilidad en tiempo real</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 font-mono">
                {totalVehicles} unidades
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
            <div className="grid grid-cols-3 gap-2.5 text-xs mb-6">
              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 flex flex-col">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                  Disponibles
                </span>
                <span className="text-lg font-bold text-emerald-950 mt-0.5">
                  {availableVehicles}{' '}
                  <span className="text-[11px] font-normal text-emerald-700">({availablePct}%)</span>
                </span>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100 flex flex-col">
                <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">
                  En Alquiler
                </span>
                <span className="text-lg font-bold text-amber-950 mt-0.5">
                  {rentedVehicles}{' '}
                  <span className="text-[11px] font-normal text-amber-700">({rentedPct}%)</span>
                </span>
              </div>

              <div className="p-3 rounded-lg bg-red-50/60 border border-red-100 flex flex-col">
                <span className="text-[10px] font-semibold text-red-800 uppercase tracking-wider">
                  En Taller
                </span>
                <span className="text-lg font-bold text-red-950 mt-0.5">
                  {maintenanceVehicles}{' '}
                  <span className="text-[11px] font-normal text-red-700">({maintenancePct}%)</span>
                </span>
              </div>
            </div>

            {/* Desglose por Categoría y Transmisión */}
            <div className="pt-4 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
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
                    <span>Pickups 4x4</span>
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
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
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
          </div>

          {/* Acceso a la Pestaña Flota para gestión */}
          {flags.vehicles && (
            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="text-zinc-500">
                Para editar unidades, fotos y disponibilidad:
              </span>
              <Link
                href="/admin/vehicles"
                className="inline-flex items-center gap-1.5 font-bold text-[#0A192F] hover:underline"
              >
                <span>Ir a Gestión de Flota</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Panel 2: Atención de Consultas */}
        <div className="p-6 sm:p-7 rounded-xl bg-white border border-zinc-200 shadow-2xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[#0A192F]">
                  <MessageSquare className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">
                    Atención de Consultas
                  </h2>
                  <p className="text-[11px] text-zinc-400">Canal de entrada web y WhatsApp</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {attentionRate}% atendidas
              </span>
            </div>

            {/* Barra de progreso de atención */}
            <div className="w-full h-3 rounded-full bg-zinc-100 overflow-hidden mb-4">
              <div
                style={{ width: `${attentionRate}%` }}
                className="bg-[#0A192F] h-full transition-all duration-300"
              />
            </div>

            {/* Leyenda de Estados de Mensajes */}
            <div className="grid grid-cols-3 gap-2.5 text-xs mb-6">
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 flex flex-col">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Total
                </span>
                <p className="text-lg font-bold text-zinc-900 mt-0.5">
                  {totalMessages}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 flex flex-col">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                  Resueltos
                </span>
                <p className="text-lg font-bold text-emerald-950 mt-0.5">
                  {resolvedMessages}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100 flex flex-col">
                <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">
                  Por Atender
                </span>
                <p className="text-lg font-bold text-amber-900 mt-0.5">
                  {pendingMessages}
                </p>
              </div>
            </div>

            {/* Desglose por Motivo y Actividad Reciente */}
            <div className="pt-4 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Por Motivo de Consulta
                </h3>
                <div className="space-y-1.5 text-xs text-zinc-600">
                  <div className="flex justify-between py-1 border-b border-zinc-50">
                    <span>Alquiler de Vehículos</span>
                    <strong className="text-zinc-900 font-semibold">{rentalInquiries}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-50">
                    <span>Compra / Venta</span>
                    <strong className="text-zinc-900 font-semibold">{purchaseInquiries}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-50">
                    <span>Otras Consultas</span>
                    <strong className="text-zinc-900 font-semibold">{otherInquiries}</strong>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Últimas Entradas
                </h3>
                {recentMessages.length > 0 ? (
                  <div className="space-y-1.5">
                    {recentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-1.5 px-2 rounded-md bg-zinc-50 border border-zinc-100 flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="font-medium text-zinc-900 truncate max-w-[110px]">
                          {msg.name}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0 uppercase tracking-wider ${
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
                  <p className="text-[11px] text-zinc-400 italic py-2">
                    Sin consultas recientes.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Acceso a la Bandeja de Mensajes */}
          {flags.messages && (
            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="text-zinc-500">
                Para responder clientes vía WhatsApp:
              </span>
              <Link
                href="/admin/messages"
                className="inline-flex items-center gap-1.5 font-bold text-[#0A192F] hover:underline"
              >
                <span>Abrir Bandeja de Mensajes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
