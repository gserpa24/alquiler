'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Car } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/',        label: 'Inicio' },
  { href: '/catalog', label: 'Flota' },
  { href: '/contact', label: 'Contacto' },
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
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-200 bg-white/95 backdrop-blur-md border-b',
        scrolled ? 'border-zinc-200/80 shadow-xs' : 'border-zinc-100',
      )}
    >
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus-visible:outline-none"
          aria-label="Ir al inicio"
        >
          <div className="w-8 h-8 rounded-md bg-[#0A192F] flex items-center justify-center text-white">
            <Car className="w-4 h-4 stroke-[1.75]" aria-hidden="true" />
          </div>
          <span className="text-base font-bold tracking-tight text-zinc-900">
            AUTO<span className="text-[#0A192F] font-bold">RUTA</span>
          </span>
        </Link>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-8" role="list">
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

        {/* CTA desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/catalog"
            className={cn(
              'px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider',
              'bg-[#0A192F] text-white',
              'hover:bg-[#112240] transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0A192F]',
            )}
          >
            Reservar
          </Link>
        </div>

        {/* Hamburger mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="w-5 h-5 stroke-[1.5]" aria-hidden="true" /> : <Menu className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile menu */}
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
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-sm border-t border-zinc-200"
          >
            <ul className="px-4 py-4 flex flex-col gap-1" role="list">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        'block px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors duration-150',
                        isActive
                          ? 'bg-[#0A192F] text-white'
                          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
              <li className="pt-2">
                <Link
                  href="/catalog"
                  className="block px-4 py-2.5 rounded-md text-center text-xs font-semibold uppercase tracking-wider bg-[#0A192F] text-white hover:bg-[#152e52] transition-colors duration-150"
                >
                  Ver Catálogo
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
