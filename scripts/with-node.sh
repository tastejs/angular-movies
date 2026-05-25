#!/usr/bin/env bash
set -euo pipefail

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
else
  echo "nvm not found. Install nvm, then run: nvm use" >&2
  exit 1
fi

cd "$(dirname "$0")/.."
nvm use

exec "$@"
