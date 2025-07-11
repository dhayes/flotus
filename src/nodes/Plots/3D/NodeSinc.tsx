// NodeSinc.tsx

import React, { useLayoutEffect, useRef } from 'react';
import Plotly, { Data } from 'plotly.js-dist-min';
import { createNodeComponent } from '../../createNodeComponent';

const NodeSinc = createNodeComponent({
    label: 'Sinc',
    initialState: {},
    initialInputs: 2,

    computeOutput: (inputs) => {
        const a = inputs[0]?.value ?? 0;
        const b = inputs[1]?.value ?? 0;
        return a + b;
    },

    renderInputControls: ({ input, index, updateInput }) => (
        <input
            className="w-1/3 ml-2 py-0 px-2 bg-white text-black rounded"
            type={input.connected ? 'text' : 'number'}
            readOnly={!!input.connected}
            value={input.value}
            onChange={(e) => updateInput(index, { value: Number(e.target.value) })}
        />
    ),


    renderOutput: () => <></>,

    renderControls: (props) => {
        const plotRef = useRef<HTMLDivElement>(null);
        const inputs = props.inputs

        useLayoutEffect(() => {
            const N = 40;
            const range = (start: number, stop: number, step = 1) =>
                Array.from({ length: Math.ceil((stop - start) / step) }, (_, i) => start + i * step);
            const x = range(-10, 10, 0.2);
            const y = range(-10, 10, 0.2);
            const z = x.map(xi =>
                y.map(yj => {
                    const r = Math.sqrt(inputs[0].value * xi * xi + inputs[1].value * yj * yj);
                    return r === 0 ? 1 : Math.sin(r) / r;
                })
            );

            const data: Partial<Data>[] = [
                {
                    z,
                    type: 'surface',
                    showscale: false,
                },
            ];

            const layout = {
                autosize: true,
                width: 230,
                height: 230,
                margin: { l: 5, r: 5, b: 5, t: 0 },
            };

            Plotly.newPlot(plotRef.current!, data, layout, {
                staticPlot: false,
                displayModeBar: false,
            });

            return () => Plotly.purge(plotRef.current!);
        }, [inputs]);

        return (
            <div className='flex flex-col !items-center !gap-0'>
                <div
                    ref={plotRef}
                    style={{ pointerEvents: 'auto' }}
                    className='flex 1 1 auto self-center shadow-[0px_4px_6px_4px_rgba(0,_0,_0,_0.35)]'
                />
            </div>
        );
    },
    hideOutputPort: true,
});

export default NodeSinc;
