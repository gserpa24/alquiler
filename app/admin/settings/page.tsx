// app/admin/settings/page.tsx
// Página de configuración de datos de la empresa, identidad, redes y canales de atención.

import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Settings } from 'lucide-react'
import { getAdminSession } from '@/lib/auth/guard'
import { getSiteConfigFile } from '@/lib/site-config-server'
import { AdminSettingsForm } from '@/components/admin/AdminSettingsForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Configuración Institucional | Admin AutoRuta',
  description: 'Edición de nombre de marca, lema, redes sociales y canales de atención de la concesionaria.',
}

export default async function AdminSettingsPage() {
  const session = await getAdminSession()
  if (!session.authenticated) {
    redirect('/admin/login')
  }

  const initialConfig = await getSiteConfigFile()

  return (
    <div className="space-y-6">
      {/* ── Encabezado ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-md border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
            title="Volver al Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                Configuración del Sitio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[11px] font-semibold border border-zinc-200">
                Identidad & Contacto
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Edita los datos que se muestran en el pie de página, redes sociales, horarios y contacto.
            </p>
          </div>
        </div>
      </div>

      {/* ── Formulario de Configuración ── */}
      <AdminSettingsForm initialConfig={initialConfig} />
    </div>
  )
}
