import { forwardRef, useCallback, useEffect, useRef } from 'react';
import type { Dispatch, MouseEvent as ReactMouseEvent, SetStateAction, TouchEvent as ReactTouchEvent } from 'react';
import type { LineType, Path, Point } from '../types';
import { drawPath } from '../utils/drawing';

interface CanvasAreaProps {
  lineType: LineType;
  lineSize: number;
  lineOpacity: number;
  paths: Path[];
  setPaths: Dispatch<SetStateAction<Path[]>>;
}

export const CanvasArea = forwardRef<HTMLCanvasElement, CanvasAreaProps>(
  ({ lineType, lineSize, lineOpacity, paths, setPaths }, forwardedRef) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false);
    const currentPathRef = useRef<Path | null>(null);

    useEffect(() => {
      if (typeof forwardedRef === 'function') {
        forwardedRef(canvasRef.current);
      } else if (forwardedRef) {
        forwardedRef.current = canvasRef.current;
      }
    }, [forwardedRef]);

    const render = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.scale(canvas.width / 800, canvas.height / 800);

      paths.forEach((path) => drawPath(context, path));
      if (currentPathRef.current) drawPath(context, currentPathRef.current);

      context.restore();
    }, [paths]);

    useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const observer = new ResizeObserver(([entry]) => {
        if (!entry) return;
        const scale = Math.max(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(entry.contentRect.width * scale);
        canvas.height = Math.round(entry.contentRect.height * scale);
        render();
      });

      observer.observe(container);
      return () => observer.disconnect();
    }, [render]);

    useEffect(render, [render]);

    const getCoordinates = (
      event: ReactMouseEvent | ReactTouchEvent,
    ): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      let clientX: number;
      let clientY: number;

      if ('touches' in event) {
        const touch = event.touches[0];
        if (!touch) return null;
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      return {
        x: ((clientX - rect.left) / rect.width) * 800,
        y: ((clientY - rect.top) / rect.height) * 800,
      };
    };

    const handleStart = (event: ReactMouseEvent | ReactTouchEvent) => {
      const point = getCoordinates(event);
      if (!point) return;

      isDrawingRef.current = true;
      currentPathRef.current = {
        points: [point],
        type: lineType,
        size: lineSize,
        opacity: lineOpacity,
      };
      render();
    };

    const handleMove = (event: ReactMouseEvent | ReactTouchEvent) => {
      if (!isDrawingRef.current || !currentPathRef.current) return;
      const point = getCoordinates(event);
      if (!point) return;

      currentPathRef.current.points.push(point);
      render();
    };

    const handleEnd = () => {
      if (!isDrawingRef.current || !currentPathRef.current) return;

      const finishedPath = currentPathRef.current;
      currentPathRef.current = null;
      isDrawingRef.current = false;
      setPaths((current) => [...current, finishedPath]);
    };

    return (
      <div ref={containerRef} className="absolute inset-0 cursor-crosshair touch-none overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className="absolute left-0 top-0 h-full w-full"
        />
      </div>
    );
  },
);

CanvasArea.displayName = 'CanvasArea';
