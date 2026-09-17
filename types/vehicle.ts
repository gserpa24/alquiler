// types/vehicle.ts

export type VehicleCategory   = 'sedan' | 'suv' | 'pickup_4x4' | 'sport'
export type FuelType          = 'gasoline' | 'diesel' | 'hybrid' | 'electric'
export type TransmissionType  = 'automatic' | 'manual' | 'cvt'
export type VehicleStatus     = 'available' | 'rented' | 'maintenance' | 'sold'

export interface Vehicle {
  id:                string
  slug:              string
  brand:             string
  model:             string
  year:              number
  category:          VehicleCategory
  transmission:      TransmissionType
  fuel:              FuelType
  seats:             number
  daily_rate:        number | null
  sale_price:        number | null
  mileage:           number
  color:             string | null
  features:          string[]
  images:            string[]
  thumbnail:         string
  description:       string | null
  status:            VehicleStatus
  is_featured:       boolean
  sort_order:        number
  created_at:        string
  updated_at:        string
}

/** Subset de campos para tarjetas del catálogo */
export type VehicleCard = Pick<
  Vehicle,
  | 'id' | 'slug' | 'brand' | 'model' | 'year'
  | 'category' | 'transmission' | 'fuel' | 'seats'
  | 'daily_rate' | 'sale_price' | 'thumbnail'
  | 'status' | 'is_featured' | 'color'
>

/** Labels legibles para UI */
export const CATEGORY_LABELS: Record<VehicleCategory, string> = {
  sport:      'Compacto',
  sedan:      'Sedán',
  suv:        'SUV',
  pickup_4x4: 'Camioneta',
}

export const FUEL_LABELS: Record<FuelType, string> = {
  gasoline: 'Gasolina',
  diesel:   'Diésel',
  hybrid:   'Híbrido',
  electric: 'Eléctrico',
}

export const TRANSMISSION_LABELS: Record<TransmissionType, string> = {
  automatic: 'Automático',
  manual:    'Manual',
  cvt:       'CVT',
}

export const STATUS_LABELS: Record<VehicleStatus, string> = {
  available:   'Disponible',
  rented:      'Ocupado',
  maintenance: 'En mantenimiento',
  sold:        'Vendido',
}
