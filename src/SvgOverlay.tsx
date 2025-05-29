// SvgOverlay.tsx
import React from 'react';
import { Point } from './ConnectionManager';

interface Props {
  connections: { from: string; to: string }[];
  nodePositions: Record<string, Point>;
}

const SvgOverlay: React.FC<Props> = ({ connections, nodePositions }) => {
  const renderCurve = (p1: Point, p2: Point, i: number) => {
    const cx = (p1.x + p2.x) / 2;
    const cy = Math.min(p1.y, p2.y) - 100;
    const d = `M ${p1.x},${p1.y} Q ${cx},${cy} ${p2.x},${p2.y}`;
    return <path key={i} d={d} stroke="lime" strokeWidth={3} fill="none" />;
  };

  return (
    <svg
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {connections.map((conn, i) => {
        const from = nodePositions[conn.from];
        const to = nodePositions[conn.to];
        return from && to ? renderCurve(from, to, i) : null;
      })}
    </svg>
  );
};

export default SvgOverlay;
