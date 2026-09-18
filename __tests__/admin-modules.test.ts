// __tests__/admin-modules.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getDefaultModuleFlags,
  parseModuleFlags,
  serializeModuleFlags,
  isModuleEnabled,
  ADMIN_MODULES,
  MODULE_COOKIE_NAME,
} from '@/lib/admin-modules'
import {
  toggleAdminModuleAction,
  resetAdminModuleFlagsAction,
} from '@/app/actions/admin-modules'

// Mock de cookies de Next.js
const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
}
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}))

// Mock de next/cache revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock de guard de sesión de administrador
const mockRequireAdminSession = vi.fn()
vi.mock('@/lib/auth/guard', () => ({
  requireAdminSession: () => mockRequireAdminSession(),
  getAdminSession: () => mockRequireAdminSession(),
}))

describe('Admin Modules Architecture & Feature Flags', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Definición de Módulos (ADMIN_MODULES)', () => {
    it('contiene los módulos principales dashboard, vehicles y messages', () => {
      const ids = ADMIN_MODULES.map((m) => m.id)
      expect(ids).toContain('dashboard')
      expect(ids).toContain('vehicles')
      expect(ids).toContain('messages')
    })

    it('cada módulo tiene ruta, icono, nombre y descripción descriptiva', () => {
      for (const mod of ADMIN_MODULES) {
        expect(mod.route).toMatch(/^\/admin/)
        expect(mod.name.length).toBeGreaterThan(3)
        expect(mod.description.length).toBeGreaterThan(10)
        expect(mod.defaultEnabled).toBe(true)
      }
    })
  })

  describe('Funciones Puras de Feature Flags', () => {
    it('getDefaultModuleFlags devuelve todos los módulos activos por defecto', () => {
      const defaults = getDefaultModuleFlags()
      expect(defaults.dashboard).toBe(true)
      expect(defaults.vehicles).toBe(true)
      expect(defaults.messages).toBe(true)
    })

    it('parseModuleFlags retorna valores por defecto si la entrada es nula o vacía', () => {
      expect(parseModuleFlags(null)).toEqual(getDefaultModuleFlags())
      expect(parseModuleFlags(undefined)).toEqual(getDefaultModuleFlags())
      expect(parseModuleFlags('')).toEqual(getDefaultModuleFlags())
    })

    it('parseModuleFlags parsea JSON válido respetando booleanos', () => {
      const serialized = JSON.stringify({
        dashboard: true,
        vehicles: false,
        messages: true,
      })
      const parsed = parseModuleFlags(serialized)
      expect(parsed.dashboard).toBe(true)
      expect(parsed.vehicles).toBe(false)
      expect(parsed.messages).toBe(true)
    })

    it('parseModuleFlags maneja JSON corrupto sin lanzar excepción', () => {
      const parsed = parseModuleFlags('invalid-json{{{')
      expect(parsed).toEqual(getDefaultModuleFlags())
    })

    it('serializeModuleFlags produce un JSON válido', () => {
      const flags = { dashboard: false, vehicles: true, messages: false }
      const str = serializeModuleFlags(flags)
      expect(JSON.parse(str)).toEqual(flags)
    })

    it('isModuleEnabled consulta correctamente el flag del módulo', () => {
      const flags = { dashboard: true, vehicles: false, messages: true }
      expect(isModuleEnabled('dashboard', flags)).toBe(true)
      expect(isModuleEnabled('vehicles', flags)).toBe(false)
      expect(isModuleEnabled('messages', flags)).toBe(true)
    })
  })

  describe('Server Actions de Módulos (Seguridad y Persistencia)', () => {
    it('toggleAdminModuleAction rechaza si no hay sesión de administrador', async () => {
      mockRequireAdminSession.mockRejectedValueOnce(
        new Error('No autorizado: se requiere sesión de administrador.')
      )

      const result = await toggleAdminModuleAction('messages', false)
      expect(result.success).toBe(false)
      expect(result.error).toContain('No autorizado')
      expect(mockCookieStore.set).not.toHaveBeenCalled()
    })

    it('toggleAdminModuleAction guarda el flag actualizado en cookie para usuario autorizado', async () => {
      mockRequireAdminSession.mockResolvedValueOnce({ authenticated: true })
      mockCookieStore.get.mockReturnValueOnce({
        value: JSON.stringify({ dashboard: true, vehicles: true, messages: true }),
      })

      const result = await toggleAdminModuleAction('messages', false)
      expect(result.success).toBe(true)
      expect(result.flags?.messages).toBe(false)
      expect(result.flags?.dashboard).toBe(true)
      expect(result.flags?.vehicles).toBe(true)

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        MODULE_COOKIE_NAME,
        expect.stringContaining('"messages":false'),
        expect.objectContaining({ path: '/admin' })
      )
    })

    it('resetAdminModuleFlagsAction restablece todos los módulos a sus valores predeterminados', async () => {
      mockRequireAdminSession.mockResolvedValueOnce({ authenticated: true })

      const result = await resetAdminModuleFlagsAction()
      expect(result.success).toBe(true)
      expect(result.flags).toEqual(getDefaultModuleFlags())
      expect(mockCookieStore.set).toHaveBeenCalled()
    })
  })
})
