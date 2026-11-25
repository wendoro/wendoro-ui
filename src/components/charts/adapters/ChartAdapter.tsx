import * as React from 'react';
import { ChartContainer } from '../core/ChartContainer';
import type { BaseChartProps, ChartDatum, ChartSeriesConfig } from '../core/types';
import { BarChart } from '../standard/BarSeriesChart';
import { LineChart } from '../standard/CartesianSeriesChart';
import { DonutChart } from '../standard/CircularChart';

export type ExternalChartKind =
  | 'line'
  | 'bar'
  | 'area'
  | 'donut'
  | 'scatter'
  | 'heatmap'
  | 'geo'
  | 'custom';

export interface ExternalChartRequest {
  kind: ExternalChartKind;
  title?: string;
  subtitle?: string;
  data: ChartDatum[];
  xKey?: string;
  series?: ChartSeriesConfig[];
  height?: number;
  width: number;
  options?: Record<string, unknown>;
}

export interface ChartAdapterSpec {
  id: string;
  libraryName: string;
  license: string;
  ssrCompatible: boolean;
  estimatedBundleKb?: number;
  supportedKinds: ExternalChartKind[];
  renderChart: (request: ExternalChartRequest) => React.ReactNode;
}

export interface ChartLibraryEvaluationProfile {
  id: string;
  packageName: string;
  license: string;
  react18Compatible: boolean;
  ssrFriendly: boolean;
  approximateGzipKb: string;
  tradeOffSummary: string;
}

/**
 * Audited vendor profiles for optional external chart adapter integration.
 * Kept purely informational so @wendoro/ui stays dependency-light.
 */
export const CHART_LIBRARY_EVALUATION_PROFILES: ChartLibraryEvaluationProfile[] = [
  {
    id: 'wendoro-native',
    packageName: '@wendoro/ui/charts (built-in)',
    license: 'MIT',
    react18Compatible: true,
    ssrFriendly: true,
    approximateGzipKb: '~14 KB (zero third-party runtime deps)',
    tradeOffSummary:
      'Pure SVG + semantic CSS variables + built-in HTML table toggle. Best default for SSR, strict CSP, and small bundles.',
  },
  {
    id: 'visx-adapter',
    packageName: '@visx/* (optional host dependency)',
    license: 'MIT',
    react18Compatible: true,
    ssrFriendly: true,
    approximateGzipKb: '15–45 KB modular',
    tradeOffSummary:
      'Modular D3 primitives aligned with React 18 + SSR. Recommended when custom scientific/zoomable canvas or Voronoi interactions are needed.',
  },
  {
    id: 'recharts-adapter',
    packageName: 'recharts (optional host dependency)',
    license: 'MIT',
    react18Compatible: true,
    ssrFriendly: false,
    approximateGzipKb: '~95–120 KB',
    tradeOffSummary:
      'Declarative API with broad adoption, but requires client-side container measurement for SSR and adds D3 transitive weight.',
  },
  {
    id: 'echarts-adapter',
    packageName: 'echarts (optional host dependency)',
    license: 'Apache-2.0',
    react18Compatible: true,
    ssrFriendly: false,
    approximateGzipKb: '~160–350 KB (tree-shaken)',
    tradeOffSummary:
      'High-density WebGL/Canvas rendering for >50k data points; large bundle footprint so load lazily via ChartAdapter.',
  },
];

interface ChartAdapterContextValue {
  adapters: Record<string, ChartAdapterSpec>;
  defaultAdapterId?: string;
}

const ChartAdapterContext = React.createContext<ChartAdapterContextValue>({
  adapters: {},
});

export interface ChartAdapterProviderProps {
  adapters: ChartAdapterSpec[];
  defaultAdapterId?: string;
  children: React.ReactNode;
}

export function ChartAdapterProvider({
  adapters,
  defaultAdapterId,
  children,
}: ChartAdapterProviderProps) {
  const value = React.useMemo<ChartAdapterContextValue>(() => {
    const map: Record<string, ChartAdapterSpec> = {};
    for (const adapter of adapters) {
      map[adapter.id] = adapter;
    }
    return {
      adapters: map,
      defaultAdapterId: defaultAdapterId ?? adapters[0]?.id,
    };
  }, [adapters, defaultAdapterId]);

  return <ChartAdapterContext.Provider value={value}>{children}</ChartAdapterContext.Provider>;
}

export function useChartAdapter(preferredAdapterId?: string): ChartAdapterSpec | undefined {
  const ctx = React.useContext(ChartAdapterContext);
  if (preferredAdapterId && ctx.adapters[preferredAdapterId]) {
    return ctx.adapters[preferredAdapterId];
  }
  if (ctx.defaultAdapterId && ctx.adapters[ctx.defaultAdapterId]) {
    return ctx.adapters[ctx.defaultAdapterId];
  }
  const firstKey = Object.keys(ctx.adapters)[0];
  return firstKey ? ctx.adapters[firstKey] : undefined;
}

export function createVendorChartAdapter(spec: ChartAdapterSpec): ChartAdapterSpec {
  return spec;
}

class ChartAdapterBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export interface ExternalChartProps extends BaseChartProps {
  kind: ExternalChartKind;
  data: ChartDatum[];
  xKey?: string;
  series?: ChartSeriesConfig[];
  adapterId?: string;
  adapter?: ChartAdapterSpec;
  options?: Record<string, unknown>;
}

/**
 * Vendor-agnostic bridge component (Approach B).
 * Uses a registered external adapter (or lazy-loaded engine) when provided,
 * and falls back gracefully to Wendoro's zero-dependency native SVG charts.
 */
export function ExternalChart({
  kind,
  data,
  xKey = 'label',
  series = [],
  adapterId,
  adapter: explicitAdapter,
  options,
  title,
  subtitle,
  description,
  height = 240,
  loading,
  error,
  onRetry,
  empty,
  className,
}: ExternalChartProps) {
  const registered = useChartAdapter(adapterId);
  const resolvedAdapter = explicitAdapter ?? registered;
  const canUseAdapter = Boolean(
    resolvedAdapter &&
      (resolvedAdapter.supportedKinds.includes(kind) || resolvedAdapter.supportedKinds.includes('custom'))
  );

  const renderNativeFallback = () => {
    if (kind === 'donut') {
      const valueKey = series[0]?.key ?? 'value';
      const items = data.map((d, idx) => ({
        id: String(d[xKey] ?? idx),
        label: String(d[xKey] ?? `Item ${idx + 1}`),
        value: Number(d[valueKey] ?? 0),
      }));
      return (
        <DonutChart
          title={title}
          subtitle={subtitle}
          description={description}
          data={items}
          height={height}
          loading={loading}
          error={error}
          onRetry={onRetry}
          empty={empty}
          className={className}
        />
      );
    }

    if (kind === 'bar') {
      return (
        <BarChart
          title={title}
          subtitle={subtitle}
          description={description}
          data={data}
          categoryKey={xKey}
          series={series.length > 0 ? series : [{ key: 'value', label: 'Value' }]}
          height={height}
          loading={loading}
          error={error}
          onRetry={onRetry}
          empty={empty}
          className={className}
        />
      );
    }

    return (
      <LineChart
        title={title}
        subtitle={subtitle}
        description={description}
        data={data}
        xKey={xKey}
        series={series.length > 0 ? series : [{ key: 'value', label: 'Value' }]}
        height={height}
        loading={loading}
        error={error}
        onRetry={onRetry}
        empty={empty}
        className={className}
      />
    );
  };

  if (!canUseAdapter || !resolvedAdapter) {
    return renderNativeFallback();
  }

  const columns = [
    { key: xKey, label: xKey },
    ...series.map((s) => ({ key: s.key, label: s.label })),
  ];
  const tableRows = data.map((row) => {
    const mapped: Record<string, string> = {};
    for (const col of columns) {
      mapped[col.key] = String(row[col.key] ?? '—');
    }
    return mapped;
  });

  return (
    <ChartAdapterBoundary fallback={renderNativeFallback()}>
      <ChartContainer
        title={title}
        subtitle={subtitle ?? `Adapter: ${resolvedAdapter.libraryName}`}
        description={description}
        loading={loading}
        error={error}
        onRetry={onRetry}
        empty={empty ?? data.length === 0}
        tableColumns={columns}
        tableRows={tableRows}
        minHeight={height}
        className={className}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Engine: {resolvedAdapter.libraryName}</span>
            <span>License: {resolvedAdapter.license}</span>
          </div>
        }
      >
        {(width) => (
          <React.Suspense
            fallback={
              <div
                role="status"
                aria-label="Loading visualization engine"
                className="flex items-center justify-center text-xs text-muted-foreground"
                style={{ minHeight: height }}
              >
                Loading chart adapter...
              </div>
            }
          >
            {resolvedAdapter.renderChart({
              kind,
              title,
              subtitle,
              data,
              xKey,
              series,
              height,
              width,
              options,
            })}
          </React.Suspense>
        )}
      </ChartContainer>
    </ChartAdapterBoundary>
  );
}
