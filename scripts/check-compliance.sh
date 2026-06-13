#!/usr/bin/env bash
#
# RYS Libre compliance gate.
#
# Verifies, in CI and locally, that this fork keeps doing "the exact process"
# that defines it:
#   1. The MPL 2.0 obligations are still met (LICENSE intact, modified files
#      carry the MPL header, non-endorsement / trademark notice present).
#   2. The premium paywall is still removed (the client still resolves every
#      user to the PREMIUM tier and never phones the licensing server).
#
# Run from the repo root:  ./scripts/check-compliance.sh
# Exit code 0 = compliant, 1 = one or more violations.

set -uo pipefail

repo="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo"

fail=0
ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; }
bad()  { printf '  \033[31m✗\033[0m %s\n' "$1"; fail=1; }

# Assert a file contains a fixed string (literal, not regex).
need() { # need <file> <literal-substring> <human description>
  if grep -qF -- "$2" "$1" 2>/dev/null; then ok "$3"; else bad "$3 (missing in $1)"; fi
}

echo "== MPL 2.0 obligations =="
need "LICENSE" "Mozilla Public License Version 2.0" "LICENSE is MPL 2.0"
need "README.md" "RYS Libre"                         "README carries the fork name"
need "README.md" "not affiliated"                    "README has non-affiliation notice"
need "README.md" "endorsed"                          "README has non-endorsement notice"

# Every source file we modified must keep an MPL Exhibit A header so the file
# stays demonstrably MPL 2.0.
MPL_HEADER="Mozilla Public"
for f in src/shared/license.js src/content-script/main.js; do
  need "$f" "$MPL_HEADER" "MPL header present in $f"
done

echo "== Paywall removed =="
need "src/shared/license.js"      "return { isPremium: true, source: null };" "checkLicense() forced premium"
need "src/shared/license.js"      "Fork modification (RYS Libre)"             "license.js carries fork marker"
need "src/content-script/main.js" "Fork modification (RYS Libre)"             "content-script carries fork marker"

# Guard against an upstream sync silently re-introducing a real gate: getTier in
# the content script must NOT downgrade anyone to a non-premium tier anymore.
if grep -nE "return TIER\.(FREE|FREE_SIGNED_IN)" src/content-script/main.js >/dev/null 2>&1; then
  bad "content-script getTier() may re-introduce a non-premium tier (found TIER.FREE / TIER.FREE_SIGNED_IN return)"
else
  ok "content-script never returns a non-premium tier"
fi

echo
if [ "$fail" -ne 0 ]; then
  echo "COMPLIANCE CHECK FAILED — see ✗ items above."
  exit 1
fi
echo "COMPLIANCE CHECK PASSED."
