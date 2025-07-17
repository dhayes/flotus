// NodeGroupedDensity.tsx
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

type PlotType = "density" | "histogram" | "hist+density";

const NodeGroupedDensity = createNodeComponent({
  label: "Grouped Density",
  description: "A density plot visualizing the distribution of a numeric variable, separated by groups defined in a categorical column.",
  width: 300,
  initialInputs: ["dataframe"],
  outputType: "",
  initialState: {
    column: null as string | null,
    groupColumn: null as string | null,
    plotType: "density" as PlotType,
  },

  computeOutput: (inputs, _state) => {
    return inputs[0]?.value ?? null;
  },

  renderControls: ({ state, setState, inputs }) => {
    const df: dfd.DataFrame | null = inputs[0]?.value;
    const columns: string[] = df?.columns ?? [];

    const classifyColumn = (series: dfd.Series): "numeric" | "categorical" | "unknown" => {
      const valuesRaw = series.dropNa().values;
      const values = Array.isArray(valuesRaw[0]) ? (valuesRaw as any[]).flat() : valuesRaw;
      const flatValues: (string | number | boolean)[] = values as (string | number | boolean)[];
      const unique = new Set(flatValues);
      const isNumeric = (v: any) => !isNaN(parseFloat(v)) && isFinite(v);
      const allNumeric = values.every(isNumeric);
      if (allNumeric) return unique.size <= 5 ? "categorical" : unique.size > 10 ? "numeric" : "unknown";
      if (unique.size > 1 && unique.size < 5) return "categorical";
      return "unknown";
    };

    const numericColumns = columns.filter(
      (col) => classifyColumn(df.column(col)) === "numeric"
    );
    const categoricalColumns = columns.filter(
      (col) => classifyColumn(df.column(col)) === "categorical"
    );

    const data = df?.dropNa();
    const column = state.column;
    const groupColumn = state.groupColumn;
    const values =
      data && column
        ? (data.column(column)?.values as (string | number | boolean)[]).filter(
            (v): v is number => typeof v === "number" && !isNaN(v)
          )
        : [];

    const groupedData =
      data && groupColumn && column
        ? (() => {
            const xVals = data.column(column).values as number[];
            const gVals = data.column(groupColumn).values as string[];

            const groupedMap = new Map<string, number[]>();
            xVals.forEach((v, i) => {
              const group = String(gVals[i]);
              if (!groupedMap.has(group)) groupedMap.set(group, []);
              groupedMap.get(group)?.push(v);
            });

            return Array.from(groupedMap.entries()).map(([group, values]) => ({
              group,
              values,
            }));
          })()
        : [];

    return (
      <div className="flex flex-col gap-2">
        <Select value={column ?? ""} onValueChange={(v) => setState((s) => ({ ...s, column: v }))}>
          <SelectTrigger className="w-[260px] rounded bg-white text-black text-sm">
            <SelectValue placeholder="Select a column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Column</SelectLabel>
              {numericColumns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={groupColumn ?? ""}
          onValueChange={(v) =>
            setState((s) => ({ ...s, groupColumn: v === "" ? null : v }))
          }
        >
          <SelectTrigger className="w-[260px] rounded bg-white text-black text-sm">
            <SelectValue placeholder="Group by (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Group Column</SelectLabel>
              {categoricalColumns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="mt-2">
          {column && df?.shape[0] > 0 && (
            <div className="bg-white text-black rounded p-2 text-center">
              <BaseRPlot
                data={groupColumn ? groupedData : values}
                type={groupColumn ? "density-grouped" : state.plotType}
                width={280}
                height={280}
                xLabel={column}
                yLabel={groupColumn ? "Density" : undefined}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
  hideOutputPort: true,
});

export default React.memo(NodeGroupedDensity);
