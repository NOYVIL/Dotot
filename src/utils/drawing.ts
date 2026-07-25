import { Path, GridType } from '../types';

export function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, gridType: GridType) {
  ctx.fillStyle = '#e5e7eb'; // zinc-200
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;

  const drawDot = (x: number, y: number, r: number = 1.5) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawCross = (x: number, y: number, size: number = 3) => {
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  };

  switch (gridType) {
    case 'standard': {
      const spacing = 20;
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          drawDot(x, y);
        }
      }
      break;
    }
    case 'wide': {
      const spacing = 40;
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          drawDot(x, y, 2);
        }
      }
      break;
    }
    case 'dense': {
      const spacing = 10;
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          drawDot(x, y, 1);
        }
      }
      break;
    }
    case 'isometric': {
      const spacingX = 20;
      const spacingY = 17.32; // 20 * sin(60)
      let row = 0;
      for (let y = 0; y < height; y += spacingY) {
        const offsetX = (row % 2 === 0) ? 0 : spacingX / 2;
        for (let x = offsetX; x < width; x += spacingX) {
          drawDot(x, y);
        }
        row++;
      }
      break;
    }
    case 'cross': {
      const spacing = 30;
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          drawCross(x, y);
        }
      }
      break;
    }
    case 'lined': {
      const spacing = 24;
      for (let y = 0; y < height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        for (let x = 0; x < width; x += spacing) {
          drawDot(x, y, 1.5);
        }
      }
      break;
    }
  }
}

export function drawPath(ctx: CanvasRenderingContext2D, path: Path) {
  if (path.points.length === 0) return;

  const alpha = path.opacity / 100;
  ctx.strokeStyle = `rgba(24, 24, 27, ${alpha})`; // zinc-900 color
  ctx.fillStyle = `rgba(24, 24, 27, ${alpha})`;
  ctx.lineWidth = path.size;

  if (path.type === 'rounded') {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(path.points[0].x, path.points[0].y);
    for (let i = 1; i < path.points.length; i++) {
      ctx.lineTo(path.points[i].x, path.points[i].y);
    }
    ctx.stroke();
  } else if (path.type === 'square') {
    ctx.lineCap = 'square';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(path.points[0].x, path.points[0].y);
    for (let i = 1; i < path.points.length; i++) {
      ctx.lineTo(path.points[i].x, path.points[i].y);
    }
    ctx.stroke();
  } else if (path.type === 'calligraphy') {
    const angle = -Math.PI / 4;
    const dx = Math.cos(angle) * (path.size / 2);
    const dy = Math.sin(angle) * (path.size / 2);

    if (path.points.length < 2) {
       const cx = path.points[0].x;
       const cy = path.points[0].y;
       ctx.beginPath();
       ctx.moveTo(cx - dx, cy - dy);
       ctx.lineTo(cx + dx, cy + dy);
       ctx.stroke();
       return;
    }
    
    ctx.beginPath();
    for (let i = 1; i < path.points.length; i++) {
      const p1 = path.points[i - 1];
      const p2 = path.points[i];
      
      ctx.moveTo(p1.x - dx, p1.y - dy);
      ctx.lineTo(p1.x + dx, p1.y + dy);
      ctx.lineTo(p2.x + dx, p2.y + dy);
      ctx.lineTo(p2.x - dx, p2.y - dy);
      ctx.closePath();
    }
    ctx.fill();
  }
}
