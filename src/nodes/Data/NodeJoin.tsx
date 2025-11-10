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
  operator: ConditionOp;
}

interface State {
  joinType: JoinType;
  joinPairs: JoinPair[];
  warning: string | null;
}

function inferType(series: any): string {
  if (!series?.values) return "unknown";
  const v = series.values.find((x: any) => x !== null && x !== undefined);
  if (v == null) return "unknown";
  if (typeof v === "number") return "number";
  if (typeof v === "string") return "string";
  if (typeof v === "boolean") return "boolean";
  if (v instanceof Date) return "date";
  return typeof v;
}

function compare(lhs: any, rhs: any, op: ConditionOp): boolean {
  switch (op) {
    case "==": return lhs == rhs;
    case "!=": return lhs != rhs;
    case "<":  return lhs < rhs;
    case ">":  return lhs > rhs;
    case "<=": return lhs <= rhs;
    case ">=": return lhs >= rhs;
  }
}

const MAX_CROSS_SIZE = 2e5; // protect from blowing up (200k row limit)

const NodeJoin = createNodeComponent<State>({
  label: "Join DataFrames",
  description:
    "Join two DataFrames (INNER/LEFT/RIGHT/OUTER). Supports equality and non-equality conditions. Falls back to cross-then-filter for true non-equi joins.",
  width: 480,
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

    const pairs = state.joinPairs.filter(p => p.leftCol && p.rightCol) as JoinPair[];
    if (pairs.length === 0) return null;

    const eqPairs = pairs.filter(p => p.operator === "==");
    const nonEqPairs = pairs.filter(p => p.operator !== "==");

    // Detect type mismatches
    for (const p of pairs) {
      try {
        const lt = inferType(left.column(p.leftCol));
        const rt = inferType(right.column(p.rightCol));
        if (lt !== "unknown" && rt !== "unknown" && lt !== rt) {
          console.warn(`Type mismatch: ${p.leftCol} (${lt}) vs ${p.rightCol} (${rt})`);
          return left;
        }
      } catch {}
    }

    /** -----------------------------------------------------------
     *  1. Regular equality join (with post filters for non-equal)
     * ----------------------------------------------------------- */
    if (eqPairs.length > 0) {
      const leftOn = eqPairs.map(p => p.leftCol!);
      const rightOn = eqPairs.map(p => p.rightCol!);

      let joined: dfd.DataFrame;
      try {
        joined = dfd.merge({
          left,
          right,
          on: leftOn,
          how: state.joinType,
        });
      } catch (err) {
        console.error("Join failed:", err);
        return null;
      }

      if (nonEqPairs.length === 0) return joined;

      // Apply non-equality filters post-join
      let jsonRows = joined.toJSON();
      if (!Array.isArray(jsonRows)) {
        jsonRows = Object.values(jsonRows);
      }
      const mask = (jsonRows as any[]).map((row: any) =>
        nonEqPairs.every(p => {
          const l = row[p.leftCol as string];
          const rName = Object.prototype.hasOwnProperty.call(row, `${p.rightCol}_r`) ? `${p.rightCol}_r` : p.rightCol!;
          return compare(l, row[rName], p.operator);
        })
      );
      return joined.loc({ rows: mask });
    }

    /** -----------------------------------------------------------
     *  2. Pure non-equality join  (Cross + Filter)
     * ----------------------------------------------------------- */
    const leftRows = left.shape[0];
    const rightRows = right.shape[0];
    const estSize = leftRows * rightRows;
    if (estSize > MAX_CROSS_SIZE) {
      console.warn(
        `⚠️ Non-equi join too large (${estSize.toLocaleString()} rows). Skipping.`
      );
      return null;
    }

    const chunkSize = Math.max(1, Math.floor(MAX_CROSS_SIZE / rightRows));
    const chunks: dfd.DataFrame[] = [];

    for (let start = 0; start < leftRows; start += chunkSize) {
      const end = Math.min(start + chunkSize, leftRows);
      const leftChunk = left.loc({ rows: Array.from({ length: end - start }, (_, i) => start + i) });
      // Manual cross join implementation
      const leftChunkRows = dfd.toJSON(leftChunk);
      const rightRowsData = dfd.toJSON(right);
      const crossRows: any[] = [];
      for (const lRow of leftChunkRows as any[]) {
        for (const rRow of rightRowsData as any[]) {
          crossRows.push({ ...lRow, ...Object.fromEntries(Object.entries(rRow).map(([k, v]) => [`${k}_r`, v])) });
        }
      }
      const mask = crossRows.map((row: any) =>
        nonEqPairs.every(p => {
          const l = row[p.leftCol as string];
          const rName = Object.prototype.hasOwnProperty.call(row, `${p.rightCol}_r`) ? `${p.rightCol}_r` : p.rightCol!;
          return compare(l, row[rName], p.operator);
        })
      );
      const filteredRows = crossRows.filter((_, idx) => mask[idx]);
      if (filteredRows.length > 0) {
        chunks.push(new dfd.DataFrame(filteredRows));
      }
    }

    return dfd.concat({ dfList: chunks, axis: 0 });
  },

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const left = inputs[0]?.value as dfd.DataFrame | null;
    const right = inputs[1]?.value as dfd.DataFrame | null;
    const leftCols = useMemo(() => (left ? left.columns : []), [left]);
    const rightCols = useMemo(() => (right ? right.columns : []), [right]);

    useEffect(() => {
      if (!left || !right) return;
      for (const p of state.joinPairs) {
        if (p.leftCol && p.rightCol) {
          const lt = inferType(left.column(p.leftCol));
          const rt = inferType(right.column(p.rightCol));
          if (lt !== "unknown" && rt !== "unknown" && lt !== rt) {
            setState(s => ({
              ...s,
              warning: `⚠️ Type mismatch: "${p.leftCol}" (${lt}) vs "${p.rightCol}" (${rt})`,
            }));
            return;
          }
        }
      }
      setState(s => ({ ...s, warning: null }));
    }, [left, right, state.joinPairs]);

    const updatePair = (i: number, field: keyof JoinPair, v: any) =>
      setState(s => ({
        ...s,
        joinPairs: s.joinPairs.map((p, j) => (i === j ? { ...p, [field]: v } : p)),
      }));

    const addPair = () =>
      setState(s => ({
        ...s,
        joinPairs: [...s.joinPairs, { leftCol: null, rightCol: null, operator: "==" }],
      }));

    const removePair = (i: number) =>
      setState(s => ({
        ...s,
        joinPairs: s.joinPairs.filter((_, j) => j !== i),
      }));

    return (
      <div className="flex flex-col gap-3 p-2">
        {/* Join Type */}
        <Select
          value={state.joinType}
          onValueChange={v => setState(s => ({ ...s, joinType: v as JoinType }))}
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
          {state.joinPairs.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              {/* Left column */}
              <Select
                value={p.leftCol ?? ""}
                onValueChange={v => updatePair(i, "leftCol", v)}
              >
                <SelectTrigger className="bg-white text-black text-xs w-[150px]">
                  <SelectValue placeholder="Left col" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
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
                value={p.operator}
                onValueChange={v => updatePair(i, "operator", v as ConditionOp)}
              >
                <SelectTrigger className="bg-white text-black text-xs w-[60px]">
                  <SelectValue placeholder="Op" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {["==", "!=", "<", ">", "<=", ">="].map(op => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Right column */}
              <Select
                value={p.rightCol ?? ""}
                onValueChange={v => updatePair(i, "rightCol", v)}
              >
                <SelectTrigger className="bg-white text-black text-xs w-[150px]">
                  <SelectValue placeholder="Right col" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {rightCols.map((c: string) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {state.joinPairs.length > 1 && (
                <button
                  onClick={() => removePair(i)}
                  className="flex items-center justify-center w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white"
                  title="Remove condition"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          <Button variant="secondary" size="sm" onClick={addPair} className="text-xs w-fit">
            + Add Condition
          </Button>
        </div>

        {state.warning && (
          <div className="text-yellow-400 text-xs mt-1">{state.warning}</div>
        )}
      </div>
    );
  },

  hideOutputPort: false,
});

export default NodeJoin;
