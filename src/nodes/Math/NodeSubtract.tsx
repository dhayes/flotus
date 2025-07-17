// NodeSubtract.tsx
import { createNodeComponent } from "../createNodeComponent";

const NodeSubtract = createNodeComponent({
  label: "Subtract",
  description: "Subtracts the second number from the first.",
  width: 200,
  initialInputs: ["number", "number"],
  outputType: "number",
  initialState: {},

  computeOutput: (inputs) => {
    const a = Number(inputs[0]?.value ?? 0);
    const b = Number(inputs[1]?.value ?? 0);
    return a - b;
  },

  renderInputControls: ({ input, index, updateInput }) => (
    <input
      className="w-20 px-2 py-1 bg-white text-black rounded my-1"
      type={input.connected ? "text" : "number"}
      readOnly={!!input.connected}
      value={input.value ?? ""}
      onChange={(e) => updateInput(index, { value: Number(e.target.value) })}
    />
  ),

  renderControls: () => null,

  renderOutput: (value) => (
    <input
      className="w-1/3 py-0 px-2 bg-white text-black rounded text-right"
      type="text"
      readOnly
      value={value}
    />
  ),
});

export default NodeSubtract;
