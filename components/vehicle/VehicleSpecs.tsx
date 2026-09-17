// components/vehicle/VehicleSpecs.tsx
// Grid de especificaciones técnicas del vehículo.
// Server Component — recibe los datos del vehículo completo.

import { Fuel, Users, Gauge, Milestone, Tag, Calendar, Palette } from 'lucide-react'
import { cn, formatMileage } from '@/lib/utils'
import {
  type Vehicle,
  CATEGORY_LABELS,
  FUEL_LABELS,
  TRANSMISSION_LABELS,
} from '@/types/vehicle'

interface SpecItemProps {
  icon:  React.ReactNode
  label: string
  value: string
}

function SpecItem({ icon, label, value }: SpecItemProps) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-lg bg-zinc-50/70 border border-zinc-200">
      <div
        className="w-8 h-8 flex items-center justify-center rounded bg-white border border-zinc-200 shrink-0 text-[#0A192F]"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">{label}</p>
        <p className="text-xs font-semibold text-zinc-900 truncate mt-0.5">{value}</p>
      </div>
    </div>
  )
}

interface VehicleSpecsProps {
  vehicle:   Vehicle
  className?: string
}

export function VehicleSpecs({ vehicle, className }: VehicleSpecsProps) {
  const specs = [
    {
      icon:  <Calendar className="w-4 h-4 text-[#0A192F] stroke-[1.5]" />,
      label: 'Año',
      value: String(vehicle.year),
    },
    {
      icon:  <Tag className="w-4 h-4 text-[#0A192F] stroke-[1.5]" />,
      label: 'Categoría',
      value: CATEGORY_LABELS[vehicle.category],
    },
    {
      icon:  <Fuel className="w-4 h-4 text-[#0A192F] stroke-[1.5]" />,
      label: 'Combustible',
      value: FUEL_LABELS[vehicle.fuel],
    },
    {
      icon:  <Gauge className="w-4 h-4 text-[#0A192F] stroke-[1.5]" />,
      label: 'Transmisión',
      value: TRANSMISSION_LABELS[vehicle.transmission],
    },
    {
      icon:  <Users className="w-4 h-4 text-[#0A192F] stroke-[1.5]" />,
      label: 'Capacidad',
      value: `${vehicle.seats} pasajeros`,
    },
    {
      icon:  <Milestone className="w-4 h-4 text-[#0A192F] stroke-[1.5]" />,
      label: 'Kilometraje',
      value: formatMileage(vehicle.mileage),
    },
    ...(vehicle.fuel_consumption ? [{
      icon:  <Fuel className="w-4 h-4 text-[#0A192F] stroke-[1.5]" />,
      label: 'Rendimiento',
      value: vehicle.fuel_consumption,
    }] : []),
    ...(vehicle.suitability_tag ? [{
      icon:  <Tag className="w-4 h-4 text-[#0A192F] stroke-[1.5]" />,
      label: 'Recomendado',
      value: vehicle.suitability_tag,
    }] : []),
    ...(vehicle.color ? [{
      icon:  <Palette className="w-4 h-4 text-[#0A192F] stroke-[1.5]" />,
      label: 'Color',
      value: vehicle.color,
    }] : []),
  ]

  return (
    <section className={cn('space-y-4', className)} aria-labelledby="specs-heading">
      <h2
        id="specs-heading"
        className="text-xs font-bold uppercase tracking-wider text-zinc-900"
      >
        Especificaciones Técnicas
      </h2>

      <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5">
        {specs.map(({ icon, label, value }) => (
          <SpecItem key={label} icon={icon} label={label} value={value} />
        ))}
      </dl>

      {/* Características / features */}
      {vehicle.features.length > 0 && (
        <div className="pt-3 border-t border-zinc-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2.5">
            Equipamiento
          </h3>
          <ul className="flex flex-wrap gap-1.5" role="list">
            {vehicle.features.map((feature) => (
              <li
                key={feature}
                className="px-2.5 py-1 rounded text-xs font-medium bg-zinc-50 border border-zinc-200 text-zinc-700"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
