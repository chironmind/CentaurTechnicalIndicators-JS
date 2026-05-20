// Quickstart: single MA + single RSI from a small price array.
// Run with: node examples/quickstart.js  (after `npm run build`).

import init, {
  movingAverage,
  momentumIndicators,
  MovingAverageType,
  ConstantModelType,
} from "../index.node.js";

await init();

const prices = [100.2, 100.46, 100.53, 100.38, 100.19];

const sma = movingAverage.single.movingAverage(prices, MovingAverageType.Simple);
console.log("SMA(5):", sma);

const rsi = momentumIndicators.single.relativeStrengthIndex(
  prices,
  ConstantModelType.SimpleMovingAverage,
);
console.log("RSI(5):", rsi);
