import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  Filter,
  GripVertical,
  Info,
  Layers,
  Minus,
  Moon,
  Plus,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  TrendingDown,
  UserCheck,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';

// ============================================================================
// TIPOS Y DATOS INICIALES
// ============================================================================

type RiskZone = 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
type DetailTab = 'prevencion' | 'mitigacion' | 'contingencia';
type SortKey = 'id' | 'title' | 'responsable' | 'impacto' | 'probabilidad' | 'nivel' | 'zona';
type SortDirection = 'asc' | 'desc';

interface RiskItem {
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

interface ComputedRisk extends RiskItem {
  baseProbabilidad: number;
  baseNivel: number;
  baseZona: RiskZone;
  nivel: number;
  zona: RiskZone;
  isHighest: boolean;
}

const INITIAL_RISKS: RiskItem[] = [
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

const ZONES_ORDER: RiskZone[] = ['Bajo', 'Medio', 'Alto', 'Crítico'];

const ZONE_META: Record<
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

const IMPACT_LABELS: Record<number, string> = {
  1: 'Mínimo',
  2: 'Menor',
  3: 'Moderado',
  4: 'Mayor',
  5: 'Severo',
};

const PROB_LABELS: Record<number, string> = {
  1: 'Rara',
  2: 'Improbable',
  3: 'Posible',
  4: 'Probable',
  5: 'Casi segura',
};

function getRiskZone(level: number): RiskZone {
  if (level >= 20) return 'Crítico';
  if (level >= 10) return 'Alto';
  if (level >= 5) return 'Medio';
  return 'Bajo';
}

function getInitials(name: string): string {
  const clean = name.trim();
  if (!clean) return 'UT';
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

function getOwnerGradient(name: string): string {
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

// ============================================================================
// COMPONENTE: NÚMERO ANIMADO
// ============================================================================

function AnimatedNumber({
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    prevRef.current = value;

    const controls = animate(start, end, {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });

    return () => controls.stop();
  }, [value]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <span className="font-mono tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ============================================================================
// COMPONENTE: TARJETA KPI
// ============================================================================

function KpiCard({
  index,
  title,
  valueNode,
  subtitle,
  accentColor,
  icon,
  pulseBadge,
}: {
  index: number;
  title: string;
  valueNode: React.ReactNode;
  subtitle: React.ReactNode;
  accentColor: string;
  icon: React.ReactNode;
  pulseBadge?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      style={{
        boxShadow: `0 12px 34px -18px ${accentColor}66`,
      }}
      className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5 transition-colors duration-300"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ backgroundColor: accentColor }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <span className="text-xs font-medium tracking-wide text-slate-600 dark:text-slate-400">
          {title}
        </span>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-100/80 dark:bg-white/5"
          style={{ color: accentColor }}
        >
          {icon}
        </div>
      </div>

      <div className="relative mt-3 flex items-center gap-2.5">
        <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
          {valueNode}
        </div>
        {pulseBadge && (
          <span
            className="relative flex h-3 w-3 shrink-0"
            title="Riesgo de mayor nivel activo"
          >
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ backgroundColor: accentColor }}
            />
            <span
              className="relative inline-flex h-3 w-3 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </span>
        )}
      </div>

      <div className="relative mt-2 text-xs text-slate-600 dark:text-slate-400">
        {subtitle}
      </div>
    </motion.div>
  );
}

// ============================================================================
// COMPONENTE: MEDIDOR CIRCULAR ANIMADO DEL NIVEL DE RIESGO
// ============================================================================

function RiskCircularGauge({ level, zone }: { level: number; zone: RiskZone }) {
  const size = 128;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, level / 25));
  const offset = circumference * (1 - progress);
  const color = ZONE_META[zone].color;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-200 dark:text-white/10"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono text-3xl font-bold text-slate-900 dark:text-white leading-none">
          <AnimatedNumber value={level} />
        </span>
        <span className="mt-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
          de 25
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE: MAPA DE CALOR 5x5 ARRASTRABLE
// ============================================================================

function HeatmapMatrix({
  risks,
  matchedIds,
  selectedRiskId,
  simulateMitigation,
  onMoveRisk,
  onSelectRisk,
}: {
  risks: ComputedRisk[];
  matchedIds: Set<string>;
  selectedRiskId: string | null;
  simulateMitigation: boolean;
  onMoveRisk: (riskId: string, newImpacto: number, newProbabilidad: number) => void;
  onSelectRisk: (riskId: string) => void;
}) {
  const [hoveredRisk, setHoveredRisk] = useState<{
    risk: ComputedRisk;
    rect: DOMRect;
  } | null>(null);

  const [dragState, setDragState] = useState<{
    risk: ComputedRisk;
    x: number;
    y: number;
    hoverCell: { impacto: number; probabilidad: number } | null;
  } | null>(null);

  const pointerStartRef = useRef<{
    risk: ComputedRisk;
    startX: number;
    startY: number;
    active: boolean;
  } | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const start = pointerStartRef.current;
      if (!start) return;

      const dist = Math.hypot(e.clientX - start.startX, e.clientY - start.startY);
      if (!start.active && dist > 6) {
        start.active = true;
        setHoveredRisk(null);
      }

      if (start.active) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const cellEl = el?.closest('[data-heatmap-cell]') as HTMLElement | null;
        let hoverCell: { impacto: number; probabilidad: number } | null = null;

        if (cellEl) {
          const imp = Number(cellEl.dataset.impacto);
          const prob = Number(cellEl.dataset.probabilidad);
          if (imp >= 1 && imp <= 5 && prob >= 1 && prob <= 5) {
            hoverCell = { impacto: imp, probabilidad: prob };
          }
        }

        setDragState({
          risk: start.risk,
          x: e.clientX,
          y: e.clientY,
          hoverCell,
        });
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const start = pointerStartRef.current;
      if (!start) return;

      if (start.active) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const cellEl = el?.closest('[data-heatmap-cell]') as HTMLElement | null;
        if (cellEl) {
          const imp = Number(cellEl.dataset.impacto);
          const prob = Number(cellEl.dataset.probabilidad);
          if (imp >= 1 && imp <= 5 && prob >= 1 && prob <= 5) {
            if (imp !== start.risk.impacto || prob !== start.risk.probabilidad) {
              onMoveRisk(start.risk.id, imp, prob);
            }
          }
        }
      } else {
        onSelectRisk(start.risk.id);
      }

      pointerStartRef.current = null;
      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [onMoveRisk, onSelectRisk]);

  const probRows = [5, 4, 3, 2, 1];
  const impactCols = [1, 2, 3, 4, 5];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Mapa de calor de riesgos 5 por 5"
      className="relative rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-4 sm:p-6 shadow-xl shadow-slate-900/5 dark:shadow-cyan-950/30"
    >
      {/* Encabezado de sección */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Matriz interactiva de calor 5×5
            </h2>
            {simulateMitigation && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/15 px-2.5 py-0.5 font-mono text-[11px] font-medium text-cyan-700 dark:text-cyan-300">
                <Sparkles className="h-3 w-3" />
                Mitigación activa (-1 Prob.)
              </span>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Arrastra cualquier burbuja a otra celda para recalcular el escenario o haz clic para inspeccionar su plan de acción.
          </p>
        </div>

        {/* Leyenda rápida de zonas */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
          {ZONES_ORDER.map((z) => (
            <div key={z} className="flex items-center gap-1.5 font-mono text-[11px]">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: ZONE_META[z].color }}
              />
              <span>{z}</span>
              <span className="text-slate-400 dark:text-slate-500">({ZONE_META[z].range})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grilla 5x5 con ejes */}
      <div className="flex items-stretch gap-2 sm:gap-3">
        {/* Etiqueta eje Y */}
        <div className="hidden sm:flex items-center justify-center w-6 shrink-0">
          <span className="-rotate-90 whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Probabilidad
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="sm:hidden mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
            Eje Y: Probabilidad (5 → 1) · Eje X: Impacto (1 → 5)
          </div>

          <div className="grid grid-cols-[28px_1fr] sm:grid-cols-[76px_1fr] gap-2">
            {/* Etiquetas de filas (Probabilidad) */}
            <div className="grid grid-rows-5 gap-1.5 sm:gap-2">
              {probRows.map((p) => (
                <div
                  key={p}
                  className="flex flex-col items-end justify-center pr-1 sm:pr-2 text-right"
                >
                  <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {p}
                  </span>
                  <span className="hidden sm:block text-[10px] leading-tight text-slate-500 dark:text-slate-400">
                    {PROB_LABELS[p]}
                  </span>
                </div>
              ))}
            </div>

            {/* Celdas 5x5 */}
            <div className="grid grid-cols-5 grid-rows-5 gap-1.5 sm:gap-2">
              {probRows.map((prob) =>
                impactCols.map((imp) => {
                  const cellScore = imp * prob;
                  const cellZone = getRiskZone(cellScore);
                  const meta = ZONE_META[cellZone];
                  const cellRisks = risks.filter(
                    (r) => r.impacto === imp && r.probabilidad === prob
                  );
                  const ghostOriginRisks = simulateMitigation
                    ? risks.filter(
                        (r) =>
                          r.impacto === imp &&
                          r.baseProbabilidad === prob &&
                          r.baseProbabilidad !== r.probabilidad
                      )
                    : [];

                  const isDropTarget =
                    dragState?.hoverCell?.impacto === imp &&
                    dragState?.hoverCell?.probabilidad === prob;

                  return (
                    <div
                      key={`${imp}-${prob}`}
                      data-heatmap-cell="true"
                      data-impacto={imp}
                      data-probabilidad={prob}
                      className={`relative flex min-h-[58px] sm:min-h-[82px] flex-wrap items-center justify-center gap-1.5 rounded-2xl border p-1.5 sm:p-2 transition-all duration-200 ${
                        meta.cellClasses
                      } ${
                        isDropTarget
                          ? 'ring-2 ring-cyan-400 scale-[1.03] bg-cyan-400/20! z-10'
                          : ''
                      }`}
                    >
                      {/* Puntuación en esquina */}
                      <span className="pointer-events-none absolute right-1.5 top-1 font-mono text-[10px] font-semibold text-slate-500/75 dark:text-slate-400/70">
                        {cellScore}
                      </span>

                      {/* Marcador fantasma de posición previa si simulación está activa */}
                      {ghostOriginRisks.map((gr) => (
                        <span
                          key={`ghost-${gr.id}`}
                          title={`${gr.id} antes de mitigación (${gr.impacto}×${gr.baseProbabilidad}=${gr.baseNivel})`}
                          className="pointer-events-none inline-flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-slate-400/60 dark:border-slate-400/50 font-mono text-[9px] text-slate-500 dark:text-slate-400 opacity-60"
                        >
                          {gr.id}
                        </span>
                      ))}

                      {/* Burbujas de riesgo */}
                      {cellRisks.map((risk) => {
                        const isMatched = matchedIds.has(risk.id);
                        const isSelected = selectedRiskId === risk.id;
                        const isBeingDragged = dragState?.risk.id === risk.id;
                        const riskMeta = ZONE_META[risk.zona];

                        return (
                          <motion.button
                            key={risk.id}
                            layout
                            layoutId={`bubble-${risk.id}`}
                            type="button"
                            onPointerDown={(e) => {
                              e.preventDefault();
                              pointerStartRef.current = {
                                risk,
                                startX: e.clientX,
                                startY: e.clientY,
                                active: false,
                              };
                            }}
                            onMouseEnter={(e) => {
                              if (!dragState) {
                                setHoveredRisk({
                                  risk,
                                  rect: e.currentTarget.getBoundingClientRect(),
                                });
                              }
                            }}
                            onMouseLeave={() => setHoveredRisk(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelectRisk(risk.id);
                              }
                            }}
                            aria-label={`Riesgo ${risk.id}: ${risk.title}. Nivel ${risk.nivel} (${risk.zona}). Presiona Enter para ver detalles o arrastra para mover.`}
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                            style={{
                              backgroundColor: riskMeta.color,
                              boxShadow: isSelected
                                ? `0 0 0 3px #22D3EE, 0 8px 24px ${riskMeta.color}99`
                                : `0 6px 18px -2px ${riskMeta.color}88`,
                            }}
                            className={`relative flex h-9 w-9 sm:h-11 sm:w-11 cursor-grab active:cursor-grabbing touch-none select-none items-center justify-center rounded-full font-mono text-xs sm:text-sm font-bold text-slate-950 transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                              isMatched ? 'opacity-100' : 'opacity-25 scale-90'
                            } ${isBeingDragged ? 'opacity-30' : ''}`}
                          >
                            {/* Pulso animado junto al riesgo con nivel más alto */}
                            {risk.isHighest && isMatched && (
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-1.5 rounded-full border-2 animate-ping opacity-75"
                                style={{ borderColor: riskMeta.color }}
                              />
                            )}
                            <span className="relative z-10">{risk.id}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Etiquetas de columnas (Impacto) */}
          <div className="mt-2 grid grid-cols-[28px_1fr] sm:grid-cols-[76px_1fr] gap-2">
            <div />
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
              {impactCols.map((imp) => (
                <div key={imp} className="flex flex-col items-center">
                  <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {imp}
                  </span>
                  <span className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400">
                    {IMPACT_LABELS[imp]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-1 hidden sm:block text-center font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Impacto
          </div>
        </div>
      </div>

      {/* Tooltip flotante al hacer hover sobre una burbuja */}
      <AnimatePresence>
        {hoveredRisk && !dragState && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.14 }}
            style={{
              position: 'fixed',
              left: Math.min(
                window.innerWidth - 290,
                Math.max(16, hoveredRisk.rect.left + hoveredRisk.rect.width / 2 - 135)
              ),
              top: Math.max(16, hoveredRisk.rect.top - 110),
            }}
            className="pointer-events-none z-50 w-[270px] rounded-2xl border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-[#0B1126]/95 p-3 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                {hoveredRisk.risk.id} · {hoveredRisk.risk.responsable}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${
                  ZONE_META[hoveredRisk.risk.zona].badgeBg
                }`}
              >
                {hoveredRisk.risk.zona} ({hoveredRisk.risk.nivel})
              </span>
            </div>
            <p className="mt-1.5 text-xs font-medium leading-snug text-slate-800 dark:text-slate-100">
              {hoveredRisk.risk.title}
            </p>
            <div className="mt-2 flex items-center gap-2 font-mono text-[10px] text-slate-500 dark:text-slate-400">
              <span>Impacto: {hoveredRisk.risk.impacto}</span>
              <span>·</span>
              <span>Prob: {hoveredRisk.risk.probabilidad}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Burbuja fantasma flotante durante el arrastre */}
      {dragState && (
        <div
          style={{
            position: 'fixed',
            left: dragState.x,
            top: dragState.y,
            transform: 'translate(-50%, -50%)',
          }}
          className="pointer-events-none z-50 flex flex-col items-center gap-1.5"
        >
          <div
            style={{
              backgroundColor:
                ZONE_META[
                  dragState.hoverCell
                    ? getRiskZone(
                        dragState.hoverCell.impacto * dragState.hoverCell.probabilidad
                      )
                    : dragState.risk.zona
                ].color,
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full font-mono text-sm font-bold text-slate-950 shadow-2xl ring-4 ring-cyan-400/60"
          >
            {dragState.risk.id}
          </div>
          {dragState.hoverCell && (
            <div className="rounded-xl border border-cyan-400/40 bg-slate-950/90 px-2.5 py-1 font-mono text-[11px] font-semibold text-cyan-300 shadow-lg">
              I:{dragState.hoverCell.impacto} × P:{dragState.hoverCell.probabilidad} ={' '}
              {dragState.hoverCell.impacto * dragState.hoverCell.probabilidad}
            </div>
          )}
        </div>
      )}
    </motion.section>
  );
}

// ============================================================================
// COMPONENTE: PANEL DE DETALLE LATERAL DESLIZANTE
// ============================================================================

function RiskDetailDrawer({
  risk,
  simulateMitigation,
  onClose,
  onAdjustCoordinates,
}: {
  risk: ComputedRisk | null;
  simulateMitigation: boolean;
  onClose: () => void;
  onAdjustCoordinates: (riskId: string, impacto: number, probabilidad: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>('prevencion');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const tabs: { id: DetailTab; label: string; icon: React.ReactNode; content: string }[] =
    risk
      ? [
          {
            id: 'prevencion',
            label: 'Prevención',
            icon: <ShieldCheck className="h-4 w-4" />,
            content: risk.prevencion,
          },
          {
            id: 'mitigacion',
            label: 'Mitigación',
            icon: <SlidersHorizontal className="h-4 w-4" />,
            content: risk.mitigacion,
          },
          {
            id: 'contingencia',
            label: 'Contingencia',
            icon: <AlertTriangle className="h-4 w-4" />,
            content: risk.contingencia,
          },
        ]
      : [];

  return (
    <AnimatePresence>
      {risk && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`Detalle del riesgo ${risk.id}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col border-l border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#090F24]/95 backdrop-blur-2xl shadow-2xl"
          >
            {/* Cabecera del panel */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 p-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400">
                    {risk.id}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold ${
                      ZONE_META[risk.zona].badgeBg
                    }`}
                  >
                    Zona {risk.zona}
                  </span>
                  {risk.isHighest && (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                      </span>
                      Máxima prioridad
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900 dark:text-white">
                  {risk.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar panel de detalle"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 dark:border-white/15 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido desplazable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Medidor circular y controles de Impacto/Probabilidad */}
              <div className="flex flex-col sm:flex-row items-center gap-6 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] p-5">
                <RiskCircularGauge level={risk.nivel} zone={risk.zona} />

                <div className="flex-1 w-full space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                      <span>Impacto ({IMPACT_LABELS[risk.impacto]})</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {risk.impacto} / 5
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Disminuir impacto"
                        disabled={risk.impacto <= 1}
                        onClick={() =>
                          onAdjustCoordinates(
                            risk.id,
                            Math.max(1, risk.impacto - 1),
                            risk.probabilidad
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 disabled:opacity-35 hover:border-cyan-400 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-cyan-400 transition-all duration-300"
                          style={{ width: `${(risk.impacto / 5) * 100}%` }}
                        />
                      </div>
                      <button
                        type="button"
                        aria-label="Aumentar impacto"
                        disabled={risk.impacto >= 5}
                        onClick={() =>
                          onAdjustCoordinates(
                            risk.id,
                            Math.min(5, risk.impacto + 1),
                            risk.probabilidad
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 disabled:opacity-35 hover:border-cyan-400 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                      <span>
                        Probabilidad ({PROB_LABELS[risk.probabilidad]})
                        {simulateMitigation && risk.baseProbabilidad !== risk.probabilidad
                          ? ` · Antes: ${risk.baseProbabilidad}`
                          : ''}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {risk.probabilidad} / 5
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Disminuir probabilidad"
                        disabled={risk.probabilidad <= 1}
                        onClick={() =>
                          onAdjustCoordinates(
                            risk.id,
                            risk.impacto,
                            Math.max(1, risk.probabilidad - 1)
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 disabled:opacity-35 hover:border-violet-400 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-violet-400 transition-all duration-300"
                          style={{ width: `${(risk.probabilidad / 5) * 100}%` }}
                        />
                      </div>
                      <button
                        type="button"
                        aria-label="Aumentar probabilidad"
                        disabled={risk.probabilidad >= 5}
                        onClick={() =>
                          onAdjustCoordinates(
                            risk.id,
                            risk.impacto,
                            Math.min(5, risk.probabilidad + 1)
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 disabled:opacity-35 hover:border-violet-400 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsable y Requisitos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-[20px] border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-4">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Responsable
                  </span>
                  <div className="mt-2.5 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${getOwnerGradient(
                        risk.responsable
                      )} font-mono text-xs font-bold text-slate-950 shadow-md`}
                    >
                      {getInitials(risk.responsable)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {risk.responsable}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Líder asignado UTS
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[20px] border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-4">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Requisitos asociados
                  </span>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {risk.requirements.map((req) => (
                      <span
                        key={req}
                        className="inline-flex items-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-300"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tres pestañas animadas: Prevención / Mitigación / Contingencia */}
              <div>
                <div
                  role="tablist"
                  aria-label="Planes de tratamiento del riesgo"
                  className="grid grid-cols-3 gap-1.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] p-1.5"
                >
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        role="tab"
                        aria-selected={isActive}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                          isActive
                            ? 'text-slate-950 dark:text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="detailTabIndicator"
                            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                            className="absolute inset-0 rounded-xl bg-white dark:bg-cyan-500/20 border border-slate-200/80 dark:border-cyan-400/35 shadow-sm"
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                          {tab.icon}
                          <span>{tab.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 min-h-[120px] rounded-[20px] border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-5">
                  <AnimatePresence mode="wait">
                    {tabs
                      .filter((t) => t.id === activeTab)
                      .map((t) => (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                            {t.icon}
                            <span>Estrategia de {t.label.toLowerCase()}</span>
                          </div>
                          <p className="mt-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                            {t.content}
                          </p>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// COMPONENTE: GRÁFICOS (BARRAS HORIZONTALES + DONA CON LEYENDA FILTRABLE)
// ============================================================================

function ChartsPanel({
  risks,
  zoneFilter,
  isDark,
  onToggleZoneFilter,
  onSelectRisk,
}: {
  risks: ComputedRisk[];
  zoneFilter: RiskZone | 'Todos';
  isDark: boolean;
  onToggleZoneFilter: (zone: RiskZone) => void;
  onSelectRisk: (riskId: string) => void;
}) {
  const barData = useMemo(() => {
    const filtered =
      zoneFilter === 'Todos' ? risks : risks.filter((r) => r.zona === zoneFilter);
    return [...filtered]
      .sort((a, b) => b.nivel - a.nivel || a.id.localeCompare(b.id))
      .map((r) => ({
        id: r.id,
        name: r.id,
        fullTitle: r.title,
        nivel: r.nivel,
        zona: r.zona,
        color: ZONE_META[r.zona].color,
      }));
  }, [risks, zoneFilter]);

  const donutData = useMemo(() => {
    return ZONES_ORDER.map((zone) => {
      const count = risks.filter((r) => r.zona === zone).length;
      return {
        name: zone,
        value: count,
        color: ZONE_META[zone].color,
      };
    });
  }, [risks]);

  const visibleDonutData = useMemo(() => {
    const active = donutData.filter((d) => d.value > 0);
    if (zoneFilter === 'Todos') return active;
    return active.map((d) => ({
      ...d,
      dimmed: d.name !== zoneFilter,
    }));
  }, [donutData, zoneFilter]);

  const tickColor = isDark ? '#94A3B8' : '#475569';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Gráfico de barras horizontales ordenadas por nivel */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Gráfico de barras de nivel de riesgo"
        className="lg:col-span-7 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5 sm:p-6 shadow-lg shadow-slate-900/5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Ranking de exposición por riesgo
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ordenado por nivel actual (Impacto × Probabilidad). Haz clic en una barra para abrir el detalle.
            </p>
          </div>
          {zoneFilter !== 'Todos' && (
            <button
              type="button"
              onClick={() => onToggleZoneFilter(zoneFilter)}
              className="rounded-full border border-cyan-500/35 bg-cyan-500/10 px-3 py-1 font-mono text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              Filtro: {zoneFilter} ×
            </button>
          )}
        </div>

        {barData.length === 0 ? (
          <div className="flex h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-center p-6">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No hay riesgos en la zona {zoneFilter} actualmente.
            </p>
            <button
              type="button"
              onClick={() => {
                if (zoneFilter !== 'Todos') onToggleZoneFilter(zoneFilter);
              }}
              className="mt-3 rounded-full bg-cyan-500/15 px-4 py-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/25 transition-colors"
            >
              Mostrar todas las zonas
            </button>
          </div>
        ) : (
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 4, right: 20, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 25]}
                  tick={{ fill: tickColor, fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={42}
                  tick={{
                    fill: isDark ? '#F1F5F9' : '#0F172A',
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: 'JetBrains Mono',
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)' }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const item = payload[0].payload;
                    return (
                      <div className="max-w-[260px] rounded-2xl border border-slate-200 dark:border-white/15 bg-white/95 dark:bg-[#0B1126]/95 p-3 shadow-xl backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-2 font-mono text-xs font-bold">
                          <span style={{ color: item.color }}>{item.id}</span>
                          <span className="text-slate-900 dark:text-white">
                            Nivel {item.nivel} ({item.zona})
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                          {item.fullTitle}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="nivel"
                  radius={[0, 10, 10, 0]}
                  barSize={24}
                  onClick={(data) => {
                    if (data?.id) onSelectRisk(String(data.id));
                  }}
                  className="cursor-pointer"
                >
                  {barData.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.section>

      {/* Gráfico de dona por categoría de riesgo */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Gráfico de dona por categoría de riesgo"
        className="lg:col-span-5 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5 sm:p-6 shadow-lg shadow-slate-900/5 flex flex-col justify-between"
      >
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Distribución por categoría
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Haz clic en cualquier zona de la leyenda para filtrar ambos gráficos y el mapa.
          </p>
        </div>

        <div className="relative my-2 h-[185px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={visibleDonutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={54}
                outerRadius={78}
                paddingAngle={4}
                stroke="none"
                onClick={(entry) => {
                  if (entry?.name) onToggleZoneFilter(entry.name as RiskZone);
                }}
                className="cursor-pointer"
              >
                {visibleDonutData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={
                      zoneFilter === 'Todos' || zoneFilter === entry.name ? 1 : 0.25
                    }
                  />
                ))}
              </Pie>
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-slate-200 dark:border-white/15 bg-white/95 dark:bg-[#0B1126]/95 px-3 py-2 text-xs shadow-lg">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {d.name}:{' '}
                      </span>
                      <span className="font-mono font-bold" style={{ color: d.color }}>
                        {d.value} {d.value === 1 ? 'riesgo' : 'riesgos'}
                      </span>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Total en el centro de la dona */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
              {zoneFilter === 'Todos'
                ? risks.length
                : risks.filter((r) => r.zona === zoneFilter).length}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {zoneFilter === 'Todos' ? 'Total' : zoneFilter}
            </span>
          </div>
        </div>

        {/* Leyenda interactiva */}
        <div className="grid grid-cols-2 gap-2">
          {donutData.map((d) => {
            const z = d.name as RiskZone;
            const isActive = zoneFilter === z;
            return (
              <button
                key={z}
                type="button"
                onClick={() => onToggleZoneFilter(z)}
                aria-pressed={isActive}
                className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-400/15 text-slate-900 dark:text-white shadow-sm'
                    : 'border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/25'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <span>{z}</span>
                </span>
                <span className="font-mono font-bold">{d.value}</span>
              </button>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}

// ============================================================================
// COMPONENTE: TABLA DE RIESGOS ORDENABLE Y EXPANDIBLE
// ============================================================================

function RiskTable({
  risks,
  onSelectRisk,
}: {
  risks: ComputedRisk[];
  onSelectRisk: (riskId: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>('nivel');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'id' || key === 'title' || key === 'responsable' ? 'asc' : 'desc');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sortedRisks = useMemo(() => {
    const copy = [...risks];
    const zoneRank: Record<RiskZone, number> = {
      Bajo: 1,
      Medio: 2,
      Alto: 3,
      Crítico: 4,
    };

    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'id':
          cmp = a.id.localeCompare(b.id);
          break;
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'responsable':
          cmp = a.responsable.localeCompare(b.responsable);
          break;
        case 'impacto':
          cmp = a.impacto - b.impacto;
          break;
        case 'probabilidad':
          cmp = a.probabilidad - b.probabilidad;
          break;
        case 'nivel':
          cmp = a.nivel - b.nivel;
          break;
        case 'zona':
          cmp = zoneRank[a.zona] - zoneRank[b.zona];
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [risks, sortKey, sortDir]);

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="h-3.5 w-3.5 opacity-45" />;
    return sortDir === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Tabla ordenable de riesgos"
      className="rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5 sm:p-6 shadow-lg shadow-slate-900/5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Registro analítico de riesgos
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Haz clic en los encabezados para ordenar o expande cada fila para consultar sus controles.
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
          Mostrando {sortedRisks.length} {sortedRisks.length === 1 ? 'registro' : 'registros'}
        </span>
      </div>

      {sortedRisks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Ningún riesgo coincide con los filtros seleccionados.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200/90 dark:border-white/10 font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 pr-3">
                  <button
                    type="button"
                    onClick={() => toggleSort('id')}
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    ID {renderSortIcon('id')}
                  </button>
                </th>
                <th className="py-3 px-3">
                  <button
                    type="button"
                    onClick={() => toggleSort('title')}
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Descripción del riesgo {renderSortIcon('title')}
                  </button>
                </th>
                <th className="py-3 px-3">
                  <button
                    type="button"
                    onClick={() => toggleSort('responsable')}
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Responsable {renderSortIcon('responsable')}
                  </button>
                </th>
                <th className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort('impacto')}
                    className="inline-flex items-center justify-end gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Imp. {renderSortIcon('impacto')}
                  </button>
                </th>
                <th className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort('probabilidad')}
                    className="inline-flex items-center justify-end gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Prob. {renderSortIcon('probabilidad')}
                  </button>
                </th>
                <th className="py-3 px-3 w-44">
                  <button
                    type="button"
                    onClick={() => toggleSort('nivel')}
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Nivel {renderSortIcon('nivel')}
                  </button>
                </th>
                <th className="py-3 px-3">
                  <button
                    type="button"
                    onClick={() => toggleSort('zona')}
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Categoría {renderSortIcon('zona')}
                  </button>
                </th>
                <th className="py-3 pl-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-white/5 text-sm">
              {sortedRisks.map((r) => {
                const isExpanded = !!expandedIds[r.id];
                const meta = ZONE_META[r.zona];

                return (
                  <React.Fragment key={r.id}>
                    <tr className="group transition-colors hover:bg-slate-100/70 dark:hover:bg-white/[0.03]">
                      <td className="py-3.5 pr-3 align-middle">
                        <button
                          type="button"
                          onClick={() => onSelectRisk(r.id)}
                          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline focus-visible:outline-2 focus-visible:outline-cyan-400"
                        >
                          {r.id}
                          {r.isHighest && (
                            <span
                              title="Riesgo de mayor nivel"
                              className="h-2 w-2 rounded-full animate-pulse"
                              style={{ backgroundColor: meta.color }}
                            />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-3 align-middle max-w-md">
                        <div className="font-medium text-slate-900 dark:text-slate-100 leading-snug">
                          {r.title}
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          Req: {r.requirements.join(' · ')}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 align-middle">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${getOwnerGradient(
                              r.responsable
                            )} font-mono text-[10px] font-bold text-slate-950`}
                          >
                            {getInitials(r.responsable)}
                          </span>
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                            {r.responsable}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 align-middle text-right font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {r.impacto}
                      </td>
                      <td className="py-3.5 px-3 align-middle text-right font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {r.probabilidad}
                      </td>
                      <td className="py-3.5 px-3 align-middle">
                        <div className="flex items-center gap-2.5">
                          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                            <motion.div
                              initial={false}
                              animate={{ width: `${(r.nivel / 25) * 100}%` }}
                              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: meta.color }}
                            />
                          </div>
                          <span className="w-7 text-right font-mono text-xs font-bold text-slate-900 dark:text-white">
                            {r.nivel}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 align-middle">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${meta.badgeBg}`}
                        >
                          {r.zona}
                        </span>
                      </td>
                      <td className="py-3.5 pl-3 align-middle text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectRisk(r.id)}
                            aria-label={`Ver detalle completo de ${r.id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleExpand(r.id)}
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? 'Contraer' : 'Expandir'} fila de ${r.id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Fila expandida */}
                    <AnimatePresence>
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="p-0">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden bg-slate-50/90 dark:bg-white/[0.025]"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-t border-slate-200/70 dark:border-white/5">
                                <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] p-3.5">
                                  <div className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    Prevención
                                  </div>
                                  <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                                    {r.prevencion}
                                  </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] p-3.5">
                                  <div className="font-mono text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                                    Mitigación
                                  </div>
                                  <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                                    {r.mitigacion}
                                  </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] p-3.5">
                                  <div className="font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                    Contingencia
                                  </div>
                                  <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                                    {r.contingencia}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.section>
  );
}

// ============================================================================
// APLICACIÓN PRINCIPAL
// ============================================================================

export default function App() {
  const [risks, setRisks] = useState<RiskItem[]>(INITIAL_RISKS);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [zoneFilter, setZoneFilter] = useState<RiskZone | 'Todos'>('Todos');
  const [ownerFilter, setOwnerFilter] = useState<string>('Todos');
  const [simulateMitigation, setSimulateMitigation] = useState<boolean>(false);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Cálculo reactivo de riesgos con o sin simulación de mitigación
  const computedRisks: ComputedRisk[] = useMemo(() => {
    const raw = risks.map((r) => {
      const effectiveProb = simulateMitigation
        ? Math.max(1, r.probabilidad - 1)
        : r.probabilidad;
      const baseNivel = r.impacto * r.probabilidad;
      const nivel = r.impacto * effectiveProb;
      return {
        ...r,
        baseProbabilidad: r.probabilidad,
        baseNivel,
        baseZona: getRiskZone(baseNivel),
        probabilidad: effectiveProb,
        nivel,
        zona: getRiskZone(nivel),
      };
    });

    const maxNivel = Math.max(...raw.map((r) => r.nivel), 0);
    return raw.map((r) => ({
      ...r,
      isHighest: r.nivel === maxNivel && maxNivel > 0,
    }));
  }, [risks, simulateMitigation]);

  // Riesgos filtrados por píldoras de zona y responsable
  const filteredRisks = useMemo(() => {
    return computedRisks.filter((r) => {
      const matchZone = zoneFilter === 'Todos' || r.zona === zoneFilter;
      const matchOwner = ownerFilter === 'Todos' || r.responsable === ownerFilter;
      return matchZone && matchOwner;
    });
  }, [computedRisks, zoneFilter, ownerFilter]);

  const matchedIds = useMemo(
    () => new Set(filteredRisks.map((r) => r.id)),
    [filteredRisks]
  );

  // Lista única de responsables
  const owners = useMemo(
    () => Array.from(new Set(INITIAL_RISKS.map((r) => r.responsable))),
    []
  );

  // KPIs y comparación Antes vs Después
  const metrics = useMemo(() => {
    const total = computedRisks.length;
    const avgCurrent =
      total > 0
        ? computedRisks.reduce((acc, r) => acc + r.nivel, 0) / total
        : 0;
    const avgBase =
      total > 0
        ? computedRisks.reduce((acc, r) => acc + r.baseNivel, 0) / total
        : 0;

    const highestList = computedRisks.filter((r) => r.isHighest);
    const highestNivel = highestList[0]?.nivel ?? 0;
    const highestIds = highestList.map((r) => r.id).join(', ');
    const highestZone = highestList[0]?.zona ?? 'Bajo';

    const highOrCritCount = computedRisks.filter(
      (r) => r.zona === 'Alto' || r.zona === 'Crítico'
    ).length;
    const highOrCritPct = total > 0 ? Math.round((highOrCritCount / total) * 100) : 0;

    const baseHighOrCritCount = computedRisks.filter(
      (r) => r.baseZona === 'Alto' || r.baseZona === 'Crítico'
    ).length;

    const zoneShift = ZONES_ORDER.map((z) => ({
      zone: z,
      before: computedRisks.filter((r) => r.baseZona === z).length,
      after: computedRisks.filter((r) => r.zona === z).length,
    }));

    return {
      total,
      avgCurrent,
      avgBase,
      highestNivel,
      highestIds,
      highestZone,
      highOrCritCount,
      highOrCritPct,
      baseHighOrCritCount,
      zoneShift,
    };
  }, [computedRisks]);

  const selectedRisk = useMemo(
    () => computedRisks.find((r) => r.id === selectedRiskId) ?? null,
    [computedRisks, selectedRiskId]
  );

  // Manejador de movimiento en el mapa o desde el panel lateral
  const handleMoveRisk = (
    riskId: string,
    newImpacto: number,
    newProbabilidad: number
  ) => {
    setRisks((prev) =>
      prev.map((r) => {
        if (r.id !== riskId) return r;
        const storedProb = simulateMitigation
          ? newProbabilidad === 5
            ? 5
            : Math.min(5, newProbabilidad + 1)
          : newProbabilidad;
        return {
          ...r,
          impacto: newImpacto,
          probabilidad: storedProb,
        };
      })
    );
    if (simulateMitigation && newProbabilidad === 5) {
      setSimulateMitigation(false);
    }
  };

  const handleToggleZoneFilter = (zone: RiskZone) => {
    setZoneFilter((prev) => (prev === zone ? 'Todos' : zone));
  };

  const handleReset = () => {
    setRisks(INITIAL_RISKS);
    setZoneFilter('Todos');
    setOwnerFilter('Todos');
    setSimulateMitigation(false);
    setSelectedRiskId(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Descripción',
      'Requisitos',
      'Responsable',
      'Impacto',
      'Probabilidad',
      'Nivel',
      'Categoría',
      'Prevención',
      'Mitigación',
      'Contingencia',
    ];

    const escapeCell = (val: string | number) => {
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = computedRisks.map((r) =>
      [
        r.id,
        r.title,
        r.requirements.join('; '),
        r.responsable,
        r.impacto,
        r.probabilidad,
        r.nivel,
        r.zona,
        r.prevencion,
        r.mitigacion,
        r.contingencia,
      ]
        .map(escapeCell)
        .join(',')
    );

    const csvContent = '\uFEFF' + [headers.map(escapeCell).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `riesgos_gd_academusoft_uts_${simulateMitigation ? 'mitigado' : 'actual'}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasChangesFromInitial = useMemo(() => {
    const positionsChanged = risks.some((r, idx) => {
      const orig = INITIAL_RISKS[idx];
      return r.impacto !== orig.impacto || r.probabilidad !== orig.probabilidad;
    });
    return (
      positionsChanged ||
      zoneFilter !== 'Todos' ||
      ownerFilter !== 'Todos' ||
      simulateMitigation
    );
  }, [risks, zoneFilter, ownerFilter, simulateMitigation]);

  return (
    <div className="relative min-h-screen overflow-x-clip transition-colors duration-300">
      {/* Fondo ambiental cyber-orgánico */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-[12%] -top-[18%] h-[620px] w-[620px] rounded-full bg-cyan-400/12 dark:bg-cyan-400/14 blur-[130px]" />
        <div className="absolute -right-[10%] top-[10%] h-[580px] w-[580px] rounded-full bg-violet-500/12 dark:bg-violet-500/16 blur-[140px]" />
        <div className="absolute bottom-[-18%] left-[32%] h-[500px] w-[500px] rounded-full bg-emerald-400/8 dark:bg-emerald-400/10 blur-[140px]" />
        <div className="cyber-noise absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" />
      </div>

      {/* Contenedor principal */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* 1. ENCABEZADO */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl px-5 sm:px-7 py-5 shadow-lg shadow-slate-900/5"
        >
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-medium text-cyan-700 dark:text-cyan-400">
              <span>Unidades Tecnológicas de Santander (UTS)</span>
              <span aria-hidden="true">·</span>
              <span>Gestión de Riesgos TI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              Integración GD ↔ Academusoft
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sala de control interactiva para evaluación, simulación de mitigación y seguimiento operativo de riesgos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportCSV}
              aria-label="Exportar resumen en formato CSV"
              className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200/90 dark:border-white/15 bg-white/80 dark:bg-white/5 px-4 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <Download className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span>Exportar resumen</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={!hasChangesFromInitial}
              aria-label="Restablecer todos los valores originales"
              className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200/90 dark:border-white/15 bg-white/80 dark:bg-white/5 px-4 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-violet-400 hover:text-violet-700 dark:hover:text-violet-300 disabled:opacity-45 disabled:pointer-events-none transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <RotateCcw className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <span>Restablecer</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="inline-flex h-10 items-center gap-2 rounded-2xl border border-cyan-500/35 bg-cyan-500/12 px-4 text-xs sm:text-sm font-semibold text-cyan-800 dark:text-cyan-300 hover:bg-cyan-500/20 transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              {isDark ? (
                <>
                  <Sun className="h-4 w-4" />
                  <span>Modo claro</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Modo oscuro</span>
                </>
              )}
            </button>
          </div>
        </motion.header>

        {/* 2. CUATRO TARJETAS KPI */}
        <section
          aria-label="Indicadores clave de riesgo"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          <KpiCard
            index={0}
            title="Total de riesgos"
            valueNode={<AnimatedNumber value={metrics.total} />}
            subtitle={
              filteredRisks.length === metrics.total
                ? 'Matriz completa monitoreada'
                : `${filteredRisks.length} visibles con filtro actual`
            }
            accentColor="#22D3EE"
            icon={<Layers className="h-4 w-4" />}
          />

          <KpiCard
            index={1}
            title="Nivel promedio"
            valueNode={
              <div className="flex items-baseline gap-2">
                <AnimatedNumber value={metrics.avgCurrent} decimals={1} />
                {simulateMitigation && metrics.avgCurrent !== metrics.avgBase && (
                  <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    ({(metrics.avgCurrent - metrics.avgBase).toFixed(1)})
                  </span>
                )}
              </div>
            }
            subtitle={
              simulateMitigation
                ? `Antes de mitigar: ${metrics.avgBase.toFixed(1)} / 25`
                : 'Escala combinada de 1 a 25'
            }
            accentColor="#8B5CF6"
            icon={<Activity className="h-4 w-4" />}
          />

          <KpiCard
            index={2}
            title="Riesgo más alto"
            valueNode={
              <div className="flex items-baseline gap-2">
                <AnimatedNumber value={metrics.highestNivel} />
                <span className="font-mono text-base font-semibold text-slate-500 dark:text-slate-300">
                  · {metrics.highestIds}
                </span>
              </div>
            }
            subtitle={`Clasificación actual: ${metrics.highestZone}`}
            accentColor={ZONE_META[metrics.highestZone].color}
            icon={<ShieldAlert className="h-4 w-4" />}
            pulseBadge
          />

          <KpiCard
            index={3}
            title="Zona Alto o Crítico"
            valueNode={<AnimatedNumber value={metrics.highOrCritPct} suffix="%" />}
            subtitle={`${metrics.highOrCritCount} de ${metrics.total} riesgos requieren atención prioritaria`}
            accentColor={metrics.highOrCritPct >= 50 ? '#FB923C' : '#34D399'}
            icon={<AlertTriangle className="h-4 w-4" />}
          />
        </section>

        {/* 3. BARRA DE FILTROS PÍLDORA + INTERRUPTOR SIMULAR MITIGACIÓN */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Filtros y simulador de mitigación"
          className="rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-4 sm:p-5 shadow-lg shadow-slate-900/5 space-y-4"
        >
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            {/* Filtros por nivel y responsable */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-5">
              {/* Píldoras de zona */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Filter className="h-3.5 w-3.5" />
                  Nivel:
                </span>
                {(['Todos', ...ZONES_ORDER] as const).map((z) => {
                  const isActive = zoneFilter === z;
                  const count =
                    z === 'Todos'
                      ? computedRisks.length
                      : computedRisks.filter((r) => r.zona === z).length;
                  return (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setZoneFilter(z)}
                      aria-pressed={isActive}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                        isActive
                          ? 'border-cyan-400 bg-cyan-400/18 text-slate-950 dark:text-white shadow-sm'
                          : 'border-slate-200/90 dark:border-white/10 bg-slate-100/70 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/25'
                      }`}
                    >
                      {z !== 'Todos' && (
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: ZONE_META[z].color }}
                        />
                      )}
                      <span>{z}</span>
                      <span className="font-mono text-[10px] opacity-70">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Píldoras de responsable */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <UserCheck className="h-3.5 w-3.5" />
                  Responsable:
                </span>
                {(['Todos', ...owners] as const).map((owner) => {
                  const isActive = ownerFilter === owner;
                  return (
                    <button
                      key={owner}
                      type="button"
                      onClick={() => setOwnerFilter(owner)}
                      aria-pressed={isActive}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                        isActive
                          ? 'border-violet-400 bg-violet-500/18 text-slate-950 dark:text-white shadow-sm'
                          : 'border-slate-200/90 dark:border-white/10 bg-slate-100/70 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/25'
                      }`}
                    >
                      <span>{owner}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interruptor Simular Mitigación */}
            <div className="flex items-center justify-between sm:justify-end gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] px-4 py-2.5 shrink-0">
              <div className="text-left sm:text-right">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Simular mitigación
                </div>
                <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  Reduce 1 punto de probabilidad
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={simulateMitigation}
                aria-label="Simular mitigación bajando un punto de probabilidad a cada riesgo"
                onClick={() => setSimulateMitigation((prev) => !prev)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                  simulateMitigation
                    ? 'border-cyan-400 bg-cyan-400/30'
                    : 'border-slate-300 dark:border-white/20 bg-slate-200 dark:bg-white/10'
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`inline-block h-5 w-5 rounded-full shadow-md ${
                    simulateMitigation
                      ? 'translate-x-6 bg-cyan-400'
                      : 'translate-x-1 bg-white dark:bg-slate-300'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Panel comparativo Antes vs. Después cuando la simulación está activa */}
          <AnimatePresence>
            {simulateMitigation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/[0.08] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-600 dark:text-cyan-300">
                      <TrendingDown className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Nivel promedio (Antes → Después)
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 font-mono text-base font-bold text-slate-900 dark:text-white">
                        <span className="text-slate-500 dark:text-slate-400 line-through">
                          {metrics.avgBase.toFixed(1)}
                        </span>
                        <span>→</span>
                        <span className="text-emerald-600 dark:text-emerald-300">
                          {metrics.avgCurrent.toFixed(1)}
                        </span>
                        {metrics.avgBase > 0 && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400">
                            (-
                            {Math.round(
                              ((metrics.avgBase - metrics.avgCurrent) / metrics.avgBase) *
                                100
                            )}
                            %)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-600 dark:text-emerald-300">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Riesgos en Alto / Crítico
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 font-mono text-base font-bold text-slate-900 dark:text-white">
                        <span className="text-slate-500 dark:text-slate-400 line-through">
                          {metrics.baseHighOrCritCount}
                        </span>
                        <span>→</span>
                        <span className="text-emerald-600 dark:text-emerald-300">
                          {metrics.highOrCritCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Cambio por zonas
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {metrics.zoneShift.map((zs) => (
                        <span
                          key={zs.zone}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-300/60 dark:border-white/10 bg-white/70 dark:bg-white/5 px-2 py-1 font-mono text-[11px]"
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: ZONE_META[zs.zone].color }}
                          />
                          <span className="text-slate-700 dark:text-slate-300">
                            {zs.zone}:
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {zs.before}→{zs.after}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* 4. MAPA DE CALOR 5x5 PROTAGONISTA + GUÍA RÁPIDA LATERAL */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
          <div className="xl:col-span-8">
            <HeatmapMatrix
              risks={computedRisks}
              matchedIds={matchedIds}
              selectedRiskId={selectedRiskId}
              simulateMitigation={simulateMitigation}
              onMoveRisk={handleMoveRisk}
              onSelectRisk={(id) => setSelectedRiskId(id)}
            />
          </div>

          {/* Tarjeta resumen lateral de acceso rápido a riesgos */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Lista rápida de riesgos activos"
            className="xl:col-span-4 flex flex-col justify-between rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5 sm:p-6 shadow-lg shadow-slate-900/5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Radar de prioridades
                </h2>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  <GripVertical className="h-3.5 w-3.5" />
                  Clic para detallar
                </span>
              </div>

              <div className="space-y-2.5">
                {[...computedRisks]
                  .sort((a, b) => b.nivel - a.nivel || a.id.localeCompare(b.id))
                  .map((r) => {
                    const isMatched = matchedIds.has(r.id);
                    const isSelected = selectedRiskId === r.id;
                    const meta = ZONE_META[r.zona];

                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRiskId(r.id)}
                        className={`w-full text-left rounded-2xl border p-3.5 transition-all focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-400/12 shadow-md'
                            : 'border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] hover:border-slate-300 dark:hover:border-white/25'
                        } ${isMatched ? 'opacity-100' : 'opacity-35'}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-flex h-6 min-w-7 items-center justify-center rounded-lg px-1.5 font-mono text-xs font-bold text-slate-950"
                              style={{ backgroundColor: meta.color }}
                            >
                              {r.id}
                            </span>
                            <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
                              {r.responsable}
                            </span>
                            {r.isHighest && (
                              <span className="relative flex h-2.5 w-2.5" title="Nivel más alto">
                                <span
                                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                                  style={{ backgroundColor: meta.color }}
                                />
                                <span
                                  className="relative inline-flex h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: meta.color }}
                                />
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            {r.impacto}×{r.probabilidad} = {r.nivel}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                          {r.title}
                        </p>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-white/[0.03] p-3.5 text-xs text-slate-600 dark:text-slate-400">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-cyan-600 dark:text-cyan-400" />
              <span>
                Fórmula aplicada: <strong className="font-mono text-slate-800 dark:text-slate-200">Nivel = Impacto × Probabilidad</strong>. Bajo (1–4), Medio (5–9), Alto (10–16), Crítico (20–25).
              </span>
            </div>
          </motion.aside>
        </div>

        {/* 5. GRÁFICOS RECHARTS */}
        <ChartsPanel
          risks={
            ownerFilter === 'Todos'
              ? computedRisks
              : computedRisks.filter((r) => r.responsable === ownerFilter)
          }
          zoneFilter={zoneFilter}
          isDark={isDark}
          onToggleZoneFilter={handleToggleZoneFilter}
          onSelectRisk={(id) => setSelectedRiskId(id)}
        />

        {/* 6. TABLA ORDENABLE Y EXPANDIBLE */}
        <RiskTable
          risks={filteredRisks}
          onSelectRisk={(id) => setSelectedRiskId(id)}
        />
      </div>

      {/* 7. PANEL LATERAL DE DETALLE */}
      <RiskDetailDrawer
        risk={selectedRisk}
        simulateMitigation={simulateMitigation}
        onClose={() => setSelectedRiskId(null)}
        onAdjustCoordinates={handleMoveRisk}
      />
    </div>
  );
}
