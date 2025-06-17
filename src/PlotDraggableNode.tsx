import React, { useLayoutEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import Plotly, { Data } from 'plotly.js-dist-min';

const PlotDraggableNode: React.FC = () => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const N = 40;
    const range = (start, stop, step = 1) => Array(Math.ceil((stop - start) / step))
      .fill(start)
      .map((x, y) => x + y * step)
    const x = range(-10, 10, 0.2)
    const y = range(-10, 10, 0.2)
    const z = x.map(xi =>
      y.map(yj => {
        const r = Math.sqrt(xi * xi + yj * yj);
        return r === 0 ? 1 : Math.sin(r) / r;
      })
    );
    console.log(z)
    const data: Partial<Data>[] = [{
      z: z,
      type: 'surface',
      showscale: false
    }];
    const layout = {
      title: {
        text: 'Mt Bruno Elevation'
      },
      autosize: false,
      width: 230,
      height: 230,
      margin: {
        l: 5,
        r: 5,
        b: 5,
        t: 5,
      }
    };

    Plotly.newPlot(
      plotRef.current!,
      data,
      layout,
      {
        staticPlot: false,
        displayModeBar: false,
      }
    );

    return () => {
      Plotly.purge(plotRef.current!);
    };
  }, []);

  return (
    <Draggable
      nodeRef={nodeRef}
      cancel=".plotly,input,button"
    >
      <div
        ref={nodeRef}
        style={{
          width: 250,
          border: '1px solid gray',
          background: '#eee',
          padding: '8px',
        }}
      >
        <div
          ref={plotRef}
          style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
        />
        <input className="mt-2" placeholder="Test input" />
      </div>
    </Draggable>
  );
};

export default PlotDraggableNode;
