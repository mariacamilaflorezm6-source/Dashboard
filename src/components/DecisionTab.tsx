import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  Crown,
  Info,
  RotateCcw,
} from 'lucide-react';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import {
  ALTERNATIVES,
  INITIAL_DECISION_CRITERIA,
  type DecisionCriterion,
} from '../data';

interface DecisionTabProps {
  isDark: boolean;
  onNavigateRequirement?: (reqId: string) => void;
}

type AltKey = 'A1' | 'A2' | 'A3';

export default function DecisionTab({
  isDark,
  onNavigateRequirement,
}: DecisionTabProps) {
  const [criteria, setCriteria] = useState<DecisionCriterion[]>(
    INITIAL_DECISION_CRITERIA
  );
  const [hoveredRationale, setHoveredRationale] = useState<{
    criterionName: string;
    altLabel: string;
    text: string;
    rect: DOMRect;
  } | null>(null);

  const totalWeight = useMemo(
    () => criteria.reduce((sum, c) => sum + c.weight, 0),
    [criteria]
  );

  // Cálculo ponderado exacto: suma de (peso / 100) * calificación
  const ranking = useMemo(() => {
    const keys: AltKey[] = ['A1', 'A2', 'A3'];
    const totals = keys.map((key) => {
      const altInfo = ALTERNATIVES.find((a) => a.id === key)!;
      const score = criteria.reduce(
        (acc, c) => acc + (c.weight / 100) * c.scores[key],
        0
      );
      return {
        key,
        name: altInfo.shortName,
        fullName: altInfo.name,
        accent: altInfo.accent,
        score,
      };
    });

    const sorted = [...totals].sort((a, b) => b.score - a.score);
    return sorted.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [criteria]);

  const winner = ranking[0];

  const radarData = useMemo(
    () =>
      criteria.map((c) => ({
        subject: c.shortLabel,
        fullSubject: c.name,
        A1: c.scores.A1,
        A2: c.scores.A2,
        A3: c.scores.A3,
      })),
    [criteria]
  );

  const updateWeight = (id: string, newWeight: number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, weight: newWeight } : c))
    );
  };

  const updateScore = (id: string, alt: AltKey, newScore: number) => {
    setCriteria((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              scores: {
                ...c.scores,
                [alt]: newScore,
              },
            }
          : c
      )
    );
  };

  const handleReset = () => {
    setCriteria(INITIAL_DECISION_CRITERIA);
  };

  const hasChanges = useMemo(() => {
    return criteria.some((c, i) => {
      const orig = INITIAL_DECISION_CRITERIA[i];
      return (
        c.weight !== orig.weight ||
        c.scores.A1 !== orig.scores.A1 ||
        c.scores.A2 !== orig.scores.A2 ||
        c.scores.A3 !== orig.scores.A3
      );
    });
  }, [criteria]);

  const formatScore = (val: number) => val.toFixed(2).replace('.', ',');

  return (
    <div className="space-y-6">
      {/* Encabezado y botón de restablecer */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl px-6 py-5 shadow-lg shadow-slate-900/5"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Matriz ponderada de decisión multicriterio
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Ajusta los pesos porcentuales o las calificaciones (1 a 5) para simular escenarios. Pasa el cursor sobre cada calificación para ver su sustento.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges}
          className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200/90 dark:border-white/15 bg-white/80 dark:bg-white/5 px-4 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-violet-400 hover:text-violet-700 dark:hover:text-violet-300 disabled:opacity-45 disabled:pointer-events-none transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400"
        >
          <RotateCcw className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          <span>Restablecer valores originales</span>
        </button>
      </motion.div>

      {/* Aviso si los pesos no suman 100% */}
      <AnimatePresence>
        {totalWeight !== 100 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 rounded-[20px] border border-amber-500/45 bg-amber-500/15 px-5 py-3.5 text-sm text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  La suma actual de pesos es{' '}
                  <strong className="font-mono">{totalWeight}%</strong>. Ajusta los deslizadores para que sumen exactamente{' '}
                  <strong className="font-mono">100%</strong> y obtener un promedio ponderado válido sobre 5,00.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ranking 1º, 2º y 3º con corona animada en la ganadora */}
      <section
        aria-label="Ranking de alternativas"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {ranking.map((item) => {
          const isWinner = item.rank === 1;
          return (
            <motion.div
              key={item.key}
              layout
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              style={{
                boxShadow: isWinner
                  ? `0 16px 40px -16px ${item.accent}77`
                  : undefined,
              }}
              className={`relative overflow-hidden rounded-[24px] border p-5 backdrop-blur-xl ${
                isWinner
                  ? 'border-cyan-400/70 bg-white/90 dark:bg-[#0E1938]/90'
                  : 'border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75'
              }`}
            >
              {isWinner && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-25 blur-2xl"
                  style={{ backgroundColor: item.accent }}
                />
              )}

              <div className="relative flex items-center justify-between gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 font-mono text-xs font-bold text-slate-950"
                  style={{ backgroundColor: item.accent }}
                >
                  {item.rank}º · {item.key}
                </span>

                {isWinner && (
                  <motion.span
                    initial={{ scale: 0.7, rotate: -10 }}
                    animate={{ scale: 1, rotate: [0, -6, 6, 0] }}
                    transition={{ duration: 0.7 }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-400/15 px-3 py-1 font-mono text-xs font-bold text-amber-700 dark:text-amber-300"
                  >
                    <Crown className="h-4 w-4 text-amber-500" />
                    Ganadora
                  </motion.span>
                )}
              </div>

              <h3 className="relative mt-3 text-base font-bold text-slate-900 dark:text-white">
                {item.name}
              </h3>

              <div className="relative mt-2 flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-bold text-slate-900 dark:text-white">
                  {formatScore(item.score)}
                </span>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  / 5,00
                </span>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Matriz interactiva + Radar Recharts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Tabla interactiva */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="xl:col-span-8 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5 sm:p-6 shadow-lg shadow-slate-900/5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Criterios, pesos y calificaciones (1–5)
            </h3>
            <span
              className={`rounded-full border px-3 py-1 font-mono text-xs font-bold ${
                totalWeight === 100
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                  : 'border-amber-500/45 bg-amber-500/15 text-amber-800 dark:text-amber-300'
              }`}
            >
              Suma de pesos: {totalWeight}%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200/90 dark:border-white/10 font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 pr-3">Criterio y requisitos</th>
                  <th className="py-3 px-3 w-36">Peso (%)</th>
                  <th className="py-3 px-3 text-center">A1 · Medida</th>
                  <th className="py-3 px-3 text-center">A2 · ESB</th>
                  <th className="py-3 pl-3 text-center">A3 · iPaaS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-white/5 text-sm">
                {criteria.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-100/60 dark:hover:bg-white/[0.025] transition-colors"
                  >
                    <td className="py-3.5 pr-3 align-middle">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {c.name}
                      </div>
                      {c.requirements.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {c.requirements.map((req) => (
                            <button
                              key={req}
                              type="button"
                              onClick={() => onNavigateRequirement?.(req)}
                              className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                            >
                              {req}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 align-middle">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={40}
                          step={5}
                          value={c.weight}
                          aria-label={`Peso para ${c.name}`}
                          onChange={(e) => updateWeight(c.id, Number(e.target.value))}
                          className="w-20 accent-cyan-400 cursor-pointer"
                        />
                        <span className="w-10 text-right font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {c.weight}%
                        </span>
                      </div>
                    </td>

                    {(['A1', 'A2', 'A3'] as AltKey[]).map((altKey) => (
                      <td
                        key={altKey}
                        className="py-3.5 px-3 align-middle text-center"
                      >
                        <div
                          onMouseEnter={(e) =>
                            setHoveredRationale({
                              criterionName: c.name,
                              altLabel: altKey,
                              text: c.rationales[altKey],
                              rect: e.currentTarget.getBoundingClientRect(),
                            })
                          }
                          onMouseLeave={() => setHoveredRationale(null)}
                          className={`inline-flex flex-col items-center gap-1 rounded-2xl border px-2.5 py-1.5 transition-colors ${
                            altKey === winner.key
                              ? 'border-cyan-400/40 bg-cyan-500/[0.08]'
                              : 'border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                              {c.scores[altKey]}
                            </span>
                            <Info className="h-3 w-3 text-slate-400" />
                          </div>
                          <input
                            type="range"
                            min={1}
                            max={5}
                            step={1}
                            value={c.scores[altKey]}
                            aria-label={`Calificación de ${altKey} en ${c.name}`}
                            onChange={(e) =>
                              updateScore(c.id, altKey, Number(e.target.value))
                            }
                            className="w-16 accent-violet-400 cursor-pointer"
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Fila de totales calculados */}
                <tr className="bg-slate-100/80 dark:bg-white/[0.05] font-bold">
                  <td className="py-3.5 pr-3 text-slate-900 dark:text-white">
                    Total ponderado (suma peso × calificación)
                  </td>
                  <td className="py-3.5 px-3 font-mono text-xs text-slate-700 dark:text-slate-300">
                    {totalWeight}%
                  </td>
                  {(['A1', 'A2', 'A3'] as AltKey[]).map((key) => {
                    const rowItem = ranking.find((r) => r.key === key)!;
                    return (
                      <td
                        key={key}
                        className="py-3.5 px-3 text-center font-mono text-base"
                        style={{ color: rowItem.accent }}
                      >
                        {formatScore(rowItem.score)}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Gráfico de Radar (Recharts) */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          aria-label="Gráfico de radar comparativo por criterio"
          className="xl:col-span-4 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5 sm:p-6 shadow-lg shadow-slate-900/5"
        >
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Perfil multicriterio (Radar)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Comparación visual de desempeño (1–5) en los 8 criterios evaluados.
            </p>
          </div>

          <div className="mt-4 h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
                <PolarGrid
                  stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)'}
                />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fill: isDark ? '#CBD5E1' : '#334155',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 5]}
                  tickCount={6}
                  tick={{
                    fill: isDark ? '#64748B' : '#64748B',
                    fontSize: 9,
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Radar
                  name="A1 · Medida"
                  dataKey="A1"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
                <Radar
                  name="A2 · ESB"
                  dataKey="A2"
                  stroke="#FBBF24"
                  fill="#FBBF24"
                  fillOpacity={0.16}
                  strokeWidth={2}
                />
                <Radar
                  name="A3 · iPaaS"
                  dataKey="A3"
                  stroke="#22D3EE"
                  fill="#22D3EE"
                  fillOpacity={0.28}
                  strokeWidth={2.5}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0].payload;
                    return (
                      <div className="rounded-2xl border border-slate-200 dark:border-white/15 bg-white/95 dark:bg-[#0B1126]/95 p-3 text-xs shadow-xl">
                        <div className="font-bold text-slate-900 dark:text-white mb-1.5">
                          {row.fullSubject}
                        </div>
                        {payload.map((entry) => (
                          <div
                            key={String(entry.name)}
                            className="flex items-center justify-between gap-4 font-mono"
                          >
                            <span style={{ color: entry.color }}>{entry.name}:</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {entry.value} / 5
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </div>

      {/* Tooltip flotante con sustento de calificación */}
      <AnimatePresence>
        {hoveredRationale && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.14 }}
            style={{
              position: 'fixed',
              left: Math.min(
                window.innerWidth - 300,
                Math.max(16, hoveredRationale.rect.left + hoveredRationale.rect.width / 2 - 140)
              ),
              top: Math.max(16, hoveredRationale.rect.top - 108),
            }}
            className="pointer-events-none z-50 w-[280px] rounded-2xl border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-[#0B1126]/95 p-3.5 shadow-2xl backdrop-blur-xl"
          >
            <div className="font-mono text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
              {hoveredRationale.altLabel} · {hoveredRationale.criterionName}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
              {hoveredRationale.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
