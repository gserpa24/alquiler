import type { Metadata } from 'next'
import { getVehicles } from '@/lib/supabase/queries'
import { TransactionalVehicleCatalog } from '@/components/home/TransactionalVehicleCatalog'

export const metadata: Metadata = {
  title: 'Alquiler de Autos Cotidianos | Búsqueda y Reserva Rápida',
  description:
    'Plataforma transaccional para búsqueda y reserva inmediata de autos cotidianos (sedanes, compactos, SUVs familiares). Tarifas transparentes por día.',
}

export default async function HomePage() {
  const { vehicles } = await getVehicles({ limit: 50 })

  return (
    <main className="min-h-screen bg-white">
      <TransactionalVehicleCatalog vehicles={vehicles} />
    </main>
  )
}
