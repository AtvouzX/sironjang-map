'use client';

import React from 'react';
import {
  Building2, Store, Milk, Sprout, School, ShieldAlert, Compass,
  Users, Palette, Utensils, ShoppingBag, Egg, Shield, Trees,
  Leaf, HeartPulse, Bus, Tent, Footprints, CupSoda,
  Ruler, MapPin, X, Layers, Search,
  RefreshCw, Navigation, Menu, ChevronRight, ChevronLeft, Map as MapIcon,
  Info, ChevronDown
} from 'lucide-react';
import { MAP_CATEGORIES, MapPOI, MapCategory } from '@/data/mapData';

const IconComponents: { [key: string]: React.ComponentType<any> } = {
  Building2, Store, Milk, Sprout, School, ShieldAlert, Compass,
  Users, Palette, Utensils, ShoppingBag, Egg, Shield, Trees,
  Leaf, HeartPulse, Bus, Tent, Footprints, CupSoda
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedCategories: MapCategory['id'][];
  toggleCategory: (catId: MapCategory['id']) => void;
  setSelectedCategories: (cats: MapCategory['id'][]) => void;
  selectedPOI: MapPOI | null;
  handleSelectPOI: (poi: MapPOI) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredPOIs: MapPOI[];
  theme: 'light' | 'dark';
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  selectedCategories,
  toggleCategory,
  setSelectedCategories,
  selectedPOI,
  handleSelectPOI,
  searchQuery,
  setSearchQuery,
  filteredPOIs,
  theme
}: SidebarProps) {
  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
            <MapIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">Peta Pakintelan</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Kec. Gunungpati, Semarang</p>
          </div>
        </div>
        <button
          className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Thematic Indicator Checkbox Selector */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/55 dark:bg-zinc-900/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Indikator Tematik</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategories(MAP_CATEGORIES.map(c => c.id))}
              className="text-[10px] text-indigo-650 dark:text-indigo-400 hover:underline font-bold"
            >
              Semua
            </button>
            <span className="text-zinc-300 dark:text-zinc-700 text-[10px]">|</span>
            <button
              onClick={() => setSelectedCategories([])}
              className="text-[10px] text-zinc-500 hover:underline font-bold"
            >
              Bersihkan
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {MAP_CATEGORIES.map(cat => {
            const Icon = IconComponents[cat.icon] || Compass;
            const isChecked = selectedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${isChecked
                  ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-md shadow-black/5 scale-[1.02]'
                  : 'bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                  }`}
              >
                <div
                  className="w-4 h-4 rounded border flex items-center justify-center transition-colors"
                  style={{
                    borderColor: isChecked ? 'transparent' : cat.markerColor,
                    backgroundColor: isChecked ? (theme === 'dark' ? '#000' : '#fff') : 'transparent'
                  }}
                >
                  {isChecked && (
                    <span
                      className="w-2 h-2 rounded-sm"
                      style={{ backgroundColor: cat.markerColor }}
                    />
                  )}
                </div>
                <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isChecked ? undefined : cat.markerColor }} />
                <span className="truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Context Info for Checked Themes */}
      {selectedCategories.length > 0 && (
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 max-h-56 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {selectedCategories.map(catId => {
            const cat = MAP_CATEGORIES.find(c => c.id === catId);
            if (!cat) return null;
            const Icon = IconComponents[cat.icon] || Compass;
            return (
              <div key={cat.id} className="p-3 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-150 dark:border-zinc-700 shadow-sm space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.markerColor }} />
                    <h3 className="font-bold text-xs">{cat.name}</h3>
                  </div>
                  <Icon className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <p className="text-[11px] text-zinc-550 dark:text-zinc-400 leading-relaxed">
                  {cat.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {cat.stats.map((stat, i) => (
                    <div key={i} className="p-1.5 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center">
                      <span className="block text-[8px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-bold truncate">{stat.label}</span>
                      <span className="block text-[10px] font-extrabold mt-0.5 truncate">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Search POIs */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari lokasi di tema aktif..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder-zinc-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* POIs Directory List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1.5 mb-1 flex items-center justify-between">
          <span>Daftar Lokasi</span>
          <span>{filteredPOIs.length} Lokasi</span>
        </div>

        {filteredPOIs.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-950/20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <Info className="w-6.5 h-6.5 mx-auto mb-2 text-zinc-400" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Tidak ada lokasi ditemukan</p>
          </div>
        ) : (
          filteredPOIs.map(poi => {
            const PoiIcon = IconComponents[poi.icon] || Compass;
            const isSelected = selectedPOI?.id === poi.id;
            const poiCategoryConfig = MAP_CATEGORIES.find(c => c.id === poi.category) || MAP_CATEGORIES[0];
            return (
              <div
                key={poi.id}
                onClick={() => handleSelectPOI(poi)}
                className={`group flex items-start gap-3 p-3 rounded-2xl cursor-pointer border transition-all ${isSelected
                  ? 'bg-zinc-100/80 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 shadow-sm scale-[0.99]'
                  : 'bg-white dark:bg-zinc-850 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/30'
                  }`}
              >
                <div
                  className="p-2.5 rounded-xl text-white mt-0.5 shadow-sm shadow-black/10 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: poiCategoryConfig.markerColor }}
                >
                  <PoiIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate leading-tight">{poi.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-medium">
                    {poi.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 self-center group-hover:translate-x-0.5 transition-transform" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* 1A. DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 z-20 ${
        mounted ? 'transition-all duration-300' : ''
      } ${sidebarOpen ? 'w-[380px] opacity-100' : 'w-0 opacity-0 overflow-hidden border-r-0'
        }`}>
        {sidebarContent}
      </aside>

      {/* 1B. MOBILE SIDEBAR */}
      <aside className={`md:hidden fixed top-0 left-0 h-full w-full sm:w-[380px] z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-r border-zinc-200 dark:border-zinc-800 flex flex-col ${
        mounted ? 'transition-transform duration-300' : ''
      } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {sidebarContent}
      </aside>
    </>
  );
}
