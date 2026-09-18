import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SiteLayout } from '@/components/layout/SiteLayout'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

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
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
      className={`${inter.variable} ${playfair.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 antialiased selection:bg-slate-900 selection:text-white">
        <SiteLayout>{children}</SiteLayout>
        <Analytics />
      </body>
    </html>
  )
}
