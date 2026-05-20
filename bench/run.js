// JS-side microbenchmark harness for the WASM bindings.
//
// Not run in CI. Run manually with: node bench/run.js  (after `npm run build`).
//
// What it measures: wall-clock time per WASM call against a 1000-element
// price series, plus a baseline pure-JS comparison for SMA and RSI to give a
// sense of the speedup. Numbers are paste-back-able into README's Performance
// section with a date stamp.
//
// Caveats: numbers depend on the host CPU, Node version, and whether wasm-opt
// has run (publish.yml runs it; local builds do not). Always document the
// environment alongside any pasted numbers.

import init, {
  movingAverage,
  momentumIndicators,
  basicIndicators,
  MovingAverageType,
  ConstantModelType,
} from "../index.node.js";

await init();

const N = 1000;
const ITERATIONS = 200;

// Deterministic-ish input: smoothed random walk so the indicators don't trip.
function makeSeries(n, seed = 42) {
  let x = seed;
  const rand = () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
  const out = new Array(n);
  let p = 100.0;
  for (let i = 0; i < n; i++) {
    p += (rand() - 0.5) * 0.5;
    out[i] = p;
  }
  return out;
}

const prices = makeSeries(N);

function bench(name, fn) {
  // warm
  for (let i = 0; i < 3; i++) fn();
  const start = process.hrtime.bigint();
  for (let i = 0; i < ITERATIONS; i++) fn();
  const end = process.hrtime.bigint();
  const totalNs = Number(end - start);
  const perCallUs = totalNs / ITERATIONS / 1000;
  console.log(`  ${name.padEnd(48)} ${perCallUs.toFixed(2)} µs / call`);
}

// --- pure-JS baselines for the simplest cases ---
function jsSmaSingle(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  return sum / arr.length;
}

function jsRsiSingle(arr) {
  let gains = 0;
  let losses = 0;
  for (let i = 1; i < arr.length; i++) {
    const d = arr[i] - arr[i - 1];
    if (d > 0) gains += d;
    else losses -= d;
  }
  const avgG = gains / (arr.length - 1);
  const avgL = losses / (arr.length - 1);
  if (avgL === 0) return 100;
  return 100 - 100 / (1 + avgG / avgL);
}

console.log(`Bench: N=${N}, iterations=${ITERATIONS}, Node ${process.version}`);
console.log("");
console.log("Single-call indicators (full window):");
bench("movingAverage.single.movingAverage (SMA)", () =>
  movingAverage.single.movingAverage(prices, MovingAverageType.Simple),
);
bench("[pure JS] SMA over N elements", () => jsSmaSingle(prices));
bench("momentumIndicators.single.relativeStrengthIndex (RSI)", () =>
  momentumIndicators.single.relativeStrengthIndex(
    prices,
    ConstantModelType.SimpleMovingAverage,
  ),
);
bench("[pure JS] RSI over N elements", () => jsRsiSingle(prices));
bench("basicIndicators.single.standardDeviation", () =>
  basicIndicators.single.standardDeviation(prices),
);

console.log("");
console.log("Bulk indicators (rolling window of 14):");
bench("momentumIndicators.bulk.relativeStrengthIndex (RSI, period=14)", () =>
  momentumIndicators.bulk.relativeStrengthIndex(
    prices,
    ConstantModelType.SimpleMovingAverage,
    14,
  ),
);
bench("movingAverage.bulk.movingAverage (SMA, period=14)", () =>
  movingAverage.bulk.movingAverage(prices, MovingAverageType.Simple, 14),
);
bench("basicIndicators.bulk.variance (period=14)", () =>
  basicIndicators.bulk.variance(prices, 14),
);
