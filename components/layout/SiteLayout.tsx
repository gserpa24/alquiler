'use client'

// components/layout/SiteLayout.tsx
// Shell condicional: en rutas públicas renderiza Navbar general, Footer y FloatingWhatsApp.
// En rutas administrativas (/admin/*), oculta el Navbar general para que solo exista AdminNav.

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FloatingWhatsApp } from '@/components/whatsapp/FloatingWhatsApp'
import { CurrencyProvider } from '@/contexts/CurrencyContext'

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return (
      <CurrencyProvider>
        <main className="flex-1" id="main-content">
          {children}
        </main>
      </CurrencyProvider>
    )
  }

  return (
    <CurrencyProvider>
      <Navbar />
      <main className="flex-1 pt-16" id="main-content">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </CurrencyProvider>
  )
}
