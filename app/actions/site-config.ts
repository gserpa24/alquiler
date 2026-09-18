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

export interface SiteConfigActionResult {
  success: boolean
  config?: SiteConfig
  error?: string
}

/**
 * Server Action: Guarda la configuración institucional del sitio.
 */
export async function updateSiteConfigAction(
  updates: Partial<SiteConfig>
): Promise<SiteConfigActionResult> {
  try {
    await requireAdminSession()

    const current = await getSiteConfigFile()
    const merged: SiteConfig = {
      brandName: updates.brandName?.trim() || current.brandName,
      slogan: updates.slogan?.trim() || current.slogan,
      instagramUrl: updates.instagramUrl?.trim() || current.instagramUrl,
      facebookUrl: updates.facebookUrl?.trim() || current.facebookUrl,
      scheduleWeekdays: updates.scheduleWeekdays?.trim() || current.scheduleWeekdays,
      scheduleWeekends: updates.scheduleWeekends?.trim() || current.scheduleWeekends,
      location: updates.location?.trim() || current.location,
      phone: updates.phone?.trim() || current.phone,
      whatsappNumber: updates.whatsappNumber?.replace(/\D/g, '') || current.whatsappNumber,
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
