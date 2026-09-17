'use client'
// components/vehicle/VehicleGrid.tsx
// Grid de tarjetas de vehículos con animación de entrada escalonada.

import { motion } from 'framer-motion'
import { PackageSearch } from 'lucide-react'
import { VehicleCard } from '@/components/vehicle/VehicleCard'
import { type VehicleCard as VehicleCardType } from '@/types/vehicle'

interface VehicleGridProps {
  vehicles: VehicleCardType[]
  /** Título accesible para el landmark de la lista */
  'aria-label'?: string
}

// Variantes de animación para entrada escalonada
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export function VehicleGrid({ vehicles, 'aria-label': ariaLabel }: VehicleGridProps) {
  if (vehicles.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center py-24 px-4 text-center"
        aria-label="Sin resultados"
      >
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-zinc-50 border border-zinc-200 mb-4">
          <PackageSearch className="w-6 h-6 text-zinc-400 stroke-[1.5]" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 mb-1.5">
          No se encontraron vehículos
        </h3>
        <p className="text-zinc-500 text-xs max-w-sm leading-relaxed">
          Prueba ajustando los filtros seleccionados o consulta directamente por WhatsApp a nuestro equipo.
        </p>
      </div>
    )
  }

  return (
    <motion.ul
      role="list"
      aria-label={ariaLabel ?? 'Catálogo de vehículos'}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {vehicles.map((vehicle) => (
        <motion.li key={vehicle.id} variants={itemVariants}>
          <VehicleCard
            vehicle={vehicle}
            variant={vehicle.is_featured ? 'featured' : 'default'}
          />
        </motion.li>
      ))}
    </motion.ul>
  )
}
