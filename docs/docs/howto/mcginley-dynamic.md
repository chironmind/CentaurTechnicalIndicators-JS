# How to use McGinley Dynamic in CentaurTechnicalIndicators-JS

This guide shows how to use the McGinley Dynamic bands with the JavaScript package CentaurTechnicalIndicators-JS.  
The same logic can be applied to other McGinley Dynamic functions.

---

## 🎯 Goal

- Use the McGinley Dynamic bands

---

## 📦 Requirements

Install CentaurTechnicalIndicators-JS:

```bash
# npm
npm install centaur-technical-indicators

# yarn
yarn add centaur-technical-indicators

# pnpm
pnpm add centaur-technical-indicators
```

Initialize (recommended, required in browsers):

```js
import init from "centaur-technical-indicators";

await init(); // In Node it's a no-op; in browsers it loads WASM
```

---

## 💻 Step-by-Step

### 1. Use an in-memory dataset

For this guide, we’ll use a constant array of prices:

```js
const data = [
  6037.59, 5970.84, 5906.94, 5881.63, 5868.55, 5942.47, 5975.38, 5909.03,
  5918.25, 5827.04, 5836.22, 5842.91, 5949.91, 5937.34, 5996.66, 6049.24,
  6086.37, 6118.71, 6101.24, 6012.28, 6067.70, 6039.31, 6071.17, 6040.53,
  5994.57, 6037.88, 6061.48, 6083.57, 6025.99, 6066.44, 6068.50, 6051.97,
  6115.07, 6114.63, 6129.58, 6144.15, 6117.52, 6013.13, 5983.25, 5955.25,
  5956.06, 5861.57, 5954.50, 5849.72, 5778.15, 5842.63, 5738.52, 5770.20,
  5614.56, 5572.07, 5599.30, 5521.52, 5638.94
];
```

### 2. Calculate the McGinley Dynamic bands

The McGinley Dynamic uses a previously calculated value.  
If no previous McGinley Dynamic is available, use 0.0 for the first computation.

```js
import init, {
  candleIndicators,
  DeviationModel
} from "centaur-technical-indicators";

await init();

// Example setup
const period = 5;
const deviationModel = DeviationModel.StandardDeviation;
const deviationMultiplier = 2.0;
const previousMcGinleyDynamic = 0.0; // none available on first run

// Rolling McGinley Dynamic bands over the series
const bands = candleIndicators.bulk.mcginleyDynamicBands(
  data,
  deviationModel,
  deviationMultiplier,
  previousMcGinleyDynamic,
  period
);

console.log("Loaded", data.length, "prices");
console.log("Length of bands", bands.length);
// bands is an array of [lower, mcginley, upper] per window
// bands[i] corresponds to data[i..i+period-1] and anchors at data[i + period - 1]
```

### 3. Use the last value to calculate the next McGinley band

From step 2, we now have a previous McGinley Dynamic (the middle value of the last tuple).  
When a new price comes in, compute the next band using the single function.  
Pass the latest period prices to align with the period used in bulk.

```js
// Next price comes in
const newPrice = 5689.24;
data.push(newPrice);

const lastMcGinleyDynamic = bands[bands.length - 1][1]; // previous McGinley Dynamic from bulk result

// Use the last 'period' prices for the single calculation
const latestWindow = data.slice(-period);

const nextBand = candleIndicators.single.mcginleyDynamicBands(
  latestWindow,
  deviationModel,
  deviationMultiplier,
  lastMcGinleyDynamic
);

const [lower, mid, upper] = nextBand;
console.log(`Lower band ${lower}, McGinley dynamic ${mid}, upper band ${upper}`);
```

Notes:
- Valid DeviationModel values:
  - DeviationModel.StandardDeviation
  - DeviationModel.MeanAbsoluteDeviation
  - DeviationModel.MedianAbsoluteDeviation
  - DeviationModel.ModeAbsoluteDeviation
  - DeviationModel.UlcerIndex

---

## 🧪 Output

```text
Loaded 53 prices
Length of bands 49
Lower band 5551.31, McGinley dynamic 5665.61, upper band 5779.92
```

(Output will vary with data and parameters.)

---

## ✅ Next Steps

- Programmatically choose a period
- Programmatically choose a DeviationModel
- Programmatically choose a deviation multiplier
- Combine all selections
- Introduce punishment to the rating system (e.g., penalize false signals/whipsaws)
