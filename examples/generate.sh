#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for config in "$SCRIPT_DIR/configs/"*.json; do
  name=$(basename "$config" .json)
  echo "Generating $name..."
  openapi-gen --config "$config"
done
echo "Done."
