---
type: brief
id: "PR5a"
title: "Error-handling conversion: candle_indicators"
status: ready
effort: medium
wave: B
depends_on: ["PR2"]
touches:
  - src/candle_indicators.rs
  - test/candleIndicators.node.test.js
  - CHANGELOG.md
forbidden:
  - "src/jsutil.rs (the js_err helper — consume it, do not modify)"
  - "src/lib.rs (enum mirrors)"
  - "the other src/*_indicators.rs modules (their own 5x briefs)"
  - "index.js / index.node.js / index.web.js / index.d.ts (no signature/binding change)"
branch: "pr/5a-candle-errors"
pr_target: "main"
related:
  - "[[RELEASE_1.3.0]]"
decisive_test: "A1"
created: 2026-06-20
tags: [brief]
---

# PR5a — Error-handling conversion: `candle_indicators`

> **Self-contained.** You do not need to read the plan to execute this brief.
> Repo conventions — branch/commit/PR format, the pre-PR validation gates, the
> stop-and-report rule, the report shape — live in `AGENTS.md` / `CLAUDE.md` and
> are assumed; this brief carries only what is specific to the batch.
> **Done = the named acceptance tests below pass.** Stop and report if anything
> blocks you; do not work around an unexpected obstacle.

## Mission

Convert every fallible `.expect(...)` call site in `src/candle_indicators.rs`
from a Rust panic into a thrown JS `Error`, by returning `Result<T, JsValue>`
and mapping the core error through the shared `js_err` helper. Success behavior
(values, ordering, warmup) is unchanged; only the failure *mode* changes
(panic → clean throw). Done = candle indicators throw a catchable `Error` on
invalid input, and the existing parity suite is still bit-for-bit green.

## Context

On wasm32 the crate is built `panic=abort` with no panic hook, so a Rust panic
traps the singleton wasm instance and poisons every later call into the module —
the whole binding becomes unusable. Returning `Result<T, JsValue>` makes
wasm-bindgen throw a normal JS `Error` instead, leaving the instance healthy.

**This is one of eight identical per-module conversions (PR 5a–5h).** PR 2
already did `chart_trends` and created the shared helper
`src/jsutil.rs::js_err`, which returns a real `js_sys::Error` (so thrown values
are `instanceof Error`). This brief does **only** `candle_indicators`.

`candle_indicators` is the second-largest module by call sites (~16 `.expect(`
hits on `main`). Functions here take enum mirrors (`MovingAverageType`,
`DeviationModel`, `ConstantModelType`, `Position`) and return both scalars
(`f64`) and `Array` (envelope/band tuples). Both return shapes convert.

## Prerequisites (confirm; do not perform here)

- **PR 2 merged**: `src/jsutil.rs` exists and exports `pub fn js_err(...)
  -> JsValue`. Verify: `rg -n 'pub fn js_err' src/jsutil.rs` returns a hit and
  `rg -n 'pub mod jsutil' src/lib.rs` is present. **If absent, stop and report**
  — this batch cannot land before PR 2.

## Verify first (re-confirm at session start)

Line numbers drift; locate by symbol. If any row fails, stop and report.

| Claim | How to check | Expected |
|-------|--------------|----------|
| `.expect(` sites still present | `rg -c '\.expect\(' src/candle_indicators.rs` | ~16 (hint; convert the fallible ones) |
| helper available | `rg -n 'pub fn js_err' src/jsutil.rs` | 1 hit |
| not already converted | `rg -c 'map_err\(js_err\)' src/candle_indicators.rs` | 0 |
| test file name | `ls test/candleIndicators.node.test.js` | exists |

## Changes (in order)

1. **Import the helper — `src/candle_indicators.rs`.** Add `use
   crate::jsutil::js_err;` near the other `use` lines (mirror how PR 2 wired it
   into `src/chart_trends.rs`).
2. **Convert each fallible site — `src/candle_indicators.rs`.** For every
   `.expect("…")` that wraps a core-crate call returning `crate::Result<_>`:
   - **Scalar return:** change the fn signature `-> f64` → `-> Result<f64,
     JsValue>` and replace the trailing `.expect("…")` with `.map_err(js_err)`
     (it becomes the tail `Result` — no `?`, no `Ok`).
   - **`Array` return:** change `-> Array` → `-> Result<Array, JsValue>`, bind
     the core result with `.map_err(js_err)?`, build the `Array` as today, and
     return `Ok(out)`.
   - **Preserve any existing `#[allow(...)]` and `#[wasm_bindgen(js_name = …)]`
     attributes verbatim.** Do not rename anything.
3. **Leave infallible functions untouched.** Some wrappers return a value
   directly (no `.expect()`); do not add `Result` to them. List which you left
   unchanged in the PR Scope.
4. **Tests — `test/candleIndicators.node.test.js`.** Add `assert.throws(...)`
   cases for representative invalid inputs (e.g. empty array; `period`/window
   larger than the series; mismatched high/low/close lengths where applicable).
   Assert the thrown value is an `Error` with a non-empty message. Keep all
   existing exact-value parity assertions unchanged.
5. **Changelog.** Append one bullet under the existing `## [Unreleased]` →
   `### Changed` (do not add a second heading): note that `candleIndicators`
   wrappers now throw a JS `Error` on invalid input instead of panicking;
   success values are unchanged.

## Acceptance tests (named; all must pass)

- **A1 (decisive)** — a new `assert.throws` test on a representative
  `candleIndicators` function (e.g. an empty-array or oversized-window input)
  passes: the call throws, the thrown value is `instanceof Error`, and its
  message is non-empty.
- **A2** — every pre-existing `candleIndicators` parity test still passes with
  identical exact numeric output (no value drift).
- **A3 (suite)** — the repo pre-PR gates pass (`cargo fmt --check` ·
  `cargo clippy` · `npm run build` · `node --test`); no dependency change
  (`Cargo.toml` / lockfiles untouched).

## Out of scope (do not touch)

- Any other `src/*_indicators.rs` module — each has its own 5x brief.
- `src/jsutil.rs` (consume `js_err`; do not edit it) and `src/lib.rs` enums.
- `index.js` / `index.node.js` / `index.web.js` and `index.d.ts`: the JS/TS
  **signatures do not change** (still `number` / array; a JS function may always
  throw). PR 2 set this precedent — no `.d.ts` edit. Note a `@throws` doc pass
  separately if you think it's warranted; do not bundle it.
- Do not "improve" success-path logic, message wording beyond the core
  `Display`, or array-building helpers while here.

## Definition of done

- [ ] Acceptance tests A1–A3 green.
- [ ] Pre-PR gates green (per `AGENTS.md`).
- [ ] Changelog entry added under `[Unreleased]` → `### Changed`.
- [ ] Only files in `touches` changed; nothing in `forbidden` moved; infallible
      sites left as-is and listed in the report.
- [ ] PR opened against `main`.

## Report (per AGENTS.md)

Summary · Scope (sites converted; infallible sites deliberately left) ·
Compatibility · Validation (paste gate output) · Changelog — plus each
acceptance-test name with its pass output verbatim (including A1), and anything
flagged.
