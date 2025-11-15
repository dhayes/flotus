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
import { BaseRPlot } from "./BaseRPlot";
import { createNodeComponent } from "../createNodeComponent";

const NodeScatterGrouped = createNodeComponent({
  label: "Scatter Plot (Grouped)",
  description: "Scatter plot colored by a categorical grouping column.",
  width: 320,
  initialInputs: ["dataframe"],
  outputType: "",
  initialState: {
    xCol: null as string | null,
    yCol: null as string | null,
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

    const groupedData = useMemo(() => {
      if (!state.data || !state.xCol || !state.yCol || !state.groupCol) return null;

      const groups = Array.from(new Set(state.data[state.groupCol].values));
      return groups.map((g) => {
        const mask = state.data[state.groupCol].values.map((v: any) => v === g);
        const points = state.data[state.xCol].values
          .map((x: number, i: number) =>
            mask[i] ? { x, y: state.data[state.yCol].values[i] } : null
          )
          .filter(Boolean);
        return { group: String(g), points };
      });
    }, [state.data, state.xCol, state.yCol, state.groupCol]);

    return (
      <div className="flex flex-col gap-3 pl-2">
        <Select
          value={state.xCol ?? ""}
          onValueChange={(value) => setState((s) => ({ ...s, xCol: value }))}
        >
          <SelectTrigger className="w-[260px] rounded bg-white !text-black">
            <SelectValue placeholder="X Column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>X</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={state.yCol ?? ""}
          onValueChange={(value) => setState((s) => ({ ...s, yCol: value }))}
        >
          <SelectTrigger className="w-[260px] rounded bg-white !text-black">
            <SelectValue placeholder="Y Column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Y</SelectLabel>
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
            <SelectValue placeholder="Group Column" />
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

        {groupedData && (
          <div className="mt-2 mb-0 !mr-2 !p-2 bg-white text-black rounded text-center">
            <BaseRPlot
              data={groupedData}
              type="scatter-grouped"
              width={260}
              height={260}
              xLabel={state.xCol ?? "X"}
              yLabel={state.yCol ?? "Y"}
            />
          </div>
        )}
      </div>
    );
  },

  hideOutputPort: true,
});

export default NodeScatterGrouped;
