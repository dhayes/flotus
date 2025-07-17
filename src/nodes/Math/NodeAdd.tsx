// NodeAdd.tsx
import React from "react";
import { createNodeComponent } from "../createNodeComponent";

const NodeAdd = createNodeComponent({
  label: "Add",
  description: "Adds two numbers together.",
  width: 200,
  initialInputs: ["number", "number"],
  outputType: "number",
  initialState: {},

  computeOutput: (inputs) => {
    const a = Number(inputs[0]?.value ?? 0);
    const b = Number(inputs[1]?.value ?? 0);
    return a + b;
  },

  renderInputControls: ({ input, index, updateInput }) => (
    <div className="flex items-center gap-2 my-1">
      <input
        className="w-20 px-2 py-1 bg-white text-black rounded"
        type={input.connected ? "text" : "number"}
        readOnly={!!input.connected}
        value={input.value ?? 0}
        onChange={(e) => updateInput(index, { value: Number(e.target.value) })}
      />
    </div>
  ),

  renderControls: () => null,

  renderOutput: (value) => (
    <input
      className="w-1/3 py-0 px-2 bg-white text-black rounded text-right"
      type="text"
      value={value}
      readOnly
    />
  ),
});

export default NodeAdd;
