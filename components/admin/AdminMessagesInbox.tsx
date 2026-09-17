'use client'

// components/admin/AdminMessagesInbox.tsx
// Bandeja de entrada de mensajes de contacto para el Panel Administrativo.

import { useState, useTransition } from 'react'
import {
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  ExternalLink,
  MessageCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  type ContactMessage,
  type MessageStatus,
  MESSAGE_STATUS_LABELS,
  SUBJECT_LABELS,
} from '@/types/message'
import {
  updateMessageStatusAction,
  deleteMessageAction,
} from '@/app/actions/admin-messages'
import { cn } from '@/lib/utils'

interface AdminMessagesInboxProps {
  initialMessages: ContactMessage[]
}

const STATUS_CONFIG: Record<
  MessageStatus,
  { label: string; bg: string; text: string; border: string; icon: typeof Clock }
> = {
  pending: {
    label: 'Pendiente',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: Clock,
  },
  read: {
    label: 'Leído',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: Mail,
  },
  replied: {
    label: 'Respondido',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: CheckCircle2,
  },
  archived: {
    label: 'Archivado',
    bg: 'bg-zinc-100',
    text: 'text-zinc-600',
    border: 'border-zinc-200',
    icon: Archive,
  },
}

export function AdminMessagesInbox({ initialMessages }: AdminMessagesInboxProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isPending, startTransition] = useTransition()

  // Filtrado
  const filteredMessages = messages.filter((msg) => {
    if (filterStatus !== 'all' && msg.status !== filterStatus) return false
    if (!searchQuery.trim()) return true

    const q = searchQuery.toLowerCase()
    return (
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      (msg.phone && msg.phone.toLowerCase().includes(q)) ||
      msg.message.toLowerCase().includes(q)
    )
  })

  // Handlers
  function handleStatusChange(id: string, newStatus: MessageStatus) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    )

    startTransition(async () => {
      const res = await updateMessageStatusAction(id, newStatus)
      if (res.success) {
        toast.success(`Mensaje marcado como "${MESSAGE_STATUS_LABELS[newStatus]}"`)
      } else {
        toast.error('No se pudo actualizar el estado')
      }
    })
  }

  function handleDelete(id: string) {
    if (!window.confirm('¿Seguro que deseas eliminar este mensaje?')) return

    setMessages((prev) => prev.filter((m) => m.id !== id))

    startTransition(async () => {
      const res = await deleteMessageAction(id)
      if (res.success) {
        toast.success('Mensaje eliminado')
      } else {
        toast.error('No se pudo eliminar el mensaje')
      }
    })
  }

  // Generar link WhatsApp para responder
  function buildReplyWhatsAppUrl(msg: ContactMessage): string | null {
    if (!msg.phone) return null
    const cleanPhone = msg.phone.replace(/\D/g, '')
    if (cleanPhone.length < 8) return null

    const text = `¡Hola ${msg.name}! Te saludamos de AutoRuta en respuesta a tu consulta sobre ${SUBJECT_LABELS[msg.subject] ?? 'nuestros servicios'}. ¿Cómo podemos ayudarte?`
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
  }

  return (
    <div className="space-y-4">
      {/* ── Barra de Búsqueda y Filtros ── */}
      <div className="bg-white rounded-lg border border-zinc-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, email, teléfono o mensaje..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-md bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#0A192F] focus:bg-white transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors',
              filterStatus === 'all'
                ? 'bg-[#0A192F] text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            )}
          >
            Todos ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors',
              filterStatus === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            )}
          >
            Pendientes ({messages.filter((m) => m.status === 'pending').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('read')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors',
              filterStatus === 'read'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
            )}
          >
            Leídos ({messages.filter((m) => m.status === 'read').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('replied')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors',
              filterStatus === 'replied'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            )}
          >
            Respondidos ({messages.filter((m) => m.status === 'replied').length})
          </button>
        </div>
      </div>

      {/* ── Lista de Mensajes ── */}
      {filteredMessages.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-zinc-200">
          <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-zinc-900">No se encontraron mensajes</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {searchQuery
              ? 'Intenta con otros términos de búsqueda.'
              : 'Cuando los clientes envíen el formulario de contacto, aparecerán aquí.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const config = STATUS_CONFIG[msg.status] || STATUS_CONFIG.pending
            const StatusIcon = config.icon
            const waUrl = buildReplyWhatsAppUrl(msg)

            const formattedDate = new Date(msg.created_at).toLocaleString('es-PE', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })

            return (
              <div
                key={msg.id}
                className={cn(
                  'bg-white rounded-lg border transition-all p-5 shadow-2xs space-y-3',
                  msg.status === 'pending'
                    ? 'border-amber-300 ring-1 ring-amber-100'
                    : 'border-zinc-200'
                )}
              >
                {/* Header de la tarjeta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-sm text-zinc-950">{msg.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {SUBJECT_LABELS[msg.subject] ?? msg.subject}
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border',
                        config.bg,
                        config.text,
                        config.border
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {/* Datos de contacto */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600">
                  <a
                    href={`mailto:${msg.email}?subject=Respuesta a tu consulta en AutoRuta`}
                    className="inline-flex items-center gap-1.5 hover:text-zinc-950 font-medium hover:underline"
                    title="Enviar correo"
                  >
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{msg.email}</span>
                  </a>

                  {msg.phone ? (
                    <div className="inline-flex items-center gap-1.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{msg.phone}</span>
                    </div>
                  ) : (
                    <span className="text-zinc-400 italic">Sin teléfono</span>
                  )}
                </div>

                {/* Contenido del Mensaje */}
                <div className="p-3.5 rounded-md bg-zinc-50 border border-zinc-100 text-xs text-zinc-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.message}
                </div>

                {/* Barra de Acciones */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
                  {/* Acciones de Contacto Rápido */}
                  <div className="flex items-center gap-2">
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          if (msg.status === 'pending') {
                            handleStatusChange(msg.id, 'replied')
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                        title="Abrir chat en WhatsApp con mensaje preparado"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Responder WhatsApp</span>
                        <ExternalLink className="w-3 h-3 text-emerald-200" />
                      </a>
                    )}

                    <a
                      href={`mailto:${msg.email}?subject=Respuesta a tu consulta en AutoRuta&body=Hola ${msg.name}, gracias por contactar a AutoRuta.`}
                      onClick={() => {
                        if (msg.status === 'pending') {
                          handleStatusChange(msg.id, 'replied')
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-200 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                      title="Abrir cliente de correo"
                    >
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Responder Email</span>
                    </a>
                  </div>

                  {/* Selector de Estado y Botón Eliminar */}
                  <div className="flex items-center gap-2 ml-auto">
                    <select
                      value={msg.status}
                      onChange={(e) =>
                        handleStatusChange(msg.id, e.target.value as MessageStatus)
                      }
                      disabled={isPending}
                      className="px-2.5 py-1.5 rounded-md bg-white border border-zinc-200 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-[#0A192F] cursor-pointer"
                      title="Cambiar estado del mensaje"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="read">Leído</option>
                      <option value="replied">Respondido</option>
                      <option value="archived">Archivado</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDelete(msg.id)}
                      disabled={isPending}
                      className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Eliminar mensaje"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
