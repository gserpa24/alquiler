-- ==========================================
-- MIGRACIÓN 0001: Schema inicial
-- Concesionaria Premium — Catálogo + WhatsApp CTA
-- Ejecutar: npx supabase db push
-- ==========================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Tipos ENUM ────────────────────────────────────────────────
CREATE TYPE vehicle_category   AS ENUM ('sedan', 'suv', 'pickup_4x4', 'sport');
CREATE TYPE fuel_type          AS ENUM ('gasoline', 'diesel', 'hybrid', 'electric');
CREATE TYPE transmission_type  AS ENUM ('automatic', 'manual', 'cvt');

-- available:   libre para alquiler/venta
-- rented:      actualmente con un cliente
-- maintenance: en taller, no disponible
-- sold:        vendido (oculto en catálogo público por RLS)
CREATE TYPE vehicle_status AS ENUM ('available', 'rented', 'maintenance', 'sold');

-- ── Tabla principal: vehicles ─────────────────────────────────
CREATE TABLE vehicles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,          -- 'toyota-hilux-2024-negro'
  brand        TEXT NOT NULL,                 -- 'Toyota'
  model        TEXT NOT NULL,                 -- 'Hilux'
  year         SMALLINT NOT NULL CHECK (year >= 1990 AND year <= 2030),
  category     vehicle_category NOT NULL,
  transmission transmission_type NOT NULL,
  fuel         fuel_type NOT NULL,
  seats        SMALLINT NOT NULL DEFAULT 5 CHECK (seats >= 2 AND seats <= 9),
  daily_rate   NUMERIC(10,2) CHECK (daily_rate > 0), -- NULL si solo está en venta
  sale_price   NUMERIC(12,2) CHECK (sale_price > 0), -- NULL si solo está en alquiler
  mileage      INTEGER NOT NULL DEFAULT 0 CHECK (mileage >= 0),
  color        TEXT,
  features     TEXT[] NOT NULL DEFAULT '{}',  -- ['GPS', 'Climatizador', 'Cámara 360']
  images       TEXT[] NOT NULL DEFAULT '{}',  -- URLs de Supabase Storage
  thumbnail    TEXT NOT NULL,                 -- URL imagen principal (requerida)
  description  TEXT,
  status       vehicle_status NOT NULL DEFAULT 'available',
  is_featured  BOOLEAN NOT NULL DEFAULT FALSE, -- Sección "Destacados" en landing
  sort_order   SMALLINT NOT NULL DEFAULT 0,   -- Orden manual en catálogo
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Al menos un precio debe estar definido
  CONSTRAINT at_least_one_price CHECK (daily_rate IS NOT NULL OR sale_price IS NOT NULL)
);

-- ── Índices de rendimiento ────────────────────────────────────
CREATE INDEX idx_vehicles_status    ON vehicles(status);
CREATE INDEX idx_vehicles_category  ON vehicles(category);
CREATE INDEX idx_vehicles_featured  ON vehicles(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_vehicles_sort      ON vehicles(sort_order, created_at DESC);
CREATE INDEX idx_vehicles_slug      ON vehicles(slug);

-- ── Trigger: updated_at automático ───────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Lectura pública: todos pueden ver vehículos que NO estén vendidos
CREATE POLICY "vehicles_public_read" ON vehicles
  FOR SELECT USING (status != 'sold');

-- Escritura: solo service_role o usuarios con app_metadata->>'role' = 'admin'
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
