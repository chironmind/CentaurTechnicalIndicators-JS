# CentaurTechnicalIndicators-JS

CentaurTechnicalIndicators-JS is a fast, type‑safe technical analysis toolkit for JavaScript/TypeScript. It’s built in Rust, compiled to WebAssembly, and exposed through a clean TS API. Use it to compute classic indicators (RSI, MACD, Bollinger Bands, ADX, ATR, etc.), bands and envelopes, McGinley Dynamic variants, Ichimoku, trend breakdowns, correlation, and more.

- Runs in Node and the browser
- Strongly typed API with rich JSDoc
- Single-value and rolling/bulk variants for most indicators
- Designed for performance and predictable windowing semantics

---

## Quick start

Install:

```bash
npm install centaur-technical-indicators-js
# or
yarn add centaur-technical-indicators-js
# or
pnpm add centaur-technical-indicators-js
```

Initialize and use:

```ts
import init, {
  ConstantModelType,
  DeviationModel,
  standardIndicators,
  momentumIndicators,
  candleIndicators,
} from "centaur-technical-indicators-js";

// Browser: must await init(); Node: it's a no-op but safe to call.
await init();

// Example data
const prices = [/* ...close prices... */];
const highs  = [/* ... */];
const lows   = [/* ... */];
const close  = [/* ... */];

// 1) Standard RSI (14) using Smoothed MA
// single.rsi expects exactly 14 values for the standard definition.
const rsi14 = standardIndicators.single.rsi(prices.slice(-14));

// 2) Rolling RSI with custom model/period; take the latest value
const rsiSeries = momentumIndicators.bulk.relativeStrengthIndex(
  prices,
  ConstantModelType.SmoothedMovingAverage,
  14
);
const latestRsi = rsiSeries.at(-1);

// 3) Standard Bollinger Bands (20 SMA, ±2 StdDev) on the last 20 bars
const [bbLower, bbMid, bbUpper] = standardIndicators.single.bollingerBands(
  prices.slice(-20)
);

// 4) Keltner Channel (EMA center, SMA ATR) over a 20-bar window; take the latest
const keltner = candleIndicators.bulk.keltnerChannel(
  highs, lows, close,
  ConstantModelType.ExponentialMovingAverage, // typical price center
  ConstantModelType.SimpleMovingAverage,      // ATR smoothing
  2.0,                                        // width multiplier
  20
).at(-1);
```

---

## Concepts and structure

Each indicator family exposes:
- single: computes a single value from the full window you pass in
- bulk: computes rolling values over a sliding window

Available modules:
- Candle indicators: Envelopes, Bands (StdDev/MAD/MAD-Median/ModeAD/Ulcer), Donchian, Keltner, Supertrend, Ichimoku
- Momentum: RSI, Stochastics (fast/slow/slowest), Williams %R, MFI, RoC, OBV, CCI, MACD and variants (including McGinley and PPO), Chaikin Oscillator, CMO
- Trend: Aroon (Up/Down/Oscillator), Parabolic SAR (Wilder variant), DMS (+DI, −DI, ADX, ADXR), Volume Price Trend, True Strength Index
- Strength: Accumulation/Distribution, Positive/Negative Volume Index, Relative Vigor Index
- Volatility: Ulcer Index, Wilder’s volatility system
- Correlation: Rolling/single price correlation with configurable central/deviation models
- Moving average utilities: SMA, Smoothed, EMA, McGinley Dynamic (single and rolling)
- Chart trends: Peaks, valleys, OLS trend lines, and automatic trend range breakdowns

Key types (re-exported for convenience):
- ConstantModelType: SimpleMovingAverage, SmoothedMovingAverage, ExponentialMovingAverage, SimpleMovingMedian, SimpleMovingMode
- DeviationModel: StandardDeviation, MeanAbsoluteDeviation, MedianAbsoluteDeviation, ModeAbsoluteDeviation, UlcerIndex
- MovingAverageType: Simple | Smoothed | Exponential
- Position: Long | Short (for SAR systems)

---

## Usage notes

- Windowing: For bulk APIs with a period N and input length L, output length is L − N + 1.
- Alignment: The i-th output corresponds to input window [i..i+N−1].
- Typed arrays: number[] and Float64Array are both accepted.
- OHLC alignment: Arrays such as highs/lows/close must have equal lengths.

---

## Tutorials

Dive in with step‑by‑step guides. 

- [01 - Getting started with CentaurTechnicalIndicators-JS](tutorials/getting-started.md)
- [02 - Visualizing Indicators with Plotly](tutorials/plotting.md)
- [03 - More advanced use cases](tutorials/advanced.md)
- [04 - Getting data from an API](tutorials/api.md)
- [05 - Real-time updates with WebSockets (single vs bulk)](tutorials/websockets.md)

---

## How‑to guides

Task‑oriented recipes and snippets. 

- [Bulk vs Single Functions](howto/bulk-vs-single.md)
- [Choose Constant Model Type](howto/choose-constant-model.md)
- [Choose Deviation Model](howto/choose-deviation-model.md)
- [Choose Period](howto/choose-period.md)
- [McGinley Dynamic Bands](howto/mcginley-dynamic.md)

---

## API reference

[API docs](api/index)

For raw type declarations, see:
- Source: https://github.com/chironmind/CentaurTechnicalIndicators-JS/blob/main/index.d.ts

---

## Contributing

Issues, feature requests, and contributions are welcome.  
Repository: https://github.com/chironmind/CentaurTechnicalIndicators-JS

---

## License

MIT
