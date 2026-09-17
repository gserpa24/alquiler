# Guía de Arquitectura e Infraestructura de Producción

Esta guía detalla la configuración técnica, infraestructura en la nube y mecanismos de seguridad de la plataforma **Concesionaria Premium / Alquiler**.

---

## 1. Resumen del Stack Tecnológico

| Capa | Tecnología | Función |
|---|---|---|
| **Frontend & Backend** | Next.js 15 (App Router, Turbopack) | Renderizado híbrido (SSR/SSG), Server Components y Server Actions |
| **Lenguaje** | TypeScript 5 (Strict Mode) | Tipado estricto de extremo a extremo sin `any` |
| **Estilos & UI** | Tailwind CSS v4 + Framer Motion | Design tokens premium, modo oscuro y animaciones fluidas |
| **Base de Datos** | PostgreSQL 16 (Supabase) | Base de datos relacional con Row Level Security (RLS) |
| **Almacenamiento (Storage)** | Supabase Storage (Bucket `vehicles`) | Almacenamiento persistente de fotografías de vehículos |
| **Autenticación** | Supabase Auth + `@supabase/ssr` | Sesiones con cookies HTTP-only para el panel administrativo |
| **Hosting & CI/CD** | Vercel Edge & Serverless Functions | Despliegues automáticos conectados a GitHub |
| **Control de Versiones** | GitHub (`gserpa24/alquiler`) | Repositorio remoto con ramas `main` y `dev` |

---

## 2. Infraestructura en la Nube

### 2.1 Vercel
- **Dominio de Producción:** `https://alquiler-inky.vercel.app`
- **Proyecto:** `alquiler` (Equipo `gserpa24s-projects`)
- **Framework Preset:** `Next.js` (con Node.js 22.x)
- **Integración Nativa:** Conectado directamente a la base de datos de Supabase.

### 2.2 Supabase
- **URL del Proyecto:** Inyectada en `NEXT_PUBLIC_SUPABASE_URL`
- **Políticas de Seguridad (RLS):**
  - Lectura pública: Permitida para vehículos con estado distinto a `sold`.
  - Escritura y modificaciones: Exclusivas para usuarios autenticados o a través de `SUPABASE_SERVICE_ROLE_KEY` desde el servidor seguro.
- **Storage:** Bucket público `vehicles` para acceso directo de imágenes optimizadas con `next/image`.

---

## 3. Variables de Entorno

Las siguientes variables están inyectadas en Vercel (Producción) y en el entorno local (`.env.local`):

| Variable | Tipo | Descripción |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública | Clave anónima para lecturas públicas seguras |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secreta (Servidor)** | Clave con permisos administrativos (bypasses RLS en el backend) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Pública | Teléfono en formato internacional para contacto vía WhatsApp |
| `NEXT_PUBLIC_SITE_URL` | Pública | Dominio base para metadatos y SEO |

> ⚠️ **REGLA DE ORO:** `SUPABASE_SERVICE_ROLE_KEY` nunca debe exponerse con el prefijo `NEXT_PUBLIC_` ni utilizarse en código del cliente (navegador).

---

## 4. Almacenamiento de Fotos (Flujo de Subida)

1. El usuario selecciona fotos en el formulario del panel administrativo.
2. La ruta API `/api/upload` recibe los binarios en el servidor.
3. Si Supabase Storage está activo, el archivo se envía al bucket `vehicles` mediante el cliente administrativo (`lib/supabase/admin.ts`).
4. Supabase Storage retorna la URL pública permanente con HTTPS.
5. Dicha URL se asigna como `thumbnail` o se añade al arreglo `images` del vehículo en PostgreSQL.
6. En caso de entorno local sin conexión a Supabase, el sistema cuenta con fallback automático a la carpeta `public/uploads`.

---

## 5. Historial de Soluciones Críticas Implementadas

1. **Corrección de Error 404 inicial en Vercel:**
   - Causa: Vercel configuró el preset en `Other` y solo desplegó la carpeta estática.
   - Solución: Se actualizó el preset a `nextjs` y se deshabilitó la protección SSO para permitir acceso público directo.
2. **Compatibilidad de Imágenes Supabase en Next.js:**
   - Se registró el patrón `**.supabase.co` en `next.config.ts` para que el componente `<Image />` de Next.js procese y optimice las fotografías de Supabase Storage.
3. **Persistencia Híbrida en queries:**
   - La capa de datos en `lib/supabase/queries.ts` opera de forma inteligente: si las credenciales de Supabase están configuradas, opera sobre PostgreSQL; si no, utiliza el almacén mock para desarrollo local sin dependencias externas.
