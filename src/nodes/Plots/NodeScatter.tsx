// NodeScatter.tsx

import React, { useEffect } from "react";
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

const NodeScatter = createNodeComponent({
  label: "Scatter Plot",
  description: "Scatter plot of two numeric columns.",
  width: 300,
  initialInputs: ["dataframe"],
  outputType: "",
  initialState: {
    xCol: null as string | null,
    yCol: null as string | null,
    data: null as dfd.DataFrame | null,
  },

  computeOutput: (inputs) => {
    const df = inputs[0]?.value;
    return df && typeof df.shape !== "undefined" ? df : null;
  },

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df = inputs[0]?.value;
    const hasData = df && df.shape && df.shape[0] > 0;
    const cleanDF = hasData ? df.dropNa() : null;
    const columns = df?.columns || [];

    useEffect(() => {
      if (cleanDF) {
        setState((prev) => ({ ...prev, data: cleanDF }));
      }
    }, [df]);

    return (
      <div className="flex flex-col gap-4 pl-2">
        <Select
          value={state.xCol ?? ""}
          onValueChange={(value) => setState((s) => ({ ...s, xCol: value }))}
        >
          <SelectTrigger className="w-[260px] rounded bg-white !text-black">
            <SelectValue placeholder="X Column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>X Column</SelectLabel>
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
              <SelectLabel>Y Column</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {state.xCol && state.yCol && state.data && (
          <div className="mt-2 mb-0 !mr-2 !p-2 bg-white text-black rounded text-center">
            <BaseRPlot
              data={state.data[state.xCol].values.map((x: number, i: number) => ({
                x,
                y: state.data[state.yCol].values[i],
              }))}
              type="scatter"
              width={260}
              height={260}
              xLabel={state.xCol}
              yLabel={state.yCol}
            />
          </div>
        )}
      </div>
    );
  },

  hideOutputPort: true,
});

export default NodeScatter;
