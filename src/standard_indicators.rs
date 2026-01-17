use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// -------- SINGLE --------

#[wasm_bindgen(js_name = standard_single_simpleMovingAverage)]
pub fn standard_single_simple_moving_average(prices: Vec<f64>) -> f64 {
    rust_ti::standard_indicators::single::simple_moving_average(&prices)
}

#[wasm_bindgen(js_name = standard_single_smoothedMovingAverage)]
pub fn standard_single_smoothed_moving_average(prices: Vec<f64>) -> f64 {
    rust_ti::standard_indicators::single::smoothed_moving_average(&prices)
}

#[wasm_bindgen(js_name = standard_single_exponentialMovingAverage)]
pub fn standard_single_exponential_moving_average(prices: Vec<f64>) -> f64 {
    rust_ti::standard_indicators::single::exponential_moving_average(&prices)
}

#[wasm_bindgen(js_name = standard_single_bollingerBands)]
pub fn standard_single_bollinger_bands(prices: Vec<f64>) -> Array {
    let (l, m, u) = rust_ti::standard_indicators::single::bollinger_bands(&prices);
    let arr = Array::new();
    arr.push(&JsValue::from_f64(l));
    arr.push(&JsValue::from_f64(m));
    arr.push(&JsValue::from_f64(u));
    arr
}

#[wasm_bindgen(js_name = standard_single_macd)]
pub fn standard_single_macd(prices: Vec<f64>) -> Array {
    let (macd, signal, hist) = rust_ti::standard_indicators::single::macd(&prices);
    let arr = Array::new();
    arr.push(&JsValue::from_f64(macd));
    arr.push(&JsValue::from_f64(signal));
    arr.push(&JsValue::from_f64(hist));
    arr
}

#[wasm_bindgen(js_name = standard_single_rsi)]
pub fn standard_single_rsi(prices: Vec<f64>) -> f64 {
    rust_ti::standard_indicators::single::rsi(&prices)
}

// -------- BULK --------

#[wasm_bindgen(js_name = standard_bulk_simpleMovingAverage)]
pub fn standard_bulk_simple_moving_average(prices: Vec<f64>, period: usize) -> Array {
    let data = rust_ti::standard_indicators::bulk::simple_moving_average(&prices, period);
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = standard_bulk_smoothedMovingAverage)]
pub fn standard_bulk_smoothed_moving_average(prices: Vec<f64>, period: usize) -> Array {
    let data = rust_ti::standard_indicators::bulk::smoothed_moving_average(&prices, period);
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = standard_bulk_exponentialMovingAverage)]
pub fn standard_bulk_exponential_moving_average(prices: Vec<f64>, period: usize) -> Array {
    let data = rust_ti::standard_indicators::bulk::exponential_moving_average(&prices, period);
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = standard_bulk_bollingerBands)]
pub fn standard_bulk_bollinger_bands(prices: Vec<f64>) -> Array {
    let data = rust_ti::standard_indicators::bulk::bollinger_bands(&prices);
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
    let data = rust_ti::standard_indicators::bulk::macd(&prices);
    let out = Array::new();
    for (macd, signal, hist) in data {
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
    let data = rust_ti::standard_indicators::bulk::rsi(&prices);
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}
