use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// -------- SINGLE --------
#[wasm_bindgen(js_name = momentum_single_relativeStrengthIndex)]
pub fn momentum_single_relative_strength_index(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
) -> f64 {
    centaur_technical_indicators::momentum_indicators::single::relative_strength_index(
        &prices,
        constant_model_type.into(),
    )
    .expect("Failed to calculate RSI")
}

#[wasm_bindgen(js_name = momentum_single_stochasticOscillator)]
pub fn momentum_single_stochastic_oscillator(prices: Vec<f64>) -> f64 {
    centaur_technical_indicators::momentum_indicators::single::stochastic_oscillator(&prices)
        .expect("Failed to calculate stochastic oscillator")
}

#[allow(deprecated)]
#[wasm_bindgen(js_name = momentum_single_slowStochastic)]
pub fn momentum_single_slow_stochastic(
    stochastics: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
) -> f64 {
    centaur_technical_indicators::momentum_indicators::single::slow_stochastic(&stochastics, constant_model_type.into())
        .expect("Failed to calculate slow stochastic")
}

#[allow(deprecated)]
#[wasm_bindgen(js_name = momentum_single_slowestStochastic)]
pub fn momentum_single_slowest_stochastic(
    slow_stochastics: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
) -> f64 {
    centaur_technical_indicators::momentum_indicators::single::slowest_stochastic(
        &slow_stochastics,
        constant_model_type.into(),
    )
    .expect("Failed to calculate slowest stochastic")
}

#[wasm_bindgen(js_name = momentum_single_williamsPercentR)]
pub fn momentum_single_williams_percent_r(high: Vec<f64>, low: Vec<f64>, close: f64) -> f64 {
    centaur_technical_indicators::momentum_indicators::single::williams_percent_r(&high, &low, close)
        .expect("Failed to calculate Williams %R")
}

#[wasm_bindgen(js_name = momentum_single_moneyFlowIndex)]
pub fn momentum_single_money_flow_index(prices: Vec<f64>, volume: Vec<f64>) -> f64 {
    centaur_technical_indicators::momentum_indicators::single::money_flow_index(&prices, &volume)
        .expect("Failed to calculate Money Flow Index")
}

#[wasm_bindgen(js_name = momentum_single_rateOfChange)]
pub fn momentum_single_rate_of_change(current_price: f64, previous_price: f64) -> f64 {
    centaur_technical_indicators::momentum_indicators::single::rate_of_change(current_price, previous_price)
        .expect("Failed to calculate rate of change")
}

#[wasm_bindgen(js_name = momentum_single_onBalanceVolume)]
pub fn momentum_single_on_balance_volume(
    current_price: f64,
    previous_price: f64,
    current_volume: f64,
    previous_on_balance_volume: f64,
) -> f64 {
    centaur_technical_indicators::momentum_indicators::single::on_balance_volume(
        current_price,
        previous_price,
        current_volume,
        previous_on_balance_volume,
    )
    .expect("Failed to calculate On Balance Volume")
}

#[wasm_bindgen(js_name = momentum_single_commodityChannelIndex)]
pub fn momentum_single_commodity_channel_index(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    deviation_model: crate::DeviationModel,
    constant_multiplier: f64,
) -> f64 {
    centaur_technical_indicators::momentum_indicators::single::commodity_channel_index(
        &prices,
        constant_model_type.into(),
        deviation_model.into(),
        constant_multiplier,
    )
    .expect("Failed to calculate Commodity Channel Index")
}

#[wasm_bindgen(js_name = momentum_single_mcginleyDynamicCommodityChannelIndex)]
pub fn momentum_single_mcginley_dynamic_commodity_channel_index(
    prices: Vec<f64>,
    previous_mcginley_dynamic: f64,
    deviation_model: crate::DeviationModel,
    constant_multiplier: f64,
) -> Array {
    let (v, m) = centaur_technical_indicators::momentum_indicators::single::mcginley_dynamic_commodity_channel_index(
        &prices,
        previous_mcginley_dynamic,
        deviation_model.into(),
        constant_multiplier,
    )
    .expect("Failed to calculate McGinley Dynamic CCI");
    let arr = Array::new();
    arr.push(&JsValue::from_f64(v));
    arr.push(&JsValue::from_f64(m));
    arr
}

#[wasm_bindgen(js_name = momentum_single_macdLine)]
pub fn momentum_single_macd_line(
    prices: Vec<f64>,
    short_period: usize,
    short_period_model: crate::ConstantModelType,
    long_period_model: crate::ConstantModelType,
) -> f64 {
    centaur_technical_indicators::momentum_indicators::single::macd_line(
        &prices,
        short_period,
        short_period_model.into(),
        long_period_model.into(),
    )
    .expect("Failed to calculate MACD line")
}

#[allow(deprecated)]
#[wasm_bindgen(js_name = momentum_single_signalLine)]
pub fn momentum_single_signal_line(
    macds: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
) -> f64 {
    centaur_technical_indicators::momentum_indicators::single::signal_line(&macds, constant_model_type.into())
        .expect("Failed to calculate signal line")
}

#[wasm_bindgen(js_name = momentum_single_mcginleyDynamicMacdLine)]
pub fn momentum_single_mcginley_dynamic_macd_line(
    prices: Vec<f64>,
    short_period: usize,
    previous_short_mcginley: f64,
    previous_long_mcginley: f64,
) -> Array {
    let (macd, short_m, long_m) = centaur_technical_indicators::momentum_indicators::single::mcginley_dynamic_macd_line(
        &prices,
        short_period,
        previous_short_mcginley,
        previous_long_mcginley,
    )
    .expect("Failed to calculate McGinley Dynamic MACD line");
    let arr = Array::new();
    arr.push(&JsValue::from_f64(macd));
    arr.push(&JsValue::from_f64(short_m));
    arr.push(&JsValue::from_f64(long_m));
    arr
}

#[wasm_bindgen(js_name = momentum_single_chaikinOscillator)]
pub fn momentum_single_chaikin_oscillator(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    volume: Vec<f64>,
    short_period: usize,
    previous_accumulation_distribution: f64,
    short_period_model: crate::ConstantModelType,
    long_period_model: crate::ConstantModelType,
) -> Array {
    let (v, ad) = centaur_technical_indicators::momentum_indicators::single::chaikin_oscillator(
        &highs,
        &lows,
        &close,
        &volume,
        short_period,
        previous_accumulation_distribution,
        short_period_model.into(),
        long_period_model.into(),
    )
    .expect("Failed to calculate Chaikin Oscillator");
    let arr = Array::new();
    arr.push(&JsValue::from_f64(v));
    arr.push(&JsValue::from_f64(ad));
    arr
}

#[wasm_bindgen(js_name = momentum_single_percentagePriceOscillator)]
pub fn momentum_single_percentage_price_oscillator(
    prices: Vec<f64>,
    short_period: usize,
    constant_model_type: crate::ConstantModelType,
) -> f64 {
    centaur_technical_indicators::momentum_indicators::single::percentage_price_oscillator(
        &prices,
        short_period,
        constant_model_type.into(),
    )
    .expect("Failed to calculate Percentage Price Oscillator")
}

#[wasm_bindgen(js_name = momentum_single_chandeMomentumOscillator)]
pub fn momentum_single_chande_momentum_oscillator(prices: Vec<f64>) -> f64 {
    centaur_technical_indicators::momentum_indicators::single::chande_momentum_oscillator(&prices)
        .expect("Failed to calculate Chande Momentum Oscillator")
}

// -------- BULK --------
#[wasm_bindgen(js_name = momentum_bulk_relativeStrengthIndex)]
pub fn momentum_bulk_relative_strength_index(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    period: usize,
) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::relative_strength_index(
        &prices,
        constant_model_type.into(),
        period,
    )
    .expect("Failed to calculate RSI values");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = momentum_bulk_stochasticOscillator)]
pub fn momentum_bulk_stochastic_oscillator(prices: Vec<f64>, period: usize) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::stochastic_oscillator(&prices, period)
        .expect("Failed to calculate stochastic oscillator values");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[allow(deprecated)]
#[wasm_bindgen(js_name = momentum_bulk_slowStochastic)]
pub fn momentum_bulk_slow_stochastic(
    stochastics: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    period: usize,
) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::slow_stochastic(
        &stochastics,
        constant_model_type.into(),
        period,
    )
    .expect("Failed to calculate slow stochastic values");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[allow(deprecated)]
#[wasm_bindgen(js_name = momentum_bulk_slowestStochastic)]
pub fn momentum_bulk_slowest_stochastic(
    slow_stochastics: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    period: usize,
) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::slowest_stochastic(
        &slow_stochastics,
        constant_model_type.into(),
        period,
    )
    .expect("Failed to calculate slowest stochastic values");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = momentum_bulk_williamsPercentR)]
pub fn momentum_bulk_williams_percent_r(
    high: Vec<f64>,
    low: Vec<f64>,
    close: Vec<f64>,
    period: usize,
) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::williams_percent_r(&high, &low, &close, period)
        .expect("Failed to calculate Williams %R values");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = momentum_bulk_moneyFlowIndex)]
pub fn momentum_bulk_money_flow_index(prices: Vec<f64>, volume: Vec<f64>, period: usize) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::money_flow_index(&prices, &volume, period)
        .expect("Failed to calculate Money Flow Index values");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = momentum_bulk_rateOfChange)]
pub fn momentum_bulk_rate_of_change(prices: Vec<f64>) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::rate_of_change(&prices)
        .expect("Failed to calculate rate of change values");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = momentum_bulk_onBalanceVolume)]
pub fn momentum_bulk_on_balance_volume(
    prices: Vec<f64>,
    volume: Vec<f64>,
    previous_on_balance_volume: f64,
) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::on_balance_volume(
        &prices,
        &volume,
        previous_on_balance_volume,
    )
    .expect("Failed to calculate On Balance Volume values");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = momentum_bulk_commodityChannelIndex)]
pub fn momentum_bulk_commodity_channel_index(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    deviation_model: crate::DeviationModel,
    constant_multiplier: f64,
    period: usize,
) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::commodity_channel_index(
        &prices,
        constant_model_type.into(),
        deviation_model.into(),
        constant_multiplier,
        period,
    )
    .expect("Failed to calculate CCI values");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = momentum_bulk_mcginleyDynamicCommodityChannelIndex)]
pub fn momentum_bulk_mcginley_dynamic_commodity_channel_index(
    prices: Vec<f64>,
    previous_mcginley_dynamic: f64,
    deviation_model: crate::DeviationModel,
    constant_multiplier: f64,
    period: usize,
) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::mcginley_dynamic_commodity_channel_index(
        &prices,
        previous_mcginley_dynamic,
        deviation_model.into(),
        constant_multiplier,
        period,
    )
    .expect("Failed to calculate McGinley Dynamic CCI values");
    let out = Array::new();
    for (v, m) in data {
        let inner = Array::new();
        inner.push(&JsValue::from_f64(v));
        inner.push(&JsValue::from_f64(m));
        out.push(&inner);
    }
    out
}

#[wasm_bindgen(js_name = momentum_bulk_macdLine)]
pub fn momentum_bulk_macd_line(
    prices: Vec<f64>,
    short_period: usize,
    short_period_model: crate::ConstantModelType,
    long_period: usize,
    long_period_model: crate::ConstantModelType,
) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::macd_line(
        &prices,
        short_period,
        short_period_model.into(),
        long_period,
        long_period_model.into(),
    )
    .expect("Failed to calculate MACD line values");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[allow(deprecated)]
#[wasm_bindgen(js_name = momentum_bulk_signalLine)]
pub fn momentum_bulk_signal_line(
    macds: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    period: usize,
) -> Array {
    let data =
        centaur_technical_indicators::momentum_indicators::bulk::signal_line(&macds, constant_model_type.into(), period)
            .expect("Failed to calculate signal line values");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = momentum_bulk_mcginleyDynamicMacdLine)]
pub fn momentum_bulk_mcginley_dynamic_macd_line(
    prices: Vec<f64>,
    short_period: usize,
    previous_short_mcginley: f64,
    long_period: usize,
    previous_long_mcginley: f64,
) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::mcginley_dynamic_macd_line(
        &prices,
        short_period,
        previous_short_mcginley,
        long_period,
        previous_long_mcginley,
    )
    .expect("Failed to calculate McGinley Dynamic MACD line values");
    let out = Array::new();
    for (macd, short_m, long_m) in data {
        let inner = Array::new();
        inner.push(&JsValue::from_f64(macd));
        inner.push(&JsValue::from_f64(short_m));
        inner.push(&JsValue::from_f64(long_m));
        out.push(&inner);
    }
    out
}

#[wasm_bindgen(js_name = momentum_bulk_chaikinOscillator)]
pub fn momentum_bulk_chaikin_oscillator(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    volume: Vec<f64>,
    short_period: usize,
    long_period: usize,
    previous_accumulation_distribution: f64,
    short_period_model: crate::ConstantModelType,
    long_period_model: crate::ConstantModelType,
) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::chaikin_oscillator(
        &highs,
        &lows,
        &close,
        &volume,
        short_period,
        long_period,
        previous_accumulation_distribution,
        short_period_model.into(),
        long_period_model.into(),
    )
    .expect("Failed to calculate Chaikin Oscillator values");
    let out = Array::new();
    for (v, ad) in data {
        let inner = Array::new();
        inner.push(&JsValue::from_f64(v));
        inner.push(&JsValue::from_f64(ad));
        out.push(&inner);
    }
    out
}

#[wasm_bindgen(js_name = momentum_bulk_percentagePriceOscillator)]
pub fn momentum_bulk_percentage_price_oscillator(
    prices: Vec<f64>,
    short_period: usize,
    long_period: usize,
    constant_model_type: crate::ConstantModelType,
) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::percentage_price_oscillator(
        &prices,
        short_period,
        long_period,
        constant_model_type.into(),
    )
    .expect("Failed to calculate Percentage Price Oscillator values");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = momentum_bulk_chandeMomentumOscillator)]
pub fn momentum_bulk_chande_momentum_oscillator(prices: Vec<f64>, period: usize) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::chande_momentum_oscillator(&prices, period)
        .expect("Failed to calculate Chande Momentum Oscillator values");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}
