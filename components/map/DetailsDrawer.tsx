'use client';

import React from 'react';
import { X, Navigation } from 'lucide-react';
import { MapPOI } from '@/data/mapData';

interface DetailsDrawerProps {
  selectedPOI: MapPOI | null;
  setSelectedPOI: (poi: MapPOI | null) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

export default function DetailsDrawer({
  selectedPOI,
  setSelectedPOI,
  drawerOpen,
  setDrawerOpen
}: DetailsDrawerProps) {
  if (!selectedPOI) return null;

  return (
    <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 rounded-t-[2.5rem] shadow-2xl transition-transform duration-300 max-h-[75vh] flex flex-col ${drawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
      {/* Drag handle area */}
      <div className="w-full flex justify-center py-3" onClick={() => setDrawerOpen(false)}>
        <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer" />
      </div>

      <div className="p-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border border-indigo-200/20">
            {selectedPOI.category}
          </span>
          <h2 className="font-extrabold text-base mt-1 text-zinc-900 dark:text-white leading-tight">{selectedPOI.name}</h2>
        </div>
        <button
          onClick={() => setSelectedPOI(null)}
          className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 dark:text-zinc-400 cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Deskripsi</span>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-semibold">
            {selectedPOI.description}
          </p>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">Informasi Detail</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(selectedPOI.details).map(([key, val]) => (
              <div key={key} className="bg-zinc-50 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 flex flex-col">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">{key}</span>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 leading-relaxed">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex pb-6">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPOI.lat},${selectedPOI.lng}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          Petunjuk Arah (Navigasi)
        </a>
      </div>
    </div>
  );
}
