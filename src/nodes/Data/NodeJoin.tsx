// NodeJoin.tsx
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
import { X } from "lucide-react";
import { createNodeComponent } from "../createNodeComponent";

type JoinType = "inner" | "left" | "right" | "outer";
type ConditionOp = "==" | "!=" | "<" | ">" | "<=" | ">=";

interface JoinPair {
  leftCol: string | null;
  rightCol: string | null;
  operator: ConditionOp; // == used for key join; others applied post-merge as filters
}

interface State {
  joinType: JoinType;
  joinPairs: JoinPair[];
  warning: string | null;
}

/** Infer a primitive-ish type from a Danfo Series */
function inferSeriesType(series: any): "number" | "string" | "boolean" | "date" | "object" | "unknown" {
  if (!series || !series.values) return "unknown";
  const first = series.values.find((v: any) => v !== null && v !== undefined);
  if (first === undefined) return "unknown";
  if (typeof first === "number") return "number";
  if (typeof first === "string") return "string";
  if (typeof first === "boolean") return "boolean";
  if (first instanceof Date) return "date";
  if (typeof first === "object") return "object";
  return "unknown";
}

/** Evaluate binary comparison with JS semantics */
function compare(lhs: any, rhs: any, op: ConditionOp): boolean {
  switch (op) {
    case "==":  return lhs == rhs;  // equality joins handled earlier; here for completeness
    case "!=":  return lhs != rhs;
    case "<":   return lhs < rhs;
    case ">":   return lhs > rhs;
    case "<=":  return lhs <= rhs;
    case ">=":  return lhs >= rhs;
  }
}

const NodeJoin = createNodeComponent<State>({
  label: "Join DataFrames",
  description:
    "Join two DataFrames (INNER/LEFT/RIGHT/OUTER) on one or more column pairs. Non-equality conditions are applied after the join.",
  width: 460,
  initialInputs: ["dataframe", "dataframe"],
  outputType: "dataframe",
  initialState: {
    joinType: "inner",
    joinPairs: [{ leftCol: null, rightCol: null, operator: "==" }],
    warning: null,
  },

  computeOutput: (inputs, state) => {
    const left = inputs[0]?.value as dfd.DataFrame | null;
    const right = inputs[1]?.value as dfd.DataFrame | null;
    if (!left || !right) return null;

    // Separate equality keys and post-join filters
    const eqPairs = state.joinPairs.filter(
      (p) => p.leftCol && p.rightCol && p.operator === "=="
    ) as { leftCol: string; rightCol: string; operator: ConditionOp }[];

    const filterPairs = state.joinPairs.filter(
      (p) => p.leftCol && p.rightCol && p.operator !== "=="
    ) as { leftCol: string; rightCol: string; operator: ConditionOp }[];

    // Type check (based on first non-null value) for each configured pair
    for (const p of state.joinPairs) {
      if (p.leftCol && p.rightCol) {
        try {
          const lt = inferSeriesType(left.column(p.leftCol));
          const rt = inferSeriesType(right.column(p.rightCol));
          if (lt !== "unknown" && rt !== "unknown" && lt !== rt) {
            // Return left unchanged to avoid throwing; UI will show warning.
            return left;
          }
        } catch {
          // fall through; if column missing, let merge throw below
        }
      }
    }

    // Must have at least one equality key to perform the join.
    // (Non-equi joins would require CROSS + filter, which we avoid here.)
    if (eqPairs.length === 0) {
      return null;
    }

    // Danfo only supports joining on columns with the same name.
    // So we must ensure leftCol and rightCol are the same for each pair.
    // We'll warn and skip the join if not.
    const on = eqPairs
      .filter((p) => p.leftCol === p.rightCol)
      .map((p) => p.leftCol as string);

    if (on.length !== eqPairs.length) {
      // If any join pair has different column names, show warning and skip join.
      return left;
    }

    let joined: dfd.DataFrame;
    try {
      // Use explicit suffixes to keep right-side duplicates visible
      joined = dfd.merge({
        left,
        right,
        on,
        how: state.joinType,
      });
    } catch (err) {
      console.error("Join failed:", err);
      return null;
    }

    // Apply non-equality conditions as post-join filters
    if (filterPairs.length > 0) {
      try {
        const colIndex: Record<string, number> = {};
        joined.columns.forEach((col, idx) => {
          colIndex[col] = idx;
        });
        const mask = Array.from({ length: joined.shape[0] }, (_, i) => {
          const row = joined.row(i);
          return filterPairs.every((p) => {
            const leftName = p.leftCol!;
            const rightName =
              colIndex.hasOwnProperty(`${p.rightCol}_r`)
                ? `${p.rightCol}_r`
                : p.rightCol!;
            const lVal = row[colIndex[leftName]];
            const rVal = row[colIndex[rightName]];
            return compare(lVal, rVal, p.operator);
          });
        });
        joined = joined.loc({ rows: mask });
      } catch (err) {
        console.error("Post-join filter failed:", err);
        // keep the joined result without filters rather than failing
      }
    }

    return joined;
  },

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const left = inputs[0]?.value as dfd.DataFrame | null;
    const right = inputs[1]?.value as dfd.DataFrame | null;
    const leftCols = useMemo(() => (left ? left.columns : []), [left]);
    const rightCols = useMemo(() => (right ? right.columns : []), [right]);

    // Keep an up-to-date warning message in UI (type mismatch or non-equi without keys)
    useEffect(() => {
      if (!left || !right) {
        setState((s) => ({ ...s, warning: null }));
        return;
      }

      // Warn on type mismatch
      for (const p of state.joinPairs) {
        if (p.leftCol && p.rightCol) {
          try {
            const lt = inferSeriesType(left.column(p.leftCol));
            const rt = inferSeriesType(right.column(p.rightCol));
            if (lt !== "unknown" && rt !== "unknown" && lt !== rt) {
              setState((s) => ({
                ...s,
                warning: `Column type mismatch: "${p.leftCol}" (${lt}) vs "${p.rightCol}" (${rt})`,
              }));
              return;
            }
          } catch {
            // ignore here; compute will handle
          }
        }
      }

      // Warn if trying to use non-equality without any equality keys
      const hasEq = state.joinPairs.some(
        (p) => p.leftCol && p.rightCol && p.operator === "=="
      );
      const hasNonEq = state.joinPairs.some(
        (p) => p.leftCol && p.rightCol && p.operator !== "=="
      );
      if (hasNonEq && !hasEq) {
        setState((s) => ({
          ...s,
          warning:
            "Non-equality conditions require at least one equality key; add an '==' pair first.",
        }));
        return;
      }

      setState((s) => ({ ...s, warning: null }));
    }, [left, right, state.joinPairs, setState]);

    const updatePair = (
      index: number,
      field: keyof JoinPair,
      value: string | ConditionOp
    ) => {
      setState((s) => ({
        ...s,
        joinPairs: s.joinPairs.map((p, i) =>
          i === index ? { ...p, [field]: value } : p
        ),
      }));
    };

    const addPair = () =>
      setState((s) => ({
        ...s,
        joinPairs: [
          ...s.joinPairs,
          { leftCol: null, rightCol: null, operator: "==" },
        ],
      }));

    const removePair = (index: number) =>
      setState((s) => ({
        ...s,
        joinPairs: s.joinPairs.filter((_, i) => i !== index),
      }));

    return (
      <div className="flex flex-col gap-3 p-2">
        {/* Join Type */}
        <Select
          value={state.joinType}
          onValueChange={(value) =>
            setState((s) => ({ ...s, joinType: value as JoinType }))
          }
        >
          <SelectTrigger className="w-[200px] bg-white text-black text-sm">
            <SelectValue placeholder="Join Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Join Type</SelectLabel>
              <SelectItem value="inner">INNER JOIN</SelectItem>
              <SelectItem value="left">LEFT JOIN</SelectItem>
              <SelectItem value="right">RIGHT JOIN</SelectItem>
              <SelectItem value="outer">OUTER JOIN</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Join Conditions */}
        <div className="flex flex-col gap-2">
          {state.joinPairs.map((pair, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {/* Left column */}
              <Select
                value={pair.leftCol ?? ""}
                onValueChange={(v) => updatePair(idx, "leftCol", v)}
              >
                <SelectTrigger className="bg-white text-black text-xs w-[150px]">
                  <SelectValue placeholder="Left column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Left Columns</SelectLabel>
                    {leftCols.map((c: string) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Operator */}
              <Select
                value={pair.operator}
                onValueChange={(v) =>
                  updatePair(idx, "operator", v as ConditionOp)
                }
              >
                <SelectTrigger className="bg-white text-black text-xs w-[70px]">
                  <SelectValue placeholder="Op" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Operator</SelectLabel>
                    {["==", "!=", "<", ">", "<=", ">="].map((op) => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Right column */}
              <Select
                value={pair.rightCol ?? ""}
                onValueChange={(v) => updatePair(idx, "rightCol", v)}
              >
                <SelectTrigger className="bg-white text-black text-xs w=[150px] w-[150px]">
                  <SelectValue placeholder="Right column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Right Columns</SelectLabel>
                    {rightCols.map((c: string) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Remove condition (icon button) */}
              {state.joinPairs.length > 1 && (
                <button
                  onClick={() => removePair(idx)}
                  className="flex items-center justify-center w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                  title="Remove condition"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          <Button
            variant="secondary"
            size="sm"
            onClick={addPair}
            className="text-xs w-fit"
          >
            + Add Condition
          </Button>
        </div>

        {/* Warnings */}
        {state.warning && (
          <div className="text-yellow-400 text-xs mt-1">{state.warning}</div>
        )}
      </div>
    );
  },

  hideOutputPort: false,
});

export default NodeJoin;
