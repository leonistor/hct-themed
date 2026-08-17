#!/usr/bin/env bash
#
# prod.sh — Production deployment script for HCT Themed
#
# Workflow:
#   1. Stop running admin (port 3000) and web (port 4321) servers
#   2. Backup db/hct.db → backups/backup-hct-{timestamp}.db
#   3. Snapshot uncommitted changes on a temp branch, reset main to clean
#   4. git pull
#   5. bun install
#   6. Run Payload migrations
#   7. bun run build
#   8. Show start instruction or visually-striking error
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

DB_PATH="db/hct.db"
BACKUP_DIR="backups"
TIMESTAMP="$(date +"%Y-%m-%d:%M:%S")"
BACKUP_TIMESTAMP="$(date +"%Y-%m-%d-%H-%M-%S")"
BACKUP_FILE="$BACKUP_DIR/backup-hct-${BACKUP_TIMESTAMP}.db"
BRANCH_NAME="prod-${TIMESTAMP}"

echo "============================================"
echo " HCT Themed — Production Deployment"
echo " Timestamp: $TIMESTAMP"
echo "============================================"
echo ""

# ── 1. Stop running servers ─────────────────────────────────────────────
echo "[1/7] Stopping servers on ports 3000 and 4321..."

for PORT in 3000 4321; do
    PIDS="$(lsof -ti :"$PORT" 2>/dev/null || true)"
    if [ -n "$PIDS" ]; then
        echo "  -> Killing PID(s) on port $PORT: $PIDS"
        kill -9 $PIDS 2>/dev/null || true
    else
        echo "  OK  port $PORT is free"
    fi
done
echo ""

# ── 2. Database backup ──────────────────────────────────────────────────
echo "[2/7] Backing up database..."

if [ ! -f "$DB_PATH" ]; then
    echo "  FAIL  Database not found: $DB_PATH"
    exit 1
fi

mkdir -p "$BACKUP_DIR"
cp "$DB_PATH" "$BACKUP_FILE"
echo "  OK  Saved: $BACKUP_FILE"
echo ""

# ── 3. Git: snapshot changes, reset main ────────────────────────────────
echo "[3/7] Checking git status..."

if [ -n "$(git status --porcelain)" ]; then
    echo "  -> Uncommitted changes detected."
    echo "  -> Creating branch '$BRANCH_NAME' and committing..."
    git checkout -b "$BRANCH_NAME"
    git add -A
    git commit -m "Auto-deploy snapshot: $TIMESTAMP"
    echo "  -> Switching back to main and cleaning working tree..."
    git checkout main
    git reset --hard HEAD
    git clean -fd
    echo "  OK  Clean working tree on main"
    echo "     (changes preserved on branch: $BRANCH_NAME)"
else
    echo "  OK  No uncommitted changes"
fi
echo ""

# ── 4. Git pull ─────────────────────────────────────────────────────────
echo "[4/7] Pulling latest code..."
git pull
echo ""

# ── 5. Install dependencies ─────────────────────────────────────────────
echo "[5/7] Installing dependencies..."
bun install
echo ""

# ── 6. Build ────────────────────────────────────────────────────────────
echo "[6/8] Running Payload migrations..."

if ! (cd admin && NODE_ENV=production bun run payload migrate); then
    echo ""
    echo "============================================================"
    echo ""
    echo "              ***  MIGRATION FAILED  ***"
    echo ""
    echo "        The production database was not migrated."
    echo "        Deployment stopped before the build step."
    echo ""
    echo "============================================================"
    echo ""
    exit 1
fi
echo ""

echo "[7/8] Building project..."

if ! bun run build; then
    echo ""
    echo "============================================================"
    echo ""
    echo "              ***  BUILD FAILED  ***"
    echo ""
    echo "        The production build encountered errors."
    echo "        Please review the output above and fix"
    echo "        the issues before retrying deployment."
    echo ""
    echo "============================================================"
    echo ""
    exit 1
fi
echo ""

# ── 7. Done ─────────────────────────────────────────────────────────────
echo "[8/8] Build successful!"
echo ""
echo "============================================================"
echo ""
echo "  Run 'nohup bun run prod > ../nohup.log &' to start servers"
echo ""
echo "============================================================"
