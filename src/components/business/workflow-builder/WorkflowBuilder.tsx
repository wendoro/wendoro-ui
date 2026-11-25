import * as React from 'react';
import {
  ArrowDown,
  ArrowUp,
  Bell,
  CheckCircle2,
  Clock,
  GitBranch,
  Play,
  Plus,
  Settings2,
  Trash2,
  Zap,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Switch } from '../../ui/switch';

export type WorkflowNodeKind = 'trigger' | 'condition' | 'action' | 'approval' | 'delay';

export interface AutomationRuleCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string;
}

export interface WorkflowNodeSpec {
  id: string;
  kind: WorkflowNodeKind;
  title: string;
  description?: string;
  enabled: boolean;
  config?: Record<string, string>;
  rules?: AutomationRuleCondition[];
  nextNodeIds?: string[];
}

export interface WorkflowBuilderProps {
  title?: string;
  nodes: WorkflowNodeSpec[];
  onChange: (nodes: WorkflowNodeSpec[]) => void;
  onRunValidation?: (nodes: WorkflowNodeSpec[]) => void;
  className?: string;
}

const KIND_META: Record<
  WorkflowNodeKind,
  { label: string; icon: React.ReactNode; badgeClass: string }
> = {
  trigger: {
    label: 'Trigger',
    icon: <Zap className="h-3.5 w-3.5" aria-hidden="true" />,
    badgeClass: 'bg-primary text-primary-foreground',
  },
  condition: {
    label: 'Condition',
    icon: <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />,
    badgeClass: 'bg-warning-subtle text-warning-subtle-foreground',
  },
  action: {
    label: 'Action',
    icon: <Bell className="h-3.5 w-3.5" aria-hidden="true" />,
    badgeClass: 'bg-success-subtle text-success-subtle-foreground',
  },
  approval: {
    label: 'Approval',
    icon: <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />,
    badgeClass: 'bg-accent text-accent-foreground',
  },
  delay: {
    label: 'Delay',
    icon: <Clock className="h-3.5 w-3.5" aria-hidden="true" />,
    badgeClass: 'bg-muted text-foreground',
  },
};

export function WorkflowBuilder({
  title = 'Interactive Workflow & Automation Builder',
  nodes,
  onChange,
  onRunValidation,
  className,
}: WorkflowBuilderProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(nodes[0]?.id ?? null);
  const [validationMessage, setValidationMessage] = React.useState<string | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? nodes[0] ?? null;

  const updateNode = (id: string, patch: Partial<WorkflowNodeSpec>) => {
    onChange(nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  };

  const addNode = (kind: WorkflowNodeKind) => {
    const newId = `node-${Date.now().toString(36)}-${nodes.length + 1}`;
    const newNode: WorkflowNodeSpec = {
      id: newId,
      kind,
      title: `New ${KIND_META[kind].label}`,
      description: `Configured ${kind} step`,
      enabled: true,
      rules:
        kind === 'condition'
          ? [{ id: `rule-${nodes.length + 1}`, field: 'status', operator: 'equals', value: 'pending' }]
          : [],
      nextNodeIds: [],
    };

    const nextNodes = [...nodes];
    if (nextNodes.length > 0) {
      const last = nextNodes[nextNodes.length - 1];
      nextNodes[nextNodes.length - 1] = {
        ...last,
        nextNodeIds: Array.from(new Set([...(last.nextNodeIds ?? []), newId])),
      };
    }
    nextNodes.push(newNode);
    onChange(nextNodes);
    setSelectedId(newId);
  };

  const moveNode = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= nodes.length) return;
    const copy = [...nodes];
    const [item] = copy.splice(idx, 1);
    copy.splice(target, 0, item);
    onChange(copy);
  };

  const deleteNode = (id: string) => {
    const filtered = nodes
      .filter((n) => n.id !== id)
      .map((n) => ({
        ...n,
        nextNodeIds: (n.nextNodeIds ?? []).filter((nid) => nid !== id),
      }));
    onChange(filtered);
    if (selectedId === id) {
      setSelectedId(filtered[0]?.id ?? null);
    }
  };

  const validateFlow = () => {
    if (nodes.length === 0) {
      setValidationMessage('Add at least one trigger node to build a workflow.');
      return;
    }
    const hasTrigger = nodes.some((n) => n.kind === 'trigger' && n.enabled);
    if (!hasTrigger) {
      setValidationMessage('At least one enabled Trigger node is required.');
      return;
    }
    setValidationMessage(`Flow validated: ${nodes.filter((n) => n.enabled).length} active steps connected.`);
    onRunValidation?.(nodes);
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-3.5">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">
            Add steps, wire connections, and edit automation conditions in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(KIND_META) as WorkflowNodeKind[]).map((kind) => (
            <Button
              key={kind}
              type="button"
              size="sm"
              variant="outline"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => addNode(kind)}
            >
              {KIND_META[kind].label}
            </Button>
          ))}
          <Button
            type="button"
            size="sm"
            variant="primary"
            leftIcon={<Play className="h-3.5 w-3.5" />}
            onClick={validateFlow}
          >
            Validate flow
          </Button>
        </div>
      </div>

      {validationMessage && (
        <div
          role="status"
          className="border-b border-border bg-primary-subtle px-5 py-2 text-xs font-medium text-primary-subtle-foreground"
        >
          {validationMessage}
        </div>
      )}

      {/* Main Split Workspace: Flow Canvas + Step Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Visual Flow Canvas */}
        <div
          aria-label="Visual workflow canvas"
          className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-border bg-background/60 p-5 space-y-3"
        >
          {nodes.length === 0 ? (
            <div className="rounded-[var(--wdr-radius-lg)] border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
              Use the palette buttons above to add your first Trigger or Action step.
            </div>
          ) : (
            <ol className="space-y-2">
              {nodes.map((node, idx) => {
                const meta = KIND_META[node.kind];
                const isSelected = selectedNode?.id === node.id;
                const connections = (node.nextNodeIds ?? [])
                  .map((nid) => nodes.find((cand) => cand.id === nid)?.title)
                  .filter(Boolean);

                return (
                  <li key={node.id} className="space-y-2">
                    <div
                      className={cn(
                        'rounded-[var(--wdr-radius-lg)] border bg-surface p-3.5 transition-shadow',
                        isSelected
                          ? 'border-foreground ring-2 ring-ring/20 shadow-[var(--wdr-shadow-md)]'
                          : 'border-border shadow-[var(--wdr-shadow-sm)]',
                        !node.enabled && 'opacity-55'
                      )}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedId(node.id)}
                          className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-[var(--wdr-radius-sm)] px-2 py-0.5 text-[11px] font-semibold',
                                meta.badgeClass
                              )}
                            >
                              {meta.icon}
                              <span>{meta.label}</span>
                            </span>
                            <span className="text-sm font-semibold text-foreground">{node.title}</span>
                          </div>
                          {node.description && (
                            <p className="mt-1 text-xs text-muted-foreground">{node.description}</p>
                          )}
                          {node.rules && node.rules.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {node.rules.map((r) => (
                                <span
                                  key={r.id}
                                  className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground"
                                >
                                  {r.field} {r.operator} &quot;{r.value}&quot;
                                </span>
                              ))}
                            </div>
                          )}
                        </button>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            aria-label={`Move ${node.title} up`}
                            onClick={() => moveNode(idx, -1)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-40"
                          >
                            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === nodes.length - 1}
                            aria-label={`Move ${node.title} down`}
                            onClick={() => moveNode(idx, 1)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-40"
                          >
                            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${node.title}`}
                            onClick={() => deleteNode(node.id)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Visual SVG Connector between steps */}
                    {(idx < nodes.length - 1 || connections.length > 0) && (
                      <div className="flex items-center justify-center gap-2 py-0.5" aria-hidden="true">
                        <svg width="24" height="22" viewBox="0 0 24 22" className="text-border">
                          <path
                            d="M12 0 L12 18 M7 13 L12 19 L17 13"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {connections.length > 0 && (
                          <span className="text-[10px] font-medium text-muted-foreground">
                            → {connections.join(', ')}
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* Step Configuration & Automation Rule Editor Panel */}
        <div className="lg:col-span-5 p-5 space-y-4 bg-surface">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Settings2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <h4 className="text-sm font-semibold text-foreground">Step configuration</h4>
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-foreground">Step enabled</span>
                <Switch
                  aria-label="Enable workflow step"
                  checked={selectedNode.enabled}
                  onCheckedChange={(checked) => updateNode(selectedNode.id, { enabled: checked })}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="wdr-wf-title" className="block text-xs font-medium text-foreground">
                  Step title
                </label>
                <input
                  id="wdr-wf-title"
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => updateNode(selectedNode.id, { title: e.target.value })}
                  className="h-9 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="wdr-wf-desc" className="block text-xs font-medium text-foreground">
                  Description
                </label>
                <textarea
                  id="wdr-wf-desc"
                  rows={2}
                  value={selectedNode.description ?? ''}
                  onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
                  className="w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface p-2.5 text-xs text-foreground"
                />
              </div>

              {/* Next Node Connections */}
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-foreground">Outgoing connections</div>
                <div className="flex flex-wrap gap-1.5">
                  {nodes
                    .filter((cand) => cand.id !== selectedNode.id)
                    .map((cand) => {
                      const connected = (selectedNode.nextNodeIds ?? []).includes(cand.id);
                      return (
                        <button
                          key={cand.id}
                          type="button"
                          aria-pressed={connected}
                          onClick={() => {
                            const prev = selectedNode.nextNodeIds ?? [];
                            const next = connected
                              ? prev.filter((id) => id !== cand.id)
                              : [...prev, cand.id];
                            updateNode(selectedNode.id, { nextNodeIds: next });
                          }}
                          className={cn(
                            'rounded-[var(--wdr-radius-sm)] border px-2 py-1 text-[11px] font-medium transition-colors',
                            connected
                              ? 'border-foreground bg-primary text-primary-foreground'
                              : 'border-border bg-muted text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {connected ? '✓ ' : '+ '}
                          {cand.title}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Automation Rule Editor */}
              <div className="space-y-2 border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Automation rules</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    leftIcon={<Plus className="h-3 w-3" />}
                    onClick={() =>
                      updateNode(selectedNode.id, {
                        rules: [
                          ...(selectedNode.rules ?? []),
                          {
                            id: `r-${Date.now().toString(36)}`,
                            field: 'priority',
                            operator: 'equals',
                            value: 'high',
                          },
                        ],
                      })
                    }
                  >
                    Add rule
                  </Button>
                </div>

                {(selectedNode.rules ?? []).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No filter rules attached to this step.</p>
                ) : (
                  <div className="space-y-2">
                    {(selectedNode.rules ?? []).map((rule) => (
                      <div key={rule.id} className="grid grid-cols-12 gap-1.5 items-center">
                        <input
                          type="text"
                          aria-label="Rule field"
                          value={rule.field}
                          onChange={(e) =>
                            updateNode(selectedNode.id, {
                              rules: (selectedNode.rules ?? []).map((r) =>
                                r.id === rule.id ? { ...r, field: e.target.value } : r
                              ),
                            })
                          }
                          className="col-span-4 h-8 rounded border border-input bg-surface px-2 text-xs text-foreground"
                        />
                        <select
                          aria-label="Rule operator"
                          value={rule.operator}
                          onChange={(e) =>
                            updateNode(selectedNode.id, {
                              rules: (selectedNode.rules ?? []).map((r) =>
                                r.id === rule.id
                                  ? { ...r, operator: e.target.value as AutomationRuleCondition['operator'] }
                                  : r
                              ),
                            })
                          }
                          className="col-span-3 h-8 rounded border border-input bg-surface px-1 text-xs text-foreground"
                        >
                          <option value="equals">=</option>
                          <option value="not_equals">!=</option>
                          <option value="contains">contains</option>
                          <option value="greater_than">&gt;</option>
                          <option value="less_than">&lt;</option>
                        </select>
                        <input
                          type="text"
                          aria-label="Rule value"
                          value={rule.value}
                          onChange={(e) =>
                            updateNode(selectedNode.id, {
                              rules: (selectedNode.rules ?? []).map((r) =>
                                r.id === rule.id ? { ...r, value: e.target.value } : r
                              ),
                            })
                          }
                          className="col-span-4 h-8 rounded border border-input bg-surface px-2 text-xs text-foreground"
                        />
                        <button
                          type="button"
                          aria-label="Remove rule"
                          onClick={() =>
                            updateNode(selectedNode.id, {
                              rules: (selectedNode.rules ?? []).filter((r) => r.id !== rule.id),
                            })
                          }
                          className="col-span-1 inline-flex h-8 items-center justify-center rounded text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Select a step on the canvas to configure it.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
