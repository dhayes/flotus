import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSshapedPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tension = 0.5 // 0 = tight, 1 = very loose
): string {
  // Vector from start to end
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  // if (dist < 1e-3) return `M ${x1},${y1} L ${x2},${y2}`;

  // --- direction & orientation ---
  const horizontalBias = Math.abs(dx) / (Math.abs(dx) + Math.abs(dy)); // 1 = mostly horizontal
  const verticalBias = 1 - horizontalBias;

  // --- curvature scaling ---
  // dynamic curvature: tighter for short lines, smoother for long lines
  const baseCurve = Math.min(0.4 + 0.3 * tension, 0.7);
  const curveStrength = baseCurve * dist * (0.5 + 0.5 * horizontalBias);

  // --- angle factor ---
  const angle = Math.atan2(dy, dx);
  const angleSin = Math.sin(angle);
  const angleCos = Math.cos(angle);

  // Control point directions:
  // C1 pulls forward from start, slightly perpendicular to avoid overlaps
  const c1x = x1 + curveStrength * angleCos - verticalBias * dist * 0.1 * angleSin;
  const c1y = y1 + curveStrength * angleSin + verticalBias * dist * 0.1 * angleCos;

  // C2 pulls backward from end, mirrored curvature
  const c2x = x2 - curveStrength * angleCos + verticalBias * dist * 0.1 * angleSin;
  const c2y = y2 - curveStrength * angleSin - verticalBias * dist * 0.1 * angleCos;

  // --- optional near-vertical compensation ---
  // if nodes are stacked vertically, bend less
  const verticalFactor = Math.abs(dy) / Math.max(1, dist);
  // if (verticalFactor > 0.85) {
     const midx = (x1 + x2) / 2;
    return `M ${x1},${y1} C ${midx},${y1} ${midx},${y2} ${x2},${y2}`;
  // }

  // --- final cubic Bézier path ---
  return `M ${x1},${y1}
          C ${c1x},${c1y}
            ${c2x},${c2y}
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

