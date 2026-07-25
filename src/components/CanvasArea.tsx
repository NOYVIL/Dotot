import React, { forwardRef, useEffect, useRef, useCallback } from 'react';
import { GridType, LineType, Path, Point } from '../types';
import { drawPath } from '../utils/drawing';

interface CanvasAreaProps {
  gridType: GridType;
  lineType: LineType;
  lineSize: number;
  lineOpacity: number;
  paths: Path[];
  setPaths: React.Dispatch<React.SetStateAction<Path[]>>;
}

export const CanvasArea = forwardRef<HTMLCanvasElement, CanvasAreaProps>(
  ({ gridType, lineType, lineSize, lineOpacity, paths, setPaths }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const internalCanvasRef = useRef<HTMLCanvasElement>(null);
    
    // Mutable state for active drawing to bypass React render cycle for performance
    const isDrawingRef = useRef(false);
    const currentPathRef = useRef<Path | null>(null);

    // Sync external ref
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(internalCanvasRef.current);
      } else if (ref) {
        ref.current = internalCanvasRef.current;
      }
    }, [ref]);

    const render = useCallback(() => {
      const canvas = internalCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const baseRes = 800;
      const scaleX = canvas.width / baseRes;
      const scaleY = canvas.height / baseRes;
      
      ctx.save();
      ctx.scale(scaleX, scaleY);

      paths.forEach(p => p && drawPath(ctx, p));
      if (currentPathRef.current) {
        drawPath(ctx, currentPathRef.current);
      }
      
      ctx.restore();
    }, [paths]);

    // Handle Resize
    useEffect(() => {
      const container = containerRef.current;
      const canvas = internalCanvasRef.current;
      if (!container || !canvas) return;

      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const ratio = window.devicePixelRatio || 1;
          // When printing, devicePixelRatio might not scale correctly for high DPI print,
          // but we can enforce a minimum crispness ratio (e.g. 2)
          const scale = Math.max(ratio, 2);
          canvas.width = entry.contentRect.width * scale;
          canvas.height = entry.contentRect.height * scale;
          render();
        }
      });

      resizeObserver.observe(container);
      return () => resizeObserver.disconnect();
    }, [render]);

    // Full render when props change
    useEffect(() => {
      render();
    }, [render]);

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): Point | null => {
      const canvas = internalCanvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;

      if ('touches' in e) {
        clientX = (e as TouchEvent).touches[0].clientX;
        clientY = (e as TouchEvent).touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      const baseRes = 800;
      const scaleX = baseRes / rect.width;
      const scaleY = baseRes / rect.height;

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
      const point = getCoordinates(e);
      if (!point) return;
      isDrawingRef.current = true;
      currentPathRef.current = {
        points: [point],
        type: lineType,
        size: lineSize,
        opacity: lineOpacity
      };
      render(); // draw the initial dot
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawingRef.current || !currentPathRef.current) return;
      const point = getCoordinates(e);
      if (!point) return;

      currentPathRef.current.points.push(point);
      
      // Perform an optimized render of everything on each move.
      // Modern browsers easily handle hundreds of paths at 60fps.
      render(); 
    };

    const handleEnd = () => {
      if (isDrawingRef.current && currentPathRef.current) {
        const finishedPath = currentPathRef.current;
        setPaths(prev => [...prev, finishedPath]);
        currentPathRef.current = null;
        isDrawingRef.current = false;
        // render() is automatically called by useEffect when paths change
      }
    };

    return (
      <div ref={containerRef} className="absolute inset-0 overflow-hidden cursor-crosshair touch-none">
        <canvas
          ref={internalCanvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseOut={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    );
  }
);

CanvasArea.displayName = 'CanvasArea';
