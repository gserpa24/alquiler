// app/actions/contact.ts
'use server'

import { ContactFormSchema } from '@/lib/validations'

export interface ContactActionResult {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function submitContactAction(
  prevState: ContactActionResult | null,
  formData: FormData
): Promise<ContactActionResult> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    subject: formData.get('subject'),
    message: formData.get('message'),
    honeypot: formData.get('honeypot') || undefined,
  }

  const validated = ContactFormSchema.safeParse(raw)

  if (!validated.success) {
    const flattened = validated.error.flatten()
    return {
      success: false,
      message: 'Por favor corrige los errores del formulario.',
      errors: flattened.fieldErrors,
    }
  }

  // Honeypot anti-spam check
  if (validated.data.honeypot && validated.data.honeypot.length > 0) {
    return {
      success: false,
      message: 'Solicitud rechazada.',
    }
  }

  try {
    const { saveContactMessage } = await import('@/lib/supabase/messages')
    await saveContactMessage({
      name:    validated.data.name,
      email:   validated.data.email,
      phone:   validated.data.phone ?? null,
      subject: validated.data.subject,
      message: validated.data.message,
    })

    return {
      success: true,
      message: '¡Mensaje enviado con éxito! Nuestro equipo lo revisará en la brevedad posible.',
    }
  } catch (err) {
    console.error('[submitContactAction Error]:', err)
    return {
      success: false,
      message: 'Ocurrió un inconveniente al registrar tu mensaje. Por favor intenta nuevamente.',
    }
  }
}
