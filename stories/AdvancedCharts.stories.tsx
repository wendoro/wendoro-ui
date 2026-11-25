import type { Meta, StoryObj } from '@storybook/react';
import {
  BoxPlotChart,
  CalendarHeatmap,
  FunnelChart,
  HeatmapChart,
  HistogramChart,
  MixedAxisChart,
  MultiSeriesTimeSeriesChart,
  RangeBandChart,
  SankeyChart,
  TreemapChart,
  ViolinChart,
  WaterfallChart,
} from '../src/components/charts/advanced';

const meta: Meta = {
  title: 'Wendoro UI/Data Visualization/Advanced Charts',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'All 12 advanced analytical charts loaded from the optional @wendoro/ui/charts/advanced subpath (synthetic demo data).',
      },
    },
  },
};

export default meta;

export const FunnelAndWaterfall: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <FunnelChart
        title="FunnelChart (Demo)"
        stages={[
          { id: 'f1', label: 'Visited', value: 1000 },
          { id: 'f2', label: 'Evaluated', value: 640 },
          { id: 'f3', label: 'Configured', value: 410 },
          { id: 'f4', label: 'Active', value: 290 },
        ]}
      />
      <WaterfallChart
        title="WaterfallChart (Demo)"
        steps={[
          { id: 'w1', label: 'Baseline', value: 400, kind: 'total' },
          { id: 'w2', label: 'Gain A', value: 140 },
          { id: 'w3', label: 'Drop B', value: -75 },
          { id: 'w4', label: 'Gain C', value: 95 },
          { id: 'w5', label: 'Final', value: 560, kind: 'total' },
        ]}
      />
    </div>
  ),
};

export const HeatmapsTreemapAndSankey: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <HeatmapChart
        title="HeatmapChart (Demo)"
        xLabels={['Mon', 'Tue', 'Wed', 'Thu']}
        yLabels={['Unit A', 'Unit B', 'Unit C']}
        cells={[
          { x: 'Mon', y: 'Unit A', value: 4 },
          { x: 'Tue', y: 'Unit A', value: 8 },
          { x: 'Wed', y: 'Unit A', value: 6 },
          { x: 'Thu', y: 'Unit A', value: 9 },
          { x: 'Mon', y: 'Unit B', value: 2 },
          { x: 'Tue', y: 'Unit B', value: 5 },
          { x: 'Wed', y: 'Unit B', value: 10 },
          { x: 'Thu', y: 'Unit B', value: 7 },
          { x: 'Mon', y: 'Unit C', value: 6 },
          { x: 'Tue', y: 'Unit C', value: 3 },
          { x: 'Wed', y: 'Unit C', value: 4 },
          { x: 'Thu', y: 'Unit C', value: 8 },
        ]}
      />
      <CalendarHeatmap
        title="CalendarHeatmap (Demo)"
        days={Array.from({ length: 28 }, (_, idx) => ({
          date: `2026-11-${String(idx + 1).padStart(2, '0')}`,
          value: ((idx * 3) % 9) + 1,
        }))}
      />
      <TreemapChart
        title="TreemapChart (Demo)"
        nodes={[
          { id: 't1', label: 'Core Modules', value: 420 },
          { id: 't2', label: 'Standard Charts', value: 290 },
          { id: 't3', label: 'Advanced Charts', value: 210 },
          { id: 't4', label: 'Productivity', value: 165 },
        ]}
      />
      <SankeyChart
        title="SankeyChart (Demo)"
        nodes={[
          { id: 'src-a', label: 'Source A', column: 0 },
          { id: 'src-b', label: 'Source B', column: 0 },
          { id: 'mid-1', label: 'Stage 1', column: 1 },
          { id: 'mid-2', label: 'Stage 2', column: 1 },
          { id: 'out-1', label: 'Output', column: 2 },
        ]}
        links={[
          { source: 'src-a', target: 'mid-1', value: 60 },
          { source: 'src-a', target: 'mid-2', value: 30 },
          { source: 'src-b', target: 'mid-2', value: 50 },
          { source: 'mid-1', target: 'out-1', value: 60 },
          { source: 'mid-2', target: 'out-1', value: 80 },
        ]}
      />
    </div>
  ),
};

export const DistributionsAndTimeSeries: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <BoxPlotChart
        title="BoxPlotChart (Demo)"
        groups={[
          { id: 'g1', label: 'Group A', min: 12, q1: 24, median: 38, q3: 52, max: 68, outliers: [78] },
          { id: 'g2', label: 'Group B', min: 18, q1: 30, median: 44, q3: 58, max: 74 },
        ]}
      />
      <ViolinChart
        title="ViolinChart (Demo)"
        groups={[
          { id: 'v1', label: 'Cohort A', samples: [18, 22, 25, 28, 30, 32, 35, 39, 44, 48] },
          { id: 'v2', label: 'Cohort B', samples: [14, 19, 27, 34, 41, 45, 49, 53, 56, 62] },
        ]}
      />
      <HistogramChart
        title="HistogramChart (Demo)"
        bins={6}
        values={[11, 14, 19, 22, 23, 27, 28, 29, 34, 37, 42, 46, 51, 58]}
      />
      <RangeBandChart
        title="RangeBandChart (Demo)"
        data={[
          { label: 'W1', min: 80, value: 105, max: 125 },
          { label: 'W2', min: 92, value: 118, max: 138 },
          { label: 'W3', min: 88, value: 112, max: 132 },
          { label: 'W4', min: 104, value: 128, max: 148 },
        ]}
      />
      <MultiSeriesTimeSeriesChart
        title="MultiSeriesTimeSeriesChart (Demo)"
        dateKey="date"
        data={[
          { date: '2026-10-01', s1: 110, s2: 82 },
          { date: '2026-10-08', s1: 134, s2: 96 },
          { date: '2026-10-15', s1: 148, s2: 112 },
          { date: '2026-10-22', s1: 172, s2: 128 },
        ]}
        series={[
          { key: 's1', label: 'Series One', marker: 'circle' },
          { key: 's2', label: 'Series Two', dashArray: '4 3', marker: 'square' },
        ]}
        thresholds={[{ value: 150, label: 'Benchmark' }]}
      />
      <MixedAxisChart
        title="MixedAxisChart (Dual Axis Demo)"
        categoryKey="month"
        data={[
          { month: 'Jan', count: 120, rate: 88 },
          { month: 'Feb', count: 165, rate: 91 },
          { month: 'Mar', count: 190, rate: 94 },
          { month: 'Apr', count: 215, rate: 92 },
        ]}
        primarySeries={{ key: 'count', label: 'Volume' }}
        secondarySeries={{ key: 'rate', label: 'Completion %' }}
        valueFormatter={{ type: 'integer' }}
        secondaryValueFormatter={{ type: 'percent' }}
      />
    </div>
  ),
};
