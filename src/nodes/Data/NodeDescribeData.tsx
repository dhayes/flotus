// NodeDescribeData.tsx
import React, { useEffect, useMemo, useState } from "react";
import * as dfd from "danfojs";
import { createNodeComponent } from "../createNodeComponent";

/**
 * Node: Describe Data
 * Input: dataframe
 * Output: dataframe (summary)
 * Purpose: Computes descriptive statistics and inferred type for each column.
 */

interface SummaryRow {
  column: string;
  dtype: string;
  count: number;
  unique?: number;
  mean?: number;
  std?: number;
  min?: any;
  max?: any;
  sample?: any;
}

const NodeDescribeData = createNodeComponent({
  label: "Describe Data",
  description: "Computes descriptive statistics and data types for each column.",
  width: 420,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    summaryDf: null as dfd.DataFrame | null,
    summaryRows: [] as SummaryRow[],
  },

  computeOutput: (inputs, state) => {
    const df = inputs[0]?.value as dfd.DataFrame | null;
    if (!df) return null;
    return state.summaryDf;
  },

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df = inputs[0]?.value as dfd.DataFrame | null;

    useEffect(() => {
      if (!df || !df.columns) return;

      const rows: SummaryRow[] = df.columns.map((col: string) => {
        const series = df[col];
        const dtype = series?.dtype ?? typeof series?.values?.[0];

        // Basic type inference beyond dtype
        let inferredType = dtype;
        const firstVal = series?.values?.find((v: any) => v !== null && v !== undefined);
        if (typeof firstVal === "string") inferredType = "string";
        else if (typeof firstVal === "boolean") inferredType = "boolean";
        else if (typeof firstVal === "number") inferredType = "number";
        else if (firstVal instanceof Date) inferredType = "date";

        const vals = series?.values ?? [];
        const nonNull = vals.filter((v: any) => v !== null && v !== undefined && v !== "");

        let summary: SummaryRow = {
          column: col,
          dtype: inferredType,
          count: nonNull.length,
          sample: vals[0],
        };

        if (inferredType === "number") {
          const numericVals = nonNull.map(Number).filter((x) => !isNaN(x));
          if (numericVals.length > 0) {
            const mean = numericVals.reduce((acc, val) => acc + val, 0) / numericVals.length;
            // Manual standard deviation calculation
            const variance = numericVals.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numericVals.length;
            const std = Math.sqrt(variance);
            const min = Math.min(...numericVals);
            const max = Math.max(...numericVals);
            summary = { ...summary, mean, std, min, max };
          }
        } else if (inferredType === "string" || inferredType === "boolean") {
          const unique = new Set(nonNull).size;
          summary = { ...summary, unique };
        }

        return summary;
      });

      const summaryDf = new dfd.DataFrame(rows);
      setState({ summaryDf, summaryRows: rows });
    }, [df]);

    return (
      <div className="text-xs text-gray-200 bg-[#696f72] rounded p-2 overflow-auto max-h-[280px]">
        {!state.summaryRows.length ? (
          <div className="text-gray-300 italic text-center">No data loaded</div>
        ) : (
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-gray-500">
                <th className="px-1 py-1">Column</th>
                <th className="px-1 py-1">Type</th>
                <th className="px-1 py-1 text-right">Count</th>
                <th className="px-1 py-1 text-right">Unique</th>
                <th className="px-1 py-1 text-right">Mean</th>
                <th className="px-1 py-1 text-right">Std</th>
                <th className="px-1 py-1 text-right">Min</th>
                <th className="px-1 py-1 text-right">Max</th>
              </tr>
            </thead>
            <tbody>
              {state.summaryRows.map((r) => (
                <tr key={r.column} className="border-b border-gray-700 hover:bg-[#5a5f61]">
                  <td className="px-1 py-1">{r.column}</td>
                  <td className="px-1 py-1">{r.dtype}</td>
                  <td className="px-1 py-1 text-right">{r.count}</td>
                  <td className="px-1 py-1 text-right">{r.unique ?? "-"}</td>
                  <td className="px-1 py-1 text-right">
                    {r.mean !== undefined ? r.mean.toFixed(2) : "-"}
                  </td>
                  <td className="px-1 py-1 text-right">
                    {r.std !== undefined ? r.std.toFixed(2) : "-"}
                  </td>
                  <td className="px-1 py-1 text-right">{r.min ?? "-"}</td>
                  <td className="px-1 py-1 text-right">{r.max ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  },
});

export default NodeDescribeData;
