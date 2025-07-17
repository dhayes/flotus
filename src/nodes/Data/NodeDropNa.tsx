// NodeDropNA.tsx
import React from "react";
import * as dfd from "danfojs";
import { createNodeComponent } from "../createNodeComponent";

const NodeDropNA = createNodeComponent({
  label: "Drop NA",
    description: "Takes in a dataframe and drops rows containing NA values",
  width: 260,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    naValues: "",
  },

  computeOutput: (inputs, state) => {
    const df = inputs[0]?.value;
    if (!df || typeof df !== "object" || typeof df.shape === "undefined") return null;

    const naValues = state.naValues
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const options: any = {};
    if (naValues.length > 0) options.na_values = naValues;

    try {
      return df.dropNa(options);
    } catch (err) {
      console.warn("Drop NA failed", err);
      return df;
    }
  },

  renderInputControls: () => null,

  renderControls: ({ state, setState }) => (
    <div>
      <label className="text-sm font-mono text-white">NA Values (comma-separated)</label>
      <input
        type="text"
        className="w-full px-2 py-1 rounded bg-white text-black mt-1"
        value={state.naValues}
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            naValues: e.target.value,
          }))
        }
      />
    </div>
  ),
});

export default NodeDropNA;

