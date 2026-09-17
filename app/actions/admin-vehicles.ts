'use server'

// app/actions/admin-vehicles.ts
// Server Actions para el CRUD del Panel Administrativo de Vehículos.
// Valida entradas con Zod, ejecuta la persistencia y revalida la caché de Next.js.

import { revalidatePath } from 'next/cache'
import { AdminVehicleSchema, type AdminVehicleInput } from '@/lib/validations'
import {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  updateVehicleStatus,
} from '@/lib/supabase/queries'
import { type Vehicle, type VehicleStatus } from '@/types/vehicle'

export interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/** Helper para construir un slug amigable y único a partir de marca, modelo, año y color */
function buildSlug(brand: string, model: string, year: number, color?: string | null): string {
  const base = `${brand} ${model} ${year} ${color ?? ''}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[^a-z0-9]+/g, '-')     // Reemplazar caracteres especiales por guiones
    .replace(/^-+|-+$/g, '')         // Trim de guiones

  return base || `auto-${Date.now()}`
}

/**
 * Server Action: Crea un nuevo vehículo en el catálogo.
 */
export async function createVehicleAction(
  rawData: AdminVehicleInput
): Promise<ActionResult<Vehicle>> {
  try {
    const validated = AdminVehicleSchema.safeParse(rawData)
    if (!validated.success) {
      const issue = validated.error.issues[0]?.message ?? 'Datos inválidos'
      return { success: false, error: issue }
    }

    const data = validated.data
    const slug = buildSlug(data.brand, data.model, data.year, data.color)

    const newVehicle: Vehicle = {
      id: crypto.randomUUID(),
      slug,
      brand: data.brand,
      model: data.model,
      year: data.year,
      category: data.category,
      transmission: data.transmission,
      fuel: data.fuel,
      seats: data.seats,
      luggage: data.luggage,
      daily_rate: data.daily_rate,
      sale_price: data.sale_price ?? null,
      mileage: data.mileage,
      color: data.color,
      fuel_consumption: data.fuel_consumption ?? '16.0 km/l',
      thumbnail: data.thumbnail,
      images: data.images?.length > 0 ? data.images : [data.thumbnail],
      features: data.features ?? [],
      description: data.description ?? null,
      status: data.status,
      is_featured: data.is_featured,
      sort_order: data.sort_order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const created = await createVehicle(newVehicle)

    // Revalidar cachés de rutas públicas y administrativas
    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath(`/catalog/${slug}`)
    revalidatePath('/admin')
    revalidatePath('/admin/vehicles')

    return { success: true, data: created }
  } catch (err) {
    console.error('[createVehicleAction Error]:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error inesperado al crear el vehículo',
    }
  }
}

/**
 * Server Action: Modifica un vehículo existente.
 */
export async function updateVehicleAction(
  id: string,
  rawData: AdminVehicleInput
): Promise<ActionResult<Vehicle>> {
  try {
    const validated = AdminVehicleSchema.safeParse(rawData)
    if (!validated.success) {
      const issue = validated.error.issues[0]?.message ?? 'Datos inválidos'
      return { success: false, error: issue }
    }

    const data = validated.data
    const updates: Partial<Vehicle> = {
      brand: data.brand,
      model: data.model,
      year: data.year,
      category: data.category,
      transmission: data.transmission,
      fuel: data.fuel,
      seats: data.seats,
      luggage: data.luggage,
      daily_rate: data.daily_rate,
      sale_price: data.sale_price ?? null,
      mileage: data.mileage,
      color: data.color,
      fuel_consumption: data.fuel_consumption,
      thumbnail: data.thumbnail,
      images: data.images?.length > 0 ? data.images : [data.thumbnail],
      features: data.features,
      description: data.description,
      status: data.status,
      is_featured: data.is_featured,
      sort_order: data.sort_order,
    }

    const updated = await updateVehicle(id, updates)
    if (!updated) {
      return { success: false, error: 'Vehículo no encontrado para actualizar' }
    }

    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath(`/catalog/${updated.slug}`)
    revalidatePath('/admin')
    revalidatePath('/admin/vehicles')

    return { success: true, data: updated }
  } catch (err) {
    console.error('[updateVehicleAction Error]:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error inesperado al actualizar el vehículo',
    }
  }
}

/**
 * Server Action: Conmutación rápida de estado de disponibilidad desde la tabla.
 */
export async function updateVehicleStatusAction(
  id: string,
  status: VehicleStatus
): Promise<ActionResult<{ id: string; status: VehicleStatus }>> {
  try {
    const updated = await updateVehicleStatus(id, status)
    if (!updated) {
      return { success: false, error: 'Vehículo no encontrado' }
    }

    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath(`/catalog/${updated.slug}`)
    revalidatePath('/admin')
    revalidatePath('/admin/vehicles')

    return { success: true, data: { id, status } }
  } catch (err) {
    console.error('[updateVehicleStatusAction Error]:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error al cambiar la disponibilidad',
    }
  }
}

/**
 * Server Action: Elimina un vehículo por su ID.
 */
export async function deleteVehicleAction(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const ok = await deleteVehicle(id)
    if (!ok) {
      return { success: false, error: 'No se pudo eliminar el vehículo' }
    }

    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath('/admin')
    revalidatePath('/admin/vehicles')

    return { success: true, data: { id } }
  } catch (err) {
    console.error('[deleteVehicleAction Error]:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error inesperado al eliminar el vehículo',
    }
  }
}
