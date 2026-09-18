// lib/whatsapp.ts

const WA_NUMBER      = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
const WA_BASE        = 'https://wa.me'
const MAX_URL_LENGTH = 3500

export interface VehicleWhatsAppParams {
  brand:  string
  model:  string
  year:   number
  color?: string | null
  /** Override del número global. Útil para testing y configuración dinámica. */
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
 * @throws {Error} Si no hay número configurado
 * @throws {Error} Si el número tiene formato inválido (< 8 o > 15 dígitos)
 * @throws {Error} Si el mensaje codificado supera `MAX_URL_LENGTH`
 */
export function buildVehicleWhatsAppLink(params: VehicleWhatsAppParams): string {
  const rawPhone  = params.phone || WA_NUMBER
  const cleanPhone = (rawPhone || '').replace(/\D/g, '')

  if (!cleanPhone) {
    throw new Error('No hay número de WhatsApp configurado.')
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
 * Permite especificar un número telefónico dinámico proveniente del panel de configuración.
 */
export function buildGenericWhatsAppLink(customMessage?: string, phoneOverride?: string): string {
  const rawPhone = phoneOverride || WA_NUMBER
  const cleanPhone = (rawPhone || '').replace(/\D/g, '')
  if (!cleanPhone) throw new Error('No hay número de WhatsApp configurado.')

  const message = customMessage
    ?? '¡Hola! Me gustaría obtener información sobre sus vehículos disponibles.'

  return `${WA_BASE}/${cleanPhone}?text=${encodeURIComponent(message)}`
}
