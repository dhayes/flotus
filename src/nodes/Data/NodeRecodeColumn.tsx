import React, { useEffect, useMemo } from "react";
import * as dfd from "danfojs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { createNodeComponent } from "../createNodeComponent";

interface MappingRule {
  from: string;
  to: string;
}

interface State {
  column: string | null;
  mappings: MappingRule[];
}

const NodeRecodeColumn = createNodeComponent<State>({
  label: "Recode Column",
  description:
    "Recode categorical or text values in a column. Example: 'A' → 'Alpha'.",
  width: 340,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    column: null,
    mappings: [{ from: "", to: "" }],
  },

  computeOutput: (inputs, state) => {
    const df = inputs[0]?.value as dfd.DataFrame | null;
    if (!df || !state.column) return df;

    const newDf = new dfd.DataFrame(dfd.toJSON(df)); // deep copy

    if (!df || !state.column) return newDf;

    const colName = state.column;
    const mappings = state.mappings
      .filter(m => m.from !== "")
      .filter(m => m.to !== "");

    if (mappings.length === 0) return newDf;

    // Clone dataframe
    const colVals = newDf.column(colName).values;

    const recoded = colVals.map((val: any) => {
      const rule = mappings.find(m => String(val) === m.from);
      return rule ? rule.to : val;
    });

    newDf.addColumn(colName, recoded, {inplace: false});
    return newDf;
  },

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df: dfd.DataFrame | null = inputs[0]?.value ?? null;
    const columns = useMemo(() => (df ? df.columns : []), [df]);

    useEffect(() => {
      if (df && !state.column && df.columns.length > 0) {
        setState(s => ({ ...s, column: df.columns[0] }));
      }
    }, [df]);

    const updateMapping = (i: number, field: keyof MappingRule, value: string) =>
      setState(s => ({
        ...s,
        mappings: s.mappings.map((m, j) => (i === j ? { ...m, [field]: value } : m)),
      }));

    const addMapping = () =>
      setState(s => ({
        ...s,
        mappings: [...s.mappings, { from: "", to: "" }],
      }));

    const removeMapping = (i: number) =>
      setState(s => ({
        ...s,
        mappings: s.mappings.filter((_, j) => j !== i),
      }));

    return (
      <div className="flex flex-col gap-3 p-2">
        {/* Column selection */}
        <Select
          value={state.column ?? ""}
          onValueChange={v => setState(s => ({ ...s, column: v }))}
        >
          <SelectTrigger className="w-[250px] bg-white text-black text-sm">
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Columns</SelectLabel>
              {columns.map((col: string) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Mapping editor */}
        <div className="flex flex-col gap-2">
          {state.mappings.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                className="w-[110px] h-7 bg-white text-black text-xs"
                placeholder="From"
                value={m.from}
                onChange={e => updateMapping(i, "from", e.target.value)}
              />
              <span className="text-gray-300 text-xs">→</span>
              <Input
                className="w-[110px] h-7 bg-white text-black text-xs"
                placeholder="To"
                value={m.to}
                onChange={e => updateMapping(i, "to", e.target.value)}
              />
              {state.mappings.length > 1 && (
                <button
                  onClick={() => removeMapping(i)}
                  className="flex items-center justify-center w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white"
                  title="Remove rule"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={addMapping} className="text-xs w-fit">
            + Add Mapping
          </Button>
        </div>
      </div>
    );
  },

  hideOutputPort: false,
});

export default NodeRecodeColumn;
