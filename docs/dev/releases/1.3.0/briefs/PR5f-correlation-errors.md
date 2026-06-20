---
type: brief
id: "PR5f"
title: "Error-handling conversion: correlation_indicators"
status: ready
effort: medium
wave: B
depends_on: ["PR2"]
touches:
  - src/correlation_indicators.rs
  - test/corelationIndicators.node.test.js
  - CHANGELOG.md
forbidden:
  - "src/jsutil.rs (the js_err helper — consume it, do not modify)"
  - "src/lib.rs (enum mirrors)"
  - "the other src/*_indicators.rs modules (their own 5x briefs)"
  - "index.js / index.node.js / index.web.js / index.d.ts (no signature/binding change)"
branch: "pr/5f-correlation-errors"
pr_target: "main"
related:
  - "[[RELEASE_1.3.0]]"
decisive_test: "A1"
created: 2026-06-20
tags: [brief]
---

# PR5f — Error-handling conversion: `correlation_indicators`

> **Self-contained.** You do not need to read the plan to execute this brief.
> Repo conventions — branch/commit/PR format, the pre-PR validation gates, the
> stop-and-report rule, the report shape — live in `AGENTS.md` / `CLAUDE.md` and
> are assumed; this brief carries only what is specific to the batch.
> **Done = the named acceptance tests below pass.** Stop and report if anything
> blocks you; do not work around an unexpected obstacle.

## Mission

Convert the two fallible `.expect(...)` sites in
`src/correlation_indicators.rs` into a thrown JS `Error` via `Result<T,
JsValue>` and the shared `js_err` helper. The module has exactly two wrappers:
`correlation_single_correlateAssetPrices` (scalar) and
`correlation_bulk_correlateAssetPrices` (`Array`). Success behavior unchanged;
only failure mode changes. Done = both throw a catchable `Error` on invalid
input and the existing parity suite is bit-for-bit green.

## Context

On wasm32 (`panic=abort`, no hook) a panic poisons the singleton instance;
`Result<T, JsValue>` throws cleanly. PR 2 created `src/jsutil.rs::js_err`
(returns a real `js_sys::Error`) and converted `chart_trends`. This brief does
**only** `correlation_indicators` — the smallest 5x module.

**Filename gotcha.** The test file is **misspelled**:
`test/corelationIndicators.node.test.js` (one `r`). That is the file that
currently exists and runs; target it as-is. The misspelling fix is **not** part
of the 1.3.0 plan — do not rename it here (note it for a separate cleanup).

For reference, the current shape (from `main`):

```rust
// scalar — convert to Result<f64, JsValue> via .map_err(js_err)
pub fn correlation_single_correlate_asset_prices(...) -> f64 {
    centaur_technical_indicators::correlation_indicators::single::correlate_asset_prices(...)
        .expect("Failed to correlate asset prices")
}
// Array — convert to Result<Array, JsValue>: bind with .map_err(js_err)?, then Ok(out)
```

## Prerequisites (confirm; do not perform here)

- **PR 2 merged**: `rg -n 'pub fn js_err' src/jsutil.rs` returns a hit.
  **If absent, stop and report.**

## Verify first (re-confirm at session start)

| Claim | How to check | Expected |
|-------|--------------|----------|
| `.expect(` sites present | `rg -c '\.expect\(' src/correlation_indicators.rs` | 2 |
| helper available | `rg -n 'pub fn js_err' src/jsutil.rs` | 1 hit |
| (mis-spelled) test file name | `ls test/corelationIndicators.node.test.js` | exists |

## Changes (in order)

1. **Import the helper.** `use crate::jsutil::js_err;`.
2. **Convert the scalar wrapper.** `-> f64` → `-> Result<f64, JsValue>`;
   `.expect("Failed to correlate asset prices")` → `.map_err(js_err)`.
3. **Convert the `Array` wrapper.** `-> Array` → `-> Result<Array, JsValue>`;
   bind the core result with `.map_err(js_err)?`; build the `Array` as today;
   return `Ok(out)`.
4. **Tests — `test/corelationIndicators.node.test.js`.** Add `assert.throws(...)`
   for representative invalid input (e.g. mismatched asset-series lengths, or
   empty data); assert `instanceof Error` + non-empty message. If a previously
   commented-out throw block exists, uncomment/adapt it. Keep existing
   exact-value parity assertions (this file already walks multiple
   `ConstantModelType` / `DeviationModel` variants — leave those).
5. **Changelog.** One bullet under `## [Unreleased]` → `### Changed`:
   `correlationIndicators` wrappers throw a JS `Error` instead of panicking;
   success values unchanged.

## Acceptance tests (named; all must pass)

- **A1 (decisive)** — a new `assert.throws` test on
  `correlationIndicators.single.correlateAssetPrices` (or `.bulk`) with invalid
  input passes: throws, `instanceof Error`, non-empty message.
- **A2** — pre-existing `correlationIndicators` parity tests (all variants)
  still pass identically.
- **A3 (suite)** — pre-PR gates pass; no dependency change.

## Out of scope (do not touch)

- Any other module; `src/jsutil.rs`; `src/lib.rs` enums.
- Renaming the misspelled `corelation…` test file (separate cleanup, not 1.3.0).
- `index.*` and `index.d.ts` (signatures unchanged; PR 2 precedent).

## Definition of done

- [ ] Acceptance tests A1–A3 green.
- [ ] Pre-PR gates green.
- [ ] Changelog entry under `[Unreleased]` → `### Changed`.
- [ ] Only `touches` files changed.
- [ ] PR opened against `main`.

## Report (per AGENTS.md)

Summary · Scope · Compatibility · Validation (paste gate output) · Changelog —
plus each acceptance-test name with pass output verbatim (including A1), and
anything flagged (e.g. the misspelled filename noted, not fixed).
