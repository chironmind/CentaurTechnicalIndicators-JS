---
type: brief
id: "release-1.3.1"
title: "Release 1.3.1 — first npm publish since 1.2.1 (Trusted Publishing) + post-1.3.0 hygiene"
status: ready
effort: medium
depends_on: []
touches:
  - .github/workflows/publish.yml
  - package.json
  - Cargo.toml
  - CHANGELOG.md
  - README.md
  - docs/dev/NEXT_RELEASE.md
forbidden:
  - "src/*.rs and index.* / index.d.ts (no behavioral or API change — release + CI only)"
  - "the v1.3.0 git tag (leave it; 1.3.1 rolls forward, does not re-tag 1.3.0)"
branch: "(multiple — one focused PR per change; see Changes)"
pr_target: "main"
related:
  - "[[RELEASE_1.3.0]]"
  - "[[NEXT_RELEASE]]"
decisive_test: "A1"
created: 2026-06-21
tags: [brief, release]
---

# release-1.3.1 — Release 1.3.1: first npm publish since 1.2.1 (Trusted Publishing) + post-1.3.0 hygiene

> **Self-contained.** Repo conventions — branch/commit/PR format, the pre-PR
> validation gates, the stop-and-report rule, the report shape — live in
> `AGENTS.md` / `CLAUDE.md` and are assumed; this brief carries only what is
> specific to this release. **Done = the named acceptance tests below pass.** Stop
> and report if anything blocks you; do not work around an unexpected obstacle.

## Mission

Ship **`centaur-technical-indicators@1.3.1`** to npm — the first successful publish
since **1.2.1**. The `v1.3.0` tag's publish job failed on an expired `NPM_TOKEN`
(npm masked it as a `404` on `PUT`), so npm `latest` is still 1.2.1 and the entire
1.3.0 feature set never shipped. 1.3.1 (a) migrates publishing to **Trusted
Publishing (OIDC)** so there is no token to expire, (b) folds in the post-1.3.0
hygiene fixes already in flight, and (c) cuts the version + changelog. Done =
1.3.1 is on npm (carrying the full 1.3.0 + 1.3.1 change set), published via OIDC
with no stored secret.

## Context

- **Why 1.3.1, not a re-publish of 1.3.0.** The `v1.3.0` tag commit predates the
  badge / license / Trusted-Publishing fixes, and that tag's publish already
  failed. Rather than move a release tag, we roll forward: 1.3.1 = 1.3.0's code +
  the post-cut fixes. Semver-correct — 1.3.0 stays the feature release in the
  changelog; 1.3.1 is a patch on top. npm jumps 1.2.1 → 1.3.1 and gains **both**
  changelog sections (the new favorable-move bindings, the `.expect` → thrown
  `Error` conversion, the CJS entry, the registry — plus the 1.3.1 patch items).
- **Publish failure root cause (verified from the failed run log):**
  `npm error 404 ... PUT https://registry.npmjs.org/centaur-technical-indicators`
  — npm's signature for invalid/expired auth on publish (it masks 401/403 as 404).
- **Trusted-Publishing landmine.** OIDC needs `permissions: id-token: write` — but
  PR 46 hardened `publish.yml` to `contents: read` **only**, so this release must
  re-add `id-token: write` (the minimal necessary relaxation). It also needs npm
  CLI **≥ 11.5.1** (the runner's Node-20 npm is too old → bump Node + update npm).
  And it requires a one-time **npm-side** Trusted Publisher config that only the
  maintainer can do (see Prerequisites) — the workflow change alone will not
  authenticate.

## Prerequisites (confirm; do not perform here)

- **npm Trusted Publisher configured (maintainer task, on npmjs.com).** Package
  `centaur-technical-indicators` → **Settings → Trusted Publishing** → add a
  **GitHub Actions** publisher: organization `chironmind`, repository
  `CentaurTechnicalIndicators-JS`, workflow filename `publish.yml` (leave
  *environment* blank unless one is added to the job). **If this is not done first,
  the OIDC publish fails — stop and report; do not fall back to a token.**
- main is at the `v1.3.0` tag: `git rev-list --count v1.3.0..main` → `0`.

## Verify first (re-confirm at session start)

| Claim | How to check | Expected |
|-------|--------------|----------|
| npm `latest` is 1.2.1 (1.3.0 never published) | `npm view centaur-technical-indicators version` | `1.2.1` |
| version on main is 1.3.0 | `node -p "require('./package.json').version"` | `1.3.0` |
| publish.yml has no `id-token` yet | `rg -n 'id-token' .github/workflows/publish.yml` | no hits |
| publish.yml still references `NPM_TOKEN` | `rg -n 'NPM_TOKEN' .github/workflows/publish.yml` | 1 hit (to be removed) |

## Changes (in order) — one focused PR each

1. **Trusted Publishing — `.github/workflows/publish.yml`** (branch
   `ci/npm-trusted-publishing`):
   - add a `workflow_dispatch:` trigger (lets us publish the current
     `package.json` version on demand, no re-tag);
   - add `id-token: write` to `permissions` (keep `contents: read`);
   - bump `actions/setup-node` to `node-version: 24` and add a step
     `npm install -g npm@latest` (OIDC trusted publishing needs npm ≥ 11.5.1);
   - **remove** the `env: NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` from the
     publish step — `npm publish --access public` authenticates via OIDC and emits
     build **provenance** automatically.
2. **README hygiene — `README.md`** (PR **#49**, already open): npm version badge →
   shields.io default color; License badge link → `LICENSE-MIT`. Merge.
3. **NEXT_RELEASE doc — `docs/dev/NEXT_RELEASE.md`** (PR **#48**, already open):
   internal planning doc; merge (no published-package effect).
4. **(OPTIONAL — maintainer decides) Dependabot — `.github/dependabot.yml`**
   (ROADMAP 1.6): additive, fits this release's supply-chain theme (Trusted
   Publishing + the PR 46 token-permissions hardening). Include only if approved;
   otherwise defer to 1.4.0.
5. **Version cut — `package.json` + `Cargo.toml` `1.3.0 → 1.3.1`; `CHANGELOG.md`**
   `## [Unreleased]` → `## [1.3.1] - 2026-06-21`, reopen an empty `## [Unreleased]`
   above (branch `chore/version-cut-1.3.1`). Do **not** touch the
   `centaur_technical_indicators = "=1.3.0"` dependency pin.
6. **Tag + publish — GATED.** After 1–5 merge **and** the npm Trusted Publisher is
   configured: `git tag v1.3.1 && git push origin v1.3.1` (or run the
   `workflow_dispatch`) → `publish.yml` publishes 1.3.1 via OIDC. **Human-approved,
   never automatic** (per workspace `CLAUDE.md` — pushing the tag publishes).
- **Changelog coupling:** the version-cut PR finalizes `[1.3.1]`; the hygiene /
  CI / docs PRs are changelog-exempt (cosmetic / CI / internal) per `AGENTS.md`.

## Acceptance tests (named; all must pass)

- **A1 (decisive)** — after publish, `npm view centaur-technical-indicators version`
  prints `1.3.1`; the published tarball reports `1.3.1` and includes
  `index.node.cjs` + all five entry points.
- **A2** — the publish ran **tokenless via OIDC**: the `publish.yml` run log shows
  the Trusted-Publishing path (no `NPM_TOKEN` used) and a provenance attestation;
  no `NPM_TOKEN` secret is required by the workflow.
- **A3** — `package.json` + `Cargo.toml` are `1.3.1`; `CHANGELOG.md`'s top released
  section is `## [1.3.1] - <date>` with an empty `## [Unreleased]` above; README
  badges are fixed (default color, `LICENSE-MIT` link).
- **A4 (suite)** — pre-PR gates pass on every constituent PR; **no `src/**`,
  `index.*`, or `index.d.ts` change anywhere in the release**.

## Out of scope (do not touch)

- Any `src/*.rs`, `index.*`, `index.d.ts` — 1.3.1 is release + CI mechanics only;
  no new bindings, no API/behavior change.
- The larger **NEXT_RELEASE** backlog — `basic_indicators`, the enum-variant drift
  test, `wasm-opt`, web/CDN smoke tests, model-variant coverage, `breakDownTrends`
  config object, typed-array input types, `examples/`. Those are the next **minor
  (1.4.0)**, not this patch.
- Moving or deleting the `v1.3.0` tag — leave it; 1.3.1 rolls forward.

## Definition of done

- [ ] Trusted-Publishing `publish.yml` merged; npm Trusted Publisher configured.
- [ ] README (#49) + NEXT_RELEASE (#48) merged; dependabot merged iff approved.
- [ ] Version cut to 1.3.1 merged; CHANGELOG finalized to `[1.3.1]`.
- [ ] `v1.3.1` tagged + published via OIDC; `npm view … version` → `1.3.1`.
- [ ] No `src/**` / `index.*` change anywhere in the release.

## Report (per AGENTS.md)

Summary · Scope (files touched; what was deliberately left untouched) ·
Compatibility (release + CI only; the published 1.3.1 surface equals 1.3.0's code)
· Validation (gate output + `npm view` showing `1.3.1` + the OIDC/provenance log
line) · Changelog (the `[1.3.1]` finalization) — plus each acceptance-test name
with its pass output verbatim (including A1), and an explicit note that the tag /
publish was human-approved and ran tokenless via Trusted Publishing.
