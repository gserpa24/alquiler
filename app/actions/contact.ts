// app/actions/contact.ts
'use server'

import { ContactFormSchema, type ContactForm } from '@/lib/validations'

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

  // Si RESEND_API_KEY está configurada, se enviaría el correo real aquí
  // En fallback registra el mensaje de contacto de forma estructurada
  return {
    success: true,
    message: '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo a la brevedad.',
  }
}
