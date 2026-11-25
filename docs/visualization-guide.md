# Data Visualization Guide & External Chart Adapter Strategy

## Standard Charts (`@wendoro/ui/charts`)

1. **Cartesian Line & Area**: `LineChart`, `AreaChart`, `StackedAreaChart`, `ComposedChart`
2. **Bar & Column**: `BarChart`, `HorizontalBarChart`, `GroupedBarChart`, `StackedBarChart`, `ColumnChart`
3. **Circular & Quantitative Meters**: `DonutChart`, `PieChart`, `RadialProgressChart`, `GaugeChart` (`role="meter"`)
4. **Correlation & Inline**: `ScatterChart`, `BubbleChart`, `RadarChart`, `Sparkline`, `ProgressVisualization`
5. **Vendor-Agnostic External Adapter**: `ChartAdapterProvider`, `useChartAdapter`, `ExternalChart`, `createVendorChartAdapter`, `CHART_LIBRARY_EVALUATION_PROFILES`

## Advanced Charts (`@wendoro/ui/charts/advanced`)

1. **Flow & Variance**: `FunnelChart`, `WaterfallChart`, `SankeyChart`
2. **Density, Part-to-Whole & Geographic**: `HeatmapChart`, `CalendarHeatmap`, `TreemapChart`, `GeoRegionChart` (supports both custom vector `path` choropleths and responsive accessible regional tile grids)
3. **Distributions & Multi-Axis Time Series**: `BoxPlotChart`, `ViolinChart`, `HistogramChart`, `RangeBandChart`, `MultiSeriesTimeSeriesChart`, `MixedAxisChart`

## External Library Evaluation & Adapter Strategy (Approach B)

To avoid bloating `@wendoro/ui` or introducing React 18/SSR/mixed-module incompatibilities, third-party charting libraries are **not** bundled directly. Instead, `ExternalChart` provides a `Suspense` + `ErrorBoundary`-wrapped bridge that renders via a host-registered `ChartAdapterSpec`, falling back cleanly to Wendoro's zero-dependency SVG charts when no external engine is registered.

| Engine | License | React 18 | SSR Friendly | Approx. Gzipped Footprint | Trade-off Summary |
| --- | --- | --- | --- | --- | --- |
| **Wendoro Native (`@wendoro/ui/charts`)** | MIT | Yes | Yes | ~14 KB total (0 runtime deps) | Best default for strict CSP, SSR, instant load, and semantic HTML table toggles. |
| **Visx (`@visx/*`, optional)** | MIT | Yes | Yes | 15–45 KB modular | Ideal when host apps need custom scientific Voronoi, canvas zoom, or bespoke SVG scales. |
| **Recharts (`recharts`, optional)** | MIT | Yes | Partial (client measure) | ~95–120 KB | High ergonomics for product teams already standardized on Recharts; heavier D3 transitive footprint. |
| **Apache ECharts (`echarts`, optional)** | Apache-2.0 | Yes | No (Canvas/WebGL) | ~160–350 KB | Best reserved for lazy-loaded >50k point WebGL/Canvas matrices via `ChartAdapterProvider`. |

## Shared Chart Architecture

- **Accessible Data Alternatives**: Every `ChartContainer` includes a toggleable **Data table** / **Chart view** control rendering an accessible semantic `<table>`.
- **Non-Color Differentiation**: Series use distinct SVG `<pattern>` fills, `dashArray` stroke patterns, and distinct geometric markers (`circle`, `square`, `triangle`, `diamond`, `cross`).
- **Locale-Aware Formatting (`formatChartValue`)**: Supports `integer`, `decimal`, `compact`, `percent`, `currency`, `date`, `duration`, and `custom` formatters via `Intl.NumberFormat` and `Intl.DateTimeFormat`.
