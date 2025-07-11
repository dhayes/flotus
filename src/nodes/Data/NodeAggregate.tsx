// NodeGroupByAggregate.tsx
import React from "react";
import * as dfd from "danfojs";
import { createNodeComponent } from "../createNodeComponent";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const AGG_FUNCS = ["sum", "mean", "count", "min", "max"];

const NodeGroupByAggregate = createNodeComponent({
  label: "GroupBy Aggregate",
  width: 260,
  initialInputs: 1,
  initialState: {
    groupByCols: [] as string[],
    valueCol: "",
    aggFunc: "sum",
  },

  computeOutput: (inputs, state) => {
    const df = inputs[0]?.value;
    if (!df || typeof df !== "object" || typeof df.shape === "undefined") return null;

    try {
      const { groupByCols, valueCol, aggFunc } = state;
      if (!groupByCols.length || !valueCol || !aggFunc) return null;

      const keepCols = [...groupByCols, valueCol];
      const filtered = df.loc({ columns: keepCols });
      const grouped = filtered.groupby(groupByCols)[aggFunc]([valueCol]);

      return grouped;
    } catch (err) {
      console.warn("GroupBy aggregation error:", err);
      return null;
    }
  },

  renderControls: ({ state, setState, inputs }) => {
    const df = inputs[0]?.value;
    const columns: string[] = Array.isArray(df?.columns) ? df.columns : [];

    const toggleGroupByCol = (col: string) => {
      setState((prev) => ({
        ...prev,
        groupByCols: prev.groupByCols.includes(col)
          ? prev.groupByCols.filter((c) => c !== col)
          : [...prev.groupByCols, col],
      }));
    };

    return (
      <div className="flex flex-col gap-3 text-white">
        {/* Group-by multi-select */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white text-black">
              Group by Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 z-[10000]" onCloseAutoFocus={(e) => e.preventDefault()}>
            <DropdownMenuLabel>Select group-by columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col}
                checked={state.groupByCols.includes(col)}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={() => toggleGroupByCol(col)}
              >
                {col}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Selected tags */}
        {state.groupByCols.length > 0 && (
          <div className="flex flex-wrap gap-2 text-[10px] text-white">
            {state.groupByCols.map((col) => (
              <span
                key={col}
                className="bg-[#3b3f42] px-2 py-1 rounded text-xs font-mono"
              >
                {col}
              </span>
            ))}
          </div>
        )}

        {/* Value column select */}
        <Select value={state.valueCol} onValueChange={(val) => setState((prev) => ({ ...prev, valueCol: val }))}>
          <SelectTrigger className="bg-white text-black">
            <SelectValue placeholder="Aggregate column" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((col) => (
              <SelectItem key={col} value={col}>
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Aggregation function select */}
        <Select value={state.aggFunc} onValueChange={(val) => setState((prev) => ({ ...prev, aggFunc: val }))}>
          <SelectTrigger className="bg-white text-black">
            <SelectValue placeholder="Function" />
          </SelectTrigger>
          <SelectContent>
            {AGG_FUNCS.map((fn) => (
              <SelectItem key={fn} value={fn}>
                {fn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },

  renderInputControls: () => null,
});

export default NodeGroupByAggregate;
