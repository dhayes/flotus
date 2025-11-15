// src/nodes/ML/NodeLogisticPredict.tsx
import React from "react";
import * as dfd from "danfojs";
import * as tf from "@tensorflow/tfjs";
import { Button } from "@/components/ui/button";
import { createNodeComponent } from "../createNodeComponent";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Convert selected columns to a pure numeric 2D array */
function toNumericMatrix(df: dfd.DataFrame, cols: string[]): number[][] {
  const data = df.loc({ columns: cols }).values as (string | number | boolean)[][];
  return data.map((row) =>
    row.map((v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    })
  );
}

/** Read expected input feature count from model graph (e.g. [null, 3]) */
function getExpectedFeatureCount(model: tf.LayersModel): number | null {
  const shape = model.inputs?.[0]?.shape;
  if (!shape || shape.length < 2) return null;
  const n = shape[1];
  return typeof n === "number" ? n : null;
}

const NodeLogisticPredict = createNodeComponent({
  label: "Predict (Logistic Regression)",
  description:
    "Outputs a copy of the input DataFrame with an added `score` column (predicted probability).",
  width: 360,
  initialInputs: ["model", "dataframe"],
  outputType: "dataframe",
  initialState: {
    outputDf: null as dfd.DataFrame | null,
    status: "Idle" as string,
    featureColsOverride: [] as string[], // optional manual override
  },

  computeOutput: (_inputs, state) => state.outputDf,

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const model = inputs[0]?.value as (tf.LayersModel & {
      _featureCols?: string[];
      _targetCol?: string;
    }) | null;
    const df = inputs[1]?.value as dfd.DataFrame | null;
    const columns = df?.columns || [];
    const expectedCount = model ? getExpectedFeatureCount(model) : null;

    // Decide which feature columns to use
    const chooseFeatureCols = (): { ok: boolean; reason?: string; cols: string[] } => {
      if (!model) return { ok: false, reason: "No model connected.", cols: [] };
      if (!df) return { ok: false, reason: "No DataFrame connected.", cols: [] };

      // 1) User override (must match expected size and exist in df)
      if (state.featureColsOverride.length > 0) {
        if (expectedCount !== null && state.featureColsOverride.length !== expectedCount) {
          return {
            ok: false,
            reason: `Override has ${state.featureColsOverride.length} columns but model expects ${expectedCount}.`,
            cols: [],
          };
        }
        const missing = state.featureColsOverride.filter((c) => !columns.includes(c));
        if (missing.length > 0) {
          return { ok: false, reason: `Missing in DataFrame: ${missing.join(", ")}`, cols: [] };
        }
        return { ok: true, cols: state.featureColsOverride };
      }

      // 2) Model metadata (_featureCols) from training node
      if ((model as any)._featureCols && Array.isArray((model as any)._featureCols)) {
        const metaCols = (model as any)._featureCols as string[];
        if (expectedCount !== null && metaCols.length !== expectedCount) {
          return {
            ok: false,
            reason: `Model metadata feature count (${metaCols.length}) differs from model input shape (${expectedCount}).`,
            cols: [],
          };
        }
        const missing = metaCols.filter((c) => !columns.includes(c));
        if (missing.length > 0) {
          return { ok: false, reason: `Missing in DataFrame: ${missing.join(", ")}`, cols: [] };
        }
        return { ok: true, cols: metaCols };
      }

      // 3) Fallback: first N columns if N is known
      if (expectedCount !== null) {
        if (columns.length < expectedCount) {
          return {
            ok: false,
            reason: `DataFrame has ${columns.length} columns but model expects ${expectedCount}.`,
            cols: [],
          };
        }
        return { ok: true, cols: columns.slice(0, expectedCount) };
      }

      return {
        ok: false,
        reason:
          "Could not determine feature columns. Set an override or retrain the model to store _featureCols metadata.",
        cols: [],
      };
    };

    const decision = chooseFeatureCols();

    const toggleFeature = (col: string) => {
      setState((s) => ({
        ...s,
        featureColsOverride: s.featureColsOverride.includes(col)
          ? s.featureColsOverride.filter((c) => c !== col)
          : [...s.featureColsOverride, col],
      }));
    };

    const handlePredict = async () => {
      if (!model || !df) {
        setState((s) => ({ ...s, status: "❌ Missing model or DataFrame." }));
        return;
      }
      if (!decision.ok) {
        setState((s) => ({ ...s, status: `❌ ${decision.reason}` }));
        return;
      }

      try {
        setState((s) => ({ ...s, status: "Predicting..." }));

        const featureCols = decision.cols;

        // Final sanity vs expectedCount
        if (expectedCount !== null && featureCols.length !== expectedCount) {
          setState((s) => ({
            ...s,
            status: `❌ Model expects ${expectedCount} features, selected ${featureCols.length}.`,
          }));
          return;
        }

        const X = toNumericMatrix(df, featureCols);
        const xs = tf.tensor2d(X);

        const preds = model.predict(xs) as tf.Tensor; // [n,1]
        const probs = (await preds.array()) as number[][];
        const scores = probs.map((p) => p[0]);

        // ✅ Explicit copy, then append 'score' column in place
        const result = df.copy();
        result.addColumn("score", scores, { inplace: true });

        setState((s) => ({ ...s, outputDf: result, status: "✅ Done" }));

        xs.dispose();
        preds.dispose();
      } catch (err) {
        console.error(err);
        setState((s) => ({ ...s, status: "❌ Prediction failed" }));
      }
    };

    return (
      <div className="flex flex-col gap-3 pl-2">
        {/* Optional override: pick exact model features */}
        <Select value="" onValueChange={toggleFeature}>
          <SelectTrigger className="w-[320px] rounded bg-white !text-black">
            <SelectValue
              placeholder={
                state.featureColsOverride.length > 0
                  ? `Override: ${state.featureColsOverride.join(", ")}`
                  : (model as any)?._featureCols
                  ? `Using model features: ${(model as any)._featureCols.join(", ")}`
                  : expectedCount !== null
                  ? `Select exactly ${expectedCount} features (optional override)`
                  : "Select override feature columns (optional)"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>
                {expectedCount !== null ? `Select ${expectedCount} features` : "Feature Columns"}
              </SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col} value={col}>
                  {state.featureColsOverride.includes(col) ? `✔ ${col}` : col}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button onClick={handlePredict} className="bg-green-600 hover:bg-green-700 text-white">
          Run Prediction
        </Button>

        <div className="text-sm text-white pl-1">
          {expectedCount !== null ? `Model expects ${expectedCount} features.` : "Model feature size unknown."}
        </div>
        <div className="text-sm text-white pl-1">{state.status}</div>
        {!decision.ok && <div className="text-xs text-red-300 pl-1">{decision.reason}</div>}
      </div>
    );
  },
});

export default NodeLogisticPredict;
