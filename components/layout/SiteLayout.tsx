'use client'

// components/layout/SiteLayout.tsx
// Shell condicional: en rutas públicas renderiza Navbar general, Footer y FloatingWhatsApp.
// En rutas administrativas (/admin/*), oculta el Navbar general para que solo exista AdminNav.

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FloatingWhatsApp } from '@/components/whatsapp/FloatingWhatsApp'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { SiteConfigProvider } from '@/contexts/SiteConfigContext'
import { Toaster } from '@/components/ui/sonner'

import { type SiteConfig } from '@/lib/site-config'

interface SiteLayoutProps {
  children: React.ReactNode
  initialConfig?: SiteConfig
}

export function SiteLayout({ children, initialConfig }: SiteLayoutProps) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return (
      <SiteConfigProvider initialConfig={initialConfig}>
        <CurrencyProvider>
          <main className="flex-1" id="main-content">
            {children}
          </main>
        </CurrencyProvider>
      </SiteConfigProvider>
    )
  }

  return (
    <SiteConfigProvider initialConfig={initialConfig}>
      <CurrencyProvider>
        <Navbar />
        <main className="flex-1 pt-16" id="main-content">
          {children}
        </main>
        <Footer />
        <FloatingWhatsApp />
        <Toaster position="bottom-right" richColors />
      </CurrencyProvider>
    </SiteConfigProvider>
  )
}
