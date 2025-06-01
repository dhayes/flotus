import React, { useState, useEffect } from 'react';

type Point = { x: number; y: number };

export default function App() {
  const [nodes] = useState<{ id: string; pos: Point }[]>([
    { id: 'A', pos: { x: 100, y: 200 } },
    { id: 'B', pos: { x: 400, y: 100 } },
  ]);

  const [startNode, setStartNode] = useState<string | null>(null);
  const [liveEnd, setLiveEnd] = useState<Point | null>(null);
  const [connections, setConnections] = useState<[Point, Point][]>([]);

  // track mouse for live curve
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (startNode) setLiveEnd({ x: e.clientX, y: e.clientY });
    };
    const onUp = (e: MouseEvent) => {
      if (startNode && liveEnd) {
        const target = nodes.find(
          n => Math.hypot(n.pos.x - e.clientX, n.pos.y - e.clientY) < 20
        );
        if (target && target.id !== startNode) {
          const from = nodes.find(n => n.id === startNode)!.pos;
          setConnections(c => [...c, [from, target.pos]]);
        }
      }
      setStartNode(null);
      setLiveEnd(null);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [startNode, liveEnd, nodes]);

  const renderCurve = (p1: Point, p2: Point, key: React.Key) => {
    const d = generateSshapedPath(p1.x, p1.y, p2.x, p2.y, 0.2);
    return (
      <path
        key={key}
        d={d}
        stroke="lime"
        strokeWidth={3}
        fill="none"
        style={{ filter: 'drop-shadow(0 0 2px black)' }}
      />
    );
  };

  return (
    <>
      {/* SVG Overlay */}
      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        {/* live S-curve preview */}
        {liveEnd && startNode &&
          renderCurve(
            nodes.find(n => n.id === startNode)!.pos,
            liveEnd,
            'live'
          )}
        {/* finalized connections */}
        {connections.map((c, i) => renderCurve(c[0], c[1], i))}
      </svg>

      {/* Nodes */}
      {nodes.map(n => (
        <div
          key={n.id}
          onMouseDown={() => setStartNode(n.id)}
          style={{
            position: 'absolute',
            top: n.pos.y - 10,
            left: n.pos.x - 10,
            width: 20,
            height: 20,
            background: startNode === n.id ? 'orange' : 'teal',
            borderRadius: 4,
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          {n.id}
        </div>
      ))}
    </>
  );
}

/** S-shaped cubic Bézier generator */
function generateSshapedPath(
  x1: number, y1: number,
  x2: number, y2: number,
  curvature = 0.2
): string {
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return `M ${x1},${y1} L ${x2},${y2}`;

  const ux = -dy / dist, uy = dx / dist;
  const offset = curvature * dist;

  const cp1x = x1 + dx * 0.25 + ux * offset;
  const cp1y = y1 + dy * 0.25 + uy * offset;
  const cp2x = x1 + dx * 0.75 - ux * offset;
  const cp2y = y1 + dy * 0.75 - uy * offset;

  return `M ${x1},${y1} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
}
