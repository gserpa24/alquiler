'use client'

// contexts/SiteConfigContext.tsx
// Estado global reactivo para la configuración del sitio (marca, contacto, horarios y redes).

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useTransition,
  useCallback,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import {
  type SiteConfig,
  DEFAULT_SITE_CONFIG,
  SITE_CONFIG_COOKIE_NAME,
  parseSiteConfig,
  serializeSiteConfig,
} from '@/lib/site-config'
import {
  updateSiteConfigAction,
  resetSiteConfigAction,
} from '@/app/actions/site-config'

function readClientConfig(): SiteConfig | null {
  if (typeof window === 'undefined') return null
  try {
    // 1. Priorizar localStorage
    const local = window.localStorage.getItem(SITE_CONFIG_COOKIE_NAME)
    if (local) {
      const parsed = parseSiteConfig(local)
      if (parsed.whatsappNumber || parsed.phone) return parsed
    }

    // 2. Cookie de respaldo
    const cookies = document.cookie.split(';')
    for (const c of cookies) {
      const idx = c.indexOf('=')
      if (idx === -1) continue
      const k = c.slice(0, idx).trim()
      const v = c.slice(idx + 1).trim()
      if (k === SITE_CONFIG_COOKIE_NAME && v) {
        const parsed = parseSiteConfig(v)
        if (parsed.whatsappNumber || parsed.phone) return parsed
      }
    }
  } catch {
    // fallback
  }
  return null
}

interface SiteConfigContextValue {
  config: SiteConfig
  updateConfig: (updates: Partial<SiteConfig>) => Promise<boolean>
  resetConfig: () => Promise<boolean>
  isPending: boolean
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null)

interface SiteConfigProviderProps {
  children: ReactNode
  initialConfig?: SiteConfig
}

export function SiteConfigProvider({
  children,
  initialConfig,
}: SiteConfigProviderProps) {
  const [config, setConfig] = useState<SiteConfig>(() => {
    if (initialConfig && (initialConfig.whatsappNumber || initialConfig.phone)) {
      return initialConfig
    }
    const client = readClientConfig()
    if (client && (client.whatsappNumber || client.phone)) {
      return client
    }
    return initialConfig ?? DEFAULT_SITE_CONFIG
  })
  const [isPending, startTransition] = useTransition()

  // Sincronización proactiva con la API del servidor y eventos en tiempo real
  useEffect(() => {
    let isMounted = true

    async function fetchServerConfig() {
      try {
        const res = await fetch('/api/site-config', { cache: 'no-store' })
        if (res.ok) {
          const data: SiteConfig = await res.json()
          if (isMounted && data && (data.whatsappNumber || data.phone)) {
            setConfig((prev) => {
              if (
                prev.whatsappNumber === data.whatsappNumber &&
                prev.phone === data.phone &&
                prev.brandName === data.brandName
              ) {
                return prev
              }
              return { ...prev, ...data }
            })
            try {
              window.localStorage.setItem(
                SITE_CONFIG_COOKIE_NAME,
                JSON.stringify(data)
              )
            } catch {
              // ignore
            }
          }
        }
      } catch {
        const client = readClientConfig()
        if (isMounted && client && (client.whatsappNumber || client.phone)) {
          setConfig((prev) => ({ ...prev, ...client }))
        }
      }
    }

    // Consulta inmediata al montar
    fetchServerConfig()

    function handleSync() {
      const client = readClientConfig()
      if (client && (client.whatsappNumber || client.phone)) {
        setConfig((prev) => ({ ...prev, ...client }))
      } else {
        fetchServerConfig()
      }
    }

    window.addEventListener('storage', handleSync)
    window.addEventListener('autoruta_config_updated', handleSync)
    return () => {
      isMounted = false
      window.removeEventListener('storage', handleSync)
      window.removeEventListener('autoruta_config_updated', handleSync)
    }
  }, [])

  const updateConfig = useCallback(
    async (updates: Partial<SiteConfig>): Promise<boolean> => {
      // Actualización optimista
      const previous = config
      const optimistic: SiteConfig = {
        ...config,
        ...updates,
      }
      setConfig(optimistic)

      return new Promise<boolean>((resolve) => {
        startTransition(async () => {
          try {
            const result = await updateSiteConfigAction(updates)
            if (!result.success) {
              setConfig(previous)
              toast.error(result.error ?? 'No se pudo guardar la configuración')
              resolve(false)
              return
            }

            if (result.config) {
              setConfig(result.config)
              if (typeof window !== 'undefined') {
                try {
                  window.localStorage.setItem(
                    SITE_CONFIG_COOKIE_NAME,
                    serializeSiteConfig(result.config)
                  )
                  window.dispatchEvent(new Event('autoruta_config_updated'))
                } catch {
                  // ignore
                }
              }
            }
            toast.success('Configuración guardada exitosamente')
            resolve(true)
          } catch {
            setConfig(previous)
            toast.error('Error de red al guardar la configuración')
            resolve(false)
          }
        })
      })
    },
    [config]
  )

  const resetConfig = useCallback(async (): Promise<boolean> => {
    const previous = config
    setConfig(DEFAULT_SITE_CONFIG)

    return new Promise<boolean>((resolve) => {
      startTransition(async () => {
        try {
          const result = await resetSiteConfigAction()
          if (!result.success) {
            setConfig(previous)
            toast.error(result.error ?? 'No se pudo restablecer la configuración')
            resolve(false)
            return
          }

          if (result.config) {
            setConfig(result.config)
            if (typeof window !== 'undefined') {
              try {
                window.localStorage.removeItem(SITE_CONFIG_COOKIE_NAME)
                window.dispatchEvent(new Event('autoruta_config_updated'))
              } catch {
                // ignore
              }
            }
          }
          toast.success('Configuración restablecida a valores por defecto')
          resolve(true)
        } catch {
          setConfig(previous)
          toast.error('Error de red al restablecer la configuración')
          resolve(false)
        }
      })
    })
  }, [config])

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        isPending,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useSiteConfig(): SiteConfigContextValue {
  const context = useContext(SiteConfigContext)
  if (!context) {
    return {
      config: DEFAULT_SITE_CONFIG,
      updateConfig: async () => false,
      resetConfig: async () => false,
      isPending: false,
    }
  }
  return context
}
