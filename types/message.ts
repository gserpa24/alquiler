// types/message.ts

export type MessageStatus = 'pending' | 'read' | 'replied' | 'archived'

export interface ContactMessage {
  id:         string
  name:       string
  email:      string
  phone?:     string | null
  subject:    string
  message:    string
  status:     MessageStatus
  created_at: string
}

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  pending:  'Pendiente',
  read:     'Leído',
  replied:  'Respondido',
  archived: 'Archivado',
}

export const SUBJECT_LABELS: Record<string, string> = {
  rental:      'Alquiler de vehículos',
  purchase:    'Compra de vehículos',
  maintenance: 'Mantenimiento / Servicio',
  other:       'Otra consulta',
}
