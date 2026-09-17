// app/api/vehicles/route.ts
// GET /api/vehicles — Endpoint filtrado del catálogo.
// Usado opcionalmente por el cliente para búsquedas en tiempo real.

import { NextRequest, NextResponse } from 'next/server'
import { VehicleFilterSchema }       from '@/lib/validations'
import { getVehicles }               from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const params    = Object.fromEntries(request.nextUrl.searchParams)
    const validated = VehicleFilterSchema.safeParse(params)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Parámetros inválidos', details: validated.error.flatten() },
        { status: 400 },
      )
    }

    const result = await getVehicles(validated.data)
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })

  } catch (error) {
    console.error('[GET /api/vehicles]', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
