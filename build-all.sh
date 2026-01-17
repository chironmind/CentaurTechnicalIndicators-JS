#!/usr/bin/env bash
set -euo pipefail

# Build for browser, node, and bundlers
wasm-pack build --release --target web --out-dir dist/web --out-name centaur_technical_indicators
wasm-pack build --release --target nodejs --out-dir dist/node --out-name centaur_technical_indicators
wasm-pack build --release --target bundler --out-dir dist/bundler --out-name centaur_technical_indicators

# Remove .gitignore files created by wasm-pack. This cleanup is necessary because npm respects .gitignore files even in the dist/ directory,
# which would otherwise exclude WASM files from the published package despite being listed in the files field of package.json.
rm -f dist/web/.gitignore dist/node/.gitignore dist/bundler/.gitignore

echo "Build complete. Outputs in dist/web, dist/node, dist/bundler"
