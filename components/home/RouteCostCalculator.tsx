'use client'

import { useState, useMemo } from 'react'
import {
  MapPin,
  Fuel,
  Coins,
  ArrowRight,
  TrendingDown,
  Car,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { MOCK_VEHICLES } from '@/lib/mock-data'
import { buildGenericWhatsAppLink } from '@/lib/whatsapp'

interface RoutePreset {
  id: string
  name: string
  origin: string
  destination: string
  distanceKm: number
  tollsUsd: number
  description: string
  roadType: 'Autopista costera' | 'Carretera de montaña' | 'Malla urbana' | 'Interprovincial mixta'
  waypoints: string[]
}

const POPULAR_ROUTES: RoutePreset[] = [
  {
    id: 'spondylus-playas',
    name: 'Ruta del Spondylus (Playas)',
    origin: 'Guayaquil',
    destination: 'Salinas & Costa',
    distanceKm: 145,
    tollsUsd: 2.5,
    description: 'Autopista llana costera de 4 carriles, excelente para sedanes y crossovers de bajo consumo.',
    roadType: 'Autopista costera',
    waypoints: ['Guayaquil', 'Chongón', 'Progreso', 'Santa Elena', 'Salinas'],
  },
  {
    id: 'sierra-cajas',
    name: 'Ruta Andina: Cuenca por El Cajas',
    origin: 'Guayaquil',
    destination: 'Cuenca (Sierra)',
    distanceKm: 195,
    tollsUsd: 3.0,
    description: 'Paso montañoso con curvas y altitud (hasta 4,100 msnm). Ideal para SUVs o pick-ups con buen torque.',
    roadType: 'Carretera de montaña',
    waypoints: ['Guayaquil', 'Tamarindo', 'Parque Nac. Cajas', 'Cuenca'],
  },
  {
    id: 'ruteo-urbano',
    name: 'Circuito Diario Urbano y Comercial',
    origin: 'Norte / Aeropuerto',
    destination: 'Centro Financiero / Samborondón',
    distanceKm: 45,
    tollsUsd: 0.5,
    description: 'Tráfico urbano y avenidas principales. Máxima eficiencia para compactos y sedanes cotidianos.',
    roadType: 'Malla urbana',
    waypoints: ['Aeropuerto GYE', 'Plaza Lagos', 'Av. 9 de Octubre', 'Puerto Santana'],
  },
  {
    id: 'banos-volcanes',
    name: 'Road Trip: Travesía a Baños de Agua Santa',
    origin: 'Guayaquil / Costa',
    destination: 'Baños (Tungurahua)',
    distanceKm: 290,
    tollsUsd: 4.5,
    description: 'Viaje largo interprovincial con cambio de clima y paisajes de cascadas. Espacio para maletas familiares.',
    roadType: 'Interprovincial mixta',
    waypoints: ['Guayaquil', 'El Triunfo', 'Riobamba', 'Ambato', 'Baños'],
  },
]

export function RouteCostCalculator() {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(POPULAR_ROUTES[0].id)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(MOCK_VEHICLES[0].id)
  const [customDays, setCustomDays] = useState<number>(2)

  const currentRoute = useMemo(
    () => POPULAR_ROUTES.find((r) => r.id === selectedRouteId) ?? POPULAR_ROUTES[0],
    [selectedRouteId]
  )

  const currentVehicle = useMemo(
    () => MOCK_VEHICLES.find((v) => v.id === selectedVehicleId) ?? MOCK_VEHICLES[0],
    [selectedVehicleId]
  )

  // Estimación de rendimiento promedio (15.0 km/l)
  const kmPerLiter = 15.0

  // Estimaciones numéricas (precio promedio de combustible en Ecuador ~$0.68/litro o $2.55/galón)
  const fuelPricePerLiter = 0.68
  const litersNeeded = useMemo(() => {
    return Number((currentRoute.distanceKm / kmPerLiter).toFixed(1))
  }, [currentRoute.distanceKm, kmPerLiter])

  const fuelCostUsd = useMemo(() => {
    return Number((litersNeeded * fuelPricePerLiter).toFixed(2))
  }, [litersNeeded])

  const rentalCostUsd = useMemo(() => {
    return (currentVehicle.daily_rate ?? 40) * customDays
  }, [currentVehicle.daily_rate, customDays])

  const totalTripCostUsd = useMemo(() => {
    return Number((rentalCostUsd + fuelCostUsd + currentRoute.tollsUsd).toFixed(2))
  }, [rentalCostUsd, fuelCostUsd, currentRoute.tollsUsd])

  // Generación de link dinámico de WhatsApp pre-cargado con la ruta
  const whatsAppMessage = `¡Hola! Estuve calculando en la web mi ruta de viaje:
📍 Ruta: *${currentRoute.name}* (${currentRoute.distanceKm} km)
🚗 Auto: *${currentVehicle.brand} ${currentVehicle.model} ${currentVehicle.year}*
📅 Duración estimada: *${customDays} día(s)*
⛽ Consumo estimado: *~${litersNeeded} L ($${fuelCostUsd})*

¿Podrían confirmarme disponibilidad del vehículo y condiciones para estas fechas? ¡Gracias!`

  const waLink = buildGenericWhatsAppLink(whatsAppMessage)

  return (
    <section id="panel-de-ruteo" className="py-16 sm:py-24 border-b border-zinc-100 bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado del Módulo */}
        <div className="max-w-2xl mb-12">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 mb-1.5">
            Planificación y Ruteo Transparente
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mb-3">
            Calculador de Ruta, Consumo y Peajes
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Sin sorpresas en el camino. Estima con precisión milimétrica los gastos de combustible,
            peajes y alquiler según el auto cotidiano que elijas para tu destino.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Columna Izquierda: Mapa Esquemático & Selector de Ruta (7 cols) ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Selector de Rutas Populares */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POPULAR_ROUTES.map((route) => {
                const isSelected = route.id === selectedRouteId
                return (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`p-3 rounded-lg border text-left transition-all duration-150 ${
                      isSelected
                        ? 'bg-white border-[#0A192F] shadow-xs'
                        : 'bg-white/70 border-zinc-200 hover:border-zinc-300 hover:bg-white'
                    }`}
                  >
                    <p className={`text-[11px] font-semibold uppercase tracking-wider line-clamp-1 ${
                      isSelected ? 'text-[#0A192F]' : 'text-zinc-500'
                    }`}>
                      {route.roadType}
                    </p>
                    <p className="text-xs font-bold text-zinc-900 mt-1 line-clamp-1">
                      {route.destination}
                    </p>
                    <p className="text-[11px] font-medium text-zinc-400 mt-1">
                      {route.distanceKm} km
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Mapa Esquemático Minimalista en Escala de Grises */}
            <div className="bg-white rounded-lg border border-zinc-200 p-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0A192F]" />
                    <h3 className="text-sm font-bold text-zinc-950">
                      {currentRoute.name}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {currentRoute.origin} → {currentRoute.destination}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-zinc-100 text-zinc-700 text-xs font-semibold tabular-nums border border-zinc-200">
                  {currentRoute.distanceKm} km totales
                </span>
              </div>

              {/* Diagrama Vectorial de Ruta Estilizada */}
              <div className="relative py-6 px-2">
                <svg
                  className="w-full h-28 overflow-visible"
                  viewBox="0 0 500 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Línea de fondo tenue con patrón vial */}
                  <path
                    d="M 20 65 Q 140 10, 250 55 T 480 35"
                    stroke="#E4E4E7"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Línea de trayecto activa en Azul Marino */}
                  <path
                    d="M 20 65 Q 140 10, 250 55 T 480 35"
                    stroke="#0A192F"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="6 3"
                  />

                  {/* Waypoints / Puntos de parada */}
                  <circle cx="20" cy="65" r="6" fill="#0A192F" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="160" cy="32" r="4.5" fill="#71717A" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="280" cy="56" r="4.5" fill="#71717A" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="480" cy="35" r="6" fill="#0A192F" stroke="#FFFFFF" strokeWidth="2" />

                  {/* Etiquetas de Waypoints */}
                  <text x="20" y="88" fill="#18181B" fontSize="10" fontWeight="600" textAnchor="start">
                    {currentRoute.waypoints[0]}
                  </text>
                  <text x="160" y="20" fill="#71717A" fontSize="9" fontWeight="500" textAnchor="middle">
                    {currentRoute.waypoints[1]}
                  </text>
                  <text x="280" y="78" fill="#71717A" fontSize="9" fontWeight="500" textAnchor="middle">
                    {currentRoute.waypoints[2]}
                  </text>
                  <text x="480" y="58" fill="#18181B" fontSize="10" fontWeight="600" textAnchor="end">
                    {currentRoute.waypoints[currentRoute.waypoints.length - 1]}
                  </text>
                </svg>

                <p className="text-xs text-zinc-500 mt-2 bg-zinc-50 p-2.5 rounded border border-zinc-100 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                  <span>{currentRoute.description}</span>
                </p>
              </div>

              {/* Selector de Vehículo Rápido */}
              <div className="pt-4 border-t border-zinc-100">
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  Selecciona el vehículo para simular la ruta:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MOCK_VEHICLES.slice(0, 6).map((vehicle) => {
                    const isVehSelected = vehicle.id === selectedVehicleId
                    return (
                      <button
                        key={vehicle.id}
                        type="button"
                        onClick={() => setSelectedVehicleId(vehicle.id)}
                        className={`p-2.5 rounded-md border text-left flex items-center gap-2.5 transition-colors ${
                          isVehSelected
                            ? 'bg-zinc-50 border-[#0A192F] ring-1 ring-[#0A192F]'
                            : 'bg-white border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <Car className={`w-4 h-4 shrink-0 ${isVehSelected ? 'text-[#0A192F]' : 'text-zinc-400'}`} />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-zinc-900 truncate">
                            {vehicle.model}
                          </p>
                          <p className="text-[10px] text-zinc-500 truncate">
                            ${vehicle.daily_rate}/d
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Columna Derecha: Desglose de Costos & CTA (5 cols) ── */}
          <div className="lg:col-span-5 bg-white rounded-lg border border-zinc-200 p-6 space-y-6 shadow-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Simulación en tiempo real
              </span>
              <h3 className="text-lg font-bold text-zinc-950 mt-2">
                Presupuesto Estimado de Viaje
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Valores calculados según rendimiento real y tarifas vigentes.
              </p>
            </div>

            {/* Días de Alquiler */}
            <div className="space-y-1.5 bg-zinc-50 p-3.5 rounded-md border border-zinc-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-700">Días de viaje previstos:</span>
                <span className="font-bold text-zinc-900 tabular-nums">{customDays} día(s)</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={customDays}
                onChange={(e) => setCustomDays(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#0A192F]"
              />
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>1 día</span>
                <span>3 días</span>
                <span>7 días</span>
              </div>
            </div>

            {/* Fila de Métricas */}
            <div className="space-y-3 pt-2">
              {/* Alquiler Diario */}
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-100">
                <span className="text-zinc-600 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-zinc-400" />
                  Alquiler ({customDays}d × ${currentVehicle.daily_rate})
                </span>
                <span className="font-semibold text-zinc-900 tabular-nums">
                  ${rentalCostUsd.toFixed(2)}
                </span>
              </div>

              {/* Combustible Estimado */}
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-100">
                <div>
                  <span className="text-zinc-600 flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-zinc-400" />
                    Combustible ({litersNeeded} Litros)
                  </span>
                </div>
                <span className="font-semibold text-zinc-900 tabular-nums">
                  ${fuelCostUsd.toFixed(2)}
                </span>
              </div>

              {/* Peajes */}
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-100">
                <span className="text-zinc-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  Peajes de la ruta ({currentRoute.distanceKm} km)
                </span>
                <span className="font-semibold text-zinc-900 tabular-nums">
                  ${currentRoute.tollsUsd.toFixed(2)}
                </span>
              </div>

              {/* Total Estimado */}
              <div className="pt-3 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-900 block">Costo Total Estimado</span>
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                    <TrendingDown className="w-3 h-3" />
                    Ahorro vs. taxis interprovinciales
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold tracking-tight text-zinc-950 tabular-nums">
                    ${totalTripCostUsd}
                  </span>
                  <span className="text-[11px] text-zinc-400 block">USD total</span>
                </div>
              </div>
            </div>

            {/* CTA WhatsApp con datos de ruteo precargados */}
            <div className="pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#152e52] active:scale-[0.99] transition-all shadow-xs"
              >
                <span>Consultar {currentVehicle.model} para esta ruta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <p className="text-[11px] text-zinc-400 text-center mt-2.5">
                Te enviamos confirmación de disponibilidad inmediata vía WhatsApp
              </p>
            </div>

            {/* Garantías de Ruteo Diario */}
            <div className="pt-4 border-t border-zinc-100 grid grid-cols-2 gap-2 text-[11px] text-zinc-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Asistencia 24/7 en ruta</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tanque lleno garantizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
