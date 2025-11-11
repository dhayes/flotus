import React, { useEffect, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createNodeComponent } from "../createNodeComponent";
import MultiSelect from "@/components/ui/multiselect"; // assumes same as used in SelectColumns node

interface State {
  selectedCols: string[];
  targetType: "string" | "float32" | "int32" | "boolean";
  outputDf: dfd.DataFrame | null;
}

const NodeRetypeColumns = createNodeComponent<State>({
  label: "Retype Columns",
  description: "Change the data type of one or more columns (e.g., string → float).",
  width: 320,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    selectedCols: [],
    targetType: "string",
    outputDf: null,
  },

  computeOutput: (inputs, state) => state.outputDf ?? inputs[0]?.value ?? null,

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df = inputs[0]?.value as dfd.DataFrame | null;
    const columns = useMemo(() => (df ? df.columns : []), [df]);
    const disabled = !df || columns.length === 0;

    // Core retype logic
    const retype = () => {
      if (!df || state.selectedCols.length === 0) return;

      try {
        let newDf = new dfd.DataFrame(dfd.toJSON(df)); // deep copy
        for (const col of state.selectedCols) {
          newDf.asType(col, state.targetType); // ensure column exists
          // const series = newDf.column(col);
          // const converted = convertSeries(series, state.targetType);
          // newDf.addColumn(col, converted, { inplace: false });
        }
        setState((s) => ({ ...s, outputDf: newDf }));
      } catch (err) {
        console.error("Retype failed:", err);
        setState((s) => ({ ...s, outputDf: df }));
      }
    };

    // Auto-run when dataframe or settings change
    useEffect(() => {
      if (df) retype();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [df, state.selectedCols, state.targetType]);

    return (
      <div className="flex flex-col gap-3 p-2">
        {/* Column Selector */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-gray-200">Select columns:</Label>
          <MultiSelect
            disabled={disabled}
            values={state.selectedCols}
            options={columns.map((c) => ({ label: c, value: c }))}
            onChange={(vals) => setState((s) => ({ ...s, selectedCols: vals }))}
          />
        </div>

        {/* Target Type */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-gray-200">Convert to type:</Label>
          <Select
            value={state.targetType}
            onValueChange={(v) => setState((s) => ({ ...s, targetType: v as State["targetType"] }))}
          >
            <SelectTrigger className="bg-white text-black text-xs w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Target Type</SelectLabel>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="float32">Numeric</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="datetime">DateTime</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Manual retype button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={retype}
          disabled={disabled || state.selectedCols.length === 0}
          className="text-xs w-fit"
        >
          Apply Retype
        </Button>

        {state.selectedCols.length > 0 && (
          <div className="text-[11px] text-gray-300 pl-1">
            Converting {state.selectedCols.join(", ")} → {state.targetType}
          </div>
        )}
      </div>
    );
  },

  hideOutputPort: false,
});

/** Conversion helper */
function convertSeries(series: dfd.Series, targetType: string): dfd.Series {
  const vals = series.values.map((v: any) => {
    if (v === null || v === undefined || v === "NaN" || v === "") return NaN;
    switch (targetType) {
      case "string":
        return String(v);
      case "int": {
        const n = parseInt(v);
        return Number.isNaN(n) ? NaN : n;
      }
      case "float": {
        const f = parseFloat(v);
        return Number.isNaN(f) ? NaN : f;
      }
      case "boolean": {
        if (typeof v === "boolean") return v;
        const s = String(v).toLowerCase();
        if (["true", "1", "yes", "y"].includes(s)) return true;
        if (["false", "0", "no", "n"].includes(s)) return false;
        return NaN;
      }
      case "date":
        try {
          const d = new Date(v);
          return isNaN(d.getTime()) ? NaN : d;
        } catch {
          return NaN;
        }
      default:
        return v;
    }
  });
  return new dfd.Series(vals);
}

export default NodeRetypeColumns;
