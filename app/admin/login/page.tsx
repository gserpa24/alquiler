'use client'

// app/admin/login/page.tsx
// Pantalla de inicio de sesión segura para el Panel Administrativo

import { useState, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { loginAdminAction } from '@/app/actions/auth-actions'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage('Por favor ingresa tanto tu correo como tu contraseña.')
      return
    }

    startTransition(async () => {
      const result = await loginAdminAction({ email, password })

      if (result.success) {
        toast.success('¡Bienvenido! Accediendo al panel...')
        router.push(redirectPath)
        router.refresh()
      } else {
        const error = result.error || 'Credenciales inválidas. Verifica tus datos.'
        setErrorMessage(error)
        toast.error(error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* Campo Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5"
        >
          Correo Electrónico
        </label>
        <div className="relative rounded-lg shadow-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <Mail className="h-4 w-4" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@autoruta.pe"
            className="block w-full rounded-lg border border-zinc-300 pl-10 pr-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0A192F] focus:outline-none focus:ring-1 focus:ring-[#0A192F] transition-colors"
          />
        </div>
      </div>

      {/* Campo Contraseña */}
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5"
        >
          Contraseña
        </label>
        <div className="relative rounded-lg shadow-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <Lock className="h-4 w-4" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="block w-full rounded-lg border border-zinc-300 pl-10 pr-10 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0A192F] focus:outline-none focus:ring-1 focus:ring-[#0A192F] transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#0A192F] text-white text-sm font-semibold hover:bg-[#152e52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A192F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Verificando...</span>
          </>
        ) : (
          <>
            <span>Ingresar al Panel</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Cabecera / Identidad */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0A192F] text-white shadow-md mx-auto mb-2">
            <ShieldCheck className="w-8 h-8 stroke-[1.75]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Acceso Administrativo
          </h1>
          <p className="text-sm text-zinc-500">
            Ingresa tus credenciales autorizadas para gestionar la flota de AUTORUTA.
          </p>
        </div>

        {/* Tarjeta de Login envuelta en Suspense */}
        <div className="bg-white py-8 px-6 shadow-sm border border-zinc-200 rounded-2xl sm:px-10">
          <Suspense
            fallback={
              <div className="py-8 text-center text-xs text-zinc-400">
                Cargando formulario seguro...
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>

        {/* Enlace de regreso al catálogo */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la página principal de AUTORUTA</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
