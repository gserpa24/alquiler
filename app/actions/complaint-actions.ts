'use server'

// app/actions/complaint-actions.ts
// Server Action para registro de Hoja de Reclamación virtual conforme a INDECOPI y Ley N° 29571.

import { LibroReclamacionSchema, type LibroReclamacionInput } from '@/lib/validations'

export interface ComplaintResult {
  success: boolean
  codigoReclamacion?: string
  fechaRegistro?: string
  error?: string
}

export async function submitComplaintAction(
  rawData: LibroReclamacionInput
): Promise<ComplaintResult> {
  try {
    const validated = LibroReclamacionSchema.safeParse(rawData)
    if (!validated.success) {
      const issue = validated.error.issues[0]?.message ?? 'Datos incompletos o inválidos'
      return { success: false, error: issue }
    }

    const year = new Date().getFullYear()
    const randomSuffix = Math.floor(10000 + Math.random() * 90000)
    const codigoReclamacion = `LR-${year}-${randomSuffix}`
    const fechaRegistro = new Date().toLocaleString('es-PE', {
      timeZone: 'America/Lima',
      dateStyle: 'full',
      timeStyle: 'short',
    })

    // Log estructurado en servidor para auditoría legal
    console.info('[Libro de Reclamaciones - Registro Oficial]:', {
      codigo: codigoReclamacion,
      fecha: fechaRegistro,
      consumidor: validated.data.nombreCompleto,
      documento: `${validated.data.tipoDocumento} ${validated.data.numeroDocumento}`,
      tipo: validated.data.tipoReclamacion.toUpperCase(),
      descripcion: validated.data.descripcionBien,
    })

    return {
      success: true,
      codigoReclamacion,
      fechaRegistro,
    }
  } catch (err) {
    console.error('[submitComplaintAction Error]:', err)
    return {
      success: false,
      error: 'Ocurrió un error al procesar la reclamación. Por favor intenta nuevamente o contáctanos por WhatsApp.',
    }
  }
}
