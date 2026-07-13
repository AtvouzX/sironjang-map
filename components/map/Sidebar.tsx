'use client';

import React from 'react';
import { MapPOI, MapCategory } from '@/data/mapData';
import ApartmentOutlined from '@mui/icons-material/ApartmentOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import LocalDrinkOutlined from '@mui/icons-material/LocalDrinkOutlined';
import GrassOutlined from '@mui/icons-material/GrassOutlined';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import ReportProblemOutlined from '@mui/icons-material/ReportProblemOutlined';
import ExploreOutlined from '@mui/icons-material/ExploreOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import PaletteOutlined from '@mui/icons-material/PaletteOutlined';
import RestaurantOutlined from '@mui/icons-material/RestaurantOutlined';
import LocalMallOutlined from '@mui/icons-material/LocalMallOutlined';
import EggOutlined from '@mui/icons-material/EggOutlined';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import ParkOutlined from '@mui/icons-material/ParkOutlined';
import SpaOutlined from '@mui/icons-material/SpaOutlined';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import DirectionsBusOutlined from '@mui/icons-material/DirectionsBusOutlined';
import CabinOutlined from '@mui/icons-material/CabinOutlined';
import DirectionsWalkOutlined from '@mui/icons-material/DirectionsWalkOutlined';
import LocalCafeOutlined from '@mui/icons-material/LocalCafeOutlined';
import ChurchOutlined from '@mui/icons-material/ChurchOutlined';
import SportsSoccerOutlined from '@mui/icons-material/SportsSoccerOutlined';
import MosqueOutlined from '@mui/icons-material/MosqueOutlined';
import TempleBuddhistOutlined from '@mui/icons-material/TempleBuddhistOutlined';
import LocalFloristOutlined from '@mui/icons-material/LocalFloristOutlined';
import WhatshotOutlined from '@mui/icons-material/WhatshotOutlined';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';

import CloseOutlined from '@mui/icons-material/CloseOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import MapOutlined from '@mui/icons-material/MapOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import StorageOutlined from '@mui/icons-material/StorageOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import SlideshowOutlined from '@mui/icons-material/SlideshowOutlined';

const IconComponents: { [key: string]: React.ComponentType<any> } = {
  Building2: ApartmentOutlined as any,
  Store: StorefrontOutlined as any,
  Milk: LocalDrinkOutlined as any,
  Sprout: GrassOutlined as any,
  School: SchoolOutlined as any,
  ShieldAlert: ReportProblemOutlined as any,
  Compass: ExploreOutlined as any,
  Users: PeopleOutlined as any,
  Palette: PaletteOutlined as any,
  Utensils: RestaurantOutlined as any,
  ShoppingBag: LocalMallOutlined as any,
  Egg: EggOutlined as any,
  Shield: ShieldOutlined as any,
  Trees: ParkOutlined as any,
  Leaf: SpaOutlined as any,
  HeartPulse: FavoriteBorderOutlined as any,
  Bus: DirectionsBusOutlined as any,
  Tent: CabinOutlined as any,
  Footprints: DirectionsWalkOutlined as any,
  CupSoda: LocalCafeOutlined as any,
  Church: ChurchOutlined as any,
  Activity: SportsSoccerOutlined as any,
  Mosque: MosqueOutlined as any,
  Vihara: TempleBuddhistOutlined as any,
  Cemetery: LocalFloristOutlined as any,
  Flame: WhatshotOutlined as any,
  BookOpen: MenuBookOutlined as any,
  Heart: FavoriteBorderOutlined as any,
  MapPin: LocationOnOutlined as any
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  categories: MapCategory[];
  selectedCategories: string[];
  toggleCategory: (catId: string) => void;
  setSelectedCategories: (cats: string[]) => void;
  selectedPOI: MapPOI | null;
  handleSelectPOI: (poi: MapPOI) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredPOIs: MapPOI[];
  theme: 'light' | 'dark';
  user: any;
  onOpenLogin: () => void;
  onLogout: () => void;
  onAddCategory: () => void;
  onAddPOI: () => void;
  onAddZone: () => void;
  onEditCategory: (cat: MapCategory) => void;
  onDeleteCategory: (catId: string) => void;
  isPresentationMode: boolean;
  setIsPresentationMode: (val: boolean) => void;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  categories,
  selectedCategories,
  toggleCategory,
  setSelectedCategories,
  selectedPOI,
  handleSelectPOI,
  searchQuery,
  setSearchQuery,
  filteredPOIs,
  theme,
  user,
  onOpenLogin,
  onLogout,
  onAddCategory,
  onAddPOI,
  onAddZone,
  onEditCategory,
  onDeleteCategory,
  isPresentationMode,
  setIsPresentationMode
}: SidebarProps) {

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden select-none bg-white dark:bg-zinc-900">

      {/* Sidebar Header */}
      <div className="p-3 sm:p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 sm:p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
            <MapOutlined className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base leading-tight tracking-tight text-zinc-900 dark:text-white">Peta Pakintelan</h1>
            <p className="text-[9px] sm:text-[10px] text-zinc-550 dark:text-zinc-400 font-bold uppercase tracking-wider">Kec. Gunungpati, Semarang</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Admin Auth Toggle */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 border border-indigo-200/25">
                Admin
              </span>
              <button
                onClick={onLogout}
                className="p-1.5 sm:p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-500 hover:text-red-500 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                title="Keluar Admin"
              >
                <LogoutOutlined className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="p-1.5 sm:p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              title="Login Admin"
            >
              <LockOutlined className="w-4 h-4" />
            </button>
          )}

          <button
            className="md:hidden p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 cursor-pointer flex items-center justify-center"
            onClick={() => setSidebarOpen(false)}
          >
            <CloseOutlined className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Admin Action Dashboard Panel */}
      {user && (
        <div className="p-2 sm:p-3 border-b border-zinc-200 dark:border-zinc-800 bg-indigo-50/25 dark:bg-indigo-950/10 space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-indigo-650 dark:text-indigo-400">
            <span>Kelola Peta</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={onAddCategory}
              className="py-1 sm:py-1.5 px-1.5 sm:px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[9px] font-extrabold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <AddOutlined className="w-3 h-3" />
              Tema
            </button>
            <button
              onClick={onAddPOI}
              className="py-1 sm:py-1.5 px-1.5 sm:px-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-white rounded-xl text-[9px] font-extrabold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <AddOutlined className="w-3 h-3" />
              Lokasi
            </button>
            <button
              onClick={onAddZone}
              className="py-1 sm:py-1.5 px-1.5 sm:px-2 bg-indigo-55 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-650 dark:text-indigo-400 rounded-xl text-[9px] font-extrabold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer border border-indigo-200/25"
            >
              <AddOutlined className="w-3 h-3" />
              Zona
            </button>
          </div>

          {/* Toggle Mode Presentasi KKN */}
          <div className="flex items-center justify-between p-2 sm:p-2.5 mt-1.5 sm:mt-2 rounded-xl bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-2">
              <SlideshowOutlined className="w-4 h-4 text-indigo-650 dark:text-indigo-400" />
              <div>
                <span className="block text-[10px] sm:text-[11px] font-extrabold text-zinc-900 dark:text-white">Mode Presentasi KKN</span>
                <span className="block text-[8px] sm:text-[9px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider">Slide Presentasi</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPresentationMode(!isPresentationMode)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isPresentationMode ? 'bg-indigo-600' : 'bg-zinc-250 dark:bg-zinc-700'
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPresentationMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Thematic Indicator Checkbox Selector */}
      <div className="p-3 sm:p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/55 dark:bg-zinc-900/50">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-zinc-555 dark:text-zinc-400">Indikator Tematik</span>
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedCategories(categories.map(c => c.id))}
              className="text-[9px] sm:text-[10px] text-indigo-650 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
            >
              Semua
            </button>
            <span className="text-zinc-300 dark:text-zinc-700 text-[10px]">|</span>
            <button
              onClick={() => setSelectedCategories([])}
              className="text-[9px] sm:text-[10px] text-zinc-500 hover:underline font-bold cursor-pointer"
            >
              Bersihkan
            </button>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="p-3 sm:p-4 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
            <p className="text-[10px] sm:text-[11px] text-zinc-400">Tidak ada kategori. {user ? 'Gunakan "Tema" untuk menambah.' : 'Silakan login sebagai admin untuk membuat kategori.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
            {categories.map(cat => {
              const Icon = IconComponents[cat.icon] || ExploreOutlined;
              const isChecked = selectedCategories.includes(cat.id);
              const activeColor = cat.markerColor || '#6366f1';
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold border text-left transition-all cursor-pointer ${isChecked
                    ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-md shadow-black/5 scale-[1.02]'
                    : 'bg-white dark:bg-zinc-850 hover:bg-zinc-55 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400'
                    }`}
                >
                  <div
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border flex items-center justify-center transition-colors"
                    style={{
                      borderColor: isChecked ? 'transparent' : activeColor,
                      backgroundColor: isChecked ? (theme === 'dark' ? '#000' : '#fff') : 'transparent'
                    }}
                  >
                    {isChecked && (
                      <span
                        className="w-1.5 h-1.5 rounded-sm"
                        style={{ backgroundColor: activeColor }}
                      />
                    )}
                  </div>
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" style={{ color: isChecked ? undefined : activeColor }} />
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Context Info for Checked Themes */}
      {selectedCategories.length > 0 && (
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-955/10 max-h-36 sm:max-h-56 overflow-y-auto p-3 sm:p-4 space-y-2.5 sm:space-y-3 scrollbar-thin">
          {selectedCategories.map(catId => {
            const cat = categories.find(c => c.id === catId);
            if (!cat) return null;
            const Icon = IconComponents[cat.icon] || ExploreOutlined;
            const activeColor = cat.markerColor || '#6366f1';
            return (
              <div key={cat.id} className="p-2.5 sm:p-3 bg-white dark:bg-zinc-800 rounded-xl sm:rounded-2xl border border-zinc-150 dark:border-zinc-700 shadow-sm space-y-1.5 sm:space-y-2 animate-fade-in relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: activeColor }} />
                    <h3 className="font-bold text-[11px] sm:text-xs text-zinc-900 dark:text-white">{cat.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {user && (
                      <>
                        <button
                          onClick={() => onEditCategory(cat)}
                          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-indigo-650 rounded cursor-pointer transition-colors"
                          title="Ubah Kategori"
                        >
                          <EditOutlined className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteCategory(cat.id)}
                          className="p-1 hover:bg-red-55/15 dark:hover:bg-red-950/20 text-zinc-405 hover:text-red-500 rounded cursor-pointer transition-colors"
                          title="Hapus Kategori"
                        >
                          <DeleteOutlined className="w-3 h-3" />
                        </button>
                      </>
                    )}
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400" />
                  </div>
                </div>
                <p className="text-[10px] sm:text-[11px] text-zinc-550 dark:text-zinc-400 leading-relaxed font-semibold">
                  {cat.description}
                </p>

                {/* Stats Grid */}
                {cat.stats && cat.stats.length > 0 && (
                  <div className="grid grid-cols-3 gap-1 sm:gap-1.5 pt-0.5 sm:pt-1">
                    {cat.stats.map((stat, i) => (
                      <div key={i} className="p-1 sm:p-1.5 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-100 dark:border-zinc-850 text-center">
                        <span className="block text-[8px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-bold truncate">{stat.label}</span>
                        <span className="block text-[9px] sm:text-[10px] font-extrabold mt-0.5 truncate">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Search POIs */}
      <div className="p-2 sm:p-3">
        <div className="relative">
          <SearchOutlined className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari lokasi di tema aktif..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 sm:pl-9 pr-8 sm:pr-9 py-1.5 sm:py-2 bg-zinc-100 dark:bg-zinc-955 border border-zinc-200/50 dark:border-zinc-800 rounded-xl text-[11px] sm:text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder-zinc-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 dark:hover:text-white flex items-center justify-center animate-fade-in cursor-pointer"
            >
              <CloseOutlined className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>


      {/* POIs Directory List */}
      <div className="flex-1 overflow-y-auto px-2.5 sm:px-3 pb-3 sm:pb-4 space-y-1 sm:space-y-1.5 scrollbar-thin">
        <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-450 px-1 sm:px-1.5 mb-1 flex items-center justify-between">
          <span>Daftar Lokasi</span>
          <span className="text-[8px] sm:text-[9px] text-zinc-400 bg-zinc-100 dark:bg-zinc-950 px-1.5 py-0.5 rounded-full">{filteredPOIs.length} POI</span>
        </div>

        {filteredPOIs.length === 0 ? (
          <div className="py-6 px-4 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/20 dark:bg-zinc-950/10">
            <p className="text-xs text-zinc-450">Tidak ada lokasi ditemukan.</p>
          </div>
        ) : (
          filteredPOIs.map(poi => {
            const cat = categories.find(c => c.id === poi.category);
            const activeColor = cat?.markerColor || '#6366f1';
            const PoiIcon = IconComponents[poi.icon || 'MapPin'] || LocationOnOutlined;
            const isSelected = selectedPOI?.id === poi.id;

            return (
              <div
                key={poi.id}
                onClick={() => handleSelectPOI(poi)}
                className={`group flex items-start gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl cursor-pointer border transition-all ${isSelected
                  ? 'bg-zinc-100/85 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 shadow-sm scale-[0.99]'
                  : 'bg-white dark:bg-zinc-850 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/30'
                  }`}
              >
                <div
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-white mt-0.5 shadow-sm shadow-black/10 group-hover:scale-105 transition-transform flex items-center justify-center"
                  style={{ backgroundColor: activeColor }}
                >
                  <PoiIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm truncate leading-tight text-zinc-900 dark:text-white">{poi.name}</h3>
                  <p className="text-[11px] sm:text-xs text-zinc-550 dark:text-zinc-400 mt-0.5 sm:mt-1 line-clamp-2 leading-relaxed font-semibold">
                    {poi.description}
                  </p>
                </div>
                <ChevronRightOutlined className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 self-center group-hover:translate-x-0.5 transition-transform animate-pulse" />
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
      <aside className={`hidden md:flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 z-20 ${mounted ? 'transition-all duration-300' : ''
        } ${sidebarOpen ? 'w-[380px] opacity-100' : 'w-0 opacity-0 overflow-hidden border-r-0'
        }`}>
        {sidebarContent}
      </aside>

      {/* 1B. MOBILE SIDEBAR */}
      <aside className={`md:hidden fixed top-0 left-0 h-full w-full sm:w-[380px] z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-r border-zinc-200 dark:border-zinc-800 flex flex-col ${mounted ? 'transition-transform duration-300' : ''
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {sidebarContent}
      </aside>
    </>
  );
}
