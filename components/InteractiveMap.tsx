'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Building2, Store, Milk, Sprout, School, ShieldAlert, Compass,
  Users, Palette, Utensils, ShoppingBag, Egg, Shield, Trees,
  Leaf, HeartPulse, Bus, Tent, Footprints, CupSoda,
  Ruler, MapPin, X, Layers, Search,
  RefreshCw, Navigation, Menu, ChevronRight, ChevronLeft, Map as MapIcon,
  Info, ChevronDown
} from 'lucide-react';
import {
  MAP_CATEGORIES,
  MAP_POIS,
  BOUNDARY_PAKINTELAN,
  ZONE_UMKM,
  ZONE_PETERNAKAN,
  ZONE_PERTANIAN,
  EVACUATION_ROUTE_1,
  EVACUATION_ROUTE_2,
  TOURISM_TRAIL,
  MapPOI,
  MapCategory
} from '@/data/mapData';

// Map icon lookup dictionary for rendering in React UI
const IconComponents: { [key: string]: React.ComponentType<any> } = {
  Building2, Store, Milk, Sprout, School, ShieldAlert, Compass,
  Users, Palette, Utensils, ShoppingBag, Egg, Shield, Trees,
  Leaf, HeartPulse, Bus, Tent, Footprints, CupSoda
};

// SVG paths for Leaflet HTML Markers (matching Lucide icon designs)
const getIconSvg = (iconName: string) => {
  const paths: { [key: string]: string } = {
    Building2: `<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>`,
    Users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    Store: `<path d="m2 7 4.41-3.67A2 2 0 0 1 7.68 3h8.64a2 2 0 0 1 1.27.33L22 7"/><path d="M9 12H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-4"/><path d="M12 12v10"/><path d="M12 7v5"/>`,
    Palette: `<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.63-.77 1.63-1.7 0-.45-.18-.85-.46-1.2-.29-.34-.47-.78-.47-1.27 0-1.1 1-2 2.1-2h1.9c4.27 0 7.9-3.26 7.9-7.58C22 5.82 17.57 2 12 2z"/>`,
    Utensils: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>`,
    ShoppingBag: `<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>`,
    Milk: `<path d="M8 2h8"/><path d="M9 2v2.78c0 .88-.39 1.72-1.07 2.3l-2.73 2.34C4.45 10.14 4 11.23 4 12.38V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.62c0-1.15-.45-2.24-1.2-2.96l-2.73-2.34A3.5 3.5 0 0 1 15 4.78V2"/><path d="M6 17h12"/><path d="M6 12h12"/>`,
    Egg: `<path d="M12 22a8 8 0 0 0 8-8c0-5.5-3.5-12-8-12S4 8.5 4 14a8 8 0 0 0 8 8Z"/>`,
    Shield: `<path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8.24-2.18a1 1 0 0 1 .48 0l8.24 2.18A1 1 0 0 1 20 6z"/>`,
    Trees: `<path d="M10 10v.2A3 3 0 0 1 8.9 16H4.1A3 3 0 0 1 3 10.2V10a4 4 0 0 1 7.7-1.5 3 3 0 0 1 3.5 4.5A3.9 3.9 0 0 1 10 10z"/><path d="M18 14v.2a3 3 0 0 1-1.1 5.8h-4.8a3 3 0 0 1-1.1-5.8v-.2a4 4 0 0 1 7.7-1.5 3 3 0 0 1 3.5 4.5A3.9 3.9 0 0 1 18 14z"/><path d="M7 16v6"/><path d="M15 19v3"/>`,
    Sprout: `<path d="M7 20h10"/><path d="M10 20c5.5-2.5 7-7.5 7-12"/><path d="M13 6c-3.5 1-6.5 4.5-6.5 9c0 .7.1 1.3.2 2"/><path d="M9 10c-1.5-1.5-2.5-4-2-6.5C8 4.5 9 6.5 9 10z"/>`,
    Leaf: `<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-13.9.2"/><path d="M9 22v-4h4"/>`,
    School: `<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>`,
    Compass: `<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>`,
    HeartPulse: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h3.16"/>`,
    Bus: `<path d="M8 6v6"/><path d="M15 6v6"/><rect width="16" height="12" x="4" y="4" rx="2"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/><path d="M10 16H8v-2h2Z"/><path d="M16 16h-2v-2h2Z"/>`,
    ShieldAlert: `<path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8.24-2.18a1 1 0 0 1 .48 0l8.24 2.18A1 1 0 0 1 20 6z"/><path d="M12 8v4"/><path d="M12 16h.01"/>`,
    Tent: `<path d="M19 21 12 4 5 21"/><path d="M12 4v17"/><path d="m10 14 2-3 2 3"/><path d="M12 11h.01"/><path d="M2 21h20"/>`,
    Footprints: `<path d="M4 16v-2.38C4 11.5 5.88 9.85 6 7.07l.09-1.76A1.4 1.4 0 0 1 7.5 4c.8 0 1.43.6 1.49 1.4l.17 2.18C9.33 10.15 8.1 11.8 8.1 13.92V16"/><path d="M12 18v-2.38c0-2.12 1.88-3.77 2-6.55l.09-1.76A1.4 1.4 0 0 1 15.5 6c.8 0 1.43.6 1.49 1.4l.17 2.18c.17 2.57-1.06 4.22-1.06 6.34V18"/><path d="M16 20h.01"/><path d="M8 18h.01"/>`,
    CupSoda: `<path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15h10"/><path d="m15 8-2-6h-2L9 8"/>`
  };

  const pathStr = paths[iconName] || paths['Compass'];
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      ${pathStr}
    </svg>
  `;
};

export default function InteractiveMap() {
  // Theme and category selections
  const [selectedCategory, setSelectedCategory] = useState<'administrasi' | 'umkm' | 'peternakan' | 'pertanian' | 'fasilitas' | 'evakuasi' | 'wisata'>('administrasi');
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Measuring tool states
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measuredPoints, setMeasuredPoints] = useState<L.LatLng[]>([]);
  const [measuredDistance, setMeasuredDistance] = useState(0);

  // Map settings
  const [baseLayer, setBaseLayer] = useState<'street' | 'dark' | 'satellite'>('street');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false); // Mobile drawer view

  // Map reference holders
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const overlaysLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const measureLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const activeCategoryConfig = useMemo(() => {
    return MAP_CATEGORIES.find(cat => cat.id === selectedCategory) || MAP_CATEGORIES[0];
  }, [selectedCategory]);

  // Map core initialization (Run once on mount)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map centered at Pakintelan
    const map = L.map(mapContainerRef.current, {
      center: [-7.09203, 110.39348],
      zoom: 15,
      zoomControl: false, // Customized placement later
      attributionControl: false
    });

    mapRef.current = map;

    // Add scale indicator
    L.control.scale({ position: 'bottomright' }).addTo(map);

    // Setup base layer tile
    const getTileUrl = (style: typeof baseLayer) => {
      switch (style) {
        case 'dark':
          return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        case 'satellite':
          return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        default: // street / voyager
          return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      }
    };

    const tileLayer = L.tileLayer(getTileUrl(baseLayer), {
      maxZoom: 19,
      attribution: '© OpenStreetMap, © CartoDB, © Esri'
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Initialize layered overlays groups
    const overlaysGroup = L.layerGroup().addTo(map);
    overlaysLayerGroupRef.current = overlaysGroup;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = markersGroup;

    const measureGroup = L.layerGroup().addTo(map);
    measureLayerGroupRef.current = measureGroup;

    // Custom ZOOM controls placement
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Map Click Handler for measuring tool
    map.on('click', (e: L.LeafletMouseEvent) => {
      // Avoid firing if click originated on markers
      const target = e.originalEvent.target as HTMLElement;
      if (target.closest('.leaflet-marker-icon')) return;

      // Handle Distance Measurement
      if ((window as any).isMeasuringMode) {
        setMeasuredPoints(prev => {
          const next = [...prev, e.latlng];
          // Calculate running distance
          let dist = 0;
          for (let i = 0; i < next.length - 1; i++) {
            dist += next[i].distanceTo(next[i + 1]);
          }
          setMeasuredDistance(dist);
          return next;
        });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update tile layer style dynamically
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const tileUrls = {
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      street: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    };
    tileLayerRef.current.setUrl(tileUrls[baseLayer]);
  }, [baseLayer]);

  // Bind measurement state to window to bypass Leaflet event closure limits
  useEffect(() => {
    (window as any).isMeasuringMode = isMeasuring;
  }, [isMeasuring]);

  // Invalidate Map Size after transition ends to prevent gray panels
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 300); // 300ms matches CSS sidebar transition duration
    return () => clearTimeout(timer);
  }, [sidebarOpen]);

  // Filtered POIs based on Category & Search Query
  const filteredPOIs = useMemo(() => {
    return MAP_POIS.filter(poi => {
      const matchCategory = poi.category === selectedCategory;
      const matchSearch = searchQuery
        ? poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          poi.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Draw Thematic Overlays (boundaries, zones, roads) & Category Markers
  useEffect(() => {
    const map = mapRef.current;
    const markersGroup = markersLayerGroupRef.current;
    const overlaysGroup = overlaysLayerGroupRef.current;
    if (!map || !markersGroup || !overlaysGroup) return;

    // Clear previous elements
    markersGroup.clearLayers();
    overlaysGroup.clearLayers();

    const activeColor = activeCategoryConfig.markerColor;

    // 1. Render Overlays depending on selected theme
    if (selectedCategory === 'administrasi') {
      // Precise boundaries of Kelurahan Pakintelan from OpenStreetMap boundary coordinates
      const boundaryPolygon = L.polygon(BOUNDARY_PAKINTELAN as L.LatLngExpression[], {
        color: '#6366f1',
        weight: 3.5,
        fillColor: '#6366f1',
        fillOpacity: 0.08,
        dashArray: '3, 6'
      }).addTo(overlaysGroup);
      
      boundaryPolygon.bindTooltip('Batas Administratif Kel. Pakintelan (OSM)', { sticky: true });
      
      // Auto fit bounds on initial load of administrasi tab to showcase boundary
      if (BOUNDARY_PAKINTELAN.length > 0) {
        map.fitBounds(boundaryPolygon.getBounds(), { padding: [20, 20], maxZoom: 15 });
      }
    } else if (selectedCategory === 'umkm') {
      // UMKM Zoning cluster
      const umkmZone = L.polygon(ZONE_UMKM as L.LatLngExpression[], {
        color: '#f59e0b',
        weight: 2,
        fillColor: '#f59e0b',
        fillOpacity: 0.12
      }).addTo(overlaysGroup);
      umkmZone.bindTooltip('Sentra Klaster Industri Rumah Tangga & UMKM', { sticky: true });
    } else if (selectedCategory === 'peternakan') {
      // Husbandry zones
      const peternakanZone = L.polygon(ZONE_PETERNAKAN as L.LatLngExpression[], {
        color: '#84cc16',
        weight: 2,
        fillColor: '#84cc16',
        fillOpacity: 0.12
      }).addTo(overlaysGroup);
      peternakanZone.bindTooltip('Kawasan Peternakan Komunal Warga', { sticky: true });
    } else if (selectedCategory === 'pertanian') {
      // Agriculture lands
      const pertanianZone = L.polygon(ZONE_PERTANIAN as L.LatLngExpression[], {
        color: '#10b981',
        weight: 2,
        fillColor: '#10b981',
        fillOpacity: 0.12
      }).addTo(overlaysGroup);
      pertanianZone.bindTooltip('Kawasan Persawahan & Agro Perkebunan', { sticky: true });
    } else if (selectedCategory === 'evakuasi') {
      // Evacuation routes polylines
      const route1 = L.polyline(EVACUATION_ROUTE_1 as L.LatLngExpression[], {
        color: '#ef4444',
        weight: 4,
        dashArray: '5, 10',
        opacity: 0.85
      }).addTo(overlaysGroup);
      route1.bindTooltip('Rute Evakuasi 1 (Ke Lapangan Bola)', { sticky: true });

      const route2 = L.polyline(EVACUATION_ROUTE_2 as L.LatLngExpression[], {
        color: '#ea580c',
        weight: 4,
        dashArray: '5, 10',
        opacity: 0.85
      }).addTo(overlaysGroup);
      route2.bindTooltip('Rute Evakuasi 2 (Ke Kantor Kelurahan)', { sticky: true });
    } else if (selectedCategory === 'wisata') {
      // Tourism trail polyline
      const tourTrail = L.polyline(TOURISM_TRAIL as L.LatLngExpression[], {
        color: '#f43f5e',
        weight: 3,
        opacity: 0.7
      }).addTo(overlaysGroup);
      tourTrail.bindTooltip('Jalur Rekomendasi Destinasi Wisata Pakintelan', { sticky: true });
    }

    // 2. Render Markers for active category
    filteredPOIs.forEach(poi => {
      // Generate custom HTML div icon
      const iconHtml = `
        <div class="custom-marker">
          <div class="marker-pulse-ring"></div>
          <div class="marker-pin-wrapper" style="background-color: ${activeColor};">
            <span class="marker-icon-inner" style="color: white;">
              ${getIconSvg(poi.icon)}
            </span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'marker-leaflet-custom',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([poi.lat, poi.lng], { icon: customIcon }).addTo(markersGroup);

      // Popup Content Layout
      const popupContent = `
        <div class="p-1 font-sans">
          <h4 class="font-bold text-base text-zinc-900 dark:text-white leading-tight mb-1">${poi.name}</h4>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-2">${poi.description}</p>
          <button class="w-full text-center text-xs py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors popup-action-btn">
            Lihat Informasi Detail
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 260 });

      // Click to focus and show sidebar details
      marker.on('click', () => {
        setSelectedPOI(poi);
        setDrawerOpen(true); // Open drawer on mobile
        map.setView([poi.lat - 0.001, poi.lng], 16); // Center slightly lower for popup spacing
      });

      // Handle popup action button click
      marker.on('popupopen', () => {
        const btn = document.querySelector('.popup-action-btn');
        if (btn) {
          btn.addEventListener('click', () => {
            setSelectedPOI(poi);
            setDrawerOpen(true);
            map.closePopup();
          });
        }
      });
    });

  }, [filteredPOIs, selectedCategory, activeCategoryConfig]);

  // Handle Measurement Layer Drawing (Dynamic rendering of clicked points)
  useEffect(() => {
    const map = mapRef.current;
    const measureGroup = measureLayerGroupRef.current;
    if (!map || !measureGroup) return;

    measureGroup.clearLayers();

    if (measuredPoints.length === 0) return;

    // Draw markers at each click point
    measuredPoints.forEach((pt, idx) => {
      const idxIcon = L.divIcon({
        html: `<div class="w-5 h-5 flex items-center justify-center bg-indigo-600 border border-white text-white rounded-full text-[10px] font-bold shadow-md shadow-black/20">${idx + 1}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      L.marker([pt.lat, pt.lng], { icon: idxIcon }).addTo(measureGroup);
    });

    // Draw dashed lines between points
    if (measuredPoints.length > 1) {
      L.polyline(measuredPoints, {
        color: '#6366f1',
        weight: 3,
        className: 'measuring-line',
        opacity: 0.9
      }).addTo(measureGroup);

      // Create a nice floating popup showing total distance at the last point
      const lastPoint = measuredPoints[measuredPoints.length - 1];
      const distStr = measuredDistance < 1000 
        ? `${measuredDistance.toFixed(1)} m` 
        : `${(measuredDistance / 1000).toFixed(2)} km`;

      L.popup({ closeButton: false, autoClose: false, closeOnClick: false })
        .setLatLng(lastPoint)
        .setContent(`<div class="font-bold text-indigo-600 dark:text-indigo-400 text-xs px-1">Jarak: ${distStr}</div>`)
        .openOn(map);
    }
  }, [measuredPoints, measuredDistance]);

  // Fly to point helper
  const handleSelectPOI = (poi: MapPOI) => {
    setSelectedPOI(poi);
    setDrawerOpen(true);
    const map = mapRef.current;
    if (map) {
      map.flyTo([poi.lat, poi.lng], 16, { animate: true, duration: 1.5 });
    }
  };

  // Reset/Clear measuring points
  const handleClearMeasure = () => {
    setMeasuredPoints([]);
    setMeasuredDistance(0);
    const map = mapRef.current;
    if (map) {
      map.closePopup();
    }
  };

  // Sidebar contents markup (Shared between desktop and mobile layouts)
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

      {/* Category Horizontal Scroll Tab */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 no-scrollbar">
        {MAP_CATEGORIES.map(cat => {
          const Icon = IconComponents[cat.icon] || Compass;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedPOI(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected 
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md shadow-black/10 scale-105' 
                  : 'bg-white dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Category Context Info */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10">
        <h2 className="font-bold text-sm flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: activeCategoryConfig.markerColor }} />
          Tema: {activeCategoryConfig.name}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
          {activeCategoryConfig.description}
        </p>
        
        {/* Quick Statistics */}
        <div className="grid grid-cols-3 gap-2">
          {activeCategoryConfig.stats.map((stat, i) => (
            <div key={i} className="p-2 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-150 dark:border-zinc-850 text-center">
              <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">{stat.label}</span>
              <span className="block text-xs font-bold mt-0.5">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search POIs */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder={`Cari di kategori ${activeCategoryConfig.name}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder-zinc-400"
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
            return (
              <div
                key={poi.id}
                onClick={() => handleSelectPOI(poi)}
                className={`group flex items-start gap-3 p-3 rounded-2xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-zinc-100/80 dark:bg-zinc-800/80 border-zinc-350 dark:border-zinc-700 shadow-sm scale-[0.99]'
                    : 'bg-white dark:bg-zinc-850 border-zinc-150 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/30'
                }`}
              >
                <div 
                  className="p-2.5 rounded-xl text-white mt-0.5 shadow-sm shadow-black/10 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: activeCategoryConfig.markerColor }}
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

  return (
    <div className="flex flex-col md:flex-row flex-1 h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 relative">
      
      {/* 1A. DESKTOP SIDEBAR (Slide transition with width adjustments to prevent overlapping content) */}
      <aside className={`hidden md:flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 z-20 ${
        sidebarOpen ? 'w-[380px] opacity-100' : 'w-0 opacity-0 overflow-hidden border-r-0'
      }`}>
        {sidebarContent}
      </aside>

      {/* 1B. MOBILE SIDEBAR (Fully overlay fixed translate-x layout) */}
      <aside className={`md:hidden fixed top-0 left-0 h-full w-full sm:w-[380px] z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </aside>

      {/* 2. MAIN CONTAINER: Map Canvas & Toolbar */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden z-10">
        
        {/* TOP FLOATING CONTROLS PANEL */}
        <header className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between gap-3 pointer-events-none">
          
          {/* Collapse/Reopen Sidebar button */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-200 flex items-center justify-center transition-all cursor-pointer"
              title="Toggle Sidebar"
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Current Thematic indicator (when sidebar closed) */}
            {!sidebarOpen && (
              <div className="px-4 py-2.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl flex items-center gap-2 animate-fade-in">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: activeCategoryConfig.markerColor }} />
                <span className="text-xs font-bold uppercase tracking-wider">{activeCategoryConfig.name}</span>
              </div>
            )}
          </div>

          {/* Interactive Tools Panel */}
          <div className="flex items-center gap-2 pointer-events-auto">
            
            {/* Measuring Tool Toggle */}
            <button
              onClick={() => {
                setIsMeasuring(!isMeasuring);
                handleClearMeasure();
              }}
              className={`p-2.5 rounded-xl border flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                isMeasuring 
                  ? 'bg-indigo-600 border-indigo-700 text-white ring-4 ring-indigo-500/20' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850'
              }`}
              title="Ukur Jarak Antar Titik"
            >
              <Ruler className="w-4.5 h-4.5" />
            </button>

            {/* Layer style selector */}
            <div className="relative group">
              <button
                className="p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850 flex items-center justify-center cursor-pointer"
                title="Pilih Style Peta"
              >
                <Layers className="w-4.5 h-4.5" />
              </button>
              
              <div className="absolute right-0 top-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 w-36 hidden group-hover:block hover:block flex-col space-y-1 transition-all z-50">
                <button
                  onClick={() => setBaseLayer('street')}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${baseLayer === 'street' ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400' : 'hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400'}`}
                >
                  Peta Jalan
                </button>
                <button
                  onClick={() => setBaseLayer('dark')}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${baseLayer === 'dark' ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400' : 'hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400'}`}
                >
                  Tema Gelap
                </button>
                <button
                  onClick={() => setBaseLayer('satellite')}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${baseLayer === 'satellite' ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400' : 'hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400'}`}
                >
                  Satelit
                </button>
              </div>
            </div>

          </div>
        </header>

        {/* ACTIVE MEASURING STATUS NOTIFICATION BANNER */}
        {isMeasuring && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2.5 backdrop-blur-md animate-bounce border border-indigo-500">
            <Ruler className="w-4 h-4" />
            <span>Mode Ukur Aktif: Klik beberapa titik di peta.</span>
            {measuredPoints.length > 0 && (
              <button 
                onClick={handleClearMeasure}
                className="bg-white/20 hover:bg-white/35 rounded-full p-1 transition-colors cursor-pointer"
                title="Reset Ukuran"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* THE LEAFLET MAP ELEMENT CONTAINER */}
        <div 
          ref={mapContainerRef} 
          className="flex-1 w-full h-full outline-none z-10" 
        />

        {/* FLOATING MEASUREMENT STATS OVERLAY CARD */}
        {isMeasuring && measuredPoints.length > 0 && (
          <div className="absolute bottom-20 left-4 z-40 p-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-xs flex flex-col space-y-2 text-xs">
            <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-sm">
              <Ruler className="w-4 h-4 text-indigo-600" />
              <span>Detail Jarak Pengukuran</span>
            </div>
            <div className="flex flex-col space-y-1.5 font-medium">
              <div className="flex justify-between">
                <span className="text-zinc-500">Titik Terhubung:</span>
                <span>{measuredPoints.length} Titik</span>
              </div>
              <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                <span>Total Jarak:</span>
                <span>{measuredDistance < 1000 ? `${measuredDistance.toFixed(1)} m` : `${(measuredDistance / 1000).toFixed(2)} km`}</span>
              </div>
            </div>
            <button
              onClick={handleClearMeasure}
              className="w-full text-center py-2 bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/35 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl transition-all cursor-pointer"
            >
              Hapus Garis Ukur
            </button>
          </div>
        )}

        {/* 3. DETAILS CARD (DESKTOP): Floating Right Sidebar */}
        {selectedPOI && sidebarOpen && (
          <div className="hidden lg:flex absolute top-4 right-4 bottom-4 w-96 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex-col overflow-hidden animate-slide-in">
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
                className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description & Details Info */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Deskripsi</span>
                <p className="mt-1 text-zinc-650 dark:text-zinc-300 leading-relaxed font-semibold">
                  {selectedPOI.description}
                </p>
              </div>

              {/* Attributes fields rendering */}
              <div className="border-t border-zinc-150 dark:border-zinc-800 pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">Informasi Detail</span>
                <div className="space-y-2">
                  {Object.entries(selectedPOI.details).map(([key, val]) => (
                    <div key={key} className="bg-zinc-50 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-850 flex flex-col">
                      <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">{key}</span>
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 leading-relaxed">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA action buttons footer */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPOI.lat},${selectedPOI.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-2xl flex items-center justify-center gap-2 text-xs transition-colors shadow-lg shadow-black/5 cursor-pointer"
              >
                <Navigation className="w-4.5 h-4.5" />
                Petunjuk Arah (Navigasi)
              </a>
            </div>
          </div>
        )}

      </main>

      {/* 4. DETAILS DRAWER (MOBILE): Bottom Slidable Sheet Panel */}
      {selectedPOI && (
        <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 rounded-t-[2.5rem] shadow-2xl transition-transform duration-300 max-h-[75vh] flex flex-col ${drawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          {/* Drag handle area */}
          <div className="w-full flex justify-center py-3" onClick={() => setDrawerOpen(false)}>
            <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer" />
          </div>

          <div className="p-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850">
            <div>
              <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border border-indigo-200/20">
                {selectedPOI.category}
              </span>
              <h2 className="font-extrabold text-base mt-1 text-zinc-900 dark:text-white leading-tight">{selectedPOI.name}</h2>
            </div>
            <button
              onClick={() => setSelectedPOI(null)}
              className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 dark:text-zinc-400 cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Deskripsi</span>
              <p className="mt-1 text-xs text-zinc-650 dark:text-zinc-300 leading-relaxed font-semibold">
                {selectedPOI.description}
              </p>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">Informasi Detail</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(selectedPOI.details).map(([key, val]) => (
                  <div key={key} className="bg-zinc-50 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-850 flex flex-col">
                    <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">{key}</span>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 leading-relaxed">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex pb-6">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPOI.lat},${selectedPOI.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              Petunjuk Arah (Navigasi)
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
