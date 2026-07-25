import React, { useRef, useEffect, useState } from 'react';

export function SquareContainer({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // Leave a tiny bit of padding to avoid scrollbars
        setSize(Math.floor(Math.min(width, height)));
      }
    });
    
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex-1 w-full h-full flex items-center justify-center min-h-0 min-w-0 print:block print:w-full print:h-auto">
      <div 
        className={`${className || ''} print:!w-full print:!h-auto print:aspect-square`} 
        style={{ 
          ...style, 
          width: size !== null ? size : '100%', 
          height: size !== null ? size : 'auto',
          aspectRatio: size === null ? '1 / 1' : undefined
        }}
      >
        {children}
      </div>
    </div>
  );
}
