'use client'
// components/currency/CurrencySwitcher.tsx
// Dropdown button que despliega la lista de monedas disponibles (PEN / USD / EUR).
// Se cierra al hacer clic fuera o al seleccionar una opción.

import { useState, useRef, useEffect, type HTMLAttributes } from 'react'
import { ChevronDown, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CURRENCIES, type CurrencyCode } from '@/lib/currency'
import { useCurrency } from '@/contexts/CurrencyContext'

const CURRENCY_ORDER: CurrencyCode[] = ['PEN', 'USD', 'EUR']

const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  PEN: 'S/ Sol Peruano',
  USD: '$ Dólar USD',
  EUR: '€ Euro',
}

interface CurrencySwitcherProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function CurrencySwitcher({ className, ...props }: CurrencySwitcherProps) {
  const { currency, setCurrency, isLoading } = useCurrency()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const current = CURRENCIES[currency as CurrencyCode]

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Cerrar con Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  return (
    <div ref={containerRef} className={cn('relative', className)} {...props}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Cambiar moneda"
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-semibold transition-colors duration-150',
          'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:text-zinc-900',
          open && 'border-[#0A192F] text-[#0A192F]',
        )}
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin text-zinc-400" aria-hidden="true" />
        ) : (
          <span className="font-bold">{current?.symbol ?? currency}</span>
        )}
        <ChevronDown
          className={cn(
            'w-3 h-3 text-zinc-400 transition-transform duration-150',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Seleccionar moneda"
          className={cn(
            'absolute right-0 top-full mt-1.5 z-50',
            'w-44 bg-white rounded-lg border border-zinc-200 shadow-md py-1',
            'animate-in fade-in-0 zoom-in-95 duration-100',
          )}
        >
          {CURRENCY_ORDER.map((code) => {
            const isActive = currency === code
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setCurrency(code)
                  setOpen(false)
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors duration-100',
                  isActive
                    ? 'text-[#0A192F] bg-zinc-50 font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900',
                )}
              >
                <span>{CURRENCY_LABELS[code]}</span>
                {isActive && (
                  <Check className="w-3.5 h-3.5 text-[#0A192F] shrink-0" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
