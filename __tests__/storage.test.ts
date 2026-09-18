// __tests__/storage.test.ts
import { describe, it, expect } from 'vitest'
import { extractStoragePath, deleteStorageFiles } from '@/lib/supabase/storage'

describe('extractStoragePath', () => {
  it('extrae correctamente el path de una URL pública de Supabase Storage', () => {
    const url = 'https://my-ref.supabase.co/storage/v1/object/public/vehicles/toyota-hilux-12345.jpg'
    expect(extractStoragePath(url)).toBe('toyota-hilux-12345.jpg')
  })

  it('extrae correctamente el path con subdirectorios', () => {
    const url = 'https://my-ref.supabase.co/storage/v1/object/public/vehicles/flota/kia-rio-2024.webp'
    expect(extractStoragePath(url)).toBe('flota/kia-rio-2024.webp')
  })

  it('remueve query params de URLs firmadas o con tokens', () => {
    const url = 'https://my-ref.supabase.co/storage/v1/object/sign/vehicles/auto-test.jpg?token=abc123xyz'
    expect(extractStoragePath(url)).toBe('auto-test.jpg')
  })

  it('retorna null para URLs externas que no son de Supabase Storage', () => {
    expect(extractStoragePath('https://images.unsplash.com/photo-123456789')).toBeNull()
    expect(extractStoragePath('https://example.com/imagen.jpg')).toBeNull()
    expect(extractStoragePath('')).toBeNull()
  })
})

describe('deleteStorageFiles', () => {
  it('maneja listas vacías sin errores', async () => {
    const res = await deleteStorageFiles([])
    expect(res.deleted).toEqual([])
    expect(res.failed).toEqual([])
  })

  it('ignora URLs externas que no pertenecen al bucket', async () => {
    const res = await deleteStorageFiles([
      'https://images.unsplash.com/photo-123',
      'https://cdn.pixabay.com/image.jpg',
    ])
    expect(res.deleted).toEqual([])
    expect(res.failed).toEqual([])
  })
})
