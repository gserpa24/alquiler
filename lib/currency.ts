// lib/currency.ts
// Core currency logic: definitions, exchange-rate fetching (with cache), conversion, formatting.

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

const CACHE_KEY = 'autoruta_fx_rates'
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
 * Fetches live exchange rates with USD as the base currency.
 * Returns a map like `{ PEN: 3.72, USD: 1, EUR: 0.92 }`.
 * Results are cached in localStorage for 1 hour.
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
  const cached = readCache()
  if (cached) return cached.rates

  const res = await fetch('https://open.er-api.com/v6/latest/USD')
  if (!res.ok) throw new Error(`ExchangeRate API error: ${res.status}`)

  const data = await res.json() as { rates: Record<string, number> }
  const rates: Record<string, number> = {
    USD: 1,
    PEN: data.rates['PEN'] ?? 3.72,
    EUR: data.rates['EUR'] ?? 0.92,
  }

  writeCache(rates)
  return rates
}

// ── Conversion & formatting ────────────────────────────────────────────────

/**
 * Converts an amount stored in USD to the target currency using live rates.
 * @param amountUSD  - Original price in USD
 * @param targetCode - Target currency code (PEN | USD | EUR)
 * @param rates      - Rate map as returned by fetchExchangeRates()
 */
export function convertPrice(
  amountUSD: number,
  targetCode: string,
  rates: Record<string, number>,
): number {
  const rate = rates[targetCode] ?? 1
  return amountUSD * rate
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
