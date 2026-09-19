'use client'

// components/admin/AdminModulesManager.tsx
// Interfaz administrativa para visualizar y conmutar Feature Flags de módulos.

import Link from 'next/link'
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  RotateCcw,
  ExternalLink,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { useAdminModules } from '@/contexts/AdminModulesContext'

const ICON_MAP = {
  LayoutDashboard,
  Car,
  MessageSquare,
}

export function AdminModulesManager() {
  const {
    modules,
    flags,
    toggleModule,
    resetModules,
    isPending,
    activeCount,
    totalCount,
  } = useAdminModules()

  return (
    <div className="space-y-6">
      {/* ── Toolbar de Estado y Restauración ────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[#0A192F] shrink-0">
            <SlidersHorizontal className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-zinc-950">
                Estado de la Modularidad
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {activeCount} de {totalCount} activos
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Activa o desactiva módulos para adaptar el panel a los flujos de trabajo del equipo.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={() => resetModules()}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md border border-zinc-200 bg-white text-zinc-700 text-xs font-semibold hover:bg-zinc-50 hover:text-zinc-950 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer self-start sm:self-auto"
          title="Restablecer todos los módulos a sus valores predeterminados"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
          <span>Restaurar por defecto</span>
        </button>
      </div>

      {/* ── Grilla de Módulos ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const isEnabled = flags[mod.id] ?? true
          const Icon = ICON_MAP[mod.icon]

          return (
            <div
              key={mod.id}
              className={`p-6 rounded-xl border bg-white flex flex-col justify-between transition-all duration-200 shadow-2xs ${
                isEnabled
                  ? 'border-zinc-200 hover:border-zinc-300'
                  : 'border-zinc-200/60 bg-zinc-50/50 opacity-80'
              }`}
            >
              <div>
                {/* Header de la tarjeta */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      isEnabled
                        ? 'bg-[#0A192F] text-white border-[#0A192F]'
                        : 'bg-zinc-100 text-zinc-400 border-zinc-200'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>

                  {/* Switch Toggle */}
                  <label
                    htmlFor={`toggle-${mod.id}`}
                    className="relative inline-flex items-center cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      id={`toggle-${mod.id}`}
                      checked={isEnabled}
                      disabled={isPending}
                      onChange={(e) => toggleModule(mod.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A192F]"></div>
                  </label>
                </div>

                {/* Título y Estado */}
                <div className="mb-2 flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-zinc-950">
                    {mod.name}
                  </h3>
                  {isEnabled ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200">
                      <XCircle className="w-3 h-3" />
                      Desactivado
                    </span>
                  )}
                </div>

                {/* Descripción */}
                <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                  {mod.description}
                </p>
              </div>

              {/* Footer con link a la ruta */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400">
                  {mod.route}
                </span>

                {isEnabled ? (
                  <Link
                    href={mod.route}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A192F] hover:underline"
                  >
                    <span>Ir al módulo</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-xs text-zinc-400 italic">
                    Desactivado
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
