'use client';

import React from 'react';
import { X, Navigation } from 'lucide-react';
import { MapPOI } from '@/data/mapData';

interface DetailsCardProps {
  selectedPOI: MapPOI | null;
  setSelectedPOI: (poi: MapPOI | null) => void;
  sidebarOpen: boolean;
}

export default function DetailsCard({
  selectedPOI,
  setSelectedPOI,
  sidebarOpen
}: DetailsCardProps) {
  if (!selectedPOI || !sidebarOpen) return null;

  return (
    <div className="hidden lg:flex absolute top-4 right-4 bottom-4 w-96 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex-col overflow-hidden animate-slide-in">
      {/* Header image details */}
      <div
        className="h-36 w-full relative flex items-end p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
        style={{
          background: `linear-gradient(to top, rgba(9, 9, 11, 0.95), rgba(9, 9, 11, 0.2)), url('/api/placeholder/400/200') center/cover`
        }}
      >
        <div className="text-white z-10 w-full">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 uppercase tracking-widest backdrop-blur-sm border border-white/20">
            {selectedPOI.category}
          </span>
          <h2 className="font-extrabold text-lg mt-1 leading-snug drop-shadow-sm truncate">{selectedPOI.name}</h2>
        </div>
        <button
          onClick={() => setSelectedPOI(null)}
          className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description & Details Info */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Deskripsi</span>
          <p className="mt-1 text-zinc-600 dark:text-zinc-300 leading-relaxed font-semibold">
            {selectedPOI.description}
          </p>
        </div>

        {/* Attributes fields rendering */}
        <div className="border-t border-zinc-150 dark:border-zinc-800 pt-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">Informasi Detail</span>
          <div className="space-y-2">
            {Object.entries(selectedPOI.details).map(([key, val]) => (
              <div key={key} className="bg-zinc-50 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">{key}</span>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 leading-relaxed">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA action buttons footer */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPOI.lat},${selectedPOI.lng}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-2xl flex items-center justify-center gap-2 text-xs transition-colors shadow-lg shadow-black/5 cursor-pointer"
        >
          <Navigation className="w-4.5 h-4.5" />
          Petunjuk Arah (Navigasi)
        </a>
      </div>
    </div>
  );
}
