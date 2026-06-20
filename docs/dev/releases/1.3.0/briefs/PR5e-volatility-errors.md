---
type: brief
id: "PR5e"
title: "Error-handling conversion: volatility_indicators"
status: ready
effort: medium
wave: B
depends_on: ["PR2"]
touches:
  - src/volatility_indicators.rs
  - test/volatilityIndicators.node.test.js
  - CHANGELOG.md
forbidden:
  - "src/jsutil.rs (the js_err helper — consume it, do not modify)"
  - "src/lib.rs (enum mirrors)"
  - "the other src/*_indicators.rs modules (their own 5x briefs)"
  - "index.js / index.node.js / index.web.js / index.d.ts (no signature/binding change)"
branch: "pr/5e-volatility-errors"
pr_target: "main"
related:
  - "[[RELEASE_1.3.0]]"
decisive_test: "A1"
created: 2026-06-20
tags: [brief]
---

# PR5e — Error-handling conversion: `volatility_indicators`

> **Self-contained.** You do not need to read the plan to execute this brief.
> Repo conventions — branch/commit/PR format, the pre-PR validation gates, the
> stop-and-report rule, the report shape — live in `AGENTS.md` / `CLAUDE.md` and
> are assumed; this brief carries only what is specific to the batch.
> **Done = the named acceptance tests below pass.** Stop and report if anything
> blocks you; do not work around an unexpected obstacle.

## Mission

Convert every fallible `.expect(...)` site in `src/volatility_indicators.rs`
into a thrown JS `Error` via `Result<T, JsValue>` and the shared `js_err` helper
(~3 sites on `main`). Success behavior unchanged; only failure mode changes.
Done = volatility indicators throw a catchable `Error` on invalid input and the
existing parity suite is bit-for-bit green.

## Context

On wasm32 (`panic=abort`, no hook) a panic poisons the singleton instance;
`Result<T, JsValue>` throws cleanly. PR 2 created `src/jsutil.rs::js_err`
(returns a real `js_sys::Error`) and converted `chart_trends`. This brief does
**only** `volatility_indicators`.

## Prerequisites (confirm; do not perform here)

- **PR 2 merged**: `rg -n 'pub fn js_err' src/jsutil.rs` returns a hit.
  **If absent, stop and report.**

## Verify first (re-confirm at session start)

| Claim | How to check | Expected |
|-------|--------------|----------|
| `.expect(` sites present | `rg -c '\.expect\(' src/volatility_indicators.rs` | ~3 (hint) |
| helper available | `rg -n 'pub fn js_err' src/jsutil.rs` | 1 hit |
| not already converted | `rg -c 'map_err\(js_err\)' src/volatility_indicators.rs` | 0 |
| test file name | `ls test/volatilityIndicators.node.test.js` | exists |

## Changes (in order)

1. **Import the helper.** `use crate::jsutil::js_err;`.
2. **Convert each fallible site.** Scalar: `-> f64` → `-> Result<f64, JsValue>`,
   `.expect("…")` → `.map_err(js_err)`. `Array`: `-> Array` → `-> Result<Array,
   JsValue>`, bind with `.map_err(js_err)?`, build `Array`, `Ok(out)`. Preserve
   existing attributes/`js_name`s; do not rename.
3. **Leave infallible functions untouched**; list them in the PR Scope.
4. **Tests — `test/volatilityIndicators.node.test.js`.** Add `assert.throws(...)`
   for representative invalid inputs; assert `instanceof Error` + non-empty
   message. Keep existing parity assertions.
5. **Changelog.** One bullet under `## [Unreleased]` → `### Changed`:
   `volatilityIndicators` wrappers throw a JS `Error` instead of panicking;
   success values unchanged.

## Acceptance tests (named; all must pass)

- **A1 (decisive)** — a new `assert.throws` test on a representative
  `volatilityIndicators` function passes: throws, `instanceof Error`, non-empty
  message.
- **A2** — pre-existing `volatilityIndicators` parity tests still pass
  identically.
- **A3 (suite)** — pre-PR gates pass; no dependency change.

## Out of scope (do not touch)

- Any other module; `src/jsutil.rs`; `src/lib.rs` enums.
- `index.*` and `index.d.ts` (signatures unchanged; PR 2 precedent).
- The deprecated `volatilitySystem` JSDoc tag — do not alter deprecation state.

## Definition of done

- [ ] Acceptance tests A1–A3 green.
- [ ] Pre-PR gates green.
- [ ] Changelog entry under `[Unreleased]` → `### Changed`.
- [ ] Only `touches` files changed; infallible sites listed in report.
- [ ] PR opened against `main`.

## Report (per AGENTS.md)

Summary · Scope · Compatibility · Validation (paste gate output) · Changelog —
plus each acceptance-test name with pass output verbatim (including A1), and
anything flagged.
