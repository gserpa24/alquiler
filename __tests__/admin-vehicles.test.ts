// __tests__/admin-vehicles.test.ts
import { describe, it, expect, vi } from 'vitest'
import { AdminVehicleSchema } from '@/lib/validations'
import {
  createVehicleAction,
  updateVehicleAction,
  updateVehicleStatusAction,
  deleteVehicleAction,
} from '@/app/actions/admin-vehicles'
import { getVehicleById } from '@/lib/supabase/queries'

// Mock de next/cache revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('AdminVehicleSchema', () => {
  const validVehicle = {
    brand: 'Nissan',
    model: 'Versa Sense',
    year: 2024,
    category: 'sedan',
    transmission: 'manual',
    fuel: 'gasoline',
    seats: 5,
    daily_rate: 34,
    color: 'Gris Grafito',
    thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',
    status: 'available',
  }

  it('valida exitosamente un vehículo cotidiano correcto', () => {
    const result = AdminVehicleSchema.safeParse(validVehicle)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.brand).toBe('Nissan')
      expect(result.data.seats).toBe(5)
      expect(result.data.daily_rate).toBe(34)
      expect(result.data.status).toBe('available')
    }
  })

  it('aplica valores por defecto de plazas si se omiten', () => {
    const { seats: _, status: ___, ...withoutDefaults } = validVehicle
    const result = AdminVehicleSchema.safeParse(withoutDefaults)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.seats).toBe(5)
      expect(result.data.status).toBe('available')
      expect(result.data.is_featured).toBe(false)
    }
  })

  it('rechaza marca menor a 2 caracteres', () => {
    const result = AdminVehicleSchema.safeParse({ ...validVehicle, brand: 'A' })
    expect(result.success).toBe(false)
  })

  it('rechaza tarifa diaria igual a cero o negativa', () => {
    const resZero = AdminVehicleSchema.safeParse({ ...validVehicle, daily_rate: 0 })
    expect(resZero.success).toBe(false)

    const resNeg = AdminVehicleSchema.safeParse({ ...validVehicle, daily_rate: -10 })
    expect(resNeg.success).toBe(false)
  })

  it('rechaza año inferior a 2010', () => {
    const result = AdminVehicleSchema.safeParse({ ...validVehicle, year: 2005 })
    expect(result.success).toBe(false)
  })

  it('rechaza categoría no existente en el catálogo', () => {
    const result = AdminVehicleSchema.safeParse({ ...validVehicle, category: 'hypercar_invalido' })
    expect(result.success).toBe(false)
  })
})

describe('CRUD Server Actions de Vehículos', () => {
  let createdVehicleId: string

  it('createVehicleAction crea un nuevo auto y genera slug correcto', async () => {
    const res = await createVehicleAction({
      brand: 'Kia',
      model: 'Rio 5 Test',
      year: 2024,
      category: 'sport',
      transmission: 'automatic',
      fuel: 'gasoline',
      seats: 5,
      daily_rate: 32,
      color: 'Azul Marino',
      thumbnail: 'https://images.unsplash.com/photo-example',
      status: 'available',
      is_featured: true,
      features: ['Bluetooth', 'Aire'],
      sort_order: 1,
      images: [],
      sale_price: null,
      mileage: 5000,
      description: 'Auto de prueba',
    })

    expect(res.success).toBe(true)
    expect(res.data).toBeDefined()
    if (res.data) {
      createdVehicleId = res.data.id
      expect(res.data.brand).toBe('Kia')
      expect(res.data.slug).toContain('kia-rio-5-test-2024-azul-marino')
      expect(res.data.daily_rate).toBe(32)
      expect(res.data.status).toBe('available')
    }
  })

  it('updateVehicleStatusAction conmuta el estado a rented', async () => {
    expect(createdVehicleId).toBeDefined()
    const res = await updateVehicleStatusAction(createdVehicleId, 'rented')
    expect(res.success).toBe(true)

    const vehicle = await getVehicleById(createdVehicleId)
    expect(vehicle?.status).toBe('rented')
  })

  it('updateVehicleAction modifica la tarifa diaria', async () => {
    expect(createdVehicleId).toBeDefined()
    const res = await updateVehicleAction(createdVehicleId, {
      brand: 'Kia',
      model: 'Rio 5 Test',
      year: 2024,
      category: 'sport',
      transmission: 'automatic',
      fuel: 'gasoline',
      seats: 5,
      daily_rate: 38, // Tarifa modificada de 32 a 38
      color: 'Azul Marino',
      thumbnail: 'https://images.unsplash.com/photo-example',
      status: 'rented',
      is_featured: false,
      features: ['Bluetooth', 'Aire'],
      sort_order: 1,
      images: [],
      sale_price: null,
      mileage: 5000,
      description: 'Auto de prueba actualizado',
    })

    expect(res.success).toBe(true)
    const vehicle = await getVehicleById(createdVehicleId)
    expect(vehicle?.daily_rate).toBe(38)
  })

  it('deleteVehicleAction elimina el vehículo del catálogo', async () => {
    expect(createdVehicleId).toBeDefined()
    const res = await deleteVehicleAction(createdVehicleId)
    expect(res.success).toBe(true)

    const vehicle = await getVehicleById(createdVehicleId)
    expect(vehicle).toBeNull()
  })
})
