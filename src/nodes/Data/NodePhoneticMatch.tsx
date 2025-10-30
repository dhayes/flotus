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
import {
  bmpmSimilarity,
  ExtendedBMPMConfig as cfg,
} from "bmpm-phonetics";

function fullNameSimilarity(a: string, b: string): number {
  const normalize = (s: string) =>
    s
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^\p{L}\s'-]/gu, "") // keep letters, spaces, hyphens, apostrophes
      .toLowerCase();

  const partsA = normalize(a).split(/\s+/).filter(Boolean);
  const partsB = normalize(b).split(/\s+/).filter(Boolean);

  if (partsA.length === 0 || partsB.length === 0) return 0;

  const len = Math.max(partsA.length, partsB.length);
  const scores: number[] = [];

  for (const partA of partsA) {
    let best = 0;
    for (const partB of partsB) {
      const sim = bmpmSimilarity(partA, partB, cfg);
      if (sim > best) best = sim;
    }
    scores.push(best);
  }

  return scores.reduce((a, b) => a + b, 0) / len;
}

const NodePhoneticMatch = createNodeComponent({
  label: "Phonetic Match (BMPM)",
  description:
    "Computes the Beider–Morse Phonetic Match similarity between each row’s name and a given name (supports multi-part names).",
  width: 340,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    column: null as string | null,
    targetName: "" as string,
    data: null as dfd.DataFrame | null,
  },

  computeOutput: (inputs, state) => {
    const df: dfd.DataFrame | null = inputs[0]?.value ?? null;
    if (!df || !state.column || !state.targetName) return df;

    try {
      const col = df.column(state.column);
      const scores = col.values.map((v: any) => {
        if (typeof v !== "string") return NaN;
        return fullNameSimilarity(v, state.targetName);
      });

      const newColName = `${state.column}_bmpm_score`;
      return df.addColumn(newColName, scores, { inplace: false });
    } catch (err) {
      console.error("BMPM computation failed:", err);
      return df;
    }
  },

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df: dfd.DataFrame | null = inputs[0]?.value ?? null;
    const columns = useMemo(() => (df ? df.columns : []), [df]);

    useEffect(() => {
      if (df) setState((prev) => ({ ...prev, data: df }));
    }, [df]);

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

        {state.column && state.targetName && (
          <div className="text-xs text-gray-200 pl-1">
            Output column:{" "}
            <code>{`${state.column}_bmpm_score`}</code>
          </div>
        )}
      </div>
    );
  },

  hideOutputPort: false,
});

export default NodePhoneticMatch;
