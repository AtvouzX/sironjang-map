'use client';

import React, { useState, useEffect } from 'react';
import {
  X, Loader2, Save, Sparkles, Plus, Trash2,
  Building2, Store, Milk, Sprout, School, ShieldAlert, Compass,
  Users, Palette, Utensils, ShoppingBag, Egg, Shield, Trees,
  Leaf, HeartPulse, Bus, Tent, Footprints, CupSoda, Activity,
  Flame, BookOpen, Heart, MapPin
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { MapCategory } from '@/data/mapData';
import { supabase } from '@/lib/supabaseClient';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit: MapCategory | null;
  onSaveSuccess: () => void;
}

const AVAILABLE_ICONS = [
  'Building2', 'Store', 'Milk', 'Sprout', 'School', 'ShieldAlert', 'Compass',
  'Users', 'Palette', 'Utensils', 'ShoppingBag', 'Egg', 'Shield', 'Trees',
  'Leaf', 'HeartPulse', 'Bus', 'Tent', 'Footprints', 'CupSoda', 'Activity',
  'Flame', 'BookOpen', 'Heart', 'MapPin'
];

const ICON_MAP: Record<string, LucideIcon> = {
  Building2, Store, Milk, Sprout, School, ShieldAlert, Compass,
  Users, Palette, Utensils, ShoppingBag, Egg, Shield, Trees,
  Leaf, HeartPulse, Bus, Tent, Footprints, CupSoda, Activity,
  Flame, BookOpen, Heart, MapPin
};

const PRESETS = [
  { name: 'Indigo Theme', color: 'indigo', markerColor: '#6366f1' },
  { name: 'Amber Theme', color: 'amber', markerColor: '#f59e0b' },
  { name: 'Lime Theme', color: 'lime', markerColor: '#84cc16' },
  { name: 'Emerald Theme', color: 'emerald', markerColor: '#10b981' },
  { name: 'Cyan Theme', color: 'cyan', markerColor: '#06b6d4' },
  { name: 'Red Theme', color: 'red', markerColor: '#ef4444' },
  { name: 'Rose Theme', color: 'rose', markerColor: '#f43f5e' },
  { name: 'Violet Theme', color: 'violet', markerColor: '#8b5cf6' },
  { name: 'Sky Theme', color: 'sky', markerColor: '#0ea5e9' },
  { name: 'Orange Theme', color: 'orange', markerColor: '#f97316' },
];

export default function CategoryFormModal({
  isOpen,
  onClose,
  categoryToEdit,
  onSaveSuccess
}: CategoryFormModalProps) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [colorTheme, setColorTheme] = useState('indigo');
  const [markerColor, setMarkerColor] = useState('#6366f1');
  const [icon, setIcon] = useState('Compass');
  const [description, setDescription] = useState('');
  const [stats, setStats] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!categoryToEdit;

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setId(categoryToEdit.id);
      setColorTheme(categoryToEdit.color);
      setMarkerColor(categoryToEdit.markerColor);
      setIcon(categoryToEdit.icon);
      setDescription(categoryToEdit.description);
      setStats(categoryToEdit.stats || []);
    } else {
      setName('');
      setId('');
      setColorTheme('indigo');
      setMarkerColor('#6366f1');
      setIcon('Compass');
      setDescription('');
      setStats([{ label: '', value: '' }]);
    }
    setError(null);
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  // Generate ID/Slug from name if not edit
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setId(slug);
    }
  };

  const handleAddStat = () => {
    if (stats.length < 3) {
      setStats([...stats, { label: '', value: '' }]);
    }
  };

  const handleRemoveStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const handleStatChange = (index: number, field: 'label' | 'value', value: string) => {
    const next = [...stats];
    next[index][field] = value;
    setStats(next);
  };

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    setColorTheme(preset.color);
    setMarkerColor(preset.markerColor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !name || !description) {
      setError('Harap isi semua kolom wajib.');
      return;
    }

    setLoading(true);
    setError(null);

    // Filter out empty stats
    const cleanStats = stats.filter(s => s.label.trim() && s.value.trim());

    try {
      const payload = {
        id,
        name,
        color: colorTheme,
        marker_color: markerColor,
        icon,
        description,
        stats: cleanStats
      };

      if (isEdit) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', id);

        if (error) throw error;
      } else {
        // Verify unique ID first
        const { data: existing } = await supabase
          .from('categories')
          .select('id')
          .eq('id', id)
          .single();

        if (existing) {
          throw new Error('ID / Slug kategori ini sudah digunakan. Silakan gunakan nama lain.');
        }

        const { error } = await supabase
          .from('categories')
          .insert([payload]);

        if (error) throw error;
      }

      onSaveSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan kategori.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Card Wrapper */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-2xl p-6 transition-all animate-scale-in scrollbar-thin">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-6 mt-1">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-zinc-900 dark:text-white">
              {isEdit ? 'Ubah Kategori Tematik' : 'Tambah Kategori Tematik'}
            </h2>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider">
              {isEdit ? 'Perbarui Rincian Tema Peta' : 'Buat Indikator Tematik Baru'}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-red-655 dark:text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">Nama Kategori *</label>
            <input
              type="text"
              required
              placeholder="e.g. Pariwisata, Fasilitas Kesehatan"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
            />
          </div>

          {/* ID / Slug Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">ID Kategori (Slug) *</label>
            <input
              type="text"
              required
              disabled={isEdit}
              placeholder="slug-kategori (terisi otomatis)"
              value={id}
              onChange={(e) => setId(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold disabled:opacity-50 disabled:bg-zinc-100 dark:disabled:bg-zinc-900/30"
            />
          </div>

          {/* Theme Preset Picker */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">Tema & Warna Pin</label>
            <div className="grid grid-cols-5 gap-2">
              {PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => handlePresetSelect(p)}
                  className={`flex flex-col items-center p-2 rounded-xl border text-[10px] font-semibold transition-all hover:scale-[1.03] cursor-pointer ${
                    colorTheme === p.color ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800 font-extrabold shadow-sm' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full mb-1 border border-black/10" style={{ backgroundColor: p.markerColor }} />
                  <span className="capitalize text-[9px]">{p.color}</span>
                </button>
              ))}
            </div>
            {/* Custom hex indicator */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-zinc-400 font-semibold">Warna Marker Hex:</span>
              <input
                type="color"
                value={markerColor}
                onChange={(e) => setMarkerColor(e.target.value)}
                className="w-6 h-6 border-0 rounded overflow-hidden p-0 cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono font-semibold">{markerColor}</span>
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">Ikon Kategori *</label>
            <div className="grid grid-cols-8 gap-1.5 p-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-h-36 overflow-y-auto scrollbar-thin">
              {AVAILABLE_ICONS.map((ico) => {
                const IconComp = ICON_MAP[ico];
                return (
                  <button
                    type="button"
                    key={ico}
                    onClick={() => setIcon(ico)}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                      icon === ico
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'
                    }`}
                    title={ico}
                  >
                    {IconComp ? <IconComp className="w-4 h-4" /> : null}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-semibold mt-1">
              {(() => { const Ic = ICON_MAP[icon]; return Ic ? <Ic className="w-3.5 h-3.5 text-indigo-500" /> : null; })()}
              <span>Ikon Terpilih: <strong className="text-indigo-600 dark:text-indigo-400">{icon}</strong></span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">Deskripsi Singkat *</label>
            <textarea
              required
              rows={3}
              placeholder="Deskripsi tema peta..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold resize-none"
            />
          </div>

          {/* Custom stats key-value list */}
          <div className="space-y-2 border-t border-zinc-150 dark:border-zinc-800 pt-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">Indikator Statistik (Maks 3)</label>
              {stats.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddStat}
                  className="p-1 text-indigo-650 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/20 rounded-md transition-colors flex items-center gap-1 text-[10px] font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
              )}
            </div>

            <div className="space-y-2">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Nama Indikator (e.g. Luas sawah)"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs placeholder-zinc-450 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nilai (e.g. 12 Hektar)"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs placeholder-zinc-450 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(idx)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-950/20 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {stats.length === 0 && (
                <p className="text-[10px] text-zinc-400 italic">Belum ada statistik ditambahkan. Tampilan kategori di sidebar akan kosong dari metrik.</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2.5 border-t border-zinc-150 dark:border-zinc-800 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-850 text-xs font-bold text-zinc-500 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-xl flex items-center gap-1.5 text-xs transition-colors shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Kategori</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
