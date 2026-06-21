import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

import init, {
  strengthIndicators,
  ConstantModelType,
} from "../index.node.js";

before(async () => {
  await init();
});

describe("strengthIndicators.single (parity, one model where applicable)", () => {
  test("accumulationDistribution (no previous)", () => {
    const out = strengthIndicators.single.accumulationDistribution(
      100.53, 99.62, 100.01, 268.0, 0.0
    );
    assert.strictEqual(out, -38.28571428571309);
  });

  test("volumeIndex (no previous)", () => {
    const out = strengthIndicators.single.volumeIndex(100.44, 100.01, 0.0);
    assert.strictEqual(out, 0.004318056345550251);
  });

  test("relativeVigorIndex (SMA)", () => {
    const open  = [100.73, 99.62, 99.82, 100.38, 100.97, 101.81];
    const high  = [102.32, 100.69, 100.83, 101.73, 102.01, 102.75];
    const low   = [100.14, 98.98, 99.07, 100.1, 99.96, 100.55];
    const close = [100.55, 99.01, 100.43, 101.0, 101.76, 102.03];
    const out = strengthIndicators.single.relativeVigorIndex(
      open, high, low, close, ConstantModelType.SimpleMovingAverage
    );
    assert.strictEqual(out, 0.2063784115302081);
  });
});

describe("strengthIndicators.bulk (parity, one model where applicable)", () => {
  test("accumulationDistribution (no previous)", () => {
    const highs = [100.53, 100.68];
    const lows = [99.62, 99.97];
    const close = [100.01, 100.44];
    const volume = [268.0, 319.0];
    const out = strengthIndicators.bulk.accumulationDistribution(
      highs, lows, close, volume, 0.0
    );
    assert.deepEqual(out, [-38.28571428571309, 65.05231388329526]);
  });

  test("positiveVolumeIndex (no previous)", () => {
    const close = [100.14, 98.98, 99.07, 100.1];
    const volume = [1000.0, 1200.0, 1300.0, 1100.0];
    const out = strengthIndicators.bulk.positiveVolumeIndex(close, volume, 0.0);
    assert.deepEqual(out, [
      -0.011449598682475618,
      -0.011460009511748427,
      -0.011460009511748427,
    ]);
  });

  test("negativeVolumeIndex (no previous)", () => {
    const close = [100.14, 98.98, 99.07, 100.1];
    const volume = [1000.0, 1200.0, 1300.0, 1100.0];
    const out = strengthIndicators.bulk.negativeVolumeIndex(close, volume, 0.0);
    assert.deepEqual(out, [0.0, 0.0, 0.010504780356171802]);
  });

  test("relativeVigorIndex (SMA, period 6)", () => {
    const open  = [100.73, 99.62, 99.82, 100.38, 100.97, 101.81];
    const high  = [102.32, 100.69, 100.83, 101.73, 102.01, 102.75];
    const low   = [100.14, 98.98, 99.07, 100.1, 99.96, 100.55];
    const close = [100.55, 99.01, 100.43, 101.0, 101.76, 102.03];
    const out = strengthIndicators.bulk.relativeVigorIndex(
      open, high, low, close, ConstantModelType.SimpleMovingAverage, 6
    );
    assert.deepEqual(out, [0.2063784115302081]);
  });
});

describe("strengthIndicators error handling (throws JS Error)", () => {
  test("A1 single.relativeVigorIndex throws on mismatched lengths", () => {
    const open  = [100.73, 99.62, 99.82, 100.38, 100.97, 101.81];
    const high  = [102.32, 100.69, 100.83, 101.73, 102.01, 102.75];
    const low   = [100.14, 98.98, 99.07, 100.1, 99.96, 100.55];
    const close = [100.55, 99.01, 100.43]; // shorter on purpose
    assert.throws(
      () =>
        strengthIndicators.single.relativeVigorIndex(
          open, high, low, close, ConstantModelType.SimpleMovingAverage
        ),
      (err) => {
        assert.ok(err instanceof Error);
        assert.ok(err.message.length > 0);
        return true;
      }
    );
  });

  test("bulk.accumulationDistribution throws on mismatched lengths", () => {
    const highs = [100.53, 100.68];
    const lows = [99.62]; // shorter on purpose
    const close = [100.01, 100.44];
    const volume = [268.0, 319.0];
    assert.throws(
      () =>
        strengthIndicators.bulk.accumulationDistribution(
          highs, lows, close, volume, 0.0
        ),
      (err) => {
        assert.ok(err instanceof Error);
        assert.ok(err.message.length > 0);
        return true;
      }
    );
  });

  test("bulk.relativeVigorIndex throws on invalid period", () => {
    const open  = [100.73, 99.62, 99.82, 100.38, 100.97, 101.81];
    const high  = [102.32, 100.69, 100.83, 101.73, 102.01, 102.75];
    const low   = [100.14, 98.98, 99.07, 100.1, 99.96, 100.55];
    const close = [100.55, 99.01, 100.43, 101.0, 101.76, 102.03];
    assert.throws(
      () =>
        strengthIndicators.bulk.relativeVigorIndex(
          open, high, low, close, ConstantModelType.SimpleMovingAverage, 99
        ),
      (err) => {
        assert.ok(err instanceof Error);
        assert.ok(err.message.length > 0);
        return true;
      }
    );
  });
});
