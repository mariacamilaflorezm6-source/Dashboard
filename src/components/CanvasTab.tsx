import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Maximize2, X } from 'lucide-react';
import { CANVAS_BLOCKS, type CanvasBlock } from '../data';

export default function CanvasTab() {
  const [selectedBlock, setSelectedBlock] = useState<CanvasBlock | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedBlock(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const byId = (id: string) => CANVAS_BLOCKS.find((b) => b.id === id)!;

  const renderCard = (block: CanvasBlock, className = '') => (
    <motion.button
      key={block.id}
      type="button"
      onClick={() => setSelectedBlock(block)}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      style={{
        borderColor: `${block.borderColor}66`,
        boxShadow: `0 12px 32px -20px ${block.borderColor}88`,
      }}
      className={`group flex flex-col justify-between text-left rounded-[24px] border bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl p-5 transition-all hover:bg-white/95 dark:hover:bg-[#111936]/90 focus-visible:outline-2 focus-visible:outline-cyan-400 ${className}`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200/70 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: block.borderColor }}
            />
            <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {block.title}
            </h3>
          </div>
          <Maximize2 className="h-3.5 w-3.5 text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-cyan-400 transition-all shrink-0" />
        </div>

        <ul className="mt-3 space-y-2">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: block.borderColor }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {block.highlightNote && (
          <div
            className="mt-4 rounded-2xl border p-3 text-xs leading-relaxed text-slate-800 dark:text-emerald-200"
            style={{
              borderColor: `${block.borderColor}55`,
              backgroundColor: `${block.borderColor}18`,
            }}
          >
            {block.highlightNote}
          </div>
        )}
      </div>

      <div className="mt-4 pt-2 font-mono text-[10px] text-slate-500 dark:text-slate-400">
        Clic para ampliar bloque
      </div>
    </motion.button>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0D132A]/75 backdrop-blur-xl px-6 py-5 shadow-lg shadow-slate-900/5"
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Modelo Canvas · Integración GD ↔ Academusoft
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Disposición clásica de 9 bloques estratégicos centrada en la solución iPaaS en la nube. Haz clic en cualquier bloque para ampliarlo.
        </p>
      </motion.div>

      {/* Disposición clásica del Business Model Canvas (5 columnas arriba, 2 bloques abajo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4 items-stretch">
        {/* Columna 1: Socios clave (ocupa 2 filas en desktop) */}
        <div className="lg:col-span-2 flex">
          {renderCard(byId('socios'), 'w-full')}
        </div>

        {/* Columna 2: Actividades clave + Recursos clave */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {renderCard(byId('actividades'), 'flex-1')}
          {renderCard(byId('recursos'), 'flex-1')}
        </div>

        {/* Columna 3: Propuesta de valor (ocupa 2 filas en desktop) */}
        <div className="lg:col-span-2 flex">
          {renderCard(byId('propuesta'), 'w-full')}
        </div>

        {/* Columna 4: Relación con clientes + Canales */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {renderCard(byId('relacion'), 'flex-1')}
          {renderCard(byId('canales'), 'flex-1')}
        </div>

        {/* Columna 5: Segmento de clientes (ocupa 2 filas en desktop) */}
        <div className="lg:col-span-2 flex">
          {renderCard(byId('segmentos'), 'w-full')}
        </div>

        {/* Fila inferior: Costes de estructura (5 cols) + Fuentes de ingreso (5 cols) */}
        <div className="md:col-span-1 lg:col-span-5 flex">
          {renderCard(byId('costes'), 'w-full')}
        </div>
        <div className="md:col-span-1 lg:col-span-5 flex">
          {renderCard(byId('ingresos'), 'w-full')}
        </div>
      </div>

      {/* Pie institucional */}
      <footer className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-[#0D132A]/60 px-5 py-3 text-center font-mono text-xs text-slate-600 dark:text-slate-400">
        Fuente: PETI UTS 2026, p. 53, Tabla 37 (explícito); el resto es propuesta del equipo.
      </footer>

      {/* Modal ampliado al hacer clic en un bloque */}
      <AnimatePresence>
        {selectedBlock && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlock(null)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={selectedBlock.title}
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 8 }}
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                style={{ borderColor: selectedBlock.borderColor }}
                className="pointer-events-auto w-full max-w-xl rounded-[24px] border-2 bg-white/95 dark:bg-[#0B1228]/95 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl"
              >
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: selectedBlock.borderColor }}
                    />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedBlock.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBlock(null)}
                    aria-label="Cerrar vista ampliada"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-white/15 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <ul className="mt-5 space-y-3">
                  {selectedBlock.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-relaxed text-slate-800 dark:text-slate-200"
                    >
                      <span
                        className="mt-2 h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: selectedBlock.borderColor }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {selectedBlock.highlightNote && (
                  <div
                    className="mt-5 rounded-2xl border p-4 text-sm leading-relaxed text-slate-900 dark:text-emerald-200"
                    style={{
                      borderColor: `${selectedBlock.borderColor}66`,
                      backgroundColor: `${selectedBlock.borderColor}1A`,
                    }}
                  >
                    {selectedBlock.highlightNote}
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
