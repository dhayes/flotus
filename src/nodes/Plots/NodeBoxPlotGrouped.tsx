import React, { useEffect, useMemo } from "react";
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
import Plotly from "plotly.js-dist-min";
import { createNodeComponent } from "../createNodeComponent";

const NodeBoxPlotGrouped = createNodeComponent({
  label: "Boxplot (Grouped)",
  description: "Boxplot of a numeric column grouped by a categorical column.",
  width: 320,
  initialInputs: ["dataframe"],
  outputType: "",
  initialState: {
    numericCol: null as string | null,
    groupCol: null as string | null,
    data: null as dfd.DataFrame | null,
  },

  computeOutput: (inputs) => {
    const df = inputs[0]?.value;
    return df && df.shape ? df : null;
  },

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df = inputs[0]?.value;
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

    const plotRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!plotRef.current || !state.numericCol || !state.groupCol || !state.data)
        return;

      const groups = Array.from(new Set(state.data[state.groupCol].values));
      const traces = groups.map((g) => {
        const mask = state.data[state.groupCol].values.map((v: any) => v === g);
        const values = state.data[state.numericCol].values.filter((_, i) => mask[i]);
        return {
          y: values,
          name: String(g),
          type: "box",
          boxpoints: "outliers",
          jitter: 0.3,
          marker: { opacity: 0.6 },
        };
      });

      Plotly.react(plotRef.current, traces, {
        width: 280,
        height: 260,
        margin: { l: 30, r: 10, b: 40, t: 20 },
        showlegend: false,
        yaxis: { title: state.numericCol },
        xaxis: { title: state.groupCol },
      });
    }, [state.data, state.numericCol, state.groupCol]);

    return (
      <div className="flex flex-col gap-3 pl-2">
        <Select
          value={state.numericCol ?? ""}
          onValueChange={(value) => setState((s) => ({ ...s, numericCol: value }))}
        >
          <SelectTrigger className="w-[260px] rounded bg-white !text-black">
            <SelectValue placeholder="Numeric column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Numeric</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={state.groupCol ?? ""}
          onValueChange={(value) => setState((s) => ({ ...s, groupCol: value }))}
        >
          <SelectTrigger className="w-[260px] rounded bg-white !text-black">
            <SelectValue placeholder="Group column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Group</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div ref={plotRef} className="bg-white rounded shadow-inner mt-2" />
      </div>
    );
  },

  hideOutputPort: true,
});

export default NodeBoxPlotGrouped;
