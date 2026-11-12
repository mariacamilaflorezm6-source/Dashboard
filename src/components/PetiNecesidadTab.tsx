import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  RotateCw,
  Target,
} from 'lucide-react';
import {
  KNOWLEDGE_COLUMNS,
  PETI_CHALLENGE,
  PETI_NEEDS,
  PRIORITY_MATRIX,
} from '../data';

interface PetiNecesidadTabProps {
  highlightedNeedId?: number | null;
}

export default function PetiNecesidadTab({ highlightedNeedId }: PetiNecesidadTabProps) {
  const [flippedIds, setFlippedIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (highlightedNeedId) {
      setFlippedIds((prev) => ({ ...prev, [highlightedNeedId]: true }));
    }
  }, [highlightedNeedId]);

  const toggleFlip = (id: number) => {
    setFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Reto seleccionado y pregunta inicial */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-6 shadow-lg shadow-slate-900/5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">
              <Target className="h-4 w-4" />
              Reto seleccionado (Taller 1)
            </span>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-cyan-800 dark:text-cyan-300">
              {PETI_CHALLENGE.source}
            </span>
          </div>
          <h2 className="mt-3 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-balance">
            {PETI_CHALLENGE.title}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {PETI_CHALLENGE.description}
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative overflow-hidden rounded-[24px] border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-white/75 to-cyan-500/10 dark:from-violet-500/15 dark:via-[#0D132A]/80 dark:to-cyan-500/10 backdrop-blur-xl p-6 shadow-lg shadow-slate-900/5 flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-violet-700 dark:text-violet-300">
            <HelpCircle className="h-4 w-4" />
            Pregunta inicial del proyecto
          </div>
          <blockquote className="mt-3 text-base sm:text-lg font-medium leading-relaxed text-slate-900 dark:text-slate-100">
            “{PETI_CHALLENGE.initialQuestion}”
          </blockquote>
        </motion.section>
      </div>

      {/* Cinco necesidades detectadas en el PETI (tarjetas volteables) */}
      <section aria-label="Necesidades detectadas en el PETI">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Cinco necesidades detectadas en el PETI
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Haz clic en cada tarjeta para voltearla y consultar su evidencia y página exacta del PETI.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PETI_NEEDS.map((need, idx) => {
            const isFlipped = !!flippedIds[need.id];
            const isHighlighted = highlightedNeedId === need.id;

            return (
              <motion.div
                key={need.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="h-[245px] [perspective:1000px]"
              >
                <button
                  type="button"
                  onClick={() => toggleFlip(need.id)}
                  aria-pressed={isFlipped}
                  aria-label={`Necesidad ${need.id}: ${need.title}. Clic para ver ${
                    isFlipped ? 'resumen' : 'evidencia del PETI'
                  }`}
                  className={`relative h-full w-full text-left transition-transform duration-500 [transform-style:preserve-3d] focus-visible:outline-2 focus-visible:outline-cyan-400 rounded-[24px] ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* Frente */}
                  <div
                    className={`absolute inset-0 flex flex-col justify-between rounded-[24px] border p-5 [backface-visibility:hidden] backdrop-blur-xl ${
                      isHighlighted
                        ? 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/20'
                        : 'border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0D132A]/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/15 font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300">
                          0{need.id}
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-violet-700 dark:text-violet-300">
                          {need.page}
                        </span>
                      </div>
                      <h4 className="mt-3 text-sm font-bold leading-snug text-slate-900 dark:text-white">
                        {need.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {need.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/70 dark:border-white/10">
                      <span className="font-mono text-[10px] font-semibold text-cyan-700 dark:text-cyan-400">
                        {need.metricBadge}
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                        <RotateCw className="h-3 w-3" />
                        Voltear
                      </span>
                    </div>
                  </div>

                  {/* Reverso (evidencia) */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-[24px] border border-cyan-400/50 bg-slate-900 text-slate-100 dark:bg-[#0B1430] p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl shadow-cyan-950/30">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-cyan-400">
                          <BookOpen className="h-3.5 w-3.5" />
                          Evidencia
                        </span>
                        <span className="font-mono text-[11px] text-slate-300">
                          {need.page}
                        </span>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-slate-200">
                        {need.evidence}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 font-mono text-[10px] text-cyan-300">
                      <span>Necesidad #{need.id}</span>
                      <span className="inline-flex items-center gap-1">
                        <RotateCw className="h-3 w-3" />
                        Volver
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Matriz de priorización con barras animadas */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.16 }}
        className="rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-6 shadow-lg shadow-slate-900/5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Matriz de priorización de necesidades
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Puntuación sobre 15 puntos: Impacto + Urgencia + Relevancia estratégica.
            </p>
          </div>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            Máximo posible: 15 pts
          </span>
        </div>

        <div className="space-y-4">
          {PRIORITY_MATRIX.map((item, idx) => (
            <div
              key={item.name}
              className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/75 dark:bg-white/[0.03] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </span>
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-slate-600 dark:text-slate-400">
                    {item.impact} + {item.urgency} + {item.strategic}
                  </span>
                  <span
                    className="rounded-lg px-2 py-0.5 font-bold text-slate-950"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.total} / 15
                  </span>
                </div>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.total / 15) * 100}%` }}
                  transition={{ duration: 0.7, delay: 0.15 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 14px ${item.color}66`,
                  }}
                />
              </div>

              <div className="mt-2 flex flex-wrap gap-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                <span>Impacto: {item.impact}/5</span>
                <span>·</span>
                <span>Urgencia: {item.urgency}/5</span>
                <span>·</span>
                <span>Relevancia estratégica: {item.strategic}/5</span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Lo que sabemos vs. Lo que aún no sabemos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22 }}
          className="rounded-[24px] border border-emerald-500/30 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-6 shadow-lg shadow-slate-900/5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Lo que sabemos
            </h3>
          </div>
          <ul className="space-y-3">
            {KNOWLEDGE_COLUMNS.known.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.28 }}
          className="rounded-[24px] border border-amber-500/30 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-6 shadow-lg shadow-slate-900/5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Lo que aún no sabemos
            </h3>
          </div>
          <ul className="space-y-3">
            {KNOWLEDGE_COLUMNS.unknown.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </div>
  );
}
