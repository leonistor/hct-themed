#!/usr/bin/env bash
#
# run.sh — Load .env and start production servers
#
# Usage:
#   ./run.sh              # foreground (Ctrl+C to stop)
#   nohup ./run.sh > ../nohup.log &   # background
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Export all vars from .env so they're available to child processes
set -a
# shellcheck source=/dev/null
source .env
set +a

echo "Environment loaded. Starting production servers..."
exec bun run prod
