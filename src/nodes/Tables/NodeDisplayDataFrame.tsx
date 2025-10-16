import React, { useRef, useEffect, useState } from "react";
import * as dfd from "danfojs";
import { createNodeComponent } from "../createNodeComponent";
import FastDataTable from "@/components/ui/fast-data-table";

const NodeDisplayDataFrame = createNodeComponent({
  label: "Display DataFrame",
  description: "Takes in a dataframe and displays it in a scrollable table.",
  width: 500,
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

    const containerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(240);

    // Observe parent height dynamically
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setHeight(entry.contentRect.height);
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    return (
      <div
        ref={containerRef}
        className="flex flex-col items-center justify-start w-full h-full"
        style={{ minHeight: 200 }}
      >
        <div className="flex-1 w-full text-black text-sm px-2 py-1 flex flex-col">
          {hasData ? (
            <div className="flex-1 min-h-[160px]">
              <FastDataTable df={df} dynamicHeight={height - 10} />
            </div>
          ) : (
            <div className="text-gray-300 text-sm font-mono text-center py-4">
              Connect a DataFrame to preview
            </div>
          )}
        </div>
      </div>
    );
  },

  hideOutputPort: true,
});

export default NodeDisplayDataFrame;
