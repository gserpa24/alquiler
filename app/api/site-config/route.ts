import { NextResponse } from 'next/server'
import { getSiteConfigFile } from '@/lib/site-config-server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/site-config
 * Endpoint público y sin caché que retorna la configuración institucional actual
 * (datos de marca, redes sociales, horarios y número de WhatsApp).
 */
export async function GET() {
  try {
    const config = await getSiteConfigFile()
    return NextResponse.json(config, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  } catch (error) {
    console.error('[GET /api/site-config Error]:', error)
    return NextResponse.json(
      { error: 'Error al obtener la configuración institucional' },
      { status: 500 }
    )
  }
}
