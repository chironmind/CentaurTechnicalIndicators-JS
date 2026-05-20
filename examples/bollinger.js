// Bollinger-style moving constant bands using
// candleIndicators.bulk.movingConstantBands. Shows the explicit choice of
// ConstantModelType (center) and DeviationModel (band width source).
//
// Run with: node examples/bollinger.js  (after `npm run build`).

import init, {
  candleIndicators,
  ConstantModelType,
  DeviationModel,
} from "../index.node.js";

await init();

const prices = [
  100.2, 100.46, 100.53, 100.38, 100.19, 100.21, 100.32, 100.28, 100.41, 100.5,
];

// Classic Bollinger: 5-period SMA center, 2.0x StdDev band width.
const bands = candleIndicators.bulk.movingConstantBands(
  prices,
  ConstantModelType.SimpleMovingAverage,
  DeviationModel.StandardDeviation,
  2.0,
  5,
);

console.log("Bollinger bands (5-period SMA, 2 stddev):");
console.log("  [lower, center, upper] per window");
for (const [lower, center, upper] of bands) {
  console.log(`    [${lower}, ${center}, ${upper}]`);
}
