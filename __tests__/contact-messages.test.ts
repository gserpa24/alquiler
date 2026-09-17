// __tests__/contact-messages.test.ts
import { describe, it, expect } from 'vitest'
import { ContactFormSchema } from '@/lib/validations'
import {
  saveContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from '@/lib/supabase/messages'

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
