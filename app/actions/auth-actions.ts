'use server'

// app/actions/auth-actions.ts
// Server Actions para autenticación de administradores.

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from '@/lib/auth/session'

const LoginSchema = z.object({
  email: z.string().email('Por favor ingresa un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export interface LoginResult {
  success: boolean
  error?: string
}

/**
 * Credenciales por defecto para el acceso administrativo inicial.
 * Se pueden sobrescribir en las variables de entorno (.env.local o Vercel).
 */
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@autoruta.pe'
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdminAutoruta2026!'

/**
 * Server Action: Iniciar sesión de administrador.
 * Soporta credenciales maestras de entorno y Supabase Auth.
 */
export async function loginAdminAction(formData: unknown): Promise<LoginResult> {
  const validated = LoginSchema.safeParse(formData)
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message ?? 'Datos inválidos',
    }
  }

  const { email, password } = validated.data
  const normalizedEmail = email.toLowerCase().trim()

  // 1. Verificación por credenciales maestras de administrador
  const isMasterMatch =
    normalizedEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() &&
    password === DEFAULT_ADMIN_PASSWORD

  if (isMasterMatch) {
    const token = await createSessionToken(normalizedEmail)
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    })

    return { success: true }
  }

  // 2. Verificación alternativa mediante Supabase Auth
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    if (!error && data?.user) {
      const token = await createSessionToken(normalizedEmail)
      const cookieStore = await cookies()
      cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE,
      })

      return { success: true }
    }
  } catch (supabaseErr) {
    console.error('[Auth Supabase Error]:', supabaseErr)
  }

  return {
    success: false,
    error: 'Correo electrónico o contraseña incorrectos.',
  }
}

/**
 * Server Action: Cerrar sesión de administrador y redirigir al login.
 */
export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {
    // Ignorar si no había sesión en Supabase
  }

  redirect('/admin/login')
}
