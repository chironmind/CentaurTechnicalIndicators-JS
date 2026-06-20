---
type: brief
id: "PR5c"
title: "Error-handling conversion: trend_indicators"
status: ready
effort: medium
wave: B
depends_on: ["PR2"]
touches:
  - src/trend_indicators.rs
  - test/trendIndicators.node.test.js
  - CHANGELOG.md
forbidden:
  - "src/jsutil.rs (the js_err helper — consume it, do not modify)"
  - "src/lib.rs (enum mirrors)"
  - "the other src/*_indicators.rs modules (their own 5x briefs)"
  - "index.js / index.node.js / index.web.js / index.d.ts (no signature/binding change)"
branch: "pr/5c-trend-errors"
pr_target: "main"
related:
  - "[[RELEASE_1.3.0]]"
decisive_test: "A1"
created: 2026-06-20
tags: [brief]
---

# PR5c — Error-handling conversion: `trend_indicators`

> **Self-contained.** You do not need to read the plan to execute this brief.
> Repo conventions — branch/commit/PR format, the pre-PR validation gates, the
> stop-and-report rule, the report shape — live in `AGENTS.md` / `CLAUDE.md` and
> are assumed; this brief carries only what is specific to the batch.
> **Done = the named acceptance tests below pass.** Stop and report if anything
> blocks you; do not work around an unexpected obstacle.

## Mission

Convert every fallible `.expect(...)` site in `src/trend_indicators.rs` into a
thrown JS `Error` via `Result<T, JsValue>` and the shared `js_err` helper
(~12 sites on `main`). Success behavior unchanged; only failure mode changes.
Done = trend indicators throw a catchable `Error` on invalid input and the
existing parity suite is bit-for-bit green.

## Context

On wasm32 (`panic=abort`, no hook) a panic poisons the singleton instance;
`Result<T, JsValue>` throws cleanly. PR 2 created `src/jsutil.rs::js_err`
(returns a real `js_sys::Error`) and converted `chart_trends`. This brief does
**only** `trend_indicators`.

**Note — `volumePriceTrend` silent slice.** This module's
`trend_bulk_volumePriceTrend` deliberately drops `volumes[0]` when
`volumes.len() == prices.len()` (documented in `index.d.ts`). **Do not change
that behavior here** — this batch only converts the panic path to a throw. Any
redesign of the slice is a separate, out-of-scope decision.

## Prerequisites (confirm; do not perform here)

- **PR 2 merged**: `rg -n 'pub fn js_err' src/jsutil.rs` returns a hit.
  **If absent, stop and report.**

## Verify first (re-confirm at session start)

| Claim | How to check | Expected |
|-------|--------------|----------|
| `.expect(` sites present | `rg -c '\.expect\(' src/trend_indicators.rs` | ~12 (hint) |
| helper available | `rg -n 'pub fn js_err' src/jsutil.rs` | 1 hit |
| not already converted | `rg -c 'map_err\(js_err\)' src/trend_indicators.rs` | 0 |
| test file name | `ls test/trendIndicators.node.test.js` | exists |

## Changes (in order)

1. **Import the helper.** `use crate::jsutil::js_err;` in
   `src/trend_indicators.rs`.
2. **Convert each fallible site.** Scalar: `-> f64` → `-> Result<f64, JsValue>`,
   `.expect("…")` → `.map_err(js_err)`. `Array`: `-> Array` → `-> Result<Array,
   JsValue>`, bind with `.map_err(js_err)?`, build `Array`, `Ok(out)`. Preserve
   all existing attributes and `js_name`s; do not rename. Do not alter the
   `volumePriceTrend` slice logic.
3. **Leave infallible functions untouched**; list them in the PR Scope.
4. **Tests — `test/trendIndicators.node.test.js`.** Add `assert.throws(...)` for
   representative invalid inputs; assert `instanceof Error` with a non-empty
   message. Append only — PR 4 already added regression tests here; keep them.
5. **Changelog.** One bullet under `## [Unreleased]` → `### Changed`:
   `trendIndicators` wrappers throw a JS `Error` on invalid input instead of
   panicking; success values unchanged.

## Acceptance tests (named; all must pass)

- **A1 (decisive)** — a new `assert.throws` test on a representative
  `trendIndicators` function passes: throws, `instanceof Error`, non-empty
  message.
- **A2** — pre-existing `trendIndicators` parity + PR 4 regression tests still
  pass with identical output.
- **A3 (suite)** — pre-PR gates pass; no dependency change.

## Out of scope (do not touch)

- Any other module; `src/jsutil.rs`; `src/lib.rs` enums.
- The `volumePriceTrend` silent-slice behavior (decision deferred).
- `index.*` and `index.d.ts` (signatures unchanged; PR 2 precedent).

## Definition of done

- [ ] Acceptance tests A1–A3 green.
- [ ] Pre-PR gates green.
- [ ] Changelog entry under `[Unreleased]` → `### Changed`.
- [ ] Only `touches` files changed; infallible sites listed in report.
- [ ] PR opened against `main`.

## Report (per AGENTS.md)

Summary · Scope (sites converted; infallible left; volumePriceTrend untouched) ·
Compatibility · Validation (paste gate output) · Changelog — plus each
acceptance-test name with pass output verbatim (including A1), and anything
flagged.
