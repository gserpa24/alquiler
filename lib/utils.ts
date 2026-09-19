// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { formatCurrencyPrice } from '@/lib/currency'

/**
 * Combina clases de Tailwind resolviendo conflictos con tailwind-merge.
 * Uso: cn('px-4 py-2', isActive && 'bg-gold', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un precio numérico como string con símbolo de moneda delegando
 * al motor centralizado de divisas en lib/currency.ts.
 * @example formatPrice(150) → 'S/ 150'
 * @example formatPrice(50, 'USD') → '$ 50'
 */
export function formatPrice(amount: number, currency = 'PEN'): string {
  return formatCurrencyPrice(amount, currency)
}

/**
 * Formatea kilómetros con separador de miles.
 * @example formatMileage(45000) → '45,000 km'
 */
export function formatMileage(km: number): string {
  return `${new Intl.NumberFormat('es-EC').format(km)} km`
}

/**
 * Convierte un string a slug URL-friendly.
 * @example slugify('Toyota Hilux 2024') → 'toyota-hilux-2024'
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Trunca un texto a un máximo de caracteres añadiendo '…'.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/**
 * Formatea una fecha según el estándar local es-PE con zona horaria Perú.
 * @example formatDate('2024-05-10T12:00:00Z') → '10 de mayo de 2024'
 */
export function formatDate(
  date: string | Date | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Lima',
    ...options,
  }

  return new Intl.DateTimeFormat('es-PE', defaultOptions).format(d)
}
