import * as React from 'react';
import {
  AnalyticsSummaryCard,
  TargetVsActual,
} from '@/components/business/analytics';
import { KanbanBoard, TreeView, Wizard } from '@/components/business/productivity';
import { BarChart, DonutChart, GaugeChart, LineChart } from '@/components/charts';
import { FunnelChart, HeatmapChart } from '@/components/charts/advanced';
import { Banner, CircularProgress } from '@/components/ui/feedback';
import { CurrencyInput, InputOTP, TagInput } from '@/components/ui/forms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  WENDORO_DEMO_DISTRIBUTION,
  WENDORO_DEMO_KANBAN_CARDS,
  WENDORO_DEMO_KANBAN_COLUMNS,
  WENDORO_DEMO_SERIES,
} from '@/data/wendoro-demo-data';

export function VisualizationAndEnterpriseSection() {
  const [cards, setCards] = React.useState(WENDORO_DEMO_KANBAN_CARDS);
  const [wizardStep, setWizardStep] = React.useState(0);
  const [tags, setTags] = React.useState(['tokens', 'charts', 'a11y']);
  const [otp, setOtp] = React.useState('2048');
  const [budget, setBudget] = React.useState('12500');

  const handleMoveCard = (cardId: string, toColumnId: string) => {
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, columnId: toColumnId } : c)));
  };

  return (
    <div className="space-y-8">
      <Banner
        variant="default"
        title="Illustrative Demo Workspace"
        description="All charts, workflows, and KPI cards below use synthetic example data for previewing Wendoro UI 2.0 modules."
      />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineChart
          title="Sample Output Trend (Demo)"
          subtitle="Monthly synthetic metrics with SLA threshold"
          data={WENDORO_DEMO_SERIES}
          xKey="month"
          series={[
            { key: 'primary', label: 'Primary Series', marker: 'circle' },
            { key: 'secondary', label: 'Secondary Series', dashArray: '4 3', marker: 'square' },
          ]}
          thresholds={[{ value: 180, label: 'Target Threshold' }]}
          valueFormatter={{ type: 'compact' }}
        />

        <BarChart
          title="Category Throughput (Demo)"
          subtitle="Comparative sample columns with pattern accessibility"
          data={WENDORO_DEMO_SERIES}
          categoryKey="month"
          layout="grouped"
          series={[
            { key: 'primary', label: 'Throughput A' },
            { key: 'target', label: 'Benchmark B' },
          ]}
          valueFormatter={{ type: 'integer' }}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DonutChart
          title="Workload Share (Demo)"
          data={WENDORO_DEMO_DISTRIBUTION}
          centerLabel="Total Units"
          centerValue="1,000"
          valueFormatter={{ type: 'integer' }}
        />

        <GaugeChart
          title="System Readiness (Demo)"
          subtitle="Sample health meter with role='meter'"
          value={88}
          min={0}
          max={100}
          unitLabel="%"
        />

        <AnalyticsSummaryCard
          title="Analytics Summary (Demo)"
          description="Illustrative key metrics"
          items={[
            { id: 'm1', label: 'Sample Records', value: '1,240', delta: '+8.2%', direction: 'positive' },
            { id: 'm2', label: 'Review Queue', value: '14', delta: '-3.1%', direction: 'positive' },
            { id: 'm3', label: 'Pending Checks', value: '4', delta: 'Stable', direction: 'neutral' },
          ]}
          footer={
            <TargetVsActual
              title="Demo Goal Completion"
              actualLabel="880"
              targetLabel="1,000"
              percentage={88}
              statusText="On Track"
              variant="success"
            />
          }
        />
      </section>

      <Separator />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FunnelChart
          title="Workflow Funnel (Demo)"
          subtitle="Illustrative stage progression"
          stages={[
            { id: 's1', label: 'Initialized', value: 500 },
            { id: 's2', label: 'Validated', value: 380 },
            { id: 's3', label: 'Approved', value: 260 },
            { id: 's4', label: 'Completed', value: 210 },
          ]}
        />

        <HeatmapChart
          title="Schedule Load Heatmap (Demo)"
          subtitle="Illustrative weekly intensity grid"
          xLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
          yLabels={['Core UI', 'Charts', 'Tables']}
          cells={[
            { x: 'Mon', y: 'Core UI', value: 3 },
            { x: 'Tue', y: 'Core UI', value: 7 },
            { x: 'Wed', y: 'Core UI', value: 5 },
            { x: 'Thu', y: 'Core UI', value: 9 },
            { x: 'Fri', y: 'Core UI', value: 4 },
            { x: 'Mon', y: 'Charts', value: 6 },
            { x: 'Tue', y: 'Charts', value: 8 },
            { x: 'Wed', y: 'Charts', value: 10 },
            { x: 'Thu', y: 'Charts', value: 6 },
            { x: 'Fri', y: 'Charts', value: 3 },
            { x: 'Mon', y: 'Tables', value: 2 },
            { x: 'Tue', y: 'Tables', value: 5 },
            { x: 'Wed', y: 'Tables', value: 4 },
            { x: 'Thu', y: 'Tables', value: 7 },
            { x: 'Fri', y: 'Tables', value: 8 },
          ]}
        />
      </section>

      <Separator />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Productivity & Workflow (Demo)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag cards or use keyboard action buttons on each card to move items between columns.
          </p>
        </div>

        <KanbanBoard
          columns={WENDORO_DEMO_KANBAN_COLUMNS}
          cards={cards}
          onMoveCard={handleMoveCard}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Wizard & Forms (Demo)</CardTitle>
              <CardDescription>Multi-step workflow paired with enterprise inputs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Wizard
                currentStep={wizardStep}
                onStepChange={setWizardStep}
                steps={[
                  {
                    id: 'w1',
                    label: 'Configure Tags',
                    content: (
                      <TagInput
                        label="Workspace Labels"
                        tags={tags}
                        onTagsChange={setTags}
                        placeholder="Add label..."
                      />
                    ),
                  },
                  {
                    id: 'w2',
                    label: 'Sample Allocation',
                    content: (
                      <CurrencyInput
                        label="Sample Budget (Demo)"
                        currencySymbol="$"
                        value={budget}
                        onValueChange={setBudget}
                      />
                    ),
                  },
                  {
                    id: 'w3',
                    label: 'Verification Code',
                    content: (
                      <div className="space-y-3">
                        <InputOTP length={4} value={otp} onValueChange={setOtp} label="Sample PIN" />
                        <div className="flex items-center gap-3">
                          <CircularProgress value={100} label="Ready" />
                          <span className="text-xs text-muted-foreground">
                            Demo configuration verified (pin: {otp || 'none'}).
                          </span>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Package Hierarchy (TreeView)</CardTitle>
              <CardDescription>Keyboard-navigable tree structure for modular subpaths.</CardDescription>
            </CardHeader>
            <CardContent>
              <TreeView
                nodes={[
                  {
                    id: 'root-ui',
                    label: '@wendoro/ui',
                    children: [
                      { id: 'sub-tokens', label: './tokens' },
                      { id: 'sub-charts', label: './charts (18 standard)' },
                      { id: 'sub-charts-adv', label: './charts/advanced (12 advanced)' },
                      { id: 'sub-business', label: './business' },
                      { id: 'sub-hooks', label: './hooks' },
                    ],
                  },
                ]}
                defaultExpandedIds={['root-ui']}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
