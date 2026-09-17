// app/admin/layout.tsx
// Layout para las páginas del panel administrativo.

import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { AdminNav } from '@/components/admin/AdminNav'

export const metadata: Metadata = {
  title: 'Panel Administrativo | AUTORUTA',
  description: 'Gestión de catálogo, inventario y disponibilidad de flota.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-zinc-900 flex flex-col antialiased">
      <AdminNav />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-zinc-200 bg-white py-4 px-4 text-center text-xs text-zinc-400">
        AUTORUTA — Panel de Administración de Flota • Alquiler de Autos Cotidianos
      </footer>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
