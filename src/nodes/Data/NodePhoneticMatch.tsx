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
import { Input } from "@/components/ui/input";
import { createNodeComponent } from "../createNodeComponent";
import PhoneticWorker from "./phoneticWorker?worker"; // Vite

const MAX_WORKERS = Math.min(4, navigator.hardwareConcurrency || 4);

type State = {
  column: string | null;
  targetName: string;
  data: dfd.DataFrame | null;      // optional preview, not required for output
  processing: boolean;
  progress: number;
  cachedScores: number[] | null;   // <-- computed result lives here
  cacheMeta?: {
    column: string;
    targetName: string;
    rowCount: number;
  };
};

const NodePhoneticMatch = createNodeComponent<State>({
  label: "Phonetic Match (BMPM, Parallel Pool + Progress)",
  description:
    "Appends a column with BMPM similarity to a provided full name. Uses a worker pool for responsiveness.",
  width: 380,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    column: null,
    targetName: "",
    data: null,
    processing: false,
    progress: 0,
    cachedScores: null,
    cacheMeta: undefined,
  },

  // IMPORTANT: computeOutput must be synchronous and return the final DF.
  computeOutput: (inputs, state) => {
    const df: dfd.DataFrame | null = inputs[0]?.value ?? null;
    if (!df || !state.column || !state.targetName) return df;

    // If we have cached scores matching the current params, append them.
    const scores = state.cachedScores;
    const meta = state.cacheMeta;
    if (
      scores &&
      meta &&
      meta.column === state.column &&
      meta.targetName === state.targetName &&
      meta.rowCount === df.shape[0]
    ) {
      return df.addColumn(`${state.column}_bmpm_score`, scores, { inplace: false });
    }

    // No computed scores yet → pass through the original df for now.
    return df;
  },

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df: dfd.DataFrame | null = inputs[0]?.value ?? null;
    const columns = useMemo(() => (df ? df.columns : []), [df]);

    useEffect(() => {
      if (df) setState((prev) => ({ ...prev, data: df }));
    }, [df]);

    // Kick off (or re-run) worker pool whenever df/column/targetName changes.
    useEffect(() => {
      if (!df || !state.column || !state.targetName) {
        // reset progress/UI if inputs become incomplete
        setState((s) => ({
          ...s,
          processing: false,
          progress: 0,
          cachedScores: null,
          cacheMeta: undefined,
        }));
        return;
      }

      const columnValues = df.column(state.column).values as string[];
      const totalRows = columnValues.length;
      if (totalRows === 0) {
        setState((s) => ({
          ...s,
          processing: false,
          progress: 100,
          cachedScores: [],
          cacheMeta: { column: state.column!, targetName: state.targetName, rowCount: 0 },
        }));
        return;
      }

      const chunkSize = Math.ceil(totalRows / MAX_WORKERS);
      const chunks: string[][] = [];
      for (let i = 0; i < totalRows; i += chunkSize) {
        chunks.push(columnValues.slice(i, i + chunkSize));
      }

      const workers = chunks.map(() => new PhoneticWorker());
      const results: number[][] = Array(chunks.length);
      let completed = 0;

      // Starting a new run invalidates old cachedScores.
      setState((s) => ({
        ...s,
        processing: true,
        progress: 0,
        cachedScores: null,
        cacheMeta: undefined,
      }));

      const handleProgress = () => {
        const percent = Math.round((completed / workers.length) * 100);
        setState((s) => ({ ...s, progress: percent }));
      };

      const finish = () => {
        const merged = results.flat();
        // Store scores + meta in state. This will trigger computeOutput() again,
        // which will now append the new column synchronously.
        setState((s) => ({
          ...s,
          processing: false,
          progress: 100,
          cachedScores: merged,
          cacheMeta: {
            column: state.column!,
            targetName: state.targetName,
            rowCount: df.shape[0],
          },
        }));
        workers.forEach((w) => w.terminate());
      };

      workers.forEach((worker, idx) => {
        worker.onmessage = (e: MessageEvent<number[]>) => {
          results[idx] = e.data;
          completed += 1;
          handleProgress();
          if (completed === workers.length) finish();
        };
        worker.postMessage({
          columnValues: chunks[idx],
          targetName: state.targetName,
        });
      });

      return () => workers.forEach((w) => w.terminate());
    }, [df, state.column, state.targetName, setState]);

    return (
      <div className="flex flex-col gap-3 pl-2">
        <Select
          value={state.column ?? ""}
          onValueChange={(value) => setState((s) => ({ ...s, column: value }))}
        >
          <SelectTrigger className="w-[280px] rounded bg-white !text-black">
            <SelectValue placeholder="Select name column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Column</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="Enter full name to compare"
          value={state.targetName}
          onChange={(e) =>
            setState((s) => ({ ...s, targetName: e.target.value }))
          }
          className="w-[280px] rounded bg-white text-black placeholder-gray-400"
        />

        {state.processing && (
          <div className="flex flex-col gap-1 w-[280px] mt-1">
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div
                className="h-2 bg-blue-500 transition-all duration-200"
                style={{ width: `${state.progress}%` }}
              />
            </div>
            <div className="text-xs text-yellow-400 pl-1">
              {`Processing: ${state.progress}% (${MAX_WORKERS} workers)`}
            </div>
          </div>
        )}

        {state.column && state.targetName && !state.processing && state.cachedScores && (
          <div className="text-xs text-gray-200 pl-1">
            Output column: <code>{`${state.column}_bmpm_score`}</code>
          </div>
        )}
      </div>
    );
  },

  hideOutputPort: false,
});

export default NodePhoneticMatch;
