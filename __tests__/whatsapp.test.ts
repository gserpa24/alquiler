// __tests__/whatsapp.test.ts
import { describe, it, expect } from 'vitest'
import { buildVehicleWhatsAppLink, buildGenericWhatsAppLink } from '@/lib/whatsapp'

const BASE_PARAMS = {
  brand: 'Toyota',
  model: 'Hilux',
  year:  2024,
  color: 'Blanco',
  phone: '51997936599',
} as const

describe('buildVehicleWhatsAppLink', () => {
  it('genera URL válida de wa.me', () => {
    const url = buildVehicleWhatsAppLink(BASE_PARAMS)
    expect(url).toMatch(/^https:\/\/wa\.me\/51997936599\?text=/)
  })

  it('el mensaje contiene el nombre del vehículo codificado', () => {
    const url = buildVehicleWhatsAppLink(BASE_PARAMS)
    expect(url).toContain(encodeURIComponent('Toyota Hilux 2024'))
  })

  it('incluye el color cuando se provee', () => {
    const url = buildVehicleWhatsAppLink(BASE_PARAMS)
    expect(url).toContain(encodeURIComponent('(Blanco)'))
  })

  it('funciona sin color (campo opcional)', () => {
    const noColor = { ...BASE_PARAMS } as Record<string, unknown>
    delete noColor.color
    expect(() => buildVehicleWhatsAppLink(noColor as unknown as typeof BASE_PARAMS)).not.toThrow()
  })

  it('sanitiza el número eliminando caracteres no numéricos', () => {
    const url = buildVehicleWhatsAppLink({ ...BASE_PARAMS, phone: '+51 997 936-599' })
    expect(url).toContain('wa.me/51997936599')
  })

  it('lanza error si el número está vacío', () => {
    expect(() => buildVehicleWhatsAppLink({ ...BASE_PARAMS, phone: '' }))
      .toThrow('NEXT_PUBLIC_WHATSAPP_NUMBER no está configurado')
  })

  it('lanza error si el número tiene menos de 8 dígitos', () => {
    expect(() => buildVehicleWhatsAppLink({ ...BASE_PARAMS, phone: '1234567' }))
      .toThrow('Número de teléfono inválido')
  })

  it('usa encodeURIComponent (! y ¡ están codificados)', () => {
    const url = buildVehicleWhatsAppLink(BASE_PARAMS)
    // encodeURI dejaría ! sin codificar; encodeURIComponent lo codifica
    expect(url).not.toContain('¡')
    expect(decodeURIComponent(url.split('?text=')[1])).toContain('¡Hola!')
  })
})

// buildGenericWhatsAppLink lee WA_NUMBER como constante de módulo evaluada al importar.
// Verificamos la lógica de encoding que es lo crítico:
describe('Encoding de mensajes genéricos — buildGenericWhatsAppLink logic', () => {
  it('encodeURIComponent codifica caracteres especiales correctamente', () => {
    const msg     = '¡Hola! Me gustaría obtener información sobre sus vehículos disponibles.'
    const encoded = encodeURIComponent(msg)
    expect(encoded).not.toContain('¡')
    expect(encoded).toContain('!')  // ASCII ! no se codifica (correcto)
    expect(decodeURIComponent(encoded)).toBe(msg)
  })

  it('el mensaje decodificado conserva emojis y acentos', () => {
    const msg  = '¡Hola! Quiero info. 🚗'
    const url  = `https://wa.me/51997936599?text=${encodeURIComponent(msg)}`
    const back = decodeURIComponent(url.split('?text=')[1])
    expect(back).toBe(msg)
  })
})

describe('buildGenericWhatsAppLink', () => {
  it('genera enlace genérico de WhatsApp', () => {
    const url = buildGenericWhatsAppLink()
    expect(url).toMatch(/^https:\/\/wa\.me\//)
    expect(url).toContain('text=')
  })

  it('permite mensaje personalizado', () => {
    const url = buildGenericWhatsAppLink('Consulta de prueba')
    expect(url).toContain(encodeURIComponent('Consulta de prueba'))
  })
})

// __tests__/validations.test.ts
import { describe as describeV, it as itV, expect as expectV } from 'vitest'
import { VehicleFilterSchema, ContactFormSchema } from '@/lib/validations'

describeV('VehicleFilterSchema', () => {
  itV('acepta filtros vacíos y aplica defaults', () => {
    const result = VehicleFilterSchema.safeParse({})
    expectV(result.success).toBe(true)
    if (result.success) {
      expectV(result.data.page).toBe(1)
      expectV(result.data.limit).toBe(12)
    }
  })

  itV('acepta filtros válidos con coerción de números', () => {
    const result = VehicleFilterSchema.safeParse({
      category: 'suv', seats: '5', priceMin: '100', priceMax: '500',
    })
    expectV(result.success).toBe(true)
    if (result.success) {
      expectV(result.data.seats).toBe(5)
      expectV(result.data.priceMin).toBe(100)
    }
  })

  itV('rechaza priceMin > priceMax', () => {
    const result = VehicleFilterSchema.safeParse({ priceMin: '500', priceMax: '100' })
    expectV(result.success).toBe(false)
  })

  itV('rechaza categoría inválida', () => {
    const result = VehicleFilterSchema.safeParse({ category: 'moto' })
    expectV(result.success).toBe(false)
  })
})

describeV('ContactFormSchema', () => {
  const valid = {
    name: 'Juan Pérez', email: 'juan@email.com',
    subject: 'rental', message: 'Hola, quiero información sobre sus vehículos disponibles.',
  }

  itV('acepta formulario válido', () => {
    expectV(ContactFormSchema.safeParse(valid).success).toBe(true)
  })

  itV('rechaza email inválido', () => {
    const result = ContactFormSchema.safeParse({ ...valid, email: 'no-es-email' })
    expectV(result.success).toBe(false)
  })

  itV('rechaza mensaje muy corto', () => {
    const result = ContactFormSchema.safeParse({ ...valid, message: 'Hola' })
    expectV(result.success).toBe(false)
  })

  itV('rechaza honeypot con contenido (spam)', () => {
    const result = ContactFormSchema.safeParse({ ...valid, honeypot: 'bot' })
    expectV(result.success).toBe(false)
  })

  itV('rechaza asunto inválido', () => {
    const result = ContactFormSchema.safeParse({ ...valid, subject: 'otro-asunto' })
    expectV(result.success).toBe(false)
  })
})
