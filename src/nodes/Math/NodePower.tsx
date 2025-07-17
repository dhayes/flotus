// NodePower.tsx
import { createNodeComponent } from "../createNodeComponent";

const NodePower = createNodeComponent({
  label: "Power",
  description: "Raises the first number to the power of the second.",
  width: 200,
  initialInputs: ["number", "number"],
  outputType: "number",
  initialState: {},

  computeOutput: (inputs) => {
    const base = Number(inputs[0]?.value ?? 0);
    const exponent = Number(inputs[1]?.value ?? 1);
    return Math.pow(base, exponent);
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

export default NodePower;
