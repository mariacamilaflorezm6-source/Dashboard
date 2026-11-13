import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Filter,
  GanttChartSquare,
  GitCommitHorizontal,
  Layers,
  ListChecks,
  RotateCcw,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import {
  IMPLEMENTATION_ACTIVITIES,
  IMPLEMENTATION_NOTICE,
  IMPLEMENTATION_OWNER_FILTERS,
  IMPLEMENTATION_PHASES,
  type ImplementationActivity,
  type ImplementationPriority,
  type ImplementationStatus,
} from '../data';

interface ImplementacionTabProps {
  onNavigateRisk: (riskId?: string) => void;
  onNavigateRequirement: (reqId?: string) => void;
}

type ViewMode = 'gantt' | 'fases';
type SortKey =
  | 'id'
  | 'priority'
  | 'activity'
  | 'responsable'
  | 'dependencies'
  | 'durationWeeks'
  | 'status';
type SortDirection = 'asc' | 'desc';

const TOTAL_WEEKS = 12;
const WEEKS = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);

const PRIORITY_STYLE: Record<
  ImplementationPriority,
  { color: string; badge: string; glow: string }
> = {
  Alta: {
    color: '#F43F5E',
    badge:
      'border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-300',
    glow: '0 0 18px -2px rgba(244, 63, 94, 0.55)',
  },
  Media: {
    color: '#FBBF24',
    badge:
      'border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-300',
    glow: '0 0 18px -2px rgba(251, 191, 36, 0.5)',
  },
};

const STATUS_STYLE: Record<
  ImplementationStatus,
  { badge: string; dot: string }
> = {
  Pendiente: {
    badge:
      'border-slate-300/80 dark:border-white/15 bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-300',
    dot: '#94A3B8',
  },
  'En progreso': {
    badge:
      'border-cyan-500/40 bg-cyan-500/15 text-cyan-800 dark:text-cyan-300',
    dot: '#22D3EE',
  },
  Completado: {
    badge:
      'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    dot: '#34D399',
  },
};

const STATUS_OPTIONS: ImplementationStatus[] = [
  'Pendiente',
  'En progreso',
  'Completado',
];

function AnimatedNumber({
  value,
  suffix = '',
  prefix = '',
}: {
  value: number;
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
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });

    return () => controls.stop();
  }, [value]);

  return (
    <span className="font-mono tabular-nums">
      {prefix}
      {Math.round(display)}
      {suffix}
    </span>
  );
}

function createInitialStatusMap(): Record<number, ImplementationStatus> {
  const map: Record<number, ImplementationStatus> = {};
  for (const act of IMPLEMENTATION_ACTIVITIES) {
    map[act.id] = 'Pendiente';
  }
  return map;
}

function matchesOwnerFilter(responsable: string, filter: string): boolean {
  if (filter === 'Todas') return true;
  return responsable.toLowerCase().includes(filter.toLowerCase());
}

export default function ImplementacionTab({
  onNavigateRisk,
  onNavigateRequirement,
}: ImplementacionTabProps) {
  const [statuses, setStatuses] = useState<Record<number, ImplementationStatus>>(
    createInitialStatusMap
  );
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('gantt');
  const [priorityFilter, setPriorityFilter] = useState<'Todas' | ImplementationPriority>('Todas');
  const [ownerFilter, setOwnerFilter] = useState<string>('Todas');
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<{
    activity: ImplementationActivity;
    rect: DOMRect;
  } | null>(null);
  const [isDraggingToday, setIsDraggingToday] = useState<boolean>(false);

  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [expandedRowIds, setExpandedRowIds] = useState<Record<number, boolean>>({});

  const timelineTrackRef = useRef<HTMLDivElement | null>(null);

  // Al mover la línea "Hoy", marcar automáticamente actividades finalizadas antes de esa semana
  const applySimulatedWeek = (week: number) => {
    const clamped = Math.min(TOTAL_WEEKS, Math.max(1, week));
    setCurrentWeek(clamped);
    setStatuses(() => {
      const next: Record<number, ImplementationStatus> = {};
      for (const act of IMPLEMENTATION_ACTIVITIES) {
        const endWeek = act.startWeek + act.durationWeeks - 1;
        if (endWeek < clamped) {
          next[act.id] = 'Completado';
        } else if (act.startWeek <= clamped && clamped <= endWeek) {
          next[act.id] = 'En progreso';
        } else {
          next[act.id] = 'Pendiente';
        }
      }
      return next;
    });
  };

  // Manejo del arrastre horizontal de la línea "Hoy"
  useEffect(() => {
    if (!isDraggingToday) return;

    const handlePointerMove = (e: PointerEvent) => {
      const track = timelineTrackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const week = Math.min(TOTAL_WEEKS, Math.max(1, Math.floor(ratio * TOTAL_WEEKS) + 1));
      applySimulatedWeek(week);
    };

    const handlePointerUp = () => {
      setIsDraggingToday(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDraggingToday]);

  const filteredActivities = useMemo(() => {
    return IMPLEMENTATION_ACTIVITIES.filter((act) => {
      const matchPriority =
        priorityFilter === 'Todas' || act.priority === priorityFilter;
      const matchOwner = matchesOwnerFilter(act.responsable, ownerFilter);
      return matchPriority && matchOwner;
    });
  }, [priorityFilter, ownerFilter]);

  const filteredIds = useMemo(
    () => new Set(filteredActivities.map((a) => a.id)),
    [filteredActivities]
  );

  const selectedActivity = useMemo(
    () =>
      IMPLEMENTATION_ACTIVITIES.find((a) => a.id === selectedActivityId) ?? null,
    [selectedActivityId]
  );

  const highlightedDependencyIds = useMemo(() => {
    if (!selectedActivity) return new Set<number>();
    return new Set<number>(selectedActivity.dependencies);
  }, [selectedActivity]);

  const metrics = useMemo(() => {
    const total = IMPLEMENTATION_ACTIVITIES.length;
    const completed = IMPLEMENTATION_ACTIVITIES.filter(
      (a) => statuses[a.id] === 'Completado'
    ).length;
    const inProgress = IMPLEMENTATION_ACTIVITIES.filter(
      (a) => statuses[a.id] === 'En progreso'
    ).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      total,
      totalWeeks: TOTAL_WEEKS,
      completed,
      inProgress,
      pct,
    };
  }, [statuses]);

  const handleStatusChange = (id: number, status: ImplementationStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const handleReset = () => {
    setStatuses(createInitialStatusMap());
    setCurrentWeek(1);
    setPriorityFilter('Todas');
    setOwnerFilter('Todas');
    setSelectedActivityId(null);
    setExpandedRowIds({});
  };

  const handleExportCSV = () => {
    const headers = [
      '#',
      'Prioridad',
      'Actividad',
      'Responsable',
      'Dependencias',
      'Duración (semanas)',
      'Inicio',
      'Fin',
      'Requisitos',
      'Riesgos',
      'Estado',
    ];

    const escapeCell = (val: string | number) => {
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = IMPLEMENTATION_ACTIVITIES.map((a) => {
      const endWeek = a.startWeek + a.durationWeeks - 1;
      return [
        a.id,
        a.priority,
        a.activity,
        a.responsable,
        a.dependenciesLabel,
        a.durationWeeks,
        `S${a.startWeek}`,
        `S${endWeek}`,
        a.requirements.join('; '),
        a.risks.join('; '),
        statuses[a.id],
      ]
        .map(escapeCell)
        .join(',');
    });

    const csvContent =
      '\uFEFF' + [headers.map(escapeCell).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `plan_implementacion_ipaas_uts_S${currentWeek}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedTableActivities = useMemo(() => {
    const copy = [...filteredActivities];
    const prioRank: Record<ImplementationPriority, number> = { Alta: 2, Media: 1 };
    const statusRank: Record<ImplementationStatus, number> = {
      Pendiente: 1,
      'En progreso': 2,
      Completado: 3,
    };

    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'id':
          cmp = a.id - b.id;
          break;
        case 'priority':
          cmp = prioRank[a.priority] - prioRank[b.priority];
          break;
        case 'activity':
          cmp = a.activity.localeCompare(b.activity);
          break;
        case 'responsable':
          cmp = a.responsable.localeCompare(b.responsable);
          break;
        case 'dependencies':
          cmp = a.dependenciesLabel.localeCompare(b.dependenciesLabel);
          break;
        case 'durationWeeks':
          cmp = a.durationWeeks - b.durationWeeks;
          break;
        case 'status':
          cmp = statusRank[statuses[a.id]] - statusRank[statuses[b.id]];
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [filteredActivities, sortKey, sortDir, statuses]);

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="h-3.5 w-3.5 opacity-45" />;
    return sortDir === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
    );
  };

  const hasChanges = useMemo(() => {
    const anyNonPending = IMPLEMENTATION_ACTIVITIES.some(
      (a) => statuses[a.id] !== 'Pendiente'
    );
    return (
      anyNonPending ||
      currentWeek !== 1 ||
      priorityFilter !== 'Todas' ||
      ownerFilter !== 'Todas' ||
      selectedActivityId !== null
    );
  }, [statuses, currentWeek, priorityFilter, ownerFilter, selectedActivityId]);

  const handleRequirementChipClick = (reqLabel: string) => {
    if (reqLabel === 'todos') {
      onNavigateRequirement();
      return;
    }
    if (reqLabel.startsWith('RF-01 a')) {
      onNavigateRequirement('RF-01');
      return;
    }
    onNavigateRequirement(reqLabel);
  };

  const handleRiskChipClick = (riskLabel: string) => {
    if (riskLabel === 'todos') {
      onNavigateRisk();
      return;
    }
    onNavigateRisk(riskLabel);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado del módulo + Acciones Exportar / Restablecer */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl px-6 py-5 shadow-lg shadow-slate-900/5"
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-balance">
            Plan de implementación · iPaaS en la nube (Alternativa 3)
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Cronograma interactivo de 12 semanas con simulación de avance, dependencias y trazabilidad hacia requisitos y riesgos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            aria-label="Exportar plan de implementación en formato CSV"
            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200/90 dark:border-white/15 bg-white/80 dark:bg-white/5 px-4 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <Download className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span>Exportar plan</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges}
            aria-label="Restablecer estados, semana actual y filtros del plan"
            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200/90 dark:border-white/15 bg-white/80 dark:bg-white/5 px-4 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-violet-400 hover:text-violet-700 dark:hover:text-violet-300 disabled:opacity-45 disabled:pointer-events-none transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <RotateCcw className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            <span>Restablecer</span>
          </button>
        </div>
      </motion.section>

      {/* Aviso institucional */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        role="note"
        className="flex items-start sm:items-center gap-3 rounded-[24px] border border-amber-500/40 bg-amber-500/12 px-5 py-4 text-sm text-amber-900 dark:text-amber-200 backdrop-blur-xl"
      >
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5 sm:mt-0" />
        <span>{IMPLEMENTATION_NOTICE}</span>
      </motion.div>

      {/* 4 Tarjetas KPI */}
      <section
        aria-label="Indicadores del plan de implementación"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {[
          {
            title: 'Actividades del plan',
            value: <AnimatedNumber value={metrics.total} />,
            subtitle:
              filteredActivities.length === metrics.total
                ? 'Ruta completa de despliegue'
                : `${filteredActivities.length} visibles con filtro actual`,
            accent: '#22D3EE',
            icon: <ListChecks className="h-4 w-4" />,
          },
          {
            title: 'Duración total',
            value: (
              <div className="flex items-baseline gap-1.5">
                <AnimatedNumber value={metrics.totalWeeks} />
                <span className="text-base font-semibold text-slate-500 dark:text-slate-400">
                  semanas
                </span>
              </div>
            ),
            subtitle: 'Horizonte S1 a S12 (5 fases)',
            accent: '#8B5CF6',
            icon: <Clock className="h-4 w-4" />,
          },
          {
            title: '% completado',
            value: <AnimatedNumber value={metrics.pct} suffix="%" />,
            subtitle: `${metrics.completed} completadas · ${metrics.inProgress} en progreso`,
            accent: '#34D399',
            icon: <CheckCircle2 className="h-4 w-4" />,
          },
          {
            title: 'Semana actual simulada',
            value: (
              <span className="font-mono tabular-nums">
                S<AnimatedNumber value={currentWeek} />
              </span>
            ),
            subtitle: 'Arrastra la línea "Hoy" en el Gantt',
            accent: '#FBBF24',
            icon: <CalendarClock className="h-4 w-4" />,
          },
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 * idx }}
            whileHover={{ y: -4 }}
            style={{ boxShadow: `0 12px 34px -18px ${kpi.accent}66` }}
            className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: kpi.accent }}
            />
            <div className="relative flex items-start justify-between gap-3">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {kpi.title}
              </span>
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-100/80 dark:bg-white/5"
                style={{ color: kpi.accent }}
              >
                {kpi.icon}
              </div>
            </div>
            <div className="relative mt-3 text-3xl font-bold text-slate-900 dark:text-white font-mono">
              {kpi.value}
            </div>
            <div className="relative mt-2 text-xs text-slate-600 dark:text-slate-400">
              {kpi.subtitle}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Barra de progreso global + Filtros píldora + Interruptor Gantt / Por fases */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.14 }}
        aria-label="Progreso global, filtros y selector de vista"
        className="rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5 shadow-lg shadow-slate-900/5 space-y-4"
      >
        {/* Barra de progreso global */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
              Progreso global de ejecución ({metrics.completed}/{metrics.total} actividades)
            </span>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {metrics.pct}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200/90 dark:bg-white/10">
            <motion.div
              initial={false}
              animate={{ width: `${metrics.pct}%` }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-emerald-400"
            />
          </div>
        </div>

        {/* Filtros y toggle de vista */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pt-2 border-t border-slate-200/70 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-5">
            {/* Filtro por prioridad */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Filter className="h-3.5 w-3.5" />
                Prioridad:
              </span>
              {(['Todas', 'Alta', 'Media'] as const).map((prio) => {
                const active = priorityFilter === prio;
                return (
                  <button
                    key={prio}
                    type="button"
                    onClick={() => setPriorityFilter(prio)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                      active
                        ? 'border-cyan-400 bg-cyan-400/18 text-slate-950 dark:text-white'
                        : 'border-slate-200/90 dark:border-white/10 bg-slate-100/70 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/25'
                    }`}
                  >
                    {prio !== 'Todas' && (
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: PRIORITY_STYLE[prio].color }}
                      />
                    )}
                    <span>{prio}</span>
                  </button>
                );
              })}
            </div>

            {/* Filtro por responsable */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <UserCheck className="h-3.5 w-3.5" />
                Responsable:
              </span>
              {IMPLEMENTATION_OWNER_FILTERS.map((owner) => {
                const active = ownerFilter === owner;
                return (
                  <button
                    key={owner}
                    type="button"
                    onClick={() => setOwnerFilter(owner)}
                    aria-pressed={active}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                      active
                        ? 'border-violet-400 bg-violet-500/18 text-slate-950 dark:text-white'
                        : 'border-slate-200/90 dark:border-white/10 bg-slate-100/70 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/25'
                    }`}
                  >
                    {owner}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interruptor de vista: Gantt / Por fases */}
          <div
            role="group"
            aria-label="Cambiar vista entre diagrama de Gantt y vista por fases"
            className="inline-flex items-center gap-1 self-start xl:self-auto rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] p-1 shrink-0"
          >
            {(
              [
                { id: 'gantt', label: 'Gantt', icon: <GanttChartSquare className="h-4 w-4" /> },
                { id: 'fases', label: 'Por fases', icon: <Layers className="h-4 w-4" /> },
              ] as const
            ).map((v) => {
              const active = viewMode === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setViewMode(v.id)}
                  aria-pressed={active}
                  className={`relative inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                    active
                      ? 'text-slate-950 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="implViewModeIndicator"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-xl border border-cyan-400/40 bg-white dark:bg-cyan-500/20 shadow-sm"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {v.icon}
                    <span>{v.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* VISTA PROTAGONISTA: GANTT INTERACTIVO O POR FASES */}
      <AnimatePresence mode="wait">
        {viewMode === 'gantt' ? (
          <motion.section
            key="gantt-view"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            aria-label="Diagrama de Gantt interactivo S1 a S12"
            className="rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-slate-900/5"
          >
            {/* Controles superiores del Gantt */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Diagrama de Gantt interactivo (S1–S12)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Haz clic en una barra para resaltar sus dependencias previas. Arrastra la línea{' '}
                  <strong className="font-mono text-cyan-600 dark:text-cyan-400">Hoy</strong>{' '}
                  para simular el avance semanal.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {selectedActivity && (
                  <button
                    type="button"
                    onClick={() => setSelectedActivityId(null)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/50 bg-cyan-400/15 px-3 py-1 font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-400/25 transition-colors"
                  >
                    <GitCommitHorizontal className="h-3.5 w-3.5" />
                    <span>
                      Act. #{selectedActivity.id} (Dep:{' '}
                      {selectedActivity.dependenciesLabel}) · Limpiar
                    </span>
                  </button>
                )}

                {/* Controles accesibles de semana actual */}
                <div className="inline-flex items-center gap-1 rounded-2xl border border-slate-200/80 dark:border-white/15 bg-slate-50/80 dark:bg-white/[0.04] p-1">
                  <button
                    type="button"
                    aria-label="Retroceder semana simulada"
                    disabled={currentWeek <= 1}
                    onClick={() => applySimulatedWeek(currentWeek - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/10 disabled:opacity-35"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-2 font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300">
                    Hoy: S{currentWeek}
                  </span>
                  <button
                    type="button"
                    aria-label="Avanzar semana simulada"
                    disabled={currentWeek >= TOTAL_WEEKS}
                    onClick={() => applySimulatedWeek(currentWeek + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/10 disabled:opacity-35"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contenedor con scroll horizontal en móvil sin desbordar la página */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[880px]">
                {/* Cabecera de semanas S1..S12 */}
                <div className="grid grid-cols-[290px_1fr] gap-3 pb-2 border-b border-slate-200/80 dark:border-white/10">
                  <div className="flex items-center justify-between px-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span>Actividad</span>
                    <span>Estado</span>
                  </div>

                  <div className="grid grid-cols-12 gap-1">
                    {WEEKS.map((w) => {
                      const isToday = w === currentWeek;
                      return (
                        <button
                          key={w}
                          type="button"
                          onClick={() => applySimulatedWeek(w)}
                          aria-label={`Simular semana actual S${w}`}
                          className={`rounded-xl py-1.5 font-mono text-xs font-bold transition-colors ${
                            isToday
                              ? 'bg-cyan-400/25 text-cyan-800 dark:text-cyan-300 border border-cyan-400/50'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          S{w}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Área del cuerpo del Gantt con línea vertical "Hoy" arrastrable */}
                <div className="relative mt-2 grid grid-cols-[290px_1fr] gap-3">
                  {/* Columna izquierda de etiquetas */}
                  <div className="space-y-2">
                    {IMPLEMENTATION_ACTIVITIES.map((act) => {
                      const isMatch = filteredIds.has(act.id);
                      const isSelected = selectedActivityId === act.id;
                      const isDependency = highlightedDependencyIds.has(act.id);
                      const status = statuses[act.id];

                      const dimRow =
                        !isMatch ||
                        (selectedActivity !== null &&
                          !isSelected &&
                          !isDependency);

                      return (
                        <div
                          key={`label-${act.id}`}
                          className={`flex h-12 items-center justify-between gap-2 rounded-2xl border px-3 transition-all ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-400/12'
                              : isDependency
                              ? 'border-violet-400/70 bg-violet-500/12'
                              : 'border-slate-200/70 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02]'
                          } ${dimRow ? 'opacity-30' : 'opacity-100'}`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedActivityId((prev) =>
                                prev === act.id ? null : act.id
                              )
                            }
                            className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-cyan-400 rounded-lg"
                          >
                            <span
                              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-bold text-slate-950"
                              style={{
                                backgroundColor: PRIORITY_STYLE[act.priority].color,
                              }}
                            >
                              {act.id}
                            </span>
                            <span className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                              {act.activity}
                            </span>
                          </button>

                          <select
                            aria-label={`Estado de actividad ${act.id}`}
                            value={status}
                            onChange={(e) =>
                              handleStatusChange(
                                act.id,
                                e.target.value as ImplementationStatus
                              )
                            }
                            className={`shrink-0 cursor-pointer rounded-xl border px-2 py-1 font-mono text-[10px] font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 ${STATUS_STYLE[status].badge}`}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pista derecha de 12 semanas + barras + línea "Hoy" */}
                  <div ref={timelineTrackRef} className="relative select-none">
                    {/* Grilla de fondo S1..S12 */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 grid grid-cols-12 gap-1"
                    >
                      {WEEKS.map((w) => (
                        <div
                          key={`bg-${w}`}
                          className={`rounded-xl border ${
                            w === currentWeek
                              ? 'border-cyan-400/30 bg-cyan-400/[0.06]'
                              : 'border-slate-200/50 dark:border-white/[0.04] bg-slate-100/40 dark:bg-white/[0.015]'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Conector SVG animado de dependencias al seleccionar una actividad */}
                    {selectedActivity && selectedActivity.dependencies.length > 0 && (
                      <svg
                        aria-hidden="true"
                        viewBox={`0 0 1200 ${(IMPLEMENTATION_ACTIVITIES.length - 1) * 56 + 48}`}
                        preserveAspectRatio="none"
                        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                      >
                        {selectedActivity.dependencies.map((depId) => {
                          const depAct = IMPLEMENTATION_ACTIVITIES.find(
                            (a) => a.id === depId
                          );
                          if (!depAct) return null;
                          const x1 =
                            ((depAct.startWeek - 1 + depAct.durationWeeks) / 12) *
                            1200;
                          const y1 = (depAct.id - 1) * 56 + 24;
                          const x2 = ((selectedActivity.startWeek - 1) / 12) * 1200;
                          const y2 = (selectedActivity.id - 1) * 56 + 24;
                          const midX = (x1 + x2) / 2;

                          return (
                            <motion.path
                              key={`dep-${depId}-${selectedActivity.id}`}
                              d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                              fill="none"
                              stroke="#22D3EE"
                              strokeWidth="3"
                              strokeDasharray="7 5"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 0.9 }}
                              transition={{ duration: 0.45 }}
                            />
                          );
                        })}
                      </svg>
                    )}

                    {/* Barras de actividades */}
                    <div className="relative z-20 space-y-2">
                      {IMPLEMENTATION_ACTIVITIES.map((act, idx) => {
                        const isMatch = filteredIds.has(act.id);
                        const isSelected = selectedActivityId === act.id;
                        const isDependency = highlightedDependencyIds.has(act.id);
                        const status = statuses[act.id];
                        const prioMeta = PRIORITY_STYLE[act.priority];

                        const dimBar =
                          !isMatch ||
                          (selectedActivity !== null &&
                            !isSelected &&
                            !isDependency);

                        const leftPct = ((act.startWeek - 1) / TOTAL_WEEKS) * 100;
                        const widthPct = (act.durationWeeks / TOTAL_WEEKS) * 100;

                        return (
                          <div
                            key={`bar-row-${act.id}`}
                            className="relative flex h-12 items-center"
                          >
                            <motion.button
                              type="button"
                              onClick={() =>
                                setSelectedActivityId((prev) =>
                                  prev === act.id ? null : act.id
                                )
                              }
                              onMouseEnter={(e) =>
                                setHoveredBar({
                                  activity: act,
                                  rect: e.currentTarget.getBoundingClientRect(),
                                })
                              }
                              onMouseLeave={() => setHoveredBar(null)}
                              aria-label={`Actividad ${act.id}: ${act.activity}. Semana ${act.startWeek}, duración ${act.durationWeeks} semanas. Prioridad ${act.priority}. Estado ${status}.`}
                              initial={{ scaleX: 0, opacity: 0 }}
                              animate={{
                                scaleX: 1,
                                opacity: dimBar ? 0.25 : 1,
                              }}
                              transition={{
                                duration: 0.5,
                                delay: 0.035 * idx,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              whileHover={{ scaleY: 1.12 }}
                              style={{
                                left: `${leftPct}%`,
                                width: `${widthPct}%`,
                                transformOrigin: 'left center',
                                backgroundColor: prioMeta.color,
                                boxShadow: isSelected
                                  ? `0 0 0 3px #22D3EE, ${prioMeta.glow}`
                                  : isDependency
                                  ? `0 0 0 3px #8B5CF6, ${prioMeta.glow}`
                                  : prioMeta.glow,
                              }}
                              className="absolute flex h-7 items-center justify-between gap-1.5 rounded-full px-3 font-mono text-[11px] font-bold text-slate-950 transition-shadow focus-visible:outline-2 focus-visible:outline-cyan-400"
                            >
                              <span className="truncate">
                                {act.durationWeeks} sem
                              </span>
                              {status === 'Completado' && (
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-slate-950" />
                              )}
                            </motion.button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Línea vertical arrastrable "Hoy" */}
                    <div
                      style={{
                        left: `${((currentWeek - 0.5) / TOTAL_WEEKS) * 100}%`,
                      }}
                      className="pointer-events-none absolute -top-2 bottom-0 z-30 -translate-x-1/2"
                    >
                      <button
                        type="button"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          setIsDraggingToday(true);
                        }}
                        aria-label={`Línea de semana actual Hoy S${currentWeek}. Arrastra horizontalmente para cambiar de semana`}
                        className="pointer-events-auto flex -translate-y-1 cursor-ew-resize items-center gap-1 rounded-full border border-cyan-300 bg-cyan-400 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-950 shadow-lg shadow-cyan-500/40 focus-visible:outline-2 focus-visible:outline-white"
                      >
                        <span>Hoy · S{currentWeek}</span>
                      </button>
                      <div className="mx-auto h-full w-0.5 bg-gradient-to-b from-cyan-400 via-cyan-400/80 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.85)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Leyenda del Gantt */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/70 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                  <span
                    className="h-2.5 w-5 rounded-full"
                    style={{ backgroundColor: PRIORITY_STYLE.Alta.color }}
                  />
                  Prioridad Alta
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                  <span
                    className="h-2.5 w-5 rounded-full"
                    style={{ backgroundColor: PRIORITY_STYLE.Media.color }}
                  />
                  Prioridad Media
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="h-2.5 w-2.5 rounded-full ring-2 ring-violet-400 bg-violet-400/30" />
                  Dependencia previa resaltada
                </span>
              </div>
              <span className="font-mono text-[11px]">
                Desliza el diagrama horizontalmente en pantallas pequeñas
              </span>
            </div>
          </motion.section>
        ) : (
          /* VISTA ALTERNA: POR FASES */
          <motion.section
            key="fases-view"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            aria-label="Vista agrupada por fases del proyecto"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-stretch"
          >
            {IMPLEMENTATION_PHASES.map((phase) => {
              const phaseActs = filteredActivities.filter(
                (a) =>
                  a.startWeek >= phase.startMin && a.startWeek <= phase.startMax
              );
              const allPhaseActs = IMPLEMENTATION_ACTIVITIES.filter(
                (a) =>
                  a.startWeek >= phase.startMin && a.startWeek <= phase.startMax
              );
              const phaseDone = allPhaseActs.filter(
                (a) => statuses[a.id] === 'Completado'
              ).length;

              return (
                <div
                  key={phase.id}
                  style={{
                    borderColor: `${phase.accent}55`,
                    boxShadow: `0 12px 32px -20px ${phase.accent}77`,
                  }}
                  className="flex flex-col rounded-[24px] border bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5"
                >
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200/70 dark:border-white/10">
                    <div>
                      <span
                        className="font-mono text-[11px] font-bold"
                        style={{ color: phase.accent }}
                      >
                        {phase.weekRange}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {phase.name}
                      </h3>
                    </div>
                    <span className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {phaseDone}/{allPhaseActs.length}
                    </span>
                  </div>

                  <div className="mt-4 flex-1 space-y-3">
                    {phaseActs.length === 0 ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                        Sin actividades visibles con los filtros actuales.
                      </p>
                    ) : (
                      phaseActs.map((act) => {
                        const status = statuses[act.id];
                        return (
                          <div
                            key={`phase-act-${act.id}`}
                            className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] p-3.5 space-y-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className="inline-flex h-6 items-center rounded-lg px-2 font-mono text-[11px] font-bold text-slate-950"
                                style={{
                                  backgroundColor:
                                    PRIORITY_STYLE[act.priority].color,
                                }}
                              >
                                #{act.id} · S{act.startWeek} ({act.durationWeeks}s)
                              </span>
                              <select
                                aria-label={`Estado actividad ${act.id}`}
                                value={status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    act.id,
                                    e.target.value as ImplementationStatus
                                  )
                                }
                                className={`rounded-xl border px-2 py-0.5 font-mono text-[10px] font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 ${STATUS_STYLE[status].badge}`}
                              >
                                {STATUS_OPTIONS.map((opt) => (
                                  <option
                                    key={opt}
                                    value={opt}
                                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                                  >
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <p className="text-xs font-medium leading-snug text-slate-900 dark:text-slate-100">
                              {act.activity}
                            </p>

                            <div className="text-[11px] text-slate-600 dark:text-slate-400">
                              {act.responsable}
                            </div>

                            <div className="flex flex-wrap gap-1 pt-1">
                              {act.risks.map((rk) => (
                                <button
                                  key={rk}
                                  type="button"
                                  onClick={() => handleRiskChipClick(rk)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-rose-500/35 bg-rose-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-500/25 transition-colors"
                                >
                                  <ShieldAlert className="h-2.5 w-2.5" />
                                  {rk}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </motion.section>
        )}
      </AnimatePresence>

      {/* TABLA DE DETALLE ORDENABLE CON FILAS EXPANDIBLES Y CHIPS A REQUISITOS/RIESGOS */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        aria-label="Tabla detallada del plan de implementación"
        className="rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5 sm:p-6 shadow-lg shadow-slate-900/5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Detalle de actividades, dependencias y trazabilidad
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ordena por columnas o expande cualquier fila para navegar a los requisitos o riesgos asociados.
            </p>
          </div>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {sortedTableActivities.length} de {IMPLEMENTATION_ACTIVITIES.length} actividades
          </span>
        </div>

        {sortedTableActivities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Ninguna actividad coincide con los filtros de prioridad y responsable seleccionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200/90 dark:border-white/10 font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 pr-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('id')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                    >
                      # {renderSortIcon('id')}
                    </button>
                  </th>
                  <th className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('priority')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                    >
                      Prioridad {renderSortIcon('priority')}
                    </button>
                  </th>
                  <th className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('activity')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                    >
                      Actividad {renderSortIcon('activity')}
                    </button>
                  </th>
                  <th className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('responsable')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                    >
                      Responsable {renderSortIcon('responsable')}
                    </button>
                  </th>
                  <th className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('dependencies')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                    >
                      Dep. {renderSortIcon('dependencies')}
                    </button>
                  </th>
                  <th className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleSort('durationWeeks')}
                      className="inline-flex items-center justify-end gap-1 hover:text-slate-900 dark:hover:text-white"
                    >
                      Duración {renderSortIcon('durationWeeks')}
                    </button>
                  </th>
                  <th className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('status')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                    >
                      Estado {renderSortIcon('status')}
                    </button>
                  </th>
                  <th className="py-3 pl-3 text-right">Chips</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-white/5 text-sm">
                {sortedTableActivities.map((act) => {
                  const isExpanded = !!expandedRowIds[act.id];
                  const status = statuses[act.id];
                  const endWeek = act.startWeek + act.durationWeeks - 1;

                  return (
                    <React.Fragment key={act.id}>
                      <tr className="hover:bg-slate-100/70 dark:hover:bg-white/[0.03] transition-colors">
                        <td className="py-3.5 pr-3 align-middle font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400">
                          #{act.id}
                        </td>
                        <td className="py-3.5 px-3 align-middle">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${PRIORITY_STYLE[act.priority].badge}`}
                          >
                            {act.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 align-middle max-w-md">
                          <div className="font-medium leading-snug text-slate-900 dark:text-slate-100">
                            {act.activity}
                          </div>
                          <div className="mt-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            S{act.startWeek}
                            {endWeek !== act.startWeek ? `–S${endWeek}` : ''}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 align-middle text-xs text-slate-700 dark:text-slate-300 max-w-[200px]">
                          {act.responsable}
                        </td>
                        <td className="py-3.5 px-3 align-middle font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {act.dependenciesLabel}
                        </td>
                        <td className="py-3.5 px-3 align-middle text-right font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {act.durationWeeks} sem
                        </td>
                        <td className="py-3.5 px-3 align-middle">
                          <select
                            aria-label={`Cambiar estado de actividad ${act.id}`}
                            value={status}
                            onChange={(e) =>
                              handleStatusChange(
                                act.id,
                                e.target.value as ImplementationStatus
                              )
                            }
                            className={`cursor-pointer rounded-xl border px-2.5 py-1 font-mono text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 ${STATUS_STYLE[status].badge}`}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5 pl-3 align-middle text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedRowIds((prev) => ({
                                ...prev,
                                [act.id]: !prev[act.id],
                              }))
                            }
                            aria-expanded={isExpanded}
                            aria-label={`Ver requisitos y riesgos de actividad ${act.id}`}
                            className="inline-flex h-8 items-center gap-1 rounded-xl border border-slate-200 dark:border-white/15 px-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                          >
                            <span>Ver</span>
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </td>
                      </tr>

                      <AnimatePresence>
                        {isExpanded && (
                          <tr>
                            <td colSpan={8} className="p-0">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.22 }}
                                className="overflow-hidden bg-slate-50/90 dark:bg-white/[0.025]"
                              >
                                <div className="flex flex-wrap items-center gap-6 px-5 py-4 border-t border-slate-200/70 dark:border-white/5">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                      Requisitos:
                                    </span>
                                    {act.requirements.map((req) => (
                                      <button
                                        key={req}
                                        type="button"
                                        onClick={() =>
                                          handleRequirementChipClick(req)
                                        }
                                        aria-label={`Ir a requisito ${req}`}
                                        className="inline-flex items-center gap-1 rounded-xl border border-cyan-500/40 bg-cyan-500/12 px-2.5 py-1 font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/25 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400"
                                      >
                                        <span>{req}</span>
                                        <ExternalLink className="h-3 w-3 opacity-75" />
                                      </button>
                                    ))}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                      Riesgos asociados:
                                    </span>
                                    {act.risks.map((rk) => (
                                      <button
                                        key={rk}
                                        type="button"
                                        onClick={() => handleRiskChipClick(rk)}
                                        aria-label={`Abrir riesgo ${rk} en la pestaña Riesgos`}
                                        className="inline-flex items-center gap-1 rounded-xl border border-rose-500/40 bg-rose-500/12 px-2.5 py-1 font-mono text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-500/25 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400"
                                      >
                                        <ShieldAlert className="h-3 w-3" />
                                        <span>{rk}</span>
                                        <ExternalLink className="h-3 w-3 opacity-75" />
                                      </button>
                                    ))}
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

      {/* Tooltip flotante al pasar el cursor sobre una barra del Gantt */}
      <AnimatePresence>
        {hoveredBar && !isDraggingToday && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.14 }}
            style={{
              position: 'fixed',
              left: Math.min(
                window.innerWidth - 315,
                Math.max(
                  16,
                  hoveredBar.rect.left + hoveredBar.rect.width / 2 - 145
                )
              ),
              top: Math.max(16, hoveredBar.rect.top - 135),
            }}
            className="pointer-events-none z-50 w-[295px] rounded-2xl border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-[#0B1126]/95 p-3.5 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                Actividad #{hoveredBar.activity.id} · S
                {hoveredBar.activity.startWeek} (
                {hoveredBar.activity.durationWeeks} sem)
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${
                  PRIORITY_STYLE[hoveredBar.activity.priority].badge
                }`}
              >
                {hoveredBar.activity.priority}
              </span>
            </div>
            <p className="mt-1.5 text-xs font-medium leading-snug text-slate-900 dark:text-slate-100">
              {hoveredBar.activity.activity}
            </p>
            <div className="mt-2 space-y-1 font-mono text-[10px] text-slate-600 dark:text-slate-400">
              <div>Resp: {hoveredBar.activity.responsable}</div>
              <div>
                Req: {hoveredBar.activity.requirements.join(', ')} · Riesgos:{' '}
                {hoveredBar.activity.risks.join(', ')}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
