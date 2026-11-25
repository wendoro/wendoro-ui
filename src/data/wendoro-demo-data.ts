import type { ActivityFeedEntry } from '@/components/business/activity-feed';
import type { TeamMember } from '@/components/business/team-directory';
import type { BusinessStatus } from '@/components/business/status-badge';

/**
 * Synthetic sample members for Wendoro UI showcases and stories.
 * Uses only illustrative demo labels — no real personal details, accounts, or photos.
 */
export const WENDORO_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'demo-member-1',
    name: 'Demo Lead',
    affiliation: 'Demo Workspace',
    role: 'Sample Systems Lead',
    department: 'Wendoro Platform (Demo)',
    email: 'lead@demo.invalid',
    status: 'completed',
    statusLabel: 'Verified',
  },
  {
    id: 'demo-member-2',
    name: 'Sample Member A',
    affiliation: 'Demo Workspace · Sample member',
  },
  {
    id: 'demo-member-3',
    name: 'Sample Member B',
    affiliation: 'Demo Workspace · Sample member',
  },
  {
    id: 'demo-member-4',
    name: 'Sample Member C',
    affiliation: 'Demo Workspace · Sample member',
  },
];

/**
 * Sample UI demonstration activity feed events.
 * Clearly labeled as illustrative design-system demo data, not live company records.
 */
export const WENDORO_DEMO_ACTIVITY: ActivityFeedEntry[] = [
  {
    id: 'demo-act-1',
    actor: 'Sample Member B',
    actorSubtitle: 'Demo Workspace Lead',
    action: 'verified illustrative batch',
    entity: 'Sample Record #01',
    source: 'Wendoro Commerce (Demo)',
    timestamp: '6 minutes ago',
    amount: '120 sample units',
    status: 'completed',
    statusLabel: 'Verified',
  },
  {
    id: 'demo-act-2',
    actor: 'Sample Member A',
    actorSubtitle: 'Demo Workspace Reviewer',
    action: 'updated an example routing rule in',
    entity: 'Wendoro Flow (Demo)',
    source: 'Wendoro Flow (Demo)',
    timestamp: '34 minutes ago',
    metadata: 'Illustrative dual-control approval threshold configured for demo preview.',
  },
  {
    id: 'demo-act-3',
    actor: 'Sample Member A',
    actorSubtitle: 'Demo Workspace',
    action: 'reviewed a sample layout update.',
    timestamp: '1 hour ago',
    metadata: 'Sample collaboration activity (demo data)',
  },
  {
    id: 'demo-act-4',
    actor: 'Sample Member B',
    actorSubtitle: 'Demo Workspace',
    action: 'updated an example workspace document.',
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
  { id: 'MOD-01', module: 'Wendoro Platform', domain: 'Identity & Shared Tokens (Demo)', maintainer: 'Demo Lead', status: 'active' },
  { id: 'MOD-02', module: 'Wendoro Flow', domain: 'Workflow Rules (Demo)', maintainer: 'Sample Member C', status: 'pending' },
  { id: 'MOD-03', module: 'Wendoro Desk', domain: 'Workspace Collaboration (Demo)', maintainer: 'Sample Member A', status: 'completed' },
  { id: 'MOD-04', module: 'Wendoro Studio', domain: 'Documentation & Components (Demo)', maintainer: 'Sample Member B', status: 'active' },
  { id: 'MOD-05', module: 'Wendoro Commerce', domain: 'Order & Ledger Patterns (Demo)', maintainer: 'Demo Lead', status: 'warning', statusLabel: 'Review' },
  { id: 'MOD-06', module: 'Wendoro Insights', domain: 'Analytics Grids (Demo)', maintainer: 'Sample Member C', status: 'draft' },
];
