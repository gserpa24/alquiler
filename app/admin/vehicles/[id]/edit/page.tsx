// app/admin/vehicles/[id]/edit/page.tsx
// Página para modificar un vehículo existente en el catálogo.

import { notFound, redirect } from 'next/navigation'
import { getVehicleById } from '@/lib/supabase/queries'
import { VehicleAdminForm } from '@/components/admin/VehicleAdminForm'
import { getAdminSession } from '@/lib/auth/guard'

export const dynamic = 'force-dynamic'

interface EditVehiclePageProps {
  params: Promise<{ id: string }>
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    redirect('/admin/login')
  }

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
