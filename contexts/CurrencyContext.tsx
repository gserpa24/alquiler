'use client'
// contexts/CurrencyContext.tsx
// Global state for currency selection and live exchange rates.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { fetchExchangeRates, type CurrencyCode } from '@/lib/currency'

// ── Types ──────────────────────────────────────────────────────────────────

interface CurrencyContextValue {
  /** Currently selected currency code, e.g. 'PEN' */
  currency:    CurrencyCode
  /** Update the selected currency and persist to localStorage */
  setCurrency: (code: CurrencyCode) => void
  /** Rate map keyed by currency code, base = PEN */
  rates:       Record<string, number>
  /** True while the initial rate fetch is in-flight */
  isLoading:   boolean
}

// ── Context ────────────────────────────────────────────────────────────────

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

const STORAGE_KEY    = 'autoruta_currency'
const DEFAULT_CURRENCY: CurrencyCode = 'PEN'

// ── localStorage subscription for React 19 external store ───────────────────

function subscribeCurrency(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('storage', callback)
  window.addEventListener('autoruta_currency_change', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('autoruta_currency_change', callback)
  }
}

function getCurrencySnapshot(): CurrencyCode {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null
    if (stored && ['PEN', 'USD', 'EUR'].includes(stored)) {
      return stored
    }
  } catch {
    // Silently ignore
  }
  return DEFAULT_CURRENCY
}

function getCurrencyServerSnapshot(): CurrencyCode {
  return DEFAULT_CURRENCY
}

// ── Provider ───────────────────────────────────────────────────────────────

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const currency = useSyncExternalStore(
    subscribeCurrency,
    getCurrencySnapshot,
    getCurrencyServerSnapshot
  )
  const [rates,     setRates]     = useState<Record<string, number>>({ PEN: 1, USD: 0.27, EUR: 0.25 })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch live rates on mount
  useEffect(() => {
    let cancelled = false

    fetchExchangeRates()
      .then((freshRates) => {
        if (!cancelled) setRates(freshRates)
      })
      .catch(() => {
        // Keep default fallback rates
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const setCurrency = useCallback((code: CurrencyCode) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, code)
      window.dispatchEvent(new Event('autoruta_currency_change'))
    } catch {
      // Silently ignore
    }
  }, [])

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────

/**
 * Consume the CurrencyContext.
 * @throws if called outside <CurrencyProvider>
 */
export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used inside <CurrencyProvider>')
  return ctx
}
