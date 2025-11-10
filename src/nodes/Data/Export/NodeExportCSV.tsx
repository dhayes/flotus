// NodeExportCSV.tsx
import React, { useEffect, useState } from "react";
import * as dfd from "danfojs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNodeComponent } from "../../createNodeComponent";

type State = {
  filename: string;
  ready: boolean; // true when input connected & valid
};

const NodeExportCSV = createNodeComponent<State>({
  label: "Export to CSV",
  description: "Downloads the input DataFrame as a CSV file.",
  width: 240,
  initialInputs: ["dataframe"],
  outputType: "",
  initialState: {
    filename: "data_export.csv",
    ready: false,
  },

  // Must stay synchronous.
  computeOutput: (inputs, state) => {
    const df = inputs[0]?.value as dfd.DataFrame | null;
    return df && df.shape ? df : null;
  },

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df = inputs[0]?.value as dfd.DataFrame | null;

    // track readiness synchronously
    useEffect(() => {
      setState((s) => ({
        ...s,
        ready: !!(df && df.shape && df.shape[0] > 0),
      }));
    }, [df]);

    const handleDownload = () => {
      if (!state.ready || !df) return;

      try {
        // toCSVSync returns string immediately (no await)
        const csv = (df as any).toCSVSync
          ? (df as any).toCSVSync()
          : dfd.toCSV(df, { download: false });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = state.filename.trim() || "data_export.csv";
        link.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("CSV export failed:", err);
      }
    };

    return (
      <div className="flex flex-col gap-3 p-2">
        <Input
          type="text"
          value={state.filename}
          onChange={(e) =>
            setState((s) => ({ ...s, filename: e.target.value }))
          }
          placeholder="Filename.csv"
          className="bg-white text-black text-xs py-1 px-2 rounded"
        />

        <Button
          onClick={handleDownload}
          disabled={!state.ready}
          className={`text-sm text-black ${
            state.ready
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-500 cursor-not-allowed opacity-60"
          }`}
        >
          {state.ready ? "Download CSV" : "No Data Connected"}
        </Button>
      </div>
    );
  },

  hideOutputPort: true,
});

export default NodeExportCSV;
