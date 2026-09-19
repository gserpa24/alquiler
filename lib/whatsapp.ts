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
  const cleanPhone = cleanPhoneNumber(rawPhone)
  if (!cleanPhone) throw new Error('No hay número de WhatsApp configurado.')

  const message = customMessage
    ?? '¡Hola! Me gustaría obtener información sobre sus vehículos disponibles.'

  return `${WA_BASE}/${cleanPhone}?text=${encodeURIComponent(message)}`
}

/**
 * Limpia y extrae únicamente los dígitos de una cadena telefónica.
 */
export function cleanPhoneNumber(phone?: string | null): string {
  return (phone || '').replace(/\D/g, '')
}

/**
 * Valida si un número telefónico cumple con el estándar E.164 (entre 8 y 15 dígitos).
 */
export function isValidWhatsAppNumber(phone?: string | null): boolean {
  const clean = cleanPhoneNumber(phone)
  return clean.length >= 8 && clean.length <= 15
}

export interface SafeWhatsAppLinkResult {
  url: string
  isConfigured: boolean
}

/**
 * Genera de forma segura el link de WhatsApp para un vehículo.
 * Si el número no está configurado o es inválido, retorna `{ url: '#', isConfigured: false }`.
 */
export function getSafeVehicleWhatsAppLink(
  params: VehicleWhatsAppParams,
  phoneOverride?: string | null,
  dateParams?: { pickupDate?: string; returnDate?: string }
): SafeWhatsAppLinkResult {
  const targetPhone = phoneOverride ?? params.phone
  if (!isValidWhatsAppNumber(targetPhone)) {
    return { url: '#', isConfigured: false }
  }

  try {
    const baseLink = buildVehicleWhatsAppLink({ ...params, phone: targetPhone! })
    if (dateParams?.pickupDate && dateParams?.returnDate) {
      const vehicleName = [params.brand, params.model, String(params.year)]
        .concat(params.color ? [`(${params.color})`] : [])
        .join(' ')
      const customMessage = [
        `¡Hola! Vi el *${vehicleName}* en su catálogo y me gustaría reservarlo del *${dateParams.pickupDate}* al *${dateParams.returnDate}*. 🚗`,
        '',
        '¿Podría confirmarme disponibilidad y precio final? ¡Muchas gracias!',
      ].join('\n')
      const baseUrl = baseLink.split('?text=')[0]
      return {
        url: `${baseUrl}?text=${encodeURIComponent(customMessage)}`,
        isConfigured: true,
      }
    }
    return { url: baseLink, isConfigured: true }
  } catch {
    return { url: '#', isConfigured: false }
  }
}

/**
 * Genera de forma segura un link genérico de WhatsApp con manejo de errores incorporado.
 * Si el número no está configurado o es inválido, retorna `{ url: '#', isConfigured: false }`.
 */
export function getSafeGenericWhatsAppLink(
  customMessage?: string,
  phoneOverride?: string | null
): SafeWhatsAppLinkResult {
  if (!isValidWhatsAppNumber(phoneOverride)) {
    return { url: '#', isConfigured: false }
  }

  try {
    const url = buildGenericWhatsAppLink(customMessage, phoneOverride!)
    return { url, isConfigured: true }
  } catch {
    return { url: '#', isConfigured: false }
  }
}

