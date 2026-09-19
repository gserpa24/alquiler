'use client'

// components/admin/AdminSettingsForm.tsx
// Formulario interactivo para editar los datos institucionales (identidad, redes, atención y ubicación).

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Save,
  RotateCcw,
  Building2,
  Clock,
  MapPin,
  Phone,
  Share2,
  Users,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { type SiteConfig } from '@/lib/site-config'

interface AdminSettingsFormProps {
  initialConfig?: SiteConfig
}

export function AdminSettingsForm({ initialConfig }: AdminSettingsFormProps = {}) {
  const { config, updateConfig, resetConfig, isPending } = useSiteConfig()

  const [formData, setFormData] = useState<SiteConfig>(() => {
    return initialConfig ?? config
  })

  useEffect(() => {
    if (config.whatsappNumber || config.phone || config.brandName) {
      setFormData((prev) => ({
        brandName: prev.brandName || config.brandName,
        slogan: prev.slogan || config.slogan,
        instagramUrl: prev.instagramUrl || config.instagramUrl,
        facebookUrl: prev.facebookUrl || config.facebookUrl,
        scheduleWeekdays: prev.scheduleWeekdays || config.scheduleWeekdays,
        scheduleWeekends: prev.scheduleWeekends || config.scheduleWeekends,
        location: prev.location || config.location,
        phone: prev.phone || config.phone,
        whatsappNumber: prev.whatsappNumber || config.whatsappNumber,
      }))
    }
  }, [config])

  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setSavedSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await updateConfig(formData)
    if (success) {
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    }
  }

  const handleReset = async () => {
    if (confirm('¿Estás seguro de restablecer todos los campos a los valores por defecto?')) {
      const success = await resetConfig()
      if (success) {
        setFormData({ ...config })
        setSavedSuccess(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* ========================================================= */}
        {/* ── BLOQUE 1: IDENTIDAD Y REDES SOCIALES ────────────────── */}
        {/* ========================================================= */}
        <div className="p-6 sm:p-7 rounded-xl bg-white border border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[#0A192F] shrink-0">
                <Building2 className="w-4 h-4 stroke-[1.75]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">
                  Identidad y Redes Sociales
                </h2>
                <p className="text-[11px] text-zinc-400">
                  Logo, nombre, descripción y enlaces sociales del pie de página
                </p>
              </div>
            </div>

            {/* Nombre de Marca */}
            <div>
              <label
                htmlFor="brandName"
                className="block text-xs font-semibold text-zinc-700 mb-1.5"
              >
                Nombre de la Empresa / Marca
              </label>
              <input
                id="brandName"
                name="brandName"
                type="text"
                required
                value={formData.brandName}
                onChange={handleChange}
                placeholder="ej. AUTORUTA"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] bg-white text-zinc-900"
              />
            </div>

            {/* Slogan / Descripción del Servicio */}
            <div>
              <label
                htmlFor="slogan"
                className="block text-xs font-semibold text-zinc-700 mb-1.5"
              >
                Descripción / Slogan de Servicio
              </label>
              <textarea
                id="slogan"
                name="slogan"
                rows={3}
                required
                value={formData.slogan}
                onChange={handleChange}
                placeholder="Servicio de alquiler de autos cotidianos..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] bg-white text-zinc-900 resize-y"
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                Aparece debajo del logo en el pie de página del catálogo y sitio web.
              </p>
            </div>

            {/* Enlace de Instagram */}
            <div>
              <label
                htmlFor="instagramUrl"
                className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Enlace de Instagram (Icono Compartir)</span>
                </span>
                {formData.instagramUrl && (
                  <a
                    href={formData.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 font-normal"
                  >
                    <span>Probar</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </label>
              <input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/autoruta"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] bg-white text-zinc-900 font-mono"
              />
            </div>

            {/* Enlace de Facebook */}
            <div>
              <label
                htmlFor="facebookUrl"
                className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Enlace de Facebook (Icono Comunidad)</span>
                </span>
                {formData.facebookUrl && (
                  <a
                    href={formData.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 font-normal"
                  >
                    <span>Probar</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </label>
              <input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/autoruta"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] bg-white text-zinc-900 font-mono"
              />
            </div>

            {/* Previsualización Identidad */}
            <div className="pt-4 border-t border-zinc-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Vista Previa en Pie de Página
              </span>
              <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200/80">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative w-8 h-6 flex items-center justify-center">
                    <Image
                      src="/logo-car.png"
                      alt="Logo"
                      width={32}
                      height={20}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <span className="text-sm font-bold text-zinc-900">
                    {formData.brandName || 'AUTORUTA'}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed max-w-xs font-normal">
                  {formData.slogan || 'Servicio de alquiler de autos cotidianos...'}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-7 h-7 flex items-center justify-center rounded bg-white border border-zinc-200 text-zinc-500">
                    <Share2 className="w-3 h-3 stroke-[1.5]" />
                  </div>
                  <div className="w-7 h-7 flex items-center justify-center rounded bg-white border border-zinc-200 text-zinc-500">
                    <Users className="w-3 h-3 stroke-[1.5]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ── BLOQUE 2: ATENCIÓN, HORARIOS Y UBICACIÓN ────────────── */}
        {/* ========================================================= */}
        <div className="p-6 sm:p-7 rounded-xl bg-white border border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[#0A192F] shrink-0">
                <Clock className="w-4 h-4 stroke-[1.75]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">
                  Canales de Atención y Ubicación
                </h2>
                <p className="text-[11px] text-zinc-400">
                  Horarios de atención, dirección y número de teléfono/WhatsApp
                </p>
              </div>
            </div>

            {/* Horario Días de Semana */}
            <div>
              <label
                htmlFor="scheduleWeekdays"
                className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Horario Días de Semana</span>
              </label>
              <input
                id="scheduleWeekdays"
                name="scheduleWeekdays"
                type="text"
                required
                value={formData.scheduleWeekdays}
                onChange={handleChange}
                placeholder="Lunes — Viernes: 8:00 – 19:00"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] bg-white text-zinc-900"
              />
            </div>

            {/* Horario Fines de Semana */}
            <div>
              <label
                htmlFor="scheduleWeekends"
                className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Horario Fines de Semana</span>
              </label>
              <input
                id="scheduleWeekends"
                name="scheduleWeekends"
                type="text"
                required
                value={formData.scheduleWeekends}
                onChange={handleChange}
                placeholder="Sábados: 9:00 – 17:00"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] bg-white text-zinc-900"
              />
            </div>

            {/* Dirección / Ubicación */}
            <div>
              <label
                htmlFor="location"
                className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>Ubicación / Ciudad</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="Tarapoto, San Martín"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] bg-white text-zinc-900"
              />
            </div>

            {/* Teléfono de Contacto (visible) */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                <span>Teléfono de Contacto (Texto visible)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ej: +51 900 000 000 (opcional)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] bg-white text-zinc-900 font-mono"
              />
            </div>

            {/* WhatsApp (número para enlace wa.me) */}
            <div>
              <label
                htmlFor="whatsappNumber"
                className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Número WhatsApp E.164 (Solo dígitos con código de país)</span>
              </label>
              <input
                id="whatsappNumber"
                name="whatsappNumber"
                type="text"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="Ej: 51900000000 (opcional)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:border-[#0A192F] focus:ring-1 focus:ring-[#0A192F] bg-white text-zinc-900 font-mono"
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                Utilizado para generar los enlaces oficiales wa.me. Si se deja en blanco, los botones redirigirán al formulario de contacto.
              </p>
            </div>

            {/* Previsualización Atención */}
            <div className="pt-4 border-t border-zinc-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Vista Previa en Bloque Atención
              </span>
              <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
                  Atención
                </h3>
                <ul className="space-y-2.5 text-xs text-zinc-500">
                  <li className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#0A192F] stroke-[1.5]" />
                    <span>
                      {formData.scheduleWeekdays}
                      <br />
                      {formData.scheduleWeekends}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#0A192F] stroke-[1.5]" />
                    <span>{formData.location}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Phone className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#0A192F] stroke-[1.5]" />
                    <span className="font-medium text-zinc-900">
                      {formData.phone ? (
                        formData.phone
                      ) : formData.whatsappNumber ? (
                        `WA: ${formData.whatsappNumber}`
                      ) : (
                        <span className="text-zinc-400 italic">Sin teléfono (en blanco)</span>
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Barra de Acciones / Guardado ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs">
        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cambios guardados correctamente</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Valores</span>
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#152e52] rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isPending ? 'Guardando...' : 'Guardar Configuración'}</span>
          </button>
        </div>
      </div>
    </form>
  )
}
