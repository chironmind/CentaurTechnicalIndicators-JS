---
type: brief
id: "PR9"
title: "Binding registry + cross-entry-point drift test"
status: ready
effort: high
wave: C
depends_on: ["PR3", "PR7"]
touches:
  - docs/binding_registry.json
  - test/bindingRegistry.node.test.js
  - CHANGELOG.md
forbidden:
  - "index.js / index.node.js / index.web.js / index.node.cjs / index.d.ts (the registry MIRRORS these — do not edit them to fit the registry)"
  - "src/*.rs (no binding changes)"
branch: "pr/9-binding-registry"
pr_target: "main"
related:
  - "[[RELEASE_1.3.0]]"
decisive_test: "A1"
created: 2026-06-20
tags: [brief]
---

# PR9 — Binding registry + cross-entry-point drift test

> **Self-contained.** You do not need to read the plan to execute this brief.
> Repo conventions — branch/commit/PR format, the pre-PR validation gates, the
> stop-and-report rule, the report shape — live in `AGENTS.md` / `CLAUDE.md` and
> are assumed; this brief carries only what is specific to the batch.
> **Done = the named acceptance tests below pass.** Stop and report if anything
> blocks you; do not work around an unexpected obstacle.

## Mission

Add a machine-readable `docs/binding_registry.json` describing the public JS
surface (every namespace → its function list + deprecation status for 1.3.0),
**and** a Node test that fails when any entry point or the type definitions
drift from that registry. The **drift test is the real deliverable** — the JSON
alone is just one more file that can rot. Done = the test passes against the
current surface and provably fails on a contrived mismatch.

## Context

The class of bug this catches is the `standardIndicators` mismatch — a namespace
documented/exported inconsistently across entry points. The library exposes the
**same** namespace API through five surfaces that are hand-maintained
independently:

- `index.js` (bundler), `index.node.js` (node ESM), `index.web.js` (web) —
  each builds `export const <namespace> = { … }`.
- `index.node.cjs` (CommonJS, added by PR 7) — re-exports the namespaces.
- `index.d.ts` — the TypeScript interface per namespace.

Nothing today asserts these five agree. PR 9 encodes the expected surface once
(the registry) and checks all five against it.

## Prerequisites (confirm; do not perform here)

- **PR 3 merged**: `peakFavorableMove` / `valleyFavorableMove` are in the
  `chartTrends` namespace (the registry must include them). Verify:
  `rg -n 'peakFavorableMove' index.node.js`.
- **PR 7 merged**: `index.node.cjs` exists (the fifth surface the test reads).
  Verify: `ls index.node.cjs`.
- **`standardIndicators` removed** (PR 6, docs hygiene): the registry must not
  list a `standardIndicators` namespace (it does not exist). PR 6 is docs-only —
  **not a hard code dependency** of this brief (hence it is not in `depends_on`)
  — but confirm the surface is clean:
  `rg -n 'standardIndicators' index.js index.node.js index.web.js index.node.cjs index.d.ts`
  → 0 hits. If a stray reference exists, ensure the registry still omits it and
  flag the stray in the report.
- **If PR 3 or PR 7 is unmet, stop and report** — the registry would mirror an
  incomplete surface.

## Verify first (re-confirm at session start)

| Claim | How to check | Expected |
|-------|--------------|----------|
| registry/test absent | `ls docs/binding_registry.json test/bindingRegistry.node.test.js` | neither exists yet |
| five surfaces present | `ls index.js index.node.js index.web.js index.node.cjs index.d.ts` | all exist |
| favorable-move in surface | `rg -n 'favorableMove' index.node.js index.d.ts` | present (PR 3) |
| no phantom namespace | `rg -n 'standardIndicators' index.js index.node.js index.web.js index.node.cjs index.d.ts` | 0 hits |

## Changes (in order)

1. **Inventory the real surface (do not guess).** For each entry point, extract
   the namespace → key list from the `export const <ns> = { … }` blocks; for
   `index.node.cjs`, from its re-export shape; for `index.d.ts`, from each
   `export interface <Ns>` method list. The registry must reflect **what is
   actually exported**, not what "should" exist.
   - **Mind the nesting.** Most indicator namespaces are nested under `single` /
     `bulk` (e.g. `momentumIndicators.single.relativeStrengthIndex`,
     `momentumIndicators.bulk.*`), while `chartTrends` (and similar) are **flat**
     (`chartTrends.peaks`). The registry must capture this structure, and the
     drift test must compare **leaf** function names — not treat `single` /
     `bulk` as if they were the function set.
2. **`docs/binding_registry.json`.** Author the registry, encoding the
   flat-vs-nested shape explicitly (e.g. a `"shape"` discriminator, or
   `single` / `bulk` sub-objects) so the test can traverse it unambiguously:
   ```json
   {
     "version": "1.3.0",
     "namespaces": {
       "chartTrends": {
         "shape": "flat",
         "functions": ["peaks", "valleys", "peakTrend", "valleyTrend",
                       "overallTrend", "breakDownTrends",
                       "peakFavorableMove", "valleyFavorableMove"],
         "deprecated": []
       },
       "momentumIndicators": {
         "shape": "single-bulk",
         "single": ["relativeStrengthIndex", "stochasticOscillator", "..."],
         "bulk":   ["relativeStrengthIndex", "stochasticOscillator", "..."],
         "deprecated": ["slowStochastic", "slowestStochastic", "signalLine"]
       }
       /* … every namespace: candleIndicators, trendIndicators,
          strengthIndicators, volatilityIndicators, correlationIndicators,
          otherIndicators, movingAverage, … each tagged flat or single-bulk,
          with deprecated leaf functions listed (e.g. volatilitySystem). */
     }
   }
   ```
   Record deprecation status per function (the `@deprecated` JSDoc set in
   `index.d.ts` is the source of truth for that flag).
3. **`test/bindingRegistry.node.test.js`.** The drift test:
   - Load `docs/binding_registry.json`.
   - For each of `index.js`, `index.node.js`, `index.web.js`, `index.node.cjs`:
     import (or, for `.cjs`, `require` via `createRequire`) and assert each
     namespace's **leaf** function set equals the registry — for `flat`
     namespaces compare the namespace's own keys; for `single-bulk` namespaces
     compare `ns.single` keys and `ns.bulk` keys against the registry's `single`
     / `bulk` lists. Use set equality and report the symmetric difference on
     failure.
   - For `index.d.ts`: parse each `export interface <Ns> { … }` and assert its
     method names equal the registry set. (A lightweight regex/line parse over
     the interface block is sufficient; do not pull in the full TS compiler.)
   - Initialize the wasm modules where required before reading namespace objects.
4. **Changelog.** One bullet under `## [Unreleased]` → `### Added`: a binding
   registry (`docs/binding_registry.json`) plus a drift test asserting the
   namespace surface matches across all entry points and the type definitions.

## Acceptance tests (named; all must pass)

- **A1 (decisive)** — `test/bindingRegistry.node.test.js` passes: for every
  namespace, the function set in each of the four JS entry points and in
  `index.d.ts` equals the registry's list (no missing, no extra).
- **A2 (test the test)** — temporarily adding a bogus function to the registry
  (or removing one) makes the drift test fail with a clear symmetric-difference
  message; revert the temporary change before committing.
- **A3** — the registry includes the PR 3 favorable-move functions and lists
  **no** `standardIndicators` namespace.
- **A4 (suite)** — pre-PR gates pass; no dependency change.

## Out of scope (do not touch)

- Editing any entry point or `index.d.ts` to make them match the registry — the
  registry mirrors them. **If A1 surfaces a genuine cross-entry mismatch (a real
  drift bug), stop and report it** rather than silently patching; that is a
  separate fix.
- `src/*.rs` and the enum mirrors. (Enum-variant parity is a different test, not
  part of this brief.)

## Definition of done

- [ ] Acceptance tests A1–A4 green (including the test-the-test red/green cycle).
- [ ] Pre-PR gates green.
- [ ] Changelog entry under `[Unreleased]` → `### Added`.
- [ ] Only `touches` files changed; no entry point/`.d.ts`/`src` edits.
- [ ] PR opened against `main`.

## Report (per AGENTS.md)

Summary · Scope · Compatibility (developer-facing test only; no API change) ·
Validation (paste gate output + the drift-test pass line + the test-the-test
demonstration) · Changelog — plus each acceptance-test name with pass output
verbatim (including A1), and anything flagged (especially any real drift the
test surfaced).
