import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AgentActivityTimeline,
  AgentDirectory,
  AiAssistantPanel,
  AiEvaluationControls,
  HumanApprovalCheckpoint,
  ModelComparisonTable,
  PromptEditor,
  PromptLibrary,
  TokenUsageBar,
  type AiConversationMessage,
} from '../src/components/ai';
import {
  AudioWaveformPreview,
  CodeEditor,
  ColorPicker,
  DashboardBuilder,
  DiffViewer,
  DocumentPreviewCard,
  GradientEditor,
  JsonViewer,
  MarkdownEditor,
  ReportBuilder,
  VideoTimelineScrubber,
  VisualFormBuilder,
} from '../src/components/editors';
import {
  CanvasDiagramAdapterSlot,
  FleetTrackingWorkspace,
  GeoFilterBar,
  SignatureCapturePad,
  WENDORO_BUNDLE_BUDGETS,
} from '../src/components/adapters';
import { CandlestickChart, NetworkGraphChart } from '../src/components/charts/advanced';

const meta: Meta = {
  title: 'Wendoro UI/AI, Editors, Adapters & Platform Extensions',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Optional Layer 4 & Layer 5 subpaths (@wendoro/ui/ai, @wendoro/ui/editors, @wendoro/ui/adapters), plus CandlestickChart & NetworkGraphChart.',
      },
    },
  },
};

export default meta;

const DEMO_MODELS = [
  { id: 'fast', name: 'Wendoro Fast', provider: 'Provider Adapter A', contextWindow: '128k', latencyTier: 'fast' as const, strengths: ['Summaries', 'Triage'] },
  { id: 'reason', name: 'Wendoro Reasoner', provider: 'Provider Adapter B', contextWindow: '256k', latencyTier: 'reasoning' as const, strengths: ['Analysis', 'Planning'] },
];

function AiWorkspaceDemo() {
  const [modelId, setModelId] = React.useState('fast');
  const [prompt, setPrompt] = React.useState('');
  const [decision, setDecision] = React.useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rating, setRating] = React.useState<number | undefined>(5);
  const [messages, setMessages] = React.useState<AiConversationMessage[]>([
    {
      id: 'm1',
      role: 'assistant' as const,
      content: 'Ready to inspect Sample Organization sprint metrics via host adapter.',
      timestamp: '09:42',
      toolCalls: [{ toolName: 'query_metrics', status: 'completed' as const, inputSummary: 'org=sample-org', outputSummary: '14 records fetched', durationMs: 42 }],
      citations: [{ id: 'c1', title: 'Q4 Demo Summary', href: 'https://wendoro.in', confidence: '98%' }],
    },
  ]);

  return (
    <div className="space-y-6">
      <AiAssistantPanel
        models={DEMO_MODELS}
        selectedModelId={modelId}
        onSelectModel={setModelId}
        messages={messages}
        promptValue={prompt}
        onPromptChange={setPrompt}
        onSubmitPrompt={(text) => {
          setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: 'Now', toolCalls: [], citations: [] }]);
          setPrompt('');
        }}
        taskHistory={[{ id: 'th-1', title: 'Sprint Review', timestamp: '1h ago', modelName: 'Wendoro Fast', status: 'completed' }]}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <HumanApprovalCheckpoint
          actionTitle="Execute bulk archive rule"
          description="Human-in-the-loop gate before host runtime applies changes."
          riskLevel="medium"
          decision={decision}
          onApprove={() => setDecision('approved')}
          onReject={() => setDecision('rejected')}
        />
        <div className="space-y-4">
          <TokenUsageBar promptTokens={1420} completionTokens={680} budgetTokens={8000} estimatedCostLabel="$0.01 est." />
          <AiEvaluationControls rating={rating} onRate={setRating} />
        </div>
      </div>
      <ModelComparisonTable models={DEMO_MODELS} selectedModelId={modelId} onSelectModel={setModelId} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PromptEditor value="Summarize {{module}} readiness" onValueChange={() => {}} variables={['module', 'quarter']} />
        <PromptLibrary
          templates={[{ id: 'tpl1', title: 'QA Audit Summary', category: 'Ops', template: 'Summarize accessibility findings for {{module}}' }]}
          onInsert={() => {}}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AgentDirectory
          agents={[{ id: 'ag1', name: 'Triage Agent', role: 'Queue classification', status: 'active', capabilities: ['Routing', 'Summaries'] }]}
        />
        <AgentActivityTimeline
          steps={[
            { id: 'st1', label: 'Collected synthetic records', timestamp: '09:40', status: 'completed' },
            { id: 'st2', label: 'Awaiting human checkpoint', timestamp: '09:42', status: 'active' },
          ]}
        />
      </div>
    </div>
  );
}

export const AiInterfacesModule: StoryObj = {
  render: () => <AiWorkspaceDemo />,
};

function EditorsSuiteDemo() {
  const [md, setMd] = React.useState('# Wendoro UI 2.0\n- Modular subpaths\n> Accessible across themes');
  const [code, setCode] = React.useState("import { Button } from '@wendoro/ui';\nexport const Demo = () => <Button>Hello</Button>;");
  const [color, setColor] = React.useState('#FACC15');
  const [grad, setGrad] = React.useState({ startColor: '#FACC15', endColor: '#111111', angle: 120 });
  const [videoSec, setVideoSec] = React.useState(18);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MarkdownEditor value={md} onChange={setMd} />
        <CodeEditor value={code} onChange={setCode} language="tsx" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <JsonViewer data={{ package: '@wendoro/ui', version: '0.1.0', budgets: WENDORO_BUNDLE_BUDGETS }} />
        <DiffViewer original={'theme: light\ndensity: compact'} modified={'theme: dark\ndensity: comfortable'} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ColorPicker value={color} onChange={setColor} />
        <GradientEditor {...grad} onChange={setGrad} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AudioWaveformPreview title="Voice Note Demo" peaks={[30, 65, 90, 45, 70, 50, 85, 40, 60, 75]} />
        <VideoTimelineScrubber title="Release Walkthrough" durationSeconds={90} currentSeconds={videoSec} onSeek={setVideoSec} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VisualFormBuilder
          initialFields={[
            { id: 'f1', label: 'Organization', type: 'text', required: true },
            { id: 'f2', label: 'Contact Email', type: 'email', required: true },
          ]}
        />
        <DashboardBuilder
          initialWidgets={[
            { id: 'w1', title: 'KPI Summary', kind: 'kpi', span: 1 },
            { id: 'w2', title: 'Throughput Trend', kind: 'chart', span: 2 },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DocumentPreviewCard fileName="architecture-overview-demo.pdf" pageCount={4} currentPage={1} />
        <ReportBuilder sections={[{ id: 'r1', heading: 'Executive Summary', summary: 'All modules conform to token contracts.' }]} />
      </div>
    </div>
  );
}

export const EditorsAndBuildersModule: StoryObj = {
  render: () => <EditorsSuiteDemo />,
};

export const AdaptersGeoAndSpecializedCharts: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <GeoFilterBar
        query=""
        onQueryChange={() => {}}
        onSearch={() => {}}
        territories={[
          { id: 'na', name: 'North Hub', count: 14 },
          { id: 'eu', name: 'West Hub', count: 9 },
        ]}
        selectedTerritories={['na']}
        onToggleTerritory={() => {}}
      />
      <FleetTrackingWorkspace
        markers={[
          { id: 'mk1', label: 'Hub Alpha (Demo)', lat: 37.774, lng: -122.419, status: 'active', category: 'Dispatch' },
          { id: 'mk2', label: 'Hub Beta (Demo)', lat: 40.712, lng: -74.006, status: 'pending', category: 'Transit' },
        ]}
        routes={[{ id: 'rt1', origin: 'Hub Alpha', destination: 'Hub Beta', distanceLabel: '420 km', etaLabel: '4h 15m' }]}
        geofences={[{ id: 'gf1', name: 'Zone A', radiusLabel: '25 km', active: true }]}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SignatureCapturePad signerName="Demo User" />
        <CanvasDiagramAdapterSlot title="External Vector Diagram Slot" nodesCount={6} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CandlestickChart
          title="Asset Index OHLC (Demo)"
          data={[
            { label: 'Mon', open: 102, high: 114, low: 98, close: 110 },
            { label: 'Tue', open: 110, high: 118, low: 104, close: 106 },
            { label: 'Wed', open: 106, high: 122, low: 105, close: 120 },
          ]}
        />
        <NetworkGraphChart
          title="Module Dependency Topology"
          nodes={[
            { id: 'tokens', label: '@wendoro/ui/tokens', group: 'Foundation', weight: 4 },
            { id: 'core', label: '@wendoro/ui', group: 'Core', weight: 5 },
            { id: 'ai', label: '@wendoro/ui/ai', group: 'Optional', weight: 3 },
            { id: 'charts', label: '@wendoro/ui/charts', group: 'Optional', weight: 3 },
          ]}
          edges={[
            { source: 'core', target: 'tokens', label: 'uses' },
            { source: 'ai', target: 'core', label: 'extends' },
            { source: 'charts', target: 'tokens', label: 'uses' },
          ]}
        />
      </div>
    </div>
  ),
};
