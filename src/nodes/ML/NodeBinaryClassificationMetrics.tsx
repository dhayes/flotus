// src/nodes/ML/NodeBinaryClassificationMetrics.tsx
import React, { useMemo } from "react";
import * as dfd from "danfojs";
import { createNodeComponent } from "../createNodeComponent";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { BaseRPlot } from "../Plots/BaseRPlot";
import { Button } from "@/components/ui/button";

/** Safe division */
function div(a: number, b: number): number {
  return b === 0 ? 0 : a / b;
}

/** Compute ROC curve and AUC (trapezoidal) */
function computeRocAuc(yTrue: number[], scores: number[]) {
  const idx = scores.map((_, i) => i).sort((i, j) => scores[j] - scores[i]);
  const y = idx.map((i) => yTrue[i]);
  const s = idx.map((i) => scores[i]);

  const P = y.reduce((acc, v) => acc + (v === 1 ? 1 : 0), 0);
  const N = y.length - P;

  let tp = 0;
  let fp = 0;
  const pts: { x: number; y: number }[] = [];
  let prevScore = Infinity;

  for (let i = 0; i < y.length; i++) {
    if (s[i] !== prevScore) {
      pts.push({ x: div(fp, N), y: div(tp, P) });
      prevScore = s[i];
    }
    if (y[i] === 1) tp++;
    else fp++;
  }
  pts.push({ x: div(fp, N), y: div(tp, P) });
  pts.unshift({ x: 0, y: 0 });
  pts.push({ x: 1, y: 1 });

  let auc = 0;
  for (let i = 1; i < pts.length; i++) {
    const x0 = pts[i - 1].x, x1 = pts[i].x;
    const y0 = pts[i - 1].y, y1 = pts[i].y;
    auc += ((y0 + y1) / 2) * (x1 - x0);
  }
  const uniq = pts.filter((p, i, arr) => i === 0 || !(p.x === arr[i - 1].x && p.y === arr[i - 1].y));
  return { auc: Math.max(0, Math.min(1, auc)), curve: uniq };
}

/** Convert truth-like values to 0/1 */
function toBinary(v: any): number {
  return v === 1 || v === "1" || v === true ? 1 : 0;
}

const NodeBinaryClassificationMetrics = createNodeComponent({
  label: "Binary Classification Metrics",
  description:
    "Computes confusion matrix, accuracy, precision, recall, F1, specificity, and ROC AUC from a label column and a score column.",
  width: 420,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    targetCol: null as string | null,
    scoreCol: null as string | null,
    threshold: 0.5 as number,
    metricsDf: null as dfd.DataFrame | null,
    lastComputed: null as {
      tp: number; fp: number; tn: number; fn: number;
      accuracy: number; precision: number; recall: number; f1: number; specificity: number; auc: number;
    } | null,
    rocCurve: [] as { x: number; y: number }[],
  },

  computeOutput: (_inputs, state) => state.metricsDf,

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df = inputs[0]?.value as dfd.DataFrame | null;
    const columns = df?.columns || [];

    const canCompute = useMemo(
      () => !!df && !!state.targetCol && !!state.scoreCol && df.shape?.[0] > 0,
      [df, state.targetCol, state.scoreCol]
    );

    const computeMetrics = () => {
      if (!df || !state.targetCol || !state.scoreCol) return;

      const yTrueRaw = df[state.targetCol].values;
      const scoresRaw = df[state.scoreCol].values;
      const n = Math.min(yTrueRaw.length, scoresRaw.length);

      const yTrue: number[] = new Array(n);
      const scores: number[] = new Array(n);

      for (let i = 0; i < n; i++) {
        yTrue[i] = toBinary(yTrueRaw[i]);
        const s = Number(scoresRaw[i]);
        scores[i] = Number.isFinite(s) ? s : 0;
      }

      const yPred = scores.map((p) => (p >= state.threshold ? 1 : 0));

      let tp = 0, tn = 0, fp = 0, fn = 0;
      for (let i = 0; i < n; i++) {
        if (yTrue[i] === 1 && yPred[i] === 1) tp++;
        else if (yTrue[i] === 0 && yPred[i] === 0) tn++;
        else if (yTrue[i] === 0 && yPred[i] === 1) fp++;
        else if (yTrue[i] === 1 && yPred[i] === 0) fn++;
      }

      const accuracy = div(tp + tn, n);
      const precision = div(tp, tp + fp);
      const recall = div(tp, tp + fn);
      const specificity = div(tn, tn + fp);
      const f1 = div(2 * precision * recall, precision + recall);

      const { auc, curve } = computeRocAuc(yTrue, scores);

      const metrics = new dfd.DataFrame({
        metric: [
          "n","tp","tn","fp","fn",
          "accuracy","precision","recall","specificity","f1","auc",
          "threshold","target_col","score_col",
        ],
        value: [
          n,tp,tn,fp,fn,
          accuracy,precision,recall,specificity,f1,auc,
          state.threshold,state.targetCol,state.scoreCol,
        ],
      });

      setState((s) => ({
        ...s,
        metricsDf: metrics,
        lastComputed: { tp, fp, tn, fn, accuracy, precision, recall, f1, specificity, auc },
        rocCurve: curve,
      }));
    };

    // Helper to render the metrics table without toJSON()
    const renderMetricsTable = () => {
      if (!state.metricsDf) return null;
      const cols = state.metricsDf.columns; // ["metric","value"]
      const values = state.metricsDf.values as any[][];
      const metricIdx = cols.indexOf("metric");
      const valueIdx = cols.indexOf("value");
      return (
        <div className="bg-white text-black rounded p-2">
          <div className="font-semibold mb-2">Metrics</div>
          <div className="text-xs">
            {values.map((row, i) => {
              const m = row[metricIdx];
              const v = row[valueIdx];
              const out =
                typeof v === "number" ? v.toFixed(4) : String(v ?? "");
              return (
                <div key={`${m}-${i}`} className="flex justify-between gap-6">
                  <span>{String(m)}</span>
                  <span>{out}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div className="flex flex-col gap-3 pl-2">
        {/* Target (ground truth) column */}
        <Select
          value={state.targetCol ?? "__none__"}
          onValueChange={(v) =>
            setState((s) => ({ ...s, targetCol: v === "__none__" ? null : v }))
          }
        >
          <SelectTrigger className="w-[360px] rounded bg-white !text-black">
            <SelectValue placeholder="Select target (ground truth) column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Target Column</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
              <SelectItem value="__none__">(None)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Score (probability) column */}
        <Select
          value={state.scoreCol ?? "__none__"}
          onValueChange={(v) =>
            setState((s) => ({ ...s, scoreCol: v === "__none__" ? null : v }))
          }
        >
          <SelectTrigger className="w-[360px] rounded bg-white !text-black">
            <SelectValue placeholder="Select score (probability) column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Score Column</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
              <SelectItem value="__none__">(None)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Threshold */}
        <label className="text-white text-sm">
          Threshold
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            className="ml-2 w-24 rounded bg-white text-black px-2 py-1"
            value={state.threshold}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                threshold: Math.min(1, Math.max(0, Number(e.target.value) || 0.5)),
              }))
            }
          />
        </label>

        <Button
          onClick={computeMetrics}
          className="bg-blue-600 hover:bg-blue-700 text-white w-fit"
          disabled={!canCompute}
        >
          Compute Metrics
        </Button>

        {/* Confusion Matrix quick view */}
        {state.lastComputed && (
          <div className="grid grid-cols-2 gap-2 bg-white text-black rounded p-2 w-fit">
            <div className="font-semibold col-span-2 text-center">Confusion Matrix</div>
            <div className="text-xs text-center">Pred 0</div>
            <div className="text-xs text-center">Pred 1</div>
            <div className="text-xs text-center">TN: {state.lastComputed.tn}</div>
            <div className="text-xs text-center">FP: {state.lastComputed.fp}</div>
            <div className="text-xs text-center">FN: {state.lastComputed.fn}</div>
            <div className="text-xs text-center">TP: {state.lastComputed.tp}</div>
          </div>
        )}

        {/* Metrics table without deprecated toJSON */}
        {renderMetricsTable()}

        {/* ROC Curve */}
        {state.rocCurve.length > 0 && (
          <div className="bg-white text-black rounded p-2">
            <div className="font-semibold mb-2">ROC Curve</div>
            <BaseRPlot
              type="line"
              data={state.rocCurve}
              width={320}
              height={220}
              xLabel="FPR"
              yLabel="TPR"
            />
          </div>
        )}
      </div>
    );
  },
});

export default NodeBinaryClassificationMetrics;
