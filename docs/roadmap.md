# Wendoro UI — Business Component Roadmap

Wendoro UI provides shared primitives and domain-agnostic business patterns across the Wendoro ecosystem without coupling to any single application.

## Phase 1 — Implemented Foundation

| Component | Target Products | Status |
|---|---|---|
| `MetricCard` | Wendoro Insights, Commerce, Platform | Implemented |
| `KpiCard` | Wendoro Insights, People, Flow | Implemented |
| `StatusBadge` | Wendoro Desk, Support, Commerce, Flow | Implemented |
| `UserProfile` | Wendoro People, Desk, Support, Studio | Implemented |
| `ActivityItem` / `ActivityFeed` | Wendoro Desk, Flow, Support | Implemented |
| `DataTable` | All Wendoro ERP, CRM, and Admin products | Implemented |
| `SearchBar` & `FilterBar` | Wendoro Commerce, Support, Insights | Implemented |
| `EmptyState` | All Wendoro applications | Implemented |
| `PageHeader` & `DashboardGrid` | All Wendoro applications | Implemented |
| `CommandPalette` | Wendoro Studio, Flow, Platform | Implemented |
| `NotificationCenter` | Wendoro Desk, Support, People | Implemented |

## Phase 2 — Planned Business Modules

1. **Workflow & Automation (`Wendoro Flow`)**: Approval step timeline, rule condition builder, audit diff viewer.
2. **Service & Operations (`Wendoro Desk`, `Wendoro Support`)**: SLA countdown indicator, ticket thread composer, assignee picker.
3. **Commerce & Ledger (`Wendoro Commerce`)**: Currency input, tax/line-item summary card, settlement ledger table.
4. **Workforce & Org (`Wendoro People`)**: Org unit selector, shift schedule grid, leave balance card.
5. **Analytics (`Wendoro Insights`)**: Sparkline wrapper, cohort matrix, saved view switcher.

## Governance

- Every new business component must remain product-agnostic and rely solely on Wendoro semantic CSS variables.
- Status indicators must pair color with explicit text and/or iconography (WCAG 2.2 AA).
- All tabular data and KPI values must enforce `tabular-nums`.
