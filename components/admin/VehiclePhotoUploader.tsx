'use client'

// components/admin/VehiclePhotoUploader.tsx
// Componente de subida y gestión de fotos del vehículo para el panel administrativo.
// Soporta subida de archivos (múltiple), drag-and-drop, selección de foto principal y carrete de miniaturas.

import { useState, useRef } from 'react'
import Image from 'next/image'
import {
  UploadCloud,
  X,
  Star,
  Plus,
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
  Camera,
  Images,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface VehiclePhotoUploaderProps {
  thumbnail: string
  images: string[]
  onThumbnailChange: (url: string) => void
  onImagesChange: (urls: string[]) => void
  className?: string
}

export function VehiclePhotoUploader({
  thumbnail,
  images,
  onThumbnailChange,
  onImagesChange,
  className,
}: VehiclePhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlField, setShowUrlField] = useState(false)
  // Separate refs: gallery picker (no capture) and camera capture
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)

  // Lista unificada de fotos: la miniatura principal + la lista de imágenes sin duplicados
  const allPhotos = Array.from(
    new Set([thumbnail, ...images].filter(Boolean))
  )

  // Subir archivos a la API local
  async function handleFilesUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return

    const filesArray = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (filesArray.length === 0) {
      toast.error('Por favor selecciona archivos de imagen válidos (.jpg, .png, .webp)')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    filesArray.forEach((file) => {
      formData.append('files', file)
    })

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok && data.urls && data.urls.length > 0) {
        const newUploadedUrls: string[] = data.urls

        // Si no había foto principal previa, la primera que sube pasa a ser thumbnail
        const currentThumb = thumbnail || newUploadedUrls[0]
        const updatedImages = Array.from(
          new Set([...allPhotos, ...newUploadedUrls])
        )

        onThumbnailChange(currentThumb)
        onImagesChange(updatedImages)

        toast.success(
          newUploadedUrls.length === 1
            ? 'Foto cargada correctamente'
            : `${newUploadedUrls.length} fotos cargadas correctamente`
        )
      } else {
        toast.error(data.error ?? 'Error al procesar la subida de fotos')
      }
    } catch (err) {
      console.error('[Upload Error]:', err)
      toast.error('Ocurrió un fallo de conexión al subir las imágenes')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (cameraInputRef.current) cameraInputRef.current.value = ''
    }
  }

  // Drag & Drop handlers
  function handleDrag(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files)
    }
  }

  // Establecer foto como principal
  function handleSetPrimary(url: string) {
    onThumbnailChange(url)
    // Asegurarse de que esté también en la lista general
    if (!images.includes(url)) {
      onImagesChange([url, ...images.filter((img) => img !== url)])
    }
    toast.success('Foto seleccionada como portada principal')
  }

  // Eliminar foto del carrete
  function handleRemovePhoto(urlToRemove: string) {
    const remaining = allPhotos.filter((url) => url !== urlToRemove)
    onImagesChange(remaining)

    // Si la foto eliminada era la principal, reasignar a la siguiente disponible
    if (thumbnail === urlToRemove) {
      onThumbnailChange(remaining[0] ?? '')
    }
    toast.info('Foto retirada del carrete')
  }

  // Agregar foto vía URL externa directa
  function handleAddFromUrl(e: React.FormEvent) {
    e.preventDefault()
    const cleanUrl = urlInput.trim()
    if (!cleanUrl) return

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('/')) {
      toast.error('Ingresa una URL válida que empiece por https:// o /')
      return
    }

    const updated = Array.from(new Set([...allPhotos, cleanUrl]))
    if (!thumbnail) {
      onThumbnailChange(cleanUrl)
    }
    onImagesChange(updated)
    setUrlInput('')
    setShowUrlField(false)
    toast.success('Foto añadida por enlace')
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Hidden file inputs */}
      {/* Gallery/multi-file picker — no capture attribute so iOS shows gallery */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png, image/jpeg, image/webp, image/avif, image/jpg"
        className="hidden"
        onChange={(e) => handleFilesUpload(e.target.files)}
        disabled={isUploading}
      />
      {/* Camera capture input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/jpg"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFilesUpload(e.target.files)}
        disabled={isUploading}
      />

      {/* ── Zona de Carga — Desktop: Drag & Drop / Mobile: Botones tap ── */}
      {/* Desktop drag zone (hidden on mobile) */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'hidden lg:block relative rounded-lg border-2 border-dashed p-6 text-center transition-all duration-150',
          dragActive
            ? 'border-primary bg-blue-50/40 ring-2 ring-primary/20'
            : 'border-zinc-200 bg-zinc-50/60 hover:bg-zinc-50 hover:border-zinc-300'
        )}
      >
        <div className="flex flex-col items-center justify-center gap-2.5">
          <div className="w-11 h-11 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 shadow-2xs">
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-zinc-700" />
            ) : (
              <UploadCloud className="w-5 h-5 stroke-[1.75]" />
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-zinc-900">
              {isUploading ? 'Procesando y optimizando fotos...' : 'Carga fotos del vehículo'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Arrastra tus fotos aquí o haz clic en el botón de abajo (formatos JPG, PNG, WEBP)
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-700 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Examinar fotos</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUrlField((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <LinkIcon className="w-3 h-3 text-zinc-400" />
              <span>Pegar URL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile upload area (shown only on < lg) */}
      <div className="lg:hidden rounded-lg border border-zinc-200 bg-zinc-50/60 p-4 space-y-3">
        {isUploading ? (
          <div className="flex items-center justify-center gap-2 py-2 text-zinc-600 text-xs font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Procesando y optimizando fotos...</span>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold text-zinc-900 text-center">
              Carga fotos del vehículo
            </p>
            {/* Two buttons: gallery + camera */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2.5 rounded-md bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50"
              >
                <Images className="w-4 h-4" />
                <span>Desde galería</span>
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2.5 rounded-md border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>Tomar foto</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
              iOS: selecciona una foto por sesión y repite para agregar más.
              Pulsa <strong className="text-zinc-500">Desde galería</strong> para subir en lotes.
            </p>
            <button
              type="button"
              onClick={() => setShowUrlField((v) => !v)}
              className="w-full flex items-center justify-center gap-1.5 min-h-[36px] px-3 py-2 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              <LinkIcon className="w-3 h-3 text-zinc-400" />
              <span>Pegar URL de imagen</span>
            </button>
          </>
        )}
      </div>

      {/* Input opcional para pegar URL directa */}
      {showUrlField && (
        <form onSubmit={handleAddFromUrl} className="flex gap-2">
          <input
            type="url"
            placeholder="https://images.unsplash.com/... o /uploads/..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-md bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
          >
            Agregar
          </button>
        </form>
      )}

      {/* ── Carrete de Fotos Cargadas ─────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
            Carrete de Fotos ({allPhotos.length})
          </span>
          <span className="text-[10px] text-zinc-400 hidden sm:block">
            ★ Haz clic en la estrella para definir la foto principal de portada
          </span>
        </div>

        {allPhotos.length === 0 ? (
          <div className="p-6 rounded-md border border-dashed border-zinc-200 text-center bg-zinc-50/50">
            <ImageIcon className="w-6 h-6 mx-auto mb-1.5 text-zinc-300 stroke-[1.5]" />
            <p className="text-xs text-zinc-500 font-medium">Aún no has cargado fotos para este vehículo.</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Sube la foto lateral principal y vistas del interior o exteriores.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allPhotos.map((url, idx) => {
              const isPrimary = url === thumbnail || (idx === 0 && !thumbnail)

              return (
                <div
                  key={url}
                  className={cn(
                    'group relative aspect-[16/10] rounded-lg border bg-zinc-50 overflow-hidden transition-all',
                    isPrimary
                      ? 'border-zinc-900 ring-2 ring-zinc-900/20'
                      : 'border-zinc-200 hover:border-zinc-300'
                  )}
                >
                  <Image
                    src={url}
                    alt={`Foto ${idx + 1}`}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />

                  {/* Badge de Portada Principal */}
                  {isPrimary ? (
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs z-10">
                      <Star className="w-2.5 h-2.5 fill-current text-amber-300" />
                      <span>Portada</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(url)}
                      // Always visible on mobile (touch), reveal-on-hover only on desktop
                      className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-xs text-zinc-700 hover:text-zinc-950 hover:bg-white text-[9px] font-semibold border border-zinc-200 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10 min-h-[28px]"
                      title="Establecer como foto de portada"
                    >
                      Hacer principal
                    </button>
                  )}

                  {/* Botón Eliminar Foto — always visible on mobile */}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(url)}
                    className="absolute top-1.5 right-1.5 p-1.5 rounded bg-black/60 text-white hover:bg-red-600 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-10 min-h-[28px] min-w-[28px] flex items-center justify-center"
                    title="Eliminar esta foto"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Overlay gradiente inferior con número de foto */}
                  <div className="absolute inset-x-0 bottom-0 py-1 px-1.5 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between text-[10px] text-white/90">
                    <span className="font-mono text-[9px]">#{idx + 1}</span>
                    {isPrimary && <span className="text-[9px] text-amber-300 font-medium">Principal</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
