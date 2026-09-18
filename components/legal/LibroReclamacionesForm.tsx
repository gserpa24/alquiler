'use client'

// components/legal/LibroReclamacionesForm.tsx
// Formulario interactivo oficial de Libro de Reclamaciones Virtual conforme a Ley N° 29571 e INDECOPI.

import { useState, useTransition } from 'react'
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Printer,
  Loader2,
} from 'lucide-react'
import { submitComplaintAction, type ComplaintResult } from '@/app/actions/complaint-actions'
import { type LibroReclamacionInput } from '@/lib/validations'

export function LibroReclamacionesForm() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<ComplaintResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<LibroReclamacionInput>({
    nombreCompleto: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    telefono: '',
    email: '',
    domicilio: '',
    tipoBien: 'servicio',
    montoReclamado: '',
    descripcionBien: 'Servicio de Alquiler de Vehículo',
    tipoReclamacion: 'reclamo',
    detalleHechos: '',
    pedidoConcreto: '',
    terminosAceptados: false,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!formData.terminosAceptados) {
      setError('Debes marcar la casilla declarando la veracidad de los datos consignados.')
      return
    }

    startTransition(async () => {
      const res = await submitComplaintAction(formData)
      if (res.success) {
        setResult(res)
      } else {
        setError(res.error ?? 'Ocurrió un error al registrar la reclamación')
      }
    })
  }

  // Si ya se registró la reclamación con éxito, mostrar la Hoja de Reclamación oficial
  if (result?.success) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-sm print:p-0 print:border-none">
        <div className="flex items-center gap-3 text-emerald-600 mb-4">
          <CheckCircle2 className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-bold text-zinc-950">
              Hoja de Reclamación Registrada con Éxito
            </h2>
            <p className="text-xs text-zinc-500">
              Conforme al Código de Protección y Defensa del Consumidor (Ley N° 29571)
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 mb-6 space-y-2 text-xs">
          <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
            <span className="font-semibold text-zinc-600">Código Oficial de Registro:</span>
            <span className="font-mono font-bold text-sm text-[#0A192F]">{result.codigoReclamacion}</span>
          </div>
          <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
            <span className="font-semibold text-zinc-600">Fecha y Hora de Recepción:</span>
            <span className="text-zinc-900">{result.fechaRegistro}</span>
          </div>
          <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
            <span className="font-semibold text-zinc-600">Consumidor Reclamante:</span>
            <span className="font-medium text-zinc-900">{formData.nombreCompleto} ({formData.tipoDocumento}: {formData.numeroDocumento})</span>
          </div>
          <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
            <span className="font-semibold text-zinc-600">Naturaleza:</span>
            <span className="uppercase font-bold text-zinc-900">{formData.tipoReclamacion}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-zinc-600">Plazo Legal de Respuesta:</span>
            <span className="font-semibold text-emerald-700">Máximo 15 días hábiles improrrogables</span>
          </div>
        </div>

        <div className="space-y-3 text-xs text-zinc-600 leading-relaxed mb-6">
          <p>
            <strong>Detalle registrado:</strong> {formData.detalleHechos}
          </p>
          <p>
            <strong>Pedido concreto:</strong> {formData.pedidoConcreto}
          </p>
          <p className="text-[11px] text-zinc-400">
            * Se ha generado una copia digital en nuestro sistema. La formulación del reclamo no excluye el recurso a otros medios de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-100 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#0A192F] text-white text-xs font-semibold hover:bg-[#112240] transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir o Guardar PDF
          </button>
          <button
            type="button"
            onClick={() => {
              setResult(null)
              setFormData({
                nombreCompleto: '',
                tipoDocumento: 'DNI',
                numeroDocumento: '',
                telefono: '',
                email: '',
                domicilio: '',
                tipoBien: 'servicio',
                montoReclamado: '',
                descripcionBien: 'Servicio de Alquiler de Vehículo',
                tipoReclamacion: 'reclamo',
                detalleHechos: '',
                pedidoConcreto: '',
                terminosAceptados: false,
              })
            }}
            className="px-4 py-2 rounded-md border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Registrar otra reclamación
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-8">
      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Datos del Consumidor Reclamante */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-4 pb-2 border-b border-zinc-100 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#0A192F] text-white text-[11px] flex items-center justify-center font-bold">1</span>
          Identificación del Consumidor Reclamante
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-zinc-700 mb-1">
              Nombres y Apellidos Completos *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Juan Carlos Pérez Gómez"
              value={formData.nombreCompleto}
              onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-[#0A192F]"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Tipo de Documento *
            </label>
            <select
              value={formData.tipoDocumento}
              onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value as 'DNI' | 'CE' | 'PASAPORTE' })}
              className="w-full px-3 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-[#0A192F] bg-white"
            >
              <option value="DNI">DNI (Documento Nacional de Identidad)</option>
              <option value="CE">Carné de Extranjería (CE)</option>
              <option value="PASAPORTE">Pasaporte</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Número de Documento *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: 45892314"
              value={formData.numeroDocumento}
              onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-[#0A192F]"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Teléfono / WhatsApp de Contacto *
            </label>
            <input
              type="tel"
              required
              placeholder="Ej: 987654321"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-[#0A192F]"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              required
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-[#0A192F]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-zinc-700 mb-1">
              Domicilio del Consumidor *
            </label>
            <input
              type="text"
              required
              placeholder="Dirección, Distrito, Ciudad (Ej: Jr. San Martín 450, Tarapoto)"
              value={formData.domicilio}
              onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-[#0A192F]"
            />
          </div>
        </div>
      </div>

      {/* 2. Identificación del Bien Contratado */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-4 pb-2 border-b border-zinc-100 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#0A192F] text-white text-[11px] flex items-center justify-center font-bold">2</span>
          Identificación del Bien Contratado
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Tipo de Bien *
            </label>
            <select
              value={formData.tipoBien}
              onChange={(e) => setFormData({ ...formData, tipoBien: e.target.value as 'servicio' | 'producto' })}
              className="w-full px-3 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-[#0A192F] bg-white"
            >
              <option value="servicio">Servicio (Alquiler vehicular)</option>
              <option value="producto">Producto</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-zinc-700 mb-1">
              Descripción del Bien o Servicio *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Alquiler de Toyota Hilux por 3 días"
              value={formData.descripcionBien}
              onChange={(e) => setFormData({ ...formData, descripcionBien: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-[#0A192F]"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Monto Reclamado (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: S/ 350.00"
              value={formData.montoReclamado}
              onChange={(e) => setFormData({ ...formData, montoReclamado: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-[#0A192F]"
            />
          </div>
        </div>
      </div>

      {/* 3. Detalle de la Reclamación */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-4 pb-2 border-b border-zinc-100 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#0A192F] text-white text-[11px] flex items-center justify-center font-bold">3</span>
          Detalle de la Reclamación y Pedido del Consumidor
        </h3>

        {/* Selector Reclamo vs Queja con definiciones legales */}
        <div className="mb-4">
          <label className="block font-semibold text-zinc-700 text-xs mb-2">
            Selecciona el tipo de disconformidad conforme a la ley peruana: *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                formData.tipoReclamacion === 'reclamo'
                  ? 'border-[#0A192F] bg-zinc-50'
                  : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="tipoReclamacion"
                  value="reclamo"
                  checked={formData.tipoReclamacion === 'reclamo'}
                  onChange={() => setFormData({ ...formData, tipoReclamacion: 'reclamo' })}
                  className="text-[#0A192F]"
                />
                <span className="font-bold text-xs text-zinc-900">RECLAMO</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-normal pl-5">
                Disconformidad relacionada directamente a los bienes o servicios adquiridos o contratados.
              </p>
            </label>

            <label
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                formData.tipoReclamacion === 'queja'
                  ? 'border-[#0A192F] bg-zinc-50'
                  : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="tipoReclamacion"
                  value="queja"
                  checked={formData.tipoReclamacion === 'queja'}
                  onChange={() => setFormData({ ...formData, tipoReclamacion: 'queja' })}
                  className="text-[#0A192F]"
                />
                <span className="font-bold text-xs text-zinc-900">QUEJA</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-normal pl-5">
                Disconformidad no relacionada a los productos o servicios; malestar o descontento respecto a la atención al público.
              </p>
            </label>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Detalle de los Hechos *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe detalladamente los hechos suscitados que motivan su reclamación..."
              value={formData.detalleHechos}
              onChange={(e) => setFormData({ ...formData, detalleHechos: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-[#0A192F] text-zinc-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Pedido Concreto del Consumidor *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Indica de forma clara y precisa qué solución solicita a la empresa..."
              value={formData.pedidoConcreto}
              onChange={(e) => setFormData({ ...formData, pedidoConcreto: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-[#0A192F] text-zinc-800"
            />
          </div>
        </div>
      </div>

      {/* Declaración jurada de veracidad */}
      <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-700">
          <input
            type="checkbox"
            checked={formData.terminosAceptados}
            onChange={(e) => setFormData({ ...formData, terminosAceptados: e.target.checked })}
            className="mt-0.5 rounded text-[#0A192F]"
          />
          <span className="leading-relaxed">
            Declaro bajo juramento que los datos e información consignados en el presente formulario son veraces y corresponden a la realidad de los hechos, conforme a lo establecido en la <strong>Ley N° 29571 (Código de Protección y Defensa del Consumidor)</strong>.
          </span>
        </label>
      </div>

      {/* Aviso legal del plazo */}
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Clock className="w-4 h-4 text-[#0A192F] shrink-0" />
        <span>
          Plazo legal de respuesta: <strong>Máximo 15 días hábiles</strong> improrrogables a través del correo electrónico proporcionado.
        </span>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#112240] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Registrando Reclamación...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            Enviar Hoja de Reclamación
          </>
        )}
      </button>
    </form>
  )
}
