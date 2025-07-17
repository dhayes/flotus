// NodeSlider.tsx
import React from "react";
import { Slider } from "@/components/ui/slider";
import { createNodeComponent } from "../createNodeComponent";

const NodeSlider = createNodeComponent({
  label: "Slider",
  width: 200,
  initialInputs: new Array<string>, // no inputs
  outputType: "number",
  initialState: { value: 5 },
  description: "A slider that outputs a fractional value from 0 to 10",

  computeOutput: (_inputs, state) => state.value,

  renderControls: ({ state, setState }) => (
    <div className="px-2">
      <Slider
        max={10}
        step={0.1}
        value={[state.value]}
        onValueChange={([v]) => setState((prev) => ({ ...prev, value: v }))}
      />
    </div>
  ),
  renderOutput: (output) => (
    <div className="mx-0">
      <input
        className='w-15 py-0 px-2 bg-white rounded'
        type='text'
        value={output?.toFixed(2)}
        readOnly
      />
    </div>

  ),
});

export default NodeSlider;
