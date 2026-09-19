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

import { cn } from '@/lib/utils'
import { type SiteConfig } from '@/lib/site-config'

interface SiteLayoutProps {
  children: React.ReactNode
  initialConfig?: SiteConfig
}

export function SiteLayout({ children, initialConfig }: SiteLayoutProps) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <SiteConfigProvider initialConfig={initialConfig}>
      <CurrencyProvider>
        {!isAdmin && <Navbar />}
        <main className={cn('flex-1', !isAdmin && 'pt-16')} id="main-content">
          {children}
        </main>
        {!isAdmin && (
          <>
            <Footer />
            <FloatingWhatsApp />
          </>
        )}
        <Toaster position="bottom-right" richColors />
      </CurrencyProvider>
    </SiteConfigProvider>
  )
}
