#!/usr/bin/env bash
# Builds the OpenAI plugin directory ZIP (ChatGPT and Codex): only the
# portable package, with no Claude, Cursor or Codex overlays, hooks or
# .app.json, which the directory rejects.
# Usage: scripts/build-openai-zip.sh [output.zip]
set -euo pipefail
cd "$(dirname "$0")/.."
out="$(cd "$(dirname "${1:-orthogonal-openai-plugin.zip}")" && pwd)/$(basename "${1:-orthogonal-openai-plugin.zip}")"
node scripts/validate-template.mjs
rm -f "$out"
zip -qrX "$out" plugin.json mcp.json skills assets/logo.png assets/logo-dark.png assets/icon.png assets/icon-dark.png LICENSE -x '.*' '*/.*'
unzip -l "$out"
