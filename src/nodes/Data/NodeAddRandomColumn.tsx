import React, { useMemo } from "react";
import * as dfd from "danfojs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createNodeComponent } from "../createNodeComponent";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";

interface State {
  columnName: string;
  distribution: "uniform" | "normal" | "exponential";
  params: {
    min?: number;
    max?: number;
    mean?: number;
    std?: number;
    lambda?: number;
  };
  deterministic: boolean;
  seed: number | null;
}

const NodeAddRandomColumn = createNodeComponent<State>({
  label: "Add Random Column",
  description:
    "Adds a new column with random numbers from a chosen distribution (uniform, normal, or exponential). Supports deterministic seed mode.",
  width: 360,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    columnName: "rand",
    distribution: "uniform",
    params: { min: 0, max: 1, mean: 0, std: 1, lambda: 1 },
    deterministic: false,
    seed: 12345,
  },

  computeOutput: (inputs, state) => {
    const df: dfd.DataFrame | null = inputs[0]?.value ?? null;
    if (!df) return null;

    const n = df.shape[0];
    if (n === 0) return df;

    const { distribution, params, deterministic, seed, columnName } = state;
    const rng = deterministic && seed != null ? mulberry32(seed) : Math.random;

    let values: number[] = [];

    switch (distribution) {
      case "uniform": {
        const min = params.min ?? 0;
        const max = params.max ?? 1;
        values = Array.from({ length: n }, () => min + (max - min) * rng());
        break;
      }
      case "normal": {
        const mean = params.mean ?? 0;
        const std = params.std ?? 1;
        values = Array.from({ length: n }, () => {
          // Box–Muller transform
          let u = 0, v = 0;
          while (u === 0) u = rng();
          while (v === 0) v = rng();
          const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
          return mean + z * std;
        });
        break;
      }
      case "exponential": {
        const lambda = params.lambda ?? 1;
        values = Array.from({ length: n }, () => {
          const u = 1 - rng();
          return -Math.log(u) / lambda;
        });
        break;
      }
    }

    const newDf = df.copy();
    newDf.addColumn(columnName || "rand", values, { inplace: true });
    return newDf;
  },

  renderInputControls: () => null,

  renderControls: ({ state, setState }) => {
    const dist = state.distribution;
    const handleParamChange = (key: keyof State["params"], value: number) =>
      setState((s) => ({ ...s, params: { ...s.params, [key]: value } }));

    return (
      <div className="flex flex-col gap-3 p-2">
        {/* Column Name */}
        <div className="flex items-center gap-2">
          <Label className="text-xs text-gray-200 w-24">Column name:</Label>
          <Input
            className="w-[150px] h-7 bg-white text-black text-xs"
            value={state.columnName}
            onChange={(e) => setState((s) => ({ ...s, columnName: e.target.value }))}
          />
        </div>

        {/* Distribution Selection */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-gray-200">Distribution:</Label>
          <Select
            value={state.distribution}
            onValueChange={(v) => setState((s) => ({ ...s, distribution: v as State["distribution"] }))}
          >
            <SelectTrigger className="bg-white text-black text-xs w-[150px]">
              <SelectValue placeholder="Distribution" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Type</SelectLabel>
                <SelectItem value="uniform">Uniform</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="exponential">Exponential</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Distribution Parameters */}
        <div className="flex flex-col gap-2">
          {dist === "uniform" && (
            <>
              <ParamInput
                label="Min"
                value={state.params.min ?? 0}
                onChange={(v) => handleParamChange("min", v)}
              />
              <ParamInput
                label="Max"
                value={state.params.max ?? 1}
                onChange={(v) => handleParamChange("max", v)}
              />
            </>
          )}
          {dist === "normal" && (
            <>
              <ParamInput
                label="Mean"
                value={state.params.mean ?? 0}
                onChange={(v) => handleParamChange("mean", v)}
              />
              <ParamInput
                label="Std dev"
                value={state.params.std ?? 1}
                onChange={(v) => handleParamChange("std", v)}
              />
            </>
          )}
          {dist === "exponential" && (
            <ParamInput
              label="Lambda"
              value={state.params.lambda ?? 1}
              onChange={(v) => handleParamChange("lambda", v)}
            />
          )}
        </div>

        {/* Deterministic Seed Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Switch
            id="deterministic"
            checked={state.deterministic}
            onCheckedChange={(v) => setState((s) => ({ ...s, deterministic: v }))}
          />
          <Label htmlFor="deterministic" className="text-xs text-gray-200 cursor-pointer select-none">
            Use deterministic seed
          </Label>
        </div>

        {state.deterministic && (
          <div className="flex items-center gap-2 pl-1">
            <Label className="text-xs text-gray-200 w-16">Seed:</Label>
            <Input
              type="number"
              min={0}
              className="w-[100px] h-7 bg-white text-black text-xs"
              value={state.seed ?? ""}
              onChange={(e) => {
                const num = parseInt(e.target.value, 10);
                setState((s) => ({ ...s, seed: isNaN(num) ? null : num }));
              }}
            />
          </div>
        )}
      </div>
    );
  },

  hideOutputPort: false,
});

// Small reusable numeric parameter input
function ParamInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-xs text-gray-200 w-20">{label}:</Label>
      <Input
        type="number"
        className="w-[100px] h-7 bg-white text-black text-xs"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

// Deterministic PRNG (Mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default NodeAddRandomColumn;
