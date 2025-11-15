import React from "react";
import * as dfd from "danfojs";
import * as tf from "@tensorflow/tfjs";
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
import { createNodeComponent } from "../createNodeComponent";

/** Local helper: convert selected columns to a pure numeric 2D array */
function toNumericMatrix(df: dfd.DataFrame, cols: string[]): number[][] {
  const data = df.loc({ columns: cols }).values as (string | number | boolean)[][];
  return data.map((row) =>
    row.map((v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    })
  );
}

const NodeLogisticTrain = createNodeComponent({
  label: "Train Logistic Regression",
  description:
    "Binary logistic regression trained on selected feature columns and a target column.",
  width: 340,
  initialInputs: ["dataframe"],
  outputType: "model",
  initialState: {
    featureCols: [] as string[],
    targetCol: null as string | null,
    model: null as tf.LayersModel | null,
    status: "Idle" as string,
    epochs: 30 as number,
    lr: 0.05 as number,
  },

  computeOutput: (_inputs, state) => state.model,

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df = inputs[0]?.value as dfd.DataFrame | null;
    const columns = df?.columns || [];

    const toggleFeature = (col: string) => {
      setState((s) => ({
        ...s,
        featureCols: s.featureCols.includes(col)
          ? s.featureCols.filter((c) => c !== col)
          : [...s.featureCols, col],
      }));
    };

    const handleTrain = async () => {
      if (!df || !state.targetCol || state.featureCols.length === 0) return;

      try {
        setState((s) => ({ ...s, status: "Training..." }));
        const X = toNumericMatrix(df, state.featureCols);

        // Ensure target is 0/1 (accepts booleans or strings like "1")
        const yRaw = df[state.targetCol].values;
        const y = yRaw.map((v: any) => (v === true || v === 1 || v === "1" ? 1 : 0));

        const xs = tf.tensor2d(X);
        const ys = tf.tensor2d(y, [y.length, 1]);

        const model = tf.sequential();
        model.add(
          tf.layers.dense({
            inputShape: [state.featureCols.length],
            units: 1,
            activation: "sigmoid",
            kernelInitializer: "glorotUniform",
          })
        );

        const optimizer = tf.train.adam(state.lr);
        model.compile({
          optimizer,
          loss: "binaryCrossentropy",
          metrics: ["accuracy"],
        });

        await model.fit(xs, ys, { epochs: state.epochs, verbose: 0 });

        // Persist metadata needed for prediction
        (model as any)._featureCols = [...state.featureCols];
        (model as any)._targetCol = state.targetCol;

        setState((s) => ({ ...s, model, status: "✅ Trained" }));
        xs.dispose();
        ys.dispose();
      } catch (err) {
        console.error(err);
        setState((s) => ({ ...s, status: "❌ Training failed" }));
      }
    };

    return (
      <div className="flex flex-col gap-3 pl-2">
        {/* Feature multi-select (toggle via single Select) */}
        <Select value="" onValueChange={toggleFeature}>
          <SelectTrigger className="w-[300px] rounded bg-white !text-black">
            <SelectValue
              placeholder={
                state.featureCols.length > 0
                  ? state.featureCols.join(", ")
                  : "Select feature columns"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Features</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col} value={col}>
                  {state.featureCols.includes(col) ? `✔ ${col}` : col}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Target column */}
        <Select
          value={state.targetCol ?? "__none__"}
          onValueChange={(v) =>
            setState((s) => ({ ...s, targetCol: v === "__none__" ? null : v }))
          }
        >
          <SelectTrigger className="w-[300px] rounded bg-white !text-black">
            <SelectValue placeholder="Select target column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Target</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
              <SelectItem value="__none__">(None)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Hyperparameters (simple inputs) */}
        <div className="flex items-center gap-3">
          <label className="text-white text-sm">
            Epochs
            <input
              type="number"
              min={1}
              className="ml-2 w-20 rounded bg-white text-black px-2 py-1"
              value={state.epochs}
              onChange={(e) =>
                setState((s) => ({ ...s, epochs: Math.max(1, Number(e.target.value) || 1) }))
              }
            />
          </label>
          <label className="text-white text-sm">
            LR
            <input
              type="number"
              step="0.005"
              min={0.0005}
              className="ml-2 w-24 rounded bg-white text-black px-2 py-1"
              value={state.lr}
              onChange={(e) =>
                setState((s) => ({ ...s, lr: Math.max(0.0005, Number(e.target.value) || 0.05) }))
              }
            />
          </label>
        </div>

        <Button onClick={handleTrain} className="bg-blue-600 hover:bg-blue-700 text-white">
          Train Model
        </Button>

        <div className="text-sm text-white pl-1">{state.status}</div>
      </div>
    );
  },
});

export default NodeLogisticTrain;
