// proxy.ts
// Protección de rutas administrativas para el panel /admin (Convención Next.js 16 Proxy)

import { NextResponse, type NextRequest } from 'next/server'
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session'

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Solo interceptar rutas dentro de /admin
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Comprobar token de sesión en cookies
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const { valid } = await verifySessionToken(sessionCookie)

  const isLoginPage = pathname === '/admin/login'

  // Si el usuario ya está autenticado e intenta ir a /admin/login, redirigir al dashboard
  if (isLoginPage && valid) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Si no está autenticado y quiere acceder a cualquier ruta del admin (excepto /admin/login)
  if (!isLoginPage && !valid) {
    const redirectUrl = new URL('/admin/login', request.url)
    if (pathname !== '/admin') {
      redirectUrl.searchParams.set('redirect', `${pathname}${search}`)
    }
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}

export default proxy

