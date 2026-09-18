'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Car } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CurrencySwitcher } from '@/components/currency/CurrencySwitcher'

const NAV_LINKS = [
  { href: '/',         label: 'Inicio' },
  { href: '/catalog',  label: 'Flota' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contact',  label: 'Contacto' },
] as const

export function Navbar() {
  const pathname  = usePathname()
  const [open,      setOpen]      = useState(false)
  const [scrolled,  setScrolled]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cerrar menú en cambio de ruta
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

  // Ocultar Navbar por completo en rutas administrativas
  if (pathname?.startsWith('/admin')) return null

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 w-full z-50 transition-all duration-200 bg-white/95 backdrop-blur-md border-b',
        scrolled ? 'border-zinc-200/80 shadow-xs' : 'border-zinc-100',
      )}
    >
      <nav
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group focus-visible:outline-none"
          aria-label="Ir al inicio"
        >
          <div className="w-8 h-8 rounded-md bg-[#0A192F] flex items-center justify-center text-white shrink-0 shadow-2xs">
            <Car className="w-4 h-4 stroke-[1.75]" aria-hidden="true" />
          </div>
          <span className="text-base font-bold tracking-tight text-zinc-900 select-none">
            AUTO<span className="text-[#0A192F] font-bold">RUTA</span>
          </span>
        </Link>

        {/* Links desktop (centrados / intermedios) */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8" role="list">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={cn(
                    'text-xs uppercase tracking-wider font-semibold transition-colors duration-150',
                    isActive
                      ? 'text-[#0A192F]'
                      : 'text-zinc-500 hover:text-zinc-900',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Acciones del lado derecho: Selector de Moneda + CTA Reservar + Hamburguesa */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Selector de Moneda — visible tanto en móvil como en escritorio */}
          <CurrencySwitcher />

          {/* Botón Reservar — visible desde tablets pequeñas (sm) en adelante */}
          <Link
            href="/catalog"
            className={cn(
              'hidden sm:inline-flex px-3.5 sm:px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider',
              'bg-[#0A192F] text-white',
              'hover:bg-[#112240] transition-colors duration-150 shadow-xs',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0A192F]',
            )}
          >
            Reservar
          </Link>

          {/* Botón Hamburguesa móvil (< md) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors shrink-0"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? (
              <X className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu desplegable */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Menú de navegación"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md border-t border-zinc-200 w-full"
          >
            <ul className="px-4 py-4 flex flex-col gap-1.5" role="list">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        'block px-3.5 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors duration-150',
                        isActive
                          ? 'bg-[#0A192F] text-white'
                          : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}

              <li className="pt-2 border-t border-zinc-100 mt-1">
                <Link
                  href="/catalog"
                  className="block w-full px-4 py-3 rounded-md text-center text-xs font-semibold uppercase tracking-wider bg-[#0A192F] text-white hover:bg-[#152e52] transition-colors duration-150 shadow-xs"
                >
                  Ver Catálogo Completo
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
