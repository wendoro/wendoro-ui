import type { ActivityFeedEntry } from '@/components/business/activity-feed';
import type { TeamMember } from '@/components/business/team-directory';
import type { BusinessStatus } from '@/components/business/status-badge';
import type { KanbanCardItem, KanbanColumnSpec } from '@/components/business/productivity';

/**
 * Synthetic sample members for Wendoro UI showcases and stories.
 * Uses only illustrative demo labels — no real personal details, accounts, or metrics.
 */
export const WENDORO_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'demo-member-1',
    name: 'Demo User',
    affiliation: 'Sample Organization',
    role: 'Sample Systems Lead',
    department: 'Example Project (Demo)',
    email: 'demo@example.invalid',
    status: 'completed',
    statusLabel: 'Verified',
  },
  {
    id: 'demo-member-2',
    name: 'Sample Member A',
    affiliation: 'Sample Organization · Demo',
    email: 'member-a@example.invalid',
  },
  {
    id: 'demo-member-3',
    name: 'Sample Member B',
    affiliation: 'Sample Organization · Demo',
    email: 'member-b@example.invalid',
  },
  {
    id: 'demo-member-4',
    name: 'Sample Member C',
    affiliation: 'Sample Organization · Demo',
    email: 'member-c@example.invalid',
  },
];

export const WENDORO_DEMO_ACTIVITY: ActivityFeedEntry[] = [
  {
    id: 'demo-act-1',
    actor: 'Sample Member B',
    actorSubtitle: 'Sample Organization Lead',
    action: 'verified illustrative record',
    entity: 'Sample Record #01',
    source: 'Example Project (Demo)',
    timestamp: '6 minutes ago',
    amount: '120 sample units',
    status: 'completed',
    statusLabel: 'Verified',
  },
  {
    id: 'demo-act-2',
    actor: 'Demo User',
    actorSubtitle: 'Sample Organization Reviewer',
    action: 'updated an example rule in',
    entity: 'Sample Record #02',
    source: 'Example Project (Demo)',
    timestamp: '34 minutes ago',
    metadata: 'Illustrative demo checkpoint configured for preview only.',
  },
  {
    id: 'demo-act-3',
    actor: 'Sample Member A',
    actorSubtitle: 'Sample Organization',
    action: 'reviewed layout token update.',
    timestamp: '1 hour ago',
    metadata: 'Sample collaboration activity (demo data)',
  },
  {
    id: 'demo-act-4',
    actor: 'Sample Member C',
    actorSubtitle: 'Sample Organization',
    action: 'archived Sample Record #03.',
    timestamp: '2 hours ago',
    metadata: 'Sample collaboration activity (demo data)',
  },
];

export interface EcosystemModuleRow {
  id: string;
  module: string;
  domain: string;
  maintainer: string;
  throughput: number;
  status: BusinessStatus;
  statusLabel?: string;
}

export const WENDORO_DEMO_MODULES: EcosystemModuleRow[] = [
  { id: 'REC-01', module: 'Example Project Alpha', domain: 'Shared Tokens (Demo)', maintainer: 'Demo User', throughput: 420, status: 'active' },
  { id: 'REC-02', module: 'Sample Workflow Beta', domain: 'Approval Rules (Demo)', maintainer: 'Sample Member C', throughput: 315, status: 'pending' },
  { id: 'REC-03', module: 'Sample Workspace Gamma', domain: 'Collaboration (Demo)', maintainer: 'Sample Member A', throughput: 580, status: 'completed' },
  { id: 'REC-04', module: 'Sample Portal Delta', domain: 'Documentation (Demo)', maintainer: 'Sample Member B', throughput: 245, status: 'active' },
  { id: 'REC-05', module: 'Sample Ops Epsilon', domain: 'Catalog Sync (Demo)', maintainer: 'Demo User', throughput: 190, status: 'warning', statusLabel: 'Review' },
  { id: 'REC-06', module: 'Sample Insights Zeta', domain: 'Analytics Grids (Demo)', maintainer: 'Sample Member C', throughput: 410, status: 'draft' },
];

export const WENDORO_DEMO_SERIES = [
  { month: 'Jan', primary: 120, secondary: 85, target: 110 },
  { month: 'Feb', primary: 148, secondary: 96, target: 125 },
  { month: 'Mar', primary: 162, secondary: 112, target: 140 },
  { month: 'Apr', primary: 155, secondary: 124, target: 150 },
  { month: 'May', primary: 194, secondary: 138, target: 165 },
  { month: 'Jun', primary: 218, secondary: 152, target: 180 },
];

export const WENDORO_DEMO_DISTRIBUTION = [
  { id: 'seg-a', label: 'Category A (Demo)', value: 420 },
  { id: 'seg-b', label: 'Category B (Demo)', value: 280 },
  { id: 'seg-c', label: 'Category C (Demo)', value: 190 },
  { id: 'seg-d', label: 'Category D (Demo)', value: 110 },
];

export const WENDORO_DEMO_KANBAN_COLUMNS: KanbanColumnSpec[] = [
  { id: 'todo', title: 'Backlog', wipLimit: 5 },
  { id: 'in_progress', title: 'In Review', wipLimit: 3 },
  { id: 'done', title: 'Completed' },
];

export const WENDORO_DEMO_KANBAN_CARDS: KanbanCardItem[] = [
  {
    id: 'card-1',
    columnId: 'todo',
    title: 'Sample Record #01 · Audit contrast tokens',
    description: 'Illustrative accessibility task for demo workflow.',
    assignee: 'Demo User',
    priority: 'high',
    dueDate: 'Nov 28',
  },
  {
    id: 'card-2',
    columnId: 'in_progress',
    title: 'Sample Record #02 · Verify chart tables',
    description: 'Verify HTML data table toggle on sample dashboards.',
    assignee: 'Sample Member A',
    priority: 'medium',
    dueDate: 'Nov 29',
  },
  {
    id: 'card-3',
    columnId: 'done',
    title: 'Sample Record #03 · Publish demo tokens',
    description: 'Completed illustrative task.',
    assignee: 'Sample Member B',
    priority: 'low',
    dueDate: 'Nov 25',
  },
];
