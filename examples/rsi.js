// RSI walk: compute single + bulk RSI across multiple ConstantModelType variants
// on the same price series, to illustrate how the choice of constant model
// changes the result.
//
// Run with: node examples/rsi.js  (after `npm run build`).

import init, {
  momentumIndicators,
  ConstantModelType,
} from "../index.node.js";

await init();

const prices = [
  100.2, 100.46, 100.53, 100.38, 100.19, 100.21, 100.32, 100.28, 100.41, 100.5,
];

const variants = [
  ["SimpleMovingAverage", ConstantModelType.SimpleMovingAverage],
  ["SmoothedMovingAverage", ConstantModelType.SmoothedMovingAverage],
  ["ExponentialMovingAverage", ConstantModelType.ExponentialMovingAverage],
];

console.log("--- single (full window, 5 elements) ---");
for (const [name, model] of variants) {
  const v = momentumIndicators.single.relativeStrengthIndex(
    prices.slice(0, 5),
    model,
  );
  console.log(`  ${name}: ${v}`);
}

console.log("\n--- bulk (rolling window of 5) ---");
for (const [name, model] of variants) {
  const series = momentumIndicators.bulk.relativeStrengthIndex(
    prices,
    model,
    5,
  );
  console.log(`  ${name}: [${Array.from(series).join(", ")}]`);
}
