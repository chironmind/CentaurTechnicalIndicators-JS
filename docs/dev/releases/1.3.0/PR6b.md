# PR 6b — Process-doc consolidation

Branch: `pr/6b-doc-consolidation` · Status: branch pushed (PR not yet opened)

## Objective
Cut the agent/process-doc sprawl down to the canonical set.

## Changes
- Deleted: `docs/REPO_MAP.md`, `docs/AI_ONBOARDING.md`, `AI_FRIENDLY_ROADMAP.md`,
  `.github/copilot-instructions.md`, `ai-policy.yaml`.
- Added `CLAUDE.md` (thin pointer to `AGENTS.md`).
- Trimmed AGENTS.md "Docs to review before coding" to `CONTRIBUTING.md` (+ `CLAUDE.md`).

## Key decisions
- Canonical set is **AGENTS.md + CONTRIBUTING.md + CLAUDE.md**. The five removed
  files were redundant *living guidance* that drifted; non-redundant history belongs
  in this `docs/dev/` archive instead. `ai-policy.yaml` had no programmatic consumer.

## Validation
fmt ✓ · clippy ✓ · build ✓ · test ✓ (100/100).
