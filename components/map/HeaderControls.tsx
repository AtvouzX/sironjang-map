'use client';

import React from 'react';
import MenuOutlined from '@mui/icons-material/MenuOutlined';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import SquareFootOutlined from '@mui/icons-material/SquareFootOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import OpenInNewOutlined from '@mui/icons-material/OpenInNewOutlined';
import { MapCategory } from '@/data/mapData';

interface HeaderControlsProps {
  isEmbed?: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  categories: MapCategory[];
  selectedCategories: string[];
  toggleCategory: (catId: string) => void;
  setSelectedCategories: (cats: string[]) => void;
  themeDropdownOpen: boolean;
  setThemeDropdownOpen: (open: boolean) => void;
  layersDropdownOpen: boolean;
  setLayersDropdownOpen: (open: boolean) => void;
  themeDropdownRef: React.RefObject<HTMLDivElement | null>;
  layersDropdownRef: React.RefObject<HTMLDivElement | null>;
  isMeasuring: boolean;
  setIsMeasuring: (m: boolean) => void;
  handleClearMeasure: () => void;
  baseLayer: 'street' | 'dark' | 'satellite';
  setBaseLayer: (layer: 'street' | 'dark' | 'satellite') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  showGeojsonLayer: boolean;
  setShowGeojsonLayer: (show: boolean) => void;
}

export default function HeaderControls({
  isEmbed = false,
  sidebarOpen,
  setSidebarOpen,
  categories,
  selectedCategories,
  toggleCategory,
  setSelectedCategories,
  themeDropdownOpen,
  setThemeDropdownOpen,
  layersDropdownOpen,
  setLayersDropdownOpen,
  themeDropdownRef,
  layersDropdownRef,
  isMeasuring,
  setIsMeasuring,
  handleClearMeasure,
  baseLayer,
  setBaseLayer,
  theme,
  setTheme,
  showGeojsonLayer,
  setShowGeojsonLayer
}: HeaderControlsProps) {
  return (
    <header className={`absolute z-40 flex items-center justify-between gap-1.5 sm:gap-3 pointer-events-none select-none ${
      isEmbed 
        ? 'top-1.5 left-1.5 right-1.5 sm:top-3 sm:left-3 sm:right-3' 
        : 'top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4'
    }`}>
      {/* Collapse/Reopen Sidebar button */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {!isEmbed && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl hover:bg-zinc-50 dark:hover:bg-zinc-855 text-zinc-705 dark:text-zinc-200 flex items-center justify-center transition-all cursor-pointer"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? <ChevronLeftOutlined className="w-5 h-5" /> : <MenuOutlined className="w-5 h-5" />}
          </button>
        )}

        {/* Current Thematic indicator (when sidebar closed) */}
        {!sidebarOpen && (
          <div ref={themeDropdownRef} className="relative pointer-events-auto">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className={`bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-855 transition-all cursor-pointer ${
                isEmbed ? 'px-2 py-1.5 text-[9px] sm:px-3.5 sm:py-2' : 'px-2.5 py-2 sm:px-4 sm:py-2.5'
              }`}
            >
              <div className="flex -space-x-1 items-center">
                {selectedCategories.length === 0 ? (
                  <span className={`rounded-full bg-zinc-400 ${isEmbed ? 'w-2 h-2' : 'w-2.5 h-2.5'}`} />
                ) : (
                  selectedCategories.slice(0, 3).map(catId => {
                    const cat = categories.find(c => c.id === catId);
                    return (
                      <span
                        key={catId}
                        className={`rounded-full border border-white dark:border-zinc-900 ${isEmbed ? 'w-2 h-2' : 'w-2.5 h-2.5'}`}
                        style={{ backgroundColor: cat?.markerColor || '#ccc' }}
                      />
                    );
                  })
                )}
              </div>
              <span className={`font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 inline-block max-w-[60px] sm:max-w-[180px] truncate align-middle ${
                isEmbed ? 'text-[9px] sm:text-xs' : 'text-[10px] sm:text-xs'
              }`}>
                {selectedCategories.length === 0
                  ? 'Peta Dasar'
                  : selectedCategories.length === 1
                    ? categories.find(c => c.id === selectedCategories[0])?.name
                    : `${selectedCategories.length} Tema Aktif`
                }
              </span>
              <KeyboardArrowDownOutlined className={`text-zinc-500 ${isEmbed ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
            </button>

            {/* Thematic Indicator Dropdown Menu */}
            <div className={`absolute left-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-3 w-56 flex-col space-y-2 transition-all z-50 ${themeDropdownOpen ? 'flex' : 'hidden'} ${
              isEmbed ? 'top-9 sm:top-11' : 'top-12'
            }`}>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-1 flex justify-between items-center mb-1">
                <span>Indikator Tematik</span>
                <div className="flex gap-1.5 font-bold">
                  <button
                    onClick={() => setSelectedCategories(categories.map(c => c.id))}
                    className="text-[9px] text-indigo-650 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Semua
                  </button>
                  <span className="text-zinc-350 dark:text-zinc-700 text-[9px]">|</span>
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="text-[9px] text-zinc-500 hover:underline cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>

              {categories.length === 0 ? (
                <p className="text-[10px] text-zinc-400 italic p-2 text-center">Belum ada kategori aktif.</p>
              ) : (
                <div className="space-y-1">
                  {categories.map(cat => {
                    const isChecked = selectedCategories.includes(cat.id);
                    const activeColor = cat.markerColor || '#609966';
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xl text-xs transition-colors text-left cursor-pointer ${isChecked
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold'
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors"
                          style={{
                            borderColor: activeColor,
                            backgroundColor: isChecked ? activeColor : 'transparent'
                          }}
                        >
                          {isChecked && <span className="w-1.5 h-1.5 rounded-sm bg-white dark:bg-zinc-900" />}
                        </span>
                        <span className="truncate">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Tools Panel */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {isEmbed && (
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg flex items-center gap-1 text-xs font-bold transition-all cursor-pointer border border-indigo-700 ${
              isEmbed ? 'px-2.5 py-1.5 sm:px-3 sm:py-2' : 'px-3.5 py-2.5'
            }`}
            title="Buka Peta Penuh"
          >
            <OpenInNewOutlined className={isEmbed ? 'w-4 h-4' : 'w-4.5 h-4.5'} />
            <span className="hidden sm:inline">Buka Peta Penuh</span>
          </a>
        )}

        {/* Measuring Tool Toggle */}
        <button
          onClick={() => {
            setIsMeasuring(!isMeasuring);
            handleClearMeasure();
          }}
          className={`rounded-xl border items-center justify-center shadow-lg transition-all cursor-pointer ${isMeasuring
            ? 'bg-indigo-600 border-indigo-700 text-white ring-4 ring-indigo-500/20'
            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-855'
            } ${
              isEmbed ? 'hidden sm:flex p-1.5' : 'flex p-2.5'
            }`}
          title="Ukur Jarak Antar Titik"
        >
          <SquareFootOutlined className={isEmbed ? 'w-4 h-4' : 'w-4.5 h-4.5'} />
        </button>

        {/* Layer style selector */}
        <div ref={layersDropdownRef} className="relative">
          <button
            onClick={() => setLayersDropdownOpen(!layersDropdownOpen)}
            className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg text-zinc-705 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-855 flex items-center justify-center cursor-pointer ${
              isEmbed ? 'p-1.5' : 'p-2.5'
            }`}
            title="Pilih Style Peta"
          >
            <LayersOutlined className={isEmbed ? 'w-4 h-4' : 'w-4.5 h-4.5'} />
          </button>

          <div className={`absolute right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 w-48 flex-col space-y-1 transition-all z-50 ${layersDropdownOpen ? 'flex' : 'hidden'} ${
            isEmbed ? 'top-9 sm:top-11' : 'top-12'
          }`}>
            <div className="text-[9px] font-bold uppercase text-zinc-400 dark:text-zinc-500 px-2 py-0.5 border-b border-zinc-100 dark:border-zinc-800 mb-1">Peta Dasar</div>
            <button
              onClick={() => {
                setBaseLayer('street');
                setLayersDropdownOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${baseLayer === 'street' ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-650 dark:text-indigo-400 font-bold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-400'}`}
            >
              Peta Jalan
            </button>
            <button
              onClick={() => {
                setBaseLayer('satellite');
                setLayersDropdownOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${baseLayer === 'satellite' ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-655 dark:text-zinc-400'}`}
            >
              Peta Satelit
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
