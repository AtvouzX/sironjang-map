'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import SquareFootOutlined from '@mui/icons-material/SquareFootOutlined';
import AutorenewOutlined from '@mui/icons-material/AutorenewOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';



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
import PresentationDeck from './map/PresentationDeck';
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
  (L.Icon.Default.prototype as any)._getIconUrl = () => transparentPixel;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: transparentPixel,
    iconUrl: transparentPixel,
    shadowUrl: transparentPixel,
  });
}

// SVG paths for Leaflet HTML Markers (matching Lucide icon designs)
const getIconSvg = (iconName: string) => {
  const paths: { [key: string]: string } = {
    Building2: `<path d="M12 7V3H2v18h20V7zm-2 12H4v-2h6zm0-4H4v-2h6zm0-4H4V9h6zm0-4H4V5h6zm10 12h-8V9h8zm0-10h-8V5h8zm-2 5h-4v2h4zm0 4h-4v2h4z"/>`,
    Store: `<path d="M4 4h16v2H4zm16 11H4v2h16zM2 20h20v2H2zM20 8H4c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2m0 5H4v-3h16z"/>`,
    Milk: `<path d="M15.5 12c.83 0 1.5-.67 1.5-1.5S16.33 9 15.5 9h-7C7.67 9 7 9.67 7 10.5S7.67 12 8.5 12zm-7-2h7c.28 0 .5.22.5.5s-.22.5-.5.5h-7c-.28 0-.5-.22-.5-.5s.22-.5.5-.5m10-4H5.5L4.01 8H20zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"/>`,
    Sprout: `<path d="M11.5 9.5c0-2.5-2-4.5-4.5-4.5h-1v1c0 2.5 2 4.5 4.5 4.5h1zm-1-1c-1.38 0-2.5-1.12-2.5-2.5.83 0 1.57.4 2.05 1.03-.32.41-.5.92-.55 1.47m7.5.5c0-2.5-2-4.5-4.5-4.5h-1v1c0 2.5 2 4.5 4.5 4.5h1zm-1-1c-1.38 0-2.5-1.12-2.5-2.5.83 0 1.57.4 2.05 1.03-.32.41-.5.92-.55 1.47M19 13H5v2h6v6h2v-6h6zm-2 0h-4v2h4z"/>`,
    School: `<path d="M12 3 1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9zm6.82 6L12 12.72 5.18 9 12 5.28zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73z"/>`,
    ShieldAlert: `<path d="M12 5.99 19.53 19H4.47zM12 2 1 21h22zm1 14h-2v2h2zm0-6h-2v4h2z"/>`,
    Compass: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m-5.5-2.5 7.51-3.49L17.5 6.5 9.99 9.99zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1"/>`,
    Users: `<path d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5M4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12m0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7m7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44M15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35"/>`,
    Palette: `<path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67 0 1.38-1.12 2.5-2.5 2.5m0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5 0-.16-.08-.28-.14-.35-.41-.46-.63-1.05-.63-1.65 0-1.38 1.12-2.5 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7"/>`,
    Utensils: `<path d="M16 6v8h3v8h2V2c-2.76 0-5 2.24-5 4m-5 3H9V2H7v7H5V2H3v7c0 2.21 1.79 4 4 4v9h2v-9c2.21 0 4-1.79 4-4V2h-2z"/>`,
    ShoppingBag: `<path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3m7 17H5V8h14zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3"/>`,
    Egg: `<path d="M12 3C8.5 3 5 9.33 5 14c0 3.87 3.13 7 7 7s7-3.13 7-7c0-4.67-3.5-11-7-11m0 16c-2.76 0-5-2.24-5-5 0-4.09 3.07-9 5-9s5 4.91 5 9c0 2.76-2.24 5-5 5"/><path d="M13 16c-.58 0-3-.08-3-3 0-.55-.45-1-1-1s-1 .45-1 1c0 3 1.99 5 5 5 .55 0 1-.45 1-1s-.45-1-1-1"/>`,
    Shield: `<path d="M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25 6 2.25z"/>`,
    Trees: `<path d="M17 12h2L12 2 5.05 12H7l-3.9 6h6.92v4h3.95v-4H21zM6.79 16l3.9-6H8.88l3.13-4.5 3.15 4.5h-1.9l4 6z"/>`,
    Leaf: `<path d="M15.49 9.63c-.18-2.79-1.31-5.51-3.43-7.63-2.14 2.14-3.32 4.86-3.55 7.63 1.28.68 2.46 1.56 3.49 2.63 1.03-1.06 2.21-1.94 3.49-2.63m-3.44-4.44c.63 1.03 1.07 2.18 1.3 3.38-.47.3-.91.63-1.34.98-.42-.34-.87-.67-1.33-.97.25-1.2.71-2.35 1.37-3.39M12 15.45c-.82-1.25-1.86-2.34-3.06-3.2-.13-.09-.27-.16-.4-.26.13.09.27.17.39.25C6.98 10.83 4.59 10 2 10c0 5.32 3.36 9.82 8.03 11.49.63.23 1.29.4 1.97.51.68-.12 1.33-.29 1.97-.51C18.64 19.82 22 15.32 22 10c-4.18 0-7.85 2.17-10 5.45m1.32 4.15c-.44.15-.88.27-1.33.37-.44-.09-.87-.21-1.28-.36-3.29-1.18-5.7-3.99-6.45-7.35 1.1.26 2.15.71 3.12 1.33l-.02.01c.13.09.26.18.39.25l.07.04c.99.72 1.84 1.61 2.51 2.65L12 19.1l1.67-2.55c.69-1.05 1.55-1.95 2.53-2.66l.07-.05c.09-.05.18-.11.27-.17l-.01-.02c.98-.65 2.07-1.13 3.21-1.4-.75 3.37-3.15 6.18-6.42 7.35m-4.33-7.32c-.02-.01-.04-.03-.05-.04 0 0 .01 0 .01.01.01.01.02.02.04.03"/>`,
    HeartPulse: `<path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3m-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05"/>`,
    Bus: `<path d="M12 2c-4.42 0-8 .5-8 4v10c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4m5.66 2.99H6.34C6.89 4.46 8.31 4 12 4s5.11.46 5.66.99m.34 2V10H6V6.99zm-.34 9.74-.29.27H6.63l-.29-.27C6.21 16.62 6 16.37 6 16v-4h12v4c0 .37-.21.62-.34.73"/>`,
    Tent: `<path d="M10 1c0 1.66-1.34 3-3 3-.55 0-1 .45-1 1H4c0-1.66 1.34-3 3-3 .55 0 1-.45 1-1zm2 2L6 7.58V6H4v3.11L1 11.4l1.21 1.59L4 11.62V21h16v-9.38l1.79 1.36L23 11.4zm1.94 4h-3.89L12 5.52zm-6.5 2h9.12L18 10.1v.9H6v-.9zM18 13v2H6v-2zM6 19v-2h12v2z"/>`,
    Footprints: `<path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2M9.8 8.9 7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.56-.89-1.68-1.25-2.65-.84L6 8.3V13h2V9.6z"/>`,
    CupSoda: `<path d="M16 5v8c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V5zm4-2H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2m-2 5V5h2v3zm2 11H2v2h18z"/>`,
    MapPin: `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7M7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9"/>`,
    Church: `<path d="M18 12.22V9l-5-2.5V5h2V3h-2V1h-2v2H9v2h2v1.5L6 9v3.22L2 14v8h9v-4c0-.55.45-1 1-1s1 .45 1 1v4h9v-8zM20 20h-5v-2.04c0-1.69-1.35-3.06-3-3.06s-3 1.37-3 3.06V20H4v-4.79l4-1.81v-3.35L12 8l4 2.04v3.35l4 1.81z"/>`,
    Activity: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 3.3 1.35-.95c1.82.56 3.37 1.76 4.38 3.34l-.39 1.34-1.35.46L13 6.7zm-3.35-.95L11 5.3v1.4L7.01 9.49l-1.35-.46-.39-1.34c1.01-1.57 2.56-2.77 4.38-3.34M7.08 17.11l-1.14.1C4.73 15.81 4 13.99 4 12c0-.12.01-.23.02-.35l1-.73 1.38.48 1.46 4.34zm7.42 2.48c-.79.26-1.63.41-2.5.41s-1.71-.15-2.5-.41l-.69-1.49.64-1.1h5.11l.64 1.11zM14.27 15H9.73l-1.35-4.02L12 8.44l3.63 2.54zm3.79 2.21-1.14-.1-.79-1.37 1.46-4.34 1.39-.47 1 .73c.01.11.02.22.02.34 0 1.99-.73 3.81-1.94 5.21"/>`,
    Mosque: `<path d="M24 7c0-1.1-2-3-2-3s-2 1.9-2 3c0 .74.4 1.38 1 1.72V13h-2v-2c0-.95-.66-1.74-1.55-1.94.34-.58.55-1.25.55-1.97 0-1.31-.65-2.53-1.74-3.25L12 1 7.74 3.84C6.65 4.56 6 5.78 6 7.09c0 .72.21 1.39.55 1.96C5.66 9.26 5 10.05 5 11v2H3V8.72c.6-.34 1-.98 1-1.72 0-1.1-2-3-2-3S0 5.9 0 7c0 .74.4 1.38 1 1.72V21h10v-4c0-.55.45-1 1-1s1 .45 1 1v4h10V8.72c.6-.34 1-.98 1-1.72M8.85 5.5 12 3.4l3.15 2.1c.53.36.85.95.85 1.59C16 8.14 15.14 9 14.09 9H9.91C8.86 9 8 8.14 8 7.09c0-.64.32-1.23.85-1.59M21 19h-6v-2c0-1.65-1.35-3-3-3s-3 1.35-3 3v2H3v-4h4v-4h10v4h4z"/>`,
    Vihara: `<path d="M21 9.02c0 1.09-.89 1.98-1.98 1.98H18V8.86c1.72-.44 3-1.99 3-3.84V5l-2 .02C19 6.11 18.11 7 17.02 7h-.52L12 1 7.5 7h-.52C5.89 7 5 6.11 5 5.02H3c0 1.86 1.28 3.4 3 3.84V11H4.98C3.89 11 3 10.11 3 9.02H1c0 1.86 1.28 3.4 3 3.84V22h7v-4c0-.55.45-1 1-1s1 .45 1 1v4h7v-9.14c1.72-.44 3-1.99 3-3.84V9zm-9-4.69L14 7h-4zM8 9h8v2H8zm10 11h-3v-2c0-1.65-1.35-3-3-3s-3 1.35-3 3v2H6v-7h12z"/>`,
    Cemetery: `<path d="M8.66 13.07c.15 0 .29-.01.43-.03C9.56 14.19 10.69 15 12 15s2.44-.81 2.91-1.96c.14.02.29.03.43.03 1.73 0 3.14-1.41 3.14-3.14 0-.71-.25-1.39-.67-1.93.43-.54.67-1.22.67-1.93 0-1.73-1.41-3.14-3.14-3.14-.15 0-.29.01-.43.03C14.44 1.81 13.31 1 12 1s-2.44.81-2.91 1.96c-.14-.02-.29-.03-.43-.03-1.73 0-3.14 1.41-3.14 3.14 0 .71.25 1.39.67 1.93-.43.54-.68 1.22-.68 1.93 0 1.73 1.41 3.14 3.15 3.14M12 13c-.62 0-1.12-.49-1.14-1.1l.12-1.09c.32.12.66.19 1.02.19s.71-.07 1.03-.19l.11 1.09c-.02.61-.52 1.1-1.14 1.1m3.34-1.93c-.24 0-.46-.07-.64-.2l-.81-.57c.55-.45.94-1.09 1.06-1.83l.88.42c.4.19.66.59.66 1.03 0 .64-.52 1.15-1.15 1.15m-.65-5.94c.2-.13.42-.2.65-.2.63 0 1.14.51 1.14 1.14 0 .44-.25.83-.66 1.03l-.88.42c-.12-.74-.51-1.38-1.07-1.83zM12 3c.62 0 1.12.49 1.14 1.1l-.11 1.09C12.71 5.07 12.36 5 12 5s-.7.07-1.02.19l-.12-1.09c.02-.61.52-1.1 1.14-1.1M8.66 4.93c.24 0 .46.07.64.2l.81.56c-.55.45-.94 1.09-1.06 1.83l-.88-.42c-.4-.2-.66-.59-.66-1.03 0-.63.52-1.14 1.15-1.14M8.17 8.9l.88-.42c.12.74.51 1.38 1.07 1.83l-.81.55c-.2.13-.42.2-.65.2-.63 0-1.14-.51-1.14-1.14-.01-.43.25-.82.65-1.02M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9m2.44-2.44c.71-1.9 2.22-3.42 4.12-4.12-.71 1.9-2.22 3.41-4.12 4.12M3 13c0 4.97 4.03 9 9 9 0-4.97-4.03-9-9-9m2.44 2.44c1.9.71 3.42 2.22 4.12 4.12-1.9-.71-3.41-2.22-4.12-4.12"/>`,
    Flame: `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>`,
    BookOpen: `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zm22 0h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`,
    Heart: `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>`
  };

  const pathStr = paths[iconName] || paths['Compass'];
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [categoryGeojsons, setCategoryGeojsons] = useState<Record<string, any>>({});
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmbed, setIsEmbed] = useState(false);

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
  const setShowKelurahanBoundary = (_: boolean) => { };
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

  useEffect(() => {
    (window as any).isMeasuringMode = isMeasuring;
  }, [isMeasuring]);

  // Load GeoJSON layers for active categories from Supabase
  useEffect(() => {
    const fetchCategoryGeojsons = async () => {
      if (selectedCategories.length === 0) {
        setCategoryGeojsons({});
        return;
      }
      try {
        const { data, error } = await supabase
          .from('category_geojson')
          .select('category_id, geojson')
          .in('category_id', selectedCategories);

        if (error) throw error;

        const geojsonMap: Record<string, any> = {};
        data?.forEach((row: any) => {
          geojsonMap[row.category_id] = row.geojson;
        });
        setCategoryGeojsons(geojsonMap);
      } catch (err) {
        console.error('Error fetching category-specific GeoJSON layers:', err);
      }
    };

    fetchCategoryGeojsons();
  }, [selectedCategories, categories]);

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
    const params = new URLSearchParams(window.location.search);
    const embedParam = params.get('embed') === 'true';
    setIsEmbed(embedParam);

    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      setBaseLayer(savedTheme === 'dark' ? 'dark' : 'street');
    }
    
    if (embedParam) {
      setSidebarOpen(false);
    } else if (window.innerWidth < 768) {
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
  const poiMarkersRef = useRef<Record<string, L.Marker>>({});

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
          return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
        case 'satellite':
          return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        default: // street
          return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
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
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      street: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
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

  // Draw Dynamic Zones & POI markers on map updates
  useEffect(() => {
    const map = mapRef.current;
    const markersGroup = markersLayerGroupRef.current;
    const overlaysGroup = overlaysLayerGroupRef.current;
    if (!map || !markersGroup || !overlaysGroup) return;

    // Clear layers
    markersGroup.clearLayers();
    overlaysGroup.clearLayers();
    poiMarkersRef.current = {};

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
      poiMarkersRef.current[poi.id] = marker;

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

    // 4. Draw category-specific GeoJSON layers
    Object.entries(categoryGeojsons).forEach(([catId, geojson]) => {
      const cat = categories.find(c => c.id === catId);
      const color = cat?.markerColor || '#6366f1';

      L.geoJSON(geojson, {
        filter: (feature: any) => {
          // Exclude point geometries since they are automatically imported to 'pois' table
          // and rendered separately as standard POI pins to avoid duplicates.
          return feature.geometry && feature.geometry.type !== 'Point';
        },
        style: () => ({
          color: color,
          weight: 3,
          fillColor: color,
          fillOpacity: 0.15,
        }),
        onEachFeature: (feature: any, layer: any) => {
          const props = feature.properties || {};
          if (props.name) {
            let tooltipContent = `<div class="p-1 text-xs"><strong>${props.name}</strong>`;
            if (props.description) {
              tooltipContent += `<br/><span class="text-[10px] text-zinc-500">${props.description}</span>`;
            } else if (cat) {
              tooltipContent += `<br/><span class="text-[10px] text-zinc-400 font-semibold uppercase">${cat.name}</span>`;
            }
            tooltipContent += `</div>`;
            layer.bindTooltip(tooltipContent, {
              sticky: true,
              className: 'backdrop-blur-md bg-white/95 border border-zinc-200 rounded-xl shadow-xl'
            });
          }
        }
      }).addTo(overlaysGroup);
    });

  }, [filteredPOIs, selectedCategories, categories, zones, user, theme, geojsonData, categoryGeojsons]);

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
          .addTo(measureGroup);
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
      map.flyTo([poi.lat, poi.lng], 18, { animate: true, duration: 1.5 });
      const marker = poiMarkersRef.current[poi.id];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 1000);
      }
    }
  };

  const handleLocatePOI = (poi: MapPOI) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([poi.lat, poi.lng], 18, { animate: true, duration: 1.5 });
      const marker = poiMarkersRef.current[poi.id];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 1000);
      }
    }
  };

  const handleClearMeasure = () => {
    setMeasuredPoints([]);
    setMeasuredDistance(0);
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
    <div className="flex flex-col md:flex-row flex-1 h-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 relative">

      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/25 dark:bg-black/50 backdrop-blur-xs z-40 transition-opacity duration-300 cursor-pointer animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
        isPresentationMode={isPresentationMode}
        setIsPresentationMode={setIsPresentationMode}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden z-10">

        {/* Floating Controls Header */}
        <HeaderControls
          isEmbed={isEmbed}
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
            <SquareFootOutlined className="w-4 h-4" />
            <span>Mode Ukur Aktif: Klik beberapa titik di peta.</span>
            {measuredPoints.length > 0 && (
              <button
                onClick={handleClearMeasure}
                className="bg-white/20 hover:bg-white/35 rounded-full p-1 transition-colors cursor-pointer flex items-center justify-center"
                title="Reset Ukuran"
              >
                <AutorenewOutlined className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* ACTIVE COORDINATE PICKING UX STATUS BANNER */}
        {isPickingActive && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-zinc-950/90 dark:bg-white/90 text-white dark:text-zinc-950 px-4 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2.5 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 animate-pulse select-none">
            <LocationOnOutlined className="w-4.5 h-4.5 text-indigo-600 animate-bounce" />
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
            <LayersOutlined className="w-4.5 h-4.5 text-white" />
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
          <div className="absolute bottom-4 left-4 z-40 p-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-xs flex flex-col space-y-2 text-xs select-none">
            <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-sm">
              <SquareFootOutlined className="w-4 h-4 text-indigo-600" />
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
          isEmbed={isEmbed}
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
          className={
            isMeasuring && measuredPoints.length > 0
              ? (isEmbed ? 'bottom-36 left-1.5 sm:bottom-44 sm:left-3' : 'bottom-48 left-4')
              : (isEmbed ? 'bottom-1.5 left-1.5 sm:bottom-3 sm:left-3' : 'bottom-4 left-4')
          }
        />

        {/* Desktop floating details card */}
        <DetailsCard
          selectedPOI={selectedPOI}
          setSelectedPOI={setSelectedPOI}
          sidebarOpen={sidebarOpen}
          user={user}
          onEditPOI={handleOpenEditPOI}
          onDeletePOI={handleDeletePOI}
          onLocatePOI={handleLocatePOI}
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
        onLocatePOI={handleLocatePOI}
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

      {isPresentationMode && (
        <PresentationDeck
          onClose={() => setIsPresentationMode(false)}
          categories={categories}
          pois={pois}
          map={mapRef.current}
          setSelectedCategories={setSelectedCategories}
          handleSelectPOI={handleSelectPOI}
          clearSelectPOI={() => {
            setSelectedPOI(null);
            setDrawerOpen(false);
          }}
          setBaseLayer={setBaseLayer}
          setIsMeasuring={setIsMeasuring}
          handleClearMeasure={handleClearMeasure}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
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
          setThemeDropdownOpen={setThemeDropdownOpen}
          setLayersDropdownOpen={setLayersDropdownOpen}
        />
      )}

    </div>
  );
}
