// app/admin/messages/page.tsx
// Módulo de Bandeja de Mensajes de Contacto en el Panel Administrativo.

import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getContactMessagesWithStatus } from '@/lib/supabase/messages'
import { AdminMessagesInbox } from '@/components/admin/AdminMessagesInbox'
import { getAdminSession } from '@/lib/auth/guard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Bandeja de Mensajes | Admin AutoRuta',
  description: 'Gestión y atención de consultas recibidas a través del formulario de contacto.',
}

export default async function AdminMessagesPage() {
  const session = await getAdminSession()
  if (!session.authenticated) {
    redirect('/admin/login')
  }

  const { messages, isTableMissing } = await getContactMessagesWithStatus()
  const pendingCount = messages.filter((m) => m.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
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
                Bandeja de Mensajes
              </h1>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold">
                  {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Consultas y solicitudes de cotización enviadas por los clientes desde la web.
            </p>
          </div>
        </div>
      </div>

      {/* ── Inbox Component ── */}
      <AdminMessagesInbox
        initialMessages={messages}
        initialTableMissing={isTableMissing}
      />
    </div>
  )
}
