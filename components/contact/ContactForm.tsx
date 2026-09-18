'use client'

import { useActionState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { submitContactAction, type ContactActionResult } from '@/app/actions/contact'

const SUBJECT_OPTIONS = [
  { value: 'rental', label: 'Alquiler de vehículos' },
  { value: 'purchase', label: 'Compra de vehículos' },
  { value: 'maintenance', label: 'Mantenimiento / Servicio' },
  { value: 'other', label: 'Otra consulta' },
]

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactActionResult | null, FormData>(
    submitContactAction,
    null
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
      formRef.current?.reset()
    } else if (state && !state.success) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* Honeypot hidden input */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
            Nombre Completo *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Ej. Carlos Mendoza"
            className="w-full px-3.5 py-2.5 rounded-md bg-white border border-zinc-200 focus:border-[#0A192F] text-zinc-900 text-xs transition-colors outline-none"
          />
          {state?.errors?.name && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {state.errors.name[0]}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
            Correo Electrónico *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="carlos@ejemplo.com"
            className="w-full px-3.5 py-2.5 rounded-md bg-white border border-zinc-200 focus:border-[#0A192F] text-zinc-900 text-xs transition-colors outline-none"
          />
          {state?.errors?.email && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {state.errors.email[0]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Teléfono */}
        <div>
          <label htmlFor="phone" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
            Teléfono / WhatsApp (Opcional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+51 900 000 000"
            className="w-full px-3.5 py-2.5 rounded-md bg-white border border-zinc-200 focus:border-[#0A192F] text-zinc-900 text-xs transition-colors outline-none"
          />
          {state?.errors?.phone && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {state.errors.phone[0]}
            </p>
          )}
        </div>

        {/* Asunto */}
        <div>
          <label htmlFor="subject" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
            Motivo de Contacto *
          </label>
          <select
            id="subject"
            name="subject"
            required
            defaultValue="rental"
            className="w-full px-3.5 py-2.5 rounded-md bg-white border border-zinc-200 focus:border-[#0A192F] text-zinc-900 text-xs transition-colors outline-none cursor-pointer"
          >
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {state?.errors?.subject && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {state.errors.subject[0]}
            </p>
          )}
        </div>
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="message" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
          Mensaje o Consulta *
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Cuéntanos en qué vehículo o servicio estás interesado..."
          className="w-full px-3.5 py-2.5 rounded-md bg-white border border-zinc-200 focus:border-[#0A192F] text-zinc-900 text-xs transition-colors outline-none resize-none"
        />
        {state?.errors?.message && (
          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {state.errors.message[0]}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#112240] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isPending ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Enviando mensaje...
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5 stroke-[1.5]" />
            Enviar Mensaje
          </>
        )}
      </button>

      {state?.success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}
      <Toaster position="bottom-right" richColors />
    </form>
  )
}
