import { type Metadata } from 'next'
import Link from 'next/link'
import {
  ShieldCheck,
  CheckCircle2,
  Car,
  Compass,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin,
  MessageCircle,
  Users,
  Briefcase,
  Luggage,
} from 'lucide-react'
import { buildGenericWhatsAppLink } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Nosotros | Alquiler de Autos, SUV y Camionetas en Tarapoto',
  description:
    'Conoce AutoRuta, empresa de alquiler de vehículos en Tarapoto. Ofrecemos autos, camionetas y SUV con condiciones claras, atención personalizada y trato transparente.',
  alternates: { canonical: '/nosotros' },
  openGraph: {
    title: 'Nosotros | AutoRuta Tarapoto',
    description:
      'Alquiler de vehículos en Tarapoto, San Martín. Autos, SUV y camionetas con trato directo, precios transparentes y asesoría local.',
    type: 'website',
  },
}

export default function NosotrosPage() {
  let waUrl = 'https://wa.me/51997936599'
  try {
    waUrl = buildGenericWhatsAppLink(
      '¡Hola! Estuve viendo su página web y me gustaría consultar disponibilidad y condiciones de alquiler en Tarapoto.'
    )
  } catch {
    // Fallback silencioso
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20">
      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-white border-b border-zinc-100 pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge local */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 mb-6 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#0A192F]" aria-hidden="true" />
            <span>Tarapoto • San Martín, Perú</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 leading-[1.15] mb-5 max-w-4xl mx-auto">
            Tu movilidad en Tarapoto, con la confianza y claridad que necesitas.
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Ponemos a tu disposición autos, camionetas y SUV listos para acompañarte en tus traslados urbanos, viajes de trabajo o recorridos por la región San Martín.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/catalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#112240] transition-colors shadow-xs"
            >
              <span>Explorar vehículos disponibles</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white border border-zinc-300 text-zinc-800 text-xs font-semibold uppercase tracking-wider hover:border-zinc-400 hover:bg-zinc-50 transition-colors shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>Consultar por WhatsApp</span>
            </a>
          </div>

          {/* Microcopy de confianza */}
          <div className="mt-10 pt-8 border-t border-zinc-200/60 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-zinc-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
              Trato directo y sin intermediarios
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
              Condiciones claras y transparentes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
              Unidades verificadas antes de cada entrega
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. QUIÉNES SOMOS ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A192F] block mb-2">
                Quiénes Somos
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
                Facilitamos tu manera de moverte por Tarapoto y sus alrededores.
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
              <p>
                En AutoRuta entendemos que alquilar un vehículo no se trata solo de recibir una llave: se trata de contar con la seguridad de que tu viaje saldrá exactamente como lo planeaste.
              </p>
              <p>
                Nacimos para brindar una alternativa de movilidad seria, accesible y transparente en Tarapoto. Atendemos a viajeros que llegan a descubrir los atractivos de la selva peruana, profesionales que necesitan cumplir gestiones de trabajo con puntualidad, y familias o residentes locales que requieren un vehículo confiable por días o temporadas específicas.
              </p>
              <p>
                Trabajamos con trato directo, condiciones claras desde el primer contacto y la convicción de que una buena experiencia de alquiler comienza escuchando lo que cada cliente necesita.
              </p>
            </div>
          </div>

          {/* Tarjetas de público objetivo atendido */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-zinc-100">
            <div className="p-5 rounded-lg bg-zinc-50 border border-zinc-200">
              <div className="w-8 h-8 rounded bg-white border border-zinc-200 flex items-center justify-center text-[#0A192F] mb-3">
                <Compass className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-1.5">
                Turistas y Viajeros
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Autonomía total para visitar cataratas, lagunas y centros turísticos con libertad de horarios y ritmo propio.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-zinc-50 border border-zinc-200">
              <div className="w-8 h-8 rounded bg-white border border-zinc-200 flex items-center justify-center text-[#0A192F] mb-3">
                <Briefcase className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-1.5">
                Trabajo y Negocios
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Puntualidad y formalidad para traslados ejecutivos, supervisión de proyectos y gestiones en la región.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-zinc-50 border border-zinc-200">
              <div className="w-8 h-8 rounded bg-white border border-zinc-200 flex items-center justify-center text-[#0A192F] mb-3">
                <Users className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-1.5">
                Familias y Uso Local
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Espacio, comodidad y soporte cercano para salidas de fin de semana o necesidades temporales de movilidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. NUESTRA PROPUESTA DE VALOR ────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-zinc-50/70 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A192F] block mb-2">
              Nuestra Propuesta
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mb-3">
              Lo que guía nuestro servicio en cada viaje
            </h2>
            <p className="text-sm text-zinc-600">
              Principios prácticos pensados para que te desplaces con total tranquilidad por Tarapoto y San Martín.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-6 rounded-lg bg-white border border-zinc-200 shadow-2xs">
              <div className="w-9 h-9 rounded-md bg-[#0A192F] flex items-center justify-center text-white mb-4">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950 mb-2">
                Claridad en las condiciones
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Precios informados con total transparencia, sin costos ocultos de última hora ni sorpresas al momento de la entrega del vehículo.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white border border-zinc-200 shadow-2xs">
              <div className="w-9 h-9 rounded-md bg-[#0A192F] flex items-center justify-center text-white mb-4">
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950 mb-2">
                Atención directa y cercana
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Conversas con personas que conocen el entorno local, dispuestas a orientarte con respuestas rápidas y oportunas vía WhatsApp.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white border border-zinc-200 shadow-2xs">
              <div className="w-9 h-9 rounded-md bg-[#0A192F] flex items-center justify-center text-white mb-4">
                <Car className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950 mb-2">
                Vehículos preparados para su uso
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Cuidamos la operatividad, limpieza y presentación de cada unidad para que inicies tu trayecto con comodidad y seguridad.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white border border-zinc-200 shadow-2xs">
              <div className="w-9 h-9 rounded-md bg-[#0A192F] flex items-center justify-center text-white mb-4">
                <Clock className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950 mb-2">
                Flexibilidad según tus planes
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Opciones adaptadas tanto a estadías cortas de turismo como a requerimientos corporativos o familiares de mayor duración.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. ¿POR QUÉ ELEGIRNOS? ────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A192F] block mb-2">
              Confianza Comprobada
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              Razones para coordinar tu vehículo con nosotros
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 items-start p-4 rounded-lg border border-zinc-200 bg-white">
              <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-[#0A192F] shrink-0 font-bold text-xs">
                01
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-1">
                  Trato personalizado de inicio a fin
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Desde tu primera consulta hasta la devolución del vehículo, te acompaña un equipo atento a tus itinerarios y horarios.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-lg border border-zinc-200 bg-white">
              <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-[#0A192F] shrink-0 font-bold text-xs">
                02
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-1">
                  Información real y verificable
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Fotos auténticas de los vehículos de nuestro catálogo y especificaciones técnicas precisas para que elijas exactamente lo que vas a conducir.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-lg border border-zinc-200 bg-white">
              <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-[#0A192F] shrink-0 font-bold text-xs">
                03
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-1">
                  Coordinación sencilla y sin demoras
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Procesos de solicitud ágiles, pensados para que no pierdas tiempo en trámites burocráticos excesivos al llegar a Tarapoto.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-lg border border-zinc-200 bg-white">
              <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-[#0A192F] shrink-0 font-bold text-xs">
                04
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-1">
                  Conocimiento del contexto local
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Te brindamos orientación útil y de primera mano sobre desplazamientos habituales en la ciudad y rutas de la región.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. NUESTRO COMPROMISO ─────────────────────────────────────────── */}
      <section className="py-14 sm:py-16 bg-[#0A192F] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 block mb-2">
            Nuestro Compromiso
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Transparencia y acompañamiento en cada kilómetro
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto mb-6 font-normal">
            Creemos que la confianza no se impone con anuncios, se demuestra con hechos en cada alquiler. Por eso, nuestro compromiso es responder tus dudas con honestidad antes de que confirmes cualquier reserva, entregarte información veraz sobre la disponibilidad y estar a tu disposición durante todo el tiempo que utilices el vehículo.
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-medium bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span>Atención honesta, sin letra chica ni compromisos forzados</span>
          </div>
        </div>
      </section>

      {/* ── 6. VEHÍCULOS SEGÚN TU NECESIDAD ───────────────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A192F] block mb-1">
                Flota para Cada Trayecto
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                El vehículo indicado para tu necesidad
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-xs font-semibold text-[#0A192F] hover:underline transition-colors flex items-center gap-1 shrink-0"
            >
              <span>Ver catálogo completo con fotos reales</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Autos */}
            <div className="p-6 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Económico y ágil
                </span>
                <h3 className="text-base font-bold text-zinc-950 mb-3">
                  Autos (Sedanes y Compactos)
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Ideal para movilizarse con economía y facilidad en el casco urbano de Tarapoto, gestiones de trabajo o salidas cotidianas sobre pistas pavimentadas.
                </p>
              </div>
              <Link
                href="/catalog?category=sedan"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A192F] hover:underline pt-3 border-t border-zinc-200/80"
              >
                <span>Ver opciones de autos</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            {/* SUV */}
            <div className="p-6 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Confort y espacio
                </span>
                <h3 className="text-base font-bold text-zinc-950 mb-3">
                  SUVs Familiares
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Excelente para parejas y familias que priorizan la comodidad interior, maletero amplio para equipaje y una posición de manejo cómoda en ciudad y carretera.
                </p>
              </div>
              <Link
                href="/catalog?category=suv"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A192F] hover:underline pt-3 border-t border-zinc-200/80"
              >
                <span>Ver opciones de SUVs</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            {/* Camionetas */}
            <div className="p-6 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Resistencia y despeje
                </span>
                <h3 className="text-base font-bold text-zinc-950 mb-3">
                  Camionetas y Pick-ups
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Recomendadas para rutas de mayor exigencia, proyectos técnicos o viajes con mayor carga que demandan solidez, altura al suelo y tracción confiable.
                </p>
              </div>
              <Link
                href="/catalog?category=pickup_4x4"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A192F] hover:underline pt-3 border-t border-zinc-200/80"
              >
                <span>Ver opciones de camionetas</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. TARAPOTO Y MOVILIDAD ──────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A192F] mb-3">
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>Experiencia en la Región</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 mb-4">
              Descubre Tarapoto con la libertad de manejar tus propios tiempos
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <p>
                La región San Martín ofrece paisajes cautivadores, centros turísticos naturales y una dinámica urbana particular. Recorrerla en un vehículo privado te otorga una ventaja invaluable: la autonomía de decidir a qué hora salir, cuánto tiempo permanecer en cada lugar y qué caminos explorar con tus acompañantes.
              </p>
              <p>
                Ya sea que tu destino sea una catarata cercana, una jornada laboral en distritos aledaños o simplemente moverte entre tu alojamiento y los mejores restaurantes de la ciudad, un auto adecuado te permite disfrutar del trayecto sin depender de horarios fijos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. CTA FINAL ─────────────────────────────────────────────────── */}
      <section className="pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A192F] block mb-2">
            Comienza tu Coordinación
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 mb-4">
            ¿Planeando tu próximo recorrido en Tarapoto?
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto mb-8">
            Revisa los vehículos que tenemos disponibles para tus fechas o escríbenos directamente por WhatsApp para asesorarte con gusto y sin compromiso.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-6">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Consultar disponibilidad en WhatsApp</span>
            </a>

            <Link
              href="/catalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white border border-zinc-300 text-zinc-800 text-xs font-semibold uppercase tracking-wider hover:border-zinc-400 hover:bg-zinc-50 transition-colors shadow-2xs"
            >
              <span>Ver catálogo de vehículos</span>
            </Link>
          </div>

          <p className="text-[11px] text-zinc-400">
            Respuesta rápida • Asesoría local • Precios claros
          </p>
        </div>
      </section>
    </div>
  )
}
