import { GridType, LineType } from '../types';
import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface ToolbarProps {
  gridType: GridType;
  setGridType: (g: GridType) => void;
  lineType: LineType;
  setLineType: (l: LineType) => void;
  lineSize: number;
  setLineSize: (s: number) => void;
  lineOpacity: number;
  setLineOpacity: (o: number) => void;
  onUndo: () => void;
  onClear: () => void;
  onPrint: () => void;
  canUndo: boolean;
}

export function Toolbar({
  gridType, setGridType,
  lineType, setLineType,
  lineSize, setLineSize,
  lineOpacity, setLineOpacity,
  onUndo, onClear, onPrint, canUndo
}: ToolbarProps) {
  const permanentGrids = [
    '/grids/grid1.png',
    '/grids/grid2.png',
    '/grids/grid3.png',
    '/grids/grid4.png',
    '/grids/grid5.png',
    '/grids/grid6.png'
  ];

  return (
    <aside className="w-[320px] h-full bg-[#16161A] border-r border-[#2A2A2E] flex flex-col p-6 z-10 shadow-2xl shrink-0 text-white">
      <div className="mb-14">
        <div className="flex justify-start -mt-4 -mb-6 -ml-[18px]">
          <img src="/logo2.svg" alt="DOT.אות Logo" className="w-40 h-auto pointer-events-none" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
        
        {/* Grid Selection */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#8E8E93]">GRID</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {permanentGrids.map((bgUrl, idx) => (
              <div key={idx} className="relative w-full aspect-square">
                <button
                  onClick={() => setGridType(bgUrl)}
                  className={`absolute inset-0 w-full h-full rounded-lg border p-2 cursor-pointer transition-all flex items-center justify-center ${
                    gridType === bgUrl
                      ? 'border-white bg-zinc-800' 
                      : 'border-[#2A2A2E] bg-zinc-900 hover:bg-zinc-800'
                  }`}
                  title={`Grid ${idx + 1}`}
                >
                  <div className="w-full h-full bg-white rounded-sm flex items-center justify-center overflow-hidden">
                    <img 
                      src={`${bgUrl}?v=3`} 
                      alt={`Grid ${idx + 1}`}
                      className="w-full h-full object-contain" 
                    />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Stroke Selection Title */}
        <div className="mt-8 mb-4">
          <span className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#8E8E93]">STROKE</span>
        </div>

        {/* Line Type */}
        <section>
          <span className="text-[11px] font-semibold tracking-[0.05em] text-[#8E8E93] mb-3 block">Style</span>
          <div className="grid grid-cols-3 gap-2">
            {(['rounded', 'square', 'calligraphy'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setLineType(type)}
                className={`py-3 px-2 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  lineType === type 
                    ? 'border-white bg-zinc-800 text-white' 
                    : 'border-[#2A2A2E] bg-zinc-900 text-zinc-500 hover:bg-zinc-800'
                }`}
                title={type}
              >
                <svg width="40" height="12" viewBox="0 0 40 12" className="text-current">
                  {type === 'rounded' && <line x1="4" y1="6" x2="36" y2="6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />}
                  {type === 'square' && <line x1="4" y1="6" x2="36" y2="6" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />}
                  {type === 'calligraphy' && (
                    <polygon points="4,8 36,2 36,8 4,14" fill="currentColor" transform="translate(0,-3)" />
                  )}
                </svg>
                <span className="text-[9px] font-semibold uppercase tracking-wider">{type}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Line Settings */}
        <section className="space-y-6 mt-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-[11px] font-semibold tracking-[0.05em] text-[#8E8E93]">Size</span>
              <span className="text-[11px] text-zinc-300">{lineSize}px</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={lineSize}
              onChange={(e) => setLineSize(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-[11px] font-semibold tracking-[0.05em] text-[#8E8E93]">Opacity</span>
              <span className="text-[11px] text-zinc-300">{lineOpacity}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={lineOpacity}
              onChange={(e) => setLineOpacity(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
            />
          </div>
        </section>
        
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex gap-3">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1 py-3 px-2 bg-zinc-800 active:bg-zinc-700 disabled:opacity-40 disabled:active:bg-zinc-800 text-[11px] font-bold uppercase tracking-widest rounded transition-all border border-[#2A2A2E] cursor-pointer disabled:cursor-not-allowed text-white"
          >
            Undo
          </button>
          <button
            onClick={onClear}
            disabled={!canUndo}
            className="flex-1 py-3 px-2 bg-zinc-800 active:bg-zinc-700 disabled:opacity-40 disabled:active:bg-zinc-800 text-[11px] font-bold uppercase tracking-widest rounded transition-all border border-[#2A2A2E] cursor-pointer disabled:cursor-not-allowed text-white text-red-400 hover:text-red-300"
          >
            Clear
          </button>
        </div>
        <button
          onClick={onPrint}
          className="w-full py-3 px-4 bg-white active:bg-zinc-200 text-zinc-900 text-xs font-bold uppercase tracking-widest rounded transition-all shadow-lg cursor-pointer"
        >
          Print
        </button>
      </div>
    </aside>
  );
}
