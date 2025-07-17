// NodeDisplayDataFrame.tsx

import React from "react";
import * as dfd from "danfojs";
import { createNodeComponent } from "../createNodeComponent";
import FastDataTable from "@/components/ui/fast-data-table";

const NodeDisplayDataFrame = createNodeComponent({
  label: "Display DataFrame",
  description: "Takes in a dataframe and displays it in a scrollable table.",
  width: 380,
  initialInputs: ["dataframe"],
  outputType: "",
  initialState: {},

  computeOutput: (inputs) => {
    const df = inputs[0]?.value;
    if (!df || typeof df.shape === "undefined") return null;
    return df;
  },

  renderInputControls: () => null,

  renderControls: ({ inputs }) => {
    const df = inputs[0]?.value;
    const hasData = df && df.shape && df.shape[0] > 0;

    return (
      <div className="flex flex-col items-center gap-0 overflow-y-scroll">
        <div className="flex-1 self-center overflow-y-scroll rounded-lg text-white text-sm max-h-[200px] w-full px-2 py-1">
          {hasData ? (
            <FastDataTable df={df} />
          ) : (
            <div className="text-gray-300 text-sm font-mono text-center py-4">
              Connect a DataFrame to preview
            </div>
          )}
        </div>
      </div>
    );
  },

  hideOutputPort: true, // this node doesn't output anything
});

export default NodeDisplayDataFrame;
