import 'server-only'

// lib/site-config-server.ts
// Persistencia en sistema de archivos exclusiva para el servidor (Node.js).

import fs from 'fs'
import path from 'path'
import {
  type SiteConfig,
  DEFAULT_SITE_CONFIG,
  parseSiteConfig,
} from './site-config'

/**
 * Obtiene la configuración desde el archivo local o valores por defecto.
 */
export async function getSiteConfigFile(): Promise<SiteConfig> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'site-config.json')
    if (fs.existsSync(filePath)) {
      const content = await fs.promises.readFile(filePath, 'utf-8')
      return parseSiteConfig(content)
    }
  } catch {
    // Fallback
  }
  return { ...DEFAULT_SITE_CONFIG }
}

/**
 * Escribe la configuración al archivo data/site-config.json.
 */
export async function writeSiteConfigFile(config: SiteConfig): Promise<void> {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      await fs.promises.mkdir(dataDir, { recursive: true })
    }
    const filePath = path.join(dataDir, 'site-config.json')
    await fs.promises.writeFile(filePath, JSON.stringify(config, null, 2), 'utf-8')
  } catch (error) {
    console.error('[writeSiteConfigFile Error]:', error)
  }
}
