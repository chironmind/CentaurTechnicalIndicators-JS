// CommonJS smoke test for the require() export path (PR 7).
//
// Requires the package entry by its name so it resolves through the
// `exports["."].require` condition (-> index.node.cjs), exactly as a CommonJS
// consumer would. Asserts that a couple of namespaces/functions resolve and
// compute, and that the enums are present.
//
// Run with: node --test test/require.cjs
// Requires `npm run build` to have produced dist/node first.

const { test } = require("node:test");
const assert = require("node:assert/strict");

const pkg = require("centaur-technical-indicators");

test("enums resolve through the CJS entry", () => {
  assert.equal(typeof pkg.MovingAverageType, "object");
  assert.equal(typeof pkg.ConstantModelType, "object");
  assert.ok("Simple" in pkg.MovingAverageType);
  assert.ok("SimpleMovingAverage" in pkg.ConstantModelType);
});

test("default/init no-op is exported", async () => {
  assert.equal(typeof pkg.default, "function");
  await assert.doesNotReject(() => pkg.default());
});

test("movingAverage namespace resolves and computes", () => {
  assert.equal(typeof pkg.movingAverage, "object");
  assert.equal(typeof pkg.movingAverage.single.movingAverage, "function");

  const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
  const out = pkg.movingAverage.single.movingAverage(
    prices,
    pkg.MovingAverageType.Simple
  );
  assert.strictEqual(out, 100.352);
});

test("momentumIndicators namespace resolves and computes", () => {
  assert.equal(typeof pkg.momentumIndicators, "object");
  assert.equal(
    typeof pkg.momentumIndicators.single.relativeStrengthIndex,
    "function"
  );

  const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
  const out = pkg.momentumIndicators.single.relativeStrengthIndex(
    prices,
    pkg.ConstantModelType.SimpleMovingAverage
  );
  assert.strictEqual(out, 49.2537313432832);
});
