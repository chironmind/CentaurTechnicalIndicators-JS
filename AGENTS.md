# AGENTS.md

Guidance for coding agents working in this repository. **This file is
self-contained** — everything needed to work here lives in this repo (this file,
`CLAUDE.md`, `CONTRIBUTING.md`, and the README); it depends on no external or
workspace-level file.

## Scope

Applies to the entire repository. This is a public, open-source package — wasm-pack
bindings (published to npm) over the `centaur_technical_indicators` Rust core crate;
all contributions must be suitable for public review and distribution.

## How work arrives

**If your task is a slice brief**, it is self-contained — read it and do exactly
that. You don't need to read the implementation plan or any project spec to execute
it; everything required is in the brief. If you hit a real gap, **stop and ask** —
you'll be pointed at the specific file, never told to read a whole plan. Not every
task is a brief; for ad-hoc work, follow the standing rules below. (Reviewers are
the exception — a plan or PR review legitimately reads the plan and spec.)

## Core contribution requirements

When implementing or modifying WASM bindings or JS/TS wrappers:

1. Export new bindings in **all three** entry points: `index.js` (bundler / ESM
   `import`), `index.node.js` (CommonJS `require`), and `index.web.js` (browser).
2. Update `index.d.ts` with accurate TypeScript signatures and JSDoc for any new or
   changed public API (this is the published types surface).
3. Add or adjust tests in `test/` for every user-facing change; tests use **exact
   numeric comparisons** for parity with Rust.
4. No deprecated API usage in new examples or tests.
5. Add a `CHANGELOG.md` entry for every user-facing change (see Changelog coupling).

**API shape:** each indicator namespace mirrors two styles — `single.*` (full-window)
and `bulk.*` (rolling-window). **Error model:** validation failures surface as thrown
JS exceptions (Rust panics propagated by wasm-bindgen); the NaN-vs-throw and
empty-return semantics (e.g. all-NaN `chartTrends.peaks`/`valleys` returns `[]`) are
locked by regression tests — preserve them.

## Downstream & cross-repo impact

This is a binding over the published `centaur_technical_indicators` core crate — the
core is the source of truth for indicator behavior; mirror its API. Changes here are
user-facing on npm (including the `index.d.ts` types surface) — document them. Don't
make cross-repo or architectural decisions from inside this repo; surface them to the
maintainer.

## Change-scope discipline

- Smallest safe diff that solves the task; keep it focused.
- No opportunistic refactors or "while I was here" changes — note unrelated issues
  separately, don't bundle them.
- Preserve existing file organization and naming unless the task requires a structural change.
- **Stage only the files your task names; never `git add .` / `git add -A`** —
  `dist/**` is wasm-pack output (built by `npm run build`, `.gitignore`d; never edit
  or commit by hand), and neither `Cargo.lock` nor `package-lock.json` is tracked
  (both exist on disk but untracked). The committed decision trail under
  `docs/dev/releases/<version>/` (PR briefs in `briefs/`, `version-cut.md`, any
  `RESUME.md`) is intentional — commit those when your task creates or updates them.
- Never hand-edit a generated artifact or a test expectation to make a gate pass. A
  test value that needs changing is a signal to **stop and report**.

## Backward compatibility

Published public APIs — treat them as a contract:

1. Do not silently change indicator semantics, output ordering, or warmup behavior.
2. Do not remove or rename public functions, types, or enums without explicit approval.
3. If a behavior change is required, document it in `index.d.ts` JSDoc and `CHANGELOG.md` with migration notes.

## Pre-PR quality gates (must pass)

Run these before opening a PR; paste the output into the report's Validation section.
Only `npm run build` and `node --test` are CI-enforced (via `npm test`); `cargo fmt`
and `cargo clippy` are local/honor-system here:

1. `cargo fmt --check` — no Rust formatting diffs.
2. `cargo clippy --all-targets --all-features -- -D warnings` — zero Rust warnings/errors.
3. `npm run build` — builds all three WASM targets (web / node / bundler).
4. `node --test` — all JS tests pass (`npm test` runs build then `node --test`).

## Branch & commit conventions

- Never commit directly to `main`; branch first. PRs target `main`.
- Stacked-PR branches use `pr/<n>-<slug>` (e.g. `pr/7-cjs-export`); letter-suffixed
  sub-PRs are allowed (`pr/6b-doc-consolidation`). Before a PR number exists, branch
  `<type>/<slug>` (conventional-commit type) and rename once the PR is opened.
  `release/<x.y.z>` for release branches.
- Commit subjects use a conventional-commit prefix, under 72 characters; reference
  PR/issue numbers where applicable.
- End every agent-authored commit with:

      Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

## Stop-and-report

**Never guess or assume.** If information is missing, the task is ambiguous, or two
implementations are plausible, **stop and ask for input** before proceeding — don't
pick one and run. Beyond that, stop and report — never work around, paper over, or
invent a way past — when:

- a pre-PR gate fails for a reason outside your change, or a test expectation shifts
  in a way you can't explain;
- completing the task would require a forbidden or breaking change (public API,
  semantics, output ordering, warmup) without explicit approval;
- the brief or instructions conflict with the repo's actual state.

Surface the blocker; do not invent a way past it.

## Worktree & isolation

For parallel or batched work: one task per git worktree (never operate directly on
`main`); keep concurrent tasks file-disjoint so parallel runs don't collide; when two
touch the same files, rebase the later on its predecessor before merging.

## Changelog coupling

Every user-facing change adds a bullet under the existing `## [Unreleased]` heading in
`CHANGELOG.md` (Keep a Changelog categories: Added / Changed / Deprecated / Removed /
Fixed / Security); name the concrete artifact. Don't add a second `[Unreleased]`
heading. Formatting-only or non-user-facing changes (incl. docs like this file) are
exempt — note the exception in the PR.

## CI policy

Keep CI dependency-light: prefer native cargo/npm commands; no third-party GitHub
Actions for toolchain setup or caching without explicit approval.

## PR / completion report

Use this structure:

1. **Summary** — what changed and why.
2. **Scope** — files/modules touched, and what was deliberately left untouched.
3. **Compatibility** — user-facing behavior/API/TypeScript-definition (`index.d.ts`) impact, or "N/A".
4. **Validation** — pasted output of the four pre-PR gates.
5. **Changelog** — the exact `CHANGELOG.md` entry added/updated (or "exempt — non-user-facing").
6. **Benchmarks** — affected suites + regression/improvement summary, or "N/A".

Plus, required: each named acceptance test with its pass output verbatim (incl. the
decisive test), and anything flagged — out-of-scope issues noticed, concerns,
blockers. Justify any deviation from the brief here.
