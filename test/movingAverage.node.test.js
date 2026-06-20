import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

import init, { movingAverage, MovingAverageType } from "../index.node.js";

before(async () => {
  await init();
});

describe("movingAverage.single (one model)", () => {
  test("movingAverage (Simple)", () => {
    const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
    const out = movingAverage.single.movingAverage(prices, MovingAverageType.Simple);
    assert.strictEqual(out, 100.352);
  });

  test("mcginleyDynamic (no previous)", () => {
    const out = movingAverage.single.mcginleyDynamic(100.19, 0.0, 5);
    assert.strictEqual(out, 100.19);
  });
});

describe("movingAverage.bulk (one model)", () => {
  test("movingAverage (Simple, period 3)", () => {
    const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
    const out = movingAverage.bulk.movingAverage(prices, MovingAverageType.Simple, 3);
    assert.deepEqual(out, [100.39666666666666, 100.456666666666666, 100.36666666666667]);
  });

  test("mcginleyDynamic (period 3, no previous)", () => {
    const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
    const out = movingAverage.bulk.mcginleyDynamic(prices, 0.0, 3);
    assert.deepEqual(out, [100.53, 100.47970046511769, 100.38201189376744]);
  });
});

describe("movingAverage error handling (throws JS Error)", () => {
  test("single.movingAverage throws on empty array", () => {
    assert.throws(
      () => movingAverage.single.movingAverage([], MovingAverageType.Simple),
      (err) => {
        assert.ok(err instanceof Error, "expected an Error instance");
        assert.ok(err.message.length > 0, "expected a non-empty message");
        return true;
      },
    );
  });

  test("bulk.movingAverage throws when period > length", () => {
    assert.throws(
      () => movingAverage.bulk.movingAverage([100.2, 100.46], MovingAverageType.Simple, 5),
      (err) => {
        assert.ok(err instanceof Error, "expected an Error instance");
        assert.ok(err.message.length > 0, "expected a non-empty message");
        return true;
      },
    );
  });
});
