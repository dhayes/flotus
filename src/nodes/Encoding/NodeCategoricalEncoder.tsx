import React, { useMemo, useEffect } from "react";
import * as dfd from "danfojs";
import { createNodeComponent } from "../createNodeComponent";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";

// ---------- Helpers ----------
function mean(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function smoothMean(catMean: number, globalMean: number, n: number, m: number) {
  return (n * catMean + m * globalMean) / (n + m);
}

// ----------------------------------------------------------
// UNIVERSAL ENCODER NODE (Automatic, Safe Reactive Version)
// ----------------------------------------------------------
const NodeUniversalCategoricalEncoder = createNodeComponent({
  label: "Universal Categorical Encoder",
  description:
    "Automatically encodes categorical columns using various encoding strategies.",
  width: 420,
  initialInputs: ["dataframe"],
  outputType: "dataframe",

  initialState: {
    selectedCols: [] as string[],
    strategies: {} as Record<string, string>,
    ordinalOrders: {} as Record<string, string[]>,

    targetCol: null as string | null,
    smoothing: 5,
    noise: 0.01,

    outputDf: null as dfd.DataFrame | null,
    status: "Idle",
  },

  computeOutput: (_inputs, state) => state.outputDf,

  renderControls: ({ inputs, state, setState }) => {
    const inputDf = inputs[0]?.value as dfd.DataFrame | null;
    const df = inputDf ? new dfd.DataFrame(dfd.toJSON(inputDf)) : null;

    const columns = df?.columns || [];

    const catCols = useMemo(() => {
      if (!df) return [];
      return df.columns.filter((c) => {
        const v = df[c].values[0];
        return typeof v === "string" || typeof v === "boolean";
      });
    }, [df]);

    const toggleColumn = (col: string) => {
      setState((s) => ({
        ...s,
        selectedCols: s.selectedCols.includes(col)
          ? s.selectedCols.filter((x) => x !== col)
          : [...s.selectedCols, col],
      }));
    };

    const setStrategy = (col: string, strategy: string) => {
      setState((s) => ({
        ...s,
        strategies: { ...s.strategies, [col]: strategy },
      }));
    };

    const toggleOrdinalValue = (col: string, val: string) => {
      const current = state.ordinalOrders[col] || [];
      const updated = current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val];

      setState((s) => ({
        ...s,
        ordinalOrders: { ...s.ordinalOrders, [col]: updated },
      }));
    };

    // ------------------------------------------------------------------
    // AUTO-ENCODING (Safe Reactive Version)
    // ------------------------------------------------------------------
    useEffect(() => {
      if (!df) return;

      let out = df.copy();
      let changed = false;

      // Precompute target column if needed
      let target: number[] | null = null;
      let globalMean = 0;

      if (state.targetCol) {
        const raw = df[state.targetCol].values;
        target = raw.map((v: any) =>
          v === 1 || v === true || v === "1" ? 1 : 0
        );
        globalMean = mean(target);
      }

      for (const col of state.selectedCols) {
        const strategy = state.strategies[col] ?? "onehot";
        const values = out[col].values;

        const uniques: Array<string> = Array.from(new Set(values.map((v: any) => String(v))));

        //
        // ONE-HOT ENCODING
        //
        if (strategy === "onehot") {
          changed = true;
          for (const u of uniques) {
            out.addColumn(
              `${col}_${u}`,
              values.map((v: any) => (String(v) === u ? 1 : 0)),
              { inplace: true }
            );
          }
          out.drop({ columns: [col], inplace: true });
        }

        //
        // LABEL ENCODING
        //
        else if (strategy === "label") {
          changed = true;
          const map = new Map<string, number>();
          uniques.forEach((u, i) => map.set(u, i));

          out.addColumn(
            col,
            values.map((v: any) => map.get(String(v)) ?? 0),
            { inplace: true }
          );
        }

        //
        // ORDINAL ENCODING
        //
        else if (strategy === "ordinal") {
          const order = state.ordinalOrders[col] || [];

          // Only encode when user has selected *all* levels
          if (order.length !== uniques.length) {
            continue;
          }

          changed = true;
          const map = new Map<string, number>();
          order.forEach((item, i) => map.set(item, i));

          out.addColumn(
            col,
            values.map((v: any) => map.get(String(v)) ?? -1),
            { inplace: true }
          );
        }

        //
        // FREQUENCY ENCODING
        //
        else if (strategy === "frequency") {
          changed = true;

          const freq = new Map<string, number>();
          values.forEach((v: any) => {
            const key = String(v);
            freq.set(key, (freq.get(key) || 0) + 1);
          });

          const N = values.length;

          out.addColumn(
            col,
            values.map((v: any) => freq.get(String(v))! / N),
            { inplace: true }
          );
        }

        //
        // TARGET ENCODING (only valid when targetCol is set)
        //
        else if (strategy === "target") {
          if (!target || !state.targetCol) continue;

          changed = true;

          const sum = new Map<string, number>();
          const count = new Map<string, number>();

          values.forEach((v: any, i: number) => {
            const key = String(v);
            sum.set(key, (sum.get(key) || 0) + target![i]);
            count.set(key, (count.get(key) || 0) + 1);
          });

          const encMap = new Map<string, number>();
          for (const u of uniques) {
            const c = count.get(u)!;
            const m = sum.get(u)! / c;
            const sm = smoothMean(m, globalMean, c, state.smoothing);
            encMap.set(u, sm);
          }

          out.addColumn(
            col,
            values.map((v: any) => {
              const base = encMap.get(String(v))!;
              return base + (Math.random() - 0.5) * state.noise;
            }),
            { inplace: true }
          );
        }
      }

      if (changed) {
        setState((s) => ({
          ...s,
          outputDf: out,
          status: "Encoded",
        }));
      }
    }, [
      inputs,
      state.selectedCols,
      state.strategies,
      state.ordinalOrders,
      state.targetCol,
      state.smoothing,
      state.noise,
    ]);

    // ------------------------------------------------------------------
    // UI
    // ------------------------------------------------------------------
    return (
      <div className="flex flex-col gap-4 pl-2">
        {/* MULTI SELECT FOR COLUMNS */}
        <Select value="" onValueChange={toggleColumn}>
          <SelectTrigger className="w-[300px] bg-white text-black">
            <SelectValue
              placeholder={
                state.selectedCols.length
                  ? state.selectedCols.join(", ")
                  : "Select categorical columns"
              }
            />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categorical Columns</SelectLabel>
              {catCols.map((c) => (
                <SelectItem key={c} value={c}>
                  {state.selectedCols.includes(c) ? `✔ ${c}` : c}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* PER-COLUMN ENCODING CONFIG */}
        {state.selectedCols.map((col) => {
          const values = df?.[col]?.values ?? [];
          const uniques = Array.from(new Set(values.map((v: any) => String(v))));

          return (
            <div key={col} className="p-2 rounded bg-gray-100 text-black">
              <div className="font-semibold mb-1">{col}</div>

              {/* STRATEGY SELECT */}
              <Select
                value={state.strategies[col] ?? "onehot"}
                onValueChange={(v) => setStrategy(col, v)}
              >
                <SelectTrigger className="w-[280px] bg-white text-black">
                  <SelectValue placeholder="Encoding strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="onehot">One-Hot</SelectItem>
                    <SelectItem value="label">Label</SelectItem>
                    <SelectItem value="ordinal">Ordinal</SelectItem>
                    <SelectItem value="frequency">Frequency</SelectItem>
                    <SelectItem value="target">Target</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* ORDINAL ORDERING */}
              {state.strategies[col] === "ordinal" && (
                <div className="mt-2">
                  <Select value="" onValueChange={(v) => toggleOrdinalValue(col, v)}>
                    <SelectTrigger className="w-[280px] bg-white text-black">
                      <SelectValue
                        placeholder={
                          state.ordinalOrders[col]?.length
                            ? state.ordinalOrders[col].join(" → ")
                            : "Choose ordering"
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Order</SelectLabel>
                        {uniques.map((v) => {
                          const keyStr = String(v);
                          return (
                            <SelectItem key={keyStr} value={keyStr}>
                              {state.ordinalOrders[col]?.includes(keyStr)
                                ? `✔ ${keyStr}`
                                : keyStr}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {state.ordinalOrders[col]?.length !== uniques.length && (
                    <div className="text-xs text-red-700 mt-1">
                      Select all {uniques.length} categories to enable encoding.
                    </div>
                  )}
                </div>
              )}

              {/* TARGET ENCODING SETTINGS */}
              {state.strategies[col] === "target" && (
                <div className="mt-3 space-y-2">
                  {/* target column */}
                  <Select
                    value={state.targetCol ?? "__none__"}
                    onValueChange={(v) =>
                      setState((s) => ({
                        ...s,
                        targetCol: v === "__none__" ? null : v,
                      }))
                    }
                  >
                    <SelectTrigger className="w-[260px] bg-white text-black">
                      <SelectValue placeholder="Select target column" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {columns.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                        <SelectItem value="__none__">(None)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <label className="block text-sm">
                    Smoothing:
                    <input
                      type="number"
                      className="ml-2 w-20 bg-white text-black px-1"
                      value={state.smoothing}
                      onChange={(e) =>
                        setState((s) => ({
                          ...s,
                          smoothing: Number(e.target.value),
                        }))
                      }
                    />
                  </label>

                  <label className="block text-sm">
                    Noise:
                    <input
                      type="number"
                      step={0.001}
                      className="ml-2 w-20 bg-white text-black px-1"
                      value={state.noise}
                      onChange={(e) =>
                        setState((s) => ({
                          ...s,
                          noise: Number(e.target.value),
                        }))
                      }
                    />
                  </label>
                </div>
              )}
            </div>
          );
        })}

        <div className="text-white text-sm">{state.status}</div>
      </div>
    );
  },
});

export default NodeUniversalCategoricalEncoder;
