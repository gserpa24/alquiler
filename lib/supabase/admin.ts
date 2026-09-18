// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase de administración para entornos de servidor (Server Actions, APIs).
 * Usa SUPABASE_SERVICE_ROLE_KEY para realizar operaciones con permisos elevados (bypassing RLS).
 * 
 * NUNCA exponer este cliente o la clave de servicio en el frontend/navegador.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Supabase URL no está configurada')
  }

  // En producción es estrictamente mandatorio contar con SUPABASE_SERVICE_ROLE_KEY para operaciones de administración
  const key =
    serviceRoleKey ||
    (process.env.NODE_ENV !== 'production'
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
      : undefined)

  if (!key) {
    throw new Error('Seguridad crítica: SUPABASE_SERVICE_ROLE_KEY no está configurada para operaciones administrativas')
  }

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
