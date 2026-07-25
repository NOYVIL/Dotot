import type { Path } from '../types';

export function drawPath(context: CanvasRenderingContext2D, path: Path): void {
  if (path.points.length === 0) return;

  const alpha = Math.max(0, Math.min(path.opacity, 100)) / 100;
  context.strokeStyle = `rgba(24, 24, 27, ${alpha})`;
  context.fillStyle = `rgba(24, 24, 27, ${alpha})`;
  context.lineWidth = path.size;

  if (path.type === 'rounded' || path.type === 'square') {
    context.lineCap = path.type === 'rounded' ? 'round' : 'square';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(path.points[0].x, path.points[0].y);
    for (const point of path.points.slice(1)) {
      context.lineTo(point.x, point.y);
    }
    context.stroke();
    return;
  }

  const angle = -Math.PI / 4;
  const dx = Math.cos(angle) * (path.size / 2);
  const dy = Math.sin(angle) * (path.size / 2);

  if (path.points.length === 1) {
    const [point] = path.points;
    context.beginPath();
    context.moveTo(point.x - dx, point.y - dy);
    context.lineTo(point.x + dx, point.y + dy);
    context.stroke();
    return;
  }

  context.beginPath();
  for (let index = 1; index < path.points.length; index += 1) {
    const previous = path.points[index - 1];
    const current = path.points[index];
    context.moveTo(previous.x - dx, previous.y - dy);
    context.lineTo(previous.x + dx, previous.y + dy);
    context.lineTo(current.x + dx, current.y + dy);
    context.lineTo(current.x - dx, current.y - dy);
    context.closePath();
  }
  context.fill();
}
