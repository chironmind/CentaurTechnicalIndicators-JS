# PR 1 — Rust dependency bump (implementation brief)

Self-contained brief for the **PR 1** session. It expands the PR 1 section of
`RELEASE_1.3.0.md` (they agree). Working doc — disposable once PR 1 merges.

**Baseline:** `main` (the integration point is `release/1.3.0`, branched off
`main`). `main` declares dep `1.2.2` but currently *resolves* to 1.3.0 (see the
decision box below).

---

## Goal

Move the binding onto Rust `centaur_technical_indicators` **1.3.0** and confirm a
green build/test baseline **before** any of our own changes layer on. This
isolates "did the dep bump alone break parity" as its own checkpoint. Nothing
else ships in this PR.

---

## Why an exact pin (decided)

`Cargo.toml` has `centaur_technical_indicators = "1.2.2"` — a **caret** range
(`>=1.2.2, <2.0.0`). With no committed `Cargo.lock`, cargo resolves to the
*highest* available 1.x: today that is 1.3.0 (the local index stops there), but
with a refreshed index it would float to 1.4.x. This binding is a hand-written
mirror of core **1.3.0 specifically**, and every vector in the plan is verified
against 1.3.0 — so the dep is pinned **exactly** (`= "1.3.0"`), decided by the
maintainer. Use the exact pin in step 3; do not leave a floating caret.

---

## 1. Branch / worktree

```
git switch -c release/1.3.0 main          # integration branch (skip if it exists)
git switch -c pr/1-dep-bump release/1.3.0
```
(Or use a worktree — see `RELEASE_1.3.0.md` › "Parallelization".)

## 2. Toolchain prerequisites

- `rustup target add wasm32-unknown-unknown`
- `wasm-pack` **v0.13.1** (match CI). Fastest: download the pinned release
  tarball; or `cargo install wasm-pack --version 0.13.1 --locked`.
- Node ≥ 20 (repo `engines`); `npm ci || npm install` for devDeps.

## 3. Changes — exactly two files

1. **`Cargo.toml`** (the `[dependencies]` line, ~line 16):
   `centaur_technical_indicators = "1.2.2"` → `centaur_technical_indicators = "=1.3.0"`
   **Do NOT** touch `[package] version` (line 3) — that is the Final PR's job.

2. **`CHANGELOG.md`** — under the existing empty `## [Unreleased]`, add:

   ```
   ### Changed
   - Updated `centaur_technical_indicators` from 1.2.2 to 1.3.0.
     - **Behavior change (upstream bug fix), documented per AGENTS.md:** 1.3.0
       fixes `chart_trends::peaks` / `valleys` output on the index-0 and
       retained-extremum cases (`last_*_idx` sentinel-0 → `Option<usize>`).
       `chartTrends.peaks` / `chartTrends.valleys` now return the corrected
       series on those inputs — e.g. `chartTrends.peaks([110,109,108,107], 2, 1)`
       is `[[110,0]]` (was `[[110,0],[109,1]]` under 1.2.x). The existing parity
       suite is unaffected (none of its inputs hit those cases).
     - 1.3.0 also hardens the single `aroonUp` / `aroonDown` /
       `stochasticOscillator` functions to return `NaN` instead of panicking on
       all-NaN input.
   ```

## 4. Validate — all must pass

```
cargo fmt --all -- --check     # no formatting diffs
cargo clippy                   # PLAIN clippy — warnings OK; do NOT use -D warnings (that is PR 8)
npm run build                  # builds all three wasm targets (web / node / bundler)
npm run test:only              # node --test on test/*.node.test.js   (npm test = build + test:only)
```

Expected: **all green**, full existing parity suite passing unchanged.
Confirm the resolved version: `cargo tree -i centaur_technical_indicators`
should show `v1.3.0`.

### If something fails
- **A `chartTrends.peaks` / `valleys` parity test shifts:** check it against the
  index-0 / retained-extremum fix above *before* treating it as a regression — a
  shift there is expected upstream 1.3.0 behavior. (For the six current inputs in
  `test/chartTrends.node.test.js`, nothing should shift; if one does, re-confirm
  the input rather than editing the expected value.)
- **Any other failure:** STOP and report. Do not edit expected values to force
  green.

## 5. Scope discipline

Touch only `Cargo.toml` + `CHANGELOG.md`.
**Out of scope:** no `[package].version` bump (Final PR); no new bindings
(favorable-move is PR 3); no error-handling refactor (PR 2 / 5a–5h); no doc
cleanup (PR 6 / 6b); no clippy/CI changes (PR 8). Note any unrelated issues
separately; do not bundle.

## 6. PR report (per `AGENTS.md`)

- **Summary** — bumped core dep to 1.3.0; green-baseline checkpoint before the
  rest of the release.
- **Scope** — `Cargo.toml` dep line + `CHANGELOG.md`; nothing else.
- **Compatibility** — no JS API change; one upstream behavior change in
  `chartTrends.peaks`/`valleys` on index-0/retained-extremum inputs (documented
  in CHANGELOG); all other success outputs unchanged.
- **Validation** — paste the fmt / clippy / build / test results.
- **Changelog** — the `### Changed` entry above.

## Definition of done
- [ ] `cargo tree -i centaur_technical_indicators` → `v1.3.0`.
- [ ] fmt / clippy (plain) / build / test all green.
- [ ] `CHANGELOG.md` `[Unreleased]` has the Changed entry + migration note.
- [ ] PR opened against `release/1.3.0`; only `Cargo.toml` + `CHANGELOG.md` touched.
