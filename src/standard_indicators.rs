use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// -------- SINGLE --------

#[wasm_bindgen(js_name = standard_single_simpleMovingAverage)]
pub fn standard_single_simple_moving_average(prices: Vec<f64>) -> f64 {
    centaur_technical_indicators::moving_average::single::moving_average(
        &prices,
        centaur_technical_indicators::MovingAverageType::Simple,
    )
    .expect("Failed to calculate simple moving average")
}

#[wasm_bindgen(js_name = standard_single_smoothedMovingAverage)]
pub fn standard_single_smoothed_moving_average(prices: Vec<f64>) -> f64 {
    centaur_technical_indicators::moving_average::single::moving_average(
        &prices,
        centaur_technical_indicators::MovingAverageType::Smoothed,
    )
    .expect("Failed to calculate smoothed moving average")
}

#[wasm_bindgen(js_name = standard_single_exponentialMovingAverage)]
pub fn standard_single_exponential_moving_average(prices: Vec<f64>) -> f64 {
    centaur_technical_indicators::moving_average::single::moving_average(
        &prices,
        centaur_technical_indicators::MovingAverageType::Exponential,
    )
    .expect("Failed to calculate exponential moving average")
}

#[wasm_bindgen(js_name = standard_single_bollingerBands)]
pub fn standard_single_bollinger_bands(prices: Vec<f64>) -> Array {
    let (l, m, u) = centaur_technical_indicators::candle_indicators::single::moving_constant_bands(
        &prices,
        centaur_technical_indicators::ConstantModelType::SimpleMovingAverage,
        centaur_technical_indicators::DeviationModel::StandardDeviation,
        2.0,
    )
    .expect("Failed to calculate Bollinger Bands");
    let arr = Array::new();
    arr.push(&JsValue::from_f64(l));
    arr.push(&JsValue::from_f64(m));
    arr.push(&JsValue::from_f64(u));
    arr
}

#[wasm_bindgen(js_name = standard_single_macd)]
pub fn standard_single_macd(prices: Vec<f64>) -> Array {
    // Standard MACD uses 12, 26, 9 parameters (short, long, signal)
    // We need to calculate MACD line and signal line for the full series
    
    // Calculate MACD line from all prices
    let macd = centaur_technical_indicators::momentum_indicators::single::macd_line(
        &prices,
        12,
        centaur_technical_indicators::ConstantModelType::ExponentialMovingAverage,
        centaur_technical_indicators::ConstantModelType::ExponentialMovingAverage,
    )
    .expect("Failed to calculate MACD line");
    
    // To calculate signal line, we need to compute MACD for rolling windows
    // and then apply EMA(9) on those MACD values
    // For a 26-period minimum, we start from index 25
    let mut macd_values: Vec<f64> = Vec::new();
    for i in 25..prices.len() {
        let slice = &prices[0..=i];
        let macd_val = centaur_technical_indicators::momentum_indicators::single::macd_line(
            slice,
            12,
            centaur_technical_indicators::ConstantModelType::ExponentialMovingAverage,
            centaur_technical_indicators::ConstantModelType::ExponentialMovingAverage,
        )
        .expect("Failed to calculate MACD line for signal");
        macd_values.push(macd_val);
    }
    
    let signal = centaur_technical_indicators::momentum_indicators::single::signal_line(
        &macd_values,
        centaur_technical_indicators::ConstantModelType::ExponentialMovingAverage,
    )
    .expect("Failed to calculate signal line");
    
    let hist = macd - signal;
    
    let arr = Array::new();
    arr.push(&JsValue::from_f64(macd));
    arr.push(&JsValue::from_f64(signal));
    arr.push(&JsValue::from_f64(hist));
    arr
}

#[wasm_bindgen(js_name = standard_single_rsi)]
pub fn standard_single_rsi(prices: Vec<f64>) -> f64 {
    centaur_technical_indicators::momentum_indicators::single::relative_strength_index(
        &prices,
        centaur_technical_indicators::ConstantModelType::SmoothedMovingAverage,
    )
    .expect("Failed to calculate RSI")
}

// -------- BULK --------

#[wasm_bindgen(js_name = standard_bulk_simpleMovingAverage)]
pub fn standard_bulk_simple_moving_average(prices: Vec<f64>, period: usize) -> Array {
    let data = centaur_technical_indicators::moving_average::bulk::moving_average(
        &prices,
        centaur_technical_indicators::MovingAverageType::Simple,
        period,
    )
    .expect("Failed to calculate simple moving average");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = standard_bulk_smoothedMovingAverage)]
pub fn standard_bulk_smoothed_moving_average(prices: Vec<f64>, period: usize) -> Array {
    let data = centaur_technical_indicators::moving_average::bulk::moving_average(
        &prices,
        centaur_technical_indicators::MovingAverageType::Smoothed,
        period,
    )
    .expect("Failed to calculate smoothed moving average");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = standard_bulk_exponentialMovingAverage)]
pub fn standard_bulk_exponential_moving_average(prices: Vec<f64>, period: usize) -> Array {
    let data = centaur_technical_indicators::moving_average::bulk::moving_average(
        &prices,
        centaur_technical_indicators::MovingAverageType::Exponential,
        period,
    )
    .expect("Failed to calculate exponential moving average");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = standard_bulk_bollingerBands)]
pub fn standard_bulk_bollinger_bands(prices: Vec<f64>) -> Array {
    let data = centaur_technical_indicators::candle_indicators::bulk::moving_constant_bands(
        &prices,
        centaur_technical_indicators::ConstantModelType::SimpleMovingAverage,
        centaur_technical_indicators::DeviationModel::StandardDeviation,
        2.0,
        20,
    )
    .expect("Failed to calculate Bollinger Bands");
    let out = Array::new();
    for (l, m, u) in data {
        let t = Array::new();
        t.push(&JsValue::from_f64(l));
        t.push(&JsValue::from_f64(m));
        t.push(&JsValue::from_f64(u));
        out.push(&t);
    }
    out
}

#[wasm_bindgen(js_name = standard_bulk_macd)]
pub fn standard_bulk_macd(prices: Vec<f64>) -> Array {
    let macd_lines = centaur_technical_indicators::momentum_indicators::bulk::macd_line(
        &prices,
        12,
        centaur_technical_indicators::ConstantModelType::ExponentialMovingAverage,
        26,
        centaur_technical_indicators::ConstantModelType::ExponentialMovingAverage,
    )
    .expect("Failed to calculate MACD lines");
    
    let signal_lines = centaur_technical_indicators::momentum_indicators::bulk::signal_line(
        &macd_lines,
        centaur_technical_indicators::ConstantModelType::ExponentialMovingAverage,
        9,
    )
    .expect("Failed to calculate signal lines");
    
    let out = Array::new();
    // Signal lines will be shorter than MACD lines due to the 9-period requirement
    // We need to skip the first (macd_lines.len() - signal_lines.len()) MACD values
    let skip = macd_lines.len() - signal_lines.len();
    for i in 0..signal_lines.len() {
        let macd = macd_lines[i + skip];
        let signal = signal_lines[i];
        let hist = macd - signal;
        let t = Array::new();
        t.push(&JsValue::from_f64(macd));
        t.push(&JsValue::from_f64(signal));
        t.push(&JsValue::from_f64(hist));
        out.push(&t);
    }
    out
}

#[wasm_bindgen(js_name = standard_bulk_rsi)]
pub fn standard_bulk_rsi(prices: Vec<f64>) -> Array {
    let data = centaur_technical_indicators::momentum_indicators::bulk::relative_strength_index(
        &prices,
        centaur_technical_indicators::ConstantModelType::SmoothedMovingAverage,
        14,
    )
    .expect("Failed to calculate RSI");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}
