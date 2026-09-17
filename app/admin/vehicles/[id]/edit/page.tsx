// app/admin/vehicles/[id]/edit/page.tsx
// Página para modificar un vehículo existente en el catálogo.

import { notFound } from 'next/navigation'
import { getVehicleById } from '@/lib/supabase/queries'
import { VehicleAdminForm } from '@/components/admin/VehicleAdminForm'

export const dynamic = 'force-dynamic'

interface EditVehiclePageProps {
  params: Promise<{ id: string }>
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = await params
  const vehicle = await getVehicleById(id)

  if (!vehicle) {
    notFound()
  }

  return (
    <div>
      <VehicleAdminForm mode="edit" initialVehicle={vehicle} />
    </div>
  )
}
