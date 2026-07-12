'use client';

import React, { useState, useEffect } from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import AutorenewOutlined from '@mui/icons-material/AutorenewOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import HelpOutlineOutlined from '@mui/icons-material/HelpOutlineOutlined';
import { MapPOI, MapCategory } from '@/data/mapData';
import { supabase } from '@/lib/supabaseClient';

interface POIFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  poiToEdit: MapPOI | null;
  onSaveSuccess: () => void;
  categories: MapCategory[];
  pickedLatLng: { lat: number; lng: number } | null;
  onStartMapPick: () => void;
}

const AVAILABLE_ICONS = [
  'Building2', 'Store', 'Milk', 'Sprout', 'School', 'ShieldAlert', 'Compass',
  'Users', 'Palette', 'Utensils', 'ShoppingBag', 'Egg', 'Shield', 'Trees',
  'Leaf', 'HeartPulse', 'Bus', 'Tent', 'Footprints', 'CupSoda', 'Activity',
  'Flame', 'BookOpen', 'Heart', 'MapPin', 'Church'
];

export default function POIFormModal({
  isOpen,
  onClose,
  poiToEdit,
  onSaveSuccess,
  categories,
  pickedLatLng,
  onStartMapPick
}: POIFormModalProps) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [category, setCategory] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('MapPin');
  const [details, setDetails] = useState<{ key: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!poiToEdit;

  // Sync with pickedLatLng from map
  useEffect(() => {
    if (pickedLatLng && isOpen) {
      setLat(pickedLatLng.lat.toFixed(6));
      setLng(pickedLatLng.lng.toFixed(6));
    }
  }, [pickedLatLng, isOpen]);

  useEffect(() => {
    if (poiToEdit) {
      setName(poiToEdit.name);
      setId(poiToEdit.id);
      setCategory(poiToEdit.category);
      setLat(poiToEdit.lat.toString());
      setLng(poiToEdit.lng.toString());
      setDescription(poiToEdit.description);
      setIcon(poiToEdit.icon);
      
      const detailsList = Object.entries(poiToEdit.details || {}).map(([key, val]) => ({
        key,
        value: val
      }));
      setDetails(detailsList);
    } else {
      setName('');
      setId('');
      setCategory(categories[0]?.id || '');
      setLat('');
      setLng('');
      setDescription('');
      setIcon('MapPin');
      setDetails([
        { key: 'Alamat', value: '' },
        { key: 'Kontak', value: '' }
      ]);
    }
    setError(null);
  }, [poiToEdit, isOpen, categories]);

  if (!isOpen) return null;

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

  const handleAddDetail = () => {
    setDetails([...details, { key: '', value: '' }]);
  };

  const handleRemoveDetail = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleDetailChange = (index: number, field: 'key' | 'value', value: string) => {
    const next = [...details];
    next[index][field] = value;
    setDetails(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !name || !category || !lat || !lng || !description) {
      setError('Harap lengkapi semua kolom wajib.');
      return;
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      setError('Garis Lintang (Latitude) & Garis Bujur (Longitude) harus berupa angka valid.');
      return;
    }

    setLoading(true);
    setError(null);

    // Convert details list to key-value object
    const detailsObj: { [key: string]: string } = {};
    details.forEach(item => {
      if (item.key.trim() && item.value.trim()) {
        detailsObj[item.key.trim()] = item.value.trim();
      }
    });

    try {
      const payload = {
        id,
        name,
        lat: latitude,
        lng: longitude,
        category,
        description,
        icon,
        details: detailsObj
      };

      if (isEdit) {
        const { error } = await supabase
          .from('pois')
          .update(payload)
          .eq('id', id);

        if (error) throw error;
      } else {
        // Verify unique ID
        const { data: existing } = await supabase
          .from('pois')
          .select('id')
          .eq('id', id)
          .single();

        if (existing) {
          throw new Error('ID / Slug lokasi ini sudah ada. Silakan ubah nama lokasi.');
        }

        const { error } = await supabase
          .from('pois')
          .insert([payload]);

        if (error) throw error;
      }

      onSaveSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan lokasi.');
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

      {/* Card */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-2xl p-6 transition-all animate-scale-in scrollbar-thin">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center"
        >
          <CloseOutlined className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-6 mt-1">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-xl flex items-center justify-center">
            <LocationOnOutlined className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-zinc-900 dark:text-white">
              {isEdit ? 'Ubah Lokasi (POI)' : 'Tambah Lokasi (POI)'}
            </h2>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider">
              {isEdit ? 'Perbarui Koordinat & Informasi Lokasi' : 'Tandai Titik Lokasi Baru di Peta'}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-red-655 dark:text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">Nama Lokasi *</label>
            <input
              type="text"
              required
              placeholder="e.g. Kantor Lurah Pakintelan, Sentra UMKM Madu"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
            />
          </div>

          {/* ID / Slug */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">ID Lokasi (Slug) *</label>
            <input
              type="text"
              required
              disabled={isEdit}
              placeholder="slug-lokasi (terisi otomatis)"
              value={id}
              onChange={(e) => setId(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold disabled:opacity-50 disabled:bg-zinc-100 dark:disabled:bg-zinc-900/30"
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">Kategori Tematik *</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-55 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
            >
              <option value="" disabled>Pilih Kategori...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Lat/Lng Coordinate Map Picker */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">Koordinat Lokasi *</label>
              <button
                type="button"
                onClick={onStartMapPick}
                className="px-2.5 py-1 bg-indigo-55 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 text-indigo-650 dark:text-indigo-400 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer border border-indigo-200/20"
              >
                <LocationOnOutlined className="w-3.5 h-3.5" />
                Pilih Dari Peta
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Garis Lintang (Latitude) e.g. -7.09102"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-55 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs placeholder-zinc-450 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Garis Bujur (Longitude) e.g. 110.39201"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-55 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs placeholder-zinc-450 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">Ikon Pin Lokasi</label>
            <div className="grid grid-cols-8 gap-2 p-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-h-24 overflow-y-auto scrollbar-thin">
              {AVAILABLE_ICONS.map((ico) => (
                <button
                  type="button"
                  key={ico}
                  onClick={() => setIcon(ico)}
                  className={`p-2 rounded-lg text-center flex items-center justify-center transition-all ${
                    icon === ico ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                  }`}
                  title={ico}
                >
                  <span className="text-[9px] font-mono leading-none truncate w-full block">{ico.slice(0, 5)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">Deskripsi Singkat *</label>
            <textarea
              required
              rows={2}
              placeholder="Deskripsi atau deskripsi ringkas tentang tempat ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold resize-none"
            />
          </div>

          {/* Details Lists */}
          <div className="space-y-2 border-t border-zinc-150 dark:border-zinc-800 pt-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">Informasi Tambahan (Detail)</label>
              <button
                type="button"
                onClick={handleAddDetail}
                className="p-1 text-indigo-650 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/20 rounded-md transition-colors flex items-center gap-1 text-[10px] font-bold"
              >
                <AddOutlined className="w-3.5 h-3.5" />
                Tambah Detail
              </button>
            </div>

            <div className="space-y-2">
              {details.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Nama Kunci (e.g. Alamat, Jam)"
                    value={item.key}
                    onChange={(e) => handleDetailChange(idx, 'key', e.target.value)}
                    className="flex-[2] px-3 py-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs placeholder-zinc-450 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nilai (e.g. Jl. Anggur)"
                    value={item.value}
                    onChange={(e) => handleDetailChange(idx, 'value', e.target.value)}
                    className="flex-[3] px-3 py-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs placeholder-zinc-450 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDetail(idx)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-950/20 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                  >
                    <DeleteOutlined className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {details.length === 0 && (
                <p className="text-[10px] text-zinc-400 italic">Belum ada rincian tambahan. Klik "Tambah Detail" untuk menambahkan atribut dinamis.</p>
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
                  <AutorenewOutlined className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <SaveOutlined className="w-3.5 h-3.5" />
                  <span>Simpan Lokasi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
