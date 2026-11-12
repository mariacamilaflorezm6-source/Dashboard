import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardList,
  Compass,
  GitBranch,
  GraduationCap,
  ShieldAlert,
  Users,
} from 'lucide-react';
import {
  COURSE_INFO,
  TEAM_MEMBERS,
  type TabId,
} from '../data';

interface ResumenTabProps {
  onNavigateTab: (tab: TabId) => void;
}

export default function ResumenTab({ onNavigateTab }: ResumenTabProps) {
  const summaryStats = [
    {
      label: 'Requisitos levantados',
      value: '12',
      detail: '6 funcionales (RF) y 6 no funcionales (RNF)',
      accent: '#22D3EE',
      icon: <ClipboardList className="h-5 w-5" />,
      targetTab: 'requisitos' as TabId,
    },
    {
      label: 'Alternativas evaluadas',
      value: '3',
      detail: 'Web Service a medida, ESB Open Source e iPaaS',
      accent: '#8B5CF6',
      icon: <GitBranch className="h-5 w-5" />,
      targetTab: 'alternativas' as TabId,
    },
    {
      label: 'Solución elegida',
      value: '4,00 / 5',
      detail: 'iPaaS en la nube (Alternativa 3)',
      accent: '#34D399',
      icon: <Award className="h-5 w-5" />,
      targetTab: 'decision' as TabId,
    },
    {
      label: 'Riesgos identificados',
      value: '5',
      detail: 'Evaluados con matriz 5×5 y plan de mitigación',
      accent: '#FB923C',
      icon: <ShieldAlert className="h-5 w-5" />,
      targetTab: 'riesgos' as TabId,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner principal de contexto */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-6 sm:p-8 shadow-lg shadow-slate-900/5"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-cyan-400/15 blur-3xl"
        />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">
              <Compass className="h-4 w-4" />
              <span>Ruta integral del proyecto de evaluación tecnológica</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              Automatización del cargue de pagos entre GD y Academusoft
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Recorrido completo desde el diagnóstico del Plan Estratégico de Tecnologías de la Información (PETI UTS 2026) hasta la selección de la arquitectura iPaaS en la nube y el control interactivo de riesgos.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('riesgos')}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border border-cyan-400/50 bg-cyan-500/15 px-5 text-sm font-semibold text-cyan-800 dark:text-cyan-200 hover:bg-cyan-500/25 transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <span>Ir al control de riesgos</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.section>

      {/* Tarjetas de cifras clave */}
      <section
        aria-label="Cifras resumidas del proyecto"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {summaryStats.map((stat, idx) => (
          <motion.button
            key={stat.label}
            type="button"
            onClick={() => onNavigateTab(stat.targetTab)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            style={{ boxShadow: `0 12px 32px -18px ${stat.accent}66` }}
            className="group text-left relative overflow-hidden rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5 transition-all hover:border-cyan-400/50 focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: stat.accent }}
            />
            <div className="relative flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {stat.label}
              </span>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-100/80 dark:bg-white/5"
                style={{ color: stat.accent }}
              >
                {stat.icon}
              </span>
            </div>
            <div className="relative mt-3 font-mono text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {stat.value}
            </div>
            <div className="relative mt-2 flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>{stat.detail}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
            </div>
          </motion.button>
        ))}
      </section>

      {/* Integrantes y asignatura */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22 }}
          className="lg:col-span-7 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-6 shadow-lg shadow-slate-900/5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Equipo del proyecto
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Integrantes responsables del análisis, evaluación y gestión de riesgos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TEAM_MEMBERS.map((member, index) => {
              const initials = member
                .split(' ')
                .slice(0, 2)
                .map((p) => p[0])
                .join('')
                .toUpperCase();
              const gradients = [
                'from-cyan-400 to-blue-500',
                'from-violet-400 to-fuchsia-500',
                'from-emerald-400 to-cyan-500',
              ];
              return (
                <div
                  key={member}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/75 dark:bg-white/[0.03] p-3.5"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradients[index]} font-mono text-xs font-bold text-slate-950 shadow-md`}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold leading-snug text-slate-900 dark:text-white">
                      {member}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.28 }}
          className="lg:col-span-5 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-6 shadow-lg shadow-slate-900/5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
                <GraduationCap className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Contexto académico
              </h3>
            </div>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 dark:border-white/10 pb-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Asignatura</span>
                <span className="font-semibold text-right text-slate-900 dark:text-white">
                  {COURSE_INFO.subject}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 dark:border-white/10 pb-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Periodo</span>
                <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">
                  {COURSE_INFO.period}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Institución</span>
                <span className="font-medium text-right text-slate-900 dark:text-white">
                  {COURSE_INFO.institution}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Trazabilidad completa desde el PETI UTS 2026 hasta la matriz de riesgos.</span>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
