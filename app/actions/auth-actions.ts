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
  username: z.string().min(3, 'Por favor ingresa un usuario o correo válido'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
})

export interface LoginResult {
  success: boolean
  error?: string
}

/**
 * Credenciales de administrador.
 * Configuradas de forma segura mediante variables de entorno (ADMIN_USERNAME y ADMIN_PASSWORD).
 */
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

/**
 * Server Action: Iniciar sesión de administrador.
 * Valida credenciales maestras configuradas en variables de entorno y soporte opcional para Supabase Auth.
 */
export async function loginAdminAction(formData: unknown): Promise<LoginResult> {
  const validated = LoginSchema.safeParse(formData)
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message ?? 'Datos inválidos',
    }
  }

  const { username, password } = validated.data
  const normalizedUser = username.toLowerCase().trim()

  // 1. Verificación por credenciales maestras de administrador configuradas
  const isMasterMatch =
    Boolean(ADMIN_USERNAME && ADMIN_PASSWORD) &&
    (normalizedUser === ADMIN_USERNAME.toLowerCase() ||
      normalizedUser === `${ADMIN_USERNAME.toLowerCase()}@autoruta.pe`) &&
    password === ADMIN_PASSWORD

  if (isMasterMatch) {
    const token = await createSessionToken(normalizedUser)
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

  // 2. Verificación secundaria con Supabase Auth si se ingresó formato de correo
  if (normalizedUser.includes('@')) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedUser,
        password,
      })

      if (!error && data?.user) {
        const token = await createSessionToken(normalizedUser)
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
  }

  return {
    success: false,
    error: 'Usuario o contraseña incorrectos.',
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
