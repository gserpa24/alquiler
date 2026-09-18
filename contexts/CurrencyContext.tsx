'use client'
// contexts/CurrencyContext.tsx
// Global state for currency selection and live exchange rates.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { fetchExchangeRates, type CurrencyCode } from '@/lib/currency'

// ── Types ──────────────────────────────────────────────────────────────────

interface CurrencyContextValue {
  /** Currently selected currency code, e.g. 'PEN' */
  currency:    CurrencyCode
  /** Update the selected currency and persist to localStorage */
  setCurrency: (code: CurrencyCode) => void
  /** Rate map keyed by currency code, base = USD */
  rates:       Record<string, number>
  /** True while the initial rate fetch is in-flight */
  isLoading:   boolean
}

// ── Context ────────────────────────────────────────────────────────────────

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

const STORAGE_KEY    = 'autoruta_currency'
const DEFAULT_CURRENCY: CurrencyCode = 'PEN'

// ── Provider ───────────────────────────────────────────────────────────────

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY)
  const [rates,    setRates]         = useState<Record<string, number>>({ PEN: 1, USD: 0.27, EUR: 0.25 })
  const [isLoading, setIsLoading]    = useState(true)

  // Restore persisted selection on mount (client-only)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null
      if (stored && ['PEN', 'USD', 'EUR'].includes(stored)) {
        setCurrencyState(stored)
      }
    } catch {
      // Silently ignore — localStorage may be unavailable
    }
  }, [])

  // Fetch live rates on mount
  useEffect(() => {
    let cancelled = false

    fetchExchangeRates()
      .then((freshRates) => {
        if (!cancelled) setRates(freshRates)
      })
      .catch(() => {
        // Keep default fallback rates — no console.log in production
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code)
    try {
      window.localStorage.setItem(STORAGE_KEY, code)
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
