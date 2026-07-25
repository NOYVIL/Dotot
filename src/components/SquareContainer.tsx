import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

interface SquareContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function SquareContainer({ children, className = '', style }: SquareContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setSize(Math.floor(Math.min(entry.contentRect.width, entry.contentRect.height)));
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex h-full min-h-0 w-full min-w-0 flex-1 items-center justify-center print:block print:h-auto print:w-full">
      <div
        className={`${className} print:aspect-square print:h-auto! print:w-full!`}
        style={{
          ...style,
          width: size ?? '100%',
          height: size ?? 'auto',
          aspectRatio: size === null ? '1 / 1' : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
