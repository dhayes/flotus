// NodeBarChart.tsx

import React from "react";
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
import { BaseRPlot } from "./BaseRPlot";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const AGG_FUNCS = ["sum", "mean", "count", "min", "max"] as const;

const NodeBarChart = createNodeComponent({
  label: "Grouped Bar Chart",
  description: "Bar chart grouped by one or more categorical columns. Aggregates a numeric column by group.",
  width: 300,
  initialInputs: ["dataframe"],
  outputType: "",
  hideOutputPort: true,
  initialState: {
    groupByCols: [] as string[],
    valueCol: "" as string,
    aggFunc: "sum" as (typeof AGG_FUNCS)[number],
  },

  computeOutput: () => null,

  renderControls: ({ state, setState, inputs }) => {
    const df: dfd.DataFrame | null = inputs[0]?.value;
    const columns = df?.columns ?? [];

    const toggleGroupByCol = (col: string) => {
      setState((prev) => ({
        ...prev,
        groupByCols: prev.groupByCols.includes(col)
          ? prev.groupByCols.filter((c) => c !== col)
          : [...prev.groupByCols, col],
      }));
    };

    const groupedData =
      df && state.groupByCols.length && state.valueCol
        ? (() => {
          try {
            const keepCols = [...state.groupByCols, state.valueCol];
            const filtered = df.loc({ columns: keepCols }).resetIndex();
            const grouped = filtered.groupby(state.groupByCols)[state.aggFunc]();

            const dataDict = dfd.toJSON(grouped) as Record<string, any>[];
            const groupKey = state.groupByCols[0];
            const subKeys = state?.groupByCols?.slice(1);
            const seriesLabel = state.valueCol + '_' + state.aggFunc as string;

            if (subKeys && subKeys.length === 0) {
              // Single grouping
              return dataDict.map(row => ({
                group: row[groupKey],
                values: [{ x: row[groupKey], y: row[seriesLabel] }]
              }));
            } else {
              // Multi-level grouping
              const groupedMap = new Map<string, { x: string, y: number }[]>();
              for (const row of dataDict) {
                const outer = row[groupKey];
                const inner = subKeys.map(k => row[k]).join(" | ");
                const y = row[seriesLabel];
                if (!groupedMap.has(outer)) groupedMap.set(outer, []);
                groupedMap.get(outer)?.push({ x: inner, y });
              }
              return Array.from(groupedMap.entries()).map(([group, values]) => ({
                group,
                values,
              }));
            }
          } catch (e) {
            console.warn("Group bar chart aggregation error:", e);
            return [];
          }
        })()
        : [];
    console.log('gd', groupedData)

    return (
      <div className="flex flex-col gap-3 text-white">
        {/* Group-by column multiselect */}
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

        {/* Selected group-by badges */}
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

        {/* Aggregated value column */}
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

        {/* Aggregation function */}
        <Select value={state.aggFunc} onValueChange={(val) => setState((prev) => ({ ...prev, aggFunc: val as typeof AGG_FUNCS[number] }))}>
          <SelectTrigger className="bg-white text-black">
            <SelectValue placeholder="Aggregation" />
          </SelectTrigger>
          <SelectContent>
            {AGG_FUNCS.map((fn) => (
              <SelectItem key={fn} value={fn}>
                {fn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Final chart */}
        {groupedData?.length > 0 && (
          <div className="mt-2 bg-white text-black rounded px-0 text-center">
            <BaseRPlot
              data={groupedData}
              type="bar"
              width={280}
              height={280}
              xLabel={state.groupByCols.slice(1).join(" | ") || state.groupByCols[0]}
              yLabel={`${state.aggFunc} of ${state.valueCol}`}
            />
          </div>
        )}
      </div>
    );
  },
});

export default React.memo(NodeBarChart);
