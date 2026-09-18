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

    // Persistencia en base de datos para trazabilidad y atención en bandeja administrativa
    try {
      const { saveContactMessage } = await import('@/lib/supabase/messages')
      await saveContactMessage({
        name: validated.data.nombreCompleto,
        email: validated.data.email,
        phone: validated.data.telefono,
        subject: `[Libro de Reclamaciones - ${codigoReclamacion}] ${validated.data.tipoReclamacion.toUpperCase()}`,
        message: `Documento: ${validated.data.tipoDocumento} ${validated.data.numeroDocumento}
Domicilio: ${validated.data.domicilio}
Bien/Servicio: ${validated.data.descripcionBien} (${validated.data.tipoBien})
Monto Reclamado: ${validated.data.montoReclamado || 'No especificado'}
Detalle de Hechos: ${validated.data.detalleHechos}
Pedido Concreto: ${validated.data.pedidoConcreto}`,
      })
    } catch (saveErr) {
      console.warn('[submitComplaintAction] Error al registrar en mensajes de administración:', saveErr)
    }

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
