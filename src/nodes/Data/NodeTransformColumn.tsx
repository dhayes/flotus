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
import { createNodeComponent } from "../createNodeComponent";

const NodeTransformColumn = createNodeComponent({
  label: "Transform Column",
  description:
    "Applies a mathematical transformation (log, sqrt, standardize) to a selected numeric column.",
  width: 300,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    column: null as string | null,
    transform: "log" as
      | "log"
      | "log10"
      | "sqrt"
      | "square"
      | "exp"
      | "zscore"
      | "minmax",
    data: null as dfd.DataFrame | null,
  },

  computeOutput: (inputs, state) => {
    const df: dfd.DataFrame | null = inputs[0]?.value ?? null;
    if (!df || !state.column) return df;

    const col = df[state.column];
    if (!col || typeof col.values[0] !== "number") return df;

    const applyTransform = (values: number[]) => {
      switch (state.transform) {
        case "log":
          return values.map((v) => Math.log(v > 0 ? v : NaN));
        case "log10":
          return values.map((v) => Math.log10(v > 0 ? v : NaN));
        case "sqrt":
          return values.map((v) => (v >= 0 ? Math.sqrt(v) : NaN));
        case "square":
          return values.map((v) => v * v);
        case "exp":
          return values.map((v) => Math.exp(v));
        case "zscore": {
          const arr = col.values as number[];
          const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
          const std = Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length);
          return values.map((v) => (v - mean) / (std || 1));
        }
        case "minmax": {
          const arr = col.values as number[];
          const min = Math.min(...arr);
          const max = Math.max(...arr);
          return values.map((v) => (v - min) / ((max - min) || 1));
        }
        default:
          return values;
      }
    };

    const newVals = applyTransform(col.values as number[]);
    const newColName = `${state.column}_${state.transform}`;
    const newDf = df.addColumn(newColName, newVals, { inplace: false });
    return newDf;
  },

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df: dfd.DataFrame | null = inputs[0]?.value ?? null;
    const columns = useMemo(() => (df ? df.columns : []), [df]);

    useEffect(() => {
      if (df) setState((prev) => ({ ...prev, data: df }));
    }, [df]);

    return (
      <div className="flex flex-col gap-3 pl-2">
        <Select
          value={state.column ?? ""}
          onValueChange={(value) => setState((s) => ({ ...s, column: value }))}
        >
          <SelectTrigger className="w-[260px] rounded bg-white !text-black">
            <SelectValue placeholder="Select column" />
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

        <Select
          value={state.transform}
          onValueChange={(value) =>
            setState((s) => ({ ...s, transform: value as typeof state.transform }))
          }
        >
          <SelectTrigger className="w-[260px] rounded bg-white !text-black">
            <SelectValue placeholder="Transformation" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Transform</SelectLabel>
              <SelectItem value="log">log(x)</SelectItem>
              <SelectItem value="log10">log₁₀(x)</SelectItem>
              <SelectItem value="sqrt">√x</SelectItem>
              <SelectItem value="square">x²</SelectItem>
              <SelectItem value="exp">exp(x)</SelectItem>
              <SelectItem value="zscore">Z-score</SelectItem>
              <SelectItem value="minmax">Min-Max</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {state.column && (
          <div className="text-xs text-gray-200 pl-1">
            Output column: <code>{`${state.column}_${state.transform}`}</code>
          </div>
        )}
      </div>
    );
  },

  hideOutputPort: false,
});

export default NodeTransformColumn;
