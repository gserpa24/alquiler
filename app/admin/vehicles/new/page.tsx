// app/admin/vehicles/new/page.tsx
// Página para agregar un nuevo vehículo al catálogo de alquiler.

import { redirect } from 'next/navigation'
import { VehicleAdminForm } from '@/components/admin/VehicleAdminForm'
import { getAdminSession } from '@/lib/auth/guard'

export const dynamic = 'force-dynamic'

export default async function NewVehiclePage() {
  const session = await getAdminSession()
  if (!session.authenticated) {
    redirect('/admin/login')
  }

  return (
    <div>
      <VehicleAdminForm mode="create" />
    </div>
  )
}
