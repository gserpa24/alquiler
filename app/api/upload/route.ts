import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
])

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(request: NextRequest) {
  try {
    // 1. Validar autenticación de administrador (Broken Access Control prevention)
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
    const { valid } = await verifySessionToken(sessionCookie)
    if (!valid) {
      return NextResponse.json(
        { error: 'No autorizado: se requiere sesión de administrador' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      const singleFile = formData.get('file') as File | null
      if (singleFile) {
        files.push(singleFile)
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No se enviaron archivos para subir' },
        { status: 400 }
      )
    }

    const uploadedUrls: string[] = []
    const isSupabaseConfigured = Boolean(
      (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ||
        (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY))
    )

    let supabaseAdmin: ReturnType<typeof createAdminClient> | null = null
    if (isSupabaseConfigured) {
      try {
        supabaseAdmin = createAdminClient()
      } catch (err) {
        console.warn('[Upload] No se pudo inicializar Supabase admin, usando almacenamiento local:', err)
      }
    }

    for (const file of files) {
      // 2. Validar tamaño máximo permitido
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `El archivo supera el tamaño máximo permitido de 5MB` },
          { status: 400 }
        )
      }

      // 3. Validar tipo MIME y extensión de archivo permitida
      const ext = path.extname(file.name).toLowerCase() || '.jpg'
      if (!ALLOWED_MIME_TYPES.has(file.type) || !ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { error: `Tipo de archivo no permitido. Solo se admiten JPG, PNG, WEBP y AVIF.` },
          { status: 400 }
        )
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Sanitizar nombre base del archivo contra Path Traversal
      const sanitizedBase = path
        .basename(file.name, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 30)

      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const fileName = `${sanitizedBase || 'vehiculo'}-${uniqueSuffix}${ext}`

      // Si Supabase Storage está disponible, subir al bucket 'vehicles'
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin.storage
          .from('vehicles')
          .upload(fileName, buffer, {
            contentType: file.type,
            upsert: true,
          })

        if (!error && data) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('vehicles')
            .getPublicUrl(fileName)

          if (publicUrlData?.publicUrl) {
            uploadedUrls.push(publicUrlData.publicUrl)
            continue
          }
        } else if (error) {
          console.error('[Upload] Error al subir a Supabase Storage:', error.message)
        }
      }

      // Fallback a almacenamiento en sistema de archivos local
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadDir, { recursive: true })
        const filePath = path.join(uploadDir, fileName)
        await writeFile(filePath, buffer)
        uploadedUrls.push(`/uploads/${fileName}`)
      } catch (fsErr) {
        console.error('[Upload] Fallback local falló (común en serverless):', fsErr)
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: 'No se pudo procesar ninguna imagen' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0],
    })
  } catch (error) {
    console.error('[Upload API Error]:', error)
    return NextResponse.json(
      { error: 'Error al procesar la subida de imágenes' },
      { status: 500 }
    )
  }
}
