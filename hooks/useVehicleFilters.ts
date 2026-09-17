'use client'
// hooks/useVehicleFilters.ts
// Gestiona los filtros del catálogo sincronizados con la URL (searchParams).
// Al cambiar un filtro, actualiza la URL sin page reload y resetea la página.

import { useCallback, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { type VehicleFilter } from '@/lib/validations'

type FilterKey = keyof Omit<VehicleFilter, 'page' | 'limit'>
type FilterValue = string | number | undefined

/**
 * Hook que sincroniza los filtros del catálogo con los query params de la URL.
 * Permite leer el estado actual y actualizarlo sin recargar la página.
 */
export function useVehicleFilters() {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()

  /** Filtros actuales leídos desde la URL */
  const filters = useMemo<Partial<VehicleFilter>>(() => ({
    category:     (searchParams.get('category')     as VehicleFilter['category'])     ?? undefined,
    transmission: (searchParams.get('transmission') as VehicleFilter['transmission']) ?? undefined,
    fuel:         (searchParams.get('fuel')         as VehicleFilter['fuel'])         ?? undefined,
    status:       (searchParams.get('status')       as VehicleFilter['status'])       ?? undefined,
    seats:        searchParams.get('seats')    ? Number(searchParams.get('seats'))    : undefined,
    priceMin:     searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax:     searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    search:       searchParams.get('search')   ?? undefined,
    page:         searchParams.get('page')     ? Number(searchParams.get('page'))     : 1,
    limit:        12,
  }), [searchParams])

  /** Cuenta cuántos filtros activos hay (excluyendo page y limit) */
  const activeCount = useMemo(() => {
    const keys: FilterKey[] = ['category', 'transmission', 'fuel', 'status', 'seats', 'priceMin', 'priceMax', 'search']
    return keys.filter((k) => filters[k] !== undefined).length
  }, [filters])

  /**
   * Actualiza un filtro en la URL y resetea la página a 1.
   * Si el valor es undefined o vacío, elimina el param.
   */
  const setFilter = useCallback((key: FilterKey, value: FilterValue) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === undefined || value === '' || value === null) {
      params.delete(key)
    } else {
      params.set(key, String(value))
    }
    // Siempre resetea a página 1 al cambiar un filtro
    params.delete('page')

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  /** Cambia la página manteniendo los filtros actuales */
  const setPage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', String(page))
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: true })
  }, [router, pathname, searchParams])

  /** Limpia todos los filtros y vuelve a la primera página */
  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  return { filters, activeCount, setFilter, setPage, clearFilters }
}
