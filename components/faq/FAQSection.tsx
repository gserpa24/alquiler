'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'
import { FAQ_ITEMS, FAQ_CATEGORIES } from '@/lib/faq-data'
import { buildGenericWhatsAppLink } from '@/lib/whatsapp'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FAQSectionProps {
  showCategoryFilters?: boolean
  maxItems?: number
  className?: string
  title?: string
  subtitle?: string
}

export function FAQSection({
  showCategoryFilters = true,
  maxItems,
  className,
  title = 'Preguntas Frecuentes',
  subtitle = 'Resolvemos tus principales dudas sobre requisitos, garantías, proceso de consulta y políticas de servicio en Perú.',
}: FAQSectionProps) {
  const { config } = useSiteConfig()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const filteredItems = FAQ_ITEMS.filter((item) => {
    if (selectedCategory === 'all') return true
    return item.category === selectedCategory
  }).slice(0, maxItems ?? FAQ_ITEMS.length)

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  const cleanPhone = (config.whatsappNumber || '').replace(/\D/g, '')
  const hasWhatsapp = Boolean(cleanPhone && cleanPhone.length >= 8)
  let waLink = '#'
  if (hasWhatsapp) {
    try {
      waLink = buildGenericWhatsAppLink('¡Hola! Tengo una consulta sobre las condiciones de alquiler.', config.whatsappNumber)
    } catch {
      waLink = '#'
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-[#0A192F] text-[11px] font-bold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Centro de Ayuda y Preguntas Frecuentes</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
          {title}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Filtros por Categoría */}
      {showCategoryFilters && (
        <div className="flex items-center justify-center gap-1.5 flex-wrap mb-8">
          {FAQ_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id)
                  setOpenId(null)
                }}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-150',
                  isActive
                    ? 'bg-[#0A192F] text-white shadow-xs'
                    : 'bg-white text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-300'
                )}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Lista de Acordeones */}
      <div className="max-w-3xl mx-auto space-y-3">
        {filteredItems.map((item) => {
          const isOpen = openId === item.id
          return (
            <div
              key={item.id}
              className={cn(
                'border rounded-xl transition-all duration-200 overflow-hidden bg-white',
                isOpen
                  ? 'border-[#0A192F]/40 shadow-xs ring-1 ring-[#0A192F]/10'
                  : 'border-zinc-200 hover:border-zinc-300'
              )}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A192F]"
              >
                <span className="text-sm sm:text-base font-semibold text-zinc-900 leading-snug">
                  {item.question}
                </span>
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200',
                    isOpen
                      ? 'bg-[#0A192F] text-white rotate-180'
                      : 'bg-zinc-100 text-zinc-500'
                  )}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                  >
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-1 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* CTA de contacto si persisten dudas */}
      <div className="max-w-xl mx-auto mt-10 p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0A192F] mb-1">
          ¿Tienes una consulta específica no resuelta?
        </p>
        <p className="text-xs text-zinc-500 mb-4">
          Nuestro equipo en Tarapoto responderá tus requerimientos de fechas, vehículos y rutas de inmediato.
        </p>
        <a
          href={hasWhatsapp && waLink !== '#' ? waLink : '#'}
          target={hasWhatsapp && waLink !== '#' ? '_blank' : undefined}
          rel={hasWhatsapp && waLink !== '#' ? 'noopener noreferrer' : undefined}
          onClick={(e) => {
            if (!hasWhatsapp || waLink === '#') {
              e.preventDefault()
              toast.warning('Aún no hay un número configurado.')
            }
          }}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs',
            hasWhatsapp && waLink !== '#'
              ? 'bg-[#25D366] hover:bg-[#1EBE5D] text-white cursor-pointer'
              : 'bg-zinc-200 text-zinc-400 border border-zinc-300 hover:bg-zinc-200 cursor-not-allowed'
          )}
        >
          <MessageCircle className="w-4 h-4" />
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  )
}
