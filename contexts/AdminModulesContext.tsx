'use client'

// contexts/AdminModulesContext.tsx
// Estado global reactivo para Feature Flags y activación modular en el Panel Administrativo.

import {
  createContext,
  useContext,
  useState,
  useTransition,
  useCallback,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import {
  type AdminModuleId,
  ADMIN_MODULES,
  AdminModuleConfig,
  getDefaultModuleFlags,
} from '@/lib/admin-modules'
import {
  toggleAdminModuleAction,
  resetAdminModuleFlagsAction,
} from '@/app/actions/admin-modules'

interface AdminModulesContextValue {
  flags: Record<AdminModuleId, boolean>
  modules: AdminModuleConfig[]
  isModuleEnabled: (id: AdminModuleId) => boolean
  toggleModule: (id: AdminModuleId, enabled: boolean) => Promise<boolean>
  resetModules: () => Promise<boolean>
  isPending: boolean
  activeCount: number
  totalCount: number
}

const AdminModulesContext = createContext<AdminModulesContextValue | null>(null)

interface AdminModulesProviderProps {
  children: ReactNode
  initialFlags?: Record<AdminModuleId, boolean>
}

export function AdminModulesProvider({
  children,
  initialFlags,
}: AdminModulesProviderProps) {
  const [flags, setFlags] = useState<Record<AdminModuleId, boolean>>(
    () => initialFlags ?? getDefaultModuleFlags()
  )
  const [isPending, startTransition] = useTransition()

  const isModuleEnabled = useCallback(
    (id: AdminModuleId) => {
      return flags[id] ?? true
    },
    [flags]
  )

  const toggleModule = useCallback(
    async (id: AdminModuleId, enabled: boolean): Promise<boolean> => {
      // Optimistic update
      const previousFlags = { ...flags }
      const newFlags = { ...flags, [id]: enabled }
      setFlags(newFlags)

      const moduleConfig = ADMIN_MODULES.find((m) => m.id === id)
      const moduleName = moduleConfig?.shortName ?? id

      return new Promise<boolean>((resolve) => {
        startTransition(async () => {
          const result = await toggleAdminModuleAction(id, enabled)
          if (result.success && result.flags) {
            setFlags(result.flags)
            toast.success(
              enabled
                ? `Módulo "${moduleName}" activado`
                : `Módulo "${moduleName}" desactivado`
            )
            resolve(true)
          } else {
            // Revert on error
            setFlags(previousFlags)
            toast.error(result.error ?? 'Error al modificar el módulo')
            resolve(false)
          }
        })
      })
    },
    [flags]
  )

  const resetModules = useCallback(async (): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      startTransition(async () => {
        const result = await resetAdminModuleFlagsAction()
        if (result.success && result.flags) {
          setFlags(result.flags)
          toast.success('Todos los módulos han sido restaurados')
          resolve(true)
        } else {
          toast.error(result.error ?? 'Error al restaurar los módulos')
          resolve(false)
        }
      })
    })
  }, [])

  const activeCount = Object.values(flags).filter(Boolean).length
  const totalCount = ADMIN_MODULES.length

  const value: AdminModulesContextValue = {
    flags,
    modules: ADMIN_MODULES,
    isModuleEnabled,
    toggleModule,
    resetModules,
    isPending,
    activeCount,
    totalCount,
  }

  return (
    <AdminModulesContext.Provider value={value}>
      {children}
    </AdminModulesContext.Provider>
  )
}

export function useAdminModules(): AdminModulesContextValue {
  const context = useContext(AdminModulesContext)
  if (!context) {
    throw new Error('useAdminModules debe ser utilizado dentro de un AdminModulesProvider')
  }
  return context
}
