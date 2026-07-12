'use client';

import React, { useState, useEffect } from 'react';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';

interface LegendProps {
  showRiver: boolean;
  setShowRiver: (val: boolean) => void;
  showMainRoad: boolean;
  setShowMainRoad: (val: boolean) => void;
  showLocalRoad: boolean;
  setShowLocalRoad: (val: boolean) => void;
  showKelurahanBoundary: boolean;
  setShowKelurahanBoundary: (val: boolean) => void;
  showRWBoundary: boolean;
  setShowRWBoundary: (val: boolean) => void;
  showGeojsonLayer: boolean;
  setShowGeojsonLayer: (val: boolean) => void;
  className?: string;
}

export default function Legend({
  showRiver,
  setShowRiver,
  showMainRoad,
  setShowMainRoad,
  showLocalRoad,
  setShowLocalRoad,
  showRWBoundary,
  setShowRWBoundary,
  showGeojsonLayer,
  setShowGeojsonLayer,
  className = 'bottom-4 left-4'
}: LegendProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  // Set default minimized state on mobile screens (width < 768px)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMinimized(true);
    }
  }, []);

  const handleToggleItem = (
    currentVal: boolean,
    setter: (val: boolean) => void
  ) => {
    // If the master overlay is off, turn it on when an individual item is toggled
    if (!showGeojsonLayer) {
      setShowGeojsonLayer(true);
    }
    setter(!currentVal);
  };

  // Inline SVG Line helpers to draw identical representations of features
  const renderLineSvg = (color: string, thickness: number, style: 'solid' | 'dashed' | 'dash-long' | 'dash-short') => {
    let strokeDasharray = undefined;
    if (style === 'dashed') strokeDasharray = '3, 4';
    if (style === 'dash-long') strokeDasharray = '5, 5';
    if (style === 'dash-short') strokeDasharray = '4, 4';

    return (
      <svg className="w-16 h-3 flex-shrink-0" viewBox="0 0 64 12">
        <line
          x1="2"
          y1="6"
          x2="62"
          y2="6"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
        />
      </svg>
    );
  };

  const legendItems = [
    {
      id: 'river',
      label: 'Sungai',
      isActive: showRiver,
      color: '#38bdf8',
      thickness: 4.5,
      style: 'solid' as const,
      setter: setShowRiver
    },
    {
      id: 'mainRoad',
      label: 'Jalan Utama',
      isActive: showMainRoad,
      color: '#ea580c',
      thickness: 3.5,
      style: 'solid' as const,
      setter: setShowMainRoad
    },
    {
      id: 'localRoad',
      label: 'Jalan Lokal / Gang',
      isActive: showLocalRoad,
      color: '#9ca3af',
      thickness: 2,
      style: 'solid' as const,
      setter: setShowLocalRoad
    },
    {
      id: 'rwBoundary',
      label: 'Batas RW',
      isActive: showRWBoundary,
      color: '#ec4899',
      thickness: 1.5,
      style: 'dash-short' as const,
      setter: setShowRWBoundary
    }
  ];

  return (
    <div
      className={`absolute z-30 transition-all duration-300 select-none bg-white/95 border border-zinc-200 shadow-2xl rounded-2xl ${isMinimized ? 'w-40 md:w-44' : 'w-72 md:w-80'
        } ${className}`}
    >
      {/* Header */}
      <div
        onClick={() => setIsMinimized(!isMinimized)}
        className="flex items-center justify-between p-3.5 cursor-pointer font-sans border-b border-zinc-100 hover:bg-zinc-55/50 rounded-t-2xl transition-colors"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-650" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-805">
            {isMinimized ? 'Legenda' : 'Legenda Peta'}
          </span>
        </div>
        {isMinimized ? (
          <ChevronUp className="w-4 h-4 text-zinc-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        )}
      </div>

      {/* Body Content */}
      {!isMinimized && (
        <div className="p-3.5 space-y-3 font-sans">
          {/* Master Overlay Toggle Switch */}
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-450">
              Tampilkan Semua Overlay
            </span>
            <button
              onClick={() => {
                const next = !showGeojsonLayer;
                setShowGeojsonLayer(next);
                // When turning master ON, re-enable all individual overlay items
                if (next) {
                  setShowRiver(true);
                  setShowMainRoad(true);
                  setShowLocalRoad(true);
                  setShowRWBoundary(true);
                }
              }}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                showGeojsonLayer ? 'bg-indigo-600' : 'bg-zinc-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  showGeojsonLayer ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Interactive Filters List */}
          <div className="space-y-1">
            {legendItems.map((item) => {
              const isChecked = item.isActive && showGeojsonLayer;
              const activeColor = item.color;
              return (
                <button
                  key={item.id}
                  onClick={() => handleToggleItem(item.isActive, item.setter)}
                  className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                    isChecked
                      ? 'bg-zinc-100 text-zinc-900 font-bold'
                      : 'hover:bg-zinc-50 text-zinc-500'
                  }`}
                >
                  {/* Checkbox — same pattern as HeaderControls */}
                  <span
                    className="w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors flex-shrink-0"
                    style={{
                      borderColor: activeColor,
                      backgroundColor: isChecked ? activeColor : 'transparent'
                    }}
                  >
                    {isChecked && <span className="w-1.5 h-1.5 rounded-sm bg-white" />}
                  </span>

                  <span className="truncate flex-1">{item.label}</span>

                  {/* SVG line preview */}
                  <div className={isChecked ? 'opacity-100' : 'opacity-35'}>
                    {renderLineSvg(item.color, item.thickness, item.style)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Helper hint when master is disabled */}
          {!showGeojsonLayer && (
            <div className="p-2 bg-zinc-50 border border-zinc-150 rounded-xl text-[10px] text-zinc-500 font-medium leading-normal">
              Overlay dinonaktifkan. Ketuk salah satu elemen di atas atau aktifkan tombol master untuk memunculkannya kembali di peta.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
