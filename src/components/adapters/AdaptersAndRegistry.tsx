import * as React from 'react';
import {
  Compass,
  Filter,
  Layers,
  MapPin,
  Navigation,
  PenTool,
  Search,
  Truck,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { StatusBadge } from '../business/status-badge';
import { WENDORO_MODULE_CONTRACT_VERSION } from '../business/future-modules/AiRealtimeAndContracts';

/* -------------------------------------------------------------------------- */
/* Layer 5 — Geospatial Adapters & Extension Platform (@wendoro/ui/adapters)  */
/* ZERO chart imports so `.`, `./business`, & `./adapters` stay chart-free.   */
/* -------------------------------------------------------------------------- */

export interface MapMarkerItem {
  id: string;
  label: string;
  lat: number;
  lng: number;
  category?: string;
  status?: 'active' | 'pending' | 'warning' | 'error';
  clusterCount?: number;
}

export interface MapGeofenceZone {
  id: string;
  name: string;
  radiusLabel: string;
  active: boolean;
}

export interface MapRouteLeg {
  id: string;
  origin: string;
  destination: string;
  distanceLabel: string;
  etaLabel: string;
}

export interface MapRendererAdapter {
  name: string;
  renderMap: (props: {
    markers: MapMarkerItem[];
    selectedMarkerId?: string;
    onSelectMarker?: (marker: MapMarkerItem) => void;
    height?: number;
  }) => React.ReactNode;
}

const MapAdapterContext = React.createContext<MapRendererAdapter | null>(null);

export function MapAdapterProvider({
  adapter,
  children,
}: {
  adapter: MapRendererAdapter | null;
  children: React.ReactNode;
}) {
  return <MapAdapterContext.Provider value={adapter}>{children}</MapAdapterContext.Provider>;
}

export function useMapAdapter(): MapRendererAdapter | null {
  return React.useContext(MapAdapterContext);
}

export function MapContainer({
  title = 'Geospatial viewport',
  markers,
  selectedMarkerId,
  onSelectMarker,
  geofences = [],
  height = 280,
  className,
}: {
  title?: string;
  markers: MapMarkerItem[];
  selectedMarkerId?: string;
  onSelectMarker?: (marker: MapMarkerItem) => void;
  geofences?: MapGeofenceZone[];
  height?: number;
  className?: string;
}) {
  const adapter = useMapAdapter();

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Compass className="h-4 w-4 text-primary-active" aria-hidden="true" />
          <span>{title}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {geofences.map((gf) => (
            <Badge key={gf.id} variant={gf.active ? 'primary' : 'outline'} size="sm">
              {gf.name} ({gf.radiusLabel})
            </Badge>
          ))}
          <Badge variant="secondary" size="sm">
            {adapter ? `Adapter: ${adapter.name}` : 'Fallback grid canvas'}
          </Badge>
        </div>
      </div>

      {adapter ? (
        <div>
          {adapter.renderMap({ markers, selectedMarkerId, onSelectMarker, height })}
        </div>
      ) : (
        <div
          role="region"
          aria-label={title}
          className="relative overflow-hidden bg-muted/30 p-4"
          style={{ minHeight: height }}
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {markers.map((mk) => {
              const selected = mk.id === selectedMarkerId;
              return (
                <button
                  key={mk.id}
                  type="button"
                  onClick={() => onSelectMarker?.(mk)}
                  className={cn(
                    'flex items-center justify-between gap-2 rounded-[var(--wdr-radius-md)] border bg-surface p-2.5 text-left text-xs transition-colors',
                    selected ? 'border-foreground ring-2 ring-ring' : 'border-border hover:bg-muted/50'
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary-active" aria-hidden="true" />
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-foreground">{mk.label}</div>
                      <div className="tabular-nums text-[10px] text-muted-foreground">
                        {mk.lat.toFixed(3)}, {mk.lng.toFixed(3)}
                      </div>
                    </div>
                  </div>
                  {mk.clusterCount !== undefined ? (
                    <Badge variant="primary" size="sm">×{mk.clusterCount}</Badge>
                  ) : (
                    mk.status && <StatusBadge status={mk.status} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

export function LocationSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search address, hub, or coordinates…',
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value);
      }}
      className={cn('flex items-center gap-2', className)}
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-9 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface pl-9 pr-3 text-xs text-foreground"
        />
      </div>
      <Button type="submit" size="sm" variant="primary">
        Locate
      </Button>
    </form>
  );
}

export function TerritorySelector({
  territories,
  selectedIds,
  onToggle,
  className,
}: {
  territories: Array<{ id: string; name: string; count?: number }>;
  selectedIds: string[];
  onToggle: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)} role="group" aria-label="Territories">
      {territories.map((t) => {
        const active = selectedIds.includes(t.id);
        return (
          <button
            key={t.id}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(t.id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[var(--wdr-radius-sm)] border px-2.5 py-1 text-xs font-medium',
              active
                ? 'border-foreground bg-primary text-primary-foreground'
                : 'border-border bg-surface text-foreground hover:bg-muted'
            )}
          >
            <span>{t.name}</span>
            {t.count !== undefined && <span className="tabular-nums opacity-80">({t.count})</span>}
          </button>
        );
      })}
    </div>
  );
}

export function GeoFilterBar({
  query,
  onQueryChange,
  onSearch,
  territories,
  selectedTerritories,
  onToggleTerritory,
  className,
}: {
  query: string;
  onQueryChange: (val: string) => void;
  onSearch: (q: string) => void;
  territories: Array<{ id: string; name: string; count?: number }>;
  selectedTerritories: string[];
  onToggleTerritory: (id: string) => void;
  className?: string;
}) {
  return (
    <Card className={cn('p-3.5 space-y-2.5', className)}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Filter className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Geospatial filter</span>
      </div>
      <LocationSearchBar value={query} onChange={onQueryChange} onSearch={onSearch} />
      <TerritorySelector territories={territories} selectedIds={selectedTerritories} onToggle={onToggleTerritory} />
    </Card>
  );
}

export function RouteOverlaySummary({
  routes,
  className,
}: {
  routes: MapRouteLeg[];
  className?: string;
}) {
  return (
    <Card className={cn('p-4 space-y-2', className)}>
      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
        <Navigation className="h-3.5 w-3.5 text-primary-active" aria-hidden="true" />
        <span>Active routes</span>
      </div>
      <ul className="space-y-1.5">
        {routes.map((rt) => (
          <li key={rt.id} className="flex items-center justify-between gap-2 rounded border border-border bg-surface px-2.5 py-2 text-xs">
            <span className="font-medium text-foreground">{rt.origin} → {rt.destination}</span>
            <span className="tabular-nums text-muted-foreground">{rt.distanceLabel} · ETA {rt.etaLabel}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function FleetTrackingWorkspace({
  markers,
  routes,
  geofences,
  className,
}: {
  markers: MapMarkerItem[];
  routes: MapRouteLeg[];
  geofences?: MapGeofenceZone[];
  className?: string;
}) {
  const [selectedId, setSelectedId] = React.useState<string | undefined>(markers[0]?.id);

  return (
    <div className={cn('grid grid-cols-1 gap-4 lg:grid-cols-12', className)}>
      <div className="lg:col-span-8">
        <MapContainer
          title="Fleet & asset tracking"
          markers={markers}
          selectedMarkerId={selectedId}
          onSelectMarker={(m) => setSelectedId(m.id)}
          geofences={geofences}
        />
      </div>
      <div className="space-y-3 lg:col-span-4">
        <Card className="p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Truck className="h-3.5 w-3.5 text-primary-active" aria-hidden="true" />
            <span>Tracked units ({markers.length})</span>
          </div>
          <ul className="space-y-1">
            {markers.map((mk) => (
              <li key={mk.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(mk.id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs',
                    mk.id === selectedId ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted'
                  )}
                >
                  <span className="truncate">{mk.label}</span>
                  <span className="text-[11px] opacity-80">{mk.category ?? 'Asset'}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <RouteOverlaySummary routes={routes} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* External Engine Adapter Contracts & Signature Pad                          */
/* -------------------------------------------------------------------------- */

export interface ExternalEditorAdapter {
  engineName: string;
  renderRichText?: (props: { value: string; onChange: (val: string) => void }) => React.ReactNode;
  renderDiagramCanvas?: (props: { nodes: unknown[]; edges: unknown[] }) => React.ReactNode;
  renderPdfDocument?: (props: { fileName: string; url?: string }) => React.ReactNode;
}

const EditorAdapterContext = React.createContext<ExternalEditorAdapter | null>(null);

export function EditorAdapterProvider({
  adapter,
  children,
}: {
  adapter: ExternalEditorAdapter | null;
  children: React.ReactNode;
}) {
  return <EditorAdapterContext.Provider value={adapter}>{children}</EditorAdapterContext.Provider>;
}

export function SignatureCapturePad({
  signerName = 'Signer',
  onCapture,
  onClear,
  className,
}: {
  signerName?: string;
  onCapture?: (typedOrConfirmed: string) => void;
  onClear?: () => void;
  className?: string;
}) {
  const [typedSignature, setTypedSignature] = React.useState('');
  const [signed, setSigned] = React.useState(false);

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-foreground">
          <PenTool className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Signature capture ({signerName})</span>
        </span>
        {signed && <Badge variant="success" size="sm">Confirmed</Badge>}
      </div>
      <input
        type="text"
        value={typedSignature}
        onChange={(e) => {
          setTypedSignature(e.target.value);
          setSigned(false);
        }}
        placeholder="Type full legal name or attach stylus adapter…"
        aria-label="Signature input"
        className="h-12 w-full rounded-[var(--wdr-radius-md)] border border-dashed border-border bg-muted/20 px-4 font-serif text-lg italic text-foreground"
      />
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setTypedSignature('');
            setSigned(false);
            onClear?.();
          }}
        >
          Clear
        </Button>
        <Button
          size="sm"
          variant="primary"
          disabled={!typedSignature.trim()}
          onClick={() => {
            setSigned(true);
            onCapture?.(typedSignature.trim());
          }}
        >
          Confirm signature
        </Button>
      </div>
    </Card>
  );
}

export function CanvasDiagramAdapterSlot({
  title = 'Diagram engine slot',
  fallbackDescription = 'Attach an external canvas/diagram engine via EditorAdapterProvider.',
  nodesCount = 0,
  className,
}: {
  title?: string;
  fallbackDescription?: string;
  nodesCount?: number;
  className?: string;
}) {
  const adapter = React.useContext(EditorAdapterContext);
  return (
    <Card className={cn('p-4 space-y-2', className)}>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-foreground">
          <Layers className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{title}</span>
        </span>
        <Badge variant="outline" size="sm">
          {adapter ? adapter.engineName : 'Adapter slot'}
        </Badge>
      </div>
      {adapter?.renderDiagramCanvas ? (
        adapter.renderDiagramCanvas({ nodes: [], edges: [] })
      ) : (
        <div className="rounded-[var(--wdr-radius-md)] border border-dashed border-border bg-muted/20 p-5 text-center text-xs text-muted-foreground">
          {fallbackDescription} ({nodesCount} nodes wired)
        </div>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Domain 24 — Developer Extension Registry & Bundle Size Budgets             */
/* -------------------------------------------------------------------------- */

export interface WendoroExtensionEntry {
  id: string;
  name: string;
  subpath: string;
  contractVersion: typeof WENDORO_MODULE_CONTRACT_VERSION;
  category: string;
  maxGzipKb?: number;
}

const extensionRegistry = new Map<string, WendoroExtensionEntry>();

export function registerWendoroExtension(entry: WendoroExtensionEntry): void {
  extensionRegistry.set(entry.id, entry);
}

export function getWendoroExtension(id: string): WendoroExtensionEntry | undefined {
  return extensionRegistry.get(id);
}

export function listWendoroExtensions(): WendoroExtensionEntry[] {
  return Array.from(extensionRegistry.values());
}

export const WENDORO_BUNDLE_BUDGETS = {
  coreMaxGzipKb: 45,
  tokensMaxGzipKb: 6,
  businessMaxGzipKb: 55,
  chartsMaxGzipKb: 25,
  aiMaxGzipKb: 25,
  editorsMaxGzipKb: 25,
  adaptersMaxGzipKb: 18,
} as const;

export const MODULE_CREATION_CHECKLIST = [
  'Purpose and single responsibility documented',
  'Public API & TypeScript interfaces exported without internal leakage',
  'Design tokens & semantic CSS variables inherited (no hardcoded blue/purple/indigo/teal)',
  'Supports Light, Dark, High-Contrast, Reduced Motion, and Compact/Comfortable/Spacious density',
  'Verified across mobile (320px+), tablet (768px+), and desktop (1024px+)',
  'Keyboard navigation, focus-visible rings, and loading/empty/error states implemented',
  'Storybook stories + Vitest unit, accessibility, and URL sanitization tests added',
] as const;
