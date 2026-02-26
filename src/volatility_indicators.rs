use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// -------- SINGLE --------

#[wasm_bindgen(js_name = volatility_single_ulcerIndex)]
pub fn volatility_single_ulcer_index(prices: Vec<f64>) -> f64 {
    centaur_technical_indicators::volatility_indicators::single::ulcer_index(&prices)
        .expect("Failed to calculate Ulcer Index")
}

// -------- BULK --------

#[wasm_bindgen(js_name = volatility_bulk_ulcerIndex)]
pub fn volatility_bulk_ulcer_index(prices: Vec<f64>, period: usize) -> Array {
    let data = centaur_technical_indicators::volatility_indicators::bulk::ulcer_index(&prices, period)
        .expect("Failed to calculate indicator");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[allow(deprecated)]
#[wasm_bindgen(js_name = volatility_bulk_volatilitySystem)]
pub fn volatility_bulk_volatility_system(
    close: Vec<f64>,
    high: Vec<f64>,
    low: Vec<f64>,
    period: usize,
    constant_multiplier: f64,
    constant_model_type: crate::ConstantModelType,
) -> Array {
    let data = centaur_technical_indicators::volatility_indicators::bulk::volatility_system(
        &high,
        &low,
        &close,
        period,
        constant_multiplier,
        constant_model_type.into(),
    )
        .expect("Failed to calculate indicator");
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}
