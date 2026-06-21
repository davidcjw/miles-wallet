#!/usr/bin/env bash
# Regenerate the vendored rawhouse-ds build from its source repo.
#
# rawhouse-ds is consumed as a vendored, compiled package (vendor/rawhouse-ds)
# because its source repo gitignores dist/ and has no prepare script, so a
# git/npm install would arrive without usable build output — and Vercel only
# clones THIS repo, not the sibling design-system checkout. Vendoring the
# compiled dist keeps the app self-contained and deployable.
#
# Usage: DS_SRC=~/code/design-systems/rawhouse-ds ./scripts/sync-ds.sh
set -euo pipefail

DS_SRC="${DS_SRC:-$HOME/code/design-systems/rawhouse-ds}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/vendor/rawhouse-ds"

if [ ! -d "$DS_SRC" ]; then
  echo "Source design system not found at: $DS_SRC" >&2
  echo "Set DS_SRC to the rawhouse-ds checkout, or clone github.com/davidcjw/rawhouse-ds." >&2
  exit 1
fi

echo "Building rawhouse-ds in $DS_SRC ..."
( cd "$DS_SRC" && npm run build )

echo "Copying dist → $DEST/dist"
rm -rf "$DEST/dist"
cp -R "$DS_SRC/dist" "$DEST/dist"

echo "Done. Run 'npm install' then 'npm run build' to verify."
