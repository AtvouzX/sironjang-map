'use client';

import React from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import NavigationOutlined from '@mui/icons-material/NavigationOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import LocationSearchingOutlined from '@mui/icons-material/LocationSearchingOutlined';
import StarOutlined from '@mui/icons-material/StarOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import { MapPOI } from '@/data/mapData';

interface DetailsCardProps {
  selectedPOI: MapPOI | null;
  setSelectedPOI: (poi: MapPOI | null) => void;
  sidebarOpen: boolean;
  user: any;
  onEditPOI: (poi: MapPOI) => void;
  onDeletePOI: (poiId: string) => void;
  onLocatePOI: (poi: MapPOI) => void;
}

export default function DetailsCard({
  selectedPOI,
  setSelectedPOI,
  sidebarOpen,
  user,
  onEditPOI,
  onDeletePOI,
  onLocatePOI
}: DetailsCardProps) {
  if (!selectedPOI) return null;

  return (
    <div className="hidden lg:flex absolute top-4 right-4 bottom-4 w-96 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex-col overflow-hidden animate-slide-in select-none">
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
          className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white border border-white/10 transition-colors cursor-pointer flex items-center justify-center"
        >
          <CloseOutlined className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Description & Details Info */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-405">Deskripsi</span>
          <p className="mt-1 text-zinc-650 dark:text-zinc-300 leading-relaxed font-semibold">
            {selectedPOI.description}
          </p>
        </div>

        {/* Attributes fields rendering */}
        {selectedPOI.details && Object.keys(selectedPOI.details).length > 0 && (
          <div className="border-t border-zinc-155 dark:border-zinc-800 pt-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-405 block mb-2">Informasi Detail</span>
            <div className="space-y-2">
              {Object.entries(selectedPOI.details).map(([key, val]) => {
                if (!val) return null;

                let valElement = <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 leading-relaxed">{val}</span>;

                if (key.toLowerCase() === 'website') {
                  const url = val.startsWith('http') ? val : `https://${val}`;
                  valElement = (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:underline mt-0.5 leading-relaxed flex items-center gap-1.5 cursor-pointer"
                    >
                      <LanguageOutlined className="w-3.5 h-3.5" />
                      Kunjungi Website
                    </a>
                  );
                } else if (key.toLowerCase() === 'telepon') {
                  valElement = (
                    <a
                      href={`tel:${val.replace(/\s+/g, '')}`}
                      className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:underline mt-0.5 leading-relaxed flex items-center gap-1.5 cursor-pointer"
                    >
                      <PhoneOutlined className="w-3.5 h-3.5" />
                      {val}
                    </a>
                  );
                } else if (key.toLowerCase() === 'rating') {
                  const ratingNum = parseFloat(val);
                  if (!isNaN(ratingNum)) {
                    valElement = (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{val}</span>
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <StarOutlined
                              key={i}
                              className={`w-3.5 h-3.5 ${i < Math.floor(ratingNum)
                                  ? 'text-amber-500'
                                  : 'text-zinc-300 dark:text-zinc-700'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  }
                }

                return (
                  <div key={key} className="bg-zinc-55/60 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 flex flex-col">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-555 uppercase">{key}</span>
                    {valElement}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onLocatePOI(selectedPOI)}
            className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs transition-colors shadow-md cursor-pointer border-0"
          >
            <LocationSearchingOutlined className="w-4 h-4" />
            Lihat di Peta
          </button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPOI.lat},${selectedPOI.lng}`}
            target="_blank"
            rel="noreferrer"
            className="py-3 bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-2xl flex items-center justify-center gap-2 text-xs transition-colors shadow-md cursor-pointer border border-zinc-200 dark:border-zinc-800"
          >
            <NavigationOutlined className="w-4 h-4" />
            Navigasi
          </a>
        </div>

        {/* Admin Edit/Delete POI Panel */}
        {user && (
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={() => onEditPOI(selectedPOI)}
              className="py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-705 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <EditOutlined className="w-3.5 h-3.5" />
              Ubah
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Apakah Anda yakin ingin menghapus lokasi "${selectedPOI.name}"?`)) {
                  onDeletePOI(selectedPOI.id);
                  setSelectedPOI(null);
                }
              }}
              className="py-2.5 border border-red-200/50 hover:border-red-500/50 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold text-red-500 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
