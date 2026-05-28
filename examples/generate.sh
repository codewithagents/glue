#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN="$SCRIPT_DIR/node_modules/.bin/openapi-gen"

for config in "$SCRIPT_DIR/configs/"*.json; do
  name=$(basename "$config" .json)
  echo "Generating $name..."
  "$BIN" --config "$config"
done
echo "Done."
