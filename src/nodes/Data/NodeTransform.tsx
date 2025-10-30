import React, { useEffect, useMemo, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

const NodeTransformColumns = createNodeComponent({
  label: "Transform Columns",
  description:
    "Applies a mathematical transformation (log, sqrt, z-score, etc.) to one or more numeric columns.",
  width: 320,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    selectedCols: [] as string[],
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
    if (!df || state.selectedCols.length === 0) return df;

    let newDf = df.copy();

    const applyTransform = (values: number[], transform: string) => {
      switch (transform) {
        case "log":
          return values.map((v) => (v > 0 ? Math.log(v) : NaN));
        case "log10":
          return values.map((v) => (v > 0 ? Math.log10(v) : NaN));
        case "sqrt":
          return values.map((v) => (v >= 0 ? Math.sqrt(v) : NaN));
        case "square":
          return values.map((v) => v * v);
        case "exp":
          return values.map((v) => Math.exp(v));
        case "zscore": {
          const mean =
            values.reduce((acc, v) => acc + v, 0) / (values.length || 1);
          const std = Math.sqrt(
            values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) /
              (values.length || 1)
          );
          return values.map((v) => (v - mean) / (std || 1));
        }
        case "minmax": {
          const min = Math.min(...values);
          const max = Math.max(...values);
          return values.map((v) => (v - min) / (max - min || 1));
        }
        default:
          return values;
      }
    };

    state.selectedCols.forEach((col) => {
      const series = df[col];
      if (!series || typeof series.values[0] !== "number") return;

      const transformed = applyTransform(series.values as number[], state.transform);
      const newName = `${col}_${state.transform}`;
      newDf = newDf.addColumn(newName, transformed, { inplace: false });
    });

    return newDf;
  },

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df: dfd.DataFrame | null = inputs[0]?.value ?? null;
    const [expanded, setExpanded] = useState(false);

    const columns = useMemo(() => (df ? df.columns : []), [df]);

    useEffect(() => {
      if (df) setState((prev) => ({ ...prev, data: df }));
    }, [df]);

    const toggleColumn = (col: string) => {
      setState((s) => {
        const exists = s.selectedCols.includes(col);
        return {
          ...s,
          selectedCols: exists
            ? s.selectedCols.filter((c) => c !== col)
            : [...s.selectedCols, col],
        };
      });
    };

    return (
      <div className="flex flex-col gap-3 pl-2">
        {/* Transform selection */}
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

        {/* Multi-column checkbox list */}
        <div className="bg-[#696f72] rounded p-2">
          <div
            className="text-xs text-gray-100 font-mono cursor-pointer mb-1 select-none"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "▾" : "▸"} Select Columns
          </div>
          {expanded && (
            <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
              {columns.map((col) => (
                <label
                  key={col}
                  className="flex items-center gap-2 text-xs text-gray-200"
                >
                  <Checkbox
                    checked={state.selectedCols.includes(col)}
                    onCheckedChange={() => toggleColumn(col)}
                  />
                  {col}
                </label>
              ))}
            </div>
          )}
        </div>

        {state.selectedCols.length > 0 && (
          <div className="text-xs text-gray-200 pl-1">
            New columns:{" "}
            <code>
              {state.selectedCols
                .map((c) => `${c}_${state.transform}`)
                .join(", ")}
            </code>
          </div>
        )}
      </div>
    );
  },

  hideOutputPort: false,
});

export default NodeTransformColumns;
