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
  label: "3D Scatter Plot",
  description: "Displays a 3D scatter plot from three numeric columns (X, Y, Z).",
  width: 320,
  initialInputs: ["dataframe"],
  outputType: "plot",
  initialState: {
    xCol: null as string | null,
    yCol: null as string | null,
    zCol: null as string | null,
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

    // Keep state.data in sync
    useEffect(() => {
      if (cleanDF) setState((prev) => ({ ...prev, data: cleanDF }));
    }, [cleanDF]);

    // Compute point data for Plotly
    const plotData = useMemo(() => {
      if (!state.data || !state.xCol || !state.yCol || !state.zCol) return null;

      const xVals = state.data[state.xCol]?.values;
      const yVals = state.data[state.yCol]?.values;
      const zVals = state.data[state.zCol]?.values;

      if (!xVals || !yVals || !zVals) return null;
      if (
        typeof xVals[0] !== "number" ||
        typeof yVals[0] !== "number" ||
        typeof zVals[0] !== "number"
      )
        return null;

      const trace: Partial<Data> = {
        x: xVals,
        y: yVals,
        z: zVals,
        mode: "markers",
        type: "scatter3d",
        marker: {
          size: 5,
          opacity: 0.8,
          line: { color: "rgba(217,217,217,0.14)", width: 0.5 },
        },
      };
      return [trace];
    }, [state.data, state.xCol, state.yCol, state.zCol]);

    const layout: Partial<Layout> = useMemo(
      () => ({
        autosize: true,
        width: 280,
        height: 280,
        margin: { l: 0, r: 0, b: 0, t: 0 },
        scene: {
          xaxis: { title: state.xCol ?? "X" },
          yaxis: { title: state.yCol ?? "Y" },
          zaxis: { title: state.zCol ?? "Z" },
        },
      }),
      [state.xCol, state.yCol, state.zCol]
    );

    const plotRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      if (!plotRef.current || !plotData) return;
      Plotly.react(plotRef.current, plotData, layout, {
        staticPlot: false,
        displayModeBar: false,
      });
    }, [plotData, layout]);

    return (
      <div className="flex flex-col gap-3 pl-2">
        {/* Selectors for X, Y, Z columns */}
        {["xCol", "yCol", "zCol"].map((axis) => (
          <Select
            key={axis}
            value={state[axis] ?? ""}
            onValueChange={(value) => setState((s) => ({ ...s, [axis]: value }))}
          >
            <SelectTrigger className="w-[260px] rounded bg-white !text-black">
              <SelectValue placeholder={`${axis.toUpperCase()} Column`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{axis.toUpperCase()} Column</SelectLabel>
                {columns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ))}

        {/* Plot */}
        {plotData && (
          <div className="mt-2 mb-0 !mr-2 !p-2 bg-white text-black rounded text-center">
            <div
              ref={plotRef}
              className="shadow-[0px_4px_6px_4px_rgba(0,0,0,0.35)]"
              style={{ pointerEvents: "auto" }}
            />
          </div>
        )}
      </div>
    );
  },

  hideOutputPort: true,
});

export default NodeScatter3D;
