// __tests__/complaint.test.ts
import { describe, it, expect, vi } from 'vitest'
import { LibroReclamacionSchema } from '@/lib/validations'
import { submitComplaintAction } from '@/app/actions/complaint-actions'

// Mock de persistencia de mensajes
vi.mock('@/lib/supabase/messages', () => ({
  saveContactMessage: vi.fn().mockResolvedValue({ id: 'mock-id' }),
}))

describe('Libro de Reclamaciones', () => {
  const validComplaint = {
    nombreCompleto: 'Carlos Mendoza Ramos',
    tipoDocumento: 'DNI' as const,
    numeroDocumento: '74829103',
    telefono: '987654321',
    email: 'carlos.mendoza@gmail.com',
    domicilio: 'Av. Las Palmeras 450, Tarapoto',
    tipoBien: 'servicio' as const,
    montoReclamado: '150.00',
    descripcionBien: 'Alquiler de Toyota Hilux por fin de semana',
    tipoReclamacion: 'reclamo' as const,
    detalleHechos: 'El vehículo presentó un retraso en la entrega de más de dos horas según lo pactado.',
    pedidoConcreto: 'Solicito la devolución parcial correspondiente al tiempo no disfrutado del servicio.',
    terminosAceptados: true,
  }

  describe('LibroReclamacionSchema', () => {
    it('valida exitosamente una reclamación conforme a Ley N° 29571', () => {
      const result = LibroReclamacionSchema.safeParse(validComplaint)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.nombreCompleto).toBe('Carlos Mendoza Ramos')
        expect(result.data.tipoDocumento).toBe('DNI')
        expect(result.data.tipoReclamacion).toBe('reclamo')
      }
    })

    it('rechaza si no se aceptan los términos de veracidad', () => {
      const withoutTerms = { ...validComplaint, terminosAceptados: false }
      const result = LibroReclamacionSchema.safeParse(withoutTerms)
      expect(result.success).toBe(false)
    })

    it('rechaza si el detalle de hechos tiene menos de 15 caracteres', () => {
      const shortDetail = { ...validComplaint, detalleHechos: 'Muy mal' }
      const result = LibroReclamacionSchema.safeParse(shortDetail)
      expect(result.success).toBe(false)
    })

    it('rechaza tipo de documento no admitido', () => {
      const invalidDoc = { ...validComplaint, tipoDocumento: 'CEDULA_INVALIDA' }
      const result = LibroReclamacionSchema.safeParse(invalidDoc)
      expect(result.success).toBe(false)
    })

    it('rechaza email con formato inválido', () => {
      const invalidEmail = { ...validComplaint, email: 'correo-sin-arroba' }
      const result = LibroReclamacionSchema.safeParse(invalidEmail)
      expect(result.success).toBe(false)
    })
  })

  describe('submitComplaintAction', () => {
    it('procesa la reclamación y genera código oficial con formato LR-YYYY-XXXXX', async () => {
      const result = await submitComplaintAction(validComplaint)
      expect(result.success).toBe(true)
      expect(result.codigoReclamacion).toBeDefined()
      expect(result.codigoReclamacion).toMatch(/^LR-\d{4}-\d{5}$/)
      expect(result.fechaRegistro).toBeDefined()
    })

    it('retorna error si los datos son inválidos', async () => {
      const invalidData = { ...validComplaint, nombreCompleto: 'A' }
      const result = await submitComplaintAction(invalidData)
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })
})
