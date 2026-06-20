# PR 7 — CommonJS export path

Branch: `pr/7-cjs-export` (#27) · Status: open

## Objective
Give CommonJS consumers a working `require(...)` entry. The `require` condition
previously mapped to the ESM `index.node.js`, which throws `ERR_REQUIRE_ESM` on the
Node 20 floor and yields undefined-valued exports under `require(esm)` on Node 24.

## Changes
- `index.node.cjs` (new) — CommonJS; `require()`s the dist/node glue and exports the
  same namespaces/enums. The export **value is the `init` function** with all
  namespaces/enums attached (review #27), so `require(pkg)()`, `require(pkg).chartTrends`,
  `import init from pkg`, and `__importDefault` all behave correctly.
- `package.json` — `exports["."].require` → `./index.node.cjs`; added to `files`.
- `test/require.cjs` (new) — CJS smoke test (callable export + namespaces resolve).

## Key decisions
- Diagnosis corrected: `index.node.js` is *well-formed* ESM (`createRequire`), not
  malformed — the defect is `require()` of an ESM entry. `index.node.cjs` is the fix.

## Validation
fmt ✓ · clippy ✓ · build ✓ · test ✓ (+ CJS `require` tests).
