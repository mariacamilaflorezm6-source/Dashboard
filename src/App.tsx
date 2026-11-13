import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { NAV_TABS, type TabId } from './data';
import ResumenTab from './components/ResumenTab';
import PetiNecesidadTab from './components/PetiNecesidadTab';
import RequisitosTab from './components/RequisitosTab';
import AlternativasTab from './components/AlternativasTab';
import DecisionTab from './components/DecisionTab';
import CanvasTab from './components/CanvasTab';
import RiesgosTab from './components/RiesgosTab';
import ImplementacionTab from './components/ImplementacionTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('resumen');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [highlightedReqId, setHighlightedReqId] = useState<string | null>(null);
  const [highlightedNeedId, setHighlightedNeedId] = useState<number | null>(null);
  const [pendingRiskId, setPendingRiskId] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleNavigateTab = (tab: TabId) => {
    setActiveTab(tab);
    if (tab !== 'requisitos') {
      setHighlightedReqId(null);
    }
    if (tab !== 'peti') {
      setHighlightedNeedId(null);
    }
  };

  const handleNavigateRequirement = (reqId?: string) => {
    if (!reqId) {
      setHighlightedReqId(null);
      setActiveTab('requisitos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (reqId.toUpperCase().startsWith('PETI')) {
      setHighlightedNeedId(5);
      setActiveTab('peti');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setHighlightedReqId(reqId);
    setActiveTab('requisitos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateRisk = (riskId?: string) => {
    setPendingRiskId(riskId ?? null);
    setActiveTab('riesgos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
        {/* Encabezado */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl px-5 sm:px-7 py-5 shadow-lg shadow-slate-900/5"
        >
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-medium text-cyan-700 dark:text-cyan-400">
              <span>Unidades Tecnológicas de Santander (UTS)</span>
              <span aria-hidden="true">·</span>
              <span>TSI604 · 2026-2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              Integración GD ↔ Academusoft
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sala de control integral: diagnóstico PETI, requisitos, evaluación de alternativas, Canvas y gestión de riesgos.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
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

        {/* Barra de navegación con pestañas animadas e indicador deslizante */}
        <nav
          aria-label="Secciones del proyecto"
          className="rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-2 shadow-lg shadow-slate-900/5"
        >
          <div
            role="tablist"
            aria-label="Navegación principal del tablero"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0"
          >
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => handleNavigateTab(tab.id)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                    isActive
                      ? 'text-slate-950 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavTabIndicator"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-2xl border border-cyan-400/50 bg-gradient-to-r from-cyan-400/20 via-cyan-400/15 to-violet-500/20 shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Contenido dinámico de la pestaña activa */}
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'resumen' && (
                <ResumenTab onNavigateTab={handleNavigateTab} />
              )}
              {activeTab === 'peti' && (
                <PetiNecesidadTab highlightedNeedId={highlightedNeedId} />
              )}
              {activeTab === 'requisitos' && (
                <RequisitosTab
                  highlightedReqId={highlightedReqId}
                  onClearHighlight={() => setHighlightedReqId(null)}
                />
              )}
              {activeTab === 'alternativas' && <AlternativasTab />}
              {activeTab === 'decision' && (
                <DecisionTab
                  isDark={isDark}
                  onNavigateRequirement={handleNavigateRequirement}
                />
              )}
              {activeTab === 'canvas' && <CanvasTab />}
              {activeTab === 'riesgos' && (
                <RiesgosTab
                  isDark={isDark}
                  onNavigateRequirement={handleNavigateRequirement}
                  initialRiskId={pendingRiskId}
                  onConsumeInitialRisk={() => setPendingRiskId(null)}
                />
              )}
              {activeTab === 'implementacion' && (
                <ImplementacionTab
                  onNavigateRisk={handleNavigateRisk}
                  onNavigateRequirement={handleNavigateRequirement}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
