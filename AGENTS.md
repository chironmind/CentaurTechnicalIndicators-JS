# AGENTS.md

Guidance for coding agents working in this repository.

## Scope
This file applies to the entire repository.
This is an open source repository; all contributions should be suitable for public review and distribution.

## Core contribution requirements
When implementing or modifying WASM bindings or JS/TS wrappers:

1. Export new bindings in **all three** entry points: `index.node.js`, `index.js`, and `index.web.js`.
2. Update `index.d.ts` with accurate TypeScript signatures and JSDoc for any new or changed public APIs.
3. Add or adjust tests in `test/` for every user-facing change; tests must use exact numeric comparisons for parity with Rust.
4. Do not introduce deprecated API usage in new examples or tests.
5. Add an entry for every user-facing change in `CHANGELOG.md`.

## Change scope discipline
- Keep changes minimal and focused on the requested task.
- Do not include opportunistic refactors unless explicitly requested.
- If you identify unrelated issues, note them separately instead of bundling them into the same change.
- Preserve existing file organization and naming conventions unless the task requires a structural change.

## Backward compatibility rules
When changing public APIs, preserve compatibility unless the task explicitly allows a breaking change:

1. Do not silently change indicator semantics, output ordering, or warmup behavior.
2. Do not remove or rename public functions, types, or enums without explicit approval.
3. If behavior changes are required, document them in `index.d.ts` JSDoc and `CHANGELOG.md` with clear migration notes.

## Pre-PR quality gates (must pass)
Run these before opening a PR:

1. `cargo fmt --check` (no Rust formatting diffs)
2. `cargo clippy` (no Rust warnings/errors)
3. `npm run build` (all three WASM targets build successfully)
4. `node --test` (all JS tests pass)

## Docs to review before coding
- `docs/AI_ONBOARDING.md`
- `.github/copilot-instructions.md`
- `AI_FRIENDLY_ROADMAP.md`
- `docs/REPO_MAP.md`
- `CONTRIBUTING.md`

## PR expectations for agents
- Keep PRs focused and minimal.
- Summarize what the agent changed and what was manually verified.
- Include command output summary for the required quality gates.
- Explicitly note the `CHANGELOG.md` entry added or updated.

### Required PR summary format
Use this structure in PR descriptions/comments:

1. `Summary`: what changed and why.
2. `Scope`: files/modules touched and what was intentionally not changed.
3. `Compatibility`: any user-facing behavior/API/TypeScript-definition impact.
4. `Validation`: results summary for `fmt`, `clippy`, `build`, and `test`.
5. `Changelog`: exact `CHANGELOG.md` entry added/updated.
