#!/usr/bin/env bash
# Regenerates the committed showcase specs (those with output tracked in git).
# The full 128-spec compatibility matrix is covered by `pnpm test` in each package.
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

for config in "$SCRIPT_DIR/configs/"*.json; do
  name=$(basename "$config" .json)
  output_dir="examples/generated/$name"
  # Only regenerate specs whose output directory is committed to git
  if git -C "$REPO_ROOT" ls-files --error-unmatch "$output_dir" > /dev/null 2>&1; then
    echo "Generating $name..."
    pnpm exec openapi-gen --config "$config"
  fi
done
echo "Done."
