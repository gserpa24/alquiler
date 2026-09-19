'use server'

// app/actions/site-config.ts
// Server Actions para guardar y restablecer la configuración de marca, contacto y redes.

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
  type SiteConfig,
  DEFAULT_SITE_CONFIG,
  SITE_CONFIG_COOKIE_NAME,
  serializeSiteConfig,
} from '@/lib/site-config'
import {
  writeSiteConfigFile,
  getSiteConfigFile,
} from '@/lib/site-config-server'
import { requireAdminSession } from '@/lib/auth/guard'
import { SiteConfigSchema } from '@/lib/validations'

export interface SiteConfigActionResult {
  success: boolean
  config?: SiteConfig
  error?: string
}

/**
 * Server Action: Guarda la configuración institucional del sitio.
 */
export async function updateSiteConfigAction(
  updates: unknown
): Promise<SiteConfigActionResult> {
  try {
    await requireAdminSession()

    const validated = SiteConfigSchema.safeParse(updates)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message ?? 'Datos de configuración inválidos',
      }
    }

    const data = validated.data
    const current = await getSiteConfigFile()
    const merged: SiteConfig = {
      brandName: data.brandName?.trim() || current.brandName,
      slogan: data.slogan?.trim() || current.slogan,
      instagramUrl: data.instagramUrl?.trim() || current.instagramUrl,
      facebookUrl: data.facebookUrl?.trim() || current.facebookUrl,
      scheduleWeekdays: data.scheduleWeekdays?.trim() || current.scheduleWeekdays,
      scheduleWeekends: data.scheduleWeekends?.trim() || current.scheduleWeekends,
      location: data.location?.trim() || current.location,
      phone: data.phone?.trim() || current.phone,
      whatsappNumber: data.whatsappNumber?.replace(/\D/g, '') || current.whatsappNumber,
    }

    // Persistir en archivo local
    await writeSiteConfigFile(merged)

    // Persistir en cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: SITE_CONFIG_COOKIE_NAME,
      value: serializeSiteConfig(merged),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 año
      path: '/',
    })

    // Revalidar el sitio entero
    revalidatePath('/', 'layout')
    revalidatePath('/contact')
    revalidatePath('/admin')
    revalidatePath('/admin/settings')

    return { success: true, config: merged }
  } catch (error) {
    console.error('[updateSiteConfigAction Error]:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al guardar la configuración',
    }
  }
}

/**
 * Server Action: Restablece la configuración a los valores por defecto.
 */
export async function resetSiteConfigAction(): Promise<SiteConfigActionResult> {
  try {
    await requireAdminSession()

    await writeSiteConfigFile(DEFAULT_SITE_CONFIG)

    const cookieStore = await cookies()
    cookieStore.set({
      name: SITE_CONFIG_COOKIE_NAME,
      value: serializeSiteConfig(DEFAULT_SITE_CONFIG),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })

    revalidatePath('/', 'layout')
    revalidatePath('/contact')
    revalidatePath('/admin')
    revalidatePath('/admin/settings')

    return { success: true, config: DEFAULT_SITE_CONFIG }
  } catch (error) {
    console.error('[resetSiteConfigAction Error]:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al restablecer la configuración',
    }
  }
}
