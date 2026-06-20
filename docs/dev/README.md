# docs/dev — development & decision archive

Durable, append-only record of how this binding is built. **Not shipped to npm**
(`/docs` is in `.npmignore`). Living guidance lives in `AGENTS.md` /
`CONTRIBUTING.md` / `CLAUDE.md`; this folder is history.

- `RELEASE_1.3.0.md` — the 1.3.0 release plan (PR-by-PR).
- `releases/1.3.0/PR*.md` — one implementation record per landed PR
  (objective · changes · key decisions · validation). Added as each PR lands;
  records for PR 3, 5a–5h, 9, and the Final PR follow when those run.
- `releases/1.3.0/briefs/` — forward-execution briefs (the spec read *before* a
  PR runs) for the not-yet-run PRs (3, 5a–5h, 9, version-cut), each conforming to
  the workspace `TEMPLATE-brief.md`. See its `README.md` for the index.

**Convention:** a record is written once and not rewritten after its PR merges —
correct a later understanding in a *new* record, don't edit history. (ADR-style
`decisions/` entries can live alongside this when we add them.)
