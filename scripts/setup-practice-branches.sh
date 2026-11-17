#!/usr/bin/env sh
# Mac/Linux/Git Bash wrapper: the real logic lives in the Node script so
# Windows and Mac users run exactly the same thing.
# Usage: ./scripts/setup-practice-branches.sh [--list|--reset|--remove|--base <ref>]
set -eu
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install it from https://nodejs.org (LTS) and try again." >&2
  exit 1
fi
exec node "$(dirname "$0")/setup-practice-branches.js" "$@"
