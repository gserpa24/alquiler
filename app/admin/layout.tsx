// app/admin/layout.tsx
// Layout para las páginas del panel administrativo con soporte modular y Feature Flags.

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { AdminNav } from '@/components/admin/AdminNav'
import { Toaster } from '@/components/ui/sonner'
import { AdminModulesProvider } from '@/contexts/AdminModulesContext'
import { MODULE_COOKIE_NAME, parseModuleFlags } from '@/lib/admin-modules'

export const metadata: Metadata = {
  title: 'Panel Administrativo | AUTORUTA',
  description: 'Gestión de catálogo, inventario y disponibilidad de flota.',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const rawFlags = cookieStore.get(MODULE_COOKIE_NAME)?.value
  const initialFlags = parseModuleFlags(rawFlags)

  return (
    <AdminModulesProvider initialFlags={initialFlags}>
      <div className="min-h-screen bg-[#F8FAFC] text-zinc-900 flex flex-col antialiased">
        <AdminNav />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-zinc-200 bg-white py-4 px-4 text-center text-xs text-zinc-400">
          AutoRuta - Panel Administrativo
        </footer>
        <Toaster position="bottom-right" richColors />
      </div>
    </AdminModulesProvider>
  )
}
