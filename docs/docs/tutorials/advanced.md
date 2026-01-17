# Tutorial 3: Advanced Usage of CentaurTechnicalIndicators-JS (RSI variant evaluation)

In this tutorial we go deep on just one indicator: the Relative Strength Index (RSI).  
We will systematically compare different ConstantModelType variants and a fixed period, score their signals, and rank configurations.  
You can later apply the exact same framework to other indicators (see “Extending Further”).

Series so far:

- [01- Getting started](getting-started.md)
- [02 - Plotting your indicators](plotting.md)
- 03 - More advanced use cases (this file)
- [04 - Getting data from an API](api.md)
- [05 - Real-time updates with WebSockets (single vs bulk)](websockets.md)

---

## 🎯 Goal

You will learn how to:

1. Enumerate RSI variants via different ConstantModelType values.
2. Compute RSI for a fixed period (e.g., 5).
3. Generate oversold signals (RSI < 30).
4. Score each signal using a forward-looking heuristic.
5. Aggregate scores into a ranked table of configurations.
6. Plan how to extend the same pattern to other indicators.

---

## 🧩 Why Focus on RSI?

Keeping scope narrow:

- Makes the scoring logic clearer.
- Prevents tutorial bloat.
- Lets you internalize the evaluation pattern before generalizing.

---

## 📦 Requirements

```bash
npm install centaur-technical-indicators-js
```

Initialize (required in browsers; no-op in Node):

```js
import init from "centaur-technical-indicators-js";
await init();
```

---

## 📂 Data Setup (inline, no CSV)

We’ll reuse the inline Close array from previous tutorials.

```js
// Close prices
const close = [
  6037.59, 5970.84, 5906.94, 5881.63, 5868.55, 5942.47, 5975.38, 5909.03,
  5918.25, 5827.04, 5836.22, 5842.91, 5949.91, 5937.34, 5996.66, 6049.24,
  6086.37, 6118.71, 6101.24, 6012.28, 6067.70, 6039.31, 6071.17, 6040.53,
  5994.57, 6037.88, 6061.48, 6083.57, 6025.99, 6066.44, 6068.50, 6051.97,
  6115.07, 6114.63, 6129.58, 6144.15, 6117.52, 6013.13, 5983.25, 5955.25,
  5956.06, 5861.57, 5954.50, 5849.72, 5778.15, 5842.63, 5738.52, 5770.20,
  5614.56, 5572.07, 5599.30, 5521.52, 5638.94
];
```

---

## 🔧 Define Model Types and Period

```js
import { momentumIndicators, ConstantModelType } from "centaur-technical-indicators-js";

const CONSTANT_MODELS = [
  ConstantModelType.SimpleMovingAverage,
  ConstantModelType.SmoothedMovingAverage,
  ConstantModelType.ExponentialMovingAverage,
  ConstantModelType.SimpleMovingMedian,
  ConstantModelType.SimpleMovingMode
];

const RSI_PERIOD = 5;
const OVERSOLD = 30.0;
```

---

## 🧮 Compute RSI Variants and Rate Signals

Scoring rule (toy example):
- Signal: RSI < 30 at bar i (oversold)
- Win: next close (i+1) > current close (i)

Alignment notes:
- For period p, rsi[0] corresponds to the window close[0..p-1] and “anchors” at index i = p - 1.
- Thus at bar i, the RSI index is rsiIdx = i - (p - 1).

```js
function enumKeyByValue(enumObj, value) {
  const found = Object.entries(enumObj).find(([, v]) => v === value);
  return found ? found[0] : String(value);
}

function evaluateRsiVariants(prices, period = RSI_PERIOD, oversold = OVERSOLD) {
  const results = [];

  for (const ctype of CONSTANT_MODELS) {
    const rsi = momentumIndicators.bulk.relativeStrengthIndex(prices, ctype, period);

    let totalSignals = 0;
    let correctSignals = 0;

    // Iterate prices indices i from (period - 1) to (L - 2), so i+1 is in range
    for (let i = period - 1; i < prices.length - 1; i++) {
      const rsiIdx = i - (period - 1);
      const r = rsi[rsiIdx];

      if (r < oversold) {
        totalSignals += 1;
        if (prices[i + 1] > prices[i]) correctSignals += 1;
      }
    }

    const successRate = totalSignals > 0 ? correctSignals / totalSignals : 0.0;

    results.push({
      model: ctype,
      modelName: enumKeyByValue(ConstantModelType, ctype),
      period,
      signals: totalSignals,
      correct_signals: correctSignals,
      success_rate: successRate
    });
  }

  // Sort descending by success_rate
  results.sort((a, b) => b.success_rate - a.success_rate);
  return results;
}

// Run the evaluation
const scores = evaluateRsiVariants(close, RSI_PERIOD, OVERSOLD);

// Pretty-print
console.log(`RSI Model Ratings (RSI < ${OVERSOLD}, period=${RSI_PERIOD}):`);
for (const row of scores) {
  const rate = (row.success_rate * 100).toFixed(2) + "%";
  console.log(
    `${row.modelName.padEnd(24)} | signals ${String(row.signals).padStart(3)} | wins ${String(row.correct_signals).padStart(3)} | success ${rate}`
  );
}

const best = scores[0];
console.log(`\nBest model: ${best.modelName} (Success Rate: ${(best.success_rate * 100).toFixed(2)}%)`);
```

Example console output (will vary with data):

```
RSI Model Ratings (RSI < 30, period=5):
SimpleMovingMedian         | signals  18 | wins  10 | success 55.56%
SimpleMovingAverage        | signals  16 | wins   8 | success 50.00%
SmoothedMovingAverage      | signals  17 | wins   8 | success 47.06%
SimpleMovingMode           | signals  17 | wins   8 | success 47.06%
ExponentialMovingAverage   | signals  19 | wins   8 | success 42.11%

Best model: SimpleMovingMedian (Success Rate: 55.56%)
```

---

## 🧠 Interpreting Results

- model/modelName: The constant model type tested.
- period: RSI period (fixed here at 5 for comparison).
- signals: Count of oversold signals (RSI < 30).
- correct_signals: Count of signals where the next bar closed higher.
- success_rate: correct_signals / signals.

Notes:
- A higher success rate suggests the model/period pair gives better “next bar up” predictions when oversold.
- If signals is very low, results may not be reliable—try longer history or adjust period/thresholds.

---

## 📝 Extending Further

- Try other periods: loop p in [5..30] and keep top-k per model.
- Add “sell” evaluation (RSI > 70 and next bar down) and combine scores.
- Test other thresholds (e.g., 80/20; adaptive zones).
- Use longer-forward horizons: check next N bars, or require a minimum upside.
- Apply the same scoring to bands (upper/lower touches) or crossovers (MA cross).
- Visualize signal points on the chart (see Tutorial 2).

---

## 🛡️ Disclaimer

This is a didactic example, not a trading strategy.  
Success rate on “next bar” is just one toy metric—proper research requires out-of-sample testing, risk modeling, and more.

---

## ✅ Next Step

[Connecting to an API](api.md)

Happy model testing! 🦀📈
