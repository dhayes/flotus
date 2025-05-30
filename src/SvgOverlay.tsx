import React from 'react';
import type { Connection } from './ConnectionManager';
import type { Point } from './types';

interface Props {
  connections: Connection[];
  nodePositions: Record<string, Point>;
}

function generateSshapedPath(
  x1: number, y1: number,
  x2: number, y2: number,
  curvature = 0.2
): string {
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return `M ${x1},${y1} L ${x2},${y2}`;

  // unit-perpendicular
  const ux = -dy / dist, uy = dx / dist;
  const direction = y2 > y1 ? -1 : 1;
  const offset = curvature * dist * direction;

  // two control points at 25% and 75%, offset in opposite senses
  const cp1x = x1 + dx * 0.25 + ux * offset;
  const cp1y = y1 + dy * 0.25 + uy * offset;
  const cp2x = x1 + dx * 0.75 - ux * offset;
  const cp2y = y1 + dy * 0.75 - uy * offset;

  return `M ${x1},${y1} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
}

const SvgOverlay: React.FC<Props> = ({ connections, nodePositions }) => (
  <svg
    style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      pointerEvents: 'none',
      zIndex: 9999
    }}
  >
    {connections.map((conn, i) => {
      const p1 = nodePositions[conn.from];
      const p2 = nodePositions[conn.to];
      if (!p1 || !p2) return null;

      const d = generateSshapedPath(p1.x, p1.y, p2.x, p2.y, 0.2);
      return (
        <path
          key={i}
          d={d}
          stroke="lime"
          strokeWidth={3}
          fill="none"
          style={{ filter: 'drop-shadow(0 0 2px black)' }}
        />
      );
    })}
  </svg>
);

export default SvgOverlay;