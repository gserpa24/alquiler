// lib/supabase/storage.ts
// Utilidades de gestión del bucket de almacenamiento 'vehicles' en Supabase Storage (S3).
// Permite extraer rutas de objetos y eliminar archivos para evitar que queden huérfanos.

import { unlink } from 'fs/promises'
import path from 'path'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Extrae el nombre o path relativo de un archivo en el bucket de Supabase Storage.
 *
 * Soporta diversos formatos de URL de Supabase:
 * - https://<project>.supabase.co/storage/v1/object/public/vehicles/foto-123.jpg -> "foto-123.jpg"
 * - https://<project>.supabase.co/storage/v1/object/authenticated/vehicles/subfolder/foto-123.jpg -> "subfolder/foto-123.jpg"
 * - https://<project>.supabase.co/storage/v1/object/sign/vehicles/foto-123.jpg?token=... -> "foto-123.jpg"
 * - https://<project>.supabase.co/storage/v1/render/image/public/vehicles/foto-123.jpg -> "foto-123.jpg"
 *
 * Retorna null si la URL no pertenece al bucket de Supabase Storage (ej. Unsplash, URLs externas).
 */
export function extractStoragePath(url: string, bucket = 'vehicles'): string | null {
  if (!url || typeof url !== 'string') return null

  const markers = [
    `/storage/v1/object/public/${bucket}/`,
    `/storage/v1/object/authenticated/${bucket}/`,
    `/storage/v1/object/sign/${bucket}/`,
    `/storage/v1/render/image/public/${bucket}/`,
  ]

  for (const marker of markers) {
    const idx = url.indexOf(marker)
    if (idx !== -1) {
      const raw = url.substring(idx + marker.length)
      const clean = raw.split('?')[0].split('#')[0]
      return decodeURIComponent(clean)
    }
  }

  return null
}

/**
 * Elimina una lista de URLs de imágenes tanto de Supabase Storage (S3) como del almacenamiento local.
 * No lanza excepciones para garantizar que los flujos de eliminación o edición continúen sin interrupciones.
 */
export async function deleteStorageFiles(
  urls: string[],
  bucket = 'vehicles'
): Promise<{ deleted: string[]; failed: string[] }> {
  const deleted: string[] = []
  const failed: string[] = []

  if (!urls || urls.length === 0) {
    return { deleted, failed }
  }

  const supabasePaths: string[] = []
  const localFileNames: string[] = []

  for (const url of urls) {
    const sPath = extractStoragePath(url, bucket)
    if (sPath) {
      supabasePaths.push(sPath)
    } else if (url.startsWith('/uploads/')) {
      const fileName = url.replace('/uploads/', '').split('?')[0]
      if (fileName && !fileName.includes('..')) {
        localFileNames.push(fileName)
      }
    }
  }

  // 1. Eliminar objetos en Supabase Storage (S3)
  if (supabasePaths.length > 0) {
    try {
      const isSupabaseConfigured = Boolean(
        (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
        (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      )

      if (isSupabaseConfigured) {
        const supabase = createAdminClient()
        const { error } = await supabase.storage.from(bucket).remove(supabasePaths)
        if (error) {
          console.error('[Storage Error] No se pudieron eliminar archivos en Supabase:', error.message)
          failed.push(...supabasePaths)
        } else {
          deleted.push(...supabasePaths)
        }
      }
    } catch (err) {
      console.error('[Storage Error] Excepción al eliminar en Supabase Storage:', err)
      failed.push(...supabasePaths)
    }
  }

  // 2. Eliminar de fallback local (si aplica)
  for (const localName of localFileNames) {
    try {
      const localPath = path.join(process.cwd(), 'public', 'uploads', localName)
      await unlink(localPath)
      deleted.push(localName)
    } catch {
      // Ignorar silenciosamente si el archivo no existe
    }
  }

  return { deleted, failed }
}
