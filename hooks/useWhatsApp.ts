'use client'

// hooks/useWhatsApp.ts
// Hook centralizado para generación y control de acciones WhatsApp en todo el sitio.
// Conecta con SiteConfigContext y gestiona estados habilitado/deshabilitado y toasts.

import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import {
  type VehicleWhatsAppParams,
  type SafeWhatsAppLinkResult,
  isValidWhatsAppNumber,
  getSafeVehicleWhatsAppLink,
  getSafeGenericWhatsAppLink,
} from '@/lib/whatsapp'

export interface UseWhatsAppOptions {
  customWarningMessage?: string
}

export function useWhatsApp(options?: UseWhatsAppOptions) {
  const { config } = useSiteConfig()
  const rawNumber = config.whatsappNumber
  const isConfigured = useMemo(() => isValidWhatsAppNumber(rawNumber), [rawNumber])

  const warningMessage =
    options?.customWarningMessage ?? 'Aún no hay un número configurado.'

  const handleDisabledClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isConfigured) {
        e.preventDefault()
        e.stopPropagation()
        toast.warning(warningMessage)
      }
    },
    [isConfigured, warningMessage]
  )

  const getVehicleLink = useCallback(
    (
      params: Omit<VehicleWhatsAppParams, 'phone'>,
      dateParams?: { pickupDate?: string; returnDate?: string }
    ): SafeWhatsAppLinkResult => {
      return getSafeVehicleWhatsAppLink(params, rawNumber, dateParams)
    },
    [rawNumber]
  )

  const getGenericLink = useCallback(
    (customMessage?: string): SafeWhatsAppLinkResult => {
      return getSafeGenericWhatsAppLink(customMessage, rawNumber)
    },
    [rawNumber]
  )

  return {
    isConfigured,
    whatsappNumber: rawNumber,
    handleDisabledClick,
    getVehicleLink,
    getGenericLink,
  }
}
