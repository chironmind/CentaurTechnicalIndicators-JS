# PR 2 — Error handling: chart_trends + shared `js_err`

Branch: `pr/2-chart-trends-errors` (#29) · Status: open

## Objective
Convert the six `chart_trends` wrappers from `.expect(...)` panics to thrown JS
errors, and add the shared `js_err` adapter reused by later modules.

## Changes
- `src/jsutil.rs` (new) — `js_err`; registered as `pub mod jsutil;` in `src/lib.rs`.
- `src/chart_trends.rs` — all 6 fns now return `Result<Array, JsValue>` via
  `.map_err(js_err)?` (peaks, valleys, peakTrend, valleyTrend, overallTrend,
  breakDownTrends); `#[allow(clippy::too_many_arguments)]` on breakDownTrends kept.
- `test/chartTrends.node.test.js` — 6 `assert.throws` cases for invalid input.

## Key decisions
- **Panic → `Result` is a real fix, not cosmetic:** wasm32 defaults to
  `panic = abort` with no panic hook, so a Rust panic traps the singleton wasm
  instance and poisons later calls; `Result` throws cleanly and keeps it usable.
- `js_err` returns a real `js_sys::Error` (review #29) — thrown values have
  `.message`/`stack` and are `instanceof Error`, not a primitive string.
- Entry points / `index.d.ts` untouched: wasm-bindgen turns `Result<Array,JsValue>`
  into the same throwing JS export (same name, signature, TS type).

## Validation
fmt ✓ · clippy ✓ · build ✓ · test ✓ (parity suite unchanged + 6 new throws tests).
