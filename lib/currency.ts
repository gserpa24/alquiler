// lib/currency.ts
// Core currency logic: definitions, exchange-rate fetching (with cache), conversion, formatting.
// La moneda base almacenada en el catálogo y base de datos es PEN (Soles).

/** Supported currency codes */
export type CurrencyCode = 'PEN' | 'USD' | 'EUR'

export interface CurrencyDef {
  code:   CurrencyCode
  symbol: string
  locale: string
}

/** Human-readable currency definitions */
export const CURRENCIES: Record<CurrencyCode, CurrencyDef> = {
  PEN: { code: 'PEN', symbol: 'S/',  locale: 'es-PE' },
  USD: { code: 'USD', symbol: '$',   locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€',   locale: 'de-DE' },
}

// ── localStorage cache ─────────────────────────────────────────────────────

const CACHE_KEY = 'autoruta_fx_rates_pen_v1'
const CACHE_TTL = 60 * 60 * 1_000 // 1 hour in ms

interface RatesCache {
  rates: Record<string, number>
  ts:    number
}

function readCache(): RatesCache | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as RatesCache
    if (Date.now() - parsed.ts < CACHE_TTL) return parsed
    return null
  } catch {
    return null
  }
}

function writeCache(rates: Record<string, number>): void {
  if (typeof window === 'undefined') return
  try {
    const entry: RatesCache = { rates, ts: Date.now() }
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // Storage quota exceeded or private mode — ignore silently
  }
}

// ── Exchange-rate fetch ────────────────────────────────────────────────────

/**
 * Fetches live exchange rates with PEN (Soles) as the base currency.
 * Returns a map like `{ PEN: 1, USD: 0.27, EUR: 0.25 }`.
 * Results are cached in localStorage for 1 hour.
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
  const cached = readCache()
  if (cached) return cached.rates

  const res = await fetch('https://open.er-api.com/v6/latest/PEN')
  if (!res.ok) throw new Error(`ExchangeRate API error: ${res.status}`)

  const data = await res.json() as { rates: Record<string, number> }
  const rates: Record<string, number> = {
    PEN: 1,
    USD: data.rates['USD'] ?? 0.27,
    EUR: data.rates['EUR'] ?? 0.25,
  }

  writeCache(rates)
  return rates
}

// ── Conversion & formatting ────────────────────────────────────────────────

/**
 * Converts an amount stored in PEN (Soles) to the target currency using live rates.
 * @param amountPEN  - Original price in PEN (Soles)
 * @param targetCode - Target currency code (PEN | USD | EUR)
 * @param rates      - Rate map as returned by fetchExchangeRates()
 */
export function convertPrice(
  amountPEN: number,
  targetCode: string,
  rates: Record<string, number>,
): number {
  if (targetCode === 'PEN') return amountPEN
  const rate = rates[targetCode] ?? 1
  return amountPEN * rate
}

/**
 * Formats a numeric amount for the given currency with proper locale and symbol.
 * @param amount   - Already-converted price
 * @param currency - Currency code string (PEN | USD | EUR)
 */
export function formatCurrencyPrice(amount: number, currency: string): string {
  const def = CURRENCIES[currency as CurrencyCode]
  const locale = def?.locale ?? 'es-PE'
  return new Intl.NumberFormat(locale, {
    style:                'currency',
    currency:             currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
