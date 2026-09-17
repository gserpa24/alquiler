// lib/supabase/queries.ts
// Queries type-safe para la tabla vehicles.
// Si Supabase no está configurado (desarrollo), usa MOCK_VEHICLES.

import { type Vehicle, type VehicleCard, type VehicleStatus } from '@/types/vehicle'
import { type VehicleFilter } from '@/lib/validations'
import {
  MOCK_VEHICLES,
  getMockVehicles,
  findMockVehicleById,
  addMockVehicle,
  updateMockVehicle,
  deleteMockVehicle,
  updateMockVehicleStatus,
} from '@/lib/mock-data'

const IS_MOCK =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('tu-proyecto')

// ── Helpers internos ───────────────────────────────────────────────────────

function applyMockFilters(vehicles: Vehicle[], filters: Partial<VehicleFilter>): Vehicle[] {
  let result = vehicles.filter((v) => v.status !== 'sold')

  if (filters.category)     result = result.filter((v) => v.category     === filters.category)
  if (filters.transmission) result = result.filter((v) => v.transmission === filters.transmission)
  if (filters.fuel)         result = result.filter((v) => v.fuel         === filters.fuel)
  if (filters.status)       result = result.filter((v) => v.status       === filters.status)
  if (filters.seats)        result = result.filter((v) => v.seats        >= (filters.seats ?? 0))
  if (filters.priceMin)     result = result.filter((v) => v.daily_rate !== null && v.daily_rate >= (filters.priceMin ?? 0))
  if (filters.priceMax)     result = result.filter((v) => v.daily_rate !== null && v.daily_rate <= (filters.priceMax ?? 99999))

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (v) => v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q),
    )
  }

  return result
}

// ── Tipos de retorno ───────────────────────────────────────────────────────

export interface GetVehiclesResult {
  vehicles: VehicleCard[]
  total:    number
  page:     number
  limit:    number
  pages:    number
}

// ── Queries públicas ───────────────────────────────────────────────────────

/**
 * Obtiene la lista paginada de vehículos aplicando filtros opcionales.
 * Excluye automáticamente los vehículos con status 'sold'.
 */
export async function getVehicles(
  filters: Partial<VehicleFilter> = {},
): Promise<GetVehiclesResult> {
  const page  = filters.page  ?? 1
  const limit = filters.limit ?? 12

  if (IS_MOCK) {
    const filtered = applyMockFilters(MOCK_VEHICLES, filters)
    const start    = (page - 1) * limit
    const slice    = filtered.slice(start, start + limit)

    return {
      vehicles: slice as VehicleCard[],
      total:    filtered.length,
      page,
      limit,
      pages:    Math.ceil(filtered.length / limit),
    }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  let query = supabase
    .from('vehicles')
    .select(
      'id,slug,brand,model,year,category,transmission,fuel,seats,daily_rate,sale_price,thumbnail,status,is_featured,color',
      { count: 'exact' },
    )
    .neq('status', 'sold')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (filters.category)     query = query.eq('category',     filters.category)
  if (filters.transmission) query = query.eq('transmission', filters.transmission)
  if (filters.fuel)         query = query.eq('fuel',         filters.fuel)
  if (filters.status)       query = query.eq('status',       filters.status)
  if (filters.seats)        query = query.gte('seats',       filters.seats)
  if (filters.priceMin)     query = query.gte('daily_rate',  filters.priceMin)
  if (filters.priceMax)     query = query.lte('daily_rate',  filters.priceMax)
  if (filters.search) {
    const q = filters.search
    query = query.or(`brand.ilike.%${q}%,model.ilike.%${q}%`)
  }

  const { data, error, count } = await query

  if (error) throw new Error(`DB Error en getVehicles: ${error.message}`)

  const total = count ?? 0
  return {
    vehicles: (data ?? []) as VehicleCard[],
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  }
}

/**
 * Obtiene un vehículo completo por slug.
 * Retorna null si no existe o está vendido (RLS lo bloquea en producción).
 */
export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  if (IS_MOCK) {
    return MOCK_VEHICLES.find((v) => v.slug === slug) ?? null
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw new Error(`DB Error en getVehicleBySlug: ${error.message}`)
  }

  return data as Vehicle
}

/**
 * Obtiene los vehículos marcados como destacados para la landing page.
 * Máximo 6 resultados, ordenados por sort_order.
 */
export async function getFeaturedVehicles(limit = 6): Promise<VehicleCard[]> {
  if (IS_MOCK) {
    return MOCK_VEHICLES
      .filter((v) => v.is_featured && v.status !== 'sold')
      .slice(0, limit) as VehicleCard[]
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('vehicles')
    .select('id,slug,brand,model,year,category,transmission,fuel,seats,daily_rate,sale_price,thumbnail,status,is_featured,color')
    .eq('is_featured', true)
    .neq('status', 'sold')
    .order('sort_order', { ascending: true })
    .limit(limit)

  if (error) throw new Error(`DB Error en getFeaturedVehicles: ${error.message}`)
  return (data ?? []) as VehicleCard[]
}

/**
 * Obtiene vehículos similares (misma categoría, distinto slug).
 * Usado en la página de detalle para la sección "También te puede interesar".
 */
export async function getSimilarVehicles(
  category: string,
  excludeSlug: string,
  limit = 3,
): Promise<VehicleCard[]> {
  if (IS_MOCK) {
    return MOCK_VEHICLES
      .filter((v) => v.category === category && v.slug !== excludeSlug && v.status !== 'sold')
      .slice(0, limit) as VehicleCard[]
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('vehicles')
    .select('id,slug,brand,model,year,category,transmission,fuel,seats,daily_rate,sale_price,thumbnail,status,is_featured,color')
    .eq('category', category)
    .neq('slug', excludeSlug)
    .neq('status', 'sold')
    .order('sort_order', { ascending: true })
    .limit(limit)

  if (error) throw new Error(`DB Error en getSimilarVehicles: ${error.message}`)
  return (data ?? []) as VehicleCard[]
}

// ── Queries y Mutaciones del Panel Administrativo ──────────────────────────

async function getAdminDbClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    return createAdminClient()
  }
  const { createClient } = await import('@/lib/supabase/server')
  return await createClient()
}

/**
 * Obtiene todos los vehículos para el panel administrativo,
 * incluyendo vehículos en estado 'sold' o 'maintenance'.
 */
export async function getAllAdminVehicles(): Promise<Vehicle[]> {
  if (IS_MOCK) {
    return getMockVehicles()
  }

  const supabase = await getAdminDbClient()

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`DB Error en getAllAdminVehicles: ${error.message}`)
  return (data ?? []) as Vehicle[]
}

/**
 * Obtiene un vehículo por su ID único (UUID).
 */
export async function getVehicleById(id: string): Promise<Vehicle | null> {
  if (IS_MOCK) {
    return findMockVehicleById(id) ?? null
  }

  const supabase = await getAdminDbClient()

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`DB Error en getVehicleById: ${error.message}`)
  }

  return data as Vehicle
}

/**
 * Inserta un nuevo vehículo en la base de datos o almacén.
 */
export async function createVehicle(vehicle: Vehicle): Promise<Vehicle> {
  if (IS_MOCK) {
    return addMockVehicle(vehicle)
  }

  const supabase = await getAdminDbClient()

  const { data, error } = await supabase
    .from('vehicles')
    .insert(vehicle)
    .select()
    .single()

  if (error) throw new Error(`DB Error en createVehicle: ${error.message}`)
  return data as Vehicle
}

/**
 * Modifica los datos de un vehículo existente.
 */
export async function updateVehicle(
  id: string,
  updates: Partial<Vehicle>,
): Promise<Vehicle | null> {
  if (IS_MOCK) {
    return updateMockVehicle(id, updates)
  }

  const supabase = await getAdminDbClient()

  const { data, error } = await supabase
    .from('vehicles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`DB Error en updateVehicle: ${error.message}`)
  return data as Vehicle
}

/**
 * Actualiza el estado manual de disponibilidad de un vehículo.
 */
export async function updateVehicleStatus(
  id: string,
  status: VehicleStatus,
): Promise<Vehicle | null> {
  if (IS_MOCK) {
    return updateMockVehicleStatus(id, status)
  }

  return updateVehicle(id, { status })
}

/**
 * Elimina un vehículo por su ID.
 */
export async function deleteVehicle(id: string): Promise<boolean> {
  if (IS_MOCK) {
    return deleteMockVehicle(id)
  }

  const supabase = await getAdminDbClient()

  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`DB Error en deleteVehicle: ${error.message}`)
  return true
}

