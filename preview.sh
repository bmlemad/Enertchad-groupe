#!/usr/bin/env bash
# Local preview for site-v2 (absolute paths require a server, not file://)
PORT="${1:-8765}"
cd "$(dirname "$0")"
echo "▶ EnerTchad site-v2 preview"
echo "  Open: http://localhost:$PORT/"
echo "  Stop: Ctrl+C"
echo ""
python3 -m http.server "$PORT"
