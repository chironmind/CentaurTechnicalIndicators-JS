use wasm_bindgen::prelude::*;

// Centralized JS-facing enums (no personalised variants)
#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub enum ConstantModelType {
    SimpleMovingAverage,
    SmoothedMovingAverage,
    ExponentialMovingAverage,
    SimpleMovingMedian,
    SimpleMovingMode,
}

impl From<ConstantModelType> for centaur_technical_indicators::ConstantModelType {
    fn from(v: ConstantModelType) -> Self {
        match v {
            ConstantModelType::SimpleMovingAverage => {
                centaur_technical_indicators::ConstantModelType::SimpleMovingAverage
            }
            ConstantModelType::SmoothedMovingAverage => {
                centaur_technical_indicators::ConstantModelType::SmoothedMovingAverage
            }
            ConstantModelType::ExponentialMovingAverage => {
                centaur_technical_indicators::ConstantModelType::ExponentialMovingAverage
            }
            ConstantModelType::SimpleMovingMedian => centaur_technical_indicators::ConstantModelType::SimpleMovingMedian,
            ConstantModelType::SimpleMovingMode => centaur_technical_indicators::ConstantModelType::SimpleMovingMode,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub enum DeviationModel {
    StandardDeviation,
    MeanAbsoluteDeviation,
    MedianAbsoluteDeviation,
    ModeAbsoluteDeviation,
    UlcerIndex,
    LogStandardDeviation,
    LaplaceStdEquivalent,
    CauchyIQRScale,
}

impl From<DeviationModel> for centaur_technical_indicators::DeviationModel {
    fn from(v: DeviationModel) -> Self {
        match v {
            DeviationModel::StandardDeviation => centaur_technical_indicators::DeviationModel::StandardDeviation,
            DeviationModel::MeanAbsoluteDeviation => centaur_technical_indicators::DeviationModel::MeanAbsoluteDeviation,
            DeviationModel::MedianAbsoluteDeviation => {
                centaur_technical_indicators::DeviationModel::MedianAbsoluteDeviation
            }
            DeviationModel::ModeAbsoluteDeviation => centaur_technical_indicators::DeviationModel::ModeAbsoluteDeviation,
            DeviationModel::UlcerIndex => centaur_technical_indicators::DeviationModel::UlcerIndex,
            DeviationModel::LogStandardDeviation => centaur_technical_indicators::DeviationModel::LogStandardDeviation,
            DeviationModel::LaplaceStdEquivalent => centaur_technical_indicators::DeviationModel::LaplaceStdEquivalent,
            DeviationModel::CauchyIQRScale => centaur_technical_indicators::DeviationModel::CauchyIQRScale,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub enum MovingAverageType {
    Simple,
    Smoothed,
    Exponential,
}

// Conversion to the internal Centaur Technical Indicators type
impl From<MovingAverageType> for centaur_technical_indicators::MovingAverageType {
    fn from(value: MovingAverageType) -> Self {
        match value {
            MovingAverageType::Simple => centaur_technical_indicators::MovingAverageType::Simple,
            MovingAverageType::Smoothed => centaur_technical_indicators::MovingAverageType::Smoothed,
            MovingAverageType::Exponential => centaur_technical_indicators::MovingAverageType::Exponential,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub enum Position {
    Long,
    Short,
}

impl From<Position> for centaur_technical_indicators::Position {
    fn from(v: Position) -> Self {
        match v {
            Position::Long => centaur_technical_indicators::Position::Long,
            Position::Short => centaur_technical_indicators::Position::Short,
        }
    }
}

/// Central point used by `basic_indicators::absolute_deviation` and related.
/// Mirrors `centaur_technical_indicators::CentralPoint`.
#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub enum CentralPoint {
    Mean,
    Median,
    Mode,
}

impl From<CentralPoint> for centaur_technical_indicators::CentralPoint {
    fn from(v: CentralPoint) -> Self {
        match v {
            CentralPoint::Mean => centaur_technical_indicators::CentralPoint::Mean,
            CentralPoint::Median => centaur_technical_indicators::CentralPoint::Median,
            CentralPoint::Mode => centaur_technical_indicators::CentralPoint::Mode,
        }
    }
}

/// How to aggregate a set of absolute deviations.
/// Mirrors `centaur_technical_indicators::DeviationAggregate`.
#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub enum DeviationAggregate {
    Mean,
    Median,
    Mode,
}

impl From<DeviationAggregate> for centaur_technical_indicators::DeviationAggregate {
    fn from(v: DeviationAggregate) -> Self {
        match v {
            DeviationAggregate::Mean => centaur_technical_indicators::DeviationAggregate::Mean,
            DeviationAggregate::Median => centaur_technical_indicators::DeviationAggregate::Median,
            DeviationAggregate::Mode => centaur_technical_indicators::DeviationAggregate::Mode,
        }
    }
}

// Internal helper module — array converters and structured-error adapter.
// Not exposed via wasm_bindgen; consumed by the binding modules only.
pub(crate) mod jsutil;

// Mirror Centaur Technical Indicators structure
pub mod basic_indicators;
pub mod candle_indicators;
pub mod chart_trends;
pub mod correlation_indicators;
pub mod momentum_indicators;
pub mod moving_average;
pub mod other_indicators;
pub mod strength_indicators;
pub mod trend_indicators;
pub mod volatility_indicators;
