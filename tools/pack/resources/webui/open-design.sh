#!/usr/bin/env sh
# Open Design WebUI launcher shell. Validates Node 24 then forwards to webui-launcher.
set -e
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ENTRY="$SCRIPT_DIR/app/node_modules/@open-design/packaged/dist/webui-launcher.mjs"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. Please install Node 24 and try again: https://nodejs.org" >&2
  exit 1
fi
MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$MAJOR" -lt 24 ]; then
  echo "Node 24+ is required; found $(node --version). Please upgrade and try again." >&2
  exit 1
fi
export OD_RESOURCE_ROOT="$SCRIPT_DIR/app/resources/open-design"
# Install root holding the launcher scripts + webui.config(.example).json, so
# the launcher discovers/scaffolds config independent of the caller's cwd.
export OD_WEBUI_HOME="$SCRIPT_DIR"
exec node "$ENTRY" "$@"
