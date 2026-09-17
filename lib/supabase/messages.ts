// lib/supabase/messages.ts
// Gestión de mensajes del formulario de contacto para el Panel Administrativo.
// Soporta persistencia en Supabase (tabla contact_messages) con fallback robusto en memoria.

import { type ContactMessage, type MessageStatus } from '@/types/message'

const IS_MOCK =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('tu-proyecto')

// Fallback temporal vacío (sin mensajes ficticios) para desarrollo o fallos transitorios
const FALLBACK_MESSAGES: ContactMessage[] = []

async function getAdminDbClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    return createAdminClient()
  }
  const { createClient } = await import('@/lib/supabase/server')
  return await createClient()
}

export interface MessagesQueryResult {
  messages:       ContactMessage[]
  isTableMissing: boolean
}

/**
 * Comprueba el estado y obtiene todos los mensajes de contacto.
 */
export async function getContactMessages(): Promise<ContactMessage[]> {
  const result = await getContactMessagesWithStatus()
  return result.messages
}

/**
 * Obtiene los mensajes y detecta si la tabla contact_messages existe en Supabase.
 */
export async function getContactMessagesWithStatus(): Promise<MessagesQueryResult> {
  if (IS_MOCK) {
    return { messages: [...FALLBACK_MESSAGES], isTableMissing: true }
  }

  try {
    const supabase = await getAdminDbClient()
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      const isMissing =
        error.code === '42P01' ||
        error.message.includes('does not exist') ||
        error.message.includes('schema cache')
      return {
        messages: [...FALLBACK_MESSAGES],
        isTableMissing: isMissing,
      }
    }

    return {
      messages: (data ?? []) as ContactMessage[],
      isTableMissing: false,
    }
  } catch {
    return {
      messages: [...FALLBACK_MESSAGES],
      isTableMissing: true,
    }
  }
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
      FALLBACK_MESSAGES.unshift(newMsg)
      return newMsg
    }

    return data as ContactMessage
  } catch {
    FALLBACK_MESSAGES.unshift(newMsg)
    return newMsg
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

    return !error
  } catch {
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

    return !error
  } catch {
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
