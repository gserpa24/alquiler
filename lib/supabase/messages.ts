// lib/supabase/messages.ts
// Gestión de mensajes del formulario de contacto para el Panel Administrativo.
// Soporta persistencia en Supabase (tabla contact_messages) con fallback robusto en memoria.

import { type ContactMessage, type MessageStatus } from '@/types/message'

const IS_MOCK =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('tu-proyecto')

// Fallback en memoria para desarrollo o si la tabla aún no se ha creado en Supabase
const FALLBACK_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-demo-1',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@gmail.com',
    phone: '+51 987 654 321',
    subject: 'rental',
    message: 'Hola, quisiera consultar sobre el alquiler de una camioneta para viajar a Tarapoto durante 4 días la próxima semana. ¿Tienen disponibilidad?',
    status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // hace 45 min
  },
  {
    id: 'msg-demo-2',
    name: 'Andrea Paredes',
    email: 'andrea.paredes@hotmail.com',
    phone: '+51 991 223 344',
    subject: 'purchase',
    message: 'Buenas tardes, vi el Toyota Yaris en el catálogo y me interesa saber si el precio de venta es negociable o si brindan facilidades.',
    status: 'read',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // hace 5 horas
  },
]

async function getAdminDbClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    return createAdminClient()
  }
  const { createClient } = await import('@/lib/supabase/server')
  return await createClient()
}

/**
 * Guarda un nuevo mensaje de contacto en Supabase o en el almacén fallback.
 */
export async function saveContactMessage(input: {
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
}): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    subject: input.subject,
    message: input.message,
    status: 'pending',
    created_at: new Date().toISOString(),
  }

  if (IS_MOCK) {
    FALLBACK_MESSAGES.unshift(newMsg)
    return newMsg
  }

  try {
    const supabase = await getAdminDbClient()
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(newMsg)
      .select()
      .single()

    if (error) {
      // Si la tabla no existe en Supabase todavía, guardamos en fallback temporal
      console.warn('[saveContactMessage]: Fallback temporal activo:', error.message)
      FALLBACK_MESSAGES.unshift(newMsg)
      return newMsg
    }

    return data as ContactMessage
  } catch (err) {
    console.warn('[saveContactMessage]: Error de conexión, usando fallback:', err)
    FALLBACK_MESSAGES.unshift(newMsg)
    return newMsg
  }
}

/**
 * Obtiene todos los mensajes de contacto ordenados por fecha descendente.
 */
export async function getContactMessages(): Promise<ContactMessage[]> {
  if (IS_MOCK) {
    return [...FALLBACK_MESSAGES]
  }

  try {
    const supabase = await getAdminDbClient()
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('[getContactMessages]: Fallback activo:', error.message)
      return [...FALLBACK_MESSAGES]
    }

    return (data ?? []) as ContactMessage[]
  } catch (err) {
    console.warn('[getContactMessages]: Error de conexión, usando fallback:', err)
    return [...FALLBACK_MESSAGES]
  }
}

/**
 * Actualiza el estado de un mensaje (ej: de 'pending' a 'read' o 'replied').
 */
export async function updateContactMessageStatus(
  id: string,
  status: MessageStatus
): Promise<boolean> {
  const fallbackIndex = FALLBACK_MESSAGES.findIndex((m) => m.id === id)
  if (fallbackIndex !== -1) {
    FALLBACK_MESSAGES[fallbackIndex].status = status
  }

  if (IS_MOCK) return true

  try {
    const supabase = await getAdminDbClient()
    const { error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.warn('[updateContactMessageStatus]: Fallback usado:', error.message)
      return true
    }

    return true
  } catch (err) {
    console.warn('[updateContactMessageStatus]: Error en conexión:', err)
    return true
  }
}

/**
 * Elimina un mensaje por su ID.
 */
export async function deleteContactMessage(id: string): Promise<boolean> {
  const fallbackIndex = FALLBACK_MESSAGES.findIndex((m) => m.id === id)
  if (fallbackIndex !== -1) {
    FALLBACK_MESSAGES.splice(fallbackIndex, 1)
  }

  if (IS_MOCK) return true

  try {
    const supabase = await getAdminDbClient()
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (error) {
      console.warn('[deleteContactMessage]: Fallback usado:', error.message)
      return true
    }

    return true
  } catch (err) {
    console.warn('[deleteContactMessage]: Error en conexión:', err)
    return true
  }
}

/**
 * Obtiene la cantidad de mensajes pendientes.
 */
export async function getPendingMessagesCount(): Promise<number> {
  const messages = await getContactMessages()
  return messages.filter((m) => m.status === 'pending').length
}
