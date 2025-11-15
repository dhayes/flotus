import React, { useMemo, useEffect } from "react";
import * as dfd from "danfojs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BaseRPlot } from "./BaseRPlot";
import { createNodeComponent } from "../createNodeComponent";

const NodePairPlot = createNodeComponent({
    label: "Pair Plot",
    description:
        "Pairwise scatter plots and densities with correlation coefficients in the upper triangle.",
    width: undefined,
    initialInputs: ["dataframe"],
    outputType: "",
    initialState: {
        columns: [] as string[],
        groupCol: null as string | null,
        data: null as dfd.DataFrame | null,
    },

    computeOutput: (inputs) => {
        const df = inputs[0]?.value;
        return df && df.shape ? df : null;
    },

    renderInputControls: () => null,

    renderControls: ({ inputs, state, setState }) => {
        const df: dfd.DataFrame | null = inputs[0]?.value ?? null;
        const columns = df?.columns || [];

        const cleanDF = useMemo(() => {
            if (!df || !df.shape || df.shape[0] === 0) return null;
            try {
                return df.dropNa();
            } catch {
                return null;
            }
        }, [df]);

        useEffect(() => {
            if (cleanDF) setState((prev) => ({ ...prev, data: cleanDF }));
        }, [cleanDF]);

        const numericCols = useMemo(() => {
            if (!df) return [];
            return df.columns.filter((c) => {
                const dtype = df[c]?.dtype;
                return dtype === "float32" || dtype === "float64" || dtype === "int32";
            });
        }, [df]);

        const selectedCols = state.columns;

        const generateGroupedData = (x: string, y: string) => {
            if (!state.data || !x || !y) return null;
            if (!state.groupCol)
                return state.data
                    ? state.data[x].values.map((vx: number, i: number) => ({
                        x: vx,
                        y: state.data[y].values[i],
                    }))
                    : [];
            const groups = Array.from(new Set(state.data[state.groupCol].values));
            return groups.map((g) => {
                const mask = state.data[state.groupCol].values.map((v: any) => v === g);
                const points = state.data[x].values
                    .map((vx: number, i: number) =>
                        mask[i] ? { x: vx, y: state.data[y].values[i] } : null
                    )
                    .filter(Boolean);
                return { group: String(g), points };
            });
        };

        const generateDensityData = (col: string) => {
            if (!state.data) return null;

            const raw = state.data[col]?.values
                ?.map((v: any) => Number(v))
                ?.filter((v: any) => !isNaN(v));

            if (!state.groupCol) return raw ?? [];

            const groups = Array.from(new Set(state.data[state.groupCol].values));
            return groups.map((g) => {
                const mask = state.data[state.groupCol].values.map((v: any) => v === g);
                const vals = state.data[col].values
                    .map((v: any, i: number) => (mask[i] ? Number(v) : NaN))
                    .filter((v: number) => !isNaN(v));
                return { group: String(g), values: vals };
            });
        };


        const correlation = (a: number[], b: number[]) => {
            if (!a || !b || a.length !== b.length) return NaN;
            const n = a.length;
            const meanA = a.reduce((s, v) => s + v, 0) / n;
            const meanB = b.reduce((s, v) => s + v, 0) / n;
            const num = a.reduce((acc, v, i) => acc + (v - meanA) * (b[i] - meanB), 0);
            const denA = Math.sqrt(a.reduce((acc, v) => acc + (v - meanA) ** 2, 0));
            const denB = Math.sqrt(b.reduce((acc, v) => acc + (v - meanB) ** 2, 0));
            return num / (denA * denB);
        };

        const corrMatrix = useMemo(() => {
            if (!state.data || selectedCols.length < 2) return {};
            const result: Record<string, Record<string, number>> = {};
            for (const colA of selectedCols) {
                result[colA] = {};
                for (const colB of selectedCols) {
                    if (colA === colB) result[colA][colB] = 1;
                    else {
                        const a = state.data[colA]?.values ?? [];
                        const b = state.data[colB]?.values ?? [];
                        result[colA][colB] = correlation(a, b);
                    }
                }
            }
            return result;
        }, [state.data, selectedCols]);

        return (
            <div className="flex flex-col gap-3 pl-2">
                {/* Column Multi-select */}
                <Select
                    value=""
                    onValueChange={(value) =>
                        setState((s) => {
                            const newCols = s.columns.includes(value)
                                ? s.columns.filter((c) => c !== value)
                                : [...s.columns, value];
                            return { ...s, columns: newCols };
                        })
                    }
                >
                    <SelectTrigger className="w-[280px] rounded bg-white !text-black">
                        <SelectValue
                            placeholder={
                                state.columns.length > 0
                                    ? state.columns.join(", ")
                                    : "Select numeric columns"
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Numeric Columns</SelectLabel>
                            {numericCols.map((col) => (
                                <SelectItem key={col} value={col}>
                                    {col}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {/* Optional Group Column */}
                <Select
                    value={state.groupCol ?? "__none__"}
                    onValueChange={(value) =>
                        setState((s) => ({
                            ...s,
                            groupCol: value === "__none__" ? null : value,
                        }))
                    }
                >
                    <SelectTrigger className="w-[280px] rounded bg-white !text-black">
                        <SelectValue placeholder="Group column (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Group</SelectLabel>
                            {columns.map((col) => (
                                <SelectItem key={col} value={col}>
                                    {col}
                                </SelectItem>
                            ))}
                            <SelectItem value="__none__">(None)</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>


                {/* Grid of pairwise plots + correlation coefficients */}
                {state.columns.length > 0 && state.data && (
                    <div
                        className="grid bg-gray-100 rounded p-2 w-auto h-auto"
                        style={{
                            gridTemplateColumns: `repeat(${state.columns.length}, minmax(260px, 2fr))`,
                            gap: "6px",
                        }}
                    >
                        {state.columns.map((rowCol, i) =>
                            state.columns.map((colCol, j) => {
                                const key = `${i}-${j}`;
                                const isDiagonal = i === j;

                                if (isDiagonal) {
                                    const densityData = generateDensityData(rowCol);
                                    return (
                                        <div key={key} className="bg-white p-0.5 rounded shadow-inner">
                                            <BaseRPlot
                                                data={densityData ?? []}
                                                type={
                                                    state.groupCol
                                                        ? "density-grouped"
                                                        : "density"
                                                }
                                                width={undefined}
                                                height={undefined}
                                                xLabel={rowCol}
                                                compact={true}
                                            />
                                        </div>
                                    );
                                } else if (i > j) {
                                    const plotData = generateGroupedData(colCol, rowCol);
                                    return (
                                        <div key={key} className="bg-white p-1 rounded shadow-inner">
                                            <BaseRPlot
                                                data={plotData ?? []}
                                                type={
                                                    state.groupCol
                                                        ? "scatter-grouped"
                                                        : "scatter"
                                                }
                                                width={undefined}
                                                height={undefined}
                                                xLabel={colCol}
                                                yLabel={rowCol}
                                                compact={true}
                                            />
                                        </div>
                                    );
                                } else {
                                    const corr = corrMatrix[rowCol]?.[colCol] ?? NaN;
                                    const text = Number.isFinite(corr)
                                        ? corr.toFixed(2)
                                        : "–";
                                    const intensity = Math.abs(corr);
                                    const bg = `rgba(${corr >= 0 ? "0,128,0" : "200,0,0"},${0.15 +
                                        intensity * 0.6})`;
                                    return (
                                        <div
                                            key={key}
                                            className="flex items-center justify-center rounded text-black font-semibold"
                                            style={{
                                                backgroundColor: bg,
                                                color: "black",
                                                fontSize: "0.9rem",
                                                textAlign: "center",
                                            }}
                                        >
                                            {text}
                                        </div>
                                    );
                                }
                            })
                        )}
                    </div>
                )}
            </div>
        );
    },

    hideOutputPort: true,
});

export default NodePairPlot;
