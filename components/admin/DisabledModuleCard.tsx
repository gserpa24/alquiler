'use client'

// components/admin/DisabledModuleCard.tsx
// Componente de fallback cuando un módulo está desactivado mediante feature flag.

import Link from 'next/link'
import { AlertCircle, SlidersHorizontal, CheckCircle2, ArrowRight } from 'lucide-react'
import { type AdminModuleId, ADMIN_MODULES } from '@/lib/admin-modules'
import { useAdminModules } from '@/contexts/AdminModulesContext'

interface DisabledModuleCardProps {
  moduleId: AdminModuleId
}

export function DisabledModuleCard({ moduleId }: DisabledModuleCardProps) {
  const { toggleModule, isPending } = useAdminModules()
  const moduleConfig = ADMIN_MODULES.find((m) => m.id === moduleId)
  const name = moduleConfig?.name ?? moduleId

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-xl border border-zinc-200 shadow-sm text-center">
      <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-4 text-zinc-500">
        <AlertCircle className="w-6 h-6 stroke-[1.5]" />
      </div>

      <span className="inline-block px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[10px] font-semibold uppercase tracking-wider mb-2">
        Feature Flag Inactivo
      </span>

      <h2 className="text-xl font-bold tracking-tight text-zinc-950 mb-2">
        Módulo {name} Desactivado
      </h2>

      <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto mb-6 leading-relaxed">
        Este módulo se encuentra temporalmente desactivado para la vista del panel administrativo. Puedes reactivarlo con un solo clic o gestionar la visibilidad de todos los módulos.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => toggleModule(moduleId, true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#152e52] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Activar este módulo</span>
        </button>

        <Link
          href="/admin/modules"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-zinc-200 bg-white text-zinc-700 text-xs font-semibold hover:bg-zinc-50 transition-colors shadow-2xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
          <span>Gestor de Módulos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
