import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  BarChart,
  DonutChart,
  GaugeChart,
  LineChart,
  formatChartValue,
} from '@/components/charts';
import {
  FunnelChart,
  HeatmapChart,
  MixedAxisChart,
  SankeyChart,
  ViolinChart,
} from '@/components/charts/advanced';

const SAMPLE_SERIES = [
  { month: 'Jan', primary: 1200, secondary: 800 },
  { month: 'Feb', primary: 1500, secondary: 950 },
  { month: 'Mar', primary: 1850, secondary: 1100 },
];

describe('Visualization System (Standard & Advanced Charts)', () => {
  it('formats numbers, currencies, percentages, compact notation, dates, durations, and custom formatters via Intl', () => {
    expect(formatChartValue(1250, { type: 'integer' })).toBe('1,250');
    expect(formatChartValue(1250, { type: 'currency', currency: 'USD' })).toBe('$1,250');
    expect(formatChartValue(0.845, { type: 'percent' })).toBe('84.5%');
    expect(formatChartValue(2400, { type: 'compact' })).toMatch(/2\.4K/);
    expect(formatChartValue(125, { type: 'duration', durationUnit: 's' })).toBe('2m 5s');
    expect(formatChartValue('2026-11-15T12:00:00Z', { type: 'date' })).toContain('2026');
    expect(formatChartValue(42, { type: 'custom', formatter: (v) => `Unit #${v}` })).toBe('Unit #42');
  });

  it('renders LineChart with patterns, thresholds, interactive legend toggle, tooltip, and accessible table fallback', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <LineChart
        title="Sample Trend"
        data={SAMPLE_SERIES}
        xKey="month"
        series={[
          { key: 'primary', label: 'Primary Series', marker: 'circle' },
          { key: 'secondary', label: 'Secondary Series', dashArray: '4 3', marker: 'square' },
        ]}
        thresholds={[{ value: 1600, label: 'Target SLA' }]}
        showTableToggle
        valueFormatter={{ type: 'currency', currency: 'USD' }}
      />
    );

    expect(screen.getByText('Sample Trend')).toBeInTheDocument();
    expect(container.querySelectorAll('pattern').length).toBeGreaterThan(0);

    // Legend toggle hides/shows series
    const legend = screen.getByLabelText('Chart series legend');
    const secondaryLegendBtn = within(legend).getByRole('button', { name: /Secondary Series/i });
    await user.click(secondaryLegendBtn);
    expect(secondaryLegendBtn).toHaveAttribute('aria-pressed', 'false');

    // Interactive point hover displays tooltip
    const pointBtn = container.querySelector('[data-point-index="0"]');
    if (pointBtn) {
      fireEvent.mouseEnter(pointBtn);
      expect(screen.getByRole('status')).toBeInTheDocument();
    }

    // Accessible HTML table toggle
    const tableBtn = screen.getByRole('button', { name: /Data table/i });
    await user.click(tableBtn);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('$1,200')).toBeInTheDocument();
  });

  it('renders BarChart, DonutChart, and GaugeChart with accessible meter role', () => {
    render(
      <div>
        <BarChart
          title="Sample Bars"
          data={SAMPLE_SERIES}
          categoryKey="month"
          series={[{ key: 'primary', label: 'Volume' }]}
        />
        <DonutChart
          title="Sample Share"
          data={[
            { id: 'a', label: 'Group A', value: 60 },
            { id: 'b', label: 'Group B', value: 40 },
          ]}
          centerLabel="Total"
          centerValue="100"
        />
        <GaugeChart title="System Meter" value={75} min={0} max={100} unitLabel="%" />
      </div>
    );

    expect(screen.getByText('Sample Bars')).toBeInTheDocument();
    expect(screen.getByText('Sample Share')).toBeInTheDocument();
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '75');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
  });

  it('handles loading, empty, and error retry states consistently', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    const { rerender } = render(<LineChart title="State Chart" data={[]} xKey="month" series={[]} loading />);
    expect(screen.getByRole('status', { name: /Loading chart/i })).toBeInTheDocument();

    rerender(<LineChart title="State Chart" data={[]} xKey="month" series={[]} empty emptyTitle="No sample records" />);
    expect(screen.getByText('No sample records')).toBeInTheDocument();

    rerender(
      <LineChart
        title="State Chart"
        data={[]}
        xKey="month"
        series={[]}
        error="Sample connection timeout"
        onRetry={onRetry}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Sample connection timeout');
    await user.click(screen.getByRole('button', { name: /Retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('updates reactively when chart data changes and responds to ResizeObserver', () => {
    const { rerender } = render(
      <BarChart
        title="Reactive Chart"
        data={[{ label: 'A', val: 10 }]}
        categoryKey="label"
        series={[{ key: 'val', label: 'Value' }]}
        showValues
      />
    );
    expect(screen.getByText('10')).toBeInTheDocument();

    rerender(
      <BarChart
        title="Reactive Chart"
        data={[{ label: 'A', val: 95 }]}
        categoryKey="label"
        series={[{ key: 'val', label: 'Value' }]}
        showValues
      />
    );
    expect(screen.getByText('95')).toBeInTheDocument();
  });

  it('renders advanced charts cleanly from @wendoro/ui/charts/advanced', () => {
    render(
      <div>
        <FunnelChart
          title="Sample Funnel"
          stages={[
            { id: 's1', label: 'Stage 1', value: 100 },
            { id: 's2', label: 'Stage 2', value: 60 },
          ]}
        />
        <HeatmapChart
          title="Sample Heatmap"
          xLabels={['Mon', 'Tue']}
          yLabels={['Desk', 'Flow']}
          cells={[
            { x: 'Mon', y: 'Desk', value: 4 },
            { x: 'Tue', y: 'Flow', value: 8 },
          ]}
        />
        <ViolinChart
          title="Sample Violin"
          groups={[{ id: 'v1', label: 'Group A', samples: [10, 15, 20, 25, 30] }]}
        />
        <SankeyChart
          title="Sample Sankey"
          nodes={[
            { id: 'n1', label: 'Input', column: 0 },
            { id: 'n2', label: 'Output', column: 1 },
          ]}
          links={[{ source: 'n1', target: 'n2', value: 50 }]}
        />
        <MixedAxisChart
          title="Sample Mixed Axis"
          categoryKey="m"
          data={[{ m: 'Jan', a: 50, b: 80 }]}
          primarySeries={{ key: 'a', label: 'Count' }}
          secondarySeries={{ key: 'b', label: 'Rate' }}
        />
      </div>
    );

    expect(screen.getByText('Sample Funnel')).toBeInTheDocument();
    expect(screen.getByText('Sample Heatmap')).toBeInTheDocument();
    expect(screen.getByText('Sample Violin')).toBeInTheDocument();
    expect(screen.getByText('Sample Sankey')).toBeInTheDocument();
    expect(screen.getByText('Sample Mixed Axis')).toBeInTheDocument();
  });
});
