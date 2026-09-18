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
import { getSiteConfigFile } from '@/lib/site-config-server'

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

export default async function NosotrosPage() {
  const config = await getSiteConfigFile()
  const cleanWa = (config.whatsappNumber || '').replace(/\D/g, '')
  const hasWhatsapp = Boolean(cleanWa && cleanWa.length >= 8)
  let waUrl = '#'
  if (hasWhatsapp) {
    try {
      waUrl = buildGenericWhatsAppLink(
        '¡Hola! Estuve viendo su página web y me gustaría consultar disponibilidad y condiciones de alquiler en Tarapoto.',
        config.whatsappNumber
      )
    } catch {
      waUrl = '#'
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-2 sm:pb-4">
      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-white border-b border-zinc-100 pt-7 pb-9 sm:pt-9 sm:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge local */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 mb-3.5 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#0A192F]" aria-hidden="true" />
            <span>Tarapoto • San Martín, Perú</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 leading-[1.15] mb-3.5 max-w-4xl mx-auto">
            Tu movilidad en Tarapoto, con la confianza y claridad que necesitas.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto mb-6">
            Ponemos a tu disposición autos, camionetas y SUV listos para acompañarte en tus traslados urbanos, viajes de trabajo o recorridos por la región San Martín.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/catalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#112240] transition-colors shadow-xs"
            >
              <span>Explorar vehículos disponibles</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            {hasWhatsapp && waUrl !== '#' && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#20bd5a] transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-white" aria-hidden="true" />
                <span>Consultar por WhatsApp</span>
              </a>
            )}
          </div>

          {/* Microcopy de confianza */}
          <div className="mt-6 pt-5 border-t border-zinc-200/60 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-zinc-500 font-medium">
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
      <section className="py-8 sm:py-10 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            <div className="lg:col-span-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A192F] block mb-1.5">
                Quiénes Somos
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
                Facilitamos tu manera de moverte por Tarapoto y sus alrededores.
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-3 text-sm text-zinc-600 leading-relaxed">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-zinc-100">
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
      <section className="py-8 sm:py-10 bg-zinc-50/70 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A192F] block mb-1.5">
              Nuestra Propuesta
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mb-2">
              Lo que guía nuestro servicio en cada viaje
            </h2>
            <p className="text-sm text-zinc-600">
              Principios prácticos pensados para que te desplaces con total tranquilidad por Tarapoto y San Martín.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-2xs">
              <div className="w-8 h-8 rounded-md bg-[#0A192F] flex items-center justify-center text-white mb-3">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950 mb-1.5">
                Claridad en las condiciones
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Precios informados con total transparencia, sin costos ocultos de última hora ni sorpresas al momento de la entrega del vehículo.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-2xs">
              <div className="w-8 h-8 rounded-md bg-[#0A192F] flex items-center justify-center text-white mb-3">
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950 mb-1.5">
                Atención directa y cercana
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Conversas con personas que conocen el entorno local, dispuestas a orientarte con respuestas rápidas y oportunas vía WhatsApp.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-2xs">
              <div className="w-8 h-8 rounded-md bg-[#0A192F] flex items-center justify-center text-white mb-3">
                <Car className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950 mb-1.5">
                Vehículos preparados para su uso
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Cuidamos la operatividad, limpieza y presentación de cada unidad para que inicies tu trayecto con comodidad y seguridad.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-2xs">
              <div className="w-8 h-8 rounded-md bg-[#0A192F] flex items-center justify-center text-white mb-3">
                <Clock className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950 mb-1.5">
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
      <section className="py-8 sm:py-10 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A192F] block mb-1.5">
              Confianza Comprobada
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              Razones para coordinar tu vehículo con nosotros
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="flex gap-4 items-start p-3.5 sm:p-4 rounded-lg border border-zinc-200 bg-white">
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

            <div className="flex gap-4 items-start p-3.5 sm:p-4 rounded-lg border border-zinc-200 bg-white">
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

            <div className="flex gap-4 items-start p-3.5 sm:p-4 rounded-lg border border-zinc-200 bg-white">
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

            <div className="flex gap-4 items-start p-3.5 sm:p-4 rounded-lg border border-zinc-200 bg-white">
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
      <section className="py-8 sm:py-10 bg-gradient-to-b from-zinc-50/60 to-white border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A192F] block mb-1.5">
              Nuestro Compromiso
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mb-2">
              Transparencia y acompañamiento en cada kilómetro
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Creemos que la confianza no se impone con anuncios, se demuestra con hechos en cada alquiler. Nuestro compromiso contigo se resume en tres principios fundamentales:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-3">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950 mb-1.5">
                  Claridad antes de reservar
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Información real sobre disponibilidad y tarifas definitivas antes de cualquier confirmación. Sin letra chica ni sorpresas al recoger el auto.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Cero costos ocultos</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0A192F] mb-3">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950 mb-1.5">
                  Puntualidad en la entrega
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Coordinamos con antelación la hora y lugar de recepción para que tu vehículo esté limpio, revisado y listo para rodar desde el primer minuto.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-semibold text-blue-800">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Horarios respetados</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-3">
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950 mb-1.5">
                  Canal directo en ruta
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Si necesitas extender días, ajustar el horario de devolución o consultar sobre una ruta en San Martín, siempre tienes a alguien disponible por WhatsApp.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Soporte cercano en viaje</span>
              </div>
            </div>
          </div>

          {/* Banner de garantía humana */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-zinc-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-950">
                  Compromiso de honestidad comercial
                </p>
                <p className="text-xs text-zinc-500">
                  Si una unidad no está en condiciones óptimas para la ruta que planeas, te lo diremos con total franqueza.
                </p>
              </div>
            </div>
            {hasWhatsapp && waUrl !== '#' ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#20bd5a] transition-colors shrink-0 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                <span>Consultar condiciones</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#112240] transition-colors shrink-0 shadow-xs"
              >
                <span>Contactar equipo</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── 6. VEHÍCULOS SEGÚN TU NECESIDAD ───────────────────────────────── */}
      <section className="py-8 sm:py-10 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Autos */}
            <div className="p-5 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Económico y ágil
                </span>
                <h3 className="text-base font-bold text-zinc-950 mb-2">
                  Autos (Sedanes y Compactos)
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-3">
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
            <div className="p-5 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Confort y espacio
                </span>
                <h3 className="text-base font-bold text-zinc-950 mb-2">
                  SUVs Familiares
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-3">
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
            <div className="p-5 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Resistencia y despeje
                </span>
                <h3 className="text-base font-bold text-zinc-950 mb-2">
                  Camionetas y Pick-ups
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-3">
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
      <section className="py-8 sm:py-10 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A192F] mb-2">
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>Experiencia en la Región</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 mb-3">
              Descubre Tarapoto con la libertad de manejar tus propios tiempos
            </h2>
            <div className="space-y-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
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
      <section className="pt-8 sm:pt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A192F] block mb-1.5">
            Comienza tu Coordinación
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 mb-2.5">
            ¿Planeando tu próximo recorrido en Tarapoto?
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto mb-5">
            Revisa los vehículos que tenemos disponibles para tus fechas o escríbenos directamente por WhatsApp para asesorarte con gusto y sin compromiso.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-4">
            {hasWhatsapp && waUrl !== '#' ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Consultar disponibilidad en WhatsApp</span>
              </a>
            ) : (
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
              >
                <span>Contactar con el equipo</span>
              </Link>
            )}

            <Link
              href="/catalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white border border-zinc-300 text-zinc-800 text-xs font-semibold uppercase tracking-wider hover:border-zinc-400 hover:bg-zinc-50 transition-colors shadow-2xs"
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
