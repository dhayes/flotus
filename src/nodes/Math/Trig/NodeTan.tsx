// NodeTan.tsx
import { createNodeComponent } from "../../createNodeComponent";

const NodeTan = createNodeComponent({
  label: "Tangent",
  description: "Returns the tangent of the input (in radians).",
  width: 180,
  initialInputs: ["number"],
  outputType: "number",
  initialState: {},

  computeOutput: (inputs) => {
    const x = Number(inputs[0]?.value ?? 0);
    return Math.tan(x);
  },

  renderInputControls: ({ input, index, updateInput }) => (
    <input
      className="w-full px-2 py-1 bg-white text-black rounded my-1"
      type={input.connected ? "text" : "number"}
      readOnly={!!input.connected}
      value={input.value ?? ""}
      onChange={(e) => updateInput(index, { value: Number(e.target.value) })}
    />
  ),

  renderControls: () => null,

  renderOutput: (value) => (
    <input
      className="w-full px-2 py-1 bg-white text-black rounded text-right"
      type="text"
      readOnly
      value={value}
    />
  ),
});

export default NodeTan;
