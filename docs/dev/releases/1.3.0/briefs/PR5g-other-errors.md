---
type: brief
id: "PR5g"
title: "Error-handling conversion: other_indicators"
status: ready
effort: medium
wave: B
depends_on: ["PR2"]
touches:
  - src/other_indicators.rs
  - "test/otherIndicators.node.js (or test/otherIndicators.node.test.js if PR6 merged — target whichever exists)"
  - CHANGELOG.md
forbidden:
  - "src/jsutil.rs (the js_err helper — consume it, do not modify)"
  - "src/lib.rs (enum mirrors)"
  - "the other src/*_indicators.rs modules (their own 5x briefs)"
  - "index.js / index.node.js / index.web.js / index.d.ts (no signature/binding change)"
branch: "pr/5g-other-errors"
pr_target: "main"
related:
  - "[[RELEASE_1.3.0]]"
decisive_test: "A1"
created: 2026-06-20
tags: [brief]
---

# PR5g — Error-handling conversion: `other_indicators`

> **Self-contained.** You do not need to read the plan to execute this brief.
> Repo conventions — branch/commit/PR format, the pre-PR validation gates, the
> stop-and-report rule, the report shape — live in `AGENTS.md` / `CLAUDE.md` and
> are assumed; this brief carries only what is specific to the batch.
> **Done = the named acceptance tests below pass.** Stop and report if anything
> blocks you; do not work around an unexpected obstacle.

## Mission

Convert every fallible `.expect(...)` call site in `src/other_indicators.rs`
into a thrown JS `Error` via `Result<T, JsValue>` and the shared `js_err` helper
(~6 sites on `main`). Success behavior unchanged; only the failure mode changes.
Done = other indicators throw a catchable `Error` on invalid input and the
existing parity suite is bit-for-bit green.

## Context

On wasm32 (`panic=abort`, no panic hook) a Rust panic traps the singleton wasm
instance and poisons later calls; `Result<T, JsValue>` throws a normal JS
`Error` and keeps the instance usable. PR 2 created `src/jsutil.rs::js_err`
(returns a real `js_sys::Error`, so throws are `instanceof Error`) and converted
`chart_trends`. This brief does **only** `other_indicators`.

**Note — test-file naming inconsistency (not a discovery skip).** The test file
is `test/otherIndicators.node.js` — it lacks the `.test.` infix that its eight
sibling files (`*.node.test.js`) have. This is **not** a silent skip: `node
--test` with no path arguments (what `npm test` → `node --test` runs) discovers
every `.js` file inside a `test/` directory, so `otherIndicators.node.js` *does*
run today (verified on Node ≥20: its tests execute, 0 skipped), and CI exercises
it. The only fragility is that an **explicit** `test/*.node.test.js`-style glob
(a pattern a future split `test:*` script could adopt) would miss the
un-infixed name. PR 6 (doc hygiene) renames it to
`test/otherIndicators.node.test.js` for naming consistency and glob-safety.

- If **PR 6 has merged**, target the renamed `…node.test.js`.
- If **PR 6 has not merged**, target the existing `…node.js`. Do **not** also
  rename it here — let PR 6 own the rename (unless you coordinate so exactly one
  PR does it, and note that in the report).

## Prerequisites (confirm; do not perform here)

- **PR 2 merged**: `rg -n 'pub fn js_err' src/jsutil.rs` returns a hit.
  **If absent, stop and report.**

## Verify first (re-confirm at session start)

| Claim | How to check | Expected |
|-------|--------------|----------|
| `.expect(` sites present | `rg -c '\.expect\(' src/other_indicators.rs` | ~6 (hint) |
| helper available | `rg -n 'pub fn js_err' src/jsutil.rs` | 1 hit |
| which test filename exists | `ls test/otherIndicators.node*.js` | `…node.js` (PR6 not merged) or `…node.test.js` (merged) |
| file is discovered by `node --test` | `node --test 2>&1 \| rg otherIndicators` | appears (it lives under `test/`) |

## Changes (in order)

1. **Import the helper.** `use crate::jsutil::js_err;`.
2. **Convert each fallible site.** Scalar: `-> f64` → `-> Result<f64, JsValue>`,
   `.expect("…")` → `.map_err(js_err)`. `Array`: `-> Array` → `-> Result<Array,
   JsValue>`, bind with `.map_err(js_err)?`, build `Array`, `Ok(out)`. Preserve
   existing attributes/`js_name`s; do not rename functions.
3. **Leave infallible functions untouched**; list them in the PR Scope.
4. **Tests — the `otherIndicators` test file that exists.** Add
   `assert.throws(...)` for representative invalid inputs (covers
   `returnOnInvestment`, `trueRange`, `averageTrueRange`, `internalBarStrength`,
   `positivityIndicator` as applicable); assert `instanceof Error` + non-empty
   message. Keep the existing parity assertions. Confirm via the test gate that
   they pass.
5. **Changelog.** One bullet under `## [Unreleased]` → `### Changed`:
   `otherIndicators` wrappers throw a JS `Error` on invalid input instead of
   panicking; success values unchanged.

## Acceptance tests (named; all must pass)

- **A1 (decisive)** — a new `assert.throws` test on a representative
  `otherIndicators` function passes: throws, `instanceof Error`, non-empty
  message.
- **A2** — pre-existing `otherIndicators` parity tests still pass identically.
- **A3 (suite)** — pre-PR gates pass; no dependency change.

## Out of scope (do not touch)

- Any other module; `src/jsutil.rs`; `src/lib.rs` enums.
- `index.*` and `index.d.ts` (signatures unchanged; PR 2 precedent).
- The `otherIndicators` test-file rename and PR 6's other doc fixes — let PR 6
  own them; do not bundle.

## Definition of done

- [ ] Acceptance tests A1–A3 green.
- [ ] Pre-PR gates green.
- [ ] Changelog entry under `[Unreleased]` → `### Changed`.
- [ ] Only `touches` files changed; infallible sites listed in report.
- [ ] PR opened against `main`.

## Report (per AGENTS.md)

Summary · Scope (sites converted; infallible left) · Compatibility · Validation
(paste gate output) · Changelog — plus each acceptance-test name with pass
output verbatim (including A1), and anything flagged.
