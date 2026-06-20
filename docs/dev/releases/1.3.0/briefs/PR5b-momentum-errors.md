---
type: brief
id: "PR5b"
title: "Error-handling conversion: momentum_indicators"
status: ready
effort: medium
wave: B
depends_on: ["PR2"]
touches:
  - src/momentum_indicators.rs
  - test/momentumIndicators.node.test.js
  - CHANGELOG.md
forbidden:
  - "src/jsutil.rs (the js_err helper — consume it, do not modify)"
  - "src/lib.rs (enum mirrors)"
  - "the other src/*_indicators.rs modules (their own 5x briefs)"
  - "index.js / index.node.js / index.web.js / index.d.ts (no signature/binding change)"
branch: "pr/5b-momentum-errors"
pr_target: "main"
related:
  - "[[RELEASE_1.3.0]]"
decisive_test: "A1"
created: 2026-06-20
tags: [brief]
---

# PR5b — Error-handling conversion: `momentum_indicators`

> **Self-contained.** You do not need to read the plan to execute this brief.
> Repo conventions — branch/commit/PR format, the pre-PR validation gates, the
> stop-and-report rule, the report shape — live in `AGENTS.md` / `CLAUDE.md` and
> are assumed; this brief carries only what is specific to the batch.
> **Done = the named acceptance tests below pass.** Stop and report if anything
> blocks you; do not work around an unexpected obstacle.

## Mission

Convert every fallible `.expect(...)` call site in `src/momentum_indicators.rs`
into a thrown JS `Error` by returning `Result<T, JsValue>` via the shared
`js_err` helper. Success behavior unchanged; only the failure mode changes
(panic → clean throw). This is the **largest** of the 5x modules (~32 `.expect(`
sites on `main`). Done = momentum indicators throw a catchable `Error` on
invalid input and the existing parity suite is bit-for-bit green.

## Context

On wasm32 (`panic=abort`, no panic hook) a Rust panic traps the singleton wasm
instance and poisons later calls; `Result<T, JsValue>` throws a normal JS
`Error` and keeps the instance usable. PR 2 created `src/jsutil.rs::js_err`
(returns a real `js_sys::Error`, so throws are `instanceof Error`) and converted
`chart_trends`. This brief does **only** `momentum_indicators`.

**Landmine — chaikin `#[allow]` attributes.** The two chaikin functions,
`momentum_single_chaikin_oscillator` (8 args) and
`momentum_bulk_chaikin_oscillator` (9 args), exceed clippy's
`too_many_arguments` threshold. PR 8 adds `#[allow(clippy::too_many_arguments)]`
to both and turns on the strict `-D warnings` gate. **If PR 8 has already merged,
those `#[allow]` attributes are present — preserve them exactly when you rewrite
those call sites, or the strict clippy gate re-breaks.** If PR 8 has not merged,
do not add them here (that is PR 8's job); just convert the bodies. Match the
functions by **name**, not line number.

**Ordering note.** This module is also touched by PR 8. Whichever lands second
rebases on the other; this brief and PR 8 are otherwise independent.

## Prerequisites (confirm; do not perform here)

- **PR 2 merged**: `src/jsutil.rs` exports `pub fn js_err`. Verify:
  `rg -n 'pub fn js_err' src/jsutil.rs`. **If absent, stop and report.**

## Verify first (re-confirm at session start)

| Claim | How to check | Expected |
|-------|--------------|----------|
| `.expect(` sites present | `rg -c '\.expect\(' src/momentum_indicators.rs` | ~32 (hint) |
| chaikin fns locatable by name | `rg -n 'chaikin_oscillator' src/momentum_indicators.rs` | single + bulk fns |
| PR 8 status (does `#[allow]` already exist?) | `rg -n 'too_many_arguments' src/momentum_indicators.rs` | 0 (PR8 not merged) or 2 (merged — preserve) |
| not already converted | `rg -c 'map_err\(js_err\)' src/momentum_indicators.rs` | 0 |

## Changes (in order)

1. **Import the helper.** Add `use crate::jsutil::js_err;` to
   `src/momentum_indicators.rs`.
2. **Convert each fallible site.** For every `.expect("…")` wrapping a core call
   returning `crate::Result<_>`:
   - **Scalar:** `-> f64` → `-> Result<f64, JsValue>`; trailing `.expect("…")` →
     `.map_err(js_err)`.
   - **`Array`:** `-> Array` → `-> Result<Array, JsValue>`; bind the core result
     with `.map_err(js_err)?`; build the `Array`; `Ok(out)`.
   - **Preserve all existing attributes**, especially the chaikin
     `#[allow(clippy::too_many_arguments)]` if present (see landmine), and every
     `#[wasm_bindgen(js_name = …)]`.
3. **Leave infallible functions untouched**; list them in the PR Scope.
4. **Tests — `test/momentumIndicators.node.test.js`.** Add `assert.throws(...)`
   cases for representative invalid inputs (empty array; period > length;
   mismatched series lengths where applicable). Assert `instanceof Error` with a
   non-empty message. Append only — PR 4 already added regression tests to this
   file; keep them intact.
5. **Changelog.** One bullet under `## [Unreleased]` → `### Changed`:
   `momentumIndicators` wrappers now throw a JS `Error` on invalid input instead
   of panicking; success values unchanged.

## Acceptance tests (named; all must pass)

- **A1 (decisive)** — a new `assert.throws` test on a representative
  `momentumIndicators` function passes: throws, `instanceof Error`, non-empty
  message.
- **A2** — all pre-existing `momentumIndicators` parity + PR 4 regression tests
  still pass with identical output.
- **A3 (suite)** — pre-PR gates pass; if PR 8 has merged, `cargo clippy --target
  wasm32-unknown-unknown --all-targets -- -D warnings` is clean (chaikin
  `#[allow]`s preserved); no dependency change.

## Out of scope (do not touch)

- Any other module; `src/jsutil.rs`; `src/lib.rs` enums.
- `index.*` and `index.d.ts` (signatures unchanged; PR 2 precedent).
- The chaikin argument count / config-object refactor (deferred; not this batch).
- Do not add the strict clippy gate or new `#[allow]`s — that is PR 8.

## Definition of done

- [ ] Acceptance tests A1–A3 green.
- [ ] Pre-PR gates green; chaikin `#[allow]`s preserved if present.
- [ ] Changelog entry under `[Unreleased]` → `### Changed`.
- [ ] Only `touches` files changed; infallible sites listed in report.
- [ ] PR opened against `main`.

## Report (per AGENTS.md)

Summary · Scope (sites converted; infallible left; chaikin `#[allow]` status) ·
Compatibility · Validation (paste gate output) · Changelog — plus each
acceptance-test name with pass output verbatim (including A1), and anything
flagged.
