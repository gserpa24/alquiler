// app/admin/vehicles/new/page.tsx
// Página para agregar un nuevo vehículo al catálogo de alquiler.

import { VehicleAdminForm } from '@/components/admin/VehicleAdminForm'

export const dynamic = 'force-dynamic'

export default function NewVehiclePage() {
  return (
    <div>
      <VehicleAdminForm mode="create" />
    </div>
  )
}
