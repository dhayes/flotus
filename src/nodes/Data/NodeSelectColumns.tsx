// NodeSelectColumns.tsx
import React from "react";
import * as dfd from "danfojs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createNodeComponent } from "../createNodeComponent";

const NodeSelectColumns = createNodeComponent({
  label: "Select Columns",
  description: "Select columns to keep or omit from dataset",
  width: 260,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    selectedColumns: [] as string[],
  },

  computeOutput: (inputs, state) => {
    const df = inputs[0].value;
    if (!df || !df.shape || df.shape[0] === 0) return null;

    try {
      if (state.selectedColumns.length > 0) {
        return df.loc({ columns: state.selectedColumns });
      }
      return df;
    } catch (e) {
      console.warn("Invalid column selection", e);
      return df;
    }
  },

  renderControls: ({ state, setState, inputs }) => {
    const allColumns = inputs[0]?.value?.$columns ?? [];

    // Auto-select all columns initially
    if (allColumns.length > 0 && state.selectedColumns.length === 0) {
      setState((prev) => ({ ...prev, selectedColumns: allColumns }));
    }

    const toggleColumn = (col: string) => {
      setState((prev) => ({
        ...prev,
        selectedColumns: prev.selectedColumns.includes(col)
          ? prev.selectedColumns.filter((c) => c !== col)
          : [...prev.selectedColumns, col],
      }));
    };

    return (
      <div className="flex flex-col gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white text-black font-bold">
              Select Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 z-[10000]">
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allColumns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col}
                checked={state.selectedColumns.includes(col)}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={() => toggleColumn(col)}
              >
                {col}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {state.selectedColumns.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs text-white">
            {state.selectedColumns.map((col) => (
              <span key={col} className="bg-[#3b3f42] px-2 py-1 rounded font-mono">
                {col}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  },
});

export default NodeSelectColumns;
