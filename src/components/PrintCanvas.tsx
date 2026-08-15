import { useEffect, useRef } from 'react';
import type { Path } from '../types';
import { drawPath } from '../utils/drawing';

interface PrintCanvasProps {
  paths: Path[];
}

export function PrintCanvas({ paths }: PrintCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const size = 1600;

    canvas.width = size;
    canvas.height = size;

    context.clearRect(0, 0, size, size);
    context.save();
    context.scale(size / 800, size / 800);

    paths.forEach((path) => drawPath(context, path));

    context.restore();
  }, [paths]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
    />
  );
}
