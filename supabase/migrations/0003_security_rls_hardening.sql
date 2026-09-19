-- ============================================================
-- MIGRACIÓN 0003: Hardening de Políticas RLS (Seguridad en DB)
-- Concesionaria Premium — Corrección de Broken Access Control
-- ============================================================

-- 1. Hardening en tabla vehicles
DROP POLICY IF EXISTS "vehicles_admin_write" ON vehicles;
CREATE POLICY "vehicles_admin_write" ON vehicles
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'service_role'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- 2. Hardening en tabla contact_messages
DROP POLICY IF EXISTS "contact_messages_admin_select" ON contact_messages;
CREATE POLICY "contact_messages_admin_select" ON contact_messages
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'service_role'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS "contact_messages_admin_update" ON contact_messages;
CREATE POLICY "contact_messages_admin_update" ON contact_messages
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'service_role'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS "contact_messages_admin_delete" ON contact_messages;
CREATE POLICY "contact_messages_admin_delete" ON contact_messages
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'service_role'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );
