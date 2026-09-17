'use server'

// app/actions/admin-messages.ts
// Server Actions para el panel de mensajes de contacto.

import { revalidatePath } from 'next/cache'
import {
  getContactMessagesWithStatus,
  updateContactMessageStatus,
  deleteContactMessage,
  type MessagesQueryResult,
} from '@/lib/supabase/messages'
import { type MessageStatus } from '@/types/message'

/**
 * Obtiene los mensajes actualizados y el estado de la tabla sin recargar la página.
 */
export async function getContactMessagesAction(): Promise<MessagesQueryResult> {
  try {
    return await getContactMessagesWithStatus()
  } catch (err) {
    console.error('[getContactMessagesAction Error]:', err)
    return { messages: [], isTableMissing: false }
  }
}

export async function updateMessageStatusAction(id: string, status: MessageStatus) {
  try {
    await updateContactMessageStatus(id, status)
    revalidatePath('/admin/messages')
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('[updateMessageStatusAction Error]:', err)
    return { success: false, error: 'No se pudo actualizar el estado del mensaje' }
  }
}

export async function deleteMessageAction(id: string) {
  try {
    await deleteContactMessage(id)
    revalidatePath('/admin/messages')
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('[deleteMessageAction Error]:', err)
    return { success: false, error: 'No se pudo eliminar el mensaje' }
  }
}
