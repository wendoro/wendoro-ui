import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AnalyticsFilterToolbar,
  AnalyticsSummaryCard,
  GoalProgress,
  MetricComparison,
  MetricTrendCard,
  MiniChartCard,
  PerformanceIndicator,
  StatisticalSummary,
  TargetVsActual,
  TrendIndicator,
} from '../src/components/business/analytics';
import { KpiCard } from '../src/components/business/kpi-card';
import { MetricCard } from '../src/components/business/metric-card';
import { Sparkline } from '../src/components/charts';

const meta: Meta = {
  title: 'Wendoro UI/Analytics',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise KPI, trend, comparison, goal progress, statistical summary, and analytics filter toolbar components (synthetic demo data).',
      },
    },
  },
};

export default meta;

function AnalyticsSuiteDemo() {
  const [range, setRange] = React.useState('30d');
  const [comparison, setComparison] = React.useState('previous');

  return (
    <div className="space-y-6">
      <AnalyticsFilterToolbar
        dateRange={range}
        onDateRangeChange={setRange}
        comparisonPeriod={comparison}
        onComparisonPeriodChange={setComparison}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          label="Sample Active Units"
          value="1,240"
          delta="+12.4%"
          trend="up"
          period="vs last 30 days"
          sparkline={<Sparkline data={[22, 26, 24, 31, 35, 40]} variant="area" aria-label="Sample trend" />}
        />
        <KpiCard
          title="Goal Completion (Demo)"
          actual="86%"
          target="90%"
          completion={86}
          status="on_track"
        />
        <MiniChartCard
          title="Queue Throughput"
          value="420 / day"
          delta="+6.2%"
          direction="positive"
          subtitle="Synthetic benchmark"
          chart={<Sparkline data={[14, 19, 17, 25, 28, 32]} variant="bar" aria-label="Queue bars" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <MetricComparison
          label="Period Comparison (Demo)"
          currentValue="2,480"
          previousValue="2,120"
          currentPeriodLabel="Current 30d"
          previousPeriodLabel="Prior 30d"
          absoluteChange="+360"
          percentChange="+16.9%"
          direction="positive"
        />
        <StatisticalSummary
          title="Sample Latency Distribution"
          stats={[
            { label: 'Mean', value: '42 ms' },
            { label: 'Median', value: '38 ms' },
            { label: 'P95', value: '94 ms' },
            { label: 'Samples', value: '1,200' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AnalyticsSummaryCard
          title="Summary Breakdown (Demo)"
          items={[
            { id: 'i1', label: 'Verified Records', value: '892', delta: '+4.1%', direction: 'positive' },
            { id: 'i2', label: 'Pending Review', value: '38', delta: '-12%', direction: 'positive' },
            { id: 'i3', label: 'Data Unavailable', value: '0', delta: 'N/A', direction: 'unavailable' },
          ]}
          footer={
            <div className="space-y-3">
              <TargetVsActual
                title="Target Attainment"
                actualLabel="892"
                targetLabel="1,000"
                percentage={89}
                variant="success"
              />
              <GoalProgress
                title="Audit Coverage"
                actualLabel="94"
                targetLabel="100"
                percentage={94}
                variant="primary"
              />
            </div>
          }
        />

        <div className="space-y-4">
          <MetricTrendCard
            title="Weekly Velocity (Demo)"
            value="98.4%"
            changeLabel="+1.2%"
            direction="positive"
            period="Last 7d"
          />
          <div className="flex flex-wrap items-center gap-3 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-4">
            <TrendIndicator direction="positive" value="+8%" label="Improvement" />
            <TrendIndicator direction="negative" value="-3%" label="Regression" />
            <TrendIndicator direction="neutral" value="0%" label="Flat" />
            <TrendIndicator direction="unavailable" label="No data" />
          </div>
          <PerformanceIndicator label="SLA Target Health" score="91%" rating="optimal" detail="Above 85% target" />
        </div>
      </div>
    </div>
  );
}

export const AllAnalyticsComponents: StoryObj = {
  render: () => <AnalyticsSuiteDemo />,
};
