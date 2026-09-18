// __tests__/contact-messages.test.ts
import { describe, it, expect, vi } from 'vitest'
import { ContactFormSchema } from '@/lib/validations'
import {
  saveContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from '@/lib/supabase/messages'
import {
  getContactMessagesAction,
  updateMessageStatusAction,
  deleteMessageAction,
} from '@/app/actions/admin-messages'

// Mock de next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock de guard de sesión de administrador
const mockRequireAdminSession = vi.fn()
vi.mock('@/lib/auth/guard', () => ({
  requireAdminSession: () => mockRequireAdminSession(),
  getAdminSession: () => mockRequireAdminSession(),
}))

describe('ContactFormSchema & Messages Inbox', () => {
  it('valida formulario de contacto con datos completos', () => {
    const valid = {
      name: 'Mario Vargas',
      email: 'mario@ejemplo.com',
      phone: '+51 999 888 777',
      subject: 'rental',
      message: 'Buenas tardes, quisiera consultar la tarifa semanal por una SUV.',
    }

    const res = ContactFormSchema.safeParse(valid)
    expect(res.success).toBe(true)
  })

  it('rechaza mensaje demasiado corto menor a 10 caracteres', () => {
    const invalid = {
      name: 'Mario',
      email: 'mario@ejemplo.com',
      subject: 'rental',
      message: 'Hola',
    }

    const res = ContactFormSchema.safeParse(invalid)
    expect(res.success).toBe(false)
  })

  it('guarda un mensaje de contacto y lo recupera en la bandeja', async () => {
    const testMsg = await saveContactMessage({
      name: 'Lucía Fernández',
      email: 'lucia@test.com',
      phone: '+51 987 654 321',
      subject: 'rental',
      message: 'Consulta sobre seguro y depósito de garantía para alquiler.',
    })

    expect(testMsg).toBeDefined()
    expect(testMsg.id).toBeDefined()
    expect(testMsg.status).toBe('pending')

    const messages = await getContactMessages()
    const found = messages.find((m) => m.id === testMsg.id)
    expect(found).toBeDefined()
    expect(found?.name).toBe('Lucía Fernández')
  })

  it('actualiza el estado del mensaje a replied', async () => {
    const testMsg = await saveContactMessage({
      name: 'Pedro Castillo',
      email: 'pedro@test.com',
      subject: 'purchase',
      message: 'Consulta sobre financiamiento para camioneta.',
    })

    const ok = await updateContactMessageStatus(testMsg.id, 'replied')
    expect(ok).toBe(true)

    const messages = await getContactMessages()
    const found = messages.find((m) => m.id === testMsg.id)
    expect(found?.status).toBe('replied')
  })

  it('elimina un mensaje de la bandeja', async () => {
    const testMsg = await saveContactMessage({
      name: 'Para Eliminar',
      email: 'eliminar@test.com',
      subject: 'other',
      message: 'Mensaje que será eliminado en el test unitario.',
    })

    const ok = await deleteContactMessage(testMsg.id)
    expect(ok).toBe(true)

    const messages = await getContactMessages()
    const found = messages.find((m) => m.id === testMsg.id)
    expect(found).toBeUndefined()
  })
})

describe('Server Actions de Mensajes — Control de Acceso', () => {
  it('retorna lista vacía si getContactMessagesAction no tiene sesión de administrador', async () => {
    mockRequireAdminSession.mockRejectedValueOnce(
      new Error('No autorizado: se requiere sesión de administrador.')
    )

    const res = await getContactMessagesAction()
    expect(res.messages).toEqual([])
  })

  it('rechaza updateMessageStatusAction si no hay sesión de administrador', async () => {
    mockRequireAdminSession.mockRejectedValueOnce(
      new Error('No autorizado: se requiere sesión de administrador.')
    )

    const res = await updateMessageStatusAction('msg-123', 'read')
    expect(res.success).toBe(false)
    expect(res.error).toContain('No se pudo actualizar')
  })

  it('rechaza deleteMessageAction si no hay sesión de administrador', async () => {
    mockRequireAdminSession.mockRejectedValueOnce(
      new Error('No autorizado: se requiere sesión de administrador.')
    )

    const res = await deleteMessageAction('msg-123')
    expect(res.success).toBe(false)
    expect(res.error).toContain('No se pudo eliminar')
  })

  it('permite updateMessageStatusAction cuando hay sesión válida de administrador', async () => {
    mockRequireAdminSession.mockResolvedValueOnce({
      id: 'admin-1',
      username: 'admin',
      role: 'admin',
    })

    const testMsg = await saveContactMessage({
      name: 'Auth Admin Test',
      email: 'auth@test.com',
      subject: 'rental',
      message: 'Mensaje para probar autorización de acción de admin.',
    })

    const res = await updateMessageStatusAction(testMsg.id, 'read')
    expect(res.success).toBe(true)
  })
})
