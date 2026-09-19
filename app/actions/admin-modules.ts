'use server'

// app/actions/admin-modules.ts
// Server Actions para consultar y conmutar Feature Flags de los módulos del Panel Admin.

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/auth/guard'
import {
  type AdminModuleId,
  MODULE_COOKIE_NAME,
  parseModuleFlags,
  serializeModuleFlags,
  getDefaultModuleFlags,
} from '@/lib/admin-modules'

export interface ToggleModuleResult {
  success: boolean
  flags?: Record<AdminModuleId, boolean>
  error?: string
}

/**
 * Consulta los flags activos de módulos para el usuario autenticado.
 */
export async function getAdminModuleFlagsAction(): Promise<Record<AdminModuleId, boolean>> {
  await requireAdminSession()
  const cookieStore = await cookies()
  const raw = cookieStore.get(MODULE_COOKIE_NAME)?.value
  return parseModuleFlags(raw)
}

/**
 * Activa o desactiva un módulo mediante su Feature Flag.
 * Persiste la preferencia en la cookie de sesión del panel y revalida las rutas.
 */
export async function toggleAdminModuleAction(
  moduleId: AdminModuleId,
  enabled: boolean
): Promise<ToggleModuleResult> {
  try {
    await requireAdminSession()

    const cookieStore = await cookies()
    const currentFlags = parseModuleFlags(cookieStore.get(MODULE_COOKIE_NAME)?.value)

    const updatedFlags: Record<AdminModuleId, boolean> = {
      ...currentFlags,
      [moduleId]: enabled,
    }

    cookieStore.set(MODULE_COOKIE_NAME, serializeModuleFlags(updatedFlags), {
      path: '/admin',
      maxAge: 60 * 60 * 24 * 365, // 1 año
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    revalidatePath('/admin', 'layout')
    revalidatePath('/admin/modules')

    return { success: true, flags: updatedFlags }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el módulo'
    return { success: false, error: message }
  }
}

/**
 * Restaura todos los flags a su valor por defecto.
 */
export async function resetAdminModuleFlagsAction(): Promise<ToggleModuleResult> {
  try {
    await requireAdminSession()

    const cookieStore = await cookies()
    const defaultFlags = getDefaultModuleFlags()

    cookieStore.set(MODULE_COOKIE_NAME, serializeModuleFlags(defaultFlags), {
      path: '/admin',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    revalidatePath('/admin', 'layout')
    revalidatePath('/admin/modules')

    return { success: true, flags: defaultFlags }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al restaurar los módulos'
    return { success: false, error: message }
  }
}
