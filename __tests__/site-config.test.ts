import { describe, it, expect } from 'vitest'
import {
  DEFAULT_SITE_CONFIG,
  parseSiteConfig,
  serializeSiteConfig,
  type SiteConfig,
} from '@/lib/site-config'

describe('Site Config Logic & Persistence', () => {
  it('tiene todos los campos requeridos por defecto según las imágenes del usuario', () => {
    expect(DEFAULT_SITE_CONFIG.brandName).toBe('AUTORUTA')
    expect(DEFAULT_SITE_CONFIG.slogan).toContain('Servicio de alquiler de autos cotidianos')
    expect(DEFAULT_SITE_CONFIG.instagramUrl).toBe('https://instagram.com')
    expect(DEFAULT_SITE_CONFIG.facebookUrl).toBe('https://facebook.com')
    expect(DEFAULT_SITE_CONFIG.scheduleWeekdays).toBe('Lunes — Viernes: 8:00 – 19:00')
    expect(DEFAULT_SITE_CONFIG.scheduleWeekends).toBe('Sábados: 9:00 – 17:00')
    expect(DEFAULT_SITE_CONFIG.location).toBe('Tarapoto, San Martín')
    expect(DEFAULT_SITE_CONFIG.phone).toBe('')
    expect(DEFAULT_SITE_CONFIG.whatsappNumber).toBe('')
  })

  it('parsea correctamente una cadena serializada y preserva valores modificados', () => {
    const customConfig: SiteConfig = {
      ...DEFAULT_SITE_CONFIG,
      brandName: 'AUTORUTA SELVA',
      phone: '+51 987 654 321',
      location: 'Tarapoto Centro, San Martín',
    }

    const serialized = serializeSiteConfig(customConfig)
    const parsed = parseSiteConfig(serialized)

    expect(parsed.brandName).toBe('AUTORUTA SELVA')
    expect(parsed.phone).toBe('+51 987 654 321')
    expect(parsed.location).toBe('Tarapoto Centro, San Martín')
    expect(parsed.slogan).toBe(DEFAULT_SITE_CONFIG.slogan)
  })

  it('hace fallback seguro a valores por defecto cuando el input es nulo o inválido', () => {
    expect(parseSiteConfig(null)).toEqual(DEFAULT_SITE_CONFIG)
    expect(parseSiteConfig(undefined)).toEqual(DEFAULT_SITE_CONFIG)
    expect(parseSiteConfig('invalid-json')).toEqual(DEFAULT_SITE_CONFIG)
  })
})
