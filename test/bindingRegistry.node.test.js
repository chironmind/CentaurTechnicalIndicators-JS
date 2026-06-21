// Cross-entry-point binding drift test (PR 9).
//
// One registry (docs/binding_registry.json) encodes the public JS namespace
// surface for 1.3.0: every namespace -> its leaf function set, tagged flat vs
// single-bulk. This test asserts that ALL FIVE hand-maintained surfaces agree
// with the registry, by SET equality on LEAF function names:
//
//   index.node.js   (ESM, nodejs wasm target)  -> runtime import()
//   index.node.cjs  (CommonJS re-export)        -> runtime require()
//   index.web.js    (browser, web wasm target)  -> runtime import()
//   index.js        (bundler wasm target)       -> TEXT PARSE (see below)
//   index.d.ts      (TypeScript types)          -> TEXT PARSE
//
// Why two surfaces are text-parsed (decided EMPIRICALLY under Node 24):
//   * index.node.js / index.web.js / index.node.cjs all import/require cleanly
//     under plain Node. The web target only fetches its .wasm inside init(),
//     which we never call -- we read object KEYS only, so the namespace objects
//     are fully populated without instantiating wasm.
//   * index.js (bundler) statically imports `*_bg.wasm` as an ES module, which
//     plain Node cannot load: `import("./index.js")` throws
//     "...does not provide an export named 'default'". So index.js is compared
//     by parsing its `export const <ns> = { ... }` blocks. The parse still
//     genuinely compares every leaf name, it just does not execute the module.
//   * index.d.ts has no runtime; its interfaces are parsed.
//
// LEAF rule: for single-bulk namespaces we compare the keys of `ns.single` and
// `ns.bulk` (and the registry's `single`/`bulk` lists) -- never the literal
// strings "single"/"bulk". For flat namespaces we compare the namespace's own
// keys against the registry's `functions`. `deprecated` is metadata and is NOT
// part of the leaf-set comparison.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const registry = JSON.parse(
  readFileSync(resolve(repoRoot, "docs/binding_registry.json"), "utf8")
);
const namespaces = registry.namespaces;
const nsNames = Object.keys(namespaces);

// Map a registry namespace name -> the index.d.ts interface base name
// (interfaces are <Base>Single / <Base>Bulk, or flat <Base>).
const dtsInterfaceBase = {
  candleIndicators: "CandleIndicators",
  chartTrends: "ChartTrends",
  correlationIndicators: "CorrelationIndicators",
  momentumIndicators: "MomentumIndicators",
  otherIndicators: "OtherIndicators",
  strengthIndicators: "StrengthIndicators",
  trendIndicators: "TrendIndicators",
  volatilityIndicators: "VolatilityIndicators",
  movingAverage: "MovingAverage",
};

// ---- helpers -------------------------------------------------------------

function symmetricDiff(actualSet, expectedSet) {
  const missing = [...expectedSet].filter((x) => !actualSet.has(x)); // in registry, not surface
  const extra = [...actualSet].filter((x) => !expectedSet.has(x)); // on surface, not registry
  return { missing, extra };
}

function assertSetEqual(surface, nsName, slot, actualNames, expectedNames) {
  const actualSet = new Set(actualNames);
  const expectedSet = new Set(expectedNames);
  const { missing, extra } = symmetricDiff(actualSet, expectedSet);
  const where = slot ? `${nsName}.${slot}` : nsName;
  assert.deepEqual(
    { missing, extra },
    { missing: [], extra: [] },
    `[${surface}] ${where} drifted from registry: ` +
      `missing-from-surface (in registry only)=[${missing.join(", ")}] ` +
      `extra-on-surface (not in registry)=[${extra.join(", ")}]`
  );
}

// Compare a runtime namespace object against the registry entry.
function checkRuntimeNamespace(surface, nsName, nsObj) {
  const entry = namespaces[nsName];
  assert.ok(nsObj, `[${surface}] namespace ${nsName} is missing entirely`);
  if (entry.shape === "flat") {
    assertSetEqual(surface, nsName, null, Object.keys(nsObj), entry.functions);
  } else {
    assert.ok(
      nsObj.single && nsObj.bulk,
      `[${surface}] ${nsName} expected single/bulk sub-objects`
    );
    assertSetEqual(surface, nsName, "single", Object.keys(nsObj.single), entry.single);
    assertSetEqual(surface, nsName, "bulk", Object.keys(nsObj.bulk), entry.bulk);
  }
}

// ---- text-parse: `export const <ns> = { ... }` blocks (index.js bundler) --
//
// Walks the source by brace depth. Leaf functions appear as `<name>: wasm.<x>`.
// For single-bulk namespaces the leaves live under `single: {` / `bulk: {`
// nested blocks; we attribute each leaf to whichever of those it is inside.
// For flat namespaces leaves live directly in the namespace block.
function parseConstNamespaces(src) {
  const result = {}; // nsName -> { flat:Set } | { single:Set, bulk:Set }
  const lines = src.split("\n");
  const declRe = /^export const (\w+)\s*=\s*\{/;
  const leafRe = /^\s*([A-Za-z_]\w*)\s*:/;
  const subRe = /^\s*(single|bulk)\s*:\s*\{/;

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(declRe);
    if (!m) continue;
    const nsName = m[1];
    // Only track namespaces the registry knows about.
    if (!namespaces[nsName]) continue;

    const flat = new Set();
    const single = new Set();
    const bulk = new Set();
    let slot = null; // null = flat/top-level, or "single"/"bulk"
    // depth relative to the namespace's opening brace (which is on line i).
    let depth = 1;
    for (let j = i + 1; j < lines.length; j++) {
      const line = lines[j];
      const sub = line.match(subRe);
      if (sub && depth === 1) {
        slot = sub[1];
        depth += (line.match(/\{/g) || []).length;
        depth -= (line.match(/\}/g) || []).length;
        continue;
      }
      // Capture a leaf only at the expected nesting level:
      //   flat namespace: depth === 1
      //   single/bulk:    depth === 2 (inside the sub-object)
      const leaf = line.match(leafRe);
      if (leaf && leaf[1] !== "single" && leaf[1] !== "bulk") {
        if (slot === null && depth === 1) flat.add(leaf[1]);
        else if (slot && depth === 2) (slot === "single" ? single : bulk).add(leaf[1]);
      }
      depth += (line.match(/\{/g) || []).length;
      depth -= (line.match(/\}/g) || []).length;
      if (depth <= 1) slot = null; // left a single/bulk sub-block
      if (depth === 0) break; // closed the namespace
    }

    result[nsName] =
      namespaces[nsName].shape === "flat" ? { flat } : { single, bulk };
  }
  return result;
}

// ---- text-parse: index.d.ts interfaces -----------------------------------
//
// Collect method names per `export interface <Name> { ... }` block. A method
// declaration begins at 2-space indent as `<name>(` (possibly spilling onto
// later lines for multi-arg signatures); JSDoc lines never match.
function parseDtsInterfaces(src) {
  const out = {}; // interfaceName -> string[]
  const lines = src.split("\n");
  const ifaceRe = /^export interface (\w+)\s*\{/;
  const methodRe = /^  ([A-Za-z_]\w*)\s*\(/;
  let cur = null;
  for (const line of lines) {
    const m = line.match(ifaceRe);
    if (m) {
      cur = m[1];
      out[cur] = [];
      continue;
    }
    if (cur) {
      if (/^\}/.test(line)) {
        cur = null;
        continue;
      }
      const mm = line.match(methodRe);
      if (mm) out[cur].push(mm[1]);
    }
  }
  return out;
}

// ---- namespace-set detection (catches a surface-only namespace) ----------
//
// The per-namespace leaf checks above iterate the REGISTRY's namespace names,
// so they catch a namespace the registry lists but a surface drops, plus any
// leaf drift -- but NOT a namespace a surface ADDS without the registry (the
// exact `standardIndicators` regression: a namespace exported inconsistently).
// These helpers compare the namespace key-set of each surface to the registry.

// A runtime export is "namespace-shaped" if it is a single/bulk object or a
// flat object whose values are all functions. This excludes wasm-bindgen enums
// (numeric/string-valued objects) and the init/default function exports.
function isNamespaceShaped(v) {
  if (!v || typeof v !== "object") return false;
  if (v.single && v.bulk && typeof v.single === "object" && typeof v.bulk === "object") return true;
  const keys = Object.keys(v);
  return keys.length > 0 && keys.every((k) => typeof v[k] === "function");
}

function exportedNamespaceNames(mod) {
  return new Set(Object.keys(mod).filter((k) => isNamespaceShaped(mod[k])));
}

// Text surfaces: every `export const <ns> = { ... }` declaration name in a
// wrapper (the enum re-export uses `export const { ... } = wasm`, which does not
// match, so only namespace declarations are collected).
function declaredConstNamespaceNames(src) {
  const names = new Set();
  const declRe = /^export const (\w+)\s*=\s*\{/;
  for (const line of src.split("\n")) {
    const m = line.match(declRe);
    if (m) names.add(m[1]);
  }
  return names;
}

// index.d.ts: derive namespace names from interface names (strip Single/Bulk,
// map base -> namespace). An interface that maps to no known namespace surfaces
// as `UNKNOWN:<iface>`, so a new surface-only namespace is flagged.
const dtsBaseToNs = Object.fromEntries(
  Object.entries(dtsInterfaceBase).map(([ns, base]) => [base, ns])
);
function dtsNamespaceNames(ifaces) {
  const names = new Set();
  for (const ifaceName of Object.keys(ifaces)) {
    const base = ifaceName.replace(/(Single|Bulk)$/, "");
    names.add(dtsBaseToNs[base] || `UNKNOWN:${ifaceName}`);
  }
  return names;
}

function assertNsSetEqual(surface, actualSet, expectedSet) {
  const { missing, extra } = symmetricDiff(actualSet, expectedSet);
  assert.deepEqual(
    { missing, extra },
    { missing: [], extra: [] },
    `[${surface}] namespace set drifted from registry: ` +
      `missing (in registry only)=[${missing.join(", ")}] ` +
      `extra (on surface only)=[${extra.join(", ")}]`
  );
}

// ---- text-parse: index.d.ts @deprecated -> namespace deprecated set -------
//
// The registry records a `deprecated` leaf list per namespace; index.d.ts JSDoc
// is the source of truth. Associate each `@deprecated` tag with the method it
// annotates (the next 2-space-indent `name(` after its JSDoc block) and union
// across the Single/Bulk interfaces of each namespace.
function parseDtsDeprecated(src) {
  const byNs = {};
  for (const ns of Object.keys(dtsInterfaceBase)) byNs[ns] = new Set();
  const lines = src.split("\n");
  const ifaceRe = /^export interface (\w+)\s*\{/;
  const methodRe = /^  ([A-Za-z_]\w*)\s*\(/;
  let curNs = null;
  let pending = false; // most recent JSDoc block carried @deprecated
  for (const line of lines) {
    const im = line.match(ifaceRe);
    if (im) {
      const base = im[1].replace(/(Single|Bulk)$/, "");
      curNs = dtsBaseToNs[base] || null;
      pending = false;
      continue;
    }
    if (curNs === null) continue;
    if (/^\}/.test(line)) {
      curNs = null;
      pending = false;
      continue;
    }
    if (/^\s*\/\*\*/.test(line)) {
      pending = false; // a fresh JSDoc block starts
      continue;
    }
    if (/@deprecated/.test(line)) {
      pending = true;
      continue;
    }
    const mm = line.match(methodRe);
    if (mm) {
      if (pending) byNs[curNs].add(mm[1]);
      pending = false;
    }
  }
  return byNs;
}

// ---- surfaces ------------------------------------------------------------

test("index.node.js (ESM nodejs target) matches registry", async () => {
  const mod = await import(resolve(repoRoot, "index.node.js"));
  for (const nsName of nsNames) {
    checkRuntimeNamespace("index.node.js", nsName, mod[nsName]);
  }
});

test("index.web.js (browser/web target) matches registry", async () => {
  // Reading KEYS only; we never call init(), so no .wasm fetch occurs.
  const mod = await import(resolve(repoRoot, "index.web.js"));
  for (const nsName of nsNames) {
    checkRuntimeNamespace("index.web.js", nsName, mod[nsName]);
  }
});

test("index.node.cjs (CommonJS) matches registry", () => {
  const mod = require(resolve(repoRoot, "index.node.cjs"));
  for (const nsName of nsNames) {
    checkRuntimeNamespace("index.node.cjs", nsName, mod[nsName]);
  }
});

test("index.js (bundler target, text-parsed) matches registry", () => {
  // Bundler target statically imports *_bg.wasm as an ES module, which plain
  // Node cannot load -- so we compare by parsing the source's namespace blocks.
  const src = readFileSync(resolve(repoRoot, "index.js"), "utf8");
  const parsed = parseConstNamespaces(src);
  for (const nsName of nsNames) {
    const entry = namespaces[nsName];
    const got = parsed[nsName];
    assert.ok(got, `[index.js] namespace ${nsName} not found in source`);
    if (entry.shape === "flat") {
      assertSetEqual("index.js", nsName, null, [...got.flat], entry.functions);
    } else {
      assertSetEqual("index.js", nsName, "single", [...got.single], entry.single);
      assertSetEqual("index.js", nsName, "bulk", [...got.bulk], entry.bulk);
    }
  }
});

test("index.d.ts (TypeScript interfaces, text-parsed) matches registry", () => {
  const src = readFileSync(resolve(repoRoot, "index.d.ts"), "utf8");
  const ifaces = parseDtsInterfaces(src);
  for (const nsName of nsNames) {
    const entry = namespaces[nsName];
    const base = dtsInterfaceBase[nsName];
    assert.ok(base, `no d.ts interface mapping for ${nsName}`);
    if (entry.shape === "flat") {
      const methods = ifaces[base];
      assert.ok(methods, `[index.d.ts] interface ${base} not found`);
      assertSetEqual("index.d.ts", nsName, null, methods, entry.functions);
    } else {
      const single = ifaces[`${base}Single`];
      const bulk = ifaces[`${base}Bulk`];
      assert.ok(single, `[index.d.ts] interface ${base}Single not found`);
      assert.ok(bulk, `[index.d.ts] interface ${base}Bulk not found`);
      assertSetEqual("index.d.ts", nsName, "single", single, entry.single);
      assertSetEqual("index.d.ts", nsName, "bulk", bulk, entry.bulk);
    }
  }
});

// Sanity: the registry must not list a phantom `standardIndicators` namespace,
// and must include the PR 3 favorable-move functions (A3).
test("registry shape sanity (no standardIndicators; PR3 favorable-move present)", () => {
  assert.ok(!("standardIndicators" in namespaces), "standardIndicators must not exist");
  assert.ok(
    namespaces.chartTrends.functions.includes("peakFavorableMove") &&
      namespaces.chartTrends.functions.includes("valleyFavorableMove"),
    "chartTrends must include peakFavorableMove and valleyFavorableMove"
  );
});

// The namespace KEY-SET of each surface must equal the registry's -- this is
// what catches a `standardIndicators`-style namespace added to a surface but
// missing from the registry (the per-leaf checks above would not see it).
test("namespace set agrees across all five surfaces (no surface-only namespace)", async () => {
  const expected = new Set(nsNames);
  const nodeMod = await import(resolve(repoRoot, "index.node.js"));
  assertNsSetEqual("index.node.js", exportedNamespaceNames(nodeMod), expected);
  const webMod = await import(resolve(repoRoot, "index.web.js"));
  assertNsSetEqual("index.web.js", exportedNamespaceNames(webMod), expected);
  const cjsMod = require(resolve(repoRoot, "index.node.cjs"));
  assertNsSetEqual("index.node.cjs", exportedNamespaceNames(cjsMod), expected);
  const jsSrc = readFileSync(resolve(repoRoot, "index.js"), "utf8");
  assertNsSetEqual("index.js", declaredConstNamespaceNames(jsSrc), expected);
  const dtsSrc = readFileSync(resolve(repoRoot, "index.d.ts"), "utf8");
  assertNsSetEqual("index.d.ts", dtsNamespaceNames(parseDtsInterfaces(dtsSrc)), expected);
});

// The registry's per-namespace `deprecated` list must match the @deprecated
// JSDoc tags in index.d.ts (the source of truth), so the deprecation metadata
// cannot silently drift.
test("registry deprecated flags match index.d.ts @deprecated tags", () => {
  const dtsSrc = readFileSync(resolve(repoRoot, "index.d.ts"), "utf8");
  const dep = parseDtsDeprecated(dtsSrc);
  for (const nsName of nsNames) {
    const expected = new Set(namespaces[nsName].deprecated || []);
    const actual = dep[nsName] || new Set();
    const { missing, extra } = symmetricDiff(actual, expected);
    assert.deepEqual(
      { missing, extra },
      { missing: [], extra: [] },
      `[index.d.ts] ${nsName} deprecated set drift: ` +
        `registry-only=[${missing.join(", ")}] dts-only=[${extra.join(", ")}]`
    );
  }
});
