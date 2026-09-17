// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de Tailwind resolviendo conflictos con tailwind-merge.
 * Uso: cn('px-4 py-2', isActive && 'bg-gold', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un precio numérico como string con símbolo de moneda.
 * @example formatPrice(1500) → '$1,500.00'
 */
export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-EC', {
    style:    'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
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
