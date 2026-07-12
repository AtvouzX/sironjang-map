'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, Ruler, RefreshCw, MapPin, Layers } from 'lucide-react';
import {
  BOUNDARY_PAKINTELAN,
  DEFAULT_CATEGORIES,
  DEFAULT_POIS,
  DEFAULT_ZONES,
  MapPOI,
  MapCategory,
  MapZone
} from '@/data/mapData';
import { supabase } from '@/lib/supabaseClient';
import Sidebar from './map/Sidebar';
import HeaderControls from './map/HeaderControls';
import DetailsCard from './map/DetailsCard';
import DetailsDrawer from './map/DetailsDrawer';
import LoginModal from './map/LoginModal';
import CategoryFormModal from './map/CategoryFormModal';
import POIFormModal from './map/POIFormModal';
import ZoneFormModal from './map/ZoneFormModal';
import Legend from './map/Legend';

// Fix Leaflet default marker icon 404 errors by overriding with transparent 1x1 pixel data URL
if (typeof window !== 'undefined') {
  const transparentPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  L.Icon.Default.prototype._getIconUrl = () => transparentPixel;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: transparentPixel,
    iconUrl: transparentPixel,
    shadowUrl: transparentPixel,
  });
}

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
    CupSoda: `<path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15h10"/><path d="m15 8-2-6h-2L9 8"/>`,
    MapPin: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`
  };

  const pathStr = paths[iconName] || paths['Compass'];
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      ${pathStr}
    </svg>
  `;
};

export default function InteractiveMap() {
  // Dynamic Map Data states loaded from Supabase
  const [categories, setCategories] = useState<MapCategory[]>([]);
  const [pois, setPois] = useState<MapPOI[]>([]);
  const [zones, setZones] = useState<MapZone[]>([]);
  
  // Theme and category selections
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown states & refs for mobile accessibility
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [layersDropdownOpen, setLayersDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const layersDropdownRef = useRef<HTMLDivElement>(null);

  // Admin authentication states
  const [user, setUser] = useState<any>(null);
  
  // Modals Open/Close triggers
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isPOIFormOpen, setIsPOIFormOpen] = useState(false);
  const [isZoneFormOpen, setIsZoneFormOpen] = useState(false);

  // Targets to edit
  const [categoryToEdit, setCategoryToEdit] = useState<MapCategory | null>(null);
  const [poiToEdit, setPoiToEdit] = useState<MapPOI | null>(null);
  const [zoneToEdit, setZoneToEdit] = useState<MapZone | null>(null);

  // Picking & Drawing Coordinates tools
  const [pickingLatLng, setPickingLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [isPickingActive, setIsPickingActive] = useState(false);
  const [drawnCoordinates, setDrawnCoordinates] = useState<[number, number][]>([]);
  const [isDrawingActive, setIsDrawingActive] = useState(false);

  // GeoJSON Base Feature Layers (Rivers, Roads, RW limits)
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [showGeojsonLayer, setShowGeojsonLayer] = useState(true);
  const [showRiver, setShowRiver] = useState(true);
  const [showMainRoad, setShowMainRoad] = useState(true);
  const [showLocalRoad, setShowLocalRoad] = useState(true);
  // Batas Kelurahan is always visible and cannot be disabled
  const showKelurahanBoundary = true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setShowKelurahanBoundary = (_: boolean) => {};
  const [showRWBoundary, setShowRWBoundary] = useState(true);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(target)) {
        setThemeDropdownOpen(false);
      }
      if (layersDropdownRef.current && !layersDropdownRef.current.contains(target)) {
        setLayersDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Measuring tool states
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measuredPoints, setMeasuredPoints] = useState<L.LatLng[]>([]);
  const [measuredDistance, setMeasuredDistance] = useState(0);

  // Theme settings
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Map settings
  const [baseLayer, setBaseLayer] = useState<'street' | 'dark' | 'satellite'>('street');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false); // Mobile drawer view

  // Load Map Data from Supabase
  const fetchMapData = async () => {
    try {
      // 1. Fetch categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (catError) throw catError;

      // 2. Fetch pois
      const { data: poiData, error: poiError } = await supabase
        .from('pois')
        .select('*')
        .order('created_at', { ascending: true });

      if (poiError) throw poiError;

      // 3. Fetch zones
      const { data: zoneData, error: zoneError } = await supabase
        .from('zones')
        .select('*')
        .order('created_at', { ascending: true });

      if (zoneError) throw zoneError;

      // Format categories matching app prop casing
      const formattedCats: MapCategory[] = (catData || []).map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        markerColor: cat.marker_color,
        icon: cat.icon,
        description: cat.description,
        stats: cat.stats || []
      }));

      setCategories(formattedCats);
      setPois(poiData || []);
      setZones(zoneData || []);

      // Autoselect first category if none is selected
      if (formattedCats.length > 0 && selectedCategories.length === 0) {
        setSelectedCategories([formattedCats[0].id]);
      }
    } catch (err) {
      console.error('Terjadi kesalahan saat memuat data peta dari Supabase:', err);
    }
  };

  // Auth session tracking
  useEffect(() => {
    fetchMapData();

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync window listeners for Leaflet events
  useEffect(() => {
    (window as any).isPickingMode = isPickingActive;
  }, [isPickingActive]);

  useEffect(() => {
    (window as any).isDrawingMode = isDrawingActive;
  }, [isDrawingActive]);

  // Load static GeoJSON feature data on mount
  useEffect(() => {
    fetch('/pakintelan.geojson')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load GeoJSON');
        return res.json();
      })
      .then(data => {
        setGeojsonData(data);
      })
      .catch(err => {
        console.error('Error loading GeoJSON base layer:', err);
      });
  }, []);

  // Manage map cursor class name dynamically to prevent React from overwriting Leaflet classes
  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return;

    if (isPickingActive || isDrawingActive) {
      mapContainer.classList.add('cursor-crosshair');
    } else {
      mapContainer.classList.remove('cursor-crosshair');
    }
  }, [isPickingActive, isDrawingActive]);

  useEffect(() => {
    (window as any).setPickedCoordinates = (latlng: L.LatLng) => {
      setPickingLatLng({ lat: latlng.lat, lng: latlng.lng });
      setIsPickingActive(false);
      setIsPOIFormOpen(true);
    };
    (window as any).stopPickingMode = () => {
      setIsPickingActive(false);
    };
    (window as any).appendDrawnCoordinate = (coord: [number, number]) => {
      setDrawnCoordinates(prev => [...prev, coord]);
    };
  }, []);

  // Load theme from localStorage on mount and adjust sidebar for mobile screens
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      setBaseLayer(savedTheme === 'dark' ? 'dark' : 'street');
    }
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  // Update theme class and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Map reference holders
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const overlaysLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const measureLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const hasFitBoundsRef = useRef(false);
  const geojsonLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

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
        default: // street
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

    const geojsonGroup = L.layerGroup().addTo(map);
    geojsonLayerGroupRef.current = geojsonGroup;

    // Custom ZOOM controls placement
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Map Click Handler for tools (measuring, coordinate picking, zone drawing)
    map.on('click', (e: L.LeafletMouseEvent) => {
      const target = e.originalEvent?.target as HTMLElement | undefined;
      if (target && typeof target.closest === 'function' && target.closest('.leaflet-marker-icon')) return;

      // 1. Handle Coordinate Picking
      if ((window as any).isPickingMode) {
        (window as any).setPickedCoordinates(e.latlng);
        return;
      }

      // 2. Handle Zone Polygon Drawing
      if ((window as any).isDrawingMode) {
        (window as any).appendDrawnCoordinate([e.latlng.lat, e.latlng.lng]);
        return;
      }

      // 3. Handle Distance Measurement
      if ((window as any).isMeasuringMode) {
        setMeasuredPoints(prev => {
          const next = [...prev, e.latlng];
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

  // Render GeoJSON features (rivers, roads, administrative limits)
  useEffect(() => {
    const map = mapRef.current;
    const geojsonGroup = geojsonLayerGroupRef.current;
    if (!map || !geojsonGroup) return;

    geojsonGroup.clearLayers();

    if (!showGeojsonLayer || !geojsonData) {
      // Even when master overlay is off, still render the kelurahan boundary
      const kelurahanFeature = geojsonData?.features?.find((f: any) =>
        (f.properties?.boundary === 'administrative' || f.properties?.type === 'boundary') &&
        f.properties?.admin_level === '7'
      );
      if (kelurahanFeature) {
        L.geoJSON(kelurahanFeature, {
          style: () => ({
            color: '#6366f1',
            weight: 3,
            dashArray: '3, 6',
            fillColor: '#6366f1',
            fillOpacity: 0.03
          })
        }).addTo(geojsonGroup);
      }
      return;
    }

    L.geoJSON(geojsonData, {
      filter: (feature: any) => {
        const props = feature.properties || {};
        
        // 1. Sungai (River / Waterway)
        if (props.waterway) {
          return showRiver;
        }
        
        // 2. Jalan (Highway)
        if (props.highway) {
          if (props.highway === 'secondary') {
            return showMainRoad;
          }
          return showLocalRoad;
        }
        
        // 3. Batas Wilayah (Boundary)
        if (props.boundary === 'administrative' || props.type === 'boundary') {
          if (props.admin_level === '7') {
            return showKelurahanBoundary;
          }
          if (props.admin_level === '9') {
            return showRWBoundary;
          }
        }
        
        return true;
      },
      style: (feature: any) => {
        const props = feature.properties || {};
        
        // 1. Sungai
        if (props.waterway) {
          return {
            color: '#38bdf8', // Light sky blue
            weight: 4.5,
            opacity: 0.85,
            lineCap: 'round',
            lineJoin: 'round'
          };
        }
        
        // 2. Jalan
        if (props.highway) {
          if (props.highway === 'secondary') {
            return {
              color: '#ea580c', // Bright orange (Main Road)
              weight: 3.5,
              opacity: 0.8
            };
          }
          // Jalan lokal / gang
          return {
            color: '#9ca3af', // Gray road line
            weight: 2,
            opacity: 0.7
          };
        }
        
        // 3. Batas Wilayah
        if (props.boundary === 'administrative' || props.type === 'boundary') {
          if (props.admin_level === '7') {
            return {
              color: '#6366f1', // Indigo (Kelurahan Boundary)
              weight: 3,
              dashArray: '3, 6',
              fillColor: '#6366f1',
              fillOpacity: 0.03
            };
          }
          if (props.admin_level === '9') {
            return {
              color: '#ec4899', // Pink (RW Boundary)
              weight: 1.5,
              dashArray: '4, 6',
              fillColor: 'transparent',
              fillOpacity: 0
            };
          }
        }
        
        return {
          color: '#9ca3af',
          weight: 1
        };
      },
      onEachFeature: (feature: any, layer: any) => {
        const props = feature.properties || {};
        if (props.name) {
          let tooltipContent = `<div class="p-1 text-xs"><strong>${props.name}</strong>`;
          if (props.description) {
            tooltipContent += `<br/><span class="text-[10px] text-zinc-550">${props.description}</span>`;
          } else if (props.highway) {
            tooltipContent += `<br/><span class="text-[10px] text-zinc-500 font-semibold uppercase">Tipe: Jalan ${props.highway}</span>`;
          } else if (props.waterway) {
            tooltipContent += `<br/><span class="text-[10px] text-zinc-500 font-semibold uppercase">Tipe: Air ${props.waterway}</span>`;
          }
          tooltipContent += `</div>`;
          layer.bindTooltip(tooltipContent, {
            sticky: true,
            className: 'backdrop-blur-md bg-white/95 border border-zinc-200 rounded-xl shadow-xl'
          });
        }
      }
    }).addTo(geojsonGroup);
  }, [geojsonData, showGeojsonLayer, theme, showRiver, showMainRoad, showLocalRoad, showKelurahanBoundary, showRWBoundary]);

  // Invalidate Map Size after transition ends to prevent gray panels
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [sidebarOpen]);

  // Filtered POIs based on Category & Search Query
  const filteredPOIs = useMemo(() => {
    return pois.filter(poi => {
      const matchCategory = selectedCategories.includes(poi.category);
      const matchSearch = searchQuery
        ? poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchCategory && matchSearch;
    });
  }, [pois, selectedCategories, searchQuery]);

  // Admin delete actions
  const handleDeletePOI = async (poiId: string) => {
    try {
      const { error } = await supabase
        .from('pois')
        .delete()
        .eq('id', poiId);

      if (error) throw error;
      setSelectedPOI(null);
      fetchMapData();
    } catch (err: any) {
      alert('Gagal menghapus lokasi: ' + err.message);
    }
  };

  const handleDeleteZone = async (zoneId: string) => {
    try {
      const { error } = await supabase
        .from('zones')
        .delete()
        .eq('id', zoneId);

      if (error) throw error;
      fetchMapData();
    } catch (err: any) {
      alert('Gagal menghapus area zona: ' + err.message);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!window.confirm('PERINGATAN: Menghapus kategori ini juga akan menghapus semua data lokasi (POI) dan area zona terkait di bawah kategori ini secara permanen. Apakah Anda yakin?')) return;
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', catId);

      if (error) throw error;

      // Clear from selected filter
      setSelectedCategories(prev => prev.filter(id => id !== catId));
      setSelectedPOI(null);
      fetchMapData();
    } catch (err: any) {
      alert('Gagal menghapus kategori: ' + err.message);
    }
  };

  // Seeding default map data into Supabase
  const handleImportDefaultData = async () => {
    if (!user) return;
    if (!window.confirm('Apakah Anda yakin ingin mengimpor data default? Aksi ini akan menulis ulang kategori, POI, dan wilayah zona asli ke database Supabase Anda.')) return;

    try {
      // 1. Format categories payload for DB
      const dbCategories = DEFAULT_CATEGORIES.map(cat => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        marker_color: cat.markerColor,
        icon: cat.icon,
        description: cat.description,
        stats: cat.stats || []
      }));

      // Upsert categories
      const { error: catErr } = await supabase.from('categories').upsert(dbCategories);
      if (catErr) throw catErr;

      // 2. Format POIs (clear specific default IDs to write fresh or upsert)
      const { error: poiErr } = await supabase.from('pois').upsert(DEFAULT_POIS);
      if (poiErr) throw poiErr;

      // 3. Insert DEFAULT_ZONES
      const { error: zoneErr } = await supabase.from('zones').insert(DEFAULT_ZONES);
      if (zoneErr) throw zoneErr;

      alert('Sukses memuat data default ke Supabase!');
      fetchMapData();
    } catch (err: any) {
      console.error(err);
      alert('Gagal mengimpor data default: ' + (err.message || err));
    }
  };

  // Draw Dynamic Zones & POI markers on map updates
  useEffect(() => {
    const map = mapRef.current;
    const markersGroup = markersLayerGroupRef.current;
    const overlaysGroup = overlaysLayerGroupRef.current;
    if (!map || !markersGroup || !overlaysGroup) return;

    // Clear layers
    markersGroup.clearLayers();
    overlaysGroup.clearLayers();

    // Darkdim mask cover — use GeoJSON kelurahan boundary if available, fallback to BOUNDARY_PAKINTELAN
    const worldCoords = [
      [-90, -180],
      [-90, 180],
      [90, 180],
      [90, -180]
    ];

    // Extract kelurahan polygon from loaded GeoJSON data
    let kelurahanHole: [number, number][] = BOUNDARY_PAKINTELAN as [number, number][];
    if (geojsonData?.features) {
      const kelurahanFeature = geojsonData.features.find((f: any) =>
        (f.properties?.boundary === 'administrative' || f.properties?.type === 'boundary') &&
        f.properties?.admin_level === '7' &&
        f.geometry?.type === 'Polygon'
      );
      if (kelurahanFeature?.geometry?.coordinates?.[0]) {
        // GeoJSON coords are [lng, lat], Leaflet needs [lat, lng]
        kelurahanHole = kelurahanFeature.geometry.coordinates[0].map(
          ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
        );
      }
    }

    L.polygon([worldCoords, kelurahanHole] as L.LatLngExpression[][], {
      color: 'transparent',
      weight: 0,
      fillColor: theme === 'dark' ? '#09090b' : '#0f172a',
      fillOpacity: theme === 'dark' ? 0.65 : 0.45,
      interactive: false
    }).addTo(overlaysGroup);

    // Zoom-fit bounds on initial load
    if (BOUNDARY_PAKINTELAN.length > 0 && !hasFitBoundsRef.current) {
      const bounds = L.latLngBounds(BOUNDARY_PAKINTELAN as L.LatLngExpression[]);
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
      hasFitBoundsRef.current = true;
    }

    // 2. Draw active dynamic Area Zones fetched from Supabase
    zones.forEach(zone => {
      if (selectedCategories.includes(zone.category)) {
        const poly = L.polygon(zone.coordinates as L.LatLngExpression[], {
          color: zone.color,
          weight: 2.5,
          fillColor: zone.color,
          fillOpacity: 0.15
        }).addTo(overlaysGroup);

        poly.bindTooltip(zone.name, { sticky: true });

        // If admin logged in, enable direct popups to edit/delete zones
        if (user) {
          const popupDiv = document.createElement('div');
          popupDiv.className = 'p-1.5 font-sans';
          popupDiv.innerHTML = `
            <h4 class="font-extrabold text-xs text-zinc-900 dark:text-zinc-100 leading-tight mb-1">${zone.name}</h4>
            <p class="text-[9px] text-zinc-400 font-semibold mb-2">Area / Poligon Wilayah</p>
            <div class="flex gap-1.5 mt-1 border-t border-zinc-100 pt-1.5">
              <button class="flex-1 text-center py-1 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-[9px] font-bold cursor-pointer edit-zone-btn">Ubah</button>
              <button class="flex-1 text-center py-1 border border-red-200/50 hover:bg-red-50 text-red-500 rounded-lg text-[9px] font-bold cursor-pointer delete-zone-btn">Hapus</button>
            </div>
          `;

          poly.bindPopup(popupDiv, { maxWidth: 180 });
          poly.on('popupopen', () => {
            const editBtn = popupDiv.querySelector('.edit-zone-btn');
            const deleteBtn = popupDiv.querySelector('.delete-zone-btn');
            
            if (editBtn) {
              editBtn.addEventListener('click', () => {
                setZoneToEdit(zone);
                setIsZoneFormOpen(true);
                poly.closePopup();
              });
            }
            if (deleteBtn) {
              deleteBtn.addEventListener('click', () => {
                handleDeleteZone(zone.id!);
                poly.closePopup();
              });
            }
          });
        }
      }
    });

    // 3. Draw active POI markers
    filteredPOIs.forEach(poi => {
      const poiCategoryConfig = categories.find(cat => cat.id === poi.category) || categories[0];
      const activeColor = poiCategoryConfig?.markerColor || '#6366f1';

      // HTML div marker pin layout
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

      const popupContent = `
        <div class="p-1 font-sans">
          <h4 class="font-bold text-base text-zinc-900 dark:text-white leading-tight mb-1">${poi.name}</h4>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-2">${poi.description}</p>
          <button class="w-full text-center text-xs py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors popup-action-btn cursor-pointer">
            Detail
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 260 });

      marker.on('click', () => {
        const isMobile = window.innerWidth < 1024;
        if (!isMobile) {
          setSelectedPOI(poi);
        }
        map.setView([poi.lat - 0.001, poi.lng], 16);
      });

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

  }, [filteredPOIs, selectedCategories, categories, zones, user, theme, geojsonData]);

  // Handle Measurement and Custom Zone Drawing layers (visual line projections)
  useEffect(() => {
    const map = mapRef.current;
    const measureGroup = measureLayerGroupRef.current;
    if (!map || !measureGroup) return;

    measureGroup.clearLayers();

    // 1. Draw Distance Measurement Tool preview
    if (isMeasuring && measuredPoints.length > 0) {
      measuredPoints.forEach((pt, idx) => {
        const idxIcon = L.divIcon({
          html: `<div class="w-5 h-5 flex items-center justify-center bg-indigo-650 border border-white text-white rounded-full text-[10px] font-bold shadow-md">${idx + 1}</div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        L.marker([pt.lat, pt.lng], { icon: idxIcon }).addTo(measureGroup);
      });

      if (measuredPoints.length > 1) {
        L.polyline(measuredPoints, {
          color: '#6366f1',
          weight: 3,
          className: 'measuring-line',
          opacity: 0.9
        }).addTo(measureGroup);

        const lastPoint = measuredPoints[measuredPoints.length - 1];
        const distStr = measuredDistance < 1000
          ? `${measuredDistance.toFixed(1)} m`
          : `${(measuredDistance / 1000).toFixed(2)} km`;

        L.popup({ closeButton: false, autoClose: false, closeOnClick: false })
          .setLatLng(lastPoint)
          .setContent(`<div class="font-bold text-indigo-600 dark:text-indigo-400 text-xs px-1">Jarak: ${distStr}</div>`)
          .openOn(map);
      }
    }

    // 2. Draw Dynamic Zone Drawing Polygon preview
    if (isDrawingActive && drawnCoordinates.length > 0) {
      drawnCoordinates.forEach((pt, idx) => {
        const handleIcon = L.divIcon({
          html: `<div class="w-3.5 h-3.5 flex items-center justify-center bg-indigo-600 border-2 border-white text-white rounded-full text-[8px] font-extrabold shadow shadow-black/35">${idx + 1}</div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });
        L.marker(pt as L.LatLngExpression, { icon: handleIcon }).addTo(measureGroup);
      });

      if (drawnCoordinates.length > 1) {
        L.polygon(drawnCoordinates as L.LatLngExpression[], {
          color: '#6366f1',
          weight: 2.5,
          dashArray: '5, 8',
          fillColor: '#6366f1',
          fillOpacity: 0.12
        }).addTo(measureGroup);
      }
    }
  }, [measuredPoints, measuredDistance, isMeasuring, isDrawingActive, drawnCoordinates]);

  const handleSelectPOI = (poi: MapPOI) => {
    setSelectedPOI(poi);
    setDrawerOpen(true);
    const map = mapRef.current;
    if (map) {
      map.flyTo([poi.lat, poi.lng], 16, { animate: true, duration: 1.5 });
    }
  };

  const handleClearMeasure = () => {
    setMeasuredPoints([]);
    setMeasuredDistance(0);
    const map = mapRef.current;
    if (map) {
      map.closePopup();
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari akun admin?')) {
      await supabase.auth.signOut();
      setUser(null);
    }
  };

  const handleOpenEditCategory = (cat: MapCategory) => {
    setCategoryToEdit(cat);
    setIsCategoryFormOpen(true);
  };

  const handleOpenEditPOI = (poi: MapPOI) => {
    setPoiToEdit(poi);
    setIsPOIFormOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 relative">

      {/* Sidebar Navigation */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        setSelectedCategories={setSelectedCategories}
        selectedPOI={selectedPOI}
        handleSelectPOI={handleSelectPOI}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredPOIs={filteredPOIs}
        theme={theme}
        user={user}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onAddCategory={() => {
          setCategoryToEdit(null);
          setIsCategoryFormOpen(true);
        }}
        onAddPOI={() => {
          setPoiToEdit(null);
          setPickingLatLng(null);
          setIsPOIFormOpen(true);
        }}
        onAddZone={() => {
          setZoneToEdit(null);
          setDrawnCoordinates([]);
          setIsZoneFormOpen(true);
        }}
        onEditCategory={handleOpenEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onImportDefaultData={handleImportDefaultData}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden z-10">

        {/* Floating Controls Header */}
        <HeaderControls
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          setSelectedCategories={setSelectedCategories}
          themeDropdownOpen={themeDropdownOpen}
          setThemeDropdownOpen={setThemeDropdownOpen}
          layersDropdownOpen={layersDropdownOpen}
          setLayersDropdownOpen={setLayersDropdownOpen}
          themeDropdownRef={themeDropdownRef}
          layersDropdownRef={layersDropdownRef}
          isMeasuring={isMeasuring}
          setIsMeasuring={setIsMeasuring}
          handleClearMeasure={handleClearMeasure}
          baseLayer={baseLayer}
          setBaseLayer={setBaseLayer}
          theme={theme}
          setTheme={setTheme}
          showGeojsonLayer={showGeojsonLayer}
          setShowGeojsonLayer={setShowGeojsonLayer}
        />

        {/* ACTIVE MEASURING STATUS BANNER */}
        {isMeasuring && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2.5 backdrop-blur-md animate-bounce border border-indigo-500 select-none">
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

        {/* ACTIVE COORDINATE PICKING UX STATUS BANNER */}
        {isPickingActive && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-zinc-950/90 dark:bg-white/90 text-white dark:text-zinc-950 px-4 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2.5 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 animate-pulse select-none">
            <MapPin className="w-4.5 h-4.5 text-indigo-600 animate-bounce" />
            <span>Pilih Titik di Peta: Klik di peta untuk menyimpan koordinat.</span>
            <button
              onClick={() => {
                setIsPickingActive(false);
                setIsPOIFormOpen(true);
              }}
              className="px-2 py-0.5 border border-zinc-350 dark:border-zinc-700 bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 rounded-full text-[10px] cursor-pointer"
            >
              Batal
            </button>
          </div>
        )}

        {/* ACTIVE ZONE DRAWING UX STATUS BANNER */}
        {isDrawingActive && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-indigo-600 text-white px-4 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2.5 backdrop-blur-md border border-indigo-500/35 animate-pulse select-none">
            <Layers className="w-4.5 h-4.5 text-white" />
            <span>Mode Gambar Aktif: Klik peta untuk menambah titik sudut.</span>
            <button
              onClick={() => {
                setIsDrawingActive(false);
                setIsZoneFormOpen(true);
              }}
              className="px-2.5 py-0.5 bg-white/20 hover:bg-white/35 rounded-full text-[10px] cursor-pointer"
            >
              Simpan / Form
            </button>
          </div>
        )}

        {/* THE LEAFLET MAP ELEMENT CONTAINER */}
        <div
          ref={mapContainerRef}
          className="flex-1 w-full h-full outline-none z-10"
        />

        {/* FLOATING MEASUREMENT STATS OVERLAY CARD */}
        {isMeasuring && measuredPoints.length > 0 && (
          <div className="absolute bottom-20 left-4 z-40 p-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-xs flex flex-col space-y-2 text-xs select-none">
            <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-sm">
              <Ruler className="w-4 h-4 text-indigo-600" />
              <span>Detail Jarak Pengukuran</span>
            </div>
            <div className="flex flex-col space-y-1.5 font-medium">
              <div className="flex justify-between">
                <span className="text-zinc-550">Titik Terhubung:</span>
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

        {/* FLOATING MAP LEGEND AND FILTER */}
        <Legend
          showRiver={showRiver}
          setShowRiver={setShowRiver}
          showMainRoad={showMainRoad}
          setShowMainRoad={setShowMainRoad}
          showLocalRoad={showLocalRoad}
          setShowLocalRoad={setShowLocalRoad}
          showKelurahanBoundary={showKelurahanBoundary}
          setShowKelurahanBoundary={setShowKelurahanBoundary}
          showRWBoundary={showRWBoundary}
          setShowRWBoundary={setShowRWBoundary}
          showGeojsonLayer={showGeojsonLayer}
          setShowGeojsonLayer={setShowGeojsonLayer}
          className={isMeasuring && measuredPoints.length > 0 ? 'bottom-52 left-4' : 'bottom-4 left-4'}
        />

        {/* Desktop floating details card */}
        <DetailsCard
          selectedPOI={selectedPOI}
          setSelectedPOI={setSelectedPOI}
          sidebarOpen={sidebarOpen}
          user={user}
          onEditPOI={handleOpenEditPOI}
          onDeletePOI={handleDeletePOI}
        />

      </main>

      {/* Mobile bottom details drawer */}
      <DetailsDrawer
        selectedPOI={selectedPOI}
        setSelectedPOI={setSelectedPOI}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        user={user}
        onEditPOI={handleOpenEditPOI}
        onDeletePOI={handleDeletePOI}
      />

      {/* Admin Operations Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(usr) => {
          setUser(usr);
          fetchMapData();
        }}
      />

      <CategoryFormModal
        isOpen={isCategoryFormOpen}
        onClose={() => {
          setIsCategoryFormOpen(false);
          setCategoryToEdit(null);
        }}
        categoryToEdit={categoryToEdit}
        onSaveSuccess={fetchMapData}
      />

      <POIFormModal
        isOpen={isPOIFormOpen}
        onClose={() => {
          setIsPOIFormOpen(false);
          setPoiToEdit(null);
          setPickingLatLng(null);
        }}
        poiToEdit={poiToEdit}
        onSaveSuccess={fetchMapData}
        categories={categories}
        pickedLatLng={pickingLatLng}
        onStartMapPick={() => {
          setIsPOIFormOpen(false);
          setIsPickingActive(true);
        }}
      />

      <ZoneFormModal
        isOpen={isZoneFormOpen}
        onClose={() => {
          setIsZoneFormOpen(false);
          setZoneToEdit(null);
          setDrawnCoordinates([]);
        }}
        zoneToEdit={zoneToEdit}
        onSaveSuccess={fetchMapData}
        categories={categories}
        drawnCoordinates={drawnCoordinates}
        setDrawnCoordinates={setDrawnCoordinates}
        isDrawingActive={isDrawingActive}
        setIsDrawingActive={setIsDrawingActive}
      />

    </div>
  );
}
