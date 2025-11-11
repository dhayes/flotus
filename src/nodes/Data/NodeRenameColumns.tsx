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

interface RenameRule {
  oldName: string | null;
  newName: string;
}

interface State {
  rules: RenameRule[];
}

const NodeRenameColumns = createNodeComponent<State>({
  label: "Rename Columns",
  description:
    "Rename one or more columns in a DataFrame.",
  width: 340,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    rules: [{ oldName: null, newName: "" }],
  },

  computeOutput: (inputs, state) => {
    const df: dfd.DataFrame | null = inputs[0]?.value ?? null;
    if (!df) return null;

    const rules = state.rules.filter(r => r.oldName && r.newName);
    if (rules.length === 0) return df;

    // Create mapping object
    const renameMap: Record<string, string> = {};
    for (const { oldName, newName } of rules) {
      if (oldName && newName && df.columns.includes(oldName)) {
        renameMap[oldName] = newName;
      }
    }

    if (Object.keys(renameMap).length === 0) return df;

    // Clone dataframe to avoid mutating input
    const newDf = df.copy();
    newDf.rename(renameMap, { inplace: true });
    return newDf;
  },

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df: dfd.DataFrame | null = inputs[0]?.value?.copy() ?? null;
    const columns = useMemo(() => (df ? df.columns : []), [df]);

    useEffect(() => {
      if (df && state.rules.length === 1 && !state.rules[0].oldName && df.columns.length > 0) {
        setState(s => ({
          ...s,
          rules: [{ oldName: df.columns[0], newName: "" }],
        }));
      }
    }, [df]);

    const updateRule = (i: number, field: keyof RenameRule, value: string) =>
      setState(s => ({
        ...s,
        rules: s.rules.map((r, j) => (i === j ? { ...r, [field]: value } : r)),
      }));

    const addRule = () =>
      setState(s => ({
        ...s,
        rules: [...s.rules, { oldName: null, newName: "" }],
      }));

    const removeRule = (i: number) =>
      setState(s => ({
        ...s,
        rules: s.rules.filter((_, j) => j !== i),
      }));

    return (
      <div className="flex flex-col gap-3 p-2">
        <div className="flex flex-col gap-2">
          {state.rules.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              {/* Old name */}
              <Select
                value={r.oldName ?? ""}
                onValueChange={v => updateRule(i, "oldName", v)}
              >
                <SelectTrigger className="bg-white text-black text-xs w-[130px]">
                  <SelectValue placeholder="Old name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Current Columns</SelectLabel>
                    {columns.map((c: string) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <span className="text-gray-300 text-xs">→</span>

              {/* New name */}
              <Input
                className="w-[130px] h-7 bg-white text-black text-xs"
                placeholder="New name"
                value={r.newName}
                onChange={e => updateRule(i, "newName", e.target.value)}
              />

              {state.rules.length > 1 && (
                <button
                  onClick={() => removeRule(i)}
                  className="flex items-center justify-center w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white"
                  title="Remove rule"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          <Button
            variant="secondary"
            size="sm"
            onClick={addRule}
            className="text-xs w-fit"
          >
            + Add Rename Rule
          </Button>
        </div>
      </div>
    );
  },

  hideOutputPort: false,
});

export default NodeRenameColumns;
