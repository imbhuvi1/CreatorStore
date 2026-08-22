#!/usr/bin/env bash
# Post-deploy smoke test.
# Verifies that critical public assets and API endpoints are healthy AND that
# SITE_URL substitution actually happened (i.e. the placeholder is gone).
#
# Usage:
#   SITE_URL=https://your-site.com ./scripts/smoke-test.sh
#   SITE_URL=https://your-site.com API_URL=https://api.your-site.com ./scripts/smoke-test.sh

set -euo pipefail

: "${SITE_URL:?SITE_URL env var is required (e.g. https://portfolio.example.com)}"
API_URL="${API_URL:-$SITE_URL}"

# Strip trailing slash
SITE_URL="${SITE_URL%/}"
API_URL="${API_URL%/}"

PASS=0
FAIL=0
say()  { printf '  \033[36m%s\033[0m %s\n' "→" "$1"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; PASS=$((PASS+1)); }
bad()  { printf '  \033[31m✗\033[0m %s\n' "$1"; FAIL=$((FAIL+1)); }

check_200() {
  local url="$1" label="$2"
  local code
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$url" || echo "000")
  if [ "$code" = "200" ]; then ok "$label ($url) → 200";
  else bad "$label ($url) → HTTP $code"; fi
}

check_contains() {
  local url="$1" needle="$2" label="$3"
  local body
  body=$(curl -sS --max-time 10 "$url" || true)
  if echo "$body" | grep -q -- "$needle"; then ok "$label contains: $needle";
  else bad "$label MISSING: $needle"; fi
}

check_not_contains() {
  local url="$1" needle="$2" label="$3"
  local body
  body=$(curl -sS --max-time 10 "$url" || true)
  if ! echo "$body" | grep -q -- "$needle"; then ok "$label DOES NOT contain: $needle";
  else bad "$label still contains placeholder: $needle"; fi
}

printf '\n\033[1mPortfolio smoke test\033[0m — %s\n\n' "$SITE_URL"

say "Static SEO assets"
check_200 "$SITE_URL/og-image.png" "OG image"
check_200 "$SITE_URL/sitemap.xml"  "sitemap.xml"
check_200 "$SITE_URL/robots.txt"   "robots.txt"
check_200 "$SITE_URL/"             "index.html"

echo
say "SITE_URL substitution (placeholders must be gone)"
check_not_contains "$SITE_URL/"            "__SITE_URL__" "index.html"
check_not_contains "$SITE_URL/sitemap.xml" "__SITE_URL__" "sitemap.xml"
check_not_contains "$SITE_URL/robots.txt"  "__SITE_URL__" "robots.txt"

echo
say "SEO signals"
check_contains "$SITE_URL/"            "og:image"                 "index.html"
check_contains "$SITE_URL/"            "google-site-verification" "index.html"
check_contains "$SITE_URL/sitemap.xml" "$SITE_URL"                "sitemap.xml"

echo
say "Backend health"
check_200 "$API_URL/actuator/health" "actuator/health"
check_200 "$API_URL/api/projects"    "GET /api/projects"
check_200 "$API_URL/api/blog"        "GET /api/blog"

printf '\n\033[1mResult:\033[0m %s passed, %s failed\n\n' "$PASS" "$FAIL"

if [ "$FAIL" -gt 0 ]; then exit 1; fi
