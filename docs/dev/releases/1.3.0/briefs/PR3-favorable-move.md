---
type: brief
id: "PR3"
title: "Favorable-move bindings (peakFavorableMove / valleyFavorableMove)"
status: ready
effort: medium
wave: B
depends_on: ["PR1", "PR2"]
touches:
  - src/chart_trends.rs
  - index.js
  - index.node.js
  - index.web.js
  - index.d.ts
  - test/chartTrends.node.test.js
  - CHANGELOG.md
forbidden:
  - "src/jsutil.rs (consume js_err; do not modify)"
  - "src/lib.rs (enum mirrors)"
  - "the existing peaks/valleys/*Trend/breakDownTrends logic (add alongside; do not edit)"
  - "the other src/*_indicators.rs modules"
branch: "pr/3-favorable-move"
pr_target: "main"
related:
  - "[[RELEASE_1.3.0]]"
decisive_test: "A1"
created: 2026-06-20
tags: [brief]
---

# PR3 — Favorable-move bindings (`peakFavorableMove` / `valleyFavorableMove`)

> **Self-contained.** You do not need to read the plan to execute this brief.
> Repo conventions — branch/commit/PR format, the pre-PR validation gates, the
> stop-and-report rule, the report shape — live in `AGENTS.md` / `CLAUDE.md` and
> are assumed; this brief carries only what is specific to the batch.
> **Done = the named acceptance tests below pass.** Stop and report if anything
> blocks you; do not work around an unexpected obstacle.

## Mission

Mirror the two new Rust 1.3.0 `chart_trends` functions into the JS/WASM surface:
`peakFavorableMove` and `valleyFavorableMove`, exposed under the `chartTrends`
namespace. Both are fallible (`Result<f64>` in Rust) and wrap through PR 2's
`js_err`, so they throw a JS `Error` on invalid input. Done = both functions are
callable from all three entry points, typed in `index.d.ts`, and the verified
numeric vectors below pass exactly.

## Context

`centaur_technical_indicators` 1.3.0 added two `chart_trends` functions. They
measure the largest favorable price excursion over an inclusive forward window
`[index+1, index+period]`:

- **`peakFavorableMove`** = `prices[index] − min(window)` — largest *downward*
  move from the reference point. **Not floored**: negative if the window never
  drops below `prices[index]`.
- **`valleyFavorableMove`** = `max(window) − prices[index]` — largest *upward*
  move. Not floored: negative if the window never rises.

Both **throw** when: data is empty, `period == 0`, or `index + period >= len`
(the window would run past the end).

The existing `chart_trends.rs` wrappers use `#[wasm_bindgen(js_name =
chart_trends_<camelCase>)]` on snake_case fns. The `chartTrends` namespace is
assembled in all three entry points; on `main` the last property
(`breakDownTrends`) has **no trailing comma in `index.js` or `index.web.js`**,
but **does** in `index.node.js`. Match each file's own comma style when
inserting — re-check the file, don't trust this note blindly.

## Prerequisites (confirm; do not perform here)

- **PR 1 merged**: `Cargo.toml` pins `centaur_technical_indicators = "=1.3.0"`
  (the favorable-move fns ship in 1.3.0). Verify: `rg -n 'centaur_technical_indicators'
  Cargo.toml`.
- **PR 2 merged**: `src/jsutil.rs` exports `pub fn js_err`, and
  `src/chart_trends.rs` already imports/uses it (its existing 6 `.expect()`
  sites were converted). Verify: `rg -n 'js_err' src/chart_trends.rs`. **If
  either is unmet, stop and report.**

## Verify first (re-confirm at session start)

| Claim | How to check | Expected |
|-------|--------------|----------|
| exact Rust fn names + signatures | inspect the pinned crate (`cargo doc --open`, or read its `chart_trends` source) | `peak_favorable_move(prices, index, period) -> Result<f64>` and `valley_favorable_move(...)` (re-confirm exact names) |
| not already bound | `rg -ni 'favorable' src/chart_trends.rs index.*.js index.js index.d.ts` | 0 hits |
| chartTrends namespace shape | `rg -n 'chartTrends' index.js index.node.js index.web.js` | `export const chartTrends = { … }` in each |
| js_err available in module | `rg -n 'js_err' src/chart_trends.rs` | present (from PR 2) |

## Changes (in order)

1. **Rust wrappers — `src/chart_trends.rs`.** Add two scalar wrappers alongside
   the existing ones, returning `Result<f64, JsValue>` via `.map_err(js_err)`.
   Use the exact core fn names confirmed above:

   ```rust
   #[wasm_bindgen(js_name = chart_trends_peakFavorableMove)]
   pub fn chart_trends_peak_favorable_move(
       prices: Vec<f64>, index: usize, period: usize,
   ) -> Result<f64, JsValue> {
       centaur_technical_indicators::chart_trends::peak_favorable_move(&prices, index, period)
           .map_err(js_err)
   }

   #[wasm_bindgen(js_name = chart_trends_valleyFavorableMove)]
   pub fn chart_trends_valley_favorable_move(
       prices: Vec<f64>, index: usize, period: usize,
   ) -> Result<f64, JsValue> {
       centaur_technical_indicators::chart_trends::valley_favorable_move(&prices, index, period)
           .map_err(js_err)
   }
   ```

2. **Entry points — `index.js`, `index.node.js`, `index.web.js`.** Add to the
   `chartTrends` object in each (mind each file's trailing-comma style):
   ```js
   peakFavorableMove: wasm.chart_trends_peakFavorableMove,
   valleyFavorableMove: wasm.chart_trends_valleyFavorableMove,
   ```

3. **Types — `index.d.ts`.** Add both methods to the `ChartTrends` interface
   with JSDoc matching the existing entries, including a
   `@see {@link https://tech.centaurresearchtechnologies.com/indicators/chart-trends/…/}
   Explanation and interactive playground` line in the established pattern.
   Signature: `peakFavorableMove(prices: number[], index: number, period: number): number;`
   (and the valley counterpart). Document the inclusive window, the not-floored
   semantics, and the `@throws` conditions (empty / `period === 0` /
   `index + period >= length`).

4. **Tests — `test/chartTrends.node.test.js`.** Add exact-value cases (and
   `assert.throws` for the error cases):
   ```
   peakFavorableMove([107,104,100,102], 0, 3)        -> 7.0
   valleyFavorableMove([100,102,107,104,100], 0, 3)  -> 7.0
   peakFavorableMove([100,101,102,103], 0, 3)        -> -1.0   (no drop; not floored)
   valleyFavorableMove([105,104,103,102], 0, 3)      -> -1.0   (no rise; not floored)
   valleyFavorableMove([10,1,1,20,99], 0, 3)         -> 10.0   (idx3 captured, idx4 excluded)
   peakFavorableMove([50,99,99,30,1], 0, 3)          -> 20.0   (idx3 captured)
   peakFavorableMove([100,101,102], 1, 3)            -> THROWS (window past end)
   {peak,valley}FavorableMove(prices, 0, 0)          -> THROWS (period 0)
   {peak,valley}FavorableMove([], 0, 3)              -> THROWS (empty)
   ```

5. **Changelog.** One bullet under `## [Unreleased]` → `### Added`: `JS/WASM
   bindings for chart-trend favorable-move functions (peakFavorableMove,
   valleyFavorableMove).`

## Acceptance tests (named; all must pass)

- **A1 (decisive)** — `peakFavorableMove([107,104,100,102], 0, 3)` returns
  exactly `7.0` and `valleyFavorableMove([100,102,107,104,100], 0, 3)` returns
  exactly `7.0`.
- **A2** — the not-floored cases return negatives exactly:
  `peakFavorableMove([100,101,102,103], 0, 3) === -1.0` and
  `valleyFavorableMove([105,104,103,102], 0, 3) === -1.0`.
- **A3** — the window-boundary cases:
  `valleyFavorableMove([10,1,1,20,99], 0, 3) === 10.0`,
  `peakFavorableMove([50,99,99,30,1], 0, 3) === 20.0`.
- **A4** — the three throw cases (window past end, `period === 0`, empty) each
  throw an `Error`.
- **A5 (suite)** — both functions are exported from `index.js`,
  `index.node.js`, `index.web.js`; `index.d.ts` types them; pre-PR gates pass;
  no dependency change.

## Out of scope (do not touch)

- The existing `peaks` / `valleys` / `*Trend` / `breakDownTrends` wrappers
  (add alongside; do not edit their logic).
- `src/jsutil.rs`, `src/lib.rs`, and any other `src/*_indicators.rs` module.
- The `breakDownTrends` config-object redesign (deferred, not this batch).

## Definition of done

- [ ] Acceptance tests A1–A5 green.
- [ ] Both functions exported in **all three** entry points + typed in
      `index.d.ts` (per `AGENTS.md` core requirement).
- [ ] Pre-PR gates green.
- [ ] Changelog entry under `[Unreleased]` → `### Added`.
- [ ] Only `touches` files changed.
- [ ] PR opened against `main`.

## Report (per AGENTS.md)

Summary · Scope · Compatibility (new additive API; no change to existing
functions) · Validation (paste gate output) · Changelog — plus each
acceptance-test name with pass output verbatim (including A1), and anything
flagged (e.g. if the confirmed Rust fn names differ from the assumed ones).
