import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

const Simple3DPlot: React.FC = () => {
  const plotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!plotRef.current) return;

    const z1 = [
      [8.83, 8.89, 8.81, 8.87, 8.9, 8.87],
      [8.89, 8.94, 8.85, 8.94, 8.96, 8.92],
      [8.84, 8.9, 8.82, 8.92, 8.93, 8.91],
      [8.79, 8.85, 8.79, 8.9, 8.94, 8.92],
      [8.79, 8.88, 8.81, 8.9, 8.95, 8.92],
      [8.8, 8.82, 8.78, 8.91, 8.94, 8.92],
      [8.75, 8.78, 8.77, 8.91, 8.95, 8.92],
      [8.8, 8.8, 8.77, 8.91, 8.95, 8.94],
      [8.74, 8.81, 8.76, 8.93, 8.98, 8.99],
      [8.89, 8.99, 8.92, 9.1, 9.13, 9.11],
      [8.97, 8.97, 8.91, 9.09, 9.11, 9.11],
      [9.04, 9.08, 9.05, 9.25, 9.28, 9.27],
      [9.0, 9.01, 9.0, 9.2, 9.23, 9.2],
      [8.99, 8.99, 8.98, 9.18, 9.2, 9.19],
      [8.93, 8.97, 8.97, 9.18, 9.2, 9.18],
    ];
    const z2 = z1.map(row => row.map(v => v + 1));
    const z3 = z1.map(row => row.map(v => v - 1));

    const data: Partial<Plotly.Data>[] = [
      { z: z1, type: 'surface' },
      { z: z2, type: 'surface', showscale: false, opacity: 0.9 },
      { z: z3, type: 'surface', showscale: false, opacity: 0.9 },
    ];

    const layout = {
      title: { text: '3D Surface Example' },
      width: 600,
      height: 600,
      margin: { t: 50, l: 0, r: 0, b: 0 },
    };

    Plotly.newPlot(plotRef.current, data, layout);
  }, []);

  return <div ref={plotRef} style={{ width: 600, height: 600 }} />;
};

export default Simple3DPlot;
