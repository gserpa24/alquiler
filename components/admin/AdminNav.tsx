'use client'

// components/admin/AdminNav.tsx
// Barra de navegación del Panel Administrativo — 100% responsiva para móvil y escritorio.

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  LogOut,
  MessageSquare,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutAdminAction } from '@/app/actions/auth-actions'

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/messages', label: 'Mensajes', icon: MessageSquare },
]

export function AdminNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Cerrar menú al cambiar de ruta
  const [prevPath, setPrevPath] = useState(pathname)
  if (prevPath !== pathname) {
    setPrevPath(pathname)
    setOpen(false)
  }

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
              className="flex items-center gap-2.5 group focus-visible:outline-none shrink-0"
            >
              <div className="w-8 h-8 rounded bg-[#0A192F] flex items-center justify-center text-white shrink-0 shadow-2xs">
                <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
              </div>
              <div className="flex items-center">
                <span className="text-sm font-bold tracking-tight text-zinc-950">
                  AUTORUTA
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 ml-1.5">
                  Admin
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (>= md) */}
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

          {/* Desktop Right Actions (>= md) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin/vehicles/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#152e52] transition-colors shadow-xs"
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
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
              title="Cerrar sesión administrativa"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          {/* Mobile Actions (< md) */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 transition-colors"
              title="Sitio Público"
              aria-label="Ver sitio público"
            >
              <ExternalLink className="w-4 h-4 text-zinc-600" />
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="p-2 rounded-md text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
            >
              {open ? (
                <X className="w-5 h-5 stroke-[1.5]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown (< md) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white border-t border-zinc-200 shadow-lg"
          >
            <div className="px-4 py-3 space-y-1.5">
              {/* Enlaces Principales */}
              {ADMIN_LINKS.map(({ href, label, icon: Icon }) => {
                const isActive =
                  href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(href)

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold tracking-tight transition-colors',
                      isActive
                        ? 'bg-[#0A192F] text-white'
                        : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                )
              })}

              {/* Agregar Auto */}
              <Link
                href="/admin/vehicles/new"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-emerald-700" />
                <span>+ Agregar Nuevo Auto</span>
              </Link>

              {/* Separador */}
              <div className="pt-2 border-t border-zinc-100 flex flex-col gap-1.5">
                {/* Sitio Público */}
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                    <span>Ver Sitio Público</span>
                  </span>
                </Link>

                {/* Cerrar Sesión */}
                <button
                  onClick={() => {
                    setOpen(false)
                    handleLogout()
                  }}
                  disabled={isPending}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
