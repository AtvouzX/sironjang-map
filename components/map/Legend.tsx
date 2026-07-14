'use client';

import React, { useState, useEffect } from 'react';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlined from '@mui/icons-material/KeyboardArrowUpOutlined';

interface LegendProps {
  isEmbed?: boolean;
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
  isEmbed = false,
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

  // Set default minimized state on mobile screens (width < 768px) or in embed mode
  useEffect(() => {
    if (isEmbed) {
      setIsMinimized(true);
    } else if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMinimized(true);
    }
  }, [isEmbed]);

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
      className={`absolute z-30 transition-all duration-300 select-none bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 shadow-2xl text-zinc-900 dark:text-zinc-50 ${
        isEmbed ? 'rounded-xl sm:rounded-2xl' : 'rounded-2xl'
      } ${
        isMinimized
          ? (isEmbed ? 'w-[125px] sm:w-44' : 'w-40 md:w-44')
          : (isEmbed ? 'w-60 sm:w-80' : 'w-72 md:w-80')
      } ${className}`}
    >
      {/* Header */}
      <div
        onClick={() => setIsMinimized(!isMinimized)}
        className={`flex items-center justify-between cursor-pointer font-sans hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors ${
          isMinimized
            ? (isEmbed ? 'rounded-xl sm:rounded-2xl' : 'rounded-2xl')
            : 'border-b border-zinc-100 dark:border-zinc-800 rounded-t-xl sm:rounded-t-2xl'
        } ${
          isEmbed ? 'p-2.5 sm:p-3.5' : 'p-3.5'
        }`}
      >
        <div className={`flex items-center ${isEmbed ? 'gap-1.5 sm:gap-2' : 'gap-2'}`}>
          <LayersOutlined className={`text-indigo-650 dark:text-indigo-400 flex-shrink-0 ${isEmbed ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-4 h-4'}`} />
          <span className={`font-extrabold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 ${
            isEmbed ? 'text-[9px] sm:text-xs' : 'text-xs'
          }`}>
            {isMinimized ? 'Legenda' : 'Legenda Peta'}
          </span>
        </div>
        {isMinimized ? (
          <KeyboardArrowUpOutlined className={isEmbed ? 'w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400' : 'w-4 h-4 text-zinc-400'} />
        ) : (
          <KeyboardArrowDownOutlined className={isEmbed ? 'w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400' : 'w-4 h-4 text-zinc-400'} />
        )}
      </div>

      {/* Body Content */}
      {!isMinimized && (
        <div className={`font-sans ${isEmbed ? 'p-2.5 space-y-2 sm:p-3.5 sm:space-y-3' : 'p-3.5 space-y-3'}`}>
          {/* Master Overlay Toggle Switch */}
          <div className={`flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 ${isEmbed ? 'pb-2 sm:pb-2.5' : 'pb-2.5'}`}>
            <span className={`font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 ${isEmbed ? 'text-[8px] sm:text-[10px]' : 'text-[10px]'}`}>
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
                showGeojsonLayer ? 'bg-indigo-600' : 'bg-zinc-200 dark:bg-zinc-800'
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
                  className={`w-full flex items-center transition-colors text-left cursor-pointer ${
                    isEmbed ? 'gap-1.5 px-1.5 py-1 text-[10px] sm:gap-2.5 sm:px-2 sm:py-1.5 sm:text-xs' : 'gap-2.5 px-2 py-1.5 text-xs'
                  } ${
                    isChecked
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
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
                    {isChecked && <span className="w-1.5 h-1.5 rounded-sm bg-white dark:bg-zinc-900" />}
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
            <div className={`border rounded-xl font-medium leading-normal ${
              isEmbed ? 'p-1.5 text-[8px] sm:p-2 sm:text-[10px]' : 'p-2 text-[10px]'
            } bg-zinc-50 dark:bg-zinc-950/20 border-zinc-150 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400`}>
              Overlay dinonaktifkan. Ketuk salah satu elemen di atas atau aktifkan tombol master untuk memunculkannya kembali di peta.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
