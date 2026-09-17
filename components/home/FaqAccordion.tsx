'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    id: '01',
    question: '¿Cuáles son los requisitos para alquilar un vehículo?',
    answer:
      'Debes tener al menos 21 años cumplidos y presentar: Documento de identidad vigente (DNI, pasaporte o carné de extranjería), licencia de conducir válida con mínimo 1 año de antigüedad, y tarjeta o depósito de garantía.',
  },
  {
    id: '02',
    question: '¿Qué depósito de garantía se requiere y cuándo me lo devuelven?',
    answer:
      'Solicitamos una garantía reembolsable según la categoría del vehículo. Se retiene al inicio del alquiler y se reembolsa en 48 a 72 horas hábiles tras la devolución, siempre que no existan daños, infracciones o cargos pendientes.',
  },
  {
    id: '03',
    question: '¿Qué usos están prohibidos y qué ocurre si los incumplo?',
    answer:
      'Está prohibido conducir en terrenos no habilitados para la categoría, participar en carreras o actividades ilícitas, transportar carga sin autorización o salir del país sin permiso expreso. El incumplimiento faculta el bloqueo remoto del vehículo.',
  },
  {
    id: '04',
    question: '¿Qué período de tolerancia tengo al devolver el vehículo?',
    answer:
      'Se otorga un período de tolerancia de 30 minutos al momento de la devolución dentro del horario de atención. Pasado dicho margen, se computará un día adicional conforme al tarifario vigente.',
  },
  {
    id: '05',
    question: '¿Cuál es la política de combustible?',
    answer:
      'Todos los vehículos se entregan con el tanque lleno y deben ser devueltos de la misma manera. En caso de faltantes, se cobrará el importe correspondiente al precio de mercado más un recargo administrativo.',
  },
  {
    id: '06',
    question: '¿Puedo alquilar si tengo licencia digital o internacional?',
    answer:
      'Aceptamos licencias nacionales físicas y digitales oficiales. Para conductores extranjeros, se requiere licencia física original de su país; la licencia internacional es válida como documento complementario de traducción.',
  },
]

export function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>('01')

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {FAQS.map((faq) => {
        const isOpen = openId === faq.id
        return (
          <div
            key={faq.id}
            className="rounded-lg bg-white border border-zinc-200 overflow-hidden transition-colors duration-150"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer select-none hover:bg-zinc-50/50"
              aria-expanded={isOpen}
            >
              <div className="flex items-start gap-3.5">
                <span className="font-mono font-bold text-[#0A192F] text-xs sm:text-sm shrink-0 pt-0.5">
                  {faq.id}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-zinc-900 leading-snug">
                  {faq.question}
                </h3>
              </div>
              <div
                className={cn(
                  'w-6 h-6 rounded border border-zinc-200 flex items-center justify-center shrink-0 transition-transform duration-200 text-zinc-600',
                  isOpen && 'rotate-180 border-[#0A192F] text-[#0A192F]'
                )}
              >
                <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 ml-8">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
