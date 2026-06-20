# AGENTS.md

Guidance for coding agents working in this repository.

## Scope
This file applies to the entire repository.
This is an open source repository; all contributions should be suitable for public review and distribution.
This file is the self-contained source of truth for this repository's contribution mechanics (branch/commit/PR conventions, gates, scope discipline); it does not depend on any workspace-level file.

## Core contribution requirements
When implementing or modifying WASM bindings or JS/TS wrappers:

1. Export new bindings in **all three** entry points: `index.js` (bundler / ESM `import`), `index.node.js` (CommonJS `require`), and `index.web.js` (browser). `package.json` `exports` maps `import` → `index.js`, `require` → `index.node.js`, `browser` → `index.web.js`.
2. Update `index.d.ts` with accurate TypeScript signatures and JSDoc for any new or changed public APIs (this is the published types surface).
3. Add or adjust tests in `test/` for every user-facing change; tests must use exact numeric comparisons for parity with Rust.
4. Do not introduce deprecated API usage in new examples or tests.
5. Add an entry for every user-facing change in `CHANGELOG.md` under the `## [Unreleased]` heading, following Keep a Changelog (categories: Added, Changed, Deprecated, Removed, Fixed, Security); name the concrete artifact. A CHANGELOG entry is **not** required for changes with no user-facing effect — tests-only, internal/process docs, or formatting-only — note the exception in the PR's Flagged items.

**API shape:** each indicator namespace mirrors two styles — `single.*` (full-window, returns a scalar/tuple) and `bulk.*` (rolling-window, returns arrays). See `CONTRIBUTING.md` for the namespace list.

**Error model:** validation failures surface as thrown JS exceptions (Rust panics propagated by wasm-bindgen), mirroring the core library's validations (length mismatches, empty arrays, period bounds). NaN-vs-throw and empty-return semantics are part of the contract and are locked by regression tests (e.g. all-NaN `chartTrends.peaks`/`valleys` returns `[]` rather than throwing) — preserve them.

## Change scope discipline
- Keep changes minimal and focused on the requested task.
- Do not include opportunistic refactors unless explicitly requested.
- If you identify unrelated issues, note them separately instead of bundling them into the same change.
- Preserve existing file organization and naming conventions unless the task requires a structural change.
- Do not hand-edit generated output: `dist/**` is wasm-pack output (built by `npm run build`) and is `.gitignore`d — never edit it by hand or commit it.
- Do not reformat unrelated code; no global/repo-wide reformat outside an explicit formatting task.
- Lockfiles: neither `Cargo.lock` nor `package-lock.json` is git-tracked here (both exist on disk but are untracked and are **not** in `.gitignore`). Do not `git add` them, `dist/`, or other generated artifacts — stage only the files the task names (a blanket `git add -A` could newly introduce the untracked lockfiles).

## Backward compatibility rules
When changing public APIs, preserve compatibility unless the task explicitly allows a breaking change:

1. Do not silently change indicator semantics, output ordering, or warmup behavior.
2. Do not remove or rename public functions, types, or enums without explicit approval.
3. If behavior changes are required, document them in `index.d.ts` JSDoc and `CHANGELOG.md` with clear migration notes.

## Branch naming
- Never commit directly to `main`; branch first. PRs target `main`.
- Stacked-PR branches use `pr/<n>-<slug>`, where `<n>` is the PR number and `<slug>` is a short kebab-case description (e.g. `pr/7-cjs-export`, `pr/2-chart-trends-errors`); letter-suffixed sub-PRs are allowed (e.g. `pr/6b-doc-consolidation`).
- Before a PR number exists, branch with a descriptive `<type>/<slug>` (conventional-commit type: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`, `ci`), e.g. `docs/agents-alignment`; rename to `pr/<n>-<slug>` once the PR is opened if adopting the stacked scheme.
- Reserved prefixes: `release/<x.y.z>` for release branches, `docs/<slug>` for docs/archive-only branches.
- Legacy `copilot/*` and dash-form `release-x.y.z` branches predate this scheme — do not extend them.

## Commit messages
- Use conventional-commit prefixes: `fix:`, `feat:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:` (scopes allowed, e.g. `feat(chart_trends):`; `style:` / `ci:` where apt). Keep the subject under 72 characters; reference PR/issue numbers where applicable.
- End every commit authored with Claude Code with this trailer on its own final line:
  ```text
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  ```
  Existing lowercase `Co-authored-by:` lines for human or bot co-authors are unaffected.

## Pre-PR quality gates (must pass)
Run these locally before opening a PR. Only `npm run build` and `node --test` are CI-enforced (via `npm test`); `cargo fmt` and `cargo clippy` are local/honor-system here.

1. `cargo fmt --check` — no Rust formatting diffs.
2. `cargo clippy --all-targets --all-features -- -D warnings` — zero Rust warnings/errors.
3. `npm run build` — builds all three WASM targets. Expands to `build:web && build:node && build:bundler`, each running `wasm-pack build --release --target {web,nodejs,bundler} --out-dir dist/{web,node,bundler} --out-name centaur-technical-indicators` then `rm -f dist/<target>/.gitignore`. Keep `--out-name centaur-technical-indicators` consistent and preserve the post-build `.gitignore` cleanup (load-bearing for packaging). CI runs the three `wasm-pack` commands directly, without that cleanup step.
4. `node --test` — all JS tests pass (auto-discovers `test/**/*.test.js`). `npm test` runs `npm run build && node --test`.

## When to stop and report
Stop and report rather than guess or work around an obstacle when:
- the task is ambiguous, contradictory, or underspecified;
- completing it would require a forbidden or breaking change (public API, semantics, output ordering, warmup behavior) without explicit approval;
- a required pre-PR gate cannot be run, or fails for reasons outside your change.

Surface the blocker; do not invent a way past it.

## Worktrees and isolation
- Do one task per branch (use a `git worktree` for parallel work); never operate directly on `main`.
- Keep concurrent tasks file-disjoint so parallel runs don't collide.

## Docs to review before coding
- `CONTRIBUTING.md`
- `CLAUDE.md`

## PR expectations for agents
- Keep PRs focused and minimal.
- Summarize what the agent changed and what was manually verified.
- Include command output for the required quality gates.
- Explicitly note the `CHANGELOG.md` entry added or updated.

### Required PR summary format
Use this structure in PR descriptions/comments:

1. `Summary`: what changed and why.
2. `Scope`: files/modules touched and what was intentionally left untouched.
3. `Compatibility`: any user-facing behavior/API/TypeScript-definition (`index.d.ts`) impact, with migration notes if applicable.
4. `Validation`: paste the verbatim output of each pre-PR gate — `cargo fmt --check`, `cargo clippy --all-targets --all-features -- -D warnings`, `npm run build`, and `node --test`.
5. `Changelog`: the exact `CHANGELOG.md` entry added/updated (or note why exempt).
6. `Flagged items`: anything unresolved, intentionally skipped, or deviating from these conventions (including any blocked gate). Write "None" if there are none.
