-- ============================================================
-- MIGRACIÓN 0002: Tabla contact_messages y políticas RLS
-- Concesionaria Premium — Bandeja de Contacto
-- ============================================================

-- ── Tipo ENUM para estado de mensaje ─────────────────────────
DO $$ BEGIN
  CREATE TYPE contact_message_status AS ENUM ('pending', 'read', 'replied', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ── Tabla: contact_messages ──────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL CHECK (char_length(trim(name)) >= 2),
  email       TEXT NOT NULL CHECK (char_length(trim(email)) >= 5),
  phone       TEXT,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL CHECK (char_length(trim(message)) >= 10),
  status      contact_message_status NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Índices de rendimiento ───────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- ── Trigger: updated_at automático ───────────────────────────
CREATE TRIGGER contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Inserción pública: cualquier visitante puede enviar un mensaje
CREATE POLICY "contact_messages_public_insert" ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Lectura: solo administradores autenticados
CREATE POLICY "contact_messages_admin_select" ON contact_messages
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Actualización: solo administradores autenticados
CREATE POLICY "contact_messages_admin_update" ON contact_messages
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Eliminación: solo administradores autenticados
CREATE POLICY "contact_messages_admin_delete" ON contact_messages
  FOR DELETE
  USING (auth.role() = 'authenticated');
