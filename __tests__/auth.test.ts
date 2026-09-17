// __tests__/auth.test.ts
import { describe, it, expect } from 'vitest'
import { createSessionToken, verifySessionToken } from '@/lib/auth/session'

describe('Sistema de Sesiones Administrativas', () => {
  it('genera y verifica un token de sesión legítimo para el usuario percyman', async () => {
    const username = 'percyman'
    const token = await createSessionToken(username)

    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
    expect(token.includes('.')).toBe(true)

    const verification = await verifySessionToken(token)
    expect(verification.valid).toBe(true)
    expect(verification.email).toBe(username)
  })

  it('rechaza un token nulo, vacío o con formato inválido', async () => {
    expect((await verifySessionToken(null)).valid).toBe(false)
    expect((await verifySessionToken('')).valid).toBe(false)
    expect((await verifySessionToken('token-invalido-sin-firma')).valid).toBe(false)
  })

  it('rechaza un token con firma manipulada', async () => {
    const token = await createSessionToken('percyman')
    const [payload, signature] = token.split('.')

    // Manipulamos la firma
    const tamperedSignature = signature.replace(/^[a-f0-9]/, 'x')
    const tamperedToken = `${payload}.${tamperedSignature}`

    const verification = await verifySessionToken(tamperedToken)
    expect(verification.valid).toBe(false)
  })

  it('rechaza un token cuyo contenido fue alterado', async () => {
    const token = await createSessionToken('percyman')
    const [, signature] = token.split('.')

    // Manipulamos el payload
    const fakePayload = Buffer.from(
      JSON.stringify({ email: 'hacker@malicious.com', expiresAt: Date.now() + 100000 })
    ).toString('base64url')

    const tamperedToken = `${fakePayload}.${signature}`
    const verification = await verifySessionToken(tamperedToken)
    expect(verification.valid).toBe(false)
  })
})
