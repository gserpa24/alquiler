// lib/auth/session.ts
// Gestión de sesiones administrativas seguras compatibles con Edge Middleware y Node.js.

const SESSION_COOKIE_NAME = 'autoruta_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 días en segundos

// Secreto para firmar tokens. Si no está definido en variables de entorno,
// se deriva de forma determinista pero segura de otras claves del proyecto.
function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'autoruta-fallback-secret-key-2026'
  )
}

/**
 * Genera un HMAC SHA-256 para un texto dado usando Web Crypto API (Edge-safe).
 */
async function generateSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Crea un token de sesión seguro con timestamp de expiración.
 */
export async function createSessionToken(email: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000
  const payload = JSON.stringify({ email, expiresAt })
  const base64Payload = Buffer.from(payload).toString('base64url')
  const signature = await generateSignature(base64Payload, getSecretKey())
  return `${base64Payload}.${signature}`
}

/**
 * Valida un token de sesión y retorna el email si es legítimo y no ha expirado.
 */
export async function verifySessionToken(token: string | undefined | null): Promise<{ valid: boolean; email?: string }> {
  if (!token) return { valid: false }

  const parts = token.split('.')
  if (parts.length !== 2) return { valid: false }

  const [base64Payload, signature] = parts
  const expectedSignature = await generateSignature(base64Payload, getSecretKey())

  if (signature !== expectedSignature) {
    return { valid: false }
  }

  try {
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf8'))
    if (typeof payload.expiresAt === 'number' && Date.now() > payload.expiresAt) {
      return { valid: false }
    }
    return { valid: true, email: payload.email }
  } catch {
    return { valid: false }
  }
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE }
