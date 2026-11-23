import * as React from 'react';
import { LayoutGrid, List, Users } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { EmptyState } from '../../ui/empty-state';
import { FilterBar, type FilterGroup } from '../filter-bar';
import { type BusinessStatus } from '../status-badge';
import { UserProfile } from '../user-profile';
import { type DropdownMenuItem } from '../../ui/dropdown';

export interface TeamMember {
  id: string;
  name: string;
  affiliation?: string;
  role?: string;
  department?: string;
  email?: string;
  avatarSrc?: string;
  status?: BusinessStatus;
  statusLabel?: string;
  actions?: DropdownMenuItem[];
  contactHref?: string;
}

export type TeamDirectoryViewMode = 'grid' | 'list';

export interface TeamDirectoryProps extends React.HTMLAttributes<HTMLDivElement> {
  members: TeamMember[];
  defaultView?: TeamDirectoryViewMode;
  view?: TeamDirectoryViewMode;
  onViewChange?: (view: TeamDirectoryViewMode) => void;
  searchable?: boolean;
  filterable?: boolean;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  demoNotice?: string;
  onContactMember?: (member: TeamMember) => void;
}

export function TeamDirectory({
  members,
  defaultView = 'grid',
  view: controlledView,
  onViewChange,
  searchable = true,
  filterable = true,
  searchPlaceholder = 'Search team members…',
  emptyTitle = 'No matching team members',
  emptyDescription = 'Try clearing your search or status filter.',
  demoNotice,
  onContactMember,
  className,
  ...props
}: TeamDirectoryProps) {
  const [search, setSearch] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [internalView, setInternalView] = React.useState<TeamDirectoryViewMode>(defaultView);

  const activeView = controlledView ?? internalView;
  const setView = (next: TeamDirectoryViewMode) => {
    if (controlledView === undefined) {
      setInternalView(next);
    }
    onViewChange?.(next);
  };

  const departments = React.useMemo(() => {
    const set = new Set<string>();
    for (const m of members) {
      if (m.department) set.add(m.department);
    }
    return Array.from(set);
  }, [members]);

  const statuses = React.useMemo(() => {
    const set = new Set<BusinessStatus>();
    for (const m of members) {
      if (m.status) set.add(m.status);
    }
    return Array.from(set);
  }, [members]);

  const filteredMembers = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      const matchesSearch =
        !q ||
        [m.name, m.affiliation, m.role, m.department, m.email, m.statusLabel]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q);
      const matchesDepartment =
        departmentFilter === 'all' || m.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [departmentFilter, members, search, statusFilter]);

  const filterGroups: FilterGroup[] = [];
  if (filterable && departments.length > 0) {
    filterGroups.push({
      id: 'department',
      label: 'Department',
      value: departmentFilter,
      onChange: setDepartmentFilter,
      options: [
        { value: 'all', label: 'All departments' },
        ...departments.map((d) => ({ value: d, label: d })),
      ],
    });
  }
  if (filterable && statuses.length > 0) {
    filterGroups.push({
      id: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'all', label: 'All statuses' },
        ...statuses.map((s) => ({
          value: s,
          label: s.charAt(0).toUpperCase() + s.slice(1),
        })),
      ],
    });
  }

  const activeFilterCount =
    (search ? 1 : 0) +
    (departmentFilter !== 'all' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setSearch('');
    setDepartmentFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {demoNotice && (
        <p className="rounded-[var(--wdr-radius-md)] border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
          {demoNotice}
        </p>
      )}

      <FilterBar
        searchValue={searchable ? search : undefined}
        onSearchChange={searchable ? setSearch : undefined}
        searchPlaceholder={searchPlaceholder}
        filters={filterGroups}
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
        actions={
          <div
            role="group"
            aria-label="Directory layout"
            className="inline-flex items-center gap-0.5 rounded-[var(--wdr-radius-md)] border border-border bg-muted p-0.5"
          >
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={activeView === 'grid'}
              onClick={() => setView('grid')}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-[var(--wdr-radius-small,4px)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                activeView === 'grid'
                  ? 'bg-surface text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={activeView === 'list'}
              onClick={() => setView('list')}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-[var(--wdr-radius-small,4px)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                activeView === 'list'
                  ? 'bg-surface text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        }
      />

      {filteredMembers.length === 0 ? (
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title={emptyTitle}
          description={emptyDescription}
          action={
            activeFilterCount > 0 ? (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
            ) : undefined
          }
        />
      ) : activeView === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredMembers.map((member) => (
            <UserProfile
              key={member.id}
              variant="card"
              name={member.name}
              affiliation={member.affiliation}
              role={member.role}
              department={member.department}
              email={member.email}
              avatarSrc={member.avatarSrc}
              statusBadge={member.status}
              statusLabel={member.statusLabel}
              actions={member.actions}
              contactHref={member.contactHref}
              onContact={onContactMember && member.email ? () => onContactMember(member) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-border rounded-[var(--wdr-radius-lg)] border border-border bg-surface">
          {filteredMembers.map((member) => (
            <div key={member.id} className="p-4">
              <UserProfile
                variant="inline"
                name={member.name}
                affiliation={member.affiliation}
                role={member.role}
                department={member.department}
                email={member.email}
                avatarSrc={member.avatarSrc}
                statusBadge={member.status}
                statusLabel={member.statusLabel}
                actions={member.actions}
                contactHref={member.contactHref}
                onContact={onContactMember && member.email ? () => onContactMember(member) : undefined}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
