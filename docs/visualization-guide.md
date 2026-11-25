# Data Visualization Guide

## Standard Charts (`@wendoro/ui/charts`)

1. **Cartesian Line & Area**: `LineChart`, `AreaChart`, `StackedAreaChart`, `ComposedChart`
2. **Bar & Column**: `BarChart`, `HorizontalBarChart`, `GroupedBarChart`, `StackedBarChart`, `ColumnChart`
3. **Circular & Quantitative Meters**: `DonutChart`, `PieChart`, `RadialProgressChart`, `GaugeChart` (`role="meter"`)
4. **Correlation & Inline**: `ScatterChart`, `BubbleChart`, `RadarChart`, `Sparkline`, `ProgressVisualization`

## Advanced Charts (`@wendoro/ui/charts/advanced`)

1. **Flow & Variance**: `FunnelChart`, `WaterfallChart`, `SankeyChart`
2. **Density & Part-to-Whole**: `HeatmapChart`, `CalendarHeatmap`, `TreemapChart`
3. **Distributions & Multi-Axis Time Series**: `BoxPlotChart`, `ViolinChart`, `HistogramChart`, `RangeBandChart`, `MultiSeriesTimeSeriesChart`, `MixedAxisChart`

## Shared Chart Architecture

- **Accessible Data Alternatives**: Every `ChartContainer` includes a toggleable **Data table** / **Chart view** control rendering an accessible semantic `<table>` for screen-reader users and tabular inspection.
- **Non-Color Differentiation**: Series use distinct SVG `<pattern>` fills (`solid`, `diagonal-stripe`, `dot-matrix`, `crosshatch`, etc.), `dashArray` stroke patterns, and distinct geometric markers (`circle`, `square`, `triangle`, `diamond`, `cross`).
- **Locale-Aware Formatting (`formatChartValue`)**: Supports `integer`, `decimal`, `compact`, `percent`, `currency`, `date`, `duration`, and `custom` formatters powered by native `Intl.NumberFormat` and `Intl.DateTimeFormat`.
- **Standardized States & Overlays**: Every chart supports `loading`, `empty`, `error` + `onRetry`, `thresholds`, and `annotations`.
