import type { GridType, LineType } from '../types';
import { GRID_URLS, LOGO_URL } from '../utils/assets';

interface ToolbarProps {
  gridType: GridType;
  setGridType: (grid: GridType) => void;
  lineType: LineType;
  setLineType: (line: LineType) => void;
  lineSize: number;
  setLineSize: (size: number) => void;
  lineOpacity: number;
  setLineOpacity: (opacity: number) => void;
  onUndo: () => void;
  onClear: () => void;
  onPrint: () => void;
  canUndo: boolean;
}

export function Toolbar({
  gridType,
  setGridType,
  lineType,
  setLineType,
  lineSize,
  setLineSize,
  lineOpacity,
  setLineOpacity,
  onUndo,
  onClear,
  onPrint,
  canUndo,
}: ToolbarProps) {
  return (
    <aside className="z-10 flex h-full w-[320px] shrink-0 flex-col border-r border-[#2A2A2E] bg-[#16161A] p-6 text-white shadow-2xl">
      <div className="mb-14">
        <div className="-mb-6 -ml-[18px] -mt-4 flex justify-start">
          <img src={LOGO_URL} alt="DOT logo" className="h-auto w-40 pointer-events-none" />
        </div>
      </div>

      <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto pr-2">
        <section>
          <span className="mb-3 block text-[13px] font-bold uppercase tracking-[0.05em] text-[#8E8E93]">Grid</span>
          <div className="grid grid-cols-3 gap-3">
            {GRID_URLS.map((backgroundUrl, index) => (
              <div key={backgroundUrl} className="relative aspect-square w-full">
                <button
                  type="button"
                  onClick={() => setGridType(backgroundUrl)}
                  aria-label={`Select grid ${index + 1}`}
                  className={`absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center rounded-lg border p-2 transition-all ${
                    gridType === backgroundUrl
                      ? 'border-white bg-zinc-800'
                      : 'border-[#2A2A2E] bg-zinc-900 hover:bg-zinc-800'
                  }`}
                >
                  <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-sm bg-white">
                    <img src={backgroundUrl} alt="" className="h-full w-full object-contain" />
                  </span>
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <span className="mb-4 block text-[13px] font-bold uppercase tracking-[0.05em] text-[#8E8E93]">Stroke</span>
          <span className="mb-3 block text-[11px] font-semibold tracking-[0.05em] text-[#8E8E93]">Style</span>
          <div className="grid grid-cols-3 gap-2">
            {(['rounded', 'square', 'calligraphy'] as const).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setLineType(type)}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border px-2 py-3 transition-all ${
                  lineType === type
                    ? 'border-white bg-zinc-800 text-white'
                    : 'border-[#2A2A2E] bg-zinc-900 text-zinc-500 hover:bg-zinc-800'
                }`}
              >
                <svg width="40" height="12" viewBox="0 0 40 12" aria-hidden="true">
                  {type === 'rounded' && <line x1="4" y1="6" x2="36" y2="6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />}
                  {type === 'square' && <line x1="4" y1="6" x2="36" y2="6" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />}
                  {type === 'calligraphy' && <polygon points="4,8 36,2 36,8 4,14" fill="currentColor" transform="translate(0,-3)" />}
                </svg>
                <span className="text-[9px] font-semibold uppercase tracking-wider">{type}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <label className="block">
            <span className="mb-2 flex justify-between">
              <span className="text-[11px] font-semibold tracking-[0.05em] text-[#8E8E93]">Size</span>
              <span className="text-[11px] text-zinc-300">{lineSize}px</span>
            </span>
            <input
              type="range"
              min="1"
              max="50"
              value={lineSize}
              onChange={(event) => setLineSize(Number(event.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-zinc-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex justify-between">
              <span className="text-[11px] font-semibold tracking-[0.05em] text-[#8E8E93]">Opacity</span>
              <span className="text-[11px] text-zinc-300">{lineOpacity}%</span>
            </span>
            <input
              type="range"
              min="1"
              max="100"
              value={lineOpacity}
              onChange={(event) => setLineOpacity(Number(event.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-zinc-400"
            />
          </label>
        </section>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1 cursor-pointer rounded border border-[#2A2A2E] bg-zinc-800 px-2 py-3 text-[13px] font-bold uppercase flex-1 cursor-pointer rounded border border-[#2A2A2E] bg-zinc-800 px-2 py-3 text-[13px] font-bold uppercase tracking-[0.05em] text-white transition-all active:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40" text-white transition-all active:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={!canUndo}
            className="flex-1 cursor-pointer rounded border border-[#2A2A2E] bg-zinc-800 px-2 py-3 text-[13px] font-bold uppercase tracking-[0.05em] text-red-400 transition-all hover:text-red-300 active:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear
          </button>
        </div>
        <button
          type="button"
          onClick={onPrint}
          className="w-full cursor-pointer rounded bg-white px-4 py-3 text-[13px] font-bold uppercase tracking-[0.05em] text-zinc-900 shadow-lg transition-all active:bg-zinc-200"
        >
          Print
        </button>
      </div>
    </aside>
  );
}
