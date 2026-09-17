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

  // Si hay service_role_key, usarla. Si no (ej. desarrollo sin service key), usar anon_key
  const key = serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!key) {
    throw new Error('Supabase Key (SERVICE_ROLE_KEY o ANON_KEY) no está configurada')
  }

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
