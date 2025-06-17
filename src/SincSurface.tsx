import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-basic-dist';
import type * as PlotlyType from 'plotly.js';

const SincSurface: React.FC = () => {
  const plotRef = useRef<HTMLDivElement>(null);
  const N = 50;
  const x = Array.from({ length: N }, (_, i) => -10 + (20 * i) / (N - 1));
  const y = [...x];

  // Compute z-values for sinc(r) = sin(r)/r
  const computeZ = () =>
    x.map(xi =>
      y.map(yj => {
        const r = Math.sqrt(xi * xi + yj * yj);
        return r === 0 ? 1 : Math.sin(r) / r;
      })
    );

  useEffect(() => {
    if (!plotRef.current) return;

    const plotly = Plotly as unknown as typeof PlotlyType;
    const data: Partial<PlotlyType.PlotData>[] = [
      { type: 'surface', x, y, z: computeZ() },
    ];
    const layout: Partial<PlotlyType.Layout> = {
      scene: { zaxis: { range: [-0.5, 1] } },
      autosize: true,
    };

    plotly.newPlot(plotRef.current, data as any, layout as any);
  }, []);

  return <div ref={plotRef} style={{ width: '100%', height: '600px' }} />;
};

export default SincSurface;