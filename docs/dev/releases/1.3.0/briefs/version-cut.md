---
type: brief
id: "version-cut"
title: "1.3.0 version cut + changelog finalization + tag"
status: ready
effort: low
wave: D
depends_on: ["PR1", "PR2", "PR3", "PR5a", "PR5b", "PR5c", "PR5d", "PR5e", "PR5f", "PR5g", "PR5h", "PR7", "PR9"]
touches:
  - package.json
  - Cargo.toml
  - CHANGELOG.md
forbidden:
  - "src/*.rs and index.* / index.d.ts (no behavioral or API change — release mechanics only)"
  - "README.md (the @1.2.2 prose/commented refs are optional cosmetics, not part of the sweep)"
branch: "chore/version-cut-1.3.0"
pr_target: "main"
related:
  - "[[RELEASE_1.3.0]]"
decisive_test: "A1"
created: 2026-06-20
tags: [brief]
---

# version-cut — 1.3.0 version cut + changelog finalization + tag

> **Self-contained.** You do not need to read the plan to execute this brief.
> Repo conventions — branch/commit/PR format, the pre-PR validation gates, the
> stop-and-report rule, the report shape — live in `AGENTS.md` / `CLAUDE.md` and
> are assumed; this brief carries only what is specific to the batch.
> **Done = the named acceptance tests below pass.** Stop and report if anything
> blocks you; do not work around an unexpected obstacle.

## Mission

Cut the 1.3.0 release: bump the package and crate versions, close the changelog
`[Unreleased]` section into `[1.3.0]`, reopen an empty `[Unreleased]`, and
prepare the `v1.3.0` tag. **Release mechanics only — no behavioral or API
changes.** Done = the package reports `1.3.0`, the changelog is finalized, the
published file set is correct, and the tag is ready to push (tagging/publishing
gated on explicit human approval).

## Context

The repo is **trunk-based**: `main` is the trunk, PRs merge straight into it,
and the release is a version-cut commit + tag on `main` (the old
`release/1.3.0` integration branch and "Final PR" ceremony were dropped). This
brief is that version-cut step.

**Tagging gate.** 1.3.0 cannot be cut until the package is out of its mixed
error-handling state — i.e. **every** error-handling PR has merged (PR 2 +
PR 5a–5h). Between those, some modules throw clean errors and others still
panic; tagging mid-way would ship that inconsistency. PR 3 (favorable-move) and
PR 9 (registry) must also be in. The version sweep is intentionally tiny:
**`package.json` and `Cargo.toml` only.**

`publish.yml` triggers on `v*.*.*` tag pushes and publishes to npm. **Pushing
the tag therefore publishes** — treat tag/publish as a separate, explicitly
approved step, never automatic (per workspace `CLAUDE.md`).

## Prerequisites (confirm; do not perform here)

- **All error-handling PRs merged**: no `.expect(` remains in the converted
  wrappers and `js_err` is used across modules. Verify:
  `rg -c '\.expect\(' src/*.rs` is ~0 in the wrapper modules (or only
  intentional infallible/invariant sites), and `rg -l 'map_err(js_err)' src/`
  lists chart_trends + the eight 5x modules.
- **PR 3 merged**: `rg -n 'favorableMove' index.node.js` present.
- **PR 9 merged**: `ls docs/binding_registry.json test/bindingRegistry.node.test.js`.
- **PR 7 merged**: `ls index.node.cjs` (must appear in the published file set).
- **If any are unmet, stop and report** — do not cut a partial release.

## Verify first (re-confirm at session start)

| Claim | How to check | Expected |
|-------|--------------|----------|
| current package version | `node -p "require('./package.json').version"` | `1.2.2` |
| current crate version | `rg -n '^version' Cargo.toml` | `1.2.2` |
| changelog has populated `[Unreleased]` | `rg -n '## \[Unreleased\]' CHANGELOG.md` | present, with entries from the release PRs |
| green baseline | run pre-PR gates | all pass |

## Changes (in order)

1. **`package.json`.** `"version": "1.2.2"` → `"1.3.0"` (the `version` key,
   ~line 3).
2. **`Cargo.toml`.** `[package].version` `1.2.2` → `1.3.0` (~line 3). **Do not**
   touch the `[dependencies] centaur_technical_indicators = "=1.3.0"` pin.
3. **`CHANGELOG.md`.** Rename the `## [Unreleased]` heading to
   `## [1.3.0] - 2026-06-20` (use the actual release date if different), keeping
   all accumulated entries beneath it. Insert a fresh empty `## [Unreleased]`
   section **above** it (matching the existing Keep-a-Changelog structure).
4. **(Do NOT in this PR)** — push the tag. After merge, the tag step is:
   `git tag v1.3.0 && git push origin v1.3.0` — **run only with explicit human
   approval**, since it triggers `publish.yml` → npm publish.

## Acceptance tests (named; all must pass)

- **A1 (decisive)** — after the edits: `node -p "require('./package.json').version"`
  prints `1.3.0`; `Cargo.toml` `[package].version` is `1.3.0`; `CHANGELOG.md`'s
  top released section is `## [1.3.0] - <date>` with an empty `## [Unreleased]`
  reopened above it.
- **A2** — `npm pack --dry-run` lists `index.node.cjs` and the expected
  published file set, and reports version `1.3.0`.
- **A3 (suite)** — pre-PR gates pass (`cargo fmt --check` · `cargo clippy` ·
  `npm run build` · `node --test`); no source/API change in the diff
  (only `package.json`, `Cargo.toml`, `CHANGELOG.md`).

## Out of scope (do not touch)

- Any `src/*.rs`, `index.*`, or `index.d.ts` — release mechanics only.
- README version strings (`@1.2.2` prose comment + commented-out import) — these
  are optional cosmetics, not part of the version sweep. Note them; do not bundle.
- Pushing the tag / publishing — gated, separate, human-approved step.

## Definition of done

- [ ] Acceptance tests A1–A3 green.
- [ ] Pre-PR gates green.
- [ ] `CHANGELOG.md` shows `[1.3.0] - <date>` + an empty `[Unreleased]`.
- [ ] Diff limited to `package.json`, `Cargo.toml`, `CHANGELOG.md`.
- [ ] PR opened against `main`. Tag/publish deferred to an approved step.

## Report (per AGENTS.md)

Summary · Scope · Compatibility (release mechanics only; no behavior change) ·
Validation (paste gate output + `npm pack --dry-run` file list) · Changelog
(the `[1.3.0]` finalization) — plus each acceptance-test name with pass output
verbatim (including A1), and an explicit reminder that the `v1.3.0` tag push is
pending human approval.
