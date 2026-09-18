export interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'requisitos' | 'reservas' | 'garantias' | 'conduccion' | 'devolucion'
}

export const FAQ_CATEGORIES = [
  { id: 'all', label: 'Todas las preguntas' },
  { id: 'requisitos', label: 'Requisitos y Documentos' },
  { id: 'reservas', label: 'Proceso de Reserva' },
  { id: 'garantias', label: 'Garantía y Pagos' },
  { id: 'conduccion', label: 'Conducción y Combustible' },
  { id: 'devolucion', label: 'Devolución y Condiciones' },
] as const

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'requisitos-edad-doc',
    category: 'requisitos',
    question: '¿Cuáles son los requisitos principales para alquilar un vehículo?',
    answer:
      'Para acceder al servicio se requiere ser mayor de 21 o 25 años (según la categoría de vehículo elegida), presentar documento de identidad original vigente (DNI o Carné de Extranjería para residentes en Perú, o Pasaporte vigente para extranjeros) y licencia de conducir física vigente con un mínimo de un año de antigüedad.',
  },
  {
    id: 'requisitos-licencia-extranjera',
    category: 'requisitos',
    question: '¿Puedo alquilar si cuento con licencia de conducir extranjera?',
    answer:
      'Sí, los conductores extranjeros pueden presentar su licencia de conducir vigente emitida por su país de origen dentro del plazo de estadía legal como turista en el Perú, acompañada de su pasaporte con el sello de ingreso migratorio correspondiente.',
  },
  {
    id: 'reserva-como-funciona',
    category: 'reservas',
    question: '¿Cómo funciona el proceso de reserva en este sitio web?',
    answer:
      'Nuestra plataforma funciona como un catálogo digital informativo. Puedes explorar los vehículos, ver características y tarifas referenciales, y hacer clic en "Consultar por WhatsApp". Serás redirigido a un chat directo con nuestro asesor, quien te confirmará la disponibilidad exacta para tus fechas, el costo final y coordinará la entrega de manera personalizada.',
  },
  {
    id: 'reserva-contratacion-web',
    category: 'reservas',
    question: '¿El sitio web formaliza automáticamente el contrato de alquiler?',
    answer:
      'No. El sitio web no realiza cobros directos ni celebra contratos automáticos en línea. Toda confirmación, validación de documentos y suscripción del contrato de alquiler se formaliza directamente con nuestro equipo de atención antes de la entrega del vehículo.',
  },
  {
    id: 'garantia-deposito',
    category: 'garantias',
    question: '¿Se solicita depósito en garantía y cómo se realiza?',
    answer:
      'Sí. Conforme a las prácticas del rubro de alquiler vehicular en el Perú, se solicita una garantía como respaldo del vehículo durante el periodo de uso. El monto y las modalidades aceptadas (retención en tarjeta de crédito, transferencia bancaria u otra acordada) se informan previamente y de forma transparente en la cotización antes de suscribir el contrato.',
  },
  {
    id: 'garantia-devolucion-tiempo',
    category: 'garantias',
    question: '¿Cuándo y cómo se libera el depósito en garantía?',
    answer:
      'El depósito en garantía se libera o liquida tras la restitución del vehículo en la fecha pactada, una vez verificada el acta de recepción (estado del automóvil, nivel de combustible, ausencia de daños o infracciones de tránsito). En caso de retenciones bancarias, el desbloqueo depende adicionalmente de los tiempos de procesamiento de la entidad emisora de la tarjeta.',
  },
  {
    id: 'pagos-metodos',
    category: 'garantias',
    question: '¿Qué medios de pago están disponibles para el costo del alquiler?',
    answer:
      'Aceptamos transferencias bancarias locales en soles o dólares (BCP, BBVA, Interbank), pagos mediante aplicativos digitales autorizados (Yape/Plin para montos permitidos) y tarjetas de crédito o débito a través de links o POS, previa coordinación con el asesor.',
  },
  {
    id: 'conduccion-combustible',
    category: 'conduccion',
    question: '¿Cuál es la política de combustible?',
    answer:
      'Manejamos la modalidad estándar "Mismo nivel" (habitualmente tanque lleno a tanque lleno). El vehículo se entrega con un nivel determinado de combustible verificado en el acta de entrega y debe devolverse con la misma cantidad. En caso de retornar con faltante, se aplicará el cobro por reabastecimiento acordado en las condiciones particulares.',
  },
  {
    id: 'conduccion-zona-geografica',
    category: 'conduccion',
    question: '¿Puedo viajar fuera del departamento o salir del país con el vehículo?',
    answer:
      'El radio de circulación habitual y las rutas planificadas (por ejemplo, traslados entre Tarapoto, Moyobamba, Lamas o zonas aledañas) deben coordinarse e informarse previamente al asesor. Por razones legales y de cobertura del seguro, está estrictamente prohibido cruzar fronteras internacionales con el vehículo.',
  },
  {
    id: 'conduccion-seguro-siniestro',
    category: 'conduccion',
    question: '¿Qué coberturas incluyen los vehículos y qué hacer ante un siniestro?',
    answer:
      'Todos los vehículos de nuestra flota cuentan con SOAT vigente y póliza de seguro vehicular. Ante cualquier incidente, avería o choque, es obligatorio comunicarse de inmediato con nuestra línea de atención telefónica y con la aseguradora correspondiente, absteniéndose de abandonar el lugar del suceso o llegar a acuerdos particulares sin asistencia de la compañía.',
  },
  {
    id: 'devolucion-limpieza-mascotas',
    category: 'devolucion',
    question: '¿Se cobra algún recargo por devolución con suciedad excesiva o mascotas?',
    answer:
      'El uso cotidiano razonable está contemplado. No obstante, si el vehículo se devuelve con suciedad extrema en tapicería, manchas severas, presencia de pelos de mascotas no controlados o residuos de tabaco que demanden lavado químico o detallado profesional, se aplicará un recargo por limpieza profunda informado en el contrato.',
  },
  {
    id: 'devolucion-horarios-lugar',
    category: 'devolucion',
    question: '¿Dónde y en qué horarios puedo recoger y devolver el auto?',
    answer:
      'Contamos con punto de atención y coordinación en Tarapoto, San Martín, en los horarios de Lunes a Viernes de 8:00 a 19:00 y Sábados de 9:00 a 17:00. También es posible coordinar entregas o recepciones en el Aeropuerto Cadete FAP Guillermo del Castillo Paredes o en hoteles céntricos, previa coordinación y disponibilidad de nuestro equipo.',
  },
]
