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
  getVehicleById,
  updateVehiclesOrder,
} from '@/lib/supabase/queries'
import { deleteStorageFiles } from '@/lib/supabase/storage'
import { requireAdminSession } from '@/lib/auth/guard'
import { type Vehicle, type VehicleStatus } from '@/types/vehicle'
import { slugify } from '@/lib/utils'

export interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/** Helper para construir un slug amigable y único a partir de marca, modelo, año y color */
function buildSlug(brand: string, model: string, year: number, color?: string | null): string {
  const base = slugify(`${brand} ${model} ${year} ${color ?? ''}`.trim())
  return base || `auto-${Date.now()}`
}

/**
 * Server Action: Crea un nuevo vehículo en el catálogo.
 */
export async function createVehicleAction(
  rawData: AdminVehicleInput
): Promise<ActionResult<Vehicle>> {
  try {
    await requireAdminSession()

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
      daily_rate: data.daily_rate,
      sale_price: data.sale_price ?? null,
      mileage: data.mileage ?? 0,
      color: data.color,
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
    await requireAdminSession()

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
      daily_rate: data.daily_rate,
      sale_price: data.sale_price ?? null,
      mileage: data.mileage ?? 0,
      color: data.color,
      thumbnail: data.thumbnail,
      images: data.images?.length > 0 ? data.images : [data.thumbnail],
      features: data.features,
      description: data.description,
      status: data.status,
      is_featured: data.is_featured,
      sort_order: data.sort_order,
    }

    const oldVehicle = await getVehicleById(id)
    const updated = await updateVehicle(id, updates)
    if (!updated) {
      return { success: false, error: 'Vehículo no encontrado para actualizar' }
    }

    // Limpiar de Supabase Storage las fotos que hayan sido retiradas en la edición
    if (oldVehicle) {
      const oldPhotos = new Set([oldVehicle.thumbnail, ...(oldVehicle.images || [])].filter(Boolean))
      const newPhotos = new Set([updated.thumbnail, ...(updated.images || [])].filter(Boolean))
      const removedPhotos = Array.from(oldPhotos).filter((photo) => !newPhotos.has(photo))
      if (removedPhotos.length > 0) {
        await deleteStorageFiles(removedPhotos)
      }
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
    await requireAdminSession()

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
 * Server Action: Elimina un vehículo por su ID y limpia todas sus fotos asociadas en Supabase Storage (S3).
 */
export async function deleteVehicleAction(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdminSession()

    // 1. Obtener la información del vehículo para identificar sus fotos
    const vehicle = await getVehicleById(id)

    // 2. Eliminar el registro en la base de datos
    const ok = await deleteVehicle(id)
    if (!ok) {
      return { success: false, error: 'No se pudo eliminar el vehículo' }
    }

    // 3. Eliminar fotos asociadas del bucket de Supabase Storage (S3)
    if (vehicle) {
      const photosToDelete = Array.from(
        new Set([vehicle.thumbnail, ...(vehicle.images || [])].filter(Boolean))
      )
      if (photosToDelete.length > 0) {
        await deleteStorageFiles(photosToDelete)
      }
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

/**
 * Server Action: Elimina un archivo individual de Supabase Storage si se retira del carrete de fotos.
 */
export async function deleteStorageFileAction(url: string): Promise<ActionResult<{ url: string }>> {
  try {
    await requireAdminSession()

    if (!url) return { success: true }
    await deleteStorageFiles([url])
    return { success: true, data: { url } }
  } catch (err) {
    console.error('[deleteStorageFileAction Error]:', err)
    return { success: false, error: 'Error al eliminar la foto' }
  }
}

/**
 * Server Action: Reorganiza el orden de aparición de los vehículos en el catálogo.
 */
export async function reorderVehiclesAction(
  orderedIds: string[]
): Promise<ActionResult> {
  try {
    await requireAdminSession()

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return { success: false, error: 'Lista de vehículos no válida para reordenar' }
    }

    const items = orderedIds.map((id, index) => ({
      id,
      sort_order: index + 1,
    }))

    const ok = await updateVehiclesOrder(items)
    if (!ok) {
      return { success: false, error: 'No se pudo guardar el orden de los vehículos' }
    }

    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath('/admin')
    revalidatePath('/admin/vehicles')

    return { success: true }
  } catch (err) {
    console.error('[reorderVehiclesAction Error]:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error inesperado al reordenar vehículos',
    }
  }
}
