// lib/validations.ts
import { z } from 'zod'

/** Filtros del catálogo — sincronizados con query params de URL */
export const VehicleFilterSchema = z.object({
  category:     z.enum(['sedan', 'suv', 'pickup_4x4', 'sport']).optional(),
  transmission: z.enum(['automatic', 'manual', 'cvt']).optional(),
  fuel:         z.enum(['gasoline', 'diesel', 'hybrid', 'electric']).optional(),
  status:       z.enum(['available', 'rented', 'maintenance']).optional(),
  seats:        z.coerce.number().int().min(2).max(9).optional(),
  priceMin:     z.coerce.number().min(0).optional(),
  priceMax:     z.coerce.number().max(99999).optional(),
  search:       z.string().max(100).optional(),
  page:         z.coerce.number().int().min(1).default(1),
  limit:        z.coerce.number().int().min(1).max(50).default(12),
}).refine(
  (data) => !data.priceMin || !data.priceMax || data.priceMin <= data.priceMax,
  { message: 'El precio mínimo debe ser ≤ al máximo', path: ['priceMin'] }
)

/** Formulario de contacto con honeypot anti-spam */
export const ContactFormSchema = z.object({
  name:     z.string().min(2, 'Nombre demasiado corto').max(100),
  email:    z.string().email('Dirección de email inválida'),
  phone:    z.string().regex(/^\+?[1-9]\d{7,14}$/, 'Teléfono inválido').optional(),
  subject:  z.enum(['rental', 'purchase', 'maintenance', 'other']).refine(
    (v) => ['rental', 'purchase', 'maintenance', 'other'].includes(v),
    { message: 'Selecciona un asunto válido' }
  ),
  message:  z.string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede superar los 1000 caracteres'),
  honeypot: z.string().max(0).optional(),
})

export type VehicleFilter = z.infer<typeof VehicleFilterSchema>
export type ContactForm   = z.infer<typeof ContactFormSchema>

/** Esquema de validación para Crear / Modificar Vehículos en el Panel Administrativo */
export const AdminVehicleSchema = z.object({
  brand:            z.string().min(2, 'La marca debe tener al menos 2 caracteres').max(50),
  model:            z.string().min(2, 'El modelo debe tener al menos 2 caracteres').max(50),
  year:             z.coerce.number().int().min(2010, 'Año mínimo 2010').max(new Date().getFullYear() + 2, 'Año no válido'),
  category:         z.enum(['sport', 'sedan', 'suv', 'pickup_4x4'], {
    message: 'Selecciona una categoría válida',
  }),
  transmission:     z.enum(['automatic', 'manual', 'cvt'], {
    message: 'Selecciona un tipo de transmisión',
  }),
  fuel:             z.enum(['gasoline', 'diesel', 'hybrid', 'electric'], {
    message: 'Selecciona el tipo de combustible',
  }),
  seats:            z.coerce.number().int().min(2, 'Mínimo 2 plazas').max(9, 'Máximo 9 plazas').default(5),
  luggage:          z.coerce.number().int().min(1).max(8).optional().default(2),
  daily_rate:       z.coerce.number().positive('La tarifa diaria debe ser mayor a 0').max(9999),
  sale_price:       z.coerce.number().min(0).optional().nullable(),
  mileage:          z.coerce.number().int().min(0).optional().default(0),
  color:            z.string().min(2, 'Color requerido').max(50),
  fuel_consumption: z.string().max(50).optional(),
  thumbnail:        z.string().min(5, 'URL o ruta de imagen requerida'),
  images:           z.array(z.string()).default([]),
  features:         z.array(z.string()).default([]),
  description:      z.string().max(1000).optional().nullable(),
  status:           z.enum(['available', 'rented', 'maintenance', 'sold']).default('available'),
  is_featured:      z.boolean().default(false),
  sort_order:       z.coerce.number().int().default(0),
})

export type AdminVehicleInput = z.infer<typeof AdminVehicleSchema>

/** Esquema de validación oficial para Libro de Reclamaciones (Ley N° 29571 y D.S. 011-2011-PCM) */
export const LibroReclamacionSchema = z.object({
  nombreCompleto: z.string().min(3, 'Ingresa tus nombres y apellidos completos').max(120),
  tipoDocumento:  z.enum(['DNI', 'CE', 'PASAPORTE']),
  numeroDocumento: z.string().min(5, 'Documento inválido').max(20),
  telefono:       z.string().min(7, 'Teléfono inválido').max(15),
  email:          z.string().email('Correo electrónico no válido'),
  domicilio:      z.string().min(5, 'Ingresa tu dirección o ciudad'),
  tipoBien:       z.enum(['servicio', 'producto']).default('servicio'),
  montoReclamado: z.string().max(30).optional(),
  descripcionBien: z.string().min(3, 'Especifica el bien o servicio').max(200),
  tipoReclamacion: z.enum(['reclamo', 'queja'], {
    message: 'Selecciona si es Reclamo o Queja',
  }),
  detalleHechos:  z.string().min(15, 'El detalle debe contener al menos 15 caracteres').max(2000),
  pedidoConcreto: z.string().min(5, 'Describe tu pedido concreto al proveedor').max(1000),
  terminosAceptados: z.boolean().refine((v) => v === true, {
    message: 'Debes declarar la veracidad de la información',
  }),
})

export type LibroReclamacionInput = z.infer<typeof LibroReclamacionSchema>
