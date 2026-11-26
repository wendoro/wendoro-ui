import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AnnouncementPanel,
  ChatLayout,
  MeetingLayout,
  NotificationPreferences,
  SharedInbox,
  type ChatMessageItem,
} from '../src/components/business/communication';
import {
  ConflictResolutionCard,
  PresenceIndicator,
  VersionHistoryPanel,
} from '../src/components/business/productivity';
import {
  DataImportMapper,
  DataRelationshipDiagram,
  FormulaEditor,
  PivotTable,
  QueryBuilder,
  SpreadsheetGrid,
  type QueryConditionItem,
} from '../src/components/business/data-tools';

const meta: Meta = {
  title: 'Wendoro UI/Communication, Collaboration & Data Tools',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Domain 05 (SpreadsheetGrid, PivotTable, QueryBuilder, FormulaEditor, DataImportMapper), Domain 10 (PresenceIndicator, VersionHistoryPanel, ConflictResolutionCard), and Domain 11 (ChatLayout, SharedInbox, AnnouncementPanel, NotificationPreferences, MeetingLayout).',
      },
    },
  },
};

export default meta;

function ChatWorkspaceDemo() {
  const [activeId, setActiveId] = React.useState('conv-1');
  const [messages, setMessages] = React.useState<ChatMessageItem[]>([
    { id: 'm1', sender: 'Sample Member A', timestamp: '10:02 AM', body: 'Updated synthetic Q4 schedule.', reactions: [{ label: '👍', count: 2 }] },
    { id: 'm2', sender: 'Demo User', timestamp: '10:05 AM', body: 'Reviewed and ready for sign-off.', own: true },
  ]);

  return (
    <ChatLayout
      conversations={[
        { id: 'conv-1', title: 'Sample Organization Ops', preview: 'Reviewed and ready for sign-off.', timestamp: '10:05 AM', unreadCount: 2, status: 'active' },
        { id: 'conv-2', title: 'QA Design System Review', preview: 'Token contrast checked.', timestamp: 'Yesterday', unreadCount: 0, status: 'completed' },
      ]}
      activeConversationId={activeId}
      onSelectConversation={setActiveId}
      messages={messages}
      onSendMessage={(text) => {
        setMessages((prev) => [
          ...prev,
          { id: `m-${Date.now()}`, sender: 'Demo User', timestamp: 'Just now', body: text, own: true },
        ]);
      }}
    />
  );
}

export const CommunicationSuite: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <ChatWorkspaceDemo />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SharedInbox
          items={[
            { id: 'inb-1', subject: 'Sample Organization SLA Review', sender: 'demo@example.invalid', status: 'open', assignee: 'Demo User', priority: 'high', unread: true },
            { id: 'inb-2', subject: 'Quarterly Token Audit', sender: 'ops@example.invalid', status: 'pending', assignee: 'Sample Member A', priority: 'normal', unread: false },
          ]}
        />
        <AnnouncementPanel
          title="Wendoro UI 2.0 Modules Available"
          message="Optional @wendoro/ui/ai, /editors, and /adapters subpaths added."
          publishedAt="Today"
          actionLabel="View release notes"
          onAction={() => {}}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <NotificationPreferences
          preferences={[
            { id: 'np-1', label: 'Approval alerts', description: 'Notify when workflow checkpoint awaits review.', enabled: true },
            { id: 'np-2', label: 'Daily digest', description: 'Synthetic activity summary at 09:00.', enabled: false },
          ]}
          onToggle={() => {}}
        />
        <MeetingLayout
          roomTitle="Weekly Design Sync (Demo)"
          muted={false}
          videoEnabled
          onToggleMute={() => {}}
          onToggleVideo={() => {}}
          participants={[
            { id: 'p1', name: 'Demo User', role: 'Host', muted: false, videoEnabled: true, speaking: true },
            { id: 'p2', name: 'Sample Member A', role: 'Engineering', muted: true, videoEnabled: false },
          ]}
        />
      </div>
    </div>
  ),
};

export const CollaborationControls: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <PresenceIndicator
        syncState="synced"
        collaborators={[
          { id: 'c1', name: 'Demo User', status: 'editing', locationLabel: 'Tab 2' },
          { id: 'c2', name: 'Sample Member A', status: 'online', locationLabel: 'Overview' },
        ]}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VersionHistoryPanel
          versions={[
            { id: 'v3', versionLabel: 'v2.0.3 Draft', author: 'Demo User', timestamp: '10m ago', summary: 'Added summary footer to DataTable', current: true },
            { id: 'v2', versionLabel: 'v2.0.2', author: 'Sample Member A', timestamp: 'Yesterday', summary: 'Verified RTL localization formatting' },
          ]}
          onRestoreVersion={() => {}}
        />
        <ConflictResolutionCard
          resourceTitle="Workspace Title"
          localSummary="Sample Organization HQ"
          remoteSummary="Sample Organization Global"
          onKeepLocal={() => {}}
          onAcceptRemote={() => {}}
        />
      </div>
    </div>
  ),
};

function DataToolsDemo() {
  const [rows, setRows] = React.useState<Array<Record<string, string | number>>>([
    { item: 'Units', q1: 120, q2: 145 },
    { item: 'Target', q1: 110, q2: 140 },
  ]);
  const [formula, setFormula] = React.useState('=SUM(B1:C1)');
  const [combinator, setCombinator] = React.useState<'AND' | 'OR'>('AND');
  const [conditions, setConditions] = React.useState<QueryConditionItem[]>([
    { id: 'q1', field: 'status', operator: 'equals', value: 'active' },
  ]);

  return (
    <div className="space-y-6">
      <SpreadsheetGrid
        columns={[
          { key: 'item', label: 'Metric' },
          { key: 'q1', label: 'Q1', align: 'right' },
          { key: 'q2', label: 'Q2', align: 'right' },
        ]}
        rows={rows}
        onCellChange={(r, colKey, val) =>
          setRows((prev) => prev.map((row, ri) => (ri === r ? { ...row, [colKey]: val } : row)))
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PivotTable
          data={[
            { segment: 'Enterprise', region: 'North', volume: 420 },
            { segment: 'Enterprise', region: 'South', volume: 310 },
            { segment: 'Agency', region: 'North', volume: 260 },
            { segment: 'Agency', region: 'South', volume: 195 },
          ]}
          rowField="segment"
          columnField="region"
          valueField="volume"
        />
        <QueryBuilder
          fields={['status', 'region', 'tier']}
          combinator={combinator}
          onCombinatorChange={setCombinator}
          conditions={conditions}
          onChange={setConditions}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FormulaEditor
          value={formula}
          onChange={setFormula}
          functions={['SUM', 'AVERAGE', 'COUNTIF', 'ROUND']}
        />
        <DataImportMapper
          mappings={[
            { sourceColumn: 'org_name', sampleValue: 'Sample Organization', targetField: 'name', required: true },
            { sourceColumn: 'contact_email', sampleValue: 'demo@example.invalid', targetField: 'email', required: true },
            { sourceColumn: 'tier', sampleValue: 'Scale', targetField: 'plan' },
          ]}
          targetFields={['name', 'email', 'plan']}
          onChangeMapping={() => {}}
        />
      </div>
      <DataRelationshipDiagram
        entities={[
          { id: 'org', name: 'Organization', fields: [{ name: 'id', type: 'uuid', keyKind: 'PK' }, { name: 'name', type: 'text' }, { name: 'tier', type: 'text' }] },
          { id: 'usr', name: 'Member', fields: [{ name: 'id', type: 'uuid', keyKind: 'PK' }, { name: 'org_id', type: 'uuid', keyKind: 'FK' }, { name: 'role', type: 'text' }] },
          { id: 'inv', name: 'Invoice', fields: [{ name: 'id', type: 'uuid', keyKind: 'PK' }, { name: 'org_id', type: 'uuid', keyKind: 'FK' }, { name: 'amount', type: 'numeric' }] },
        ]}
        relations={[
          { fromEntity: 'Organization', toEntity: 'Member', cardinality: '1:N' },
          { fromEntity: 'Organization', toEntity: 'Invoice', cardinality: '1:N' },
        ]}
      />
    </div>
  );
}

export const AdvancedDataTools: StoryObj = {
  render: () => <DataToolsDemo />,
};
