use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// -------- SINGLE --------

#[wasm_bindgen(js_name = volatility_single_ulcerIndex)]
pub fn volatility_single_ulcer_index(prices: Vec<f64>) -> f64 {
    rust_ti::volatility_indicators::single::ulcer_index(&prices)
}

// -------- BULK --------

#[wasm_bindgen(js_name = volatility_bulk_ulcerIndex)]
pub fn volatility_bulk_ulcer_index(prices: Vec<f64>, period: usize) -> Array {
    let data = rust_ti::volatility_indicators::bulk::ulcer_index(&prices, period);
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = volatility_bulk_volatilitySystem)]
pub fn volatility_bulk_volatility_system(
    high: Vec<f64>,
    low: Vec<f64>,
    close: Vec<f64>,
    period: usize,
    constant_multiplier: f64,
    constant_model_type: crate::ConstantModelType,
) -> Array {
    let data = rust_ti::volatility_indicators::bulk::volatility_system(
        &high,
        &low,
        &close,
        period,
        constant_multiplier,
        constant_model_type.into(),
    );
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}
