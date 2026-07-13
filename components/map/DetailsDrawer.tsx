'use client';

import React from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import NavigationOutlined from '@mui/icons-material/NavigationOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import LocationSearchingOutlined from '@mui/icons-material/LocationSearchingOutlined';
import { MapPOI } from '@/data/mapData';

interface DetailsDrawerProps {
  selectedPOI: MapPOI | null;
  setSelectedPOI: (poi: MapPOI | null) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  user: any;
  onEditPOI: (poi: MapPOI) => void;
  onDeletePOI: (poiId: string) => void;
  onLocatePOI: (poi: MapPOI) => void;
}

export default function DetailsDrawer({
  selectedPOI,
  setSelectedPOI,
  drawerOpen,
  setDrawerOpen,
  user,
  onEditPOI,
  onDeletePOI,
  onLocatePOI
}: DetailsDrawerProps) {
  if (!selectedPOI) return null;

  return (
    <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 rounded-t-[2.5rem] shadow-2xl transition-transform duration-300 max-h-[75vh] flex flex-col ${drawerOpen ? 'translate-y-0' : 'translate-y-full'} select-none`}>
      {/* Drag handle area */}
      <div className="w-full flex justify-center py-3" onClick={() => setDrawerOpen(false)}>
        <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer" />
      </div>

      <div className="p-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-indigo-55/60 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border border-indigo-200/20">
            {selectedPOI.category}
          </span>
          <h2 className="font-extrabold text-base mt-1 text-zinc-900 dark:text-white leading-tight">{selectedPOI.name}</h2>
        </div>
        <button
          onClick={() => setSelectedPOI(null)}
          className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-550 dark:text-zinc-400 cursor-pointer transition-colors flex items-center justify-center"
        >
          <CloseOutlined className="w-4.5 h-4.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Deskripsi</span>
          <p className="mt-1 text-xs text-zinc-650 dark:text-zinc-300 leading-relaxed font-semibold">
            {selectedPOI.description}
          </p>
        </div>

        {selectedPOI.details && Object.keys(selectedPOI.details).length > 0 && (
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">Informasi Detail</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(selectedPOI.details).map(([key, val]) => (
                <div key={key} className="bg-zinc-55/40 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 flex flex-col">
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase">{key}</span>
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 leading-relaxed">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Buttons Footer */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col gap-2 pb-6">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onLocatePOI(selectedPOI)}
            className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition-colors shadow-md cursor-pointer border-0"
          >
            <LocationSearchingOutlined className="w-4 h-4" />
            Lihat di Peta
          </button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPOI.lat},${selectedPOI.lng}`}
            target="_blank"
            rel="noreferrer"
            className="py-3 bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition-colors shadow-md cursor-pointer border border-zinc-200 dark:border-zinc-800"
          >
            <NavigationOutlined className="w-4 h-4" />
            Navigasi
          </a>
        </div>

        {/* Admin actions list */}
        {user && (
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={() => {
                onEditPOI(selectedPOI);
                setDrawerOpen(false);
              }}
              className="py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-705 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <EditOutlined className="w-3.5 h-3.5" />
              Ubah
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Apakah Anda yakin ingin menghapus lokasi "${selectedPOI.name}"?`)) {
                  onDeletePOI(selectedPOI.id);
                  setSelectedPOI(null);
                  setDrawerOpen(false);
                }
              }}
              className="py-2.5 border border-red-200/50 hover:border-red-500/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold text-red-500 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <DeleteOutlined className="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
