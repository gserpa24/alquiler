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
    const cookies = document.cookie.split(';')
    for (const c of cookies) {
      const [k, v] = c.trim().split('=')
      if (k === SITE_CONFIG_COOKIE_NAME && v) {
        return parseSiteConfig(v)
      }
    }
    const local = window.localStorage.getItem(SITE_CONFIG_COOKIE_NAME)
    if (local) return parseSiteConfig(local)
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

  // Sincronizar en cliente si hay cookie o evento de actualización
  useEffect(() => {
    function handleSync() {
      const client = readClientConfig()
      if (client) {
        setConfig((prev) => ({ ...prev, ...client }))
      }
    }

    handleSync()
    window.addEventListener('storage', handleSync)
    window.addEventListener('autoruta_config_updated', handleSync)
    return () => {
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
