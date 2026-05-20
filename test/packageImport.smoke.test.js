// Smoke test: pack the package, install it into a temp project, and verify
// that every documented import path resolves and can compute a real indicator.
// This exercises the `exports` map in package.json — direct file imports from
// the working tree do not, because they bypass package resolution.
//
// Excluded from `npm run test:only` (filename ends in `.smoke.test.js`, not
// `.node.test.js`) so local `npm test` does not pay the pack+install cost.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { execSync, spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(import.meta.url);
const repoRoot = resolve(here, "..", "..");

let tarballPath;
let consumerDir;

before(() => {
  // 1. Build a tarball from the current working tree.
  const packed = execSync("npm pack --silent", {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
  tarballPath = join(repoRoot, packed);
  assert.ok(existsSync(tarballPath), `tarball not produced: ${tarballPath}`);

  // 2. Install the tarball into a throwaway consumer project.
  const tmp = mkdtempSync(join(tmpdir(), "cti-pack-smoke-"));
  consumerDir = join(tmp, "consumer");
  mkdirSync(consumerDir);
  writeFileSync(
    join(consumerDir, "package.json"),
    JSON.stringify(
      {
        name: "cti-smoke-consumer",
        version: "0.0.0",
        private: true,
        type: "module",
        dependencies: {
          "centaur-technical-indicators": `file:${tarballPath}`,
        },
      },
      null,
      2,
    ),
  );
  execSync("npm install --silent --no-audit --no-fund", {
    cwd: consumerDir,
    stdio: "inherit",
  });
});

after(() => {
  if (tarballPath && existsSync(tarballPath)) {
    rmSync(tarballPath, { force: true });
  }
});

function runConsumerScript(script) {
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", script],
    { cwd: consumerDir, encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(
      `consumer child exited ${result.status}\nstderr:\n${result.stderr}\nstdout:\n${result.stdout}`,
    );
  }
  return result.stdout.trim();
}

const RSI_INPUT = "[100.2, 100.46, 100.53, 100.38, 100.19]";
const EXPECTED_RSI = 49.25373134328325;

test("package root import: namespace + indicator call", () => {
  const out = runConsumerScript(`
    import init, { momentumIndicators, ConstantModelType } from "centaur-technical-indicators";
    try { await init(); } catch {}
    const rsi = momentumIndicators.single.relativeStrengthIndex(
      ${RSI_INPUT},
      ConstantModelType.SimpleMovingAverage
    );
    console.log(rsi);
  `);
  const value = Number(out);
  assert.ok(Number.isFinite(value), `expected finite RSI, got '${out}'`);
  assert.ok(
    Math.abs(value - EXPECTED_RSI) < 1e-9,
    `RSI ${value} differs from expected ${EXPECTED_RSI}`,
  );
});

test("subpath import: ./index.node.js resolves and computes an indicator", () => {
  const out = runConsumerScript(`
    import init, { momentumIndicators, ConstantModelType } from "centaur-technical-indicators/index.node.js";
    try { await init(); } catch {}
    const rsi = momentumIndicators.single.relativeStrengthIndex(
      ${RSI_INPUT},
      ConstantModelType.SimpleMovingAverage
    );
    console.log(rsi);
  `);
  const value = Number(out);
  assert.ok(Number.isFinite(value), `expected finite RSI, got '${out}'`);
  assert.ok(
    Math.abs(value - EXPECTED_RSI) < 1e-9,
    `RSI ${value} differs from expected ${EXPECTED_RSI}`,
  );
});

test("subpath import: ./index.web.js at least resolves and exposes expected exports", () => {
  // We do not call init() here — the web target uses fetch() to load the WASM,
  // which is not reliable from Node's file:// URLs. We assert only that the
  // module parses and the expected namespace is exported.
  const out = runConsumerScript(`
    import * as web from "centaur-technical-indicators/index.web.js";
    console.log(typeof web.momentumIndicators, typeof web.default);
  `);
  assert.equal(
    out,
    "object function",
    `index.web.js exports look wrong: '${out}'`,
  );
});

test("subpath import: ./index.js bundler wrapper resolves and exposes expected exports", () => {
  const out = runConsumerScript(`
    import * as bundler from "centaur-technical-indicators/index.js";
    console.log(typeof bundler.momentumIndicators, typeof bundler.default);
  `);
  assert.equal(
    out,
    "object function",
    `index.js exports look wrong: '${out}'`,
  );
});
