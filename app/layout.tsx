import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FloatingWhatsApp } from '@/components/whatsapp/FloatingWhatsApp'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-inter',
  display:  'swap',
})

const playfair = Playfair_Display({
  subsets:  ['latin'],
  variable: '--font-playfair',
  display:  'swap',
  weight:   ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Premium Auto',
    default:  'Premium Auto — Venta y Alquiler de Vehículos',
  },
  description:
    'Concesionaria especializada en sedanes premium, SUVs y pickups 4x4. Contáctanos por WhatsApp para consultar disponibilidad y condiciones.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),
  openGraph: {
    siteName: 'Premium Auto',
    locale:   'es_EC',
    type:     'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index:  true,
    follow: true,
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 antialiased selection:bg-slate-900 selection:text-white">
        <Navbar />
        <main className="flex-1 pt-16 lg:pt-20" id="main-content">
          {children}
        </main>
        <Footer />
        <FloatingWhatsApp />
        <Toaster
          position="bottom-left"
          toastOptions={{
            classNames: {
              toast: 'bg-white border border-zinc-200 text-zinc-900 shadow-sm rounded-md',
            },
          }}
        />
      </body>
    </html>
  )
}
