use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

/// Single-value correlation: returns a number
#[wasm_bindgen(js_name = correlation_single_correlateAssetPrices)]
pub fn correlation_single_correlate_asset_prices(
    prices_asset_a: Vec<f64>,
    prices_asset_b: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    deviation_model: crate::DeviationModel,
) -> f64 {
    rust_ti::correlation_indicators::single::correlate_asset_prices(
        &prices_asset_a,
        &prices_asset_b,
        constant_model_type.into(),
        deviation_model.into(),
    )
}

/// Rolling correlation over a period: returns Array<number>
#[wasm_bindgen(js_name = correlation_bulk_correlateAssetPrices)]
pub fn correlation_bulk_correlate_asset_prices(
    prices_asset_a: Vec<f64>,
    prices_asset_b: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    deviation_model: crate::DeviationModel,
    period: usize,
) -> Array {
    let data = rust_ti::correlation_indicators::bulk::correlate_asset_prices(
        &prices_asset_a,
        &prices_asset_b,
        constant_model_type.into(),
        deviation_model.into(),
        period,
    );
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}
