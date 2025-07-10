#!/usr/bin/env bash
# Usage: ./make-favicons.sh input.png [output-dir] [sizes]
# Example: ./make-favicons.sh logo.png favicons "16 32 48 64"

set -e

INPUT="$1"
OUTDIR="${2:-.}"
SIZES=(${3:-16 32 48})

if [[ -z "$INPUT" ]]; then
  echo "Usage: $0 input.png [output-dir] [sizes]"
  exit 1
fi

mkdir -p "$OUTDIR"

for SIZE in "${SIZES[@]}"; do
  OUTPUT="$OUTDIR/favicon-${SIZE}x${SIZE}.png"
  echo "Generating $OUTPUT ..."
  convert "$INPUT" -resize "${SIZE}x${SIZE}" "$OUTPUT"
done

echo "Done! Generated ${#SIZES[@]} favicons in $OUTDIR."
