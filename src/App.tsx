import { useEffect, useRef, useState } from 'react';
import { CanvasArea } from './components/CanvasArea';
import { SquareContainer } from './components/SquareContainer';
import { Toolbar } from './components/Toolbar';
import type { GridType, LineType, Path } from './types';
import { normalizeStoredGrid } from './utils/assets';

function readNumber(key: string, fallback: number): number {
  const raw = localStorage.getItem(key);
  const parsed = raw === null ? Number.NaN : Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readPaths(): Path[] {
  try {
    const raw = localStorage.getItem('drawing_paths');
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Path[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [gridType, setGridType] = useState<GridType>(() =>
    normalizeStoredGrid(localStorage.getItem('drawing_gridType')),
  );
  const [lineType, setLineType] = useState<LineType>(() =>
    (localStorage.getItem('drawing_lineType') as LineType | null) ?? 'rounded',
  );
  const [lineSize, setLineSize] = useState(() => readNumber('drawing_lineSize', 5));
  const [lineOpacity, setLineOpacity] = useState(() => readNumber('drawing_lineOpacity', 100));
  const [paths, setPaths] = useState<Path[]>(readPaths);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    localStorage.setItem('drawing_gridType', gridType ?? '');
    localStorage.setItem('drawing_lineType', lineType);
    localStorage.setItem('drawing_lineSize', String(lineSize));
    localStorage.setItem('drawing_lineOpacity', String(lineOpacity));
    localStorage.setItem('drawing_paths', JSON.stringify(paths));
  }, [gridType, lineOpacity, lineSize, lineType, paths]);

  useEffect(() => {
    setPaths((current) =>
      current.map((path) => ({
        ...path,
        type: lineType,
        size: lineSize,
        opacity: lineOpacity,
      })),
    );
  }, [lineOpacity, lineSize, lineType]);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('print')) return;

    const timeout = window.setTimeout(() => {
      const oldTitle = document.title;
      document.title = '';
      window.print();
      document.title = oldTitle;
    }, 600);

    return () => window.clearTimeout(timeout);
  }, []);

  const handlePrint = () => {
    const oldTitle = document.title;
    document.title = '';

    if (window.self !== window.top) {
      const url = new URL(window.location.href);
      url.searchParams.set('print', 'true');
      const opened = window.open(url.toString(), '_blank', 'noopener,noreferrer');
      if (!opened) {
        window.alert('Please allow pop-ups so the print window can open.');
      }
      window.setTimeout(() => {
        document.title = oldTitle;
      }, 100);
      return;
    }

    window.print();
    document.title = oldTitle;
  };

  const handleGridTypeChange = (nextGrid: GridType) => {
    setGridType(nextGrid);
    setPaths([]);
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#0F0F11] text-white">
      <Toolbar
        gridType={gridType}
        setGridType={handleGridTypeChange}
        lineType={lineType}
        setLineType={setLineType}
        lineSize={lineSize}
        setLineSize={setLineSize}
        lineOpacity={lineOpacity}
        setLineOpacity={setLineOpacity}
        onUndo={() => setPaths((current) => current.slice(0, -1))}
        onClear={() => setPaths([])}
        onPrint={handlePrint}
        canUndo={paths.length > 0}
      />

      <main className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-[#F5F5F7] p-6 print:items-center print:justify-center print:p-0">
        <div className="relative mb-16 flex h-0 justify-center print:hidden">
          <div className="absolute top-[-2px] w-full select-none text-center text-[#16161A]">
            <h2 className="mb-0.5 text-2xl font-bold tracking-tight">Connect dots to form a letter</h2>
            <p className="text-xs font-medium opacity-60">(not by numbers)</p>
          </div>
        </div>

        <SquareContainer
          className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-inner"
          style={{
            backgroundImage: gridType ? `url("${gridType}")` : 'none',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
          }}
        >
          <CanvasArea
            ref={canvasRef}
            lineType={lineType}
            lineSize={lineSize}
            lineOpacity={lineOpacity}
            paths={paths}
            setPaths={setPaths}
          />
        </SquareContainer>
      </main>
    </div>
  );
}
