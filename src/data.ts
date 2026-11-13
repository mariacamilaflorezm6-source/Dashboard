// ============================================================================
// TIPOS Y DATOS CENTRALIZADOS DEL PROYECTO: INTEGRACIÓN GD ↔ ACADEMUSOFT (UTS)
// ============================================================================

export type TabId =
  | 'resumen'
  | 'peti'
  | 'requisitos'
  | 'alternativas'
  | 'decision'
  | 'canvas'
  | 'riesgos'
  | 'implementacion';

export interface NavTab {
  id: TabId;
  label: string;
  shortDesc: string;
}

export const NAV_TABS: NavTab[] = [
  { id: 'resumen', label: 'Resumen del proyecto', shortDesc: 'Ruta y equipo' },
  { id: 'peti', label: 'PETI y necesidad', shortDesc: 'Taller 1' },
  { id: 'requisitos', label: 'Requisitos', shortDesc: 'Taller 3' },
  { id: 'alternativas', label: 'Alternativas', shortDesc: '3 opciones' },
  { id: 'decision', label: 'Decisión', shortDesc: 'Matriz ponderada' },
  { id: 'canvas', label: 'Canvas', shortDesc: 'Modelo de negocio' },
  { id: 'riesgos', label: 'Riesgos', shortDesc: 'Control 5×5' },
  { id: 'implementacion', label: 'Implementación', shortDesc: 'Plan 12 sem.' },
];

// ----------------------------------------------------------------------------
// 1. RESUMEN DEL PROYECTO
// ----------------------------------------------------------------------------

export const TEAM_MEMBERS = [
  'Juan David Quintero Cudriz',
  'María Camila Flórez Martínez',
  'Jaider Javier Jaimes',
];

export const COURSE_INFO = {
  subject: 'Selección y Evaluación de Tecnologías TSI604',
  period: '2026-2',
  institution: 'Unidades Tecnológicas de Santander (UTS)',
};

// ----------------------------------------------------------------------------
// 2. PETI Y NECESIDAD (TALLER 1)
// ----------------------------------------------------------------------------

export interface PetiNeed {
  id: number;
  title: string;
  page: string;
  summary: string;
  evidence: string;
  metricBadge: string;
}

export const PETI_CHALLENGE = {
  title: 'Automatizar el cargue de pagos entre GD y Academusoft',
  source: 'PETI UTS 2026, p. 53, Tabla 37',
  description:
    'Actualmente el registro de pagos entre el sistema financiero GD y la plataforma académica Academusoft se realiza de forma manual. El PETI contempla esta integración como pendiente mediante Web Service con protocolo HTTPS.',
  initialQuestion:
    '¿Cómo podríamos automatizar el proceso de cargue de pagos entre GD y Academusoft para contribuir a la reducción del registro manual y de los errores en el manejo de la información financiera de los estudiantes?',
};

export const PETI_NEEDS: PetiNeed[] = [
  {
    id: 1,
    title: 'Automatizar el cargue de pagos entre sistemas',
    page: 'PETI p. 53 (Tabla 37)',
    summary: 'Integración pendiente entre el sistema financiero GD y Academusoft.',
    evidence:
      'La Tabla 37 del PETI registra la necesidad de enlazar GD y Academusoft mediante Web Service sobre HTTPS para eliminar el cargue manual.',
    metricBadge: 'Integración pendiente',
  },
  {
    id: 2,
    title: 'Formalizar el desarrollo de sistemas de información',
    page: 'PETI p. 54',
    summary: 'Ausencia de una metodología formal y estandarizada de desarrollo.',
    evidence:
      'El diagnóstico del PETI señala que no existe un proceso formal de desarrollo de software documentado, lo que eleva el riesgo de mantenibilidad.',
    metricBadge: 'Sin proceso formal',
  },
  {
    id: 3,
    title: 'Implementar monitoreo de la infraestructura',
    page: 'PETI p. 58',
    summary: 'Falta de visibilidad proactiva sobre fallas y disponibilidad.',
    evidence:
      'Se requiere monitoreo continuo con alertas tempranas para detectar caídas o degradación del servicio antes de impactar procesos críticos.',
    metricBadge: 'Monitoreo activo',
  },
  {
    id: 4,
    title: 'Mejorar la seguridad de la información',
    page: 'PETI p. 60',
    summary: 'Brecha crítica en controles de seguridad y protección de datos.',
    evidence:
      'El indicador actual de seguridad en el PETI se ubica en 40/100 frente a una meta institucional de 100/100, exigiendo cifrado y control de acceso.',
    metricBadge: '40/100 → Meta 100/100',
  },
  {
    id: 5,
    title: 'Fortalecer el personal de TI',
    page: 'PETI p. 42-43',
    summary: 'Capacidad operativa limitada en el equipo tecnológico institucional.',
    evidence:
      'El área cuenta con un solo profesional de planta y el resto del personal bajo modalidad de contratistas, restringiendo desarrollos complejos a la medida.',
    metricBadge: '1 planta + contratistas',
  },
];

export interface PriorityItem {
  name: string;
  impact: number;
  urgency: number;
  strategic: number;
  total: number;
  color: string;
}

export const PRIORITY_MATRIX: PriorityItem[] = [
  {
    name: 'Mejorar seguridad de la información',
    impact: 5,
    urgency: 5,
    strategic: 5,
    total: 15,
    color: '#F43F5E',
  },
  {
    name: 'Automatizar cargue de pagos (GD ↔ Academusoft)',
    impact: 4,
    urgency: 4,
    strategic: 5,
    total: 13,
    color: '#22D3EE',
  },
  {
    name: 'Monitorear infraestructura tecnológica',
    impact: 3,
    urgency: 3,
    strategic: 3,
    total: 9,
    color: '#8B5CF6',
  },
];

export const KNOWLEDGE_COLUMNS = {
  known: [
    'La integración entre GD y Academusoft está explícitamente pendiente en el PETI (p. 53, Tabla 37).',
    'El mecanismo técnico indicado por el PETI es un Web Service con protocolo HTTPS.',
    'El cargue de pagos se ejecuta actualmente de forma manual, exponiendo el proceso a errores humanos.',
    'La madurez en seguridad de la información es 40/100 (p. 60) y el equipo de planta es reducido (p. 42-43).',
  ],
  unknown: [
    'Volumen diario y mensual de transacciones de pago (picos reales de matrícula).',
    'Estructura exacta y formatos de datos (JSON/XML/campos) expuestos por GD y Academusoft.',
    'Presupuesto oficial asignado para licenciamiento, nube o desarrollo.',
    'Cronograma institucional y acuerdos de nivel de servicio (SLA) exigidos.',
  ],
};

// ----------------------------------------------------------------------------
// 3. REQUISITOS (TALLER 3)
// ----------------------------------------------------------------------------

export type RequirementType = 'Funcional' | 'No funcional';
export type RequirementOrigin =
  | 'Explícito en el PETI'
  | 'Propuesta / Inferencia del equipo';

export interface RequirementItem {
  id: string;
  type: RequirementType;
  tag: string; // Prioridad (RF) o Categoría (RNF)
  description: string;
  origin: RequirementOrigin;
  evidence: string;
}

export const REQUIREMENTS: RequirementItem[] = [
  {
    id: 'RF-01',
    type: 'Funcional',
    tag: 'Alta',
    description: 'Capturar la información de los pagos registrados en GD.',
    origin: 'Explícito en el PETI',
    evidence: 'PETI p. 53, Tabla 37 (explícito como origen de datos financieros para la integración).',
  },
  {
    id: 'RF-02',
    type: 'Funcional',
    tag: 'Alta',
    description: 'Transferir la información de pagos de GD a Academusoft mediante Web Service.',
    origin: 'Explícito en el PETI',
    evidence: 'PETI p. 53, Tabla 37 (explícito: intercambio mediante Web Service).',
  },
  {
    id: 'RF-03',
    type: 'Funcional',
    tag: 'Alta',
    description: 'Registrar en Academusoft el estado de pago del estudiante a partir de lo recibido de GD.',
    origin: 'Propuesta / Inferencia del equipo',
    evidence: 'Interpretación del equipo para cerrar el ciclo de actualización financiera en la matrícula.',
  },
  {
    id: 'RF-04',
    type: 'Funcional',
    tag: 'Media',
    description: 'Consultar el estado de una operación de cargue (exitosa, pendiente o con error).',
    origin: 'Propuesta / Inferencia del equipo',
    evidence: 'Propuesta del equipo para facilitar seguimiento operativo por mesa de ayuda y financiera.',
  },
  {
    id: 'RF-05',
    type: 'Funcional',
    tag: 'Media',
    description: 'Validar el formato de los datos de pago antes de registrarlos.',
    origin: 'Propuesta / Inferencia del equipo',
    evidence: 'Propuesta del equipo para prevenir inconsistencias entre los esquemas de GD y Academusoft.',
  },
  {
    id: 'RF-06',
    type: 'Funcional',
    tag: 'Media-baja',
    description: 'Registrar un historial (log) de cada cargue con fecha, monto y resultado.',
    origin: 'Propuesta / Inferencia del equipo',
    evidence: 'Propuesta del equipo orientada a auditoría financiera y soporte técnico.',
  },
  {
    id: 'RNF-01',
    type: 'No funcional',
    tag: 'Seguridad',
    description: 'Proteger la información financiera transmitida con autenticación y cifrado.',
    origin: 'Propuesta / Inferencia del equipo',
    evidence: 'Propuesta del equipo alineada con el diagnóstico de seguridad 40/100 (PETI p. 60).',
  },
  {
    id: 'RNF-02',
    type: 'No funcional',
    tag: 'Interoperabilidad',
    description: 'Intercambio mediante Web Service con protocolo HTTPS.',
    origin: 'Explícito en el PETI',
    evidence: 'PETI p. 53, Tabla 37 (explícito: protocolo HTTPS obligatorio para el Web Service).',
  },
  {
    id: 'RNF-03',
    type: 'No funcional',
    tag: 'Disponibilidad',
    description: 'Disponible en periodos de pago y matrícula; nivel por definir.',
    origin: 'Propuesta / Inferencia del equipo',
    evidence: 'Inferencia del equipo ante la criticidad académica y financiera en fechas de matrícula.',
  },
  {
    id: 'RNF-04',
    type: 'No funcional',
    tag: 'Rendimiento',
    description: 'Tiempo máximo de respuesta por definir.',
    origin: 'Propuesta / Inferencia del equipo',
    evidence: 'Inferencia del equipo; requiere levantamiento del volumen real de transacciones.',
  },
  {
    id: 'RNF-05',
    type: 'No funcional',
    tag: 'Trazabilidad',
    description: 'Identificar origen, fecha y resultado de cada cargue.',
    origin: 'Propuesta / Inferencia del equipo',
    evidence: 'Inferencia del equipo para garantizar control y conciliación entre áreas.',
  },
  {
    id: 'RNF-06',
    type: 'No funcional',
    tag: 'Mantenibilidad',
    description: 'Permitir ajustes sin afectar el funcionamiento independiente de GD o Academusoft.',
    origin: 'Propuesta / Inferencia del equipo',
    evidence: 'Inferencia del equipo sustentada en la falta de proceso formal de desarrollo (PETI p. 54).',
  },
];

// ----------------------------------------------------------------------------
// 4. ALTERNATIVAS
// ----------------------------------------------------------------------------

export interface AlternativeItem {
  id: 'A1' | 'A2' | 'A3';
  name: string;
  shortName: string;
  example: string;
  provider: string;
  cost: string;
  advantages: string[];
  limitations: string[];
  risks: string[];
  recommended?: boolean;
  accent: string;
}

export const ALTERNATIVES: AlternativeItem[] = [
  {
    id: 'A1',
    name: 'Web Service de integración desarrollado a la medida (HTTPS)',
    shortName: 'Desarrollo a la medida',
    example: 'Servicio REST/SOAP propio sobre HTTPS',
    provider: 'Equipo de TI de las UTS o contratista',
    cost: 'Sin licencias; el costo corresponde a horas de desarrollo e infraestructura existente.',
    advantages: [
      'Ajuste exacto a las reglas de negocio entre GD y Academusoft.',
      'Control total del código fuente y despliegues.',
    ],
    limitations: [
      'Depende de un equipo de TI reducido (PETI p. 42-43).',
      'No hay proceso formal de desarrollo documentado (PETI p. 54).',
      'Mantenimiento evolutivo y correctivo 100% a cargo de la UTS.',
    ],
    risks: [
      'Sobrecarga o rotación de contratistas.',
      'Poca documentación técnica y deuda acumulada.',
    ],
    accent: '#8B5CF6',
  },
  {
    id: 'A2',
    name: 'Middleware de integración (ESB) de código abierto',
    shortName: 'Middleware ESB Open Source',
    example: 'WSO2 Integrator: MI (licencia Apache 2.0)',
    provider: 'Comunidad Open Source / Implementación institucional',
    cost: 'Licencia gratuita (Apache 2.0), más servidor, implementación y capacitación.',
    advantages: [
      'Licencia libre sin costos recurrentes por uso.',
      'Enfoque por configuración de flujos.',
      'Reutilizable para otras integraciones del Mapa de Integraciones del PETI.',
      'Consola de monitoreo y trazabilidad incluida.',
    ],
    limitations: [
      'Curva de aprendizaje inicial para el equipo TI.',
      'Requiere aprovisionar y administrar servidor propio.',
    ],
    risks: [
      'Credenciales por defecto sin endurecer si falta configuración segura.',
      'Falta de personal capacitado para operación continua.',
    ],
    accent: '#FBBF24',
  },
  {
    id: 'A3',
    name: 'Plataforma de integración como servicio (iPaaS) en la nube',
    shortName: 'iPaaS en la nube',
    example: 'Azure Logic Apps (u homólogo cloud)',
    provider: 'Proveedor de nube pública (ej. Microsoft Azure)',
    cost: 'Pago por uso (plan Consumption); depende del volumen de pagos aún desconocido.',
    advantages: [
      'Sin infraestructura propia que administrar ni parchar.',
      'Desarrollo rápido con interfaz visual de conectores.',
      'Monitoreo nativo, reintentos y SLA del proveedor.',
    ],
    limitations: [
      'Costos recurrentes sujetos a tasa de cambio extranjera.',
      'La información financiera transita por la nube de un tercero.',
    ],
    risks: [
      'Cumplimiento de la Ley 1581 de 2012 por validar con jurídica.',
      'Fallas de conectividad entre la nube y los servidores de la institución.',
    ],
    recommended: true,
    accent: '#22D3EE',
  },
];

// ----------------------------------------------------------------------------
// 5. DECISIÓN (MATRIZ PONDERADA)
// ----------------------------------------------------------------------------

export interface DecisionCriterion {
  id: string;
  name: string;
  shortLabel: string;
  weight: number; // Porcentaje 0-100
  requirements: string[];
  scores: {
    A1: number;
    A2: number;
    A3: number;
  };
  rationales: {
    A1: string;
    A2: string;
    A3: string;
  };
}

export const INITIAL_DECISION_CRITERIA: DecisionCriterion[] = [
  {
    id: 'C1',
    name: 'Interoperabilidad',
    shortLabel: 'Interoperab.',
    weight: 20,
    requirements: ['RF-02', 'RNF-02'],
    scores: { A1: 4, A2: 5, A3: 4 },
    rationales: {
      A1: 'Cumple vía Web Service HTTPS directo, pero cada conector nuevo requiere código manual.',
      A2: 'Diseñado nativamente como bus de integración multiprotocolo (REST, SOAP, HTTPS) para todo el PETI.',
      A3: 'Ofrece conectores HTTPS/REST listos para usar y fácil enlace híbrido mediante gateway.',
    },
  },
  {
    id: 'C2',
    name: 'Seguridad de la información',
    shortLabel: 'Seguridad',
    weight: 20,
    requirements: ['RNF-01'],
    scores: { A1: 3, A2: 4, A3: 4 },
    rationales: {
      A1: 'La seguridad recae enteramente en la implementación manual del equipo (riesgo ante PETI p. 60: 40/100).',
      A2: 'Incluye gestión de certificados, OAuth y políticas centralizadas, si se endurece adecuadamente.',
      A3: 'Cifrado TLS, bóveda de secretos y controles IAM gestionados por el proveedor; validar Ley 1581.',
    },
  },
  {
    id: 'C3',
    name: 'Costo total',
    shortLabel: 'Costo',
    weight: 15,
    requirements: [],
    scores: { A1: 3, A2: 3, A3: 4 },
    rationales: {
      A1: 'Sin licencias, pero consume horas de desarrollo y mantenimiento continuo difícil de presupuestar.',
      A2: 'Licencia Apache 2.0 gratuita, aunque exige servidor dedicado, horas de puesta a punto y formación.',
      A3: 'Modelo pago por uso sin inversión inicial en servidores; muy eficiente para volúmenes moderados.',
    },
  },
  {
    id: 'C4',
    name: 'Mantenibilidad',
    shortLabel: 'Mantenib.',
    weight: 10,
    requirements: ['RNF-06'],
    scores: { A1: 2, A2: 4, A3: 4 },
    rationales: {
      A1: 'El PETI p. 54 indica que no hay proceso formal de desarrollo; el código a medida es el más costoso de mantener.',
      A2: 'Flujos declarativos desacoplados que facilitan cambios sin tocar GD ni Academusoft.',
      A3: 'Orquestación visual modular que permite ajustar mapeos rápidamente sin recompilar servicios.',
    },
  },
  {
    id: 'C5',
    name: 'Disponibilidad',
    shortLabel: 'Disponib.',
    weight: 10,
    requirements: ['RNF-03'],
    scores: { A1: 3, A2: 3, A3: 4 },
    rationales: {
      A1: 'Depende de la disponibilidad del servidor local y atención manual ante caídas en matrícula.',
      A2: 'Alta estabilidad si se despliega en clúster local, con responsabilidad operativa interna.',
      A3: 'Respaldado por SLA comercial del proveedor en la nube y reintentos automáticos integrados.',
    },
  },
  {
    id: 'C6',
    name: 'Rendimiento',
    shortLabel: 'Rendimiento',
    weight: 5,
    requirements: ['RNF-04'],
    scores: { A1: 4, A2: 4, A3: 4 },
    rationales: {
      A1: 'Baja latencia punto a punto en red local, sujeto a capacidad del servidor asignado.',
      A2: 'Alto desempeño en procesamiento concurrente cuando se dimensiona correctamente el ESB.',
      A3: 'Escalamiento automático elástico para absorber picos de pago en fechas de matrícula.',
    },
  },
  {
    id: 'C7',
    name: 'Trazabilidad y monitoreo',
    shortLabel: 'Trazabilidad',
    weight: 10,
    requirements: ['RF-04', 'RF-06', 'RNF-05'],
    scores: { A1: 3, A2: 4, A3: 4 },
    rationales: {
      A1: 'El historial (log) y las alertas deben construirse desde cero dentro del desarrollo.',
      A2: 'Consola integrada con registro de transacciones, errores y estado de mensajes.',
      A3: 'Bitácora visual paso a paso de cada ejecución con fecha, carga útil, alertas y estado.',
    },
  },
  {
    id: 'C8',
    name: 'Capacidad del personal de TI',
    shortLabel: 'Capacidad TI',
    weight: 10,
    requirements: ['PETI p. 42-43'],
    scores: { A1: 2, A2: 3, A3: 4 },
    rationales: {
      A1: 'Un solo profesional de planta (PETI p. 42-43) no da abasto para sostener código a medida crítico.',
      A2: 'Reduce código manual, pero el equipo debe administrar el servidor y aprender WSO2.',
      A3: 'Menor carga operativa para TI: diseño visual low-code sin administración de servidores.',
    },
  },
];

// ----------------------------------------------------------------------------
// 6. CANVAS (9 BLOQUES DEL MODELO)
// ----------------------------------------------------------------------------

export interface CanvasBlock {
  id: string;
  title: string;
  borderColor: string;
  items: string[];
  highlightNote?: string;
}

export const CANVAS_BLOCKS: CanvasBlock[] = [
  {
    id: 'socios',
    title: 'Socios clave',
    borderColor: '#8B5CF6',
    items: [
      'Proveedor del sistema financiero GD.',
      'Proveedor de la plataforma académica Academusoft.',
      'Proveedor del servicio iPaaS en la nube.',
      'Equipo de TI de las UTS y contratistas.',
      'Área financiera y área académica.',
    ],
  },
  {
    id: 'actividades',
    title: 'Actividades clave',
    borderColor: '#22D3EE',
    items: [
      'Capturar pagos registrados en GD.',
      'Enviarlos a Academusoft por Web Service HTTPS.',
      'Validar formato de datos antes del registro.',
      'Registrar estado de pago del estudiante.',
      'Llevar historial (log) y monitoreo continuo.',
    ],
  },
  {
    id: 'recursos',
    title: 'Recursos clave',
    borderColor: '#38BDF8',
    items: [
      'Solución seleccionada: iPaaS en la nube (Alt. 3, 4,00/5, ej. Azure Logic Apps).',
      'Acceso a las APIs/Web Services de GD y Academusoft.',
      'Conexión segura nube-UTS (HTTPS + autenticación).',
      'Personal de TI y ambiente de pruebas.',
    ],
  },
  {
    id: 'propuesta',
    title: 'Propuesta de valor',
    borderColor: '#34D399',
    items: [
      'Cargue de pagos automático sin registro manual (PETI p. 53).',
      'Menos errores humanos y ahorro de tiempo operativo del personal.',
      'Pagos reflejados a tiempo en Academusoft para matrícula.',
      'Trazabilidad completa de fecha, monto y resultado.',
      'Datos financieros protegidos con autenticación y cifrado.',
    ],
    highlightNote:
      'Solución seleccionada: iPaaS en la nube (Alternativa 3, 4,00/5), por encima del ESB (3,85) y del Web Service a la medida (3,05); reduce la carga del equipo de TI (PETI p. 42-43) y ofrece SLA del proveedor (nivel por definir).',
  },
  {
    id: 'relacion',
    title: 'Relación con clientes',
    borderColor: '#A78BFA',
    items: [
      'Soporte oportuno de la mesa de ayuda de TI.',
      'Consulta del estado de cada cargue (exitoso, pendiente o error).',
      'Capacitación y manual de uso para áreas involucradas.',
      'Reportes periódicos e historial de conciliación.',
    ],
  },
  {
    id: 'canales',
    title: 'Canales',
    borderColor: '#60A5FA',
    items: [
      'Web Service con protocolo HTTPS entre GD y Academusoft.',
      'Consola de monitoreo y alertas de la plataforma iPaaS.',
      'Comunicación y capacitación interna institucional.',
      'Documentación técnica de la integración.',
    ],
  },
  {
    id: 'segmentos',
    title: 'Segmento de clientes',
    borderColor: '#F472B6',
    items: [
      'Área financiera (administra GD).',
      'Área académica (administra Academusoft).',
      'Estudiantes (su pago debe reflejarse a tiempo para la matrícula).',
      'Equipo de TI de las UTS.',
    ],
  },
  {
    id: 'costes',
    title: 'Costes de estructura',
    borderColor: '#FB923C',
    items: [
      'Pago por uso del servicio iPaaS (varía con el volumen real, aún desconocido).',
      'Horas de implementación, pruebas, capacitación y soporte.',
      'Posible variación financiera por tasa de cambio extranjera.',
      'Nota: el PETI no define presupuesto específico.',
      'A validar: tránsito de datos financieros en nube de un tercero (Ley 1581 de 2012).',
    ],
  },
  {
    id: 'ingresos',
    title: 'Fuentes de ingreso (beneficios)',
    borderColor: '#10B981',
    items: [
      'Ahorro significativo de horas de trabajo manual.',
      'Disminución de errores y reprocesos contables.',
      'Mejor servicio y experiencia para el estudiante en matrícula.',
      'Cero infraestructura propia adicional que administrar.',
    ],
  },
];

// ----------------------------------------------------------------------------
// 7. RIESGOS (DASHBOARD ORIGINAL PRESERVADO)
// ----------------------------------------------------------------------------

export type RiskZone = 'Bajo' | 'Medio' | 'Alto' | 'Crítico';

export interface RiskItem {
  id: string;
  title: string;
  requirements: string[];
  impacto: number;
  probabilidad: number;
  responsable: string;
  prevencion: string;
  mitigacion: string;
  contingencia: string;
}

export interface ComputedRisk extends RiskItem {
  baseProbabilidad: number;
  baseNivel: number;
  baseZona: RiskZone;
  nivel: number;
  zona: RiskZone;
  isHighest: boolean;
}

export const INITIAL_RISKS: RiskItem[] = [
  {
    id: 'R1',
    title: 'Falla en la comunicación Web Service (HTTPS) entre GD y Academusoft',
    requirements: ['RF-02', 'RNF-02'],
    impacto: 5,
    probabilidad: 2,
    responsable: 'Juan',
    prevencion: 'Pruebas de integración previas al despliegue.',
    mitigacion: 'Monitoreo activo con alertas.',
    contingencia: 'Procedimiento manual de respaldo para cargue de pagos.',
  },
  {
    id: 'R2',
    title: 'Incompatibilidad de formatos de datos entre GD y Academusoft',
    requirements: ['RF-05'],
    impacto: 4,
    probabilidad: 4,
    responsable: 'María',
    prevencion: 'Levantamiento y documentación formal de formatos.',
    mitigacion: 'Módulo de validación que rechace registros incorrectos.',
    contingencia: 'Revisión manual de registros con error.',
  },
  {
    id: 'R3',
    title: 'Acceso no autorizado o filtración de información financiera durante la transmisión',
    requirements: ['RNF-01'],
    impacto: 5,
    probabilidad: 3,
    responsable: 'Jaider',
    prevencion: 'Cifrado y autenticación en el canal HTTPS.',
    mitigacion: 'Control de acceso por roles y auditoría periódica.',
    contingencia: 'Protocolo de respuesta a incidentes.',
  },
  {
    id: 'R4',
    title: 'Caída o lentitud del servicio en periodos críticos de pago y matrícula',
    requirements: ['RNF-03', 'RNF-04'],
    impacto: 4,
    probabilidad: 3,
    responsable: 'Juan',
    prevencion: 'Definir umbrales de disponibilidad y tiempo de respuesta.',
    mitigacion: 'Pruebas de carga del pico de matrícula.',
    contingencia: 'Refuerzo de soporte técnico en esos periodos.',
  },
  {
    id: 'R5',
    title: 'Retraso en desarrollo y mantenimiento por déficit de personal de TI',
    requirements: ['RNF-06', 'PETI p. 42-43'],
    impacto: 3,
    probabilidad: 4,
    responsable: 'María',
    prevencion: 'Cronograma según disponibilidad real.',
    mitigacion: 'Documentación técnica detallada.',
    contingencia: 'Apoyo externo puntual.',
  },
];

export const ZONES_ORDER: RiskZone[] = ['Bajo', 'Medio', 'Alto', 'Crítico'];

export const ZONE_META: Record<
  RiskZone,
  {
    color: string;
    lightText: string;
    darkText: string;
    badgeBg: string;
    glowShadow: string;
    cellClasses: string;
    ring: string;
    range: string;
  }
> = {
  Bajo: {
    color: '#34D399',
    lightText: 'text-emerald-700',
    darkText: 'dark:text-emerald-300',
    badgeBg: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-700 dark:text-emerald-300',
    glowShadow: '0 0 28px -6px rgba(52, 211, 153, 0.35)',
    cellClasses:
      'bg-emerald-500/[0.08] hover:bg-emerald-500/[0.15] border-emerald-500/25 dark:bg-emerald-500/[0.08] dark:hover:bg-emerald-500/[0.14] dark:border-emerald-500/20',
    ring: 'ring-emerald-400/50',
    range: '1–4',
  },
  Medio: {
    color: '#FBBF24',
    lightText: 'text-amber-700',
    darkText: 'dark:text-amber-300',
    badgeBg: 'bg-amber-500/15 border-amber-500/35 text-amber-800 dark:text-amber-300',
    glowShadow: '0 0 28px -6px rgba(251, 191, 36, 0.35)',
    cellClasses:
      'bg-amber-400/[0.11] hover:bg-amber-400/[0.18] border-amber-500/25 dark:bg-amber-400/[0.09] dark:hover:bg-amber-400/[0.16] dark:border-amber-400/20',
    ring: 'ring-amber-400/50',
    range: '5–9',
  },
  Alto: {
    color: '#FB923C',
    lightText: 'text-orange-700',
    darkText: 'dark:text-orange-300',
    badgeBg: 'bg-orange-500/15 border-orange-500/35 text-orange-800 dark:text-orange-300',
    glowShadow: '0 0 30px -6px rgba(251, 146, 60, 0.4)',
    cellClasses:
      'bg-orange-500/[0.11] hover:bg-orange-500/[0.18] border-orange-500/30 dark:bg-orange-500/[0.11] dark:hover:bg-orange-500/[0.19] dark:border-orange-500/25',
    ring: 'ring-orange-400/60',
    range: '10–16',
  },
  Crítico: {
    color: '#F43F5E',
    lightText: 'text-rose-700',
    darkText: 'dark:text-rose-300',
    badgeBg: 'bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300',
    glowShadow: '0 0 34px -6px rgba(244, 63, 94, 0.45)',
    cellClasses:
      'bg-rose-500/[0.12] hover:bg-rose-500/[0.20] border-rose-500/30 dark:bg-rose-500/[0.14] dark:hover:bg-rose-500/[0.22] dark:border-rose-500/30',
    ring: 'ring-rose-500/60',
    range: '20–25',
  },
};

export const IMPACT_LABELS: Record<number, string> = {
  1: 'Mínimo',
  2: 'Menor',
  3: 'Moderado',
  4: 'Mayor',
  5: 'Severo',
};

export const PROB_LABELS: Record<number, string> = {
  1: 'Rara',
  2: 'Improbable',
  3: 'Posible',
  4: 'Probable',
  5: 'Casi segura',
};

export function getRiskZone(level: number): RiskZone {
  if (level >= 20) return 'Crítico';
  if (level >= 10) return 'Alto';
  if (level >= 5) return 'Medio';
  return 'Bajo';
}

export function getInitials(name: string): string {
  const clean = name.trim();
  if (!clean) return 'UT';
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

export function getOwnerGradient(name: string): string {
  switch (name) {
    case 'Juan':
      return 'from-cyan-400 to-blue-500';
    case 'María':
      return 'from-violet-400 to-fuchsia-500';
    case 'Jaider':
      return 'from-emerald-400 to-cyan-500';
    default:
      return 'from-cyan-400 to-violet-500';
  }
}

// ----------------------------------------------------------------------------
// 8. PLAN DE IMPLEMENTACIÓN (ALTERNATIVA 3 · iPaaS EN LA NUBE)
// ----------------------------------------------------------------------------

export type ImplementationPriority = 'Alta' | 'Media';
export type ImplementationStatus = 'Pendiente' | 'En progreso' | 'Completado';

export interface ImplementationActivity {
  id: number;
  priority: ImplementationPriority;
  activity: string;
  responsable: string;
  dependencies: number[];
  dependenciesLabel: string;
  durationWeeks: number;
  startWeek: number; // 1..12
  requirements: string[];
  risks: string[];
}

export const IMPLEMENTATION_NOTICE =
  'Plazos y responsables son propuesta del equipo; el PETI UTS 2026 no define cronograma ni presupuesto.';

export const IMPLEMENTATION_OWNER_FILTERS = [
  'Todas',
  'Equipo de TI',
  'Área financiera',
  'Área académica',
  'Proveedor iPaaS',
  'Líder del proyecto',
] as const;

export interface ImplementationPhase {
  id: string;
  name: string;
  weekRange: string;
  startMin: number;
  startMax: number;
  accent: string;
}

export const IMPLEMENTATION_PHASES: ImplementationPhase[] = [
  {
    id: 'planeacion',
    name: 'Planeación',
    weekRange: 'S1 a S3',
    startMin: 1,
    startMax: 3,
    accent: '#22D3EE',
  },
  {
    id: 'configuracion',
    name: 'Configuración',
    weekRange: 'S4 a S5',
    startMin: 4,
    startMax: 5,
    accent: '#8B5CF6',
  },
  {
    id: 'construccion',
    name: 'Construcción',
    weekRange: 'S6 a S7',
    startMin: 6,
    startMax: 7,
    accent: '#38BDF8',
  },
  {
    id: 'pruebas',
    name: 'Pruebas',
    weekRange: 'S8 a S10',
    startMin: 8,
    startMax: 10,
    accent: '#FBBF24',
  },
  {
    id: 'cierre',
    name: 'Cierre',
    weekRange: 'S11 a S12',
    startMin: 11,
    startMax: 12,
    accent: '#34D399',
  },
];

export const IMPLEMENTATION_ACTIVITIES: ImplementationActivity[] = [
  {
    id: 1,
    priority: 'Alta',
    activity:
      'Confirmar alcance y requisitos con las áreas; definir métricas pendientes (disponibilidad, tiempo de respuesta, volumen de pagos)',
    responsable: 'Líder del proyecto, área financiera y área académica',
    dependencies: [],
    dependenciesLabel: 'N/A',
    durationWeeks: 1,
    startWeek: 1,
    requirements: ['RNF-03', 'RNF-04'],
    risks: ['R4'],
  },
  {
    id: 2,
    priority: 'Alta',
    activity:
      'Levantar y documentar los formatos de datos y las APIs de GD y Academusoft',
    responsable: 'Equipo de TI de las UTS, proveedores de GD y Academusoft',
    dependencies: [1],
    dependenciesLabel: '1',
    durationWeeks: 2,
    startWeek: 2,
    requirements: ['RF-05'],
    risks: ['R2'],
  },
  {
    id: 3,
    priority: 'Alta',
    activity:
      'Validar la Ley 1581 de 2012 y las condiciones del proveedor iPaaS (SLA, ubicación de los datos) y habilitar el servicio',
    responsable: 'Líder del proyecto, equipo de TI',
    dependencies: [1],
    dependenciesLabel: '1',
    durationWeeks: 2,
    startWeek: 2,
    requirements: ['RNF-01', 'RNF-03'],
    risks: ['R3', 'R4'],
  },
  {
    id: 4,
    priority: 'Alta',
    activity:
      'Configurar el servicio iPaaS y la conexión segura nube–UTS (HTTPS, autenticación y cifrado)',
    responsable: 'Equipo de TI, proveedor iPaaS',
    dependencies: [2, 3],
    dependenciesLabel: '2, 3',
    durationWeeks: 2,
    startWeek: 4,
    requirements: ['RNF-01', 'RNF-02'],
    risks: ['R1', 'R3'],
  },
  {
    id: 5,
    priority: 'Alta',
    activity:
      'Construir el flujo principal: capturar pagos de GD y enviarlos a Academusoft por Web Service HTTPS',
    responsable: 'Equipo de TI',
    dependencies: [4],
    dependenciesLabel: '4',
    durationWeeks: 2,
    startWeek: 6,
    requirements: ['RF-01', 'RF-02', 'RF-03'],
    risks: ['R1'],
  },
  {
    id: 6,
    priority: 'Media',
    activity:
      'Implementar validación de formato, registro del estado de pago, consulta de estado e historial (log) de cargues',
    responsable: 'Equipo de TI',
    dependencies: [4],
    dependenciesLabel: '4',
    durationWeeks: 2,
    startWeek: 6,
    requirements: ['RF-04', 'RF-05', 'RF-06', 'RNF-05'],
    risks: ['R2'],
  },
  {
    id: 7,
    priority: 'Media',
    activity: 'Configurar la consola de monitoreo y las alertas de fallas',
    responsable: 'Equipo de TI, proveedor iPaaS',
    dependencies: [5, 6],
    dependenciesLabel: '5, 6',
    durationWeeks: 1,
    startWeek: 8,
    requirements: ['RF-04', 'RNF-05'],
    risks: ['R1', 'R4'],
  },
  {
    id: 8,
    priority: 'Alta',
    activity:
      'Pruebas de integración y de carga (simulando el pico de matrícula)',
    responsable: 'Equipo de TI, área financiera',
    dependencies: [5, 6],
    dependenciesLabel: '5, 6',
    durationWeeks: 2,
    startWeek: 8,
    requirements: ['RNF-03', 'RNF-04'],
    risks: ['R1', 'R4'],
  },
  {
    id: 9,
    priority: 'Alta',
    activity:
      'Pruebas de aceptación con las áreas financiera y académica',
    responsable: 'Área financiera, área académica',
    dependencies: [7, 8],
    dependenciesLabel: '7, 8',
    durationWeeks: 1,
    startWeek: 10,
    requirements: ['RF-01 a RF-06'],
    risks: ['R2'],
  },
  {
    id: 10,
    priority: 'Media',
    activity:
      'Capacitar al personal y entregar manual de uso y documentación técnica',
    responsable: 'Equipo de TI',
    dependencies: [8],
    dependenciesLabel: '8',
    durationWeeks: 1,
    startWeek: 10,
    requirements: ['RNF-06'],
    risks: ['R5'],
  },
  {
    id: 11,
    priority: 'Alta',
    activity:
      'Revisión final del cumplimiento de requisitos (RF-01 a RF-06, RNF-01 a RNF-06)',
    responsable: 'Líder del proyecto',
    dependencies: [9, 10],
    dependenciesLabel: '9, 10',
    durationWeeks: 1,
    startWeek: 11,
    requirements: ['todos'],
    risks: ['todos'],
  },
  {
    id: 12,
    priority: 'Alta',
    activity:
      'Puesta en producción y seguimiento del primer periodo de pagos',
    responsable: 'Equipo de TI, líder del proyecto',
    dependencies: [11],
    dependenciesLabel: '11',
    durationWeeks: 1,
    startWeek: 12,
    requirements: ['RNF-03', 'RNF-04'],
    risks: ['R1', 'R4'],
  },
];

