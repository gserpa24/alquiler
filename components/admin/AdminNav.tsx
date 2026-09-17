'use client'

// components/admin/AdminNav.tsx
// Barra de navegación del Panel Administrativo — Estilo SaaS ultra-minimalista con logout.

import { useTransition } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutAdminAction } from '@/app/actions/auth-actions'

const ADMIN_LINKS = [
  { href: '/admin',          label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/vehicles', label: 'Flota de Vehículos', icon: Car },
  { href: '/admin/vehicles/new', label: 'Nuevo Vehículo', icon: PlusCircle },
]

export function AdminNav() {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  // En la página de login no mostramos la barra administrativa
  if (pathname === '/admin/login') {
    return null
  }

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdminAction()
    })
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo Admin */}
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 group focus-visible:outline-none"
            >
              <div className="w-8 h-8 rounded bg-[#0A192F] flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-zinc-950">
                  AUTORUTA <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 ml-1">Admin</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navegación administrativa">
              {ADMIN_LINKS.map(({ href, label, icon: Icon }) => {
                const isActive =
                  href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(href)

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold tracking-tight transition-colors',
                      isActive
                        ? 'bg-[#0A192F] text-white'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Acciones Rápidas del Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/vehicles/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#152e52] transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Agregar Auto</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-zinc-200 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
              title="Abrir catálogo público en una nueva pestaña"
            >
              <span>Sitio Público</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </Link>

            <button
              onClick={handleLogout}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200 transition-colors disabled:opacity-50"
              title="Cerrar sesión administrativa"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
