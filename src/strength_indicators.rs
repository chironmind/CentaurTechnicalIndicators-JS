use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// -------- SINGLE --------

#[wasm_bindgen(js_name = strength_single_accumulationDistribution)]
pub fn strength_single_accumulation_distribution(
    high: f64,
    low: f64,
    close: f64,
    volume: f64,
    previous_accumulation_distribution: f64,
) -> f64 {
    centaur_technical_indicators::strength_indicators::single::accumulation_distribution(
        high,
        low,
        close,
        volume,
        previous_accumulation_distribution,
    )
}

#[wasm_bindgen(js_name = strength_single_volumeIndex)]
pub fn strength_single_volume_index(
    current_close: f64,
    previous_close: f64,
    previous_volume_index: f64,
) -> f64 {
    centaur_technical_indicators::strength_indicators::single::volume_index(
        current_close,
        previous_close,
        previous_volume_index,
    )
}

#[wasm_bindgen(js_name = strength_single_relativeVigorIndex)]
pub fn strength_single_relative_vigor_index(
    open: Vec<f64>,
    high: Vec<f64>,
    low: Vec<f64>,
    close: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
) -> f64 {
    centaur_technical_indicators::strength_indicators::single::relative_vigor_index(
        &open,
        &high,
        &low,
        &close,
        constant_model_type.into(),
    )
}

// -------- BULK --------

#[wasm_bindgen(js_name = strength_bulk_accumulationDistribution)]
pub fn strength_bulk_accumulation_distribution(
    high: Vec<f64>,
    low: Vec<f64>,
    close: Vec<f64>,
    volume: Vec<f64>,
    previous_accumulation_distribution: f64,
) -> Array {
    let data = centaur_technical_indicators::strength_indicators::bulk::accumulation_distribution(
        &high,
        &low,
        &close,
        &volume,
        previous_accumulation_distribution,
    );
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = strength_bulk_positiveVolumeIndex)]
pub fn strength_bulk_positive_volume_index(
    close: Vec<f64>,
    volume: Vec<f64>,
    previous_positive_volume_index: f64,
) -> Array {
    let data = centaur_technical_indicators::strength_indicators::bulk::positive_volume_index(
        &close,
        &volume,
        previous_positive_volume_index,
    );
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = strength_bulk_negativeVolumeIndex)]
pub fn strength_bulk_negative_volume_index(
    close: Vec<f64>,
    volume: Vec<f64>,
    previous_negative_volume_index: f64,
) -> Array {
    let data = centaur_technical_indicators::strength_indicators::bulk::negative_volume_index(
        &close,
        &volume,
        previous_negative_volume_index,
    );
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = strength_bulk_relativeVigorIndex)]
pub fn strength_bulk_relative_vigor_index(
    open: Vec<f64>,
    high: Vec<f64>,
    low: Vec<f64>,
    close: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    period: usize,
) -> Array {
    let data = centaur_technical_indicators::strength_indicators::bulk::relative_vigor_index(
        &open,
        &high,
        &low,
        &close,
        constant_model_type.into(),
        period,
    );
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}
