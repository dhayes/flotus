import type { Point } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSshapedPath(
  x1: number, y1: number,
  x2: number, y2: number,
  curvature = 0.2
): string {
  const dx = x2 - x1,
        dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return `M ${x1},${y1} L ${x2},${y2}`;

  // Unit-perpendicular vector
  const ux = -dy / dist,
        uy =  dx / dist;

  // Flip direction if endpoint is below start
  const direction = y2 > y1 ? -1 : 1;
  const offset = curvature * dist * direction;

  // Control pt 1 at 25%, offset one way
  const cp1x = x1 + dx * 0.25 + ux * offset;
  const cp1y = y1 + dy * 0.25 + uy * offset;

  // Control pt 2 at 75%, offset the opposite way
  const cp2x = x1 + dx * 0.75 - ux * offset;
  const cp2y = y1 + dy * 0.75 - uy * offset;

  return `M ${x1},${y1}
          C ${cp1x},${cp1y}
            ${cp2x},${cp2y}
            ${x2},${y2}`;
}

export function transformPoint(
  x: number,
  y: number,
  scale: number,
  offsetX: number,
  offsetY: number
): { x: number; y: number } {
  return {
    x: (x -offsetX) / scale,
    y: (y - offsetY) / scale,
  };
}