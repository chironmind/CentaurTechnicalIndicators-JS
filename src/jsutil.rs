use wasm_bindgen::JsValue;

/// Adapter: turn any `Display` error (e.g. the upstream `TechnicalIndicatorError`)
/// into a `JsValue` so wasm-bindgen throws it as a JS `Error` instead of the
/// wrapper panicking. Reused by every module's `.map_err(js_err)?` sites.
pub fn js_err(err: impl std::fmt::Display) -> JsValue {
    JsValue::from_str(&err.to_string())
}
