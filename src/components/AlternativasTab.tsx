import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Columns3,
  Cpu,
  DollarSign,
  MinusCircle,
  Server,
} from 'lucide-react';
import { ALTERNATIVES } from '../data';

export default function AlternativasTab() {
  const [compareMode, setCompareMode] = useState<boolean>(false);

  const comparisonRows = [
    {
      label: 'Enfoque técnico',
      values: {
        A1: 'Código a medida (REST/SOAP sobre HTTPS)',
        A2: 'Bus ESB Open Source (WSO2 Integrator: MI)',
        A3: 'iPaaS gestionado en la nube (Azure Logic Apps)',
      },
    },
    {
      label: 'Proveedor / Operación',
      values: {
        A1: 'Equipo TI UTS o contratista',
        A2: 'Comunidad Apache 2.0 + servidor propio UTS',
        A3: 'Proveedor cloud público (ej. Microsoft Azure)',
      },
    },
    {
      label: 'Modelo de costos',
      values: {
        A1: 'Sin licencia · Horas de desarrollo y mantenimiento',
        A2: 'Licencia gratuita · Servidor, despliegue y capacitación',
        A3: 'Pago por uso (Consumption) según volumen de pagos',
      },
    },
    {
      label: 'Impacto al equipo TI (PETI p. 42-43)',
      values: {
        A1: 'Alto: carga completa de código y soporte',
        A2: 'Medio: requiere administrar servidor y curva ESB',
        A3: 'Bajo: flujo visual sin infraestructura propia',
      },
    },
    {
      label: 'Puntaje ponderado',
      values: {
        A1: '3,05 / 5,00',
        A2: '3,85 / 5,00',
        A3: '4,00 / 5,00 (Recomendada)',
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado de sección con botón Comparar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl px-6 py-5 shadow-lg shadow-slate-900/5"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Tres alternativas tecnológicas evaluadas
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Análisis de proveedor, estructura de costos, ventajas, limitaciones y riesgos específicos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCompareMode((prev) => !prev)}
          aria-pressed={compareMode}
          className={`inline-flex h-10 items-center gap-2 rounded-2xl border px-4 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400 ${
            compareMode
              ? 'border-cyan-400 bg-cyan-400/20 text-cyan-900 dark:text-cyan-200 shadow-md shadow-cyan-500/15'
              : 'border-slate-200/90 dark:border-white/15 bg-white/80 dark:bg-white/5 text-slate-800 dark:text-slate-100 hover:border-cyan-400'
          }`}
        >
          <Columns3 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span>{compareMode ? 'Ocultar comparación' : 'Comparar'}</span>
        </button>
      </motion.div>

      {/* Tabla comparativa lado a lado */}
      <AnimatePresence>
        {compareMode && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="rounded-[24px] border border-cyan-400/40 bg-white/85 dark:bg-[#0B1228]/90 backdrop-blur-xl p-5 sm:p-6 shadow-xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Comparativa lado a lado
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-white/10 font-mono text-xs">
                      <th className="py-3 pr-4 text-slate-500 dark:text-slate-400">
                        Dimensión
                      </th>
                      {ALTERNATIVES.map((alt) => (
                        <th key={alt.id} className="py-3 px-4">
                          <span
                            className="inline-flex items-center gap-1.5 font-bold"
                            style={{ color: alt.accent }}
                          >
                            {alt.id} · {alt.shortName}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-white/5">
                    {comparisonRows.map((row) => (
                      <tr key={row.label}>
                        <td className="py-3.5 pr-4 font-medium text-xs text-slate-600 dark:text-slate-400">
                          {row.label}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-800 dark:text-slate-200">
                          {row.values.A1}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-800 dark:text-slate-200">
                          {row.values.A2}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-cyan-800 dark:text-cyan-200 bg-cyan-500/[0.06]">
                          {row.values.A3}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Tres tarjetas grandes de alternativas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {ALTERNATIVES.map((alt, idx) => (
          <motion.article
            key={alt.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 * idx, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            style={{
              boxShadow: alt.recommended
                ? `0 18px 42px -18px ${alt.accent}66`
                : undefined,
            }}
            className={`relative flex flex-col justify-between overflow-hidden rounded-[24px] border backdrop-blur-xl p-6 transition-all ${
              alt.recommended
                ? 'border-cyan-400/60 bg-white/85 dark:bg-[#0D1633]/85'
                : 'border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75'
            }`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: alt.accent }}
            />

            <div className="relative space-y-4">
              {/* Cabecera */}
              <div className="flex items-start justify-between gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 font-mono text-xs font-bold text-slate-950"
                  style={{ backgroundColor: alt.accent }}
                >
                  <Cpu className="h-3.5 w-3.5" />
                  {alt.id}
                </span>
                {alt.recommended && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/45 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    <Award className="h-3.5 w-3.5" />
                    Seleccionada (4,00/5)
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold leading-snug text-slate-900 dark:text-white">
                  {alt.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  Ejemplo: {alt.example}
                </p>
              </div>

              {/* Proveedor y Costo */}
              <div className="space-y-2.5 rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] p-4 text-xs">
                <div className="flex items-start gap-2">
                  <Server className="h-4 w-4 shrink-0 mt-0.5 text-slate-500 dark:text-slate-400" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Proveedor:{' '}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">{alt.provider}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 shrink-0 mt-0.5 text-slate-500 dark:text-slate-400" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Costo:{' '}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">{alt.cost}</span>
                  </div>
                </div>
              </div>

              {/* Ventajas */}
              <div>
                <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
                  Ventajas
                </div>
                <ul className="space-y-1.5">
                  {alt.advantages.map((adv) => (
                    <li
                      key={adv}
                      className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-500" />
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitaciones */}
              <div>
                <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
                  Limitaciones
                </div>
                <ul className="space-y-1.5">
                  {alt.limitations.map((lim) => (
                    <li
                      key={lim}
                      className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300"
                    >
                      <MinusCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Riesgos */}
              <div>
                <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-2">
                  Riesgos clave
                </div>
                <ul className="space-y-1.5">
                  {alt.risks.map((risk) => (
                    <li
                      key={risk}
                      className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-500" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
