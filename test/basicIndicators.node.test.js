import { test, describe } from "node:test";
import assert from "node:assert/strict";
import init, {
  basicIndicators,
  CentralPoint,
  DeviationAggregate,
} from "../index.node.js";

await init();

const PRICES = [1.0, 2.0, 3.0, 4.0, 5.0];
const SAME_VALUES = [3.0, 3.0, 3.0, 3.0, 3.0];

const close = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
const assertClose = (got, want, tol = 1e-9, label = "") =>
  assert.ok(
    close(got, want, tol),
    `${label}: got ${got}, expected ${want} (tol ${tol})`,
  );

describe("basicIndicators.single", () => {
  test("mean of [1,2,3,4,5] is 3.0", () => {
    assertClose(basicIndicators.single.mean(PRICES), 3.0, 1e-12, "mean");
  });

  test("median of [1,2,3,4,5] is 3.0", () => {
    assertClose(basicIndicators.single.median(PRICES), 3.0, 1e-12, "median");
  });

  test("mode of [3,3,3,3,3] is 3.0", () => {
    assertClose(basicIndicators.single.mode(SAME_VALUES), 3.0, 1e-12, "mode");
  });

  test("logDifference(3.0, 2.0) = ln(3/2)", () => {
    const got = basicIndicators.single.logDifference(3.0, 2.0);
    assertClose(got, Math.log(3.0 / 2.0), 1e-12, "logDifference");
  });

  test("variance of [1,2,3,4,5] is 2.0 (population)", () => {
    assertClose(basicIndicators.single.variance(PRICES), 2.0, 1e-12, "variance");
  });

  test("standardDeviation of [1,2,3,4,5] is sqrt(2)", () => {
    assertClose(
      basicIndicators.single.standardDeviation(PRICES),
      Math.sqrt(2.0),
      1e-12,
      "standardDeviation",
    );
  });

  test("absoluteDeviation with Mean center + Mean aggregate", () => {
    // |1-3| + |2-3| + |3-3| + |4-3| + |5-3| = 2+1+0+1+2 = 6 / 5 = 1.2
    const got = basicIndicators.single.absoluteDeviation(
      PRICES,
      CentralPoint.Mean,
      DeviationAggregate.Mean,
    );
    assertClose(got, 1.2, 1e-12, "absoluteDeviation(Mean, Mean)");
  });

  test("absoluteDeviation with Median center + Median aggregate", () => {
    // median([1,2,3,4,5]) = 3; abs devs = [2,1,0,1,2]; median of devs = 1
    const got = basicIndicators.single.absoluteDeviation(
      PRICES,
      CentralPoint.Median,
      DeviationAggregate.Median,
    );
    assertClose(got, 1.0, 1e-12, "absoluteDeviation(Median, Median)");
  });

  test("logStandardDeviation is finite and positive", () => {
    const got = basicIndicators.single.logStandardDeviation(PRICES);
    assert.ok(Number.isFinite(got) && got > 0, `logStandardDeviation = ${got}`);
  });

  test("studentTAdjustedStd matches std for large df", () => {
    const std = basicIndicators.single.standardDeviation(PRICES);
    const adjusted = basicIndicators.single.studentTAdjustedStd(PRICES, 1e6);
    // df→∞ recovers standard deviation
    assertClose(adjusted, std, 1e-3, "studentTAdjustedStd@large df");
  });

  test("laplaceStdEquivalent is finite and positive", () => {
    const got = basicIndicators.single.laplaceStdEquivalent(PRICES);
    assert.ok(
      Number.isFinite(got) && got > 0,
      `laplaceStdEquivalent = ${got}`,
    );
  });

  test("cauchyIqrScale is finite and positive", () => {
    const got = basicIndicators.single.cauchyIqrScale(PRICES);
    assert.ok(Number.isFinite(got) && got > 0, `cauchyIqrScale = ${got}`);
  });

  test("max of [1,2,3,4,5] is 5.0", () => {
    assertClose(basicIndicators.single.max(PRICES), 5.0, 1e-12, "max");
  });

  test("min of [1,2,3,4,5] is 1.0", () => {
    assertClose(basicIndicators.single.min(PRICES), 1.0, 1e-12, "min");
  });

  test("priceDistribution returns Array<[number, number]>", () => {
    const out = basicIndicators.single.priceDistribution(PRICES, 1.0);
    assert.ok(Array.isArray(out), "expected array");
    for (const entry of out) {
      assert.ok(Array.isArray(entry) && entry.length === 2);
      assert.equal(typeof entry[0], "number");
      assert.equal(typeof entry[1], "number");
    }
    // Sum of counts equals input length
    const totalCount = out.reduce((acc, [, c]) => acc + c, 0);
    assert.equal(totalCount, PRICES.length, "counts should sum to input length");
  });

  test("empiricalQuantileRangeFromDistribution: IQR of [1,2,3,4] @ p=1.0 is 2.0", () => {
    // From the Rust crate's #[test] block: q25=1.75, q75=3.25 => IQR=1.5
    // The upstream test asserts 2.0 with the implementation's linear interpolation.
    const got = basicIndicators.single.empiricalQuantileRangeFromDistribution(
      [1.0, 2.0, 3.0, 4.0],
      1.0,
      0.25,
      0.75,
    );
    assertClose(got, 2.0, 1e-9, "empiricalQuantileRangeFromDistribution");
  });
});

describe("basicIndicators.bulk", () => {
  test("mean with period 2 returns rolling means", () => {
    const got = basicIndicators.bulk.mean(PRICES, 2);
    assert.deepEqual(Array.from(got), [1.5, 2.5, 3.5, 4.5]);
  });

  test("median with period 3", () => {
    const got = basicIndicators.bulk.median(PRICES, 3);
    assert.deepEqual(Array.from(got), [2.0, 3.0, 4.0]);
  });

  test("mode with period 2 on constant series", () => {
    const got = basicIndicators.bulk.mode(SAME_VALUES, 2);
    assert.deepEqual(Array.from(got), [3.0, 3.0, 3.0, 3.0]);
  });

  test("log = elementwise ln", () => {
    const got = basicIndicators.bulk.log(PRICES);
    const expected = PRICES.map((p) => Math.log(p));
    assert.equal(got.length, expected.length);
    for (let i = 0; i < expected.length; i++) {
      assertClose(got[i], expected[i], 1e-12, `log[${i}]`);
    }
  });

  test("logDifference returns L-1 values", () => {
    const got = basicIndicators.bulk.logDifference(PRICES);
    assert.equal(got.length, PRICES.length - 1);
    for (let i = 0; i < got.length; i++) {
      const expected = Math.log(PRICES[i + 1]) - Math.log(PRICES[i]);
      assertClose(got[i], expected, 1e-12, `logDifference[${i}]`);
    }
  });

  test("variance with period 2", () => {
    // Each window of 2 has variance 0.25 (population: ((xa - mean)^2 + (xb-mean)^2)/2 = 0.25)
    const got = basicIndicators.bulk.variance(PRICES, 2);
    assert.equal(got.length, 4);
    for (let i = 0; i < got.length; i++) {
      assertClose(got[i], 0.25, 1e-12, `variance[${i}]`);
    }
  });

  test("standardDeviation with period 2 is sqrt(0.25) = 0.5", () => {
    const got = basicIndicators.bulk.standardDeviation(PRICES, 2);
    for (let i = 0; i < got.length; i++) {
      assertClose(got[i], 0.5, 1e-12, `standardDeviation[${i}]`);
    }
  });

  test("absoluteDeviation with period 3, Mean/Mean", () => {
    // window [1,2,3]: mean=2, abs devs=[1,0,1], mean=2/3
    // window [2,3,4]: mean=3, abs devs=[1,0,1], mean=2/3
    // window [3,4,5]: mean=4, abs devs=[1,0,1], mean=2/3
    const got = basicIndicators.bulk.absoluteDeviation(
      PRICES,
      3,
      CentralPoint.Mean,
      DeviationAggregate.Mean,
    );
    assert.equal(got.length, 3);
    for (let i = 0; i < got.length; i++) {
      assertClose(got[i], 2.0 / 3.0, 1e-12, `absoluteDeviation[${i}]`);
    }
  });

  test("priceDistribution nested shape: Array<Array<[number, number]>>", () => {
    const out = basicIndicators.bulk.priceDistribution(PRICES, 3, 1.0);
    assert.ok(Array.isArray(out));
    assert.equal(out.length, 3, "expected 3 windows");
    for (const inner of out) {
      assert.ok(Array.isArray(inner));
      for (const entry of inner) {
        assert.ok(Array.isArray(entry) && entry.length === 2);
      }
    }
  });

  test("logStandardDeviation with period 3 is finite and positive", () => {
    const got = basicIndicators.bulk.logStandardDeviation(PRICES, 3);
    for (const v of got) {
      assert.ok(Number.isFinite(v) && v > 0, `logStandardDeviation = ${v}`);
    }
  });

  test("studentTAdjustedStd with period 3, large df, matches std", () => {
    const std = basicIndicators.bulk.standardDeviation(PRICES, 3);
    const adjusted = basicIndicators.bulk.studentTAdjustedStd(PRICES, 3, 1e6);
    assert.equal(adjusted.length, std.length);
    for (let i = 0; i < adjusted.length; i++) {
      assertClose(adjusted[i], std[i], 1e-3, `studentT[${i}]`);
    }
  });

  test("laplaceStdEquivalent with period 3 is finite", () => {
    const got = basicIndicators.bulk.laplaceStdEquivalent(PRICES, 3);
    for (const v of got) {
      assert.ok(Number.isFinite(v), `laplaceStdEquivalent = ${v}`);
    }
  });

  test("cauchyIqrScale with period 3 is finite", () => {
    const got = basicIndicators.bulk.cauchyIqrScale(PRICES, 3);
    for (const v of got) {
      assert.ok(Number.isFinite(v), `cauchyIqrScale = ${v}`);
    }
  });

  test("empiricalQuantileRangeFromDistribution: bulk IQR over [1,2,3,4]@3,1.0,0.25,0.75 = [1.0, 1.0]", () => {
    // From the Rust crate's #[test] block
    const got = basicIndicators.bulk.empiricalQuantileRangeFromDistribution(
      [1.0, 2.0, 3.0, 4.0],
      3,
      1.0,
      0.25,
      0.75,
    );
    assert.deepEqual(Array.from(got), [1.0, 1.0]);
  });
});

describe("basicIndicators error paths", () => {
  test("mean of empty array throws", () => {
    assert.throws(() => basicIndicators.single.mean([]));
  });

  test("variance of single element throws", () => {
    assert.throws(() => basicIndicators.single.variance([1.0]));
  });

  test("bulk.mean with period > length throws", () => {
    assert.throws(() => basicIndicators.bulk.mean(PRICES, 10));
  });

  test("empiricalQuantileRangeFromDistribution with low >= high throws", () => {
    assert.throws(() =>
      basicIndicators.single.empiricalQuantileRangeFromDistribution(
        PRICES,
        1.0,
        0.75,
        0.25,
      ),
    );
  });
});
