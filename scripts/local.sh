#!/usr/bin/env bash
# One-command local run.  Usage:  npm run local        (production build, port 3210)
#                                 npm run local -- dev (hot-reload dev server)
# Uses a project-local PostgreSQL cluster in .pgdata on port 5433, so it never touches
# any other Postgres databases on this machine.
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$PWD"
PORT="${PORT:-3210}"
MODE="${1:-start}"

# Keep temp files on this volume (the system disk may be full).
mkdir -p "$ROOT/.cache/tmp" "$ROOT/.cache/npm"
export TMPDIR="$ROOT/.cache/tmp" npm_config_cache="$ROOT/.cache/npm" NEXT_TELEMETRY_DISABLED=1

PG_CTL="$(command -v pg_ctl || ls /opt/homebrew/opt/postgresql@17/bin/pg_ctl 2>/dev/null || true)"
INITDB="$(dirname "$PG_CTL")/initdb"
CREATEDB="$(dirname "$PG_CTL")/createdb"
[ -x "$PG_CTL" ] || { echo "PostgreSQL not found. Install it: brew install postgresql@17"; exit 1; }

if [ ! -d "$ROOT/.pgdata" ]; then
  echo "→ Creating local database cluster (.pgdata)"
  "$INITDB" -D "$ROOT/.pgdata" -U postgres --auth=trust -E UTF8 >/dev/null
fi
if ! "$PG_CTL" -D "$ROOT/.pgdata" status >/dev/null 2>&1; then
  echo "→ Starting PostgreSQL on port 5433"
  "$PG_CTL" -D "$ROOT/.pgdata" -o "-p 5433 -k /tmp" -l "$ROOT/.cache/postgres.log" start -w >/dev/null
fi
"$CREATEDB" -h localhost -p 5433 -U postgres indie_habitat 2>/dev/null || true

if [ ! -f "$ROOT/.env" ]; then
  echo "→ Creating .env"
  SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))")"
  cat > "$ROOT/.env" <<ENV
DATABASE_URL="postgresql://postgres@localhost:5433/indie_habitat"
NEXT_PUBLIC_SITE_URL="http://localhost:$PORT"
AUTH_SECRET="$SECRET"
ADMIN_EMAIL="admin@indiehabitat.local"
ADMIN_PASSWORD="change-me-habitat-2026"
ENV
fi

[ -d node_modules ] || npm install
echo "→ Applying migrations and seeding verified content"
npx prisma migrate deploy >/dev/null
npx prisma generate >/dev/null
npx tsx prisma/seed.ts

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT is already in use. Run with another port, e.g.:  PORT=4321 npm run local"; exit 1
fi

if [ "$MODE" = "dev" ]; then
  echo "→ Dev server: http://localhost:$PORT"
  exec npx next dev -p "$PORT"
else
  echo "→ Building"
  npx next build >/dev/null
  echo "→ Site:  http://localhost:$PORT      Admin: http://localhost:$PORT/admin"
  exec npx next start -p "$PORT"
fi
