// lib/auth/guard.ts
// Guardias de autorización de servidor para Server Actions y Server Components.

import { cookies } from 'next/headers'
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session'

export interface AdminSession {
  authenticated: boolean
  email?: string
}

/**
 * Obtiene el estado de la sesión de administrador actual.
 */
export async function getAdminSession(): Promise<AdminSession> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    const result = await verifySessionToken(token)

    if (!result.valid) {
      return { authenticated: false }
    }

    return { authenticated: true, email: result.email }
  } catch {
    return { authenticated: false }
  }
}

/**
 * Exige una sesión de administrador activa. Lanza excepción si la sesión no es válida.
 */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session.authenticated) {
    throw new Error('No autorizado: se requiere sesión de administrador.')
  }
  return session
}
