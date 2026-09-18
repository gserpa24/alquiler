// app/admin/modules/page.tsx
// Página de Gestión de Módulos y Feature Flags del Panel Administrativo.

import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, SlidersHorizontal } from 'lucide-react'
import { getAdminSession } from '@/lib/auth/guard'
import { AdminModulesManager } from '@/components/admin/AdminModulesManager'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Gestión de Módulos | Admin AutoRuta',
  description: 'Activa o desactiva módulos del panel administrativo para personalizar la experiencia operativa.',
}

export default async function AdminModulesPage() {
  const session = await getAdminSession()
  if (!session.authenticated) {
    redirect('/admin/login')
  }

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
                Gestión de Módulos
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[11px] font-semibold border border-zinc-200">
                Feature Flags
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Controla qué módulos están activos en la barra de navegación y las vistas del panel de administración.
            </p>
          </div>
        </div>
      </div>

      {/* ── Gestor Interactivo ── */}
      <AdminModulesManager />
    </div>
  )
}
