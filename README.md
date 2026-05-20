[![npm version](https://img.shields.io/npm/v/centaur-technical-indicators?color=cb3837&logo=npm)](https://www.npmjs.com/package/centaur-technical-indicators)
[![npm downloads](https://img.shields.io/npm/dm/centaur-technical-indicators?logo=npm)](https://www.npmjs.com/package/centaur-technical-indicators)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/centaur-technical-indicators?label=min+zip&logo=webpack)](https://bundlephobia.com/package/centaur-technical-indicators)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-339933?logo=node.js&logoColor=white)](#)

[![WASM](https://img.shields.io/badge/Target-WASM-6556C0?logo=webassembly&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/Types-Included-3178C6?logo=typescript&logoColor=white)](#)
[![Docs](https://img.shields.io/badge/docs-TypeDoc-blue?logo=githubpages)](https://chironmind.github.io/CentaurTechnicalIndicators-JS/)
[![CI](https://github.com/chironmind/CentaurTechnicalIndicators-JS/actions/workflows/ci.yml/badge.svg)](https://github.com/chironmind/CentaurTechnicalIndicators-JS/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

# CentaurTechnicalIndicators-JS

CentaurTechnicalIndicators-JS is a WebAssembly-powered, JS/TS-idiomatic wrapper around Centaur Technical Indicators — a high‑performance, pure‑Rust technical indicators library.

- Production‑grade indicators, ported from battle‑tested Rust code
- First‑class TypeScript types and clean, namespaced API
- Works in Node and modern browsers (bundler + web builds)
- Identical results to Centaur Technical Indicators (with parity tests for core functions)

Looking for the Rust crate? See: [ChironMind/CentaurTechnicalIndicators-Rust](https://github.com/ChironMind/CentaurTechnicalIndicators-Rust)

Looking for the Python version? See: [ChironMind/CentaurTechnicalIndicators-Python](https://github.com/chironmind/CentaurTechnicalIndicators-Python)

---

## 🚀 Quick Start

Install from your package manager (example: local/private package)

```bash
# npm
npm install centaur-technical-indicators

# yarn
yarn add centaur-technical-indicators

# pnpm
pnpm add centaur-technical-indicators
```

Initialize and use (Node)

```js
import init, {
  momentumIndicators,
  ConstantModelType,
} from "centaur-technical-indicators";

// Node: init() is a no-op, but safe to call
await init();

const prices = [100.2, 100.46, 100.53, 100.38, 100.19];

const rsi = momentumIndicators.single.relativeStrengthIndex(
  prices,
  ConstantModelType.SimpleMovingAverage
);

console.log("RSI:", rsi); // 49.2537313432832
```

Browser (bundlers)

```js
import init, { movingAverage, MovingAverageType } from "centaur-technical-indicators";

await init(); // Required to load the WASM module in browsers

const sma = movingAverage.single.movingAverage(
  [100.2, 100.46, 100.53, 100.38, 100.19],
  MovingAverageType.Simple
);

console.log("SMA:", sma); // 100.352
```

Browser (CDN - jsdelivr/unpkg)

```html
<script type="module">
  // Note: Replace @latest with a specific version (e.g., @1.2.2) for production use
  import init, * as wasm from 'https://cdn.jsdelivr.net/npm/centaur-technical-indicators@latest/dist/web/centaur_technical_indicators.js';
  
  await init(); // Initialize WASM module
  
  // When using the web target directly, use the flat WASM exports
  const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
  const rsi = wasm.momentum_single_relativeStrengthIndex(
    prices,
    wasm.ConstantModelType.SimpleMovingAverage
  );
  
  console.log("RSI:", rsi); // 49.2537313432832
  
  // Or use the index.web.js wrapper for the same namespaced API as bundlers
  // import init, { momentumIndicators, ConstantModelType } from 'https://cdn.jsdelivr.net/npm/centaur-technical-indicators@1.2.2/index.web.js';
</script>
```

---

## 🧩 What You Get

- Same math and deterministic outputs as Centaur Technical Indicators
- Two styles for almost every indicator:
  - single: full-window, scalar output
  - bulk: rolling windows, vector output
- Clean naming and nested namespaces:
  - candleIndicators, chartTrends, correlationIndicators, momentumIndicators, movingAverage, otherIndicators, standardIndicators, strengthIndicators, trendIndicators, volatilityIndicators

Fully typed with ambient declarations — enjoy rich editor hints and autocomplete.

---

## 📚 API Overview

All indicator namespaces expose:
- single: functions that compute a single value from the whole input
- bulk: functions that compute rolling outputs (arrays)

Common enums:
- ConstantModelType: SimpleMovingAverage, SmoothedMovingAverage, ExponentialMovingAverage, SimpleMovingMedian, SimpleMovingMode
- DeviationModel: StandardDeviation, MeanAbsoluteDeviation, MedianAbsoluteDeviation, ModeAbsoluteDeviation, UlcerIndex, LogStandardDeviation, LaplaceStdEquivalent, CauchyIQRScale
- Position: Long, Short (for SAR-like systems)
- MovingAverageType: Simple, Smoothed, Exponential (for generic moving average helpers)

Top namespaces:
- movingAverage: generic MAs and McGinley Dynamic
- momentumIndicators: RSI, Stochastic, MACD variants, PPO, MFI, OBV, CCI, Williams %R, Chaikin, CMO
- strengthIndicators: Accumulation/Distribution, PVI, NVI, RVI
- trendIndicators: Aroon (Up/Down/Oscillator), Parabolic Time Price System, Directional Movement System (+DI, –DI, ADX/ADXR), VPT, TSI
- volatilityIndicators: Ulcer Index, Wilder’s volatility system
- candleIndicators: Bands/Envelopes, Ichimoku, Donchian, Keltner, Supertrend
- correlationIndicators: Asset correlation
- chartTrends: Peaks/Valleys, trend lines, segmentation
- otherIndicators: ROI, True Range / ATR, Internal Bar Strength, Positivity Indicator

See the full set of function signatures via your editor or the included `index.d.ts`.

---

## 🧪 Usage Examples

Relative Strength Index (RSI)
```js
import init, { momentumIndicators, ConstantModelType } from "centaur-technical-indicators";
await init();

const prices = [100.2, 100.46, 100.53, 100.38, 100.19, 100.21, 100.32, 100.28];

// Full window (single)
const rsi = momentumIndicators.single.relativeStrengthIndex(
  prices.slice(0, 5),
  ConstantModelType.SimpleMovingAverage
);
// -> 49.2537313432832

// Rolling (bulk), period = 5
const rsiSeries = momentumIndicators.bulk.relativeStrengthIndex(
  prices,
  ConstantModelType.SimpleMovingAverage,
  5
);
// -> [49.2537..., 20.9302..., 27.6595..., 36.1111...]
```

MACD (EMA/EMA)
```js
import { momentumIndicators, ConstantModelType } from "centaur-technical-indicators";

const macdLine = momentumIndicators.single.macdLine(
  [100.46, 100.53, 100.38, 100.19, 100.21],
  3,
  ConstantModelType.ExponentialMovingAverage,
  ConstantModelType.ExponentialMovingAverage
);
// -> -0.06067027758972188

const signal = momentumIndicators.single.signalLine(
  [-0.06067027758972188, -0.022417061611406552, 0.005788761002008869],
  ConstantModelType.ExponentialMovingAverage
);
// -> -0.011764193829214216
```

Parabolic Time Price System (SAR)
```js
import { trendIndicators, Position, ConstantModelType } from "ti-engine";

// Long SAR track with rolling outputs
const sars = trendIndicators.bulk.parabolicTimePriceSystem(
  [100.64, 102.39, 101.51, 99.48, 96.93], // highs
  [95.92, 96.77, 95.84, 91.22, 89.12],    // lows
  0.02, 0.2, 0.02,                        // AF start, max, step
  Position.Long,                          // starting side
  0.0                                     // previous SAR (seed)
);
// -> [95.92, 95.92, 102.39, 101.9432, 101.17380800000001]
```

Ulcer Index (volatility)
```js
import { volatilityIndicators } from "ti-engine";

const ui = volatilityIndicators.single.ulcerIndex(
  [100.46, 100.53, 100.38, 100.19, 100.21]
);
// -> 0.21816086938686668
```

Moving Average helpers
```js
import { movingAverage, MovingAverageType } from "ti-engine";

const sma = movingAverage.single.movingAverage(
  [100.2, 100.46, 100.53, 100.38, 100.19],
  MovingAverageType.Simple
);
// -> 100.352
```

---

## 🔌 Builds and Initialization

This package includes three targets out of the box:

- Node: `dist/node/centaur_technical_indicators.js` (CommonJS require via index.node.js)
- Bundler: `dist/bundler/centaur_technical_indicators.js` (ESM, for Vite/Webpack/Rollup)
- Web: `dist/web/centaur_technical_indicators.js` (ESM + separate `.wasm`)

Import surfaces:

- Node: `import init, * as api from "centaur-technical-indicators/index.node.js";` (or default `import` from package root)
- Bundler/Web: `import init, * as api from "centaur-technical-indicators";`

Initialization:

- Web/Bundlers: You MUST `await init()` before calling indicators (it fetches/instantiates WASM).
- Node: `init()` is a no‑op, safe to call for parity in shared code paths.

---

## 🧠 Tips & Conventions

- Input validation mirrors Centaur Technical Indicators. Functions return errors for empty arrays, mismatched lengths, or period > length; the JS bindings translate these to thrown `Error`s whose `.message` preserves the upstream `TechnicalIndicatorError` text (e.g., `"Mismatched lengths: highs=5, lows=4"`).
- Use `Float64Array` or `number[]`. Internally, values are copied into WASM memory; consider chunking for very large series.
- Bulk functions typically return arrays of length `L - N + 1` where `N` is the rolling period (or long period for dual-period indicators).
- All outputs are plain JS arrays for easy consumption; tuples are represented as small arrays (e.g., `[lower, middle, upper]`).

---

## ⚠️ Limitations

These are intentional gaps relative to the [Rust crate](https://github.com/ChironMind/CentaurTechnicalIndicators-Rust):

- **Parameterized enum variants are not exposed.** `wasm-bindgen` does not support enums-with-data, so the JS enums are pruned to their unit variants only. Specifically, the following upstream variants cannot be constructed from JS:
  - `MovingAverageType::Personalised { alpha_num, alpha_den }`
  - `ConstantModelType::PersonalisedMovingAverage { alpha_num, alpha_den }`
  - `DeviationModel::CustomAbsoluteDeviation { config }`
  - `DeviationModel::StudentT { df }`
  - `DeviationModel::EmpiricalQuantileRange { low, high, precision }`

  Use the Rust crate directly if you need any of these. The JSDoc on each affected enum (`index.d.ts`) carries an `@remarks` block restating this.
- **Error messages are simplified but informative.** Errors thrown from JS preserve the Rust `TechnicalIndicatorError::Display` text but lose the structured variant info. Match on `.message` substrings, not on instanceof-style discriminants.
- **No streaming/incremental API.** All inputs must be fully materialised arrays. The McGinley Dynamic family takes a `previousMcginleyDynamic` seed for chained computation; other indicators do not.
- **`trendIndicators.bulk.volumePriceTrend` silently drops `volumes[0]` if `volumes.length === prices.length`.** Documented in the JSDoc as a loud `@warning`. The intended call shape is `volumes.length === prices.length - 1`.
- **`AbsDevConfig { center, aggregate }` is flattened.** Functions that take this upstream struct (`basicIndicators.{single,bulk}.absoluteDeviation`) instead take two positional enum parameters (`CentralPoint`, `DeviationAggregate`), since `wasm-bindgen` cannot construct the struct.

---

## 📈 Performance

- All math is executed in highly optimized Rust and compiled to WebAssembly.
- In Node, performance is near-native for numeric workloads.
- In browsers, expect excellent performance; account for WASM boundary crossings (amortize by passing larger slices).
- The published WASM is post-processed with `wasm-opt -O3` during `npm publish`, which typically shrinks the binary 20-40% and improves inlining.

### Microbenchmarks (run `npm run bench`)

A reproducible JS-side microbenchmark harness lives in `bench/run.js` and exercises a representative set of single + bulk indicators over a 1000-element series. Run it yourself to get numbers on your machine — wall-clock results depend heavily on CPU and Node version. Indicative ranges on a modern Apple Silicon laptop, Node 22:

```
movingAverage.single.movingAverage (SMA)            ~3-6  µs / call
momentumIndicators.single.relativeStrengthIndex     ~7-15 µs / call
momentumIndicators.bulk.relativeStrengthIndex (14)  ~20-40 µs / call
basicIndicators.bulk.variance (14)                  ~15-25 µs / call
```

For raw Rust benchmarks and methodology, see:
- [CentaurTechnicalIndicators-Rust Benchmarks](https://github.com/ChironMind/CentaurTechnicalIndicators-Rust-benchmarks)

---

## 🧪 Parity Tests

This repo includes value parity tests that assert equality with Centaur Technical Indicators for a selection of indicators across modules. Run them in Node:

```bash
npm test
# or
node --test test/*.test.js
```

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!
- Open an issue or discussion
- Submit a PR with tests (value parity preferred)
- Suggestions for new high‑value wrappers and DX improvements are appreciated

Please see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📰 Release Notes

See Git history and [changelog](CHANGELOG.md) for details.
We follow semver where possible for API changes.

---

## 📄 License

MIT License. See [LICENSE](LICENSE-MIT).

