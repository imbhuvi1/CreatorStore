#!/bin/sh
# Runtime substitution for domain-sensitive files.
# Nginx official image executes any *.sh in /docker-entrypoint.d/ before starting.
# Reads SITE_URL and SITE_GSC_TOKEN from env; defaults keep the build working locally.

set -eu

SITE_URL="${SITE_URL:-http://localhost}"
SITE_GSC_TOKEN="${SITE_GSC_TOKEN:-}"

ROOT="/usr/share/nginx/html"

# Trim any trailing slash from SITE_URL so all links are consistent.
SITE_URL_TRIMMED=$(printf "%s" "$SITE_URL" | sed 's:/*$::')

echo "[entrypoint] Substituting SITE_URL='$SITE_URL_TRIMMED' in static assets..."
for f in "$ROOT/index.html" "$ROOT/sitemap.xml" "$ROOT/robots.txt"; do
  if [ -f "$f" ]; then
    sed -i "s|__SITE_URL__|${SITE_URL_TRIMMED}|g" "$f"
    sed -i "s|__SITE_GSC_TOKEN__|${SITE_GSC_TOKEN}|g" "$f"
  fi
done

echo "[entrypoint] Done."
