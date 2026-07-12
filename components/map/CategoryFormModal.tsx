'use client';

import React, { useState, useEffect } from 'react';
import {
  X, Loader2, Save, Sparkles, Plus, Trash2, Upload,
  Building2, Store, Milk, Sprout, School, ShieldAlert, Compass,
  Users, Palette, Utensils, ShoppingBag, Egg, Shield, Trees,
  Leaf, HeartPulse, Bus, Tent, Footprints, CupSoda, Activity,
  Flame, BookOpen, Heart, MapPin, Church
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { MapCategory } from '@/data/mapData';
import { supabase } from '@/lib/supabaseClient';

import CloseOutlined from '@mui/icons-material/CloseOutlined';
import AutorenewOutlined from '@mui/icons-material/AutorenewOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import UploadOutlined from '@mui/icons-material/UploadOutlined';

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
  'Flame', 'BookOpen', 'Heart', 'MapPin', 'Church', 'Mosque', 'Vihara', 'Cemetery'
];

const ICON_MAP: Record<string, any> = {
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
  Church: ChurchOutlined,
  Activity: SportsSoccerOutlined,
  Mosque: MosqueOutlined,
  Vihara: TempleBuddhistOutlined,
  Cemetery: LocalFloristOutlined
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

const getIconForPOI = (props: any) => {
  const building = props.building || '';
  const amenity = props.amenity || '';
  const office = props.office || '';
  const shop = props.shop || '';
  const leisure = props.leisure || '';
  const landuse = props.landuse || '';
  const religion = props.religion || '';

  if (amenity === 'school' || amenity === 'university' || amenity === 'kindergarten' || building === 'school') {
    return 'School';
  }
  if (amenity === 'restaurant' || amenity === 'cafe' || amenity === 'fast_food' || amenity === 'food_court') {
    return 'Utensils';
  }
  if (religion === 'muslim' || building === 'mosque' || amenity === 'mosque') {
    return 'Mosque';
  }
  if (religion === 'buddhist' || religion === 'taoist' || building === 'vihara' || building === 'temple') {
    return 'Vihara';
  }
  if (amenity === 'place_of_worship' || religion || building === 'church') {
    return 'Church';
  }
  if (amenity === 'hospital' || amenity === 'clinic' || amenity === 'doctors' || amenity === 'pharmacy') {
    return 'HeartPulse';
  }
  if (amenity === 'bus_station' || amenity === 'bus_stop') {
    return 'Bus';
  }
  if (shop || amenity === 'marketplace') {
    return 'ShoppingBag';
  }
  if (amenity === 'police' || amenity === 'fire_station') {
    return 'Shield';
  }
  if (office || building === 'office' || building === 'village_office') {
    return 'Building2';
  }
  if (leisure === 'pitch' || leisure === 'sports_centre' || props.sport) {
    return 'Activity';
  }
  if (landuse === 'cemetery' || amenity === 'grave_yard') {
    return 'Cemetery';
  }
  return 'Compass';
};

const translateValue = (key: string, val: string): string => {
  const translations: Record<string, string> = {
    // Tipe Amenitas / Bangunan / Landuse / Leisure
    'mosque': 'Masjid',
    'school': 'Sekolah',
    'village_office': 'Kantor Kelurahan',
    'place_of_worship': 'Tempat Ibadah',
    'government': 'Pemerintah',
    'hospital': 'Rumah Sakit',
    'clinic': 'Klinik',
    'pharmacy': 'Apotek',
    'restaurant': 'Rumah Makan',
    'cafe': 'Kafe',
    'fast_food': 'Warung Cepat Saji',
    'food_court': 'Pujasera',
    'marketplace': 'Pasar',
    'police': 'Kantor Polisi',
    'fire_station': 'Pemadam Kebakaran',
    'bank': 'Bank',
    'house': 'Rumah',
    'residential': 'Residensial',
    'apartments': 'Apartemen',
    'retail': 'Toko/Ritel',
    
    // Lapangan / Pemakaman / Taman
    'cemetery': 'Pemakaman',
    'grave_yard': 'Pemakaman',
    'pitch': 'Lapangan',
    'park': 'Taman',
    'sports_centre': 'Pusat Olahraga',
    'grass': 'Lapangan Rumput',
    'soccer': 'Sepak Bola',
    'badminton': 'Bulu Tangkis',
    
    // Agama
    'muslim': 'Islam',
    'christian': 'Kristen',
    'catholic': 'Katolik',
    'hindu': 'Hindu',
    'buddhist': 'Buddha',
    
    // Umum
    'yes': 'Ya',
    'no': 'Tidak'
  };

  const lowerVal = String(val).toLowerCase().trim();
  if (translations[lowerVal]) {
    return translations[lowerVal];
  }
  
  if (key === 'building:levels') {
    return `${val} Lantai`;
  }
  if (key === 'capacity:persons') {
    return val.endsWith('orang') ? val : `${val} orang`;
  }

  // Format name-like strings by replacing underscore with space and capitalizing
  return val.replace(/_/g, ' ').charAt(0).toUpperCase() + val.replace(/_/g, ' ').slice(1);
};

const mapPropertiesToDetails = (props: any): Record<string, string> => {
  const details: Record<string, string> = {};

  // 1. Alamat
  const address = props['addr:full'] || props['addr:street'] || '';
  if (address) {
    details['Alamat'] = address;
  }

  // 2. Tipe Bangunan
  if (props.building && props.building !== 'yes') {
    details['Tipe Bangunan'] = translateValue('building', props.building);
  }

  // 3. Fasilitas
  if (props.amenity) {
    details['Fasilitas'] = translateValue('amenity', props.amenity);
  }

  // 4. Fasilitas Kantor
  if (props.office) {
    details['Fasilitas Kantor'] = translateValue('office', props.office);
  }

  // 5. Agama
  if (props.religion) {
    details['Agama'] = translateValue('religion', props.religion);
  }

  // 6. Kapasitas
  const capacity = props['capacity:persons'] || props.capacity || '';
  if (capacity) {
    details['Kapasitas'] = translateValue('capacity:persons', capacity);
  }

  // 7. Jumlah Lantai
  if (props['building:levels']) {
    details['Jumlah Lantai'] = translateValue('building:levels', props['building:levels']);
  }

  // 8. Kontak
  const phone = props.phone || props['contact:phone'] || '';
  if (phone) {
    details['Kontak'] = phone;
  }

  // 9. Situs Web
  if (props.website) {
    details['Situs Web'] = props.website;
  }

  // 10. Jam Buka
  if (props.opening_hours) {
    details['Jam Buka'] = props.opening_hours;
  }

  // 11. Informasi Lapangan & Makam
  if (props.leisure) {
    details['Aktivitas Rekreasi'] = translateValue('leisure', props.leisure);
  }
  if (props.landuse) {
    details['Penggunaan Lahan'] = translateValue('landuse', props.landuse);
  }
  if (props.sport) {
    details['Cabang Olahraga'] = translateValue('sport', props.sport);
  }

  return details;
};

const countStats = (features: any[]) => {
  let mosques = 0;
  let churches = 0;
  let temples = 0;
  let schools = 0;
  let cemeteries = 0;
  let sportsFields = 0;
  let totalPois = 0;
  let totalLinesPolygons = 0;

  features.forEach((f: any) => {
    const props = f.properties || {};
    const geomType = f.geometry?.type || '';

    if (geomType === 'Point') {
      totalPois++;
      const religion = props.religion || '';
      const building = props.building || '';
      const amenity = props.amenity || '';
      const landuse = props.landuse || '';
      const leisure = props.leisure || '';

      if (religion === 'muslim' || building === 'mosque' || amenity === 'mosque') {
        mosques++;
      } else if (religion === 'christian' || religion === 'catholic' || building === 'church' || amenity === 'church') {
        churches++;
      } else if (religion === 'buddhist' || religion === 'taoist' || building === 'vihara' || building === 'temple') {
        temples++;
      } else if (amenity === 'place_of_worship') {
        mosques++;
      }

      if (amenity === 'school' || building === 'school') {
        schools++;
      }

      if (landuse === 'cemetery' || amenity === 'grave_yard') {
        cemeteries++;
      }

      if (leisure === 'pitch' || leisure === 'sports_centre' || props.sport) {
        sportsFields++;
      }
    } else {
      totalLinesPolygons++;
    }
  });

  const generatedStats: { label: string; value: string }[] = [];
  if (mosques > 0) {
    generatedStats.push({ label: 'Masjid/Musala', value: `${mosques} Lokasi` });
  }
  if (churches > 0) {
    generatedStats.push({ label: 'Gereja', value: `${churches} Lokasi` });
  }
  if (temples > 0) {
    generatedStats.push({ label: 'Vihara/Kuil', value: `${temples} Lokasi` });
  }
  if (schools > 0) {
    generatedStats.push({ label: 'Sekolah', value: `${schools} Lokasi` });
  }
  if (sportsFields > 0) {
    generatedStats.push({ label: 'Lapangan Olahraga', value: `${sportsFields} Area` });
  }
  if (cemeteries > 0) {
    generatedStats.push({ label: 'Pemakaman', value: `${cemeteries} Area` });
  }
  if (totalPois > 0) {
    generatedStats.push({ label: 'Total POI', value: `${totalPois} Titik` });
  }
  if (totalLinesPolygons > 0) {
    generatedStats.push({ label: 'Jalan/Zona', value: `${totalLinesPolygons} Jalur` });
  }

  return generatedStats;
};

const parseFeatureToPOI = (feature: any, categoryId: string) => {
  const props = feature.properties || {};
  const coords = feature.geometry.coordinates; // [lng, lat]
  
  const id = feature.id || props['@id'] || `poi-${Math.random().toString(36).substr(2, 9)}`;
  const lat = coords[1];
  const lng = coords[0];
  
  let name = props.name;
  if (!name) {
    if (props.building && props.building !== 'yes') {
      name = props.building;
    } else if (props.amenity) {
      name = props.amenity;
    } else if (props.leisure) {
      name = props.leisure;
    } else if (props.landuse) {
      name = props.landuse;
    } else if (props.sport) {
      name = props.sport;
    } else if (props.office) {
      name = props.office;
    } else {
      name = 'Titik Lokasi Baru';
    }
    name = translateValue('general', name);
  }

  let description = props.description || '';
  if (!description) {
    const parts = [];
    if (props['addr:full'] || props['addr:street']) {
      parts.push(props['addr:full'] || props['addr:street']);
    }
    
    const buildingType = props.building && props.building !== 'yes' ? translateValue('building', props.building) : '';
    const amenityType = props.amenity ? translateValue('amenity', props.amenity) : '';
    const leisureType = props.leisure ? translateValue('leisure', props.leisure) : '';
    const landuseType = props.landuse ? translateValue('landuse', props.landuse) : '';

    if (buildingType && amenityType) {
      parts.push(`Bangunan ${buildingType} (${amenityType})`);
    } else if (buildingType) {
      parts.push(`Bangunan ${buildingType}`);
    } else if (amenityType) {
      parts.push(`Fasilitas ${amenityType}`);
    } else if (leisureType) {
      parts.push(leisureType);
    } else if (landuseType) {
      parts.push(landuseType);
    }
    
    description = parts.join(', ') || 'Lokasi dari file GeoJSON';
  }

  const icon = getIconForPOI(props);
  const cleanDetails = mapPropertiesToDetails(props);

  return {
    id: String(id),
    name,
    lat,
    lng,
    category: categoryId,
    description,
    icon,
    details: cleanDetails
  };
};

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit: MapCategory | null;
  onSaveSuccess: () => void;
}

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

  // GeoJSON file upload states
  const [geojsonFile, setGeojsonFile] = useState<File | null>(null);
  const [hasGeojson, setHasGeojson] = useState(false);
  const [geojsonDeletePending, setGeojsonDeletePending] = useState(false);
  const [geojsonText, setGeojsonText] = useState<string | null>(null);
  const [extractedPois, setExtractedPois] = useState<any[]>([]);

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

  // Check if this category has a GeoJSON file uploaded in the database
  useEffect(() => {
    const checkExistingGeojson = async () => {
      if (categoryToEdit) {
        try {
          const { data, error } = await supabase
            .from('category_geojson')
            .select('category_id')
            .eq('category_id', categoryToEdit.id)
            .maybeSingle();

          if (!error && data) {
            setHasGeojson(true);
          } else {
            setHasGeojson(false);
          }
        } catch (err) {
          console.error('Error checking existing GeoJSON:', err);
          setHasGeojson(false);
        }
      } else {
        setHasGeojson(false);
      }
      setGeojsonFile(null);
      setGeojsonDeletePending(false);
      setGeojsonText(null);
      setExtractedPois([]);
    };

    if (isOpen) {
      checkExistingGeojson();
    }
  }, [categoryToEdit, isOpen]);

  const handleGeojsonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const json = JSON.parse(text);

        if (!json || (json.type !== 'FeatureCollection' && json.type !== 'Feature')) {
          setError('Format GeoJSON tidak valid. Pastikan file memiliki properti type: "FeatureCollection" atau "Feature".');
          return;
        }

        setGeojsonFile(file);
        setGeojsonText(text);
        setGeojsonDeletePending(false);
        setError(null);

        // Extract POIs
        const features = json.features || (json.type === 'Feature' ? [json] : []);
        const points = features.filter((f: any) => f.geometry && f.geometry.type === 'Point');
        const parsedPois = points.map((f: any) => parseFeatureToPOI(f, id));
        setExtractedPois(parsedPois);

        // Auto calculate stats from GeoJSON and populate in stats form state
        const calculatedStats = countStats(features);
        if (calculatedStats.length > 0) {
          setStats(calculatedStats);
        }
      } catch (err: any) {
        setError('Gagal membaca file: JSON tidak valid. ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearGeojson = () => {
    setGeojsonFile(null);
    setGeojsonText(null);
    setExtractedPois([]);
    setStats([{ label: '', value: '' }]);
    if (hasGeojson) {
      setGeojsonDeletePending(true);
    }
  };

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
    setStats([...stats, { label: '', value: '' }]);
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

      // Handle category-specific GeoJSON updates
      if (geojsonDeletePending) {
        const { error: delErr } = await supabase
          .from('category_geojson')
          .delete()
          .eq('category_id', id);
        if (delErr) throw delErr;
      } else if (geojsonText) {
        const { error: upsertErr } = await supabase
          .from('category_geojson')
          .upsert({
            category_id: id,
            geojson: JSON.parse(geojsonText),
            updated_at: new Date().toISOString()
          });
        if (upsertErr) throw upsertErr;

        // Upsert extracted POIs
        if (extractedPois.length > 0) {
          const poisToInsert = extractedPois.map(poi => ({
            ...poi,
            category: id
          }));
          const { error: poisErr } = await supabase
            .from('pois')
            .upsert(poisToInsert);
          if (poisErr) throw poisErr;
        }
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
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center"
        >
          <CloseOutlined className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-6 mt-1">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-xl flex items-center justify-center">
            <AutoAwesomeOutlined className="w-5 h-5" />
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
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">Indikator Statistik</label>
              <button
                type="button"
                onClick={handleAddStat}
                className="p-1 text-indigo-650 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/20 rounded-md transition-colors flex items-center gap-1 text-[10px] font-bold"
              >
                <AddOutlined className="w-3.5 h-3.5" />
                Tambah
              </button>
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
                    className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs placeholder-zinc-450 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nilai (e.g. 12 Hektar)"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs placeholder-zinc-450 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(idx)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-950/20 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                  >
                    <DeleteOutlined className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {stats.length === 0 && (
                <p className="text-[10px] text-zinc-400 italic">Belum ada statistik ditambahkan. Tampilan kategori di sidebar akan kosong dari metrik.</p>
              )}
            </div>
          </div>

          {/* GeoJSON File Upload */}
          <div className="space-y-1.5 border-t border-zinc-150 dark:border-zinc-800 pt-3">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-405 block">File GeoJSON (Opsional)</label>
            <div className="flex items-center gap-2">
              <label className="flex-1 py-2.5 px-3 border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-350 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-550 dark:text-zinc-400 rounded-2xl text-xs font-semibold text-center cursor-pointer transition-colors block">
                {geojsonFile ? (
                  <span className="text-indigo-650 dark:text-indigo-400 truncate block">{geojsonFile.name}</span>
                ) : hasGeojson && !geojsonDeletePending ? (
                  <span className="text-indigo-650 dark:text-indigo-400 font-bold truncate block flex items-center justify-center gap-1">
                    <SaveOutlined className="w-3.5 h-3.5" /> GeoJSON Terunggah (Klik untuk mengganti)
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <UploadOutlined className="w-3.5 h-3.5" /> Pilih File GeoJSON
                  </span>
                )}
                <input
                  type="file"
                  accept=".geojson,application/json"
                  onChange={handleGeojsonFileChange}
                  className="hidden"
                />
              </label>
              {(geojsonFile || (hasGeojson && !geojsonDeletePending)) && (
                <button
                  type="button"
                  onClick={handleClearGeojson}
                  className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-950/20 rounded-2xl transition-all cursor-pointer border border-zinc-200 dark:border-zinc-800 flex items-center justify-center"
                  title="Hapus GeoJSON"
                >
                  <DeleteOutlined className="w-4 h-4" />
                </button>
              )}
            </div>
            {extractedPois.length > 0 && (
              <div className="mt-1.5 p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/30 rounded-xl text-[10px] text-emerald-600 dark:text-emerald-450 font-bold flex items-center gap-1.5">
                <span>Terdeteksi {extractedPois.length} titik lokasi (POI) yang akan diimpor secara otomatis ke database.</span>
              </div>
            )}
            <p className="text-[9px] text-zinc-400 font-medium leading-relaxed">
              Unggah file GeoJSON untuk memetakan rute, batas khusus, atau fitur spasial lain untuk tema ini. Peta akan otomatis menggambar data ini saat tema aktif.
            </p>
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
