import React, { useEffect } from "react";
import * as dfd from "danfojs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createNodeComponent } from "../createNodeComponent";

interface State {
  shuffled: boolean;
  seed: number | null;
  deterministic: boolean;
  outputDf: dfd.DataFrame | null;
}

const NodeShuffleRows = createNodeComponent<State>({
  label: "Shuffle Rows",
  description:
    "Randomly shuffle the rows of a DataFrame. Auto-updates when input changes. Supports deterministic mode and manual reseeding.",
  width: 320,
  initialInputs: ["dataframe"],
  outputType: "dataframe",
  initialState: {
    shuffled: false,
    seed: 12345,
    deterministic: false,
    outputDf: null,
  },

  computeOutput: (inputs, state) => state.outputDf ?? inputs[0]?.value ?? null,

  renderInputControls: () => null,

  renderControls: ({ inputs, state, setState }) => {
    const df = inputs[0]?.value as dfd.DataFrame | null;
    const disabled = !df || !df.shape || df.shape[0] === 0;

    // --- Shuffle logic (shared by auto + manual)
    const shuffle = async (triggeredByInput = false) => {
      if (!df) return;
      try {
        const numRows = df.shape[0];
        const seed = state.deterministic
          ? state.seed ?? 12345
          : triggeredByInput
          ? Math.floor(Math.random() * 1_000_000)
          : state.seed ?? Math.floor(Math.random() * 1_000_000);

        const shuffledDf = await df.sample(numRows, { seed });
        setState((s) => ({
          ...s,
          shuffled: true,
          seed,
          outputDf: shuffledDf,
        }));
      } catch (err) {
        console.error("Shuffle failed:", err);
      }
    };

    // --- Auto-shuffle when input changes
    useEffect(() => {
      if (df && df.shape[0] > 0) shuffle(true);
      else setState((s) => ({ ...s, outputDf: null, shuffled: false }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [df]);

    return (
      <div className="flex flex-col gap-3 p-2">
        {/* Shuffle Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => shuffle(false)}
          disabled={disabled}
          className={`text-xs w-fit ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Shuffle Now
        </Button>

        {/* Deterministic Toggle */}
        <div className="flex items-center gap-2">
          <Switch
            id="deterministic"
            checked={state.deterministic}
            onCheckedChange={(v) => setState((s) => ({ ...s, deterministic: v }))}
          />
          <Label
            htmlFor="deterministic"
            className="text-xs text-gray-200 cursor-pointer select-none"
          >
            Use deterministic seed
          </Label>
        </div>

        {/* Manual Seed Input */}
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

        {/* Status */}
        {state.shuffled && (
          <div className="text-[11px] text-gray-300 pl-1">
            Rows shuffled (
            {state.deterministic
              ? `fixed seed ${state.seed ?? "—"}`
              : `random seed ${state.seed}`})
          </div>
        )}
      </div>
    );
  },

  hideOutputPort: false,
});

export default NodeShuffleRows;
