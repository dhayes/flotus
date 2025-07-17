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

export function getWindowCenter() {
  const x = window.innerWidth / 2;
  const y = window.innerHeight / 2;
  return { x, y };
}

/**
 * Generates an array of `count` pastel colours in HSL string format.
 * @param count Number of colours to generate
 * @param saturation Saturation percentage (0–100)
 * @param lightness Lightness percentage (0–100)
 */
function generatePastelHSL(
  count: number,
  saturation: number = 70,
  lightness: number = 85
): string[] {
  return Array.from({ length: count }, (_, i) => {
    const hue = Math.round((360 / count) * i);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
}

// Export an array of 100 pastel colours:
export const pastelColors: string[] = generatePastelHSL(100);

// Example usage:
// console.log(pastelColors);
// ["hsl(0, 70%, 85%)", "hsl(3, 70%, 85%)", ..., "hsl(357, 70%, 85%)"]

/** Convert an HSL colour to a hex string */
function hslToHex(h: number, s: number, l: number): string {
  // Convert percentages to fractions
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return `#${[f(0), f(8), f(4)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

// Generate 100 pastel hexes:
export const pastelHexColors: string[] = generatePastelHSL(100).map((hsl) => {
  // extract numbers from "hsl(h, s%, l%)"
  const [h, s, l] = hsl.match(/\d+/g)!.map(Number);
  return hslToHex(h, s, l);
});

