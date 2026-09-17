'use client'
// components/currency/CurrencySwitcher.tsx
// Pill-style switcher that lets users toggle between PEN / USD / EUR.

import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { CURRENCIES, type CurrencyCode } from '@/lib/currency'
import { useCurrency } from '@/contexts/CurrencyContext'

const CURRENCY_ORDER: CurrencyCode[] = ['PEN', 'USD', 'EUR']

interface CurrencySwitcherProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function CurrencySwitcher({ className, ...props }: CurrencySwitcherProps) {
  const { currency, setCurrency, isLoading } = useCurrency()

  return (
    <div
      role="group"
      aria-label="Seleccionar moneda"
      className={cn('flex items-center gap-1', className)}
      {...props}
    >
      {CURRENCY_ORDER.map((code) => {
        const def    = CURRENCIES[code]
        const active = currency === code

        return (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            aria-pressed={active}
            aria-label={`Cambiar moneda a ${code}`}
            disabled={isLoading}
            className={cn(
              'px-2.5 py-1 text-xs font-bold rounded transition-colors duration-150',
              active
                ? 'bg-[#0A192F] text-white'
                : 'border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900',
              isLoading && 'opacity-60 cursor-wait',
            )}
          >
            {isLoading && active ? (
              <span className="inline-flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-current border-t-transparent animate-spin"
                  aria-hidden="true"
                />
                {def.symbol}
              </span>
            ) : (
              def.symbol
            )}
          </button>
        )
      })}
    </div>
  )
}
