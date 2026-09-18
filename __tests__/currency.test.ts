// __tests__/currency.test.ts
import { describe, it, expect } from 'vitest'
import { convertPrice, formatCurrencyPrice, CURRENCIES } from '@/lib/currency'

describe('Conversión y Formateo de Monedas', () => {
  const mockRates = {
    PEN: 1,
    USD: 0.27,
    EUR: 0.25,
  }

  describe('convertPrice', () => {
    it('mantiene el valor original cuando la moneda destino es PEN', () => {
      expect(convertPrice(100, 'PEN', mockRates)).toBe(100)
    })

    it('convierte correctamente de PEN a USD', () => {
      const converted = convertPrice(100, 'USD', mockRates)
      expect(converted).toBeCloseTo(27, 2)
    })

    it('convierte correctamente de PEN a EUR', () => {
      const converted = convertPrice(200, 'EUR', mockRates)
      expect(converted).toBeCloseTo(50, 2)
    })

    it('usa tasa 1 como fallback si el código de moneda no existe en el mapa de tasas', () => {
      expect(convertPrice(150, 'GBP', mockRates)).toBe(150)
    })
  })

  describe('formatCurrencyPrice', () => {
    it('formatea precio en Soles (PEN) con símbolo S/', () => {
      const formatted = formatCurrencyPrice(120, 'PEN')
      expect(formatted).toContain('120')
      expect(formatted).toMatch(/S\/|PEN/)
    })

    it('formatea precio en Dólares (USD) con símbolo $', () => {
      const formatted = formatCurrencyPrice(50, 'USD')
      expect(formatted).toContain('50')
      expect(formatted).toContain('$')
    })

    it('formatea precio en Euros (EUR) con símbolo €', () => {
      const formatted = formatCurrencyPrice(45, 'EUR')
      expect(formatted).toContain('45')
      expect(formatted).toContain('€')
    })
  })

  describe('CURRENCIES definition', () => {
    it('contiene definiciones para PEN, USD y EUR', () => {
      expect(CURRENCIES.PEN).toBeDefined()
      expect(CURRENCIES.USD).toBeDefined()
      expect(CURRENCIES.EUR).toBeDefined()
      expect(CURRENCIES.PEN.symbol).toBe('S/')
      expect(CURRENCIES.USD.symbol).toBe('$')
      expect(CURRENCIES.EUR.symbol).toBe('€')
    })
  })
})
