'use client'
// components/vehicle/VehicleGallery.tsx
// Carrusel de imágenes del vehículo con miniaturas, navegación y fade entre slides.

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VehicleGalleryProps {
  images:    string[]
  alt:       string
  className?: string
}

export function VehicleGallery({ images, alt, className }: VehicleGalleryProps) {
  const [current,    setCurrent]    = useState(0)
  const [direction,  setDirection]  = useState(1)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const safeImages = images.length > 0 ? images : ['/placeholder-car.jpg']
  const total      = safeImages.length

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir)
    setCurrent(index)
  }, [])

  const prev = useCallback(() => {
    goTo((current - 1 + total) % total, -1)
  }, [current, total, goTo])

  const next = useCallback(() => {
    goTo((current + 1) % total, 1)
  }, [current, total, goTo])

  const slideVariants = {
    enter:  (dir: number) => ({ x: dir > 0 ? '4%' : '-4%', opacity: 0 }),
    center: { x: '0%', opacity: 1, transition: { duration: 0.35, ease: 'easeOut' as const } },
    exit:   (dir: number) => ({ x: dir > 0 ? '-4%' : '4%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' as const } }),
  }

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      {/* ── Imagen principal adaptativa a la altura de pantalla ── */}
      <div className="relative aspect-[16/10] max-h-[50vh] sm:max-h-[54vh] rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 group">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <Image
              src={safeImages[current]}
              alt={`${alt} — imagen ${current + 1} de ${total}`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
              priority={current === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Contador */}
        {total > 1 && (
          <div
            className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-white/95 backdrop-blur-sm text-[11px] font-medium text-zinc-700 border border-zinc-200 z-10"
            aria-live="polite"
            aria-label={`Imagen ${current + 1} de ${total}`}
          >
            {current + 1} / {total}
          </div>
        )}

        {/* Botón expandir */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute top-3 right-3 p-1.5 rounded-md bg-white/95 backdrop-blur-sm text-zinc-600 hover:text-zinc-950 border border-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10"
          aria-label="Ver imagen a pantalla completa"
        >
          <Expand className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
        </button>

        {/* Navegación permanente del carrusel */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-white/90 backdrop-blur-md text-zinc-900 hover:bg-white border border-zinc-200 shadow-sm transition-all z-10 cursor-pointer"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2]" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-white/90 backdrop-blur-md text-zinc-900 hover:bg-white border border-zinc-200 shadow-sm transition-all z-10 cursor-pointer"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-4 h-4 stroke-[2]" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* ── Carrete de Miniaturas ───────────────────────────────── */}
      {total > 1 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium px-0.5">
            <span>Carrete de fotos ({total})</span>
            <span>Desliza para explorar</span>
          </div>

          <div
            className="flex gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-thin"
            role="tablist"
            aria-label="Miniaturas de imágenes del vehículo"
          >
            {safeImages.map((src, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Ver imagen ${i + 1}`}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className={cn(
                  'relative shrink-0 w-20 sm:w-24 h-14 sm:h-16 rounded-md overflow-hidden border transition-all duration-150 cursor-pointer bg-zinc-50',
                  i === current
                    ? 'border-[#0A192F] ring-2 ring-[#0A192F] shadow-xs'
                    : 'border-zinc-200 hover:border-zinc-400 opacity-60 hover:opacity-100',
                )}
              >
                <Image
                  src={src}
                  alt={`Miniatura ${i + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
                <span className="absolute bottom-1 right-1 px-1 rounded bg-black/70 text-[9px] font-mono text-white">
                  {i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Lightbox ─────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-label="Vista de imagen a pantalla completa"
            aria-modal="true"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-md bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-colors"
              aria-label="Cerrar"
            >
              <ChevronRight className="w-5 h-5 rotate-45" aria-hidden="true" />
            </button>

            <div
              className="relative w-full max-w-5xl aspect-[16/10]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={safeImages[current]}
                alt={`${alt} — imagen ampliada`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prev() }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-md bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); next() }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-md bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
