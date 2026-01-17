use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// ------------- SINGLE -------------
#[wasm_bindgen(js_name = candle_single_movingConstantEnvelopes)]
pub fn candle_single_moving_constant_envelopes(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    difference: f64,
) -> Array {
    let (l, m, u) = rust_ti::candle_indicators::single::moving_constant_envelopes(
        &prices,
        constant_model_type.into(),
        difference,
    );
    let arr = Array::new();
    arr.push(&JsValue::from_f64(l));
    arr.push(&JsValue::from_f64(m));
    arr.push(&JsValue::from_f64(u));
    arr
}

#[wasm_bindgen(js_name = candle_single_mcginleyDynamicEnvelopes)]
pub fn candle_single_mcginley_dynamic_envelopes(
    prices: Vec<f64>,
    difference: f64,
    previous_mcginley_dynamic: f64,
) -> Array {
    let (l, m, u) = rust_ti::candle_indicators::single::mcginley_dynamic_envelopes(
        &prices,
        difference,
        previous_mcginley_dynamic,
    );
    let arr = Array::new();
    arr.push(&JsValue::from_f64(l));
    arr.push(&JsValue::from_f64(m));
    arr.push(&JsValue::from_f64(u));
    arr
}

#[wasm_bindgen(js_name = candle_single_movingConstantBands)]
pub fn candle_single_moving_constant_bands(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    deviation_model: crate::DeviationModel,
    deviation_multiplier: f64,
) -> Array {
    let (l, m, u) = rust_ti::candle_indicators::single::moving_constant_bands(
        &prices,
        constant_model_type.into(),
        deviation_model.into(),
        deviation_multiplier,
    );
    let arr = Array::new();
    arr.push(&JsValue::from_f64(l));
    arr.push(&JsValue::from_f64(m));
    arr.push(&JsValue::from_f64(u));
    arr
}

#[wasm_bindgen(js_name = candle_single_mcginleyDynamicBands)]
pub fn candle_single_mcginley_dynamic_bands(
    prices: Vec<f64>,
    deviation_model: crate::DeviationModel,
    deviation_multiplier: f64,
    previous_mcginley_dynamic: f64,
) -> Array {
    let (l, m, u) = rust_ti::candle_indicators::single::mcginley_dynamic_bands(
        &prices,
        deviation_model.into(),
        deviation_multiplier,
        previous_mcginley_dynamic,
    );
    let arr = Array::new();
    arr.push(&JsValue::from_f64(l));
    arr.push(&JsValue::from_f64(m));
    arr.push(&JsValue::from_f64(u));
    arr
}

#[wasm_bindgen(js_name = candle_single_ichimokuCloud)]
pub fn candle_single_ichimoku_cloud(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    conversion_period: usize,
    base_period: usize,
    span_b_period: usize,
) -> Array {
    let (a, b, base, conv, displaced_close) = rust_ti::candle_indicators::single::ichimoku_cloud(
        &highs,
        &lows,
        &close,
        conversion_period,
        base_period,
        span_b_period,
    );
    let arr = Array::new();
    arr.push(&JsValue::from_f64(a));
    arr.push(&JsValue::from_f64(b));
    arr.push(&JsValue::from_f64(base));
    arr.push(&JsValue::from_f64(conv));
    arr.push(&JsValue::from_f64(displaced_close));
    arr
}

#[wasm_bindgen(js_name = candle_single_donchianChannels)]
pub fn candle_single_donchian_channels(highs: Vec<f64>, lows: Vec<f64>) -> Array {
    let (l, m, u) = rust_ti::candle_indicators::single::donchian_channels(&highs, &lows);
    let arr = Array::new();
    arr.push(&JsValue::from_f64(l));
    arr.push(&JsValue::from_f64(m));
    arr.push(&JsValue::from_f64(u));
    arr
}

#[wasm_bindgen(js_name = candle_single_keltnerChannel)]
pub fn candle_single_keltner_channel(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    atr_constant_model_type: crate::ConstantModelType,
    multiplier: f64,
) -> Array {
    let (l, m, u) = rust_ti::candle_indicators::single::keltner_channel(
        &highs,
        &lows,
        &close,
        constant_model_type.into(),
        atr_constant_model_type.into(),
        multiplier,
    );
    let arr = Array::new();
    arr.push(&JsValue::from_f64(l));
    arr.push(&JsValue::from_f64(m));
    arr.push(&JsValue::from_f64(u));
    arr
}

#[wasm_bindgen(js_name = candle_single_supertrend)]
pub fn candle_single_supertrend(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    multiplier: f64,
) -> f64 {
    rust_ti::candle_indicators::single::supertrend(
        &highs,
        &lows,
        &close,
        constant_model_type.into(),
        multiplier,
    )
}

// ------------- BULK -------------
#[wasm_bindgen(js_name = candle_bulk_movingConstantEnvelopes)]
pub fn candle_bulk_moving_constant_envelopes(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    difference: f64,
    period: usize,
) -> Array {
    let data = rust_ti::candle_indicators::bulk::moving_constant_envelopes(
        &prices,
        constant_model_type.into(),
        difference,
        period,
    );
    let outer = Array::new();
    for (l, m, u) in data {
        let inner = Array::new();
        inner.push(&JsValue::from_f64(l));
        inner.push(&JsValue::from_f64(m));
        inner.push(&JsValue::from_f64(u));
        outer.push(&inner);
    }
    outer
}

#[wasm_bindgen(js_name = candle_bulk_mcginleyDynamicEnvelopes)]
pub fn candle_bulk_mcginley_dynamic_envelopes(
    prices: Vec<f64>,
    difference: f64,
    previous_mcginley_dynamic: f64,
    period: usize,
) -> Array {
    let data = rust_ti::candle_indicators::bulk::mcginley_dynamic_envelopes(
        &prices,
        difference,
        previous_mcginley_dynamic,
        period,
    );
    let outer = Array::new();
    for (l, m, u) in data {
        let inner = Array::new();
        inner.push(&JsValue::from_f64(l));
        inner.push(&JsValue::from_f64(m));
        inner.push(&JsValue::from_f64(u));
        outer.push(&inner);
    }
    outer
}

#[wasm_bindgen(js_name = candle_bulk_movingConstantBands)]
pub fn candle_bulk_moving_constant_bands(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    deviation_model: crate::DeviationModel,
    deviation_multiplier: f64,
    period: usize,
) -> Array {
    let data = rust_ti::candle_indicators::bulk::moving_constant_bands(
        &prices,
        constant_model_type.into(),
        deviation_model.into(),
        deviation_multiplier,
        period,
    );
    let outer = Array::new();
    for (l, m, u) in data {
        let inner = Array::new();
        inner.push(&JsValue::from_f64(l));
        inner.push(&JsValue::from_f64(m));
        inner.push(&JsValue::from_f64(u));
        outer.push(&inner);
    }
    outer
}

#[wasm_bindgen(js_name = candle_bulk_mcginleyDynamicBands)]
pub fn candle_bulk_mcginley_dynamic_bands(
    prices: Vec<f64>,
    deviation_model: crate::DeviationModel,
    deviation_multiplier: f64,
    previous_mcginley_dynamic: f64,
    period: usize,
) -> Array {
    let data = rust_ti::candle_indicators::bulk::mcginley_dynamic_bands(
        &prices,
        deviation_model.into(),
        deviation_multiplier,
        previous_mcginley_dynamic,
        period,
    );
    let outer = Array::new();
    for (l, m, u) in data {
        let inner = Array::new();
        inner.push(&JsValue::from_f64(l));
        inner.push(&JsValue::from_f64(m));
        inner.push(&JsValue::from_f64(u));
        outer.push(&inner);
    }
    outer
}

#[wasm_bindgen(js_name = candle_bulk_ichimokuCloud)]
pub fn candle_bulk_ichimoku_cloud(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    conversion_period: usize,
    base_period: usize,
    span_b_period: usize,
) -> Array {
    let data = rust_ti::candle_indicators::bulk::ichimoku_cloud(
        &highs,
        &lows,
        &close,
        conversion_period,
        base_period,
        span_b_period,
    );
    let outer = Array::new();
    for (a, b, base, conv, displaced_close) in data {
        let inner = Array::new();
        inner.push(&JsValue::from_f64(a));
        inner.push(&JsValue::from_f64(b));
        inner.push(&JsValue::from_f64(base));
        inner.push(&JsValue::from_f64(conv));
        inner.push(&JsValue::from_f64(displaced_close));
        outer.push(&inner);
    }
    outer
}

#[wasm_bindgen(js_name = candle_bulk_donchianChannels)]
pub fn candle_bulk_donchian_channels(highs: Vec<f64>, lows: Vec<f64>, period: usize) -> Array {
    let data = rust_ti::candle_indicators::bulk::donchian_channels(&highs, &lows, period);
    let outer = Array::new();
    for (l, m, u) in data {
        let inner = Array::new();
        inner.push(&JsValue::from_f64(l));
        inner.push(&JsValue::from_f64(m));
        inner.push(&JsValue::from_f64(u));
        outer.push(&inner);
    }
    outer
}

#[wasm_bindgen(js_name = candle_bulk_keltnerChannel)]
pub fn candle_bulk_keltner_channel(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    atr_constant_model_type: crate::ConstantModelType,
    multiplier: f64,
    period: usize,
) -> Array {
    let data = rust_ti::candle_indicators::bulk::keltner_channel(
        &highs,
        &lows,
        &close,
        constant_model_type.into(),
        atr_constant_model_type.into(),
        multiplier,
        period,
    );
    let outer = Array::new();
    for (l, m, u) in data {
        let inner = Array::new();
        inner.push(&JsValue::from_f64(l));
        inner.push(&JsValue::from_f64(m));
        inner.push(&JsValue::from_f64(u));
        outer.push(&inner);
    }
    outer
}

#[wasm_bindgen(js_name = candle_bulk_supertrend)]
pub fn candle_bulk_supertrend(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    multiplier: f64,
    period: usize,
) -> Array {
    let data = rust_ti::candle_indicators::bulk::supertrend(
        &highs,
        &lows,
        &close,
        constant_model_type.into(),
        multiplier,
        period,
    );
    let outer = Array::new();
    for v in data {
        outer.push(&JsValue::from_f64(v));
    }
    outer
}
