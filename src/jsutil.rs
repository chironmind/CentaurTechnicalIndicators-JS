use js_sys::Array;
use wasm_bindgen::JsValue;

/// Convert any Rust error type that implements `Display` (typically
/// `TechnicalIndicatorError`) into a `JsValue` carrying a native JS `Error`.
/// The error's `Display` message is preserved so JS consumers see e.g.
/// "Mismatched lengths: highs=5, lows=4" instead of a panic string.
pub(crate) fn js_err(e: impl std::fmt::Display) -> JsValue {
    JsValue::from(js_sys::Error::new(&e.to_string()))
}

pub(crate) fn flat_to_array<I: IntoIterator<Item = f64>>(data: I) -> Array {
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

pub(crate) fn pair_to_array((a, b): (f64, f64)) -> Array {
    let arr = Array::new();
    arr.push(&JsValue::from_f64(a));
    arr.push(&JsValue::from_f64(b));
    arr
}

pub(crate) fn triple_to_array((a, b, c): (f64, f64, f64)) -> Array {
    let arr = Array::new();
    arr.push(&JsValue::from_f64(a));
    arr.push(&JsValue::from_f64(b));
    arr.push(&JsValue::from_f64(c));
    arr
}

pub(crate) fn quintuple_to_array((a, b, c, d, e): (f64, f64, f64, f64, f64)) -> Array {
    let arr = Array::new();
    arr.push(&JsValue::from_f64(a));
    arr.push(&JsValue::from_f64(b));
    arr.push(&JsValue::from_f64(c));
    arr.push(&JsValue::from_f64(d));
    arr.push(&JsValue::from_f64(e));
    arr
}

pub(crate) fn pairs_to_array<I: IntoIterator<Item = (f64, f64)>>(data: I) -> Array {
    let outer = Array::new();
    for p in data {
        outer.push(&pair_to_array(p));
    }
    outer
}

pub(crate) fn triples_to_array<I: IntoIterator<Item = (f64, f64, f64)>>(data: I) -> Array {
    let outer = Array::new();
    for t in data {
        outer.push(&triple_to_array(t));
    }
    outer
}

pub(crate) fn quads_to_array<I: IntoIterator<Item = (f64, f64, f64, f64)>>(data: I) -> Array {
    let outer = Array::new();
    for (a, b, c, d) in data {
        let inner = Array::new();
        inner.push(&JsValue::from_f64(a));
        inner.push(&JsValue::from_f64(b));
        inner.push(&JsValue::from_f64(c));
        inner.push(&JsValue::from_f64(d));
        outer.push(&inner);
    }
    outer
}

pub(crate) fn quintuples_to_array<I: IntoIterator<Item = (f64, f64, f64, f64, f64)>>(
    data: I,
) -> Array {
    let outer = Array::new();
    for q in data {
        outer.push(&quintuple_to_array(q));
    }
    outer
}
