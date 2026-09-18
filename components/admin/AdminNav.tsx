'use client'

// components/admin/AdminNav.tsx
// Barra de navegación del Panel Administrativo con filtrado dinámico según Feature Flags de módulos.

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  LogOut,
  MessageSquare,
  SlidersHorizontal,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutAdminAction } from '@/app/actions/auth-actions'
import { useAdminModules } from '@/contexts/AdminModulesContext'

export function AdminNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { isModuleEnabled } = useAdminModules()

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

  // Enlaces activos según Feature Flags
  const activeLinks = [
    ...(isModuleEnabled('dashboard')
      ? [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true }]
      : []),
    ...(isModuleEnabled('vehicles')
      ? [{ href: '/admin/vehicles', label: 'Flota', icon: Car, exact: false }]
      : []),
    ...(isModuleEnabled('messages')
      ? [{ href: '/admin/messages', label: 'Mensajes', icon: MessageSquare, exact: false }]
      : []),
    { href: '/admin/modules', label: 'Módulos', icon: SlidersHorizontal, exact: false },
  ]

  const showAddVehicle = isModuleEnabled('vehicles')

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
              {activeLinks.map(({ href, label, icon: Icon, exact }) => {
                const isActive = exact
                  ? pathname === href
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
            {showAddVehicle && (
              <Link
                href="/admin/vehicles/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#152e52] transition-colors shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Agregar Auto</span>
              </Link>
            )}

            <Link
              href="/admin/settings"
              className={cn(
                'p-2 rounded-md border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors shadow-2xs',
                pathname === '/admin/settings' && 'bg-zinc-100 text-zinc-950 border-zinc-300'
              )}
              title="Configuración de Marca, Redes y Atención"
            >
              <Settings className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors shadow-2xs"
              title="Abrir catálogo público en una nueva pestaña"
              aria-label="Ver sitio público"
            >
              <ExternalLink className="w-4 h-4" />
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
              {/* Enlaces Principales Filtrados */}
              {activeLinks.map(({ href, label, icon: Icon, exact }) => {
                const isActive = exact
                  ? pathname === href
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

              {/* Agregar Auto (si módulo flota activo) */}
              {showAddVehicle && (
                <Link
                  href="/admin/vehicles/new"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-700" />
                  <span>+ Agregar Nuevo Auto</span>
                </Link>
              )}

              {/* Separador */}
              <div className="pt-2 border-t border-zinc-100 flex flex-col gap-1.5">
                {/* Configuración */}
                <Link
                  href="/admin/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-zinc-400" />
                  <span>Configuración</span>
                </Link>

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
