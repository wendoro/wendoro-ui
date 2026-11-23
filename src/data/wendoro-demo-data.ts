import type { ActivityFeedEntry } from '@/components/business/activity-feed';
import type { TeamMember } from '@/components/business/team-directory';
import type { BusinessStatus } from '@/components/business/status-badge';

/**
 * Sample team members for Wendoro UI showcases and stories.
 * Uses only explicitly provided details — no invented titles, emails, or photos.
 */
export const WENDORO_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'ananya-rao',
    name: 'Ananya Rao',
    affiliation: 'Wendoro',
    role: 'Principal Systems Lead',
    department: 'Wendoro Platform',
    email: 'ananya@wendoro.in',
    status: 'completed',
    statusLabel: 'Verified',
  },
  {
    id: 'sumita-singh',
    name: 'Sumita Singh',
    affiliation: 'Wendoro · Team member',
  },
  {
    id: 'suraj-singh',
    name: 'Suraj Singh',
    affiliation: 'Wendoro · Team member',
  },
  {
    id: 'rohan-mehta',
    name: 'Rohan Mehta',
    affiliation: 'Wendoro · Team member',
  },
];

/**
 * Sample UI demonstration activity feed events.
 * Clearly labeled as illustrative design-system demo data, not live company records.
 */
export const WENDORO_DEMO_ACTIVITY: ActivityFeedEntry[] = [
  {
    id: 'demo-act-1',
    actor: 'Suraj Singh',
    actorSubtitle: 'Founder · Wendoro',
    action: 'approved settlement batch',
    entity: '#SL-4092',
    source: 'Wendoro Commerce',
    timestamp: '6 minutes ago',
    amount: '$48,200 cleared',
    status: 'completed',
    statusLabel: 'Verified',
  },
  {
    id: 'demo-act-2',
    actor: 'Sumita Singh',
    actorSubtitle: 'Founder · Wendoro',
    action: 'updated a routing rule in',
    entity: 'Wendoro Flow',
    source: 'Wendoro Flow',
    timestamp: '34 minutes ago',
    metadata: 'Dual-control sign-off enabled for payouts greater than $10,000.',
  },
  {
    id: 'demo-act-3',
    actor: 'Sumita Singh',
    actorSubtitle: 'Wendoro',
    action: 'reviewed a project update.',
    timestamp: '1 hour ago',
    metadata: 'Sample collaboration activity (demo data)',
  },
  {
    id: 'demo-act-4',
    actor: 'Suraj Singh',
    actorSubtitle: 'Wendoro',
    action: 'updated a workspace document.',
    timestamp: '2 hours ago',
    metadata: 'Sample collaboration activity (demo data)',
  },
];

export interface EcosystemModuleRow {
  id: string;
  module: string;
  domain: string;
  maintainer: string;
  status: BusinessStatus;
  statusLabel?: string;
}

/**
 * Sample design-system demonstration records for DataTable showcases.
 */
export const WENDORO_DEMO_MODULES: EcosystemModuleRow[] = [
  { id: 'MOD-01', module: 'Wendoro Platform', domain: 'Identity & Shared Tokens', maintainer: 'Ananya Rao', status: 'active' },
  { id: 'MOD-02', module: 'Wendoro Flow', domain: 'Workflow Rules (Demo)', maintainer: 'Rohan Mehta', status: 'pending' },
  { id: 'MOD-03', module: 'Wendoro Desk', domain: 'Workspace Collaboration (Demo)', maintainer: 'Sumita Singh', status: 'completed' },
  { id: 'MOD-04', module: 'Wendoro Studio', domain: 'Documentation & Components (Demo)', maintainer: 'Suraj Singh', status: 'active' },
  { id: 'MOD-05', module: 'Wendoro Commerce', domain: 'Order & Ledger Patterns (Demo)', maintainer: 'Ananya Rao', status: 'warning', statusLabel: 'Review' },
  { id: 'MOD-06', module: 'Wendoro Insights', domain: 'Analytics Grids (Demo)', maintainer: 'Rohan Mehta', status: 'draft' },
];
