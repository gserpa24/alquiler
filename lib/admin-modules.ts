// lib/admin-modules.ts
// Definición de arquitectura modular y Feature Flags para el Panel Administrativo.

export type AdminModuleId = 'dashboard' | 'vehicles' | 'messages'

export interface AdminModuleConfig {
  id: AdminModuleId
  name: string
  shortName: string
  description: string
  route: string
  icon: 'LayoutDashboard' | 'Car' | 'MessageSquare'
  defaultEnabled: boolean
  isCore?: boolean
}

export const ADMIN_MODULES: AdminModuleConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard de Métricas',
    shortName: 'Dashboard',
    description: 'Visión general de operación, métricas clave (KPIs) y disponibilidad de flota en tiempo real.',
    route: '/admin',
    icon: 'LayoutDashboard',
    defaultEnabled: true,
  },
  {
    id: 'vehicles',
    name: 'Gestión de Flota',
    shortName: 'Flota',
    description: 'Control integral de inventario, cambio de tarifas, fotos, estados y ordenamiento manual.',
    route: '/admin/vehicles',
    icon: 'Car',
    defaultEnabled: true,
  },
  {
    id: 'messages',
    name: 'Bandeja de Mensajes',
    shortName: 'Mensajes',
    description: 'Recepción, seguimiento y respuesta directa por WhatsApp a las solicitudes de clientes.',
    route: '/admin/messages',
    icon: 'MessageSquare',
    defaultEnabled: true,
  },
]

export const MODULE_COOKIE_NAME = 'autoruta_admin_modules'

/**
 * Devuelve el estado por defecto de los módulos (todos activos salvo si variable de entorno indica lo contrario).
 */
export function getDefaultModuleFlags(): Record<AdminModuleId, boolean> {
  return {
    dashboard: process.env.NEXT_PUBLIC_ADMIN_MODULE_DASHBOARD !== 'false',
    vehicles: process.env.NEXT_PUBLIC_ADMIN_MODULE_VEHICLES !== 'false',
    messages: process.env.NEXT_PUBLIC_ADMIN_MODULE_MESSAGES !== 'false',
  }
}

/**
 * Parsea el valor serializado de la cookie de flags.
 */
export function parseModuleFlags(raw: string | undefined | null): Record<AdminModuleId, boolean> {
  const defaults = getDefaultModuleFlags()
  if (!raw) return defaults

  try {
    const parsed = JSON.parse(raw) as Partial<Record<AdminModuleId, boolean>>
    return {
      dashboard: typeof parsed.dashboard === 'boolean' ? parsed.dashboard : defaults.dashboard,
      vehicles: typeof parsed.vehicles === 'boolean' ? parsed.vehicles : defaults.vehicles,
      messages: typeof parsed.messages === 'boolean' ? parsed.messages : defaults.messages,
    }
  } catch {
    return defaults
  }
}

/**
 * Serializa los flags para guardarlos en cookie.
 */
export function serializeModuleFlags(flags: Record<AdminModuleId, boolean>): string {
  return JSON.stringify(flags)
}

/**
 * Verifica si un módulo específico está habilitado.
 */
export function isModuleEnabled(
  moduleId: AdminModuleId,
  flags: Record<AdminModuleId, boolean>
): boolean {
  return flags[moduleId] ?? true
}
