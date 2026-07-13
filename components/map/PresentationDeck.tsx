'use client';

import React, { useState, useEffect } from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import PlayArrowOutlined from '@mui/icons-material/PlayArrowOutlined';
import ApartmentOutlined from '@mui/icons-material/ApartmentOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import MapOutlined from '@mui/icons-material/MapOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import OpenInFullOutlined from '@mui/icons-material/OpenInFullOutlined';
import MinimizeOutlined from '@mui/icons-material/MinimizeOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import SquareFootOutlined from '@mui/icons-material/SquareFootOutlined';
import AddCircleOutlineOutlined from '@mui/icons-material/AddCircleOutlineOutlined';
import AddLocationAltOutlined from '@mui/icons-material/AddLocationAltOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';

import { MapPOI, MapCategory } from '@/data/mapData';
import L from 'leaflet';

interface PresentationDeckProps {
  onClose: () => void;
  categories: MapCategory[];
  pois: MapPOI[];
  map: L.Map | null;
  setSelectedCategories: (cats: string[]) => void;
  handleSelectPOI: (poi: MapPOI) => void;
  clearSelectPOI: () => void;
  setBaseLayer: (style: 'street' | 'dark' | 'satellite') => void;
  setIsMeasuring: (val: boolean) => void;
  handleClearMeasure: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  onAddCategory: () => void;
  onAddPOI: () => void;
  onAddZone: () => void;
  setThemeDropdownOpen?: (val: boolean) => void;
  setLayersDropdownOpen?: (val: boolean) => void;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  bulletPoints: string[];
  icon: React.ComponentType<any>;
  themeId?: string;
  poiId?: string;
  fallbackCoords?: [number, number];
  actionLabel?: string;
}

export default function PresentationDeck({
  onClose,
  categories,
  pois,
  map,
  setSelectedCategories,
  handleSelectPOI,
  clearSelectPOI,
  setBaseLayer,
  setIsMeasuring,
  handleClearMeasure,
  sidebarOpen,
  setSidebarOpen,
  onAddCategory,
  onAddPOI,
  onAddZone,
  setThemeDropdownOpen,
  setLayersDropdownOpen
}: PresentationDeckProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  // Slides definition (covers basic usage + admin controls + data addition)
  const slides: Slide[] = [
    {
      id: 1,
      title: "Peta Tematik Pakintelan",
      subtitle: "Panduan Penggunaan Sistem Informasi Geografis",
      description: "Selamat datang di Peta Tematik Interaktif Kelurahan Pakintelan. Slide interaktif ini akan mendemonstrasikan fitur-fitur peta serta cara menggunakannya.",
      bulletPoints: [
        "Peta interaktif ini memvisualisasikan data wilayah secara spasial.",
        "Pelajari fungsi kontrol navigasi, filter tema, dan alat ukur.",
        "Kamera dan opsi peta akan bergerak otomatis mengikuti perpindahan slide."
      ],
      icon: MapOutlined
    },
    {
      id: 2,
      title: "1. Navigasi Dasar & Basemap",
      subtitle: "Menggeser, Memperbesar & Mengubah Lapisan",
      description: "Anda dapat memindahkan kamera peta dan mengubah gaya peta dasar (basemap) sesuai kebutuhan visual.",
      bulletPoints: [
        "Navigasi Kamera: Geser (drag) peta dengan mouse/jari. Klik tombol +/- di kanan bawah untuk mengatur perbesaran.",
        "Ganti Basemap: Klik tombol dengan ikon Lapisan di kanan atas untuk beralih antara Peta Jalan atau Citra Satelit.",
        "Klik Tombol Aksi di bawah untuk melihat simulasi tampilan Satelit."
      ],
      icon: LayersOutlined as any,
      actionLabel: "Aktifkan Citra Satelit"
    },
    {
      id: 3,
      title: "2. Memfilter Tema Tematik",
      subtitle: "Menampilkan Informasi Sektoral Desa",
      description: "Panel 'Indikator Tematik' di sidebar kiri digunakan untuk menyaring jenis data lokasi yang ingin ditampilkan.",
      bulletPoints: [
        "Centang pilihan kategori (Pemerintahan, UMKM, atau Fasilitas Umum) untuk memunculkan marker lokasi di layar.",
        "Klik tombol 'Semua' atau 'Bersihkan' untuk menyaring data secara cepat.",
        "Klik ikon kategori di sidebar untuk membaca deskripsi dan statistik singkat."
      ],
      icon: StorefrontOutlined,
      themeId: 'umkm',
      actionLabel: "Tampilkan Tema UMKM"
    },
    {
      id: 4,
      title: "3. Membaca Rincian Informasi",
      subtitle: "Menampilkan Detail Titik Penting (POI)",
      description: "Setiap penanda lokasi di peta memuat informasi terperinci yang dapat dibuka dengan mudah.",
      bulletPoints: [
        "Klik marker di peta atau pilih nama lokasi dari daftar di sidebar.",
        "Details Card di kanan layar (atau Drawer di bawah pada HP) akan terbuka.",
        "Rincian memuat deskripsi, alamat, kontak, website, hingga rating tempat.",
        "Klik link telepon atau website untuk terhubung langsung."
      ],
      icon: ApartmentOutlined,
      themeId: 'pemerintahan',
      poiId: 'way/505824314',
      fallbackCoords: [-7.09203, 110.39348],
      actionLabel: "Simulasi Pilih Lokasi"
    },
    {
      id: 5,
      title: "4. Menggunakan Alat Ukur Jarak",
      subtitle: "Mengukur Jarak Udara Secara Presisi",
      description: "Peta dilengkapi alat ukur untuk mengetahui jarak antar-titik secara real-time demi kemudahan perencanaan wilayah.",
      bulletPoints: [
        "Klik ikon Penggaris (Ukur Jarak) pada menu kontrol atas untuk mengaktifkan.",
        "Klik beberapa lokasi berurutan pada peta untuk membuat rute garis ukur.",
        "Total jarak terhitung akan langsung melayang di atas titik terakhir.",
        "Klik 'Hapus Garis Ukur' di sidebar untuk membersihkan pengukuran."
      ],
      icon: SquareFootOutlined as any,
      actionLabel: "Aktifkan Pengukur Jarak"
    },
    {
      id: 6,
      title: "5. Portal Admin & CMS Mandiri",
      subtitle: "Kemudahan Pembaruan Data Secara Dinamis",
      description: "Agar peta tetap mutakhir setelah program KKN selesai, sistem ini dilengkapi portal pengelolaan data mandiri.",
      bulletPoints: [
        "Klik tombol Gembok (Login Admin) di kanan atas sidebar untuk masuk.",
        "Setelah login, tombol manajemen 'Tema', 'Lokasi', dan 'Zona' akan muncul.",
        "Admin dapat menambah data lokasi, menggambar poligon zona, atau mengedit data langsung."
      ],
      icon: SettingsOutlined,
      actionLabel: "Tunjukkan Menu Admin"
    },
    {
      id: 7,
      title: "6. Menambah Tema / Kategori Baru",
      subtitle: "Mengelompokkan Sektor Informasi Peta",
      description: "Admin dapat mendaftarkan tema/kategori peta baru secara mandiri melalui formulir interaktif di aplikasi.",
      bulletPoints: [
        "Klik tombol '+ Tema' di panel Kelola Peta sidebar kiri.",
        "Isi nama kategori baru (contoh: 'Pertanian' atau 'Wisata').",
        "Pilih ikon visual penanda, warna marker, serta tulis deskripsi ringkas tema.",
        "Simpan untuk mendaftarkannya secara otomatis ke database."
      ],
      icon: CategoryOutlined,
      actionLabel: "Buka Formulir Tambah Tema"
    },
    {
      id: 8,
      title: "7. Menambahkan Lokasi (POI) Baru",
      subtitle: "Menandai Potensi Baru pada Peta",
      description: "Titik lokasi baru dapat ditambahkan secara dinamis lengkap dengan koordinat spasial yang diambil dari peta.",
      bulletPoints: [
        "Klik tombol '+ Lokasi' di panel kelola peta sidebar.",
        "Klik 'Pilih dari Peta' lalu klik titik mana saja di peta untuk mengambil koordinat secara instan.",
        "Pilih kategori tema, isi nama lokasi, deskripsi, serta detail atribut tambahan.",
        "Simpan untuk langsung memunculkan marker baru di atas peta."
      ],
      icon: AddLocationAltOutlined,
      actionLabel: "Buka Formulir Tambah Lokasi"
    },
    {
      id: 9,
      title: "8. Menggambar Poligon Zona Baru",
      subtitle: "Visualisasi Pembagian Batas Wilayah",
      description: "Admin dapat menggambar poligon berwarna di atas peta untuk memvisualisasikan area khusus, batas RT/RW, atau zona UMKM.",
      bulletPoints: [
        "Klik tombol '+ Zona' di panel kelola peta sidebar.",
        "Klik beberapa titik berurutan di layar peta untuk membentuk poligon tertutup.",
        "Tentukan warna garis/area zona serta berikan nama wilayah.",
        "Simpan untuk mengunci gambar zona di atas peta secara permanen."
      ],
      icon: AddCircleOutlineOutlined,
      actionLabel: "Buka Formulir Tambah Zona"
    },
    {
      id: 10,
      title: "Serah Terima & Penutup",
      subtitle: "Terima Kasih!",
      description: "Peta Tematik interaktif ini diserahkan sepenuhnya untuk membantu layanan desa.",
      bulletPoints: [
        "Mendukung digitalisasi administrasi dan publikasi data potensi kelurahan secara modern.",
        "Meningkatkan literasi digital dan spasial bagi jajaran perangkat Kelurahan Pakintelan.",
        "Menjamin keberlanjutan data melalui fitur pembaruan mandiri di Portal Admin CMS.",
        "Menyediakan rujukan data spasial dasar untuk perumusan kebijakan pembangunan desa."
      ],
      icon: CheckCircleOutlined
    }
  ];

  const totalSlides = slides.length;
  const currentSlideData = slides[currentSlide];
  const SlideIcon = currentSlideData.icon;

  // Run map action automatically on slide enter
  useEffect(() => {
    runMapAction(currentSlideData);
  }, [currentSlide]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setBaseLayer('street');
      setIsMeasuring(false);
      handleClearMeasure();
      setSidebarOpen(true);
      clearSelectPOI();
      if (setThemeDropdownOpen) {
        setThemeDropdownOpen(false);
      }
      if (setLayersDropdownOpen) {
        setLayersDropdownOpen(false);
      }
      if (categories.length > 0) {
        setSelectedCategories([categories[0].id]);
      }
    };
  }, [categories]);

  const flyToIfNeeded = (targetLatLng: [number, number], targetZoom: number) => {
    if (!map) return;
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();

    const latDiff = Math.abs(currentCenter.lat - targetLatLng[0]);
    const lngDiff = Math.abs(currentCenter.lng - targetLatLng[1]);
    const zoomDiff = Math.abs(currentZoom - targetZoom);

    // If difference is negligible, do not animate
    if (latDiff < 0.0002 && lngDiff < 0.0002 && zoomDiff < 0.2) {
      return;
    }

    map.flyTo(targetLatLng, targetZoom, { animate: true, duration: 1.2 });
  };

  const runMapAction = (slide: Slide) => {
    if (!map) return;

    // Reset temporary states on slide change
    setIsMeasuring(false);
    handleClearMeasure();
    if (setThemeDropdownOpen) {
      setThemeDropdownOpen(false);
    }
    if (setLayersDropdownOpen) {
      setLayersDropdownOpen(false);
    }
    if (slide.id !== 4) {
      clearSelectPOI();
    }

    // Custom action routing per slide ID
    switch (slide.id) {
      case 1:
        // Welcome: street view, centered, close sidebar on cover
        setSidebarOpen(false);
        setBaseLayer('street');
        if (categories.length > 0) {
          setSelectedCategories([categories[0].id]);
        }
        flyToIfNeeded([-7.09203, 110.39348], 15);
        break;

      case 2:
        // Navigasi: satellite style (set automatically as street, layers dropdown closed)
        setSidebarOpen(false);
        setBaseLayer('street');
        if (setLayersDropdownOpen) {
          setLayersDropdownOpen(false);
        }
        flyToIfNeeded([-7.09203, 110.39348], 15);
        break;

      case 3:
        // Theme Filter: Toggle UMKM theme, show street via header controls
        setSidebarOpen(false);
        if (setThemeDropdownOpen) {
          setThemeDropdownOpen(true);
        }
        setBaseLayer('street');
        setSelectedCategories(['umkm']);
        flyToIfNeeded([-7.09203, 110.39348], 15);
        break;

      case 4:
        // Details: close sidebar so details card has full visibility
        setSidebarOpen(false);
        setBaseLayer('street');
        setSelectedCategories(['pemerintahan']);
        flyToIfNeeded([-7.09203, 110.39348], 15.5);
        break;

      case 5:
        // Measuring: activate measurement state
        setSidebarOpen(false);
        setBaseLayer('street');
        setIsMeasuring(true);
        flyToIfNeeded([-7.09203, 110.39348], 16);
        break;

      case 6:
        // Admin menu: pulse admin panel in Sidebar
        setSidebarOpen(true);
        setBaseLayer('street');
        flyToIfNeeded([-7.09203, 110.39348], 15);
        setTimeout(() => {
          const adminPanel = document.querySelector('.bg-indigo-50\\/25');
          if (adminPanel) {
            adminPanel.classList.add('animate-pulse', 'ring-2', 'ring-indigo-500');
            setTimeout(() => {
              adminPanel.classList.remove('animate-pulse', 'ring-2', 'ring-indigo-500');
            }, 3000);
          }
        }, 300);
        break;

      case 7:
        // Add Category: Only zoom/focus, DO NOT trigger category modal automatically
        setSidebarOpen(true);
        setBaseLayer('street');
        flyToIfNeeded([-7.09203, 110.39348], 15);
        break;

      case 8:
        // Add POI: Only zoom/focus, DO NOT trigger POI modal automatically
        setSidebarOpen(true);
        setBaseLayer('street');
        flyToIfNeeded([-7.09203, 110.39348], 15.5);
        break;

      case 9:
        // Add Zone: Only zoom/focus, DO NOT trigger Zone modal automatically
        setSidebarOpen(true);
        setBaseLayer('street');
        flyToIfNeeded([-7.09203, 110.39348], 15.5);
        break;

      case 10:
        // Closing: show all categories, close sidebar and detail
        setSidebarOpen(false);
        clearSelectPOI();
        setBaseLayer('street');
        if (categories.length > 0) {
          setSelectedCategories(categories.map(c => c.id));
        }
        flyToIfNeeded([-7.09203, 110.39348], 15);
        break;

      default:
        break;
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleButtonClick = () => {
    if (!map) return;

    // First trigger base map actions (toggling layers, flyTo, etc.)
    runMapAction(currentSlideData);

    // Then trigger the modal open triggers / selection manually
    switch (currentSlideData.id) {
      case 2:
        // Navigasi: satellite style action
        // Open layerdropdown in header and change map to satellite
        if (setLayersDropdownOpen) {
          setLayersDropdownOpen(true);
        }
        setBaseLayer('satellite');
        break;
      case 4:
        // Details Card selection
        const foundPoi = pois.find(p => p.id === 'way/505824314');
        if (foundPoi) {
          handleSelectPOI(foundPoi);
        }
        break;
      case 7:
        onAddCategory();
        break;
      case 8:
        onAddPOI();
        break;
      case 9:
        onAddZone();
        break;
      default:
        break;
    }
  };

  // Minimized component rendering (retains compact size at bottom-right/left)
  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 inset-x-4 md:inset-x-auto md:bottom-6 z-[60] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl p-3 flex items-center gap-3 animate-fade-in select-none max-w-sm md:w-auto md:max-w-none ${currentSlide === 3 ? 'md:left-6' : 'md:right-6'
        }`}>
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
          <SlideIcon className="w-4 h-4 animate-bounce" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white truncate">Slide {currentSlide + 1}: {currentSlideData.title}</h4>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider">Tutorial Peta</p>
        </div>
        <div className="flex items-center gap-1">
          {currentSlideData.actionLabel && (
            <button
              onClick={handleButtonClick}
              className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 rounded-lg transition-colors cursor-pointer"
              title="Coba Aksi"
            >
              <PlayArrowOutlined className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 disabled:opacity-30 rounded cursor-pointer"
          >
            <ChevronLeftOutlined className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-500 rounded cursor-pointer"
          >
            <ChevronRightOutlined className="w-4 h-4" />
          </button>
          <span className="text-zinc-300 dark:text-zinc-700 text-xs px-0.5">|</span>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 rounded-lg cursor-pointer"
            title="Perbesar Slide"
          >
            <OpenInFullOutlined className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Card element content container
  const cardContent = (
    <div
      className={currentSlide === 0 || currentSlide === totalSlides - 1
        ? "relative max-w-xl md:max-w-2xl w-full bg-white/98 dark:bg-zinc-900/98 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl overflow-hidden flex flex-col select-none animate-scale-in max-h-[90vh] sm:max-h-[85vh]"
        : currentSlide === 3
          ? "fixed bottom-4 inset-x-4 md:inset-x-auto md:bottom-6 md:left-6 z-[60] w-auto md:w-[calc(100vw-2rem)] md:max-w-sm md:sm:max-w-md bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl overflow-hidden flex flex-col select-none animate-slide-in max-h-[85vh] sm:max-h-[75vh]"
          : "fixed bottom-4 inset-x-4 md:inset-x-auto md:bottom-6 md:right-6 z-[60] w-auto md:w-[calc(100vw-2rem)] md:max-w-sm md:sm:max-w-md bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl overflow-hidden flex flex-col select-none animate-slide-in max-h-[85vh] sm:max-h-[75vh]"
      }
      onClick={(e) => e.stopPropagation()}
    >

      {/* Slide Top Decorative Banner */}
      <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 w-full relative">
        <div
          className="h-full bg-gradient-to-r from-indigo-550 via-indigo-600 to-indigo-750 transition-all duration-500 ease-out"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Slide Header */}
      <div className="p-4 md:p-5 border-b border-zinc-100 dark:border-zinc-800/70 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 border border-indigo-200/20 uppercase tracking-wider">
            {currentSlide === 0 ? "Tutorial Peta Interaktif" : "Panduan Fitur"}
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-550 font-extrabold uppercase">
            Slide {currentSlide + 1} dari {totalSlides}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-300 rounded-lg transition-colors cursor-pointer"
            title="Kecilkan (Tetap jalankan demo peta)"
          >
            <MinimizeOutlined className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
            title="Keluar Presentasi"
          >
            <CloseOutlined className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Content Body */}
      <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto space-y-4 sm:space-y-5 scrollbar-thin">

        {/* Main Info */}
        <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
          <div className="p-2.5 sm:p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center shadow-inner">
            <SlideIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </div>
          <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5 min-w-0">
            <h2 className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
              {currentSlideData.title}
            </h2>
            <h3 className="text-[10px] sm:text-xs md:text-sm font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">
              {currentSlideData.subtitle}
            </h3>
          </div>
        </div>

        {/* Long Description */}
        <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">
          {currentSlideData.description}
        </p>

        {/* COVER STUDENT PROFILE BOX (Shown only on Slide 1) */}
        {currentSlide === 0 && (
          <div className="bg-indigo-50/30 dark:bg-indigo-950/15 border border-indigo-150/20 dark:border-indigo-900/35 rounded-2xl p-3.5 sm:p-5 text-center space-y-2 sm:space-y-2.5 shadow-sm">
            <span className="block text-[8px] sm:text-[9px] uppercase tracking-widest font-black text-indigo-650 dark:text-indigo-400">
              Penyusun / Pelaksana Program KKNT
            </span>
            <h4 className="text-sm sm:text-base md:text-lg font-black text-zinc-900 dark:text-white tracking-tight">
              FAIZ ABDUL HANIF
            </h4>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 text-[10px] sm:text-xs text-zinc-650 dark:text-zinc-400 font-bold">
              <span>Teknik Komputer</span>
              <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
              <span>Universitas Diponegoro</span>
            </div>
            <div className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-indigo-100/50 dark:bg-indigo-950/60 rounded-full text-[8px] sm:text-[9px] font-extrabold text-indigo-650 dark:text-indigo-400 border border-indigo-200/20 uppercase tracking-wider">
              KKNT UNDIP TIM II IDBU-38 2026
            </div>
          </div>
        )}        {/* CLOSING PROGRAM HANDOVER BOX (Shown only on Slide 10) */}
        {currentSlide === totalSlides - 1 && (
          <div className="bg-emerald-50/30 dark:bg-emerald-950/15 border border-emerald-150/20 dark:border-emerald-900/35 rounded-2xl p-3.5 sm:p-5 text-center space-y-2 sm:space-y-2.5 shadow-sm">
            <span className="block text-[8px] sm:text-[9px] uppercase tracking-widest font-black text-emerald-650 dark:text-emerald-455">
              PROGRAM KKN TEMATIK
            </span>
            <h4 className="text-sm sm:text-base md:text-lg font-black text-zinc-900 dark:text-white tracking-tight">
              PETA TEMATIK KELURAHAN PAKINTELAN
            </h4>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 text-[10px] sm:text-xs text-zinc-650 dark:text-zinc-400 font-bold">
              <span className="font-extrabold text-zinc-900 dark:text-white">FAIZ ABDUL HANIF</span>
            </div>
            <div className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-emerald-100/50 dark:bg-emerald-950/60 rounded-full text-[8px] sm:text-[9px] font-extrabold text-emerald-650 dark:text-emerald-455 border border-emerald-200/20 uppercase tracking-wider">
              KKNT UNDIP TIM II IDBU-38 2026
            </div>
          </div>
        )}

        {/* Bullet points checklist */}
        <div className="bg-zinc-50 dark:bg-zinc-955 border border-zinc-150/45 dark:border-zinc-800 rounded-2xl p-3.5 sm:p-5 space-y-2.5 sm:space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">
            {currentSlide === 0
              ? "Detail Informasi & Panduan"
              : currentSlide === totalSlides - 1
                ? "Manfaat & Hasil Program"
                : "Langkah Penggunaan"}
          </span>
          {currentSlideData.bulletPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-zinc-750 dark:text-zinc-300 font-semibold leading-relaxed">
              <span className="mt-1 sm:mt-1.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0">•</span>
              <span>{point}</span>
            </div>
          ))}
        </div>

        {/* Map interactive action banner */}
        {currentSlideData.actionLabel && (
          <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/25 dark:border-indigo-900/35">
            <div className="text-[8px] sm:text-[10px] text-zinc-500 font-bold leading-tight max-w-[55%]">
              Memicu visualisasi otomatis pada peta
            </div>
            <button
              onClick={handleButtonClick}
              className="py-1 sm:py-1.5 px-2.5 sm:px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1 shadow shadow-indigo-600/20 hover:shadow-indigo-700/30 cursor-pointer"
            >
              <PlayArrowOutlined className="w-3.5 h-3.5" />
              {currentSlideData.actionLabel}
            </button>
          </div>
        )}
      </div>

      {/* Slide Navigation Footer Controls */}
      <div className="p-4 md:p-5 bg-zinc-50 dark:bg-zinc-955 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between flex-shrink-0">

        {currentSlide > 0 ? (
          <button
            onClick={handlePrev}
            className="px-4 py-2 hover:bg-zinc-200/60 dark:hover:bg-zinc-850 text-zinc-650 dark:text-zinc-350 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeftOutlined className="w-4 h-4" />
            Kembali
          </button>
        ) : (
          <button
            onClick={onClose}
            className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-400 hover:text-red-500 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Tutup
          </button>
        )}

        <div className="flex items-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                ? 'w-6 bg-indigo-600'
                : 'w-2 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600'
                }`}
              title={`Buka Slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
        >
          {currentSlide === totalSlides - 1 ? 'Selesai' : 'Lanjut'}
          {currentSlide < totalSlides - 1 && <ChevronRightOutlined className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );

  // Return centered wrapper for Slide 1 (Cover) or Slide 10 (Closing), or raw floating card for others
  if (currentSlide === 0 || currentSlide === totalSlides - 1) {
    return (
      <div
        className="fixed inset-0 bg-black/45 dark:bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
