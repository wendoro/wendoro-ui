import type { Meta, StoryObj } from '@storybook/react';
import {
  AreaChart,
  BarChart,
  BubbleChart,
  ColumnChart,
  ComposedChart,
  DonutChart,
  GaugeChart,
  GroupedBarChart,
  HorizontalBarChart,
  LineChart,
  PieChart,
  ProgressVisualization,
  RadarChart,
  RadialProgressChart,
  ScatterChart,
  Sparkline,
  StackedAreaChart,
  StackedBarChart,
} from '../src/components/charts';
import { WENDORO_DEMO_DISTRIBUTION, WENDORO_DEMO_SERIES } from '../src/data/wendoro-demo-data';

const meta: Meta = {
  title: 'Wendoro UI/Data Visualization/Standard Charts',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'All 18 standard @wendoro/ui/charts visualizations using SVG patterns, dashes, markers, Intl formatters, thresholds, and accessible HTML table alternatives (synthetic demo data).',
      },
    },
  },
};

export default meta;

export const LineAndAreaSeries: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <LineChart
        title="LineChart (Demo)"
        subtitle="Multi-series trend with SLA threshold and pattern dashes"
        data={WENDORO_DEMO_SERIES}
        xKey="month"
        series={[
          { key: 'primary', label: 'Primary Units', marker: 'circle' },
          { key: 'secondary', label: 'Secondary Units', dashArray: '5 3', marker: 'square' },
        ]}
        thresholds={[{ value: 180, label: 'Target' }]}
        valueFormatter={{ type: 'integer' }}
      />
      <AreaChart
        title="AreaChart (Demo)"
        data={WENDORO_DEMO_SERIES}
        xKey="month"
        series={[{ key: 'primary', label: 'Throughput' }]}
        valueFormatter={{ type: 'compact' }}
      />
      <StackedAreaChart
        title="StackedAreaChart (Demo)"
        data={WENDORO_DEMO_SERIES}
        xKey="month"
        series={[
          { key: 'primary', label: 'Stream A' },
          { key: 'secondary', label: 'Stream B' },
        ]}
      />
      <ComposedChart
        title="ComposedChart (Bar + Line)"
        data={WENDORO_DEMO_SERIES}
        xKey="month"
        series={[
          { key: 'secondary', label: 'Baseline', type: 'bar' },
          { key: 'primary', label: 'Trend', type: 'line', marker: 'diamond' },
        ]}
      />
    </div>
  ),
};

export const BarAndColumnFamily: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <BarChart
        title="BarChart (Demo)"
        data={WENDORO_DEMO_SERIES}
        categoryKey="month"
        series={[{ key: 'primary', label: 'Primary' }]}
      />
      <HorizontalBarChart
        title="HorizontalBarChart (Demo)"
        data={WENDORO_DEMO_SERIES.slice(0, 4)}
        categoryKey="month"
        series={[{ key: 'primary', label: 'Volume' }]}
      />
      <GroupedBarChart
        title="GroupedBarChart (Demo)"
        data={WENDORO_DEMO_SERIES}
        categoryKey="month"
        series={[
          { key: 'primary', label: 'Period Current' },
          { key: 'target', label: 'Period Target' },
        ]}
      />
      <StackedBarChart
        title="StackedBarChart (Demo)"
        data={WENDORO_DEMO_SERIES}
        categoryKey="month"
        series={[
          { key: 'primary', label: 'Channel A' },
          { key: 'secondary', label: 'Channel B' },
        ]}
      />
      <ColumnChart
        title="ColumnChart (Demo)"
        data={WENDORO_DEMO_SERIES}
        categoryKey="month"
        series={[{ key: 'primary', label: 'Monthly Output' }]}
        showValues
      />
    </div>
  ),
};

export const CircularAndSpecialty: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <DonutChart
        title="DonutChart (Demo)"
        data={WENDORO_DEMO_DISTRIBUTION}
        centerLabel="Total"
        centerValue="1,000"
      />
      <PieChart
        title="PieChart (Demo)"
        data={WENDORO_DEMO_DISTRIBUTION}
      />
      <RadialProgressChart
        title="RadialProgressChart (Demo)"
        rings={[
          { id: 'r1', label: 'Core Modules', value: 92, max: 100 },
          { id: 'r2', label: 'Chart Exports', value: 84, max: 100 },
          { id: 'r3', label: 'A11y Checks', value: 78, max: 100 },
        ]}
      />
      <GaugeChart
        title="GaugeChart (Demo)"
        value={82}
        min={0}
        max={100}
        unitLabel="%"
      />
      <ScatterChart
        title="ScatterChart (Demo)"
        xLabel="Complexity"
        yLabel="Throughput"
        data={[
          { id: 'p1', label: 'Sample A', x: 18, y: 120 },
          { id: 'p2', label: 'Sample B', x: 34, y: 185 },
          { id: 'p3', label: 'Sample C', x: 52, y: 240 },
          { id: 'p4', label: 'Sample D', x: 75, y: 210 },
        ]}
      />
      <BubbleChart
        title="BubbleChart (Demo)"
        xLabel="Effort"
        yLabel="Impact"
        data={[
          { id: 'b1', label: 'Node 01', x: 20, y: 110, size: 12 },
          { id: 'b2', label: 'Node 02', x: 45, y: 190, size: 22 },
          { id: 'b3', label: 'Node 03', x: 72, y: 165, size: 16 },
        ]}
      />
      <RadarChart
        title="RadarChart (Demo)"
        axes={['Speed', 'Reliability', 'Clarity', 'Density', 'A11y']}
        series={[
          { key: 'a', label: 'Profile A', values: [88, 92, 85, 79, 95] },
          { key: 'b', label: 'Profile B', values: [72, 80, 90, 88, 84] },
        ]}
      />
      <div className="space-y-4 rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-4">
        <div className="text-sm font-semibold">Sparkline & ProgressVisualization</div>
        <div className="flex flex-wrap items-center gap-6">
          <Sparkline data={[12, 18, 15, 24, 29, 27, 36]} variant="line" aria-label="Sample trend line" />
          <Sparkline data={[12, 18, 15, 24, 29, 27, 36]} variant="area" aria-label="Sample trend area" />
          <Sparkline data={[12, 18, 15, 24, 29, 27, 36]} variant="bar" aria-label="Sample trend bars" />
        </div>
        <ProgressVisualization
          title="Segment Allocation (Demo)"
          segments={[
            { id: 's1', label: 'Allocated', value: 45 },
            { id: 's2', label: 'Reserved', value: 30 },
            { id: 's3', label: 'Buffer', value: 15 },
          ]}
          total={100}
        />
      </div>
    </div>
  ),
};

export const ChartStates: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <LineChart title="Loading State" data={[]} xKey="month" series={[]} loading />
      <LineChart title="Empty State" data={[]} xKey="month" series={[]} empty emptyTitle="No sample points" />
      <LineChart title="Error State" data={[]} xKey="month" series={[]} error="Sample telemetry query failed." onRetry={() => {}} />
    </div>
  ),
};
