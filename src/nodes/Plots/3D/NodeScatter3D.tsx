import React, { useEffect, useMemo, useRef, useLayoutEffect } from "react";
import * as dfd from "danfojs";
import Plotly, { Data, Layout } from "plotly.js-dist-min";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createNodeComponent } from "../../createNodeComponent";

const NodeScatter3D = createNodeComponent({
    label: "3D Scatter (Color)",
    description:
        "Displays a 3D scatter plot with optional color grouping or numeric color scaling.",
    width: 340,
    initialInputs: ["dataframe"],
    outputType: "plot",
    initialState: {
        xCol: null as string | null,
        yCol: null as string | null,
        zCol: null as string | null,
        colorCol: null as string | null,
        data: null as dfd.DataFrame | null,
    },

    computeOutput: (inputs) => {
        const df = inputs[0]?.value;
        return df && df.shape ? df : null;
    },

    renderInputControls: () => null,

    renderControls: ({ inputs, state, setState }) => {
        const df: dfd.DataFrame | null = inputs[0]?.value ?? null;

        // Clean NaNs and get available columns
        const cleanDF = useMemo(() => {
            if (!df || !df.shape || df.shape[0] === 0) return null;
            try {
                return df.dropNa();
            } catch {
                return null;
            }
        }, [df]);

        const columns = useMemo(() => (df ? df.columns : []), [df]);

        // Sync cleaned dataframe
        useEffect(() => {
            if (cleanDF) setState((prev) => ({ ...prev, data: cleanDF }));
        }, [cleanDF]);

        const plotData = useMemo(() => {
            if (!state.data || !state.xCol || !state.yCol || !state.zCol) return null;

            const x = state.data[state.xCol]?.values;
            const y = state.data[state.yCol]?.values;
            const z = state.data[state.zCol]?.values;
            if (!x || !y || !z) return null;

            const colorVals = state.colorCol
                ? state.data[state.colorCol]?.values
                : null;

            // Determine if color column is numeric or categorical
            const isNumericColor =
                colorVals && typeof colorVals[0] === "number" && !Number.isNaN(colorVals[0]);

            // --- Case 1: Numeric color scale ---
            if (isNumericColor) {
                const trace: Partial<Data> = {
                    x,
                    y,
                    z,
                    mode: "markers",
                    type: "scatter3d",
                    marker: {
                        size: 3,
                        opacity: 0.85,
                        color: colorVals,
                        colorscale: "Viridis",
                        colorbar: { title: state.colorCol ?? "" },
                        line: { color: "rgba(217,217,217,0.14)", width: 0.5 },
                    },
                };
                return [trace];
            }

            // --- Case 2: Categorical colors (split into traces) ---
            if (colorVals && typeof colorVals[0] !== "number") {
                const categories = Array.from(new Set(colorVals));
                return categories.map((cat) => {
                    const indices = colorVals
                        .map((v: any, i: number) => (v === cat ? i : -1))
                        .filter((i: number) => i >= 0);
                    return {
                        x: indices.map((i) => x[i]),
                        y: indices.map((i) => y[i]),
                        z: indices.map((i) => z[i]),
                        mode: "markers",
                        type: "scatter3d",
                        name: String(cat),
                        marker: {
                            size: 3,
                            opacity: 0.85,
                            line: { color: "rgba(217,217,217,0.14)", width: 0.5 },
                        },
                    } as Partial<Data>;
                });
            }

            // --- Default single trace ---
            const trace: Partial<Data> = {
                x,
                y,
                z,
                mode: "markers",
                type: "scatter3d",
                marker: {
                    size: 3,
                    opacity: 0.85,
                    line: { color: "rgba(217,217,217,0.14)", width: 0.5 },
                },
            };
            return [trace];
        }, [state.data, state.xCol, state.yCol, state.zCol, state.colorCol]);

        const layout: Partial<Layout> = useMemo(
            () => ({
                autosize: true,
                width: 300,
                height: 300,
                margin: { l: 0, r: 0, b: 0, t: 0 },
                scene: {
                    xaxis: { title: state.xCol ?? "X" },
                    yaxis: { title: state.yCol ?? "Y" },
                    zaxis: { title: state.zCol ?? "Z" },
                },
                showlegend: !!state.colorCol,
                legend: {
                    x: 0.02,       // position horizontally (0 = left, 1 = right)
                    y: 0.98,       // position vertically   (0 = bottom, 1 = top)
                    xanchor: 'left',
                    yanchor: 'top',
                    bgcolor: 'rgba(255,255,255,0.5)',  // semi-transparent background
                    bordercolor: 'rgba(0,0,0,0.1)',
                    borderwidth: 1,
                    orientation: 'v',
                    // this prevents the legend from shrinking the scene:
                    itemclick: 'toggleothers',
                }
            }),
            [state.xCol, state.yCol, state.zCol, state.colorCol]
        );

        const plotRef = useRef<HTMLDivElement>(null);

        useLayoutEffect(() => {
            if (!plotRef.current || !plotData) return;
            Plotly.react(plotRef.current, plotData, layout, {
                staticPlot: false,
                displayModeBar: false,
            });
        }, [plotData, layout]);

        // Dropdown rendering helper
        const makeSelect = (axisKey: string, placeholder: string) => (
            <Select
                value={state[axisKey] ?? ""}
                onValueChange={(value) => setState((s) => ({ ...s, [axisKey]: value }))}
            >
                <SelectTrigger className="w-[280px] rounded bg-white !text-black">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{placeholder}</SelectLabel>
                        {columns.map((col) => (
                            <SelectItem key={col} value={col}>
                                {col}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        );

        return (
            <div className="flex flex-col gap-3 pl-2">
                {makeSelect("xCol", "X Column")}
                {makeSelect("yCol", "Y Column")}
                {makeSelect("zCol", "Z Column")}
                {makeSelect("colorCol", "Color Column")}

                {plotData && (
                    <div className="flex flex-col items-center gap-0">
                        <div
                            ref={plotRef}
                            style={{ pointerEvents: "auto" }}
                            className="flex 1 1 auto self-center shadow-[0px_4px_6px_4px_rgba(0,_0,_0,_0.35)]"
                        />
                    </div>
                )}
            </div>
        );
    },

    hideOutputPort: true,
});

export default NodeScatter3D;
