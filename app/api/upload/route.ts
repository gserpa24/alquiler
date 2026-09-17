import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      // Probar si enviaron un solo archivo con nombre 'file'
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

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const uploadedUrls: string[] = []

    for (const file of files) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        continue
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Extensión y nombre único seguro
      const ext = path.extname(file.name) || '.jpg'
      const sanitizedBase = path
        .basename(file.name, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 30)

      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const fileName = `${sanitizedBase || 'vehiculo'}-${uniqueSuffix}${ext}`
      const filePath = path.join(uploadDir, fileName)

      await writeFile(filePath, buffer)
      uploadedUrls.push(`/uploads/${fileName}`)
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: 'Ningún archivo de imagen válido fue procesado' },
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
