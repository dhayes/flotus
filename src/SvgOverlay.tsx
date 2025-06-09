// SvgOverlay.tsx
import React from 'react';
import type { Connection, Point } from './ConnectionManager';

interface Props {
  connections: Connection[];
  portPositions: Record<string, Point>;
}

/**
 * Generates an “S”-shaped cubic Bézier path from (x1,y1) → (x2,y2),
 * flipping the bend if y2 > y1.
 */
function generateSshapedPath(
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

const SvgOverlay: React.FC<Props> = ({ connections, portPositions }) => {
  return (
    <svg
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {connections.map((conn, idx) => {
        const p1 = portPositions[conn.fromPortId];
        const p2 = portPositions[conn.toPortId];
        if (!p1 || !p2) return null;

        const d = generateSshapedPath(p1.x, p1.y, p2.x, p2.y, 0.2);
        return (
          <path
            key={idx}
            d={d}
            stroke="grey"
            strokeWidth={3}
            fill="none"
            style={{ filter: 'drop-shadow(0 0 2px black)' }}
          />
        );
      })}
    </svg>
  );
};

export default SvgOverlay;
