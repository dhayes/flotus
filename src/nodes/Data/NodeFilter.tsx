// NodeFilter.tsx
import React from "react";
import * as dfd from "danfojs";
import { Input } from "@/components/ui/input";
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

const OPERATORS = ["==", "!=", "<", ">", "<=", ">="];

const NodeFilter = createNodeComponent({
  label: "Filter Rows",
  description: "Apply a confitional filter to a column",
  width: 260,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    selectedColumn: "",
    operator: "==",
    filterValue: "",
  },

  computeOutput: (inputs, state) => {
    const df = inputs[0].value;
    if (!df || !df.shape || df.shape[0] === 0) return df;

    const col = df?.column(state.selectedColumn);
    if (!col) return df;

    try {
      const dtype = col?.dtype;
      const typedVal =
        dtype === "int32" || dtype === "float32"
          ? parseFloat(state.filterValue)
          : state.filterValue;

      const boolMask = col.values.map((val: any) => {
        switch (state.operator) {
          case "==":
            return val == typedVal;
          case "!=":
            return val != typedVal;
          case "<":
            return val < typedVal;
          case ">":
            return val > typedVal;
          case "<=":
            return val <= typedVal;
          case ">=":
            return val >= typedVal;
          default:
            return true;
        }
      });

      return df.loc({ rows: boolMask });
    } catch (e) {
      console.warn("Filter failed:", e);
      return df;
    }
  },

  renderControls: ({ state, setState, inputs }) => {
    const columns = inputs[0]?.value?.$columns ?? [];

    // Auto-select the first column if none selected yet
    if (!state.selectedColumn && columns.length > 0) {
      setState((prev) => ({ ...prev, selectedColumn: columns[0] }));
    }

    return (
      <div className="flex flex-col gap-2">
        <Select
          value={state.selectedColumn}
          onValueChange={(v) => setState((prev) => ({ ...prev, selectedColumn: v }))}
        >
          <SelectTrigger className="bg-white text-black !h-8 !text-sm">
            <SelectValue placeholder="Column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Column</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={state.operator}
          onValueChange={(v) => setState((prev) => ({ ...prev, operator: v }))}
        >
          <SelectTrigger className="bg-white text-black !h-8 !text-sm">
            <SelectValue placeholder="Operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Operator</SelectLabel>
              {OPERATORS.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Input
          placeholder="Value"
          className="bg-white text-black !h-8 !text-sm"
          value={state.filterValue}
          onChange={(e) => setState((prev) => ({ ...prev, filterValue: e.target.value }))}
        />
      </div>
    );
  },
});

export default NodeFilter;
