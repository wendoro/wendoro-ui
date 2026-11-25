import type { ActivityFeedEntry } from '@/components/business/activity-feed';
import type { TeamMember } from '@/components/business/team-directory';
import type { BusinessStatus } from '@/components/business/status-badge';
import type {
  ApprovalRequestItem,
  CommentEntry,
  GanttTaskItem,
  KanbanCardItem,
  KanbanColumnSpec,
  ResourceAllocationRow,
  StatusStage,
  TreeNode,
} from '@/components/business/productivity';
import type {
  BookingSlot,
  CommerceOrderRow,
  CommerceProductCard,
  CourseModuleItem,
  FinanceTransactionRow,
  LogisticsAssetRow,
  RolePermissionEntry,
  ServiceCatalogItem,
} from '@/components/business/patterns';
import type { WorkflowNodeSpec } from '@/components/business/workflow-builder';
import type { GeoRegionDatum } from '@/components/charts/advanced';
import type { WorkspaceOption } from '@/components/ui/navigation-ext';

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
    tags: ['A11y', 'Tokens'],
  },
  {
    id: 'card-2',
    columnId: 'in_progress',
    title: 'Sample Record #02 · Verify chart tables',
    description: 'Verify HTML data table toggle on sample dashboards.',
    assignee: 'Sample Member A',
    priority: 'medium',
    dueDate: 'Nov 29',
    tags: ['Charts'],
  },
  {
    id: 'card-3',
    columnId: 'done',
    title: 'Sample Record #03 · Publish demo tokens',
    description: 'Completed illustrative task.',
    assignee: 'Sample Member B',
    priority: 'low',
    dueDate: 'Nov 25',
    tags: ['Release'],
  },
];

/* -------------------------------------------------------------------------- */
/* Wendoro UI 2.0 Synthetic Datasets                                          */
/* -------------------------------------------------------------------------- */

export const WENDORO_DEMO_WORKSPACES: WorkspaceOption[] = [
  { id: 'ws-alpha', name: 'Sample Client Alpha', role: 'Agency Admin', badge: 'Pro' },
  { id: 'ws-beta', name: 'Sample Tenant Beta', role: 'Workspace Lead', badge: 'Enterprise' },
  { id: 'ws-gamma', name: 'Example Portal Gamma', role: 'Reviewer' },
];

export const WENDORO_DEMO_GANTT_PERIODS = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

export const WENDORO_DEMO_GANTT_TASKS: GanttTaskItem[] = [
  {
    id: 'gt-1',
    title: 'Discovery & Token Alignment',
    owner: 'Demo User',
    startSlot: 0,
    durationSlots: 1,
    progress: 100,
    status: 'completed',
    milestone: true,
  },
  {
    id: 'gt-2',
    title: 'Mobile Navigation & Bottom Sheets',
    owner: 'Sample Member A',
    startSlot: 1,
    durationSlots: 2,
    progress: 78,
    status: 'on_track',
    dependencies: ['gt-1'],
  },
  {
    id: 'gt-3',
    title: 'DataTable Inline Edit & Grouping',
    owner: 'Sample Member B',
    startSlot: 2,
    durationSlots: 2,
    progress: 45,
    status: 'at_risk',
    dependencies: ['gt-1'],
  },
  {
    id: 'gt-4',
    title: 'Cross-Viewport Verification Pass',
    owner: 'Sample Member C',
    startSlot: 3,
    durationSlots: 2,
    progress: 15,
    status: 'blocked',
    dependencies: ['gt-2', 'gt-3'],
  },
];

export const WENDORO_DEMO_RESOURCE_PERIODS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

export const WENDORO_DEMO_RESOURCES: ResourceAllocationRow[] = [
  {
    id: 'res-1',
    name: 'Demo User',
    role: 'Principal Systems Architect',
    capacityHours: 40,
    allocations: { 'Week 1': 32, 'Week 2': 36, 'Week 3': 34, 'Week 4': 28 },
  },
  {
    id: 'res-2',
    name: 'Sample Member A',
    role: 'UX Pattern Lead',
    capacityHours: 40,
    allocations: { 'Week 1': 38, 'Week 2': 44, 'Week 3': 42, 'Week 4': 36 },
  },
  {
    id: 'res-3',
    name: 'Sample Member B',
    role: 'Visualization Engineer',
    capacityHours: 35,
    allocations: { 'Week 1': 20, 'Week 2': 28, 'Week 3': 24, 'Week 4': 24 },
  },
];

export const WENDORO_DEMO_APPROVALS: ApprovalRequestItem[] = [
  {
    id: 'apr-1',
    title: 'Approve Brand Theme Contrast Override',
    requester: 'Demo User',
    category: 'Design Governance',
    submittedAt: '12m ago',
    summary: 'Requests high-contrast WCAG validation sign-off for Client Alpha.',
    status: 'pending',
  },
  {
    id: 'apr-2',
    title: 'Publish Multi-Step Onboarding Form 2.0',
    requester: 'Sample Member A',
    category: 'Product Release',
    submittedAt: '1h ago',
    summary: 'Includes repeatable contact rows and client review summary.',
    status: 'approved',
    decisionNote: 'Verified keyboard focus flow.',
  },
];

export const WENDORO_DEMO_COMMENTS: CommentEntry[] = [
  {
    id: 'cmt-1',
    author: 'Demo User',
    role: 'Lead Reviewer',
    timestamp: '10m ago',
    body: 'Confirmed 44px touch targets across BottomNavigation and SwipeActionItem on 375px mobile.',
  },
  {
    id: 'cmt-2',
    author: 'Sample Member A',
    role: 'Accessibility Auditor',
    timestamp: '4m ago',
    body: 'High-contrast dark mode uses #000000 surface and #FACC15 focus rings cleanly.',
  },
];

export const WENDORO_DEMO_WORKFLOW_NODES: WorkflowNodeSpec[] = [
  {
    id: 'wf-1',
    kind: 'trigger',
    title: 'Record Submitted',
    description: 'Fires when a sample intake form passes client validation.',
    enabled: true,
    nextNodeIds: ['wf-2'],
  },
  {
    id: 'wf-2',
    kind: 'condition',
    title: 'Check Risk Tier',
    description: 'Evaluates synthetic threshold score before routing.',
    enabled: true,
    rules: [{ id: 'rl-1', field: 'riskScore', operator: 'greater_than', value: '75' }],
    nextNodeIds: ['wf-3'],
  },
  {
    id: 'wf-3',
    kind: 'approval',
    title: 'Supervisor Sign-Off',
    description: 'Requires manual review by workspace lead.',
    enabled: true,
    nextNodeIds: ['wf-4'],
  },
  {
    id: 'wf-4',
    kind: 'action',
    title: 'Dispatch Webhook Notice',
    description: 'Posts illustrative confirmation event.',
    enabled: true,
    nextNodeIds: [],
  },
];

export const WENDORO_DEMO_GEO_REGIONS: GeoRegionDatum[] = [
  { id: 'reg-na', code: 'NA', name: 'North America (Demo)', category: 'Americas', value: 420, col: 0, row: 0 },
  { id: 'reg-eu', code: 'EU', name: 'Europe West (Demo)', category: 'EMEA', value: 365, col: 1, row: 0 },
  { id: 'reg-ap', code: 'AP', name: 'Asia Pacific (Demo)', category: 'APAC', value: 295, col: 2, row: 0 },
  { id: 'reg-latam', code: 'LA', name: 'Latin America (Demo)', category: 'Americas', value: 185, col: 0, row: 1 },
  { id: 'reg-mea', code: 'ME', name: 'Middle East & Africa (Demo)', category: 'EMEA', value: 145, col: 1, row: 1 },
  { id: 'reg-anz', code: 'AU', name: 'Oceania (Demo)', category: 'APAC', value: 112, col: 2, row: 1 },
];

export const WENDORO_DEMO_ORDERS: CommerceOrderRow[] = [
  { id: 'ord-1', orderNumber: 'WDR-1042', customer: 'Demo Customer A', vendor: 'Vendor Studio', itemsCount: 3, totalLabel: '$420.00', status: 'active', statusLabel: 'Packing' },
  { id: 'ord-2', orderNumber: 'WDR-1043', customer: 'Demo Customer B', vendor: 'Sample Goods', itemsCount: 1, totalLabel: '$129.00', status: 'completed', statusLabel: 'Delivered' },
  { id: 'ord-3', orderNumber: 'WDR-1044', customer: 'Demo Customer C', vendor: 'Apex Supply (Demo)', itemsCount: 5, totalLabel: '$890.00', status: 'pending', statusLabel: 'Awaiting Pickup' },
];

export const WENDORO_DEMO_PRODUCTS: CommerceProductCard[] = [
  { id: 'p1', sku: 'SKU-101', name: 'Modular Desk Kit (Demo)', vendor: 'Vendor Studio', priceLabel: '$240.00', stockCount: 34 },
  { id: 'p2', sku: 'SKU-102', name: 'Label Printer Pro (Demo)', vendor: 'Sample Goods', priceLabel: '$189.00', stockCount: 6, lowStockThreshold: 10 },
  { id: 'p3', sku: 'SKU-103', name: 'Barcode Scanner Mini (Demo)', vendor: 'Apex Supply (Demo)', priceLabel: '$79.00', stockCount: 18 },
];

export const WENDORO_DEMO_FULFILMENT_STAGES: StatusStage[] = [
  { id: 'st-1', label: 'Order Placed (09:00)', state: 'completed' },
  { id: 'st-2', label: 'Quality Check (10:30)', state: 'completed' },
  { id: 'st-3', label: 'In Transit (12:15)', state: 'current' },
  { id: 'st-4', label: 'Delivered', state: 'upcoming' },
];

export const WENDORO_DEMO_SERVICES: ServiceCatalogItem[] = [
  { id: 'srv-1', name: 'Design System Audit (Demo)', durationLabel: '60 mins', rateLabel: '$250', description: 'Token parity and responsive ergonomics check.' },
  { id: 'srv-2', name: 'Enterprise Accessibility Review (Demo)', durationLabel: '90 mins', rateLabel: '$380', description: 'Keyboard matrix and contrast validation.' },
];

export const WENDORO_DEMO_BOOKING_SLOTS: BookingSlot[] = [
  { id: 'slot-1', dateLabel: 'Tue Dec 2', timeLabel: '10:00 AM', specialist: 'Demo User', available: true },
  { id: 'slot-2', dateLabel: 'Wed Dec 3', timeLabel: '02:30 PM', specialist: 'Sample Member A', available: true },
  { id: 'slot-3', dateLabel: 'Thu Dec 4', timeLabel: '04:00 PM', specialist: 'Sample Member B', available: false },
];

export const WENDORO_DEMO_ORG_TREE: TreeNode[] = [
  {
    id: 'org-root',
    label: 'Sample Enterprise Holdings',
    children: [
      {
        id: 'org-eng',
        label: 'Platform & Product Systems',
        children: [
          { id: 'org-ui', label: 'Design Systems Team' },
          { id: 'org-viz', label: 'Visualization Team' },
        ],
      },
      {
        id: 'org-ops',
        label: 'Operations & Compliance',
        children: [{ id: 'org-sec', label: 'Governance & Risk' }],
      },
    ],
  },
];

export const WENDORO_DEMO_ROLES: RolePermissionEntry[] = [
  { id: 'r1', role: 'Global Administrator', scope: 'All Workspaces', membersCount: 3, permissionsSummary: 'Full read/write, policy & billing controls' },
  { id: 'r2', role: 'Workspace Operator', scope: 'Assigned Tenants', membersCount: 14, permissionsSummary: 'Manage workflows, schedules, and approvals' },
  { id: 'r3', role: 'Read-Only Auditor', scope: 'Audit Logs', membersCount: 6, permissionsSummary: 'Inspect reports and export CSV tables' },
];

export const WENDORO_DEMO_LOGISTICS: LogisticsAssetRow[] = [
  { id: 'lg-1', assetCode: 'FLT-204', route: 'Zone North · Hub A', operator: 'Demo Operator 1', etaLabel: '14:20 UTC', status: 'active', statusLabel: 'En Route' },
  { id: 'lg-2', assetCode: 'FLT-309', route: 'Zone West · Port 3', operator: 'Demo Operator 2', etaLabel: '16:45 UTC', status: 'warning', statusLabel: 'Delay Check' },
  { id: 'lg-3', assetCode: 'FLT-118', route: 'Zone Central · Depot', operator: 'Demo Operator 3', etaLabel: 'Arrived', status: 'completed', statusLabel: 'Docked' },
];

export const WENDORO_DEMO_FINANCE: FinanceTransactionRow[] = [
  { id: 'tx-1', reference: 'INV-2026-081', counterparty: 'Sample Supplier Alpha', category: 'Infrastructure', amountLabel: '$1,450.00', reconciled: true, status: 'completed' },
  { id: 'tx-2', reference: 'INV-2026-082', counterparty: 'Sample Agency Partner', category: 'Professional Services', amountLabel: '$3,200.00', reconciled: false, status: 'pending' },
  { id: 'tx-3', reference: 'INV-2026-083', counterparty: 'Demo Logistics Co.', category: 'Fulfilment', amountLabel: '$840.00', reconciled: true, status: 'completed' },
];

export const WENDORO_DEMO_COURSES: CourseModuleItem[] = [
  { id: 'crs-1', title: 'Wendoro Design Tokens & Accessibility', lessonsCount: 8, completionPercent: 85, tier: 'Included' },
  { id: 'crs-2', title: 'Multi-Device Workspace Patterns', lessonsCount: 12, completionPercent: 42, tier: 'Pro Cohort' },
];
