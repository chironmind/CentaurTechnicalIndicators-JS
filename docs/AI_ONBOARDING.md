# AI Onboarding

Start here when an AI agent begins work in `CentaurTechnicalIndicators-JS`.

## Goal

Provide one deterministic startup flow so agents can orient quickly, avoid policy misses, and make minimal, safe changes without altering public APIs unintentionally.

## Startup Flow (in order)

1. Read repository rules:
   - `AGENTS.md`
   - `.github/copilot-instructions.md`
   - `CONTRIBUTING.md`
2. Read project orientation:
   - `docs/REPO_MAP.md`
   - `AI_FRIENDLY_ROADMAP.md`
3. Use machine-readable policy sources:
   - `ai-policy.yaml` (machine-readable contribution policy)
4. Confirm affected modules in `src/` and keep scope focused.

## Non-Negotiable Rules

- Export new bindings in **all three** entry points: `index.node.js`, `index.js`, `index.web.js`.
- Keep TypeScript signatures and JSDoc in `index.d.ts` accurate and complete.
- Keep public API behavior stable unless explicitly asked to introduce a breaking change.
- Add/adjust tests in `test/` for every user-facing change using exact numeric comparisons.
- Add a `CHANGELOG.md` entry for each user-facing change.

## Agent-Friendly Change Strategy

1. Identify the smallest `src/*.rs` file or JS entry point that can satisfy the task.
2. Prefer additive or internal-only edits over broad refactors.
3. If changing output semantics, update tests and document compatibility impact.
4. If touching public APIs, include clear compatibility notes in the PR.
5. Always run the full build before testing (`npm run build` before `node --test`).

## Required Local Validation Gates

Run from repository root:

```bash
cargo fmt --check
cargo clippy
npm run build
node --test
```

## PR/Report Output Format

Use this structure:

1. `Summary`
2. `Scope`
3. `Compatibility`
4. `Validation`
5. `Changelog`

## Quick Pointers

- Rust WASM binding sources: `src/`
- Central enum/module exports: `src/lib.rs`
- JS entry point (bundler/ESM): `index.js`
- JS entry point (Node.js): `index.node.js`
- JS entry point (web/ESM): `index.web.js`
- TypeScript definitions: `index.d.ts`
- Tests: `test/`
- Build outputs (gitignored): `dist/`
