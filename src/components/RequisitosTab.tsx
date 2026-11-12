import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  Filter,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  REQUIREMENTS,
  type RequirementOrigin,
  type RequirementType,
} from '../data';

interface RequisitosTabProps {
  highlightedReqId: string | null;
  onClearHighlight?: () => void;
}

export default function RequisitosTab({
  highlightedReqId,
  onClearHighlight,
}: RequisitosTabProps) {
  const [typeFilter, setTypeFilter] = useState<'Todos' | RequirementType>('Todos');
  const [originFilter, setOriginFilter] = useState<'Todos' | RequirementOrigin>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  // Cuando viene un requisito resaltado desde Riesgos, limpiar filtros si es necesario, expandirlo y hacer scroll
  useEffect(() => {
    if (!highlightedReqId) return;
    setTypeFilter('Todos');
    setOriginFilter('Todos');
    setSearchQuery('');
    setExpandedIds((prev) => ({ ...prev, [highlightedReqId]: true }));

    const timer = setTimeout(() => {
      const el = rowRefs.current[highlightedReqId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [highlightedReqId]);

  const filteredRequirements = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return REQUIREMENTS.filter((req) => {
      const matchType = typeFilter === 'Todos' || req.type === typeFilter;
      const matchOrigin = originFilter === 'Todos' || req.origin === originFilter;
      const matchSearch =
        !q ||
        req.id.toLowerCase().includes(q) ||
        req.description.toLowerCase().includes(q) ||
        req.tag.toLowerCase().includes(q) ||
        req.evidence.toLowerCase().includes(q);
      return matchType && matchOrigin && matchSearch;
    });
  }, [typeFilter, originFilter, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Aviso visible de métricas pendientes */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        role="note"
        className="flex items-start sm:items-center gap-3 rounded-[24px] border border-amber-500/40 bg-amber-500/12 px-5 py-4 text-sm text-amber-900 dark:text-amber-200 backdrop-blur-xl"
      >
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5 sm:mt-0" />
        <div>
          <strong className="font-semibold">Aviso institucional: </strong>
          las métricas cuantitativas de disponibilidad (RNF-03) y tiempo máximo de rendimiento (RNF-04) están pendientes de definición institucional.
        </div>
      </motion.div>

      {/* Filtros y buscador */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
        className="rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5 shadow-lg shadow-slate-900/5 space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Buscador */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código (RF-02), descripción o evidencia..."
              aria-label="Buscar requisitos"
              className="w-full rounded-2xl border border-slate-200/90 dark:border-white/15 bg-white/90 dark:bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {highlightedReqId && onClearHighlight && (
            <button
              type="button"
              onClick={onClearHighlight}
              className="inline-flex items-center gap-1.5 self-start lg:self-auto rounded-full border border-cyan-400/50 bg-cyan-400/15 px-3 py-1.5 font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-400/25 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Resaltado: {highlightedReqId} · Quitar</span>
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 md:gap-6">
          {/* Filtro por tipo */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              Tipo:
            </span>
            {(['Todos', 'Funcional', 'No funcional'] as const).map((t) => {
              const active = typeFilter === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                    active
                      ? 'border-cyan-400 bg-cyan-400/18 text-slate-950 dark:text-white'
                      : 'border-slate-200/90 dark:border-white/10 bg-slate-100/70 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/25'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Filtro por origen */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <BookOpen className="h-3.5 w-3.5" />
              Origen:
            </span>
            {(
              [
                'Todos',
                'Explícito en el PETI',
                'Propuesta / Inferencia del equipo',
              ] as const
            ).map((o) => {
              const active = originFilter === o;
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOriginFilter(o)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                    active
                      ? 'border-violet-400 bg-violet-500/18 text-slate-950 dark:text-white'
                      : 'border-slate-200/90 dark:border-white/10 bg-slate-100/70 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/25'
                  }`}
                >
                  {o}
                </button>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Tabla expandible de requisitos */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5 sm:p-6 shadow-lg shadow-slate-900/5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Catálogo de requisitos (Taller 3)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Expande cada fila para consultar su evidencia y trazabilidad con el PETI.
            </p>
          </div>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {filteredRequirements.length} de {REQUIREMENTS.length} requisitos
          </span>
        </div>

        {filteredRequirements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-8 text-center text-sm text-slate-600 dark:text-slate-400">
            No se encontraron requisitos que coincidan con la búsqueda o filtros activos.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200/90 dark:border-white/10 font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 pr-3">Código</th>
                  <th className="py-3 px-3">Tipo</th>
                  <th className="py-3 px-3">Prioridad / Categoría</th>
                  <th className="py-3 px-3">Descripción</th>
                  <th className="py-3 px-3">Origen</th>
                  <th className="py-3 pl-3 text-right">Evidencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-white/5 text-sm">
                {filteredRequirements.map((req) => {
                  const isExpanded = !!expandedIds[req.id];
                  const isHighlighted = highlightedReqId === req.id;

                  return (
                    <React.Fragment key={req.id}>
                      <tr
                        ref={(el) => {
                          rowRefs.current[req.id] = el;
                        }}
                        className={`transition-colors ${
                          isHighlighted
                            ? 'bg-cyan-400/15 dark:bg-cyan-400/15 ring-1 ring-inset ring-cyan-400/60'
                            : 'hover:bg-slate-100/70 dark:hover:bg-white/[0.03]'
                        }`}
                      >
                        <td className="py-3.5 pr-3 align-middle">
                          <span
                            className={`inline-flex items-center rounded-xl px-2.5 py-1 font-mono text-xs font-bold ${
                              req.type === 'Funcional'
                                ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
                                : 'bg-violet-500/15 text-violet-700 dark:text-violet-300'
                            }`}
                          >
                            {req.id}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 align-middle text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {req.type}
                        </td>
                        <td className="py-3.5 px-3 align-middle font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {req.tag}
                        </td>
                        <td className="py-3.5 px-3 align-middle text-slate-900 dark:text-slate-100 max-w-md">
                          {req.description}
                        </td>
                        <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium ${
                              req.origin === 'Explícito en el PETI'
                                ? 'border-emerald-500/35 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                                : 'border-slate-300/80 dark:border-white/15 bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {req.origin}
                          </span>
                        </td>
                        <td className="py-3.5 pl-3 align-middle text-right">
                          <button
                            type="button"
                            onClick={() => toggleExpand(req.id)}
                            aria-expanded={isExpanded}
                            aria-label={`Mostrar evidencia de ${req.id}`}
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
                            <td colSpan={6} className="p-0">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.22 }}
                                className="overflow-hidden bg-slate-50/90 dark:bg-white/[0.03]"
                              >
                                <div className="flex items-start gap-3 px-4 py-3.5 border-t border-slate-200/70 dark:border-white/5">
                                  <BookOpen className="h-4 w-4 shrink-0 mt-0.5 text-cyan-600 dark:text-cyan-400" />
                                  <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                                    <strong className="font-mono text-slate-900 dark:text-white">
                                      Evidencia y sustento ({req.id}):{' '}
                                    </strong>
                                    {req.evidence}
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
    </div>
  );
}
