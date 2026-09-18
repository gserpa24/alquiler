// lib/site-config.ts
// Configuración dinámica de la empresa y sitio web para el pie de página, contacto y redes.
// Archivo isomorfo (seguro para cliente y servidor).

export interface SiteConfig {
  brandName: string
  slogan: string
  instagramUrl: string
  facebookUrl: string
  scheduleWeekdays: string
  scheduleWeekends: string
  location: string
  phone: string
  whatsappNumber: string
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: 'AUTORUTA',
  slogan:
    'Servicio de alquiler de autos cotidianos, viajes por carretera (road trips) y ruteo diario con total transparencia.',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  scheduleWeekdays: 'Lunes — Viernes: 8:00 – 19:00',
  scheduleWeekends: 'Sábados: 9:00 – 17:00',
  location: 'Tarapoto, San Martín',
  phone: '+51 997 936 599',
  whatsappNumber: '51997936599',
}

export const SITE_CONFIG_COOKIE_NAME = 'autoruta_site_config'

/**
 * Parsea una cadena JSON en un objeto SiteConfig seguro.
 */
export function parseSiteConfig(raw: string | undefined | null): SiteConfig {
  if (!raw) return { ...DEFAULT_SITE_CONFIG }
  try {
    const parsed = JSON.parse(decodeURIComponent(raw))
    return {
      brandName: typeof parsed.brandName === 'string' ? parsed.brandName : DEFAULT_SITE_CONFIG.brandName,
      slogan: typeof parsed.slogan === 'string' ? parsed.slogan : DEFAULT_SITE_CONFIG.slogan,
      instagramUrl: typeof parsed.instagramUrl === 'string' ? parsed.instagramUrl : DEFAULT_SITE_CONFIG.instagramUrl,
      facebookUrl: typeof parsed.facebookUrl === 'string' ? parsed.facebookUrl : DEFAULT_SITE_CONFIG.facebookUrl,
      scheduleWeekdays: typeof parsed.scheduleWeekdays === 'string' ? parsed.scheduleWeekdays : DEFAULT_SITE_CONFIG.scheduleWeekdays,
      scheduleWeekends: typeof parsed.scheduleWeekends === 'string' ? parsed.scheduleWeekends : DEFAULT_SITE_CONFIG.scheduleWeekends,
      location: typeof parsed.location === 'string' ? parsed.location : DEFAULT_SITE_CONFIG.location,
      phone: typeof parsed.phone === 'string' ? parsed.phone : DEFAULT_SITE_CONFIG.phone,
      whatsappNumber: typeof parsed.whatsappNumber === 'string' ? parsed.whatsappNumber : DEFAULT_SITE_CONFIG.whatsappNumber,
    }
  } catch {
    return { ...DEFAULT_SITE_CONFIG }
  }
}

/**
 * Serializa la configuración para almacenamiento en cookies o localStorage.
 */
export function serializeSiteConfig(config: SiteConfig): string {
  return encodeURIComponent(JSON.stringify(config))
}
