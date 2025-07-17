// NodeDensity.tsx

import React, { useEffect, useRef, useState } from "react";
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

const NodeDensity = createNodeComponent({
  label: "Density Plot",
  description: "Displays a kernel density estimate of a selected column.",
  width: 280,
  initialInputs: ["dataframe"],
  outputType: "",
  initialState: {
    column: null as string | null,
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
          value={state.column ?? ""}
          onValueChange={(value) => setState((s) => ({ ...s, column: value }))}
        >
          <SelectTrigger className="w-[230px] rounded bg-white !text-black">
            <SelectValue placeholder="Select a column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Column</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {state.column && state.data && (
          <div className="mt-2 mb-0 !mr-2 !p-2 bg-white text-black rounded text-center">
            <BaseRPlot
              data={state.data[state.column]?.values}
              type="density"
              width={230}
              height={230}
              xLabel={state.column}
            />
          </div>
        )}
      </div>
    );
  },

  hideOutputPort: true,
});

export default NodeDensity;
