'use client';

import React, { useState, useEffect } from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import AutorenewOutlined from '@mui/icons-material/AutorenewOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import PlayArrowOutlined from '@mui/icons-material/PlayArrowOutlined';
import UndoOutlined from '@mui/icons-material/UndoOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { MapCategory, MapZone } from '@/data/mapData';
import { supabase } from '@/lib/supabaseClient';

interface ZoneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  zoneToEdit: MapZone | null;
  onSaveSuccess: () => void;
  categories: MapCategory[];
  drawnCoordinates: [number, number][];
  setDrawnCoordinates: React.Dispatch<React.SetStateAction<[number, number][]>>;
  isDrawingActive: boolean;
  setIsDrawingActive: (active: boolean) => void;
}

const PRESET_COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Lime', hex: '#84cc16' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Sky', hex: '#0ea5e9' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Rose', hex: '#f43f5e' }
];

export default function ZoneFormModal({
  isOpen,
  onClose,
  zoneToEdit,
  onSaveSuccess,
  categories,
  drawnCoordinates,
  setDrawnCoordinates,
  isDrawingActive,
  setIsDrawingActive
}: ZoneFormModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('#f59e0b');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!zoneToEdit;

  useEffect(() => {
    if (!isOpen) return;

    if (zoneToEdit) {
      setName(zoneToEdit.name);
      setCategory(zoneToEdit.category);
      setColor(zoneToEdit.color);
      setDrawnCoordinates(zoneToEdit.coordinates);
      setIsDrawingActive(false);
    } else {
      setName('');
      setCategory(categories[0]?.id || '');
      setColor('#f59e0b');
      setDrawnCoordinates([]);
      setIsDrawingActive(true); // Start in drawing mode for new zones
    }
    setError(null);
  }, [zoneToEdit, isOpen, categories, setDrawnCoordinates, setIsDrawingActive]);

  if (!isOpen) return null;

  const handleUndo = () => {
    if (drawnCoordinates.length > 0) {
      setDrawnCoordinates(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    setDrawnCoordinates([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !category || !color) {
      setError('Harap lengkapi semua kolom wajib.');
      return;
    }

    if (drawnCoordinates.length < 3) {
      setError('Area wilayah (zona) harus memiliki minimal 3 titik batas untuk membentuk bidang.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name,
        category,
        color,
        coordinates: drawnCoordinates
      };

      if (isEdit && zoneToEdit?.id) {
        const { error } = await supabase
          .from('zones')
          .update(payload)
          .eq('id', zoneToEdit.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('zones')
          .insert([payload]);

        if (error) throw error;
      }

      setIsDrawingActive(false);
      onSaveSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan zona.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-40 flex items-start justify-end p-4`}
      style={{ pointerEvents: isDrawingActive ? 'none' : 'auto' }}
    >
    <div
      className="w-96 max-h-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col p-5 overflow-hidden animate-slide-in select-none"
      style={{ pointerEvents: 'auto' }}
    >
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-150 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-xl flex items-center justify-center">
            <LayersOutlined className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-zinc-900 dark:text-white">
              {isEdit ? 'Ubah Area Wilayah (Zona)' : 'Gambar Area Wilayah (Zona)'}
            </h2>
            <p className="text-[9px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider">
              {isEdit ? 'Perbarui Polygon Area' : 'Buat Pembatasan Zona Baru'}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsDrawingActive(false);
            onClose();
          }}
          className="p-1.5 text-zinc-450 hover:text-zinc-650 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors flex items-center justify-center"
        >
          <CloseOutlined className="w-4.5 h-4.5" />
        </button>
      </div>

      {error && (
        <div className="p-3 my-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-red-655 dark:text-red-400 text-[11px] font-semibold">
          {error}
        </div>
      )}

      {/* Main Form Scrollable Container */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 py-3 scrollbar-thin pr-1 text-xs">
        
        {/* Name */}
        <div className="space-y-1">
          <label className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-400 block">Nama Area / Zona *</label>
          <input
            type="text"
            required
            placeholder="e.g. Zona Peternakan Komunal, Rawan Longsor"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
          />
        </div>

        {/* Category Selector */}
        <div className="space-y-1">
          <label className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-400 block">Kategori Tematik *</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2 bg-zinc-55 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
          >
            <option value="" disabled>Pilih Kategori...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Drawing Controls Panel */}
        <div className="bg-zinc-50 dark:bg-zinc-950/45 rounded-2xl border border-zinc-150 dark:border-zinc-800 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-650 dark:text-indigo-400">Peta Mode Menggambar</span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
              isDrawingActive 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-500/20 animate-pulse'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700'
            }`}>
              {isDrawingActive ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>

          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed flex gap-1.5 items-start">
            <InfoOutlined className="w-4 h-4 text-indigo-550 flex-shrink-0 mt-0.5" />
            <span>Klik beberapa lokasi di peta secara berurutan untuk menghubungkan garis batas dan membentuk area. Minimal butuh 3 titik.</span>
          </div>

          {/* Interactive buttons */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setIsDrawingActive(!isDrawingActive)}
              className={`py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-[10px] font-bold cursor-pointer transition-all ${
                isDrawingActive
                  ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-750 dark:text-zinc-250 hover:bg-zinc-50'
              }`}
            >
              <PlayArrowOutlined className="w-3.5 h-3.5" />
              <span>{isDrawingActive ? 'Jeda Klik' : 'Mulai Klik'}</span>
            </button>

            <button
              type="button"
              onClick={handleUndo}
              disabled={drawnCoordinates.length === 0}
              className="py-2 px-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-750 dark:text-zinc-250 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-bold hover:bg-zinc-50 disabled:opacity-40 cursor-pointer transition-all"
            >
              <UndoOutlined className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={drawnCoordinates.length === 0}
              className="py-2 px-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-750 dark:text-zinc-250 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-bold hover:bg-zinc-50 disabled:opacity-40 cursor-pointer transition-all"
            >
              <AutorenewOutlined className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Points list stats */}
          <div className="pt-2 border-t border-zinc-150 dark:border-zinc-800/80 flex justify-between text-[10px] text-zinc-450 font-extrabold uppercase">
            <span>Jumlah Titik:</span>
            <span className="text-indigo-650 dark:text-indigo-400">{drawnCoordinates.length} Titik</span>
          </div>
        </div>

        {/* Color Presets */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-400 block">Warna Area Wilayah</label>
          <div className="grid grid-cols-5 gap-1.5">
            {PRESET_COLORS.map(c => (
              <button
                type="button"
                key={c.hex}
                onClick={() => setColor(c.hex)}
                className={`w-full py-1.5 rounded-lg border text-[9px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  color === c.hex 
                    ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800 scale-[1.04]' 
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-md border border-black/10" style={{ backgroundColor: c.hex }} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[9px] text-zinc-450 font-bold uppercase">Pilih Custom Warna:</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-6 h-6 border-0 rounded overflow-hidden p-0 cursor-pointer bg-transparent"
            />
            <span className="text-xs font-mono font-semibold">{color}</span>
          </div>
        </div>

        {/* Submit Actions Footer */}
        <div className="flex gap-2 border-t border-zinc-150 dark:border-zinc-800 pt-4 mt-2">
          <button
            type="button"
            onClick={() => {
              setIsDrawingActive(false);
              onClose();
            }}
            className="flex-1 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-850 text-xs font-bold text-zinc-500 transition-colors cursor-pointer text-center"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-2xl flex items-center justify-center gap-1.5 text-xs transition-colors shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <AutorenewOutlined className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <SaveOutlined className="w-3.5 h-3.5" />
                <span>Simpan Area</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
    </div>
  );
}
