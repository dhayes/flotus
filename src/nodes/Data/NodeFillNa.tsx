// NodeFillNA.tsx
import React from "react";
import * as dfd from "danfojs";
import { createNodeComponent } from "../createNodeComponent";

const NodeFillNA = createNodeComponent({
  label: "Fill NA",
  description: "fill NA values",
  width: 260,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    columns: [] as string[],
    method: "mean",
  },

  computeOutput: (inputs, state) => {
    const df = inputs[0]?.value;
    if (!df || typeof df !== "object" || typeof df.shape === "undefined") return null;

    try {
      const targetCols = state.columns.length > 0 ? state.columns : df.columns;
      const filled = df.copy();

      for (const col of targetCols) {
        if (!df.columns.includes(col)) continue;

        const series = df[col];
        let fillValue: any;

        if (state.method === "mean") {
          fillValue = series.mean();
        } else if (state.method === "median") {
          fillValue = series.median();
        } else if (state.method === "mode") {
          const modeArr = series.mode();
          fillValue = modeArr.values[0];
        } else if (state.method === "zero") {
          fillValue = 0;
        }

        filled[col] = series.fillNa(fillValue);
      }

      return filled;
    } catch (err) {
      console.warn("Fill NA failed:", err);
      return df;
    }
  },

  renderInputControls: ({ input, index, updateInput }) => null,

  renderControls: ({ state, setState, inputs }) => {
    const df = inputs[0]?.value;
    const colNames: string[] = Array.isArray(df?.columns) ? df.columns : [];

    const toggleColumn = (col: string) => {
      setState((prev) => ({
        ...prev,
        columns: prev.columns.includes(col)
          ? prev.columns.filter((c) => c !== col)
          : [...prev.columns, col],
      }));
    };

    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-mono text-white">Columns to Fill</label>
        <div className="grid grid-cols-2 gap-1">
          {colNames.map((col) => (
            <label key={col} className="text-white text-sm flex items-center gap-1">
              <input
                type="checkbox"
                checked={state.columns.includes(col)}
                onChange={() => toggleColumn(col)}
              />
              {col}
            </label>
          ))}
        </div>

        <label className="mt-2 text-sm font-mono text-white">Method</label>
        <select
          className="w-full px-2 py-1 rounded bg-white text-black"
          value={state.method}
          onChange={(e) =>
            setState((prev) => ({ ...prev, method: e.target.value }))
          }
        >
          <option value="mean">Mean</option>
          <option value="median">Median</option>
          <option value="mode">Mode</option>
          <option value="zero">Zero</option>
        </select>
      </div>
    );
  },
});

export default NodeFillNA;
