// lib/whatsapp.ts

const DEFAULT_FALLBACK_PHONE = '51997936599'
const WA_NUMBER      = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_FALLBACK_PHONE
const WA_BASE        = 'https://wa.me'
const MAX_URL_LENGTH = 3500

export interface VehicleWhatsAppParams {
  brand:  string
  model:  string
  year:   number
  color?: string | null
  /** Override del número global. Útil para testing. */
  phone?: string
}

/**
 * Construye un deep-link wa.me con mensaje preconfigurado para
 * consultar sobre un vehículo específico del catálogo.
 *
 * - Usa `encodeURIComponent` (no `encodeURI`) para codificar
 *   correctamente caracteres como `!`, `'`, `(`, `)`, `*`, `~`.
 * - El mensaje NO incluye fechas ni precios calculados;
 *   la negociación ocurre directamente en WhatsApp.
 *
 * @throws {Error} Si `NEXT_PUBLIC_WHATSAPP_NUMBER` no está configurado
 * @throws {Error} Si el número tiene formato inválido (< 8 o > 15 dígitos)
 * @throws {Error} Si el mensaje codificado supera `MAX_URL_LENGTH`
 */
export function buildVehicleWhatsAppLink(params: VehicleWhatsAppParams): string {
  const rawPhone  = params.phone ?? WA_NUMBER
  const cleanPhone = rawPhone.replace(/\D/g, '')

  if (!cleanPhone) {
    throw new Error(
      'NEXT_PUBLIC_WHATSAPP_NUMBER no está configurado. Añádelo a .env.local'
    )
  }
  if (cleanPhone.length < 8 || cleanPhone.length > 15) {
    throw new Error(`Número de teléfono inválido: "${rawPhone}"`)
  }

  const vehicleName = [params.brand, params.model, String(params.year)]
    .concat(params.color ? [`(${params.color})`] : [])
    .join(' ')

  const message = [
    `¡Hola! Vi el *${vehicleName}* en su catálogo y me gustaría obtener más información. 🚗`,
    '',
    '¿Podría indicarme disponibilidad y condiciones? ¡Muchas gracias!',
  ].join('\n')

  const encoded = encodeURIComponent(message)

  if (encoded.length > MAX_URL_LENGTH) {
    throw new Error(
      `Mensaje demasiado largo: ${encoded.length}/${MAX_URL_LENGTH} chars codificados`
    )
  }

  return `${WA_BASE}/${cleanPhone}?text=${encoded}`
}

/**
 * Link genérico de WhatsApp sin vehículo específico.
 * Usado por el botón flotante global visible en todas las páginas.
 */
export function buildGenericWhatsAppLink(customMessage?: string): string {
  const cleanPhone = WA_NUMBER.replace(/\D/g, '')
  if (!cleanPhone) throw new Error('NEXT_PUBLIC_WHATSAPP_NUMBER no configurado')

  const message = customMessage
    ?? '¡Hola! Me gustaría obtener información sobre sus vehículos disponibles.'

  return `${WA_BASE}/${cleanPhone}?text=${encodeURIComponent(message)}`
}
