#!/usr/bin/env bash
set -e

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 input.csv OutputNodeName.tsx [LabelName]"
  exit 1
fi

INPUT_CSV="$1"
OUTPUT_TSX="$2"
LABEL_NAME="$3"

if [ -z "$LABEL_NAME" ]; then
  LABEL_NAME="$(basename "$OUTPUT_TSX" .tsx)"
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required but not installed."
  exit 1
fi

if ! command -v csvjson >/dev/null 2>&1; then
  echo "Error: csvjson (from csvkit) is required but not installed."
  echo "Install via: pip install csvkit"
  exit 1
fi

echo "Converting CSV → JSON rows..."
JSON_DATA=$(csvjson --indent 2 "$INPUT_CSV")

cat <<EOF > "$OUTPUT_TSX"
import { createNodeComponent } from "../../createNodeComponent";
import * as dfd from "danfojs";

// Auto-generated from: $INPUT_CSV
// Generated on: $(date)

const dataset = $JSON_DATA;

const ${LABEL_NAME} = createNodeComponent({
  label: "${LABEL_NAME}",
  description: "Dataset node generated automatically from CSV.",
  width: 260,
  initialInputs: [],
  outputType: "dataframe",
  initialState: {},

  computeOutput: () => new dfd.DataFrame(dataset),

  renderInputControls: () => null,

  renderControls: () => (
    <div className="text-xs text-white font-mono bg-black bg-opacity-30 rounded p-2">
      Rows: {dataset.length}<br />
      Columns: {Object.keys(dataset[0]).length}
    </div>
  ),

  renderOutput: (value) =>
    value instanceof dfd.DataFrame ? (
      <div className="text-white text-xs font-mono pt-1">
        Output: DataFrame [{value.shape[0]}×{value.shape[1]}]
      </div>
    ) : null,
});

export default ${LABEL_NAME};
EOF

echo "✔ Generated $OUTPUT_TSX"
