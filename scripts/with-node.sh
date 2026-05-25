#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
required="$(tr -d '[:space:]' < "$root/.nvmrc" | sed 's/^v//')"

ensure_node() {
  local actual
  actual="$(node -v | sed 's/^v//')"
  if [[ "$actual" == "$required" ]]; then
    return 0
  fi
  echo "Expected Node v${required}, but got v${actual}." >&2
  return 1
}

cd "$root"

if [[ "${CI:-}" == "true" || "${GITHUB_ACTIONS:-}" == "true" ]]; then
  ensure_node || {
    echo "CI expects Node v${required} from setup-node (see .nvmrc)." >&2
    exit 1
  }
  exec "$@"
fi

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
  if ! nvm use "$required" 2>/dev/null; then
    nvm install "$required"
    nvm use "$required"
  fi
else
  ensure_node || {
    echo "nvm not found. Install nvm or use Node v${required} (see .nvmrc)." >&2
    exit 1
  }
fi

exec "$@"
