/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { CanvasArea } from './components/CanvasArea';
import { SquareContainer } from './components/SquareContainer';
import { Path, GridType, LineType } from './types';

export default function App() {
  const [gridType, setGridType] = useState<GridType>(() => {
    let saved = localStorage.getItem('drawing_gridType');
    if (saved && saved.endsWith('.svg')) {
      saved = saved.replace('.svg', '.png');
    }
    return saved || '/grids/grid1.png';
  });
  const [lineType, setLineType] = useState<LineType>(() => {
    return (localStorage.getItem('drawing_lineType') as LineType) || 'rounded';
  });
  const [lineSize, setLineSize] = useState<number>(() => {
    const saved = localStorage.getItem('drawing_lineSize');
    return saved ? Number(saved) : 5;
  });
  const [lineOpacity, setLineOpacity] = useState<number>(() => {
    const saved = localStorage.getItem('drawing_lineOpacity');
    return saved ? Number(saved) : 100;
  });
  
  const [paths, setPaths] = useState<Path[]>(() => {
    const saved = localStorage.getItem('drawing_paths');
    return saved ? JSON.parse(saved) : [];
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    localStorage.setItem('drawing_gridType', gridType || '');
    localStorage.setItem('drawing_lineType', lineType);
    localStorage.setItem('drawing_lineSize', String(lineSize));
    localStorage.setItem('drawing_lineOpacity', String(lineOpacity));
    localStorage.setItem('drawing_paths', JSON.stringify(paths));
  }, [gridType, lineType, lineSize, lineOpacity, paths]);

  useEffect(() => {
    setPaths(prevPaths => 
      prevPaths.map(p => ({
        ...p,
        type: lineType,
        size: lineSize,
        opacity: lineOpacity
      }))
    );
  }, [lineType, lineSize, lineOpacity]);

  useEffect(() => {
    if (window.location.search.includes('print=true')) {
      // Give the canvas a moment to render before printing
      setTimeout(() => {
        const oldTitle = document.title;
        document.title = "";
        window.print();
        document.title = oldTitle;
      }, 1000);
    }
  }, []);

  const handleUndo = () => {
    setPaths((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPaths([]);
  };

  const handlePrint = () => {
    const oldTitle = document.title;
    document.title = "";
    if (window.self !== window.top) {
      // If we are in an iframe (like the AI Studio preview window)
      const url = new URL(window.location.href);
      url.searchParams.set('print', 'true');
      const newWindow = window.open(url.toString(), '_blank');
      if (!newWindow) {
        alert("Please allow pop-ups to open the print window, or click the 'Open in new tab' arrow at the top right.");
      }
      setTimeout(() => { document.title = oldTitle; }, 100);
    } else {
      window.print();
      document.title = oldTitle;
    }
  };

  const handleGridTypeChange = (newGridType: GridType) => {
    setGridType(newGridType);
    setPaths([]);
  };

  return (
    <div className="flex h-screen w-full bg-[#0F0F11] overflow-hidden text-white">
      <Toolbar
        gridType={gridType}
        setGridType={handleGridTypeChange}
        lineType={lineType}
        setLineType={setLineType}
        lineSize={lineSize}
        setLineSize={setLineSize}
        lineOpacity={lineOpacity}
        setLineOpacity={setLineOpacity}
        onUndo={handleUndo}
        onClear={handleClear}
        onPrint={handlePrint}
        canUndo={paths.length > 0}
      />
      <main className="flex-1 h-full bg-[#F5F5F7] flex flex-col p-6 relative overflow-hidden print:p-0 print:items-center print:justify-center">
        {/* Title area */}
        <div className="mb-16 h-0 relative flex justify-center print:hidden">
          <div className="absolute top-[-2px] text-center text-[#16161A] select-none w-full">
            <h2 className="text-2xl font-bold tracking-tight mb-0.5">Connect dots to form a letter</h2>
            <p className="text-xs font-medium opacity-60">(not by numbers)</p>
          </div>
        </div>
        {/* Inner canvas wrapper */}
        <SquareContainer 
          className="bg-white rounded-xl shadow-inner border border-zinc-200 relative overflow-hidden"
          style={{
            backgroundImage: gridType ? `url(${gridType}?v=3)` : 'none',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <CanvasArea
            ref={canvasRef}
            gridType={gridType}
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
